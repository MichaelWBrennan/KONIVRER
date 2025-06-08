const { google } = require('googleapis');
require('dotenv').config();

class GoogleSheetsService {
  constructor() {
    this.auth = null;
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    this.initialize();
  }

  async initialize() {
    try {
      // Initialize Google Auth
      this.auth = new google.auth.GoogleAuth({
        credentials: this.getCredentials(),
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });

      // Initialize Sheets API
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      console.log('✅ Google Sheets service initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Google Sheets service:', error.message);
    }
  }

  getCredentials() {
    // Support both service account key file and environment variables
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      try {
        return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      } catch (error) {
        console.error('Error parsing GOOGLE_SERVICE_ACCOUNT_KEY:', error.message);
      }
    }

    // Fallback to individual environment variables
    return {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`,
    };
  }

  async getCardsFromSheet(range = 'Cards!A:J') {
    try {
      if (!this.sheets || !this.spreadsheetId) {
        throw new Error('Google Sheets service not properly initialized or spreadsheet ID missing');
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range,
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        console.log('No data found in the spreadsheet');
        return [];
      }

      // Assume first row contains headers
      const headers = rows[0];
      const cards = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length === 0) continue; // Skip empty rows

        const card = this.parseCardRow(headers, row);
        if (card) {
          cards.push(card);
        }
      }

      console.log(`✅ Successfully fetched ${cards.length} cards from Google Sheets`);
      return cards;
    } catch (error) {
      console.error('❌ Error fetching cards from Google Sheets:', error.message);
      throw error;
    }
  }

  parseCardRow(headers, row) {
    try {
      const card = {};
      
      // Map each column to the corresponding field
      headers.forEach((header, index) => {
        const value = row[index] || '';
        const normalizedHeader = header.toLowerCase().trim();
        
        switch (normalizedHeader) {
          case 'id':
            card.id = value;
            break;
          case 'name':
            card.name = value;
            break;
          case 'elements':
            // Parse elements - could be comma-separated or individual symbols
            card.elements = this.parseArrayField(value);
            break;
          case 'keywords':
            // Parse keywords - comma-separated
            card.keywords = this.parseArrayField(value);
            break;
          case 'cost':
            card.cost = parseInt(value) || 0;
            break;
          case 'power':
            card.power = parseInt(value) || 0;
            break;
          case 'rarity':
            card.rarity = value.toLowerCase();
            break;
          case 'text':
          case 'description':
            card.text = value;
            break;
          case 'image':
          case 'image_url':
            card.image = value;
            break;
          case 'type':
            card.type = value;
            break;
          default:
            // Store any additional fields
            card[normalizedHeader] = value;
        }
      });

      // Validate required fields
      if (!card.id || !card.name) {
        console.warn(`Skipping card with missing required fields:`, card);
        return null;
      }

      return card;
    } catch (error) {
      console.error('Error parsing card row:', error.message, row);
      return null;
    }
  }

  parseArrayField(value) {
    if (!value) return [];
    
    // Split by comma and clean up each item
    return value.split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  async testConnection() {
    try {
      if (!this.spreadsheetId) {
        throw new Error('GOOGLE_SHEETS_ID environment variable not set');
      }

      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      console.log('✅ Successfully connected to Google Sheets');
      console.log(`📊 Spreadsheet title: ${response.data.properties.title}`);
      return true;
    } catch (error) {
      console.error('❌ Google Sheets connection test failed:', error.message);
      return false;
    }
  }
}

module.exports = new GoogleSheetsService();