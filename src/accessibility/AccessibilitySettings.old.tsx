import { motion } from 'framer-motion';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState } from 'react';
import { Eye, Monitor, Volume2, Keyboard, HelpCircle, RotateCcw, Check, ChevronRight, Globe, MessageSquare  } from 'lucide-react';

import { useAccessibility } from './AccessibilityProvider';

/**
 * Accessibility Settings Component
 * Allows users to customize accessibility settings
 */
interface AccessibilitySettingsProps {
    onClose

  }
const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({  onClose  }) => {
    const { settings, updateSetting, resetSettings 
  } = useAccessibility(() => {
    const [activeTab, setActiveTab] = useState(false)

  // Handle setting change
  const handleChange = (key, value): any => {
    updateSetting(key, value)
  });

  // Handle reset
  const handleReset = (): any => {
    if (
      window.confirm(
        'Are you sure you want to reset all accessibility settings to defaults? '
      )
    ) {
    resetSettings()

  
  };

  return (
    <any />
    <div />
    <div className="accessibility-settings bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full" /></div> : null
      <div className="flex flex-col md:flex-row h-full" />
    <div className="bg-gray-100 p-4 md:w-64" />
    <h2 className="text-xl font-bold text-gray-800 mb-4" />
    <nav className="space-y-1" />
    <button
              className={`flex items-center w-full px-3 py-0 whitespace-nowrap rounded-md text-left ${
    activeTab === 'visual'`
                  ? 'bg-blue-100 text-blue-700'` : null`
                  : 'text-gray-700 hover:bg-gray-200'```
  }`}
              onClick={() => setActiveTab('visual')}
            ></button>
              <Eye className="w-5 h-5 mr-3"  / />
    <span>Visual</span></button>`
``
      <button```
              className={`flex items-center w-full px-3 py-0 whitespace-nowrap rounded-md text-left ${
    activeTab === 'interface'`
                  ? 'bg-blue-100 text-blue-700'` : null`
                  : 'text-gray-700 hover:bg-gray-200'```
  }`}
              onClick={() => setActiveTab('interface')}
            ></button>
              <Monitor className="w-5 h-5 mr-3"  / />`
    <span>Interface</span>``
      <button```
              className={`flex items-center w-full px-3 py-0 whitespace-nowrap rounded-md text-left ${
    activeTab === 'audio'`
                  ? 'bg-blue-100 text-blue-700'` : null`
                  : 'text-gray-700 hover:bg-gray-200'```
  }`}
              onClick={() => setActiveTab('audio')}
            ></button>
              <Volume2 className="w-5 h-5 mr-3"  / />
    <span>Audio</span></button>`
``
      <button```
              className={`flex items-center w-full px-3 py-0 whitespace-nowrap rounded-md text-left ${
    activeTab === 'input'`
                  ? 'bg-blue-100 text-blue-700'` : null`
                  : 'text-gray-700 hover:bg-gray-200'```
  }`}
              onClick={() => setActiveTab('input')}
            ></button>
              <Keyboard className="w-5 h-5 mr-3"  / />`
    <span>Input</span>``
      <button```
              className={`flex items-center w-full px-3 py-0 whitespace-nowrap rounded-md text-left ${
    activeTab === 'language'`
                  ? 'bg-blue-100 text-blue-700'` : null`
                  : 'text-gray-700 hover:bg-gray-200'```
  }`}
              onClick={() => setActiveTab('language')}
            ></button>
              <Globe className="w-5 h-5 mr-3"  / />
    <span>Language</span></button>`
``
      <button```
              className={`flex items-center w-full px-3 py-0 whitespace-nowrap rounded-md text-left ${
    activeTab === 'help'`
                  ? 'bg-blue-100 text-blue-700'` : null`
                  : 'text-gray-700 hover:bg-gray-200'```
  }`}
              onClick={() => setActiveTab('help')}
            ></button>
              <HelpCircle className="w-5 h-5 mr-3"  / />
    <span>Help</span>

          <div className="mt-6" />
    <button
              className="flex items-center w-full px-3 py-0 whitespace-nowrap rounded-md text-left text-red-600 hover:bg-red-50"
              onClick={handleReset} />
    <RotateCcw className="w-5 h-5 mr-3"  / />
    <span>Reset All</span>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto" />
    <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              / />
    <h3 className="text-lg font-semibold text-gray-800 mb-4" /></h3>
              {/* Font Size */}
              <div className="mb-6" />
    <label className="block text-sm font-medium text-gray-700 mb-2" />
    <div className="grid grid-cols-4 gap-2" />`
    <button``
                      key={size}```
                      className={`px-4 py-0 whitespace-nowrap rounded-md border ${
    settings.fontSize === size`
                          ? 'bg-blue-100 border-blue-500 text-blue-700'` : null`
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'```
  }`}
                      onClick={() => handleChange('fontSize', size)}`
                    ></button>``
                      <span``
                        className={null}
                        ${size === 'small' ? 'text-sm' : ''}
                        ${size === 'medium' ? 'text-base' : ''}`
                        ${size === 'large' ? 'text-lg' : ''}``
                        ${size === 'x-large' ? 'text-xl' : ''}```
                      `} /></span>
    </>
  ))}

              {/* Color Mode */}
              <div className="mb-6" />
    <label className="block text-sm font-medium text-gray-700 mb-2" /></label>
                  Color Mode

                <div className="grid grid-cols-2 gap-2" /></div>
        {[
    { id: 'default', name: 'Default' },
                    { id: 'high-contrast', name: 'High Contrast' },
                    { id: 'dark', name: 'Dark Mode' },
                    { id: 'light', name: 'Light Mode' },
  ].map(mode => (
      </div></button>
`
                    <button``
                      key={mode.id}```
                      className={`px-4 py-0 whitespace-nowrap rounded-md border ${
    settings.colorMode === mode.id`
                          ? 'bg-blue-100 border-blue-500 text-blue-700'` : null`
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'```
  }`}
                      onClick={() => handleChange('colorMode', mode.id)}
                    >
                      {mode.name}
                  ))}

              {/* Color Blind Mode */}</button>
              <div className="mb-6" />
    <label className="block text-sm font-medium text-gray-700 mb-2" /></label>
                  Color Blind Mode

                <div className="grid grid-cols-2 gap-2" /></div>
        {[
    { id: 'none', name: 'None' },
                    { id: 'protanopia', name: 'Protanopia' },
                    { id: 'deuteranopia', name: 'Deuteranopia' },
                    { id: 'tritanopia', name: 'Tritanopia' },
                    { id: 'achromatopsia', name: 'Achromatopsia' },
  ].map(mode => (`
      </div><button``
                      key={mode.id}```
                      className={`px-4 py-0 whitespace-nowrap rounded-md border ${
    settings.colorBlindMode === mode.id`
                          ? 'bg-blue-100 border-blue-500 text-blue-700'` : null`
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'```
  }`}
                      onClick={() => handleChange('colorBlindMode', mode.id)}
                    >
                      {mode.name}
                  ))}

              {/* Motion & Transparency */}</button>
              <div className="mb-6 space-y-4" />
    <div className="flex items-center" />
    <input
                    id="reduceMotion"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.reduceMotion}
                    onChange={null}
                      handleChange('reduceMotion', e.target.checked)}
                  />
                  <label
                    htmlFor="reduceMotion"
                    className="ml-2 block text-sm text-gray-700" /></label>
                    Reduce motion and animations

                <div className="flex items-center" />
    <input
                    id="reduceTransparency"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.reduceTransparency}
                    onChange={null}
                      handleChange('reduceTransparency', e.target.checked)}
                  />
                  <label
                    htmlFor="reduceTransparency"
                    className="ml-2 block text-sm text-gray-700" /></label>
                    Reduce transparency effects



          )}
          {/* Interface Settings */}
          {activeTab === 'interface' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              / />
    <h3 className="text-lg font-semibold text-gray-800 mb-4" /></h3>
                Interface Settings

              {/* Interface Complexity */}
              <div className="mb-6" />
    <label className="block text-sm font-medium text-gray-700 mb-2" /></label>
                  Interface Complexity

                <div className="space-y-2" /></div>
        {[
    {
    id: 'simple',
                      name: 'Simple',
                      description:
                        'Minimal interface with essential features only'
  },
                    {
    id: 'standard',
                      name: 'Standard',
                      description: 'Default interface with balanced features'
  },
                    {
    id: 'advanced',
                      name: 'Advanced',
                      description:
                        'Full interface with all features and options'
  }
  ].map(option => (`
      </div><div``
                      key={option.id}```
                      className={`p-3 rounded-md border ${
    settings.interfaceComplexity === option.id`
                          ? 'bg-blue-50 border-blue-500'` : null`
                          : 'border-gray-300 hover:bg-gray-50'```
  }`}
                      onClick={null}
        handleChange('interfaceComplexity', option.id)}
                    >`
    <div className="flex items-center" /></div>``
                        <div```
                          className={`w-4 h-4 rounded-full border ${
    settings.interfaceComplexity === option.id`
                              ? 'bg-blue-500 border-blue-500'` : null`
                              : 'border-gray-400'```
  }`} /></div>
        {settings.interfaceComplexity === option.id && (
      </div><Check className="w-4 h-4 text-white"  / /></Check>
                          )}
                        <span className="ml-2 font-medium text-gray-800" /></span>
                          {option.name}

                      <p className="mt-1 text-sm text-gray-600 ml-6" /></p>
                        {option.description}

                  ))}

              {/* Screen Reader Optimization */}
              <div className="mb-6" />
    <div className="flex items-center" />
    <input
                    id="screenReaderOptimized"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.screenReaderOptimized}
                    onChange={null}
                      handleChange('screenReaderOptimized', e.target.checked)}
                  />
                  <label
                    htmlFor="screenReaderOptimized"
                    className="ml-2 block text-sm text-gray-700" /></label>
                    Optimize for screen readers

                <p className="mt-1 text-xs text-gray-500 ml-6" /></p>
                  Enhances compatibility with screen readers by adding
                  additional ARIA labels and improving navigation

              {/* Guided Experience */}
              <div className="mb-6 space-y-4" />
    <div className="flex items-center" />
    <input
                    id="showTutorials"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.showTutorials}
                    onChange={null}
                      handleChange('showTutorials', e.target.checked)}
                  />
                  <label
                    htmlFor="showTutorials"
                    className="ml-2 block text-sm text-gray-700" /></label>
                    Show tutorials for new features

                <div className="flex items-center" />
    <input
                    id="showContextualHelp"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.showContextualHelp}
                    onChange={null}
                      handleChange('showContextualHelp', e.target.checked)}
                  />
                  <label
                    htmlFor="showContextualHelp"
                    className="ml-2 block text-sm text-gray-700" /></label>
                    Show contextual help and tooltips



          )}
          {/* Audio Settings */}
          {activeTab === 'audio' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              / />
    <h3 className="text-lg font-semibold text-gray-800 mb-4" /></h3>
                Audio Settings

              <div className="mb-6 space-y-4" />
    <div className="flex items-center" />
    <input
                    id="enableSoundEffects"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.enableSoundEffects}
                    onChange={null}
                      handleChange('enableSoundEffects', e.target.checked)}
                  />
                  <label
                    htmlFor="enableSoundEffects"
                    className="ml-2 block text-sm text-gray-700" /></label>
                    Enable sound effects

                <div className="flex items-center" />
    <input
                    id="enableVoiceAnnouncements"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.enableVoiceAnnouncements}
                    onChange={null}
                      handleChange('enableVoiceAnnouncements', e.target.checked)}
                  />
                  <label
                    htmlFor="enableVoiceAnnouncements"
                    className="ml-2 block text-sm text-gray-700" /></label>
                    Enable voice announcements


              {settings.enableVoiceAnnouncements && (
                <div className="mb-6" />
    <label className="block text-sm font-medium text-gray-700 mb-2" /></label>
                    Voice Announcement Volume

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    value={settings.voiceVolume || 80}
                    onChange={null}
                      handleChange('voiceVolume', parseInt(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1" />
    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>

    </>
  )}

          )}
          {/* Input Settings */}
          {activeTab === 'input' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              / />
    <h3 className="text-lg font-semibold text-gray-800 mb-4" /></h3>
                Input Settings

              {/* Keyboard Navigation */}
              <div className="mb-6" />
    <div className="flex items-center" />
    <input
                    id="enhancedKeyboardNavigation"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.enhancedKeyboardNavigation}
                    onChange={null}
                      )}
                  />
                  <label
                    htmlFor="enhancedKeyboardNavigation"
                    className="ml-2 block text-sm text-gray-700" /></label>
                    Enhanced keyboard navigation

                <p className="mt-1 text-xs text-gray-500 ml-6" /></p>
                  Improves keyboard navigation with additional shortcuts and
                  focus indicators

              {/* Touch Target Size */}
              <div className="mb-6" />
    <label className="block text-sm font-medium text-gray-700 mb-2" /></label>
                  Touch Target Size

                <div className="grid grid-cols-3 gap-2" /></div>
        {['small', 'medium', 'large'].map(size => (
      </div></button>
`
                    <button``
                      key={size}```
                      className={`px-4 py-0 whitespace-nowrap rounded-md border ${
    settings.touchTargetSize === size`
                          ? 'bg-blue-100 border-blue-500 text-blue-700'` : null`
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'```
  }`}
                      onClick={() => handleChange('touchTargetSize', size)}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                  ))}</button>
                <p className="mt-1 text-xs text-gray-500" /></p>
                  Adjusts the size of buttons and interactive elements for
                  easier touch interaction


          )}
          {/* Language Settings */}
          {activeTab === 'language' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              / />
    <h3 className="text-lg font-semibold text-gray-800 mb-4" /></h3>
                Language Settings

              {/* Language Selection */}
              <div className="mb-6" />
    <label className="block text-sm font-medium text-gray-700 mb-2" /></label>
                  Interface Language

                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={settings.language}
                  onChange={e => handleChange('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                  <option value="ko">한국어</option>
                  <option value="pt">Português</option>
                  <option value="ru">Русский</option>

              {/* Terminology Preferences */}
              <div className="mb-6" />
    <label className="block text-sm font-medium text-gray-700 mb-2" /></label>
                  Terminology Preferences

                <div className="space-y-2" /></div>
        {[
    {
    id: 'standard',
                      name: 'Standard',
                      description: 'Use standard card game terminology'
  },
                    {
    id: 'simplified',
                      name: 'Simplified',
                      description: 'Use simplified terms for beginners'
  },
                    {
    id: 'technical',
                      name: 'Technical',
                      description: 'Use precise technical terminology'
  }
  ].map(option => (`
      </div><div``
                      key={option.id}```
                      className={`p-3 rounded-md border ${
    (settings.terminologyPreference || 'standard') ===
                        option.id`
                          ? 'bg-blue-50 border-blue-500'` : null`
                          : 'border-gray-300 hover:bg-gray-50'```
  }`}
                      onClick={null}
        handleChange('terminologyPreference', option.id)}
                    >`
    <div className="flex items-center" /></div>``
                        <div```
                          className={`w-4 h-4 rounded-full border ${
    (settings.terminologyPreference || 'standard') ===
                            option.id`
                              ? 'bg-blue-500 border-blue-500'` : null`
                              : 'border-gray-400'```
  }`} /></div>
        {(settings.terminologyPreference || 'standard') ===
                            option.id && (
      </div><Check className="w-4 h-4 text-white"  / /></Check>
                          )}
                        <span className="ml-2 font-medium text-gray-800" /></span>
                          {option.name}

                      <p className="mt-1 text-sm text-gray-600 ml-6" /></p>
                        {option.description}

                  ))}


          )}
          {/* Help Settings */}
          {activeTab === 'help' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              / />
    <h3 className="text-lg font-semibold text-gray-800 mb-4" /></h3>
                Help & Support

              <div className="space-y-4" />
    <div className="bg-blue-50 p-4 rounded-lg" />
    <h4 className="font-medium text-blue-800 mb-2" /></h4>
                    Accessibility Support

                  <p className="text-sm text-blue-700 mb-3" /></p>
                    If you need additional accessibility accommodations or have
                    feedback, please contact our support team.

                  <a
                    href="mailto:accessibility@example.com"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                    / />
    <MessageSquare className="w-4 h-4 mr-1"  / /></MessageSquare>
                    Contact Accessibility Support

                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200" />
    <div className="p-4" />
    <h4 className="font-medium text-gray-800 mb-1" /></h4>
                      Keyboard Shortcuts

                    <p className="text-sm text-gray-600" /></p>
                      View and customize keyboard shortcuts for navigation and
                      actions

                    <button className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800" /></button>
                      View Shortcuts
                      <ChevronRight className="w-4 h-4 ml-1"  / />
    <div className="p-4" />
    <h4 className="font-medium text-gray-800 mb-1" /></h4>
                      Accessibility Guide

                    <p className="text-sm text-gray-600" /></p>
                      Learn about all accessibility features and how to use them

                    <button className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800" /></button>
                      Open Guide
                      <ChevronRight className="w-4 h-4 ml-1"  / />
    <div className="p-4" />
    <h4 className="font-medium text-gray-800 mb-1" /></h4>
                      Screen Reader Tips

                    <p className="text-sm text-gray-600" /></p>
                      Tips for using the application with screen readers

                    <button className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800" /></button>
                      View Tips
                      <ChevronRight className="w-4 h-4 ml-1"  / /></ChevronRight>
          )}

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-0 whitespace-nowrap flex justify-end" />
    <button
          className="px-4 py-0 whitespace-nowrap bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onClose} /></button>
          Save & Close


  )
};`
``
export default AccessibilitySettings;```