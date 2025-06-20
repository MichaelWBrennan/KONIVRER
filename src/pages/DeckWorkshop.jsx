import { motion } from 'framer-motion';
import { Wrench, BarChart3, Package } from 'lucide-react';
import VisualDeckBuilder from '../components/VisualDeckBuilder';
import DeckStats from '../components/DeckStats';
import CollectionManager from '../components/CollectionManager';

const DeckWorkshop = () => {
  // Sample deck data for components that need it
  const sampleDeck = {
    name: 'Sample Deck',
    cards: [
      {
        id: 1,
        name: 'Lightning Bolt',
        cost: 1,
        elements: ['Inferno'],
        rarity: 'Common',
        count: 4,
      },
      {
        id: 2,
        name: 'Forest Guardian',
        cost: 3,
        elements: ['Steadfast'],
        rarity: 'Rare',
        count: 2,
      },
      {
        id: 3,
        name: 'Mystic Shield',
        cost: 2,
        elements: ['Submerged'],
        rarity: 'Uncommon',
        count: 3,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-color">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Wrench className="w-8 h-8 text-green-500" />
              <h1 className="text-4xl font-bold">Deck Workshop</h1>
            </div>
            <p className="text-secondary text-lg">
              Build, analyze, and manage your deck collection
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* Deck Builder */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Wrench className="w-6 h-6 text-green-500" />
                <div>
                  <h2 className="text-xl font-bold">Deck Builder</h2>
                  <p className="text-secondary">Visual deck construction</p>
                </div>
              </div>
              <VisualDeckBuilder deck={sampleDeck} />
            </div>
          </div>

          {/* Deck Stats & Collection */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold">Deck Analytics</h3>
              </div>
              <DeckStats deck={sampleDeck} />
            </div>

            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-5 h-5 text-purple-500" />
                <h3 className="font-bold">Collection Manager</h3>
              </div>
              <CollectionManager />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeckWorkshop;