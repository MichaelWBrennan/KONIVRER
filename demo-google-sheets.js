#!/usr/bin/env node

/**
 * Demo script for Google Sheets integration
 * This script demonstrates how to use the Google Sheets API endpoints
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

async function demoGoogleSheetsIntegration() {
  console.log('🎮 KONIVRER Google Sheets Integration Demo\n');

  try {
    // Test 1: Get current cards
    console.log('📋 1. Getting current cards...');
    const cardsResponse = await axios.get(`${API_BASE_URL}/cards`);
    console.log(`   ✅ Found ${cardsResponse.data.length} cards`);
    console.log(`   📄 Sample card: ${cardsResponse.data[0]?.name || 'None'}\n`);

    // Test 2: Test Google Sheets connection
    console.log('🔗 2. Testing Google Sheets connection...');
    const connectionResponse = await axios.get(`${API_BASE_URL}/cards/test-connection`);
    if (connectionResponse.data.connected) {
      console.log('   ✅ Connected to Google Sheets');
      console.log(`   📊 ${connectionResponse.data.message}\n`);
    } else {
      console.log('   ❌ Not connected to Google Sheets');
      console.log(`   🚫 ${connectionResponse.data.message || connectionResponse.data.error}\n`);
    }

    // Test 3: Try to sync (only if connected)
    if (connectionResponse.data.connected) {
      console.log('🔄 3. Syncing from Google Sheets...');
      const syncResponse = await axios.post(`${API_BASE_URL}/cards/sync`);
      if (syncResponse.data.success) {
        console.log('   ✅ Sync successful');
        console.log(`   📈 ${syncResponse.data.message}`);
        console.log(`   🎯 Synced ${syncResponse.data.cards.length} cards\n`);
      } else {
        console.log('   ❌ Sync failed');
        console.log(`   🚫 ${syncResponse.data.message}\n`);
      }
    } else {
      console.log('🔄 3. Skipping sync (not connected to Google Sheets)\n');
    }

    // Test 4: Get cards again to see if anything changed
    console.log('📋 4. Getting cards after sync...');
    const updatedCardsResponse = await axios.get(`${API_BASE_URL}/cards`);
    console.log(`   ✅ Found ${updatedCardsResponse.data.length} cards`);
    
    if (updatedCardsResponse.data.length > 0) {
      console.log('   🎴 Card examples:');
      updatedCardsResponse.data.slice(0, 3).forEach((card, index) => {
        console.log(`      ${index + 1}. ${card.name} (${card.rarity}) - Cost: ${card.cost}, Power: ${card.power}`);
      });
    }

    console.log('\n🎉 Demo completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Set up your Google Sheets credentials (see GOOGLE_SHEETS_SETUP.md)');
    console.log('   2. Create your card spreadsheet using the sample template');
    console.log('   3. Use the Admin Panel to manage your integration');
    console.log('   4. Update cards by editing your spreadsheet and clicking sync!');

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🚨 Make sure your backend server is running:');
      console.log('   cd Backend && npm start');
    } else if (error.response) {
      console.log(`\n🚨 API Error: ${error.response.status} - ${error.response.statusText}`);
      console.log(`   ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

// Run the demo
demoGoogleSheetsIntegration();

export { demoGoogleSheetsIntegration };