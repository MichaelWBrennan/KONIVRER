/**
 * KONIVRER Deck Database - Search Syntax Guide
 * 
 * Comprehensive guide for KONIVRER card search syntax
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Search,
  Zap,
  Type,
  Palette,
  DollarSign,
  Star,
  Calendar,
  Hash,
  Quote,
  Filter,
  Copy,
  CheckCircle,
} from 'lucide-react';

const KonivrERSyntaxGuide = ({ isExpanded = false, onToggle }) => {
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [copiedExample, setCopiedExample] = useState(null);

  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const copyExample = async (example) => {
    try {
      await navigator.clipboard.writeText(example);
      setCopiedExample(example);
      setTimeout(() => setCopiedExample(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const syntaxSections = [
    {
      id: 'basic',
      title: 'Basic Search',
      icon: Search,
      description: 'Simple text searches across card names and rules text',
      examples: [
        {
          syntax: 'lightning',
          description: 'Find cards with "lightning" in name or text',
        },
        {
          syntax: '"exact phrase"',
          description: 'Search for exact phrases using quotes',
        },
        {
          syntax: 'fire OR flame',
          description: 'Find cards containing either "fire" or "flame"',
        },
        {
          syntax: 'dragon -token',
          description: 'Find dragons but exclude tokens',
        },
      ],
    },
    {
      id: 'types',
      title: 'Type Searches',
      icon: Type,
      description: 'Search by card types and subtypes',
      examples: [
        {
          syntax: 't:familiar',
          description: 'Find all Familiar cards',
        },
        {
          syntax: 't:spell',
          description: 'Find all Spell cards',
        },
        {
          syntax: 't:artifact',
          description: 'Find all Artifact cards',
        },
        {
          syntax: 't:"legendary familiar"',
          description: 'Find Legendary Familiar cards',
        },
        {
          syntax: 'type:enchantment',
          description: 'Alternative syntax for type searches',
        },
      ],
    },
    {
      id: 'elements',
      title: 'Element Searches',
      icon: Palette,
      description: 'Search by KONIVRER elements and mana costs',
      examples: [
        {
          syntax: 'e:brilliance',
          description: 'Find cards with Brilliance element (⬢)',
        },
        {
          syntax: 'e:gust',
          description: 'Find cards with Gust element (🜁)',
        },
        {
          syntax: 'e:inferno',
          description: 'Find cards with Inferno element (🜂)',
        },
        {
          syntax: 'e:steadfast',
          description: 'Find cards with Steadfast element (🜃)',
        },
        {
          syntax: 'e:submerged',
          description: 'Find cards with Submerged element (🜄)',
        },
        {
          syntax: 'e:void',
          description: 'Find cards with Void element (▢)',
        },
        {
          syntax: 'e:quintessence',
          description: 'Find cards with Quintessence element (✦)',
        },
        {
          syntax: 'e&gt;=2',
          description: 'Find cards with 2 or more elements',
        },
      ],
    },
    {
      id: 'mana',
      title: 'Mana Cost Searches',
      icon: Zap,
      description: 'Search by mana costs and converted mana cost',
      examples: [
        {
          syntax: 'cmc:3',
          description: 'Find cards with converted mana cost of 3',
        },
        {
          syntax: 'cmc&gt;=4',
          description: 'Find cards with CMC 4 or higher',
        },
        {
          syntax: 'cmc&lt;=2',
          description: 'Find cards with CMC 2 or lower',
        },
        {
          syntax: 'mana:{3}{⬢}',
          description: 'Find cards costing 3 generic + 1 Brilliance',
        },
        {
          syntax: 'mv:0',
          description: 'Find cards with mana value 0',
        },
      ],
    },
    {
      id: 'power',
      title: 'Power & Toughness',
      icon: Hash,
      description: 'Search by creature stats',
      examples: [
        {
          syntax: 'pow:3',
          description: 'Find creatures with power 3',
        },
        {
          syntax: 'tou&gt;=5',
          description: 'Find creatures with toughness 5 or more',
        },
        {
          syntax: 'pow=tou',
          description: 'Find creatures with equal power and toughness',
        },
        {
          syntax: 'pow&gt;tou',
          description: 'Find creatures with power greater than toughness',
        },
        {
          syntax: 'power:*',
          description: 'Find creatures with variable power (*)',
        },
      ],
    },
    {
      id: 'rarity',
      title: 'Rarity & Sets',
      icon: Star,
      description: 'Search by rarity and set information',
      examples: [
        {
          syntax: 'r:common',
          description: 'Find common cards',
        },
        {
          syntax: 'r:rare',
          description: 'Find rare cards',
        },
        {
          syntax: 'r:mythic',
          description: 'Find mythic rare cards',
        },
        {
          syntax: 'r:legendary',
          description: 'Find legendary cards',
        },
        {
          syntax: 's:"prima materia"',
          description: 'Find cards from Prima Materia set',
        },
        {
          syntax: 'set:pm',
          description: 'Find cards using set code',
        },
      ],
    },
    {
      id: 'text',
      title: 'Rules Text Searches',
      icon: BookOpen,
      description: 'Search within card rules text and abilities',
      examples: [
        {
          syntax: 'o:flying',
          description: 'Find cards with "flying" in rules text',
        },
        {
          syntax: 'o:"enters the battlefield"',
          description: 'Find cards with ETB effects',
        },
        {
          syntax: 'o:~/~',
          description: 'Find cards that reference themselves',
        },
        {
          syntax: 'oracle:trample',
          description: 'Alternative syntax for rules text search',
        },
        {
          syntax: 'o:"{T}:"',
          description: 'Find cards with tap abilities',
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced Operators',
      icon: Filter,
      description: 'Complex search operators and combinations',
      examples: [
        {
          syntax: '(t:familiar OR t:spell) e:brilliance',
          description: 'Combine searches with parentheses',
        },
        {
          syntax: 'cmc:3 -t:land',
          description: 'Exclude specific types with minus (-)',
        },
        {
          syntax: 'is:permanent',
          description: 'Find permanent cards',
        },
        {
          syntax: 'is:spell',
          description: 'Find non-permanent spells',
        },
        {
          syntax: 'unique:art',
          description: 'Show only unique artworks',
        },
        {
          syntax: 'game:paper',
          description: 'Find cards legal in paper play',
        },
      ],
    },
    {
      id: 'special',
      title: 'KONIVRER Special Searches',
      icon: Zap,
      description: 'Unique searches for KONIVRER mechanics',
      examples: [
        {
          syntax: 'o:azoth',
          description: 'Find cards mentioning Azoth',
        },
        {
          syntax: 'o:tribute',
          description: 'Find cards with Tribute mechanic',
        },
        {
          syntax: 'o:"ancient hero"',
          description: 'Find Ancient Hero cards',
        },
        {
          syntax: 'o:singularity',
          description: 'Find Singularity-related cards',
        },
        {
          syntax: 'o:"life cards"',
          description: 'Find cards affecting Life Cards',
        },
        {
          syntax: 'o:resonance',
          description: 'Find cards with Resonance abilities',
        },
      ],
    },
  ];

  const ExampleCard = ({ example }) => (
    <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-white/20 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <code className="text-purple-300 font-mono text-sm bg-purple-500/20 px-2 py-1 rounded">
          {example.syntax}
        </code>
        <button
          onClick={() => copyExample(example.syntax)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          title="Copy to clipboard"
        >
          {copiedExample === example.syntax ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
      <p className="text-gray-300 text-sm">{example.description}</p>
    </div>
  );

  const SectionCard = ({ section }) => {
    const isExpanded = expandedSections.has(section.id);
    const Icon = section.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 rounded-lg border border-white/10 overflow-hidden"
      >
        <button
          onClick={() => toggleSection(section.id)}
          className="w-full p-4 text-left hover:bg-white/5 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-white font-semibold">{section.title}</h3>
              <p className="text-gray-400 text-sm">{section.description}</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10"
            >
              <div className="p-4 space-y-3">
                {section.examples.map((example, index) => (
                  <ExampleCard key={index} example={example} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (!isExpanded) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
      >
        <BookOpen className="w-4 h-4" />
        <span className="text-sm">Search Syntax Guide</span>
        <ChevronDown className="w-4 h-4" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">KONIVRER Search Syntax Guide</h2>
              <p className="text-gray-400">Master the art of card searching</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ChevronUp className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="p-6 border-b border-white/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <h3 className="text-lg font-semibold text-white mb-3">Quick Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="text-center">
            <code className="text-purple-300 font-mono text-sm">t:familiar</code>
            <p className="text-gray-400 text-xs mt-1">Card Types</p>
          </div>
          <div className="text-center">
            <code className="text-blue-300 font-mono text-sm">e:brilliance</code>
            <p className="text-gray-400 text-xs mt-1">Elements</p>
          </div>
          <div className="text-center">
            <code className="text-green-300 font-mono text-sm">cmc:3</code>
            <p className="text-gray-400 text-xs mt-1">Mana Cost</p>
          </div>
          <div className="text-center">
            <code className="text-yellow-300 font-mono text-sm">pow&gt;=3</code>
            <p className="text-gray-400 text-xs mt-1">Power/Toughness</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="p-6">
        <div className="space-y-4">
          {syntaxSections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Pro Tips
            </h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Combine multiple criteria: <code className="text-purple-300">t:familiar e:brilliance cmc:3</code></li>
              <li>• Use parentheses for complex logic: <code className="text-purple-300">(t:spell OR t:artifact) e:void</code></li>
              <li>• Exclude with minus: <code className="text-purple-300">dragon -t:token</code></li>
              <li>• Use quotes for exact phrases: <code className="text-purple-300">"enters the battlefield"</code></li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default KonivrERSyntaxGuide;