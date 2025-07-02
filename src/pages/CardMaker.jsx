/**
 * KONIVRER Deck Database
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Upload,
  Save,
  Share2,
  Palette,
  Type,
  Image as ImageIcon,
  Zap,
  Shield,
  Sword,
  Heart,
  Star,
  Eye,
  RotateCcw,
  Copy,
} from 'lucide-react';

const CardMaker = () => {
  const [cardData, setCardData] = useState({
    name: 'Custom Card',
    cost: 3,
    type: 'Creature',
    subtype: 'Elemental',
    power: 2,
    toughness: 3,
    description: 'A powerful elemental creature with mystical abilities.',
    flavorText: '"The elements bend to my will." - Ancient Proverb',
    rarity: 'rare',
    element: 'fire',
    abilities: [],
    artwork: null,
  });

  const [selectedTemplate, setSelectedTemplate] = useState('creature');
  const [previewMode, setPreviewMode] = useState('normal');
  const fileInputRef = useRef(null);

  const cardTypes = [
    { id: 'creature', name: 'Creature', icon: <Sword className="w-4 h-4" /> },
    { id: 'spell', name: 'Spell', icon: <Zap className="w-4 h-4" /> },
    { id: 'artifact', name: 'Artifact', icon: <Shield className="w-4 h-4" /> },
    {
      id: 'enchantment',
      name: 'Enchantment',
      icon: <Star className="w-4 h-4" />,
    },
  ];

  const rarities = [
    {
      id: 'common',
      name: 'Common',
      color: 'text-gray-400',
      border: 'border-gray-400',
    },
    {
      id: 'uncommon',
      name: 'Uncommon',
      color: 'text-green-400',
      border: 'border-green-400',
    },
    {
      id: 'rare',
      name: 'Rare',
      color: 'text-blue-400',
      border: 'border-blue-400',
    },
    {
      id: 'epic',
      name: 'Epic',
      color: 'text-purple-400',
      border: 'border-purple-400',
    },
    {
      id: 'legendary',
      name: 'Legendary',
      color: 'text-yellow-400',
      border: 'border-yellow-400',
    },
  ];

  const elements = [
    { id: 'fire', name: 'Fire', color: 'from-red-500 to-orange-500' },
    { id: 'water', name: 'Water', color: 'from-blue-500 to-cyan-500' },
    { id: 'earth', name: 'Earth', color: 'from-green-500 to-emerald-500' },
    { id: 'air', name: 'Air', color: 'from-gray-400 to-blue-300' },
    { id: 'neutral', name: 'Neutral', color: 'from-gray-500 to-gray-600' },
  ];

  const abilities = [
    {
      id: 'flying',
      name: 'Flying',
      description: 'Can only be blocked by creatures with flying or reach',
    },
    {
      id: 'trample',
      name: 'Trample',
      description: 'Excess damage is dealt to defending player',
    },
    {
      id: 'haste',
      name: 'Haste',
      description: 'Can attack immediately when played',
    },
    {
      id: 'vigilance',
      name: 'Vigilance',
      description: 'Does not tap when attacking',
    },
    {
      id: 'lifelink',
      name: 'Lifelink',
      description: 'Damage dealt heals you for the same amount',
    },
    {
      id: 'deathtouch',
      name: 'Deathtouch',
      description: 'Any damage dealt destroys the target',
    },
  ];

  const handleInputChange = (field, value) => {
    setCardData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAbilityToggle = abilityId => {
    setCardData(prev => ({
      ...prev,
      abilities: prev.abilities.includes(abilityId)
        ? prev.abilities.filter(id => id !== abilityId)
        : [...prev.abilities, abilityId],
    }));
  };

  const handleImageUpload = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setCardData(prev => ({
          ...prev,
          artwork: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getRarityStyle = rarity => {
    const rarityData = rarities.find(r => r.id === rarity);
    return rarityData
      ? `${rarityData.color} ${rarityData.border}`
      : 'text-gray-400 border-gray-400';
  };

  const getElementGradient = element => {
    const elementData = elements.find(e => e.id === element);
    return elementData ? elementData.color : 'from-gray-500 to-gray-600';
  };

  const exportCard = () => {
    // In a real implementation, this would generate a high-quality image
    alert(
      'Card exported! (In a real implementation, this would download a PNG file)',
    );
  };

  const saveCard = () => {
    // Save to user's collection
    alert('Card saved to your collection!');
  };

  const shareCard = () => {
    // Share card with community
    alert('Card shared with the community!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Card Maker
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Basic Information */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Type className="w-5 h-5" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Card Name
                  </label>
                  <input
                    type="text"
                    value={cardData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mana Cost
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={cardData.cost}
                    onChange={e =>
                      handleInputChange('cost', parseInt(e.target.value))
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={cardData.type}
                    onChange={e => handleInputChange('type', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    {cardTypes.map(type => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subtype
                  </label>
                  <input
                    type="text"
                    value={cardData.subtype}
                    onChange={e => handleInputChange('subtype', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Stats (for creatures) */}
            {cardData.type === 'Creature' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sword className="w-5 h-5" />
                  Combat Stats
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Power
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={cardData.power}
                      onChange={e =>
                        handleInputChange('power', parseInt(e.target.value))
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Toughness
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={cardData.toughness}
                      onChange={e =>
                        handleInputChange('toughness', parseInt(e.target.value))
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Rarity and Element */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rarity
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {rarities.map(rarity => (
                      <button
                        key={rarity.id}
                        onClick={() => handleInputChange('rarity', rarity.id)}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          cardData.rarity === rarity.id
                            ? `${rarity.border} ${rarity.color} bg-gray-700`
                            : 'border-gray-600 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {rarity.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Element
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {elements.map(element => (
                      <button
                        key={element.id}
                        onClick={() => handleInputChange('element', element.id)}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          cardData.element === element.id
                            ? 'border-white bg-gradient-to-r ' + element.color
                            : 'border-gray-600 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {element.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Abilities */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Abilities
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {abilities.map(ability => (
                  <button
                    key={ability.id}
                    onClick={() => handleAbilityToggle(ability.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      cardData.abilities.includes(ability.id)
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-semibold">{ability.name}</div>
                    <div className="text-xs opacity-75">
                      {ability.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Text */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Type className="w-5 h-5" />
                Card Text
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={cardData.description}
                    onChange={e =>
                      handleInputChange('description', e.target.value)
                    }
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Flavor Text
                  </label>
                  <textarea
                    value={cardData.flavorText}
                    onChange={e =>
                      handleInputChange('flavorText', e.target.value)
                    }
                    rows={2}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Artwork */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Artwork
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Upload Artwork
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {cardData.artwork && (
                  <div className="relative">
                    <img
                      src={cardData.artwork}
                      alt="Card artwork"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleInputChange('artwork', null)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full p-1"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Card Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Preview Controls */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Preview
                </h2>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewMode('normal')}
                    className={`px-3 py-1 rounded ${
                      previewMode === 'normal' ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setPreviewMode('foil')}
                    className={`px-3 py-1 rounded ${
                      previewMode === 'foil' ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
                  >
                    Foil
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={exportCard}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={saveCard}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={shareCard}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Card Preview */}
            <div className="flex justify-center">
              <div
                className={`
                relative w-80 h-112 rounded-xl border-4 overflow-hidden transform transition-all hover:scale-105
                ${getRarityStyle(cardData.rarity)}
                ${previewMode === 'foil' ? 'animate-pulse' : ''}
              `}
              >
                {/* Card Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getElementGradient(cardData.element)} opacity-90`}
                />

                {/* Card Content */}
                <div className="relative h-full p-4 text-black">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white drop-shadow-lg">
                      {cardData.name}
                    </h3>
                    <div className="bg-white/90 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {cardData.cost}
                    </div>
                  </div>

                  {/* Type Line */}
                  <div className="text-sm text-white/90 mb-3 drop-shadow">
                    {cardData.type} - {cardData.subtype}
                  </div>

                  {/* Artwork Area */}
                  <div className="bg-gray-800/50 rounded-lg h-40 mb-3 flex items-center justify-center overflow-hidden">
                    {cardData.artwork ? (
                      <img
                        src={cardData.artwork}
                        alt="Card art"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>

                  {/* Abilities */}
                  {cardData.abilities.length > 0 && (
                    <div className="text-xs text-white/90 mb-2 drop-shadow">
                      {cardData.abilities
                        .map(abilityId => {
                          const ability = abilities.find(
                            a => a.id === abilityId,
                          );
                          return ability ? ability.name : '';
                        })
                        .join(', ')}
                    </div>
                  )}

                  {/* Description */}
                  <div className="text-xs text-white/90 mb-2 drop-shadow leading-tight">
                    {cardData.description}
                  </div>

                  {/* Flavor Text */}
                  {cardData.flavorText && (
                    <div className="text-xs italic text-white/80 mb-3 drop-shadow">
                      {cardData.flavorText}
                    </div>
                  )}

                  {/* Bottom */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="text-xs text-white/80 drop-shadow capitalize">
                      {cardData.rarity}
                    </div>

                    {cardData.type === 'Creature' && (
                      <div className="bg-white/90 rounded px-2 py-1 font-bold text-sm">
                        {cardData.power}/{cardData.toughness}
                      </div>
                    )}
                  </div>
                </div>

                {/* Foil Effect */}
                {previewMode === 'foil' && (
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent animate-pulse" />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CardMaker;
