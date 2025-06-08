# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration to manage your card database through a spreadsheet.

## Overview

The system allows you to:
- Store card data in a Google Sheets spreadsheet
- Automatically sync card data from the spreadsheet to your website
- Update cards by simply editing the spreadsheet
- Cache data for performance with fallback support

## Prerequisites

- A Google account
- Access to Google Cloud Console
- Your KONIVRER deck database application

## Step 1: Create Your Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "KONIVRER Card Database"
4. Create a sheet named "Cards" (this is the default sheet name the system looks for)

### Spreadsheet Format

Your spreadsheet should have the following columns in the first row (headers):

| Column | Description | Example |
|--------|-------------|---------|
| ID | Unique identifier for the card | card001 |
| Name | Card name | Gustling Wisp |
| Elements | Card elements (comma-separated) | 🜁,🜃 |
| Keywords | Card keywords (comma-separated) | Gust,Flying |
| Cost | Mana/energy cost | 3 |
| Power | Card power/strength | 2 |
| Rarity | Card rarity | common |
| Text | Card description/rules text | When this enters, Gust a target card. |

### Example Data

```
ID       | Name            | Elements | Keywords      | Cost | Power | Rarity   | Text
card001  | Gustling Wisp   | 🜁       | Gust          | 1    | 1     | common   | When this enters, Gust a target card.
card002  | Infernal Sprint | 🜂       | Inferno       | 2    | 2     | uncommon | Inferno - Deal 1 extra damage when this attacks.
card003  | Brilliant Watch | 🜃,🜄    | Brilliance    | 3    | 3     | rare     | Brilliance - Place the top card of your deck under your Life Cards.
```

## Step 2: Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## Step 3: Create Service Account

1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `konivrer-sheets-service`
   - Description: `Service account for KONIVRER card database sheets integration`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 4: Generate Service Account Key

1. In the Credentials page, find your service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create New Key"
5. Choose "JSON" format
6. Download the key file (keep it secure!)

## Step 5: Share Spreadsheet with Service Account

1. Open your Google Spreadsheet
2. Click the "Share" button
3. Add the service account email (found in the JSON key file as `client_email`)
4. Give it "Editor" permissions
5. Uncheck "Notify people" since it's a service account
6. Click "Share"

## Step 6: Configure Environment Variables

### Backend Configuration

Add these environment variables to your backend `.env` file:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_ID=your-spreadsheet-id-here

# Option 1: Complete service account key (recommended)
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project",...}

# Option 2: Individual variables (alternative)
# GOOGLE_PROJECT_ID=your-project-id
# GOOGLE_PRIVATE_KEY_ID=your-private-key-id
# GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
# GOOGLE_CLIENT_ID=your-client-id
```

### Finding Your Spreadsheet ID

The spreadsheet ID is in the URL of your Google Sheet:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
```

### Setting Up the Service Account Key

**Option 1 (Recommended):** Use the complete JSON key as a single environment variable:
```env
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"your-service-account@your-project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com"}
```

**Option 2:** Use individual environment variables (extract from the JSON file):
```env
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id
```

## Step 7: Test the Integration

1. Start your backend server
2. Go to the Admin Panel in your application
3. Click "Test Connection" to verify the setup
4. If successful, click "Sync from Google Sheets" to load your data

## Usage

### Adding New Cards

1. Open your Google Spreadsheet
2. Add a new row with the card data
3. In your application, click the "Sync" button to update the database

### Editing Cards

1. Edit the card data directly in the spreadsheet
2. Click "Sync" in your application to apply the changes

### Automatic Sync

The system automatically caches data for 5 minutes, so changes will be reflected within that timeframe without manual syncing.

## API Endpoints

The integration adds these API endpoints:

- `GET /api/cards` - Get all cards (with caching)
- `POST /api/cards/sync` - Manually sync from Google Sheets
- `GET /api/cards/test-connection` - Test Google Sheets connection

## Troubleshooting

### Common Issues

1. **"Spreadsheet not found" error**
   - Check that the spreadsheet ID is correct
   - Ensure the service account has access to the spreadsheet

2. **"Authentication failed" error**
   - Verify the service account credentials are correct
   - Check that the Google Sheets API is enabled

3. **"No data found" error**
   - Ensure your sheet is named "Cards"
   - Check that the first row contains headers
   - Verify there's data in the spreadsheet

4. **"Permission denied" error**
   - Make sure the service account email has Editor access to the spreadsheet
   - Check that the service account is properly configured

### Debug Mode

Enable debug mode by setting `VITE_ENABLE_DEBUG=true` in your frontend environment to see detailed logs.

## Security Considerations

- Keep your service account key file secure and never commit it to version control
- Use environment variables for all sensitive configuration
- Regularly rotate your service account keys
- Only grant necessary permissions to the service account

## Performance Notes

- Data is cached for 5 minutes to reduce API calls
- The system falls back to cached data if Google Sheets is unavailable
- Large spreadsheets may take longer to sync

## Support

If you encounter issues:

1. Check the Admin Panel for connection status
2. Review the Recent Activity log for error details
3. Verify your spreadsheet format matches the expected structure
4. Test the connection using the built-in test function