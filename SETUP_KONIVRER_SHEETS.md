# Setting Up Your Konivrer Google Sheets Integration

## 🎯 Overview

Your Konivrer deck database is now configured to use this specific Google Sheets document:
**https://docs.google.com/spreadsheets/d/11VbalAjhkfa1WRT_yfYOjvKdsnEp16fj7AVf_he-eTg/edit**

The system has been customized to parse the unique structure of your spreadsheet and convert it into the card format used by your website.

## 📊 Current Spreadsheet Structure

Your spreadsheet contains these columns:
- **name**: Card name
- **quantity**: Number of copies
- **Cost_1 to Cost_6**: Element symbols for the card
- **Type**: Card type (ELEMENTAL, FLAG, etc.)
- **Flavor_Text**: Card description/lore
- **Familiar_Text**: Keywords and abilities
- **Set_Symbol**: Set identifier
- **Art**: Art symbol
- **Collector_Number**: Card number in set

## 🔧 How the Integration Works

The system automatically:
1. **Extracts Elements**: Combines Cost_1 through Cost_6 columns into an elements array
2. **Calculates Cost**: Uses the number of elements as the mana cost
3. **Parses Keywords**: Splits Familiar_Text by commas to create keywords array
4. **Determines Rarity**: Based on cost and complexity (common/uncommon/rare/legendary)
5. **Generates IDs**: Creates unique identifiers from card names and collector numbers
6. **Sets Power**: Calculates power based on cost (cost - 1, minimum 1)

## 🚀 Quick Setup Steps

### 1. Set Up Google Cloud Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Create a service account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Name it: `konivrer-sheets-reader`
   - Download the JSON key file

### 2. Share the Spreadsheet

1. Open your spreadsheet: https://docs.google.com/spreadsheets/d/11VbalAjhkfa1WRT_yfYOjvKdsnEp16fj7AVf_he-eTg/edit
2. Click "Share" button
3. Add the service account email (from the JSON file: `client_email`)
4. Give it "Viewer" permissions (read-only is sufficient)
5. Click "Share"

### 3. Configure Environment Variables

Add these to your `Backend/.env` file:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_ID=11VbalAjhkfa1WRT_yfYOjvKdsnEp16fj7AVf_he-eTg

# Service Account Credentials (paste the entire JSON content)
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project",...}
```

### 4. Test the Connection

1. Start your backend: `cd Backend && npm start`
2. Test the API: `curl http://localhost:5000/api/cards/test-connection`
3. If successful, sync cards: `curl -X POST http://localhost:5000/api/cards/sync`

## 🎮 Using the Integration

### Admin Panel
Visit `/admin` in your application to:
- Test the Google Sheets connection
- Manually sync cards
- View sync history and status
- Monitor cache performance

### Card Database
Visit `/cards` to:
- View all cards from your spreadsheet
- Use the sync button to update cards
- See connection status

## 📋 Sample Card Conversion

Here's how your spreadsheet data gets converted:

**Spreadsheet Row:**
```
name: ABISS
Cost_1: ⚡︎⃝
Cost_2: ◢
Cost_3: 🜄
Type: ELEMENTAL
Flavor_Text: Truth shines brilliantly through all veils...
Familiar_Text: VOID, SUBMERGED
Collector_Number: 1/63
```

**Converted Card:**
```json
{
  "id": "abiss_1",
  "name": "ABISS",
  "elements": ["⚡︎⃝", "◢", "🜄"],
  "keywords": ["VOID", "SUBMERGED"],
  "cost": 3,
  "power": 2,
  "rarity": "rare",
  "text": "Truth shines brilliantly through all veils...",
  "type": "ELEMENTAL",
  "quantity": 1,
  "collectorNumber": "1/63"
}
```

## 🔍 Troubleshooting

### Common Issues

1. **"No sheets found"**
   - Make sure the spreadsheet ID is correct
   - Check that the service account has access

2. **"Authentication failed"**
   - Verify the service account JSON is complete and valid
   - Ensure the Google Sheets API is enabled

3. **"No cards found"**
   - Check that your spreadsheet has data rows
   - Verify the column names match expected format

### Debug Information

The system logs detailed information about:
- Number of rows processed
- Cards successfully parsed
- Rows skipped (like FLAG entries)
- Parsing errors for specific rows

### Testing Without Credentials

The system gracefully falls back to sample data if Google Sheets isn't configured, so you can test the frontend functionality immediately.

## 🎨 Customizing the Parser

If you need to modify how the spreadsheet data is parsed, edit:
`Backend/services/konivrerSheetsService.js`

Key methods:
- `parseRowToCard()`: Converts spreadsheet rows to card objects
- `determineRarity()`: Logic for assigning card rarities
- `generateCardId()`: Creates unique card identifiers

## 📈 Performance Notes

- **Caching**: Cards are cached for 5 minutes to reduce API calls
- **Fallback**: System uses cached data if Google Sheets is temporarily unavailable
- **Efficiency**: Only processes rows with valid card names (skips FLAG entries)

## 🔒 Security

- Service account has read-only access to your spreadsheet
- Credentials are stored as environment variables (never in code)
- No sensitive data is exposed to the frontend
- All API calls are server-side only

## 🎉 Next Steps

1. **Set up your Google Cloud service account** (5 minutes)
2. **Share the spreadsheet** with the service account (1 minute)
3. **Add credentials** to your .env file (2 minutes)
4. **Test the integration** using the admin panel (1 minute)
5. **Start managing cards** through your spreadsheet! 🎮

Your card database will now automatically stay in sync with your Google Sheets document. Any changes you make to the spreadsheet can be pulled into your website with a single click of the sync button!

## 📞 Support

If you encounter any issues:
1. Check the Admin Panel for detailed error messages
2. Review the backend logs for parsing information
3. Verify your spreadsheet structure matches the expected format
4. Test the connection using the built-in test function