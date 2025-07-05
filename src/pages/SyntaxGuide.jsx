/**
 * KONIVRER Deck Database - Search Syntax Guide Page
 * 
 * Standalone page for KONIVRER card search syntax documentation
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen,
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
  ArrowLeft,
} from 'lucide-react';

const SyntaxGuide = () => {
  const [copiedExample, setCopiedExample] = useState(null);

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
          syntax: 'x OR y',
          description: 'Find cards containing either "x" or "y"',
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
          syntax: 't:elemental',
          description: 'Find all Elemental cards',
        },
        {
          syntax: 't:flag',
          description: 'Find all Flag cards',
        },
        {
          syntax: 't:ΦLAG',
          description: 'Find Flag cards using exact type',
        },
        {
          syntax: 'type:elemental',
          description: 'Alternative syntax for type searches',
        },
      ],
    },
    {
      id: 'elements',
      title: 'Element Searches',
      icon: Palette,
      description: 'Search by KONIVRER elements',
      examples: [
        {
          syntax: 'e:brilliance',
          description: 'Find cards with Brilliance element',
        },
        {
          syntax: 'e:gust',
          description: 'Find cards with Gust element',
        },
        {
          syntax: 'e:inferno',
          description: 'Find cards with Inferno element',
        },
        {
          syntax: 'e:steadfast',
          description: 'Find cards with Steadfast element',
        },
        {
          syntax: 'e:submerged',
          description: 'Find cards with Submerged element',
        },
        {
          syntax: 'e:void',
          description: 'Find cards with Void element',
        },
        {
          syntax: 'e:quintessence',
          description: 'Find cards with Quintessence element',
        },
        {
          syntax: 'e>=2',
          description: 'Find cards with 2 or more elements',
        },
      ],
    },
    {
      id: 'keywords',
      title: 'Keyword Searches',
      icon: Star,
      description: 'Search by card keywords and abilities',
      examples: [
        {
          syntax: 'k:brilliance',
          description: 'Find cards with Brilliance keyword',
        },
        {
          syntax: 'k:void',
          description: 'Find cards with Void keyword',
        },
        {
          syntax: 'keyword:steadfast',
          description: 'Alternative syntax for keyword searches',
        },
      ],
    },
    {
      id: 'cost',
      title: 'Cost Searches',
      icon: Zap,
      description: 'Search by mana costs and total cost',
      examples: [
        {
          syntax: 'c:3',
          description: 'Find cards with cost of 3',
        },
        {
          syntax: 'c>=4',
          description: 'Find cards with cost 4 or higher',
        },
        {
          syntax: 'c<=2',
          description: 'Find cards with cost 2 or lower',
        },
        {
          syntax: 'cost:0',
          description: 'Find cards with cost 0',
        },
      ],
    },
    {
      id: 'rarity',
      title: 'Rarity & Set Searches',
      icon: DollarSign,
      description: 'Search by card rarity and set information',
      examples: [
        {
          syntax: 'r:rare',
          description: 'Find rare cards',
        },
        {
          syntax: 'r:mythic',
          description: 'Find mythic rare cards',
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
      id: 'advanced',
      title: 'Advanced Combinations',
      icon: Filter,
      description: 'Complex search combinations and operators',
      examples: [
        {
          syntax: 't:elemental e:brilliance',
          description: 'Find Brilliance Elemental cards',
        },
        {
          syntax: 'e:gust e:inferno c<=3',
          description: 'Find low-cost Gust/Inferno cards',
        },
        {
          syntax: '(t:flag OR t:elemental) e:void',
          description: 'Find Void flags or elementals',
        },
        {
          syntax: 't:elemental e:steadfast c>=3',
          description: 'Find expensive Steadfast elementals',
        },
        {
          syntax: 'r:rare -e:quintessence',
          description: 'Find rare cards without Quintessence',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/cards" 
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Card Search
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">
              KONIVRER Search Syntax Guide
            </h1>
          </div>
          
          <p className="text-gray-300 text-lg max-w-3xl">
            Master the advanced search syntax to find exactly the cards you need. 
            Use these operators and filters to build powerful search queries.
          </p>
        </div>

        {/* Quick Reference */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-purple-500/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Quote className="w-5 h-5 text-purple-400" />
            Quick Reference
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-purple-300 font-mono">t:</span>
              <span className="text-gray-300 ml-2">Type</span>
            </div>
            <div>
              <span className="text-purple-300 font-mono">e:</span>
              <span className="text-gray-300 ml-2">Element</span>
            </div>
            <div>
              <span className="text-purple-300 font-mono">k:</span>
              <span className="text-gray-300 ml-2">Keyword</span>
            </div>
            <div>
              <span className="text-purple-300 font-mono">c:</span>
              <span className="text-gray-300 ml-2">Cost</span>
            </div>
            <div>
              <span className="text-purple-300 font-mono">r:</span>
              <span className="text-gray-300 ml-2">Rarity</span>
            </div>
            <div>
              <span className="text-purple-300 font-mono">s:</span>
              <span className="text-gray-300 ml-2">Set</span>
            </div>
            <div>
              <span className="text-purple-300 font-mono">OR</span>
              <span className="text-gray-300 ml-2">OR Logical</span>
            </div>
          </div>
        </div>

        {/* Syntax Sections */}
        <div className="space-y-6">
          {syntaxSections.map((section) => {
            const IconComponent = section.icon;
            
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <IconComponent className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">
                      {section.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-300 mb-6">
                    {section.description}
                  </p>

                  <div className="space-y-3">
                    {section.examples.map((example, index) => (
                      <div
                        key={index}
                        className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <code className="text-purple-300 font-mono text-sm bg-slate-900/50 px-2 py-1 rounded">
                            {example.syntax}
                          </code>
                          <button
                            onClick={() => copyExample(example.syntax)}
                            className="p-1 text-gray-400 hover:text-purple-300 transition-colors"
                            title="Copy example"
                          >
                            {copiedExample === example.syntax ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-gray-300 text-sm">
                          {example.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link 
            to="/cards" 
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
            Try Advanced Search
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SyntaxGuide;