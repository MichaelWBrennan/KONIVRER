import React from 'react';
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
const SyntaxGuide = (): any => {
  const [copiedExample, setCopiedExample] = useState(null);
  const copyExample = async (example) => {
    try {
      await navigator.clipboard.writeText(example);
      setCopiedExample(example);
      setTimeout(() => setCopiedExample(null), 2000);
    } catch (error: any) {
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
          syntax: 'lightning | dragon | familiar',
          description: 'Search for any word in card names or rules text',
          viableWords: 'Any word that appears in card names or text'
        },
        {
          syntax: '"exact phrase" | "enters the battlefield"',
          description: 'Search for exact phrases using quotes',
          viableWords: 'Any exact phrase in quotes'
        },
        {
          syntax: 'fire OR flame | word1 OR word2',
          description: 'Find cards containing either word using OR',
          viableWords: 'Any words connected with OR'
        },
        {
          syntax: 'dragon -token | word -excluded',
          description: 'Include one term but exclude another using minus (-)',
          viableWords: 'Any word to include, any word to exclude with -'
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
          syntax: 't:elemental | type:elemental',
          description: 'Search for cards by their type',
          viableWords: 'elemental, flag'
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
          syntax: 'e:fire | element:fire',
          description: 'Search for cards by their elemental requirements (resources needed to cast)',
          viableWords: 'fire, water, earth, air, aether, nether, azoth'
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
          syntax: 'k:brilliance | keyword:brilliance',
          description: 'Search for cards by their keyword abilities (special powers)',
          viableWords: 'brilliance, void, gust, submerged, inferno, steadfast'
        },
      ],
    },
    {
      id: 'cost',
      title: 'Cost Searches',
      icon: Zap,
      description: 'Search by casting costs and total cost',
      examples: [
        {
          syntax: 'cmc:3 | mv:3 | cost:3',
          description: 'Search for cards by their casting cost',
          viableWords: 'Any number (0, 1, 2, 3, 4, 5+), comparison operators (>=, <=, >, <, =)'
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
          syntax: 'r:rare | rarity:rare',
          description: 'Search for cards by their rarity level',
          viableWords: 'common, uncommon, rare, legendary'
        },
        {
          syntax: 's:set | set:set',
          description: 'Search for cards by their set or expansion',
          viableWords: 'Any set name or set code (e.g., "prima materia", "pm")'
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
          syntax: 'AND | OR | ( ) | -',
          description: 'Combine multiple search criteria using logical operators',
          viableWords: 'AND (implicit), OR (explicit), parentheses for grouping, minus (-) for exclusion'
        },
        {
          syntax: 't:familiar k:brilliance | (e:fire OR e:water) -token',
          description: 'Complex searches combining types, keywords, elements, and exclusions',
          viableWords: 'Any combination of the above syntax types'
        },
      ],
    },
  ];
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="container mx-auto px-4 py-8"></div>
      <div className="mb-8"></div>
      <Link 
            to="/cards" 
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors mb-4"
           />
            <ArrowLeft className="w-4 h-4" />
            Back to Card Search
          </Link>
      <div className="flex items-center gap-3 mb-4"></div>
      <BookOpen className="w-8 h-8 text-purple-400" /></BookOpen>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-purple-500/20"></div>
      <div className="space-y-4"></div>
      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50"></div>
      <div className="flex flex-wrap gap-2 mb-3"></div>
      <code className="text-purple-300 font-mono text-sm bg-slate-900/50 px-2 py-1 rounded">t:elemental</code>
      <code className="text-purple-300 font-mono text-sm bg-slate-900/50 px-2 py-1 rounded">type:elemental</code>
      <p className="text-gray-300 text-sm mb-3">Search for cards by their type</p>
      <p className="text-blue-200 text-sm">elemental, flag</p>
      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50"></div>
      <div className="flex flex-wrap gap-2 mb-3"></div>
      <code className="text-orange-300 font-mono text-sm bg-slate-900/50 px-2 py-1 rounded">e:fire</code>
      <code className="text-orange-300 font-mono text-sm bg-slate-900/50 px-2 py-1 rounded">element:fire</code>
      <p className="text-gray-300 text-sm mb-3">Search for cards by their elemental requirements (resources needed to cast)</p>
      <p className="text-blue-200 text-sm">fire, water, earth, air, aether, nether, azoth</p>
      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50"></div>
      <div className="flex flex-wrap gap-2 mb-3"></div>
      <code className="text-blue-300 font-mono text-sm bg-slate-900/50 px-2 py-1 rounded">k:brilliance</code>
      <code className="text-blue-300 font-mono text-sm bg-slate-900/50 px-2 py-1 rounded">keyword:brilliance</code>
      <p className="text-gray-300 text-sm mb-3">Search for cards by their keyword abilities (special powers)</p>
      <p className="text-blue-200 text-sm">brilliance, void, gust, submerged, inferno, steadfast</p>
      </div>
        {/* Footer */}
        <div className="mt-12 text-center"></div>
      <Link 
            to="/cards" 
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
           />
            <Search className="w-4 h-4" />
            Try Advanced Search
          </Link>
    </>
  );
};
export default SyntaxGuide;