const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

class KonivrerSheetsService {
  constructor() {
    this.doc = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
      if (!spreadsheetId) {
        throw new Error('GOOGLE_SHEETS_ID environment variable is required');
      }

      // Initialize the sheet
      this.doc = new GoogleSpreadsheet(spreadsheetId);

      // Authenticate using service account
      await this.authenticate();

      // Load document info
      await this.doc.loadInfo();
      
      this.isInitialized = true;
      console.log('✅ Konivrer Sheets service initialized successfully');
      console.log(`📊 Connected to: ${this.doc.title}`);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Konivrer Sheets service:', error.message);
      this.isInitialized = false;
      return false;
    }
  }

  async authenticate() {
    // Try to get credentials from environment
    let credentials;

    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      // Option 1: Complete JSON key
      try {
        credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      } catch (error) {
        throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_KEY JSON format');
      }
    } else if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      // Option 2: Individual environment variables
      credentials = {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.GOOGLE_CLIENT_EMAIL)}`
      };
    } else {
      throw new Error('Google Sheets credentials not found. Please set GOOGLE_SERVICE_ACCOUNT_KEY or individual credential environment variables.');
    }

    const serviceAccountAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    this.doc.useServiceAccountAuth(serviceAccountAuth);
  }

  async testConnection() {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          return { connected: false, error: 'Failed to initialize connection' };
        }
      }

      // Try to access the first sheet
      const sheet = this.doc.sheetsByIndex[0];
      if (!sheet) {
        return { connected: false, error: 'No sheets found in the document' };
      }

      return { 
        connected: true, 
        message: `Successfully connected to "${this.doc.title}" with ${this.doc.sheetCount} sheet(s)`,
        sheetCount: this.doc.sheetCount,
        title: this.doc.title
      };
    } catch (error) {
      console.error('Connection test failed:', error);
      return { connected: false, error: error.message };
    }
  }

  async getCards() {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('Failed to initialize Google Sheets connection');
        }
      }

      // Get the first sheet (assuming it contains the card data)
      const sheet = this.doc.sheetsByIndex[0];
      if (!sheet) {
        throw new Error('No sheets found in the document');
      }

      // Load all rows
      await sheet.loadCells();
      const rows = await sheet.getRows();

      if (!rows || rows.length === 0) {
        console.log('No data rows found in the sheet');
        return [];
      }

      console.log(`📊 Processing ${rows.length} rows from "${sheet.title}"`);

      // Convert rows to card objects
      const cards = [];
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        try {
          const card = this.parseRowToCard(row, i + 2); // +2 because row 1 is headers, and we're 0-indexed
          if (card) {
            cards.push(card);
          }
        } catch (error) {
          console.warn(`⚠️ Failed to parse row ${i + 2}:`, error.message);
          // Continue processing other rows
        }
      }

      console.log(`✅ Successfully parsed ${cards.length} cards`);
      return cards;

    } catch (error) {
      console.error('❌ Failed to fetch cards from Google Sheets:', error);
      throw error;
    }
  }

  parseRowToCard(row, rowNumber) {
    // Extract data from the row based on the Konivrer spreadsheet structure
    const name = this.getRowValue(row, 'name');
    
    // Skip rows without names or with special entries
    if (!name || name.includes('ΦLAG') || name.includes('FLAG')) {
      return null;
    }

    // Extract elements from Cost columns (Cost_1 through Cost_6)
    const elements = [];
    for (let i = 1; i <= 6; i++) {
      const costCol = `Cost_${i}`;
      const element = this.getRowValue(row, costCol);
      if (element && element.trim() && !elements.includes(element.trim())) {
        elements.push(element.trim());
      }
    }

    // Extract other fields
    const type = this.getRowValue(row, 'Type') || 'ELEMENTAL';
    const flavorText = this.getRowValue(row, 'Flavor_Text') || '';
    const familiarText = this.getRowValue(row, 'Familiar_Text') || '';
    const collectorNumber = this.getRowValue(row, 'Collector_Number') || '';
    const quantity = this.getRowValue(row, 'quantity') || '1';

    // Parse keywords from Familiar_Text
    const keywords = familiarText
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    // Calculate cost (number of elements)
    const cost = elements.length;

    // Generate a unique ID
    const id = this.generateCardId(name, collectorNumber);

    // Determine rarity based on cost or other factors
    const rarity = this.determineRarity(cost, elements, keywords);

    // Use flavor text as the main card text
    const text = flavorText;

    // For power, we'll use a default based on cost since it's not in the spreadsheet
    const power = Math.max(1, cost - 1);

    return {
      id,
      name,
      elements,
      keywords,
      cost,
      power,
      rarity,
      text,
      type,
      quantity: parseInt(quantity) || 1,
      collectorNumber
    };
  }

  getRowValue(row, columnName) {
    try {
      return row.get(columnName) || '';
    } catch (error) {
      // If column doesn't exist, return empty string
      return '';
    }
  }

  generateCardId(name, collectorNumber) {
    // Create a unique ID from the name and collector number
    const baseName = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);
    
    if (collectorNumber) {
      const number = collectorNumber.split('/')[0]; // Get just the number part
      return `${baseName}_${number}`;
    }
    
    return baseName;
  }

  determineRarity(cost, elements, keywords) {
    // Determine rarity based on complexity
    if (cost >= 5 || elements.length >= 4) {
      return 'legendary';
    } else if (cost >= 3 || elements.length >= 3 || keywords.length >= 3) {
      return 'rare';
    } else if (cost >= 2 || elements.length >= 2 || keywords.length >= 2) {
      return 'uncommon';
    } else {
      return 'common';
    }
  }
}

module.exports = new KonivrerSheetsService();