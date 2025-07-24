const konivrerSheetsService = require('../services/konivrerSheetsService');

// Cache for cards data
let cardsCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback data in case Google Sheets is unavailable - using cards we have images for
const fallbackCards = [
    {
        id: "card001",
        name: "ABISS",
        elements: ["🜁"],
        keywords: ["Gust"],
        cost: 1,
        power: 1,
        rarity: "common",
        text: "When this enters, Gust a target card."
    },
    {
        id: "card002",
        name: "ANGEL",
        elements: ["🜂"],
        keywords: ["Inferno"],
        cost: 2,
        power: 2,
        rarity: "uncommon",
        text: "Inferno - Deal 1 extra damage when this attacks."
    },
    {
        id: "card003",
        name: "ASH",
        elements: ["🜃", "🜄"],
        keywords: ["Brilliance", "Steadfast"],
        cost: 3,
        power: 3,
        rarity: "rare",
        text: "Brilliance - Place the top card of your deck under your Life Cards."
    }
];

exports.getCards = async (req, res) => {
    try {
        // Check if we have cached data that's still fresh
        const now = Date.now();
        if (cardsCache && lastFetchTime && (now - lastFetchTime) < CACHE_DURATION) {
            return res.json(cardsCache);
        }

        // Try to fetch from Google Sheets
        try {
            const cards = await konivrerSheetsService.getCards();
            if (cards && cards.length > 0) {
                cardsCache = cards;
                lastFetchTime = now;
                return res.json(cards);
            }
        } catch (sheetsError) {
            console.error('Error fetching from Google Sheets:', sheetsError.message);
        }

        // If Google Sheets fails, use cached data if available
        if (cardsCache) {
            console.log('Using cached card data due to Google Sheets error');
            return res.json(cardsCache);
        }

        // Last resort: use fallback data
        console.log('Using fallback card data');
        res.json(fallbackCards);

    } catch (error) {
        console.error('Error in getCards:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch cards',
            message: error.message 
        });
    }
};

exports.syncCards = async (req, res) => {
    try {
        console.log('Manual sync requested...');
        const cards = await konivrerSheetsService.getCards();
        
        if (cards && cards.length > 0) {
            cardsCache = cards;
            lastFetchTime = Date.now();
            res.json({ 
                success: true, 
                message: `Successfully synced ${cards.length} cards from Google Sheets`,
                cards: cards
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: 'No cards found in Google Sheets' 
            });
        }
    } catch (error) {
        console.error('Error syncing cards:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to sync cards from Google Sheets',
            message: error.message 
        });
    }
};

exports.testConnection = async (req, res) => {
    try {
        const result = await konivrerSheetsService.testConnection();
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            connected: false, 
            error: error.message 
        });
    }
};
