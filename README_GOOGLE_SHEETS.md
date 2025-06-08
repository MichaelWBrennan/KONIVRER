# Google Sheets Integration for KONIVRER Deck Database

## 🎯 Overview

This integration allows you to manage your card database using Google Sheets, making it easy to update cards without touching code. Simply edit your spreadsheet, and the changes will be reflected on your website.

## ✨ Features

- **Easy Card Management**: Update cards by editing a Google Sheets spreadsheet
- **Real-time Sync**: Manual sync button to pull latest changes from Google Sheets
- **Automatic Caching**: 5-minute cache to improve performance and reduce API calls
- **Fallback Support**: System continues working even if Google Sheets is unavailable
- **Admin Panel**: Built-in interface to manage the integration
- **Connection Testing**: Test your Google Sheets connection anytime

## 🚀 Quick Start

### 1. Set Up Your Spreadsheet

1. Create a new Google Sheets document
2. Name the first sheet "Cards"
3. Add these column headers in the first row:
   ```
   ID | Name | Elements | Keywords | Cost | Power | Rarity | Text
   ```
4. Add your card data in the following rows

### 2. Configure Google Cloud

1. Create a Google Cloud Project
2. Enable the Google Sheets API
3. Create a service account
4. Download the service account key (JSON file)
5. Share your spreadsheet with the service account email

### 3. Configure Your Application

Add these environment variables to your backend `.env` file:

```env
GOOGLE_SHEETS_ID=your-spreadsheet-id-here
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### 4. Test the Integration

1. Start your backend server
2. Go to `/admin` in your application
3. Click "Test Connection"
4. Click "Sync from Google Sheets"

## 📊 Spreadsheet Format

Your Google Sheets document should have a sheet named "Cards" with these columns:

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| ID | Text | Unique identifier | card001 |
| Name | Text | Card name | Gustling Wisp |
| Elements | Text | Comma-separated elements | 🜁,🜃 |
| Keywords | Text | Comma-separated keywords | Gust,Flying |
| Cost | Number | Mana/energy cost | 3 |
| Power | Number | Card power/strength | 2 |
| Rarity | Text | Card rarity | common |
| Text | Text | Card description | When this enters, Gust a target card. |

### Sample Data

You can use the provided `sample-cards-template.csv` file as a starting point. Import it into your Google Sheets to get started quickly.

## 🔧 API Endpoints

The integration adds these new API endpoints:

### GET /api/cards
Returns all cards with automatic caching.

**Response:**
```json
[
  {
    "id": "card001",
    "name": "Gustling Wisp",
    "elements": ["🜁"],
    "keywords": ["Gust"],
    "cost": 1,
    "power": 1,
    "rarity": "common",
    "text": "When this enters, Gust a target card."
  }
]
```

### POST /api/cards/sync
Manually sync cards from Google Sheets.

**Response:**
```json
{
  "success": true,
  "message": "Successfully synced 10 cards from Google Sheets",
  "cards": [...]
}
```

### GET /api/cards/test-connection
Test the connection to Google Sheets.

**Response:**
```json
{
  "connected": true,
  "message": "Successfully connected to Google Sheets"
}
```

## 🎮 Frontend Integration

The frontend automatically uses the new API endpoints. Key features:

### Card Database Page
- **Sync Button**: Manually sync from Google Sheets
- **Connection Status**: Shows if Google Sheets is connected
- **Loading States**: Visual feedback during sync operations
- **Error Handling**: Graceful fallback when sync fails

### Admin Panel
- **Connection Testing**: Test Google Sheets connectivity
- **Sync Management**: Manual sync with detailed feedback
- **Cache Management**: View and clear cache status
- **Activity Log**: See recent sync operations and their results

## 🔒 Security

- Service account credentials are stored as environment variables
- No sensitive data is exposed to the frontend
- Spreadsheet access is limited to the service account
- All API calls are authenticated and rate-limited

## 📈 Performance

- **Caching**: Data is cached for 5 minutes to reduce API calls
- **Fallback**: System uses cached data if Google Sheets is unavailable
- **Lazy Loading**: Data is only fetched when needed
- **Error Recovery**: Automatic retry mechanisms for failed requests

## 🛠️ Development

### File Structure

```
Backend/
├── services/
│   └── googleSheetsService.js    # Google Sheets integration
├── controllers/
│   └── cardController.js         # Updated with Google Sheets support
└── routes/
    └── cards.js                  # New sync and test endpoints

src/
├── services/
│   └── cardsService.js           # Frontend service for card operations
├── pages/
│   ├── CardDatabase.jsx          # Updated with sync functionality
│   └── AdminPanel.jsx            # New admin interface
└── components/
    └── ...                       # Existing components
```

### Environment Variables

**Backend (.env):**
```env
GOOGLE_SHEETS_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENABLE_DEBUG=true
```

## 🐛 Troubleshooting

### Common Issues

1. **"Spreadsheet not found"**
   - Check the spreadsheet ID in your URL
   - Ensure the service account has access

2. **"Authentication failed"**
   - Verify your service account credentials
   - Check that the Google Sheets API is enabled

3. **"No data found"**
   - Ensure your sheet is named "Cards"
   - Check that you have data in the spreadsheet

4. **"Permission denied"**
   - Share the spreadsheet with your service account email
   - Give the service account "Editor" permissions

### Debug Mode

Enable debug logging by setting `VITE_ENABLE_DEBUG=true` in your frontend environment.

### Admin Panel

Use the Admin Panel (`/admin`) to:
- Test your Google Sheets connection
- View sync history and error logs
- Monitor cache status
- Manually trigger syncs

## 📚 Additional Resources

- [Google Sheets Setup Guide](./GOOGLE_SHEETS_SETUP.md) - Detailed setup instructions
- [Sample Template](./sample-cards-template.csv) - CSV template for your spreadsheet
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Console](https://console.cloud.google.com)

## 🤝 Support

If you encounter issues:

1. Check the Admin Panel for detailed error messages
2. Review the setup guide for configuration steps
3. Test your connection using the built-in test function
4. Check the browser console for frontend errors
5. Review server logs for backend issues

## 🔄 Workflow

### Adding New Cards
1. Open your Google Spreadsheet
2. Add a new row with card data
3. Click "Sync" in your application
4. New card appears on your website

### Editing Cards
1. Edit card data in the spreadsheet
2. Click "Sync" in your application
3. Changes are reflected on your website

### Bulk Updates
1. Make multiple changes in your spreadsheet
2. Single sync updates all changes
3. Review changes in the Admin Panel

This integration makes managing your card database as simple as editing a spreadsheet! 🎉