#!/usr/bin/env node

/**
 * Test script for Konivrer Google Sheets integration
 * This demonstrates the API endpoints and shows the expected data structure
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

async function testKonivrerIntegration() {
  console.log('🎮 KONIVRER Google Sheets Integration Test\n');
  console.log('📊 Spreadsheet: https://docs.google.com/spreadsheets/d/11VbalAjhkfa1WRT_yfYOjvKdsnEp16fj7AVf_he-eTg/edit\n');

  try {
    // Test 1: Get current cards (should work with fallback data)
    console.log('📋 1. Testing card retrieval...');
    const cardsResponse = await axios.get(`${API_BASE_URL}/cards`);
    console.log(`   ✅ Retrieved ${cardsResponse.data.length} cards`);
    
    if (cardsResponse.data.length > 0) {
      const sampleCard = cardsResponse.data[0];
      console.log('   🎴 Sample card structure:');
      console.log(`      Name: ${sampleCard.name}`);
      console.log(`      Elements: ${sampleCard.elements?.join(', ') || 'None'}`);
      console.log(`      Keywords: ${sampleCard.keywords?.join(', ') || 'None'}`);
      console.log(`      Cost: ${sampleCard.cost}, Power: ${sampleCard.power}`);
      console.log(`      Rarity: ${sampleCard.rarity}`);
      console.log(`      Type: ${sampleCard.type || 'N/A'}`);
    }
    console.log();

    // Test 2: Test Google Sheets connection
    console.log('🔗 2. Testing Google Sheets connection...');
    const connectionResponse = await axios.get(`${API_BASE_URL}/cards/test-connection`);
    
    if (connectionResponse.data.connected) {
      console.log('   ✅ Connected to Google Sheets');
      console.log(`   📊 ${connectionResponse.data.message}`);
      console.log(`   📄 Document: ${connectionResponse.data.title || 'Unknown'}`);
      console.log(`   📑 Sheets: ${connectionResponse.data.sheetCount || 'Unknown'}`);
    } else {
      console.log('   ❌ Not connected to Google Sheets');
      console.log(`   🚫 Error: ${connectionResponse.data.error || connectionResponse.data.message}`);
      console.log('   💡 This is expected if you haven\'t set up credentials yet');
    }
    console.log();

    // Test 3: Try to sync (only if connected)
    if (connectionResponse.data.connected) {
      console.log('🔄 3. Testing sync from Google Sheets...');
      const syncResponse = await axios.post(`${API_BASE_URL}/cards/sync`);
      
      if (syncResponse.data.success) {
        console.log('   ✅ Sync successful!');
        console.log(`   📈 ${syncResponse.data.message}`);
        console.log(`   🎯 Cards synced: ${syncResponse.data.cards.length}`);
        
        // Show some example cards from the actual spreadsheet
        if (syncResponse.data.cards.length > 0) {
          console.log('   🎴 Sample cards from your spreadsheet:');
          syncResponse.data.cards.slice(0, 3).forEach((card, index) => {
            console.log(`      ${index + 1}. ${card.name}`);
            console.log(`         Elements: ${card.elements.join(', ')}`);
            console.log(`         Keywords: ${card.keywords.join(', ')}`);
            console.log(`         Cost: ${card.cost}, Power: ${card.power}, Rarity: ${card.rarity}`);
            if (card.collectorNumber) {
              console.log(`         Collector #: ${card.collectorNumber}`);
            }
            console.log();
          });
        }
      } else {
        console.log('   ❌ Sync failed');
        console.log(`   🚫 ${syncResponse.data.message}`);
      }
    } else {
      console.log('🔄 3. Skipping sync test (not connected to Google Sheets)');
    }
    console.log();

    // Test 4: Show expected spreadsheet structure
    console.log('📊 4. Expected spreadsheet structure:');
    console.log('   Your spreadsheet should have these columns:');
    console.log('   • name - Card name (e.g., "ABISS")');
    console.log('   • quantity - Number of copies');
    console.log('   • Cost_1 to Cost_6 - Element symbols');
    console.log('   • Type - Card type (e.g., "ELEMENTAL")');
    console.log('   • Flavor_Text - Card description/lore');
    console.log('   • Familiar_Text - Keywords (comma-separated)');
    console.log('   • Collector_Number - Card number (e.g., "1/63")');
    console.log();

    console.log('🎉 Integration test completed!');
    console.log();
    console.log('📝 Next steps to enable Google Sheets:');
    console.log('   1. Create a Google Cloud service account');
    console.log('   2. Enable the Google Sheets API');
    console.log('   3. Share your spreadsheet with the service account');
    console.log('   4. Add credentials to Backend/.env file');
    console.log('   5. Restart your backend server');
    console.log('   6. Test again - you should see real data from your spreadsheet!');
    console.log();
    console.log('📖 See SETUP_KONIVRER_SHEETS.md for detailed instructions');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🚨 Backend server is not running!');
      console.log('   Start it with: cd Backend && npm start');
    } else if (error.response) {
      console.log(`\n🚨 API Error: ${error.response.status} - ${error.response.statusText}`);
      if (error.response.data) {
        console.log(`   Details: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
  }
}

// Run the test
testKonivrerIntegration();