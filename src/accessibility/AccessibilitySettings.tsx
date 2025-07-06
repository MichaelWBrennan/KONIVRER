/**
 * Accessibility Settings Component
 * 
 * Provides comprehensive accessibility customization options for users.
 * 
 * @version 2.0.0
 * @since 2024-07-06
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Type,
  Monitor,
  Volume2,
  Keyboard,
  Hand,
  HelpCircle,
  RotateCcw,
  Check,
  ChevronRight,
  Globe,
  MessageSquare,
  X,
} from 'lucide-react';

// Types
interface AccessibilitySettingsProps {
  onClose: () => void;
}

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  contrast: 'normal' | 'high' | 'extra-high';
  colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  audioDescriptions: boolean;
  captions: boolean;
  language: string;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: any) => void;
  resetSettings: () => void;
}

// Mock hook for now - this would be implemented in AccessibilityProvider
const useAccessibility = (): AccessibilityContextType => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'medium',
    contrast: 'normal',
    colorBlindness: 'none',
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    audioDescriptions: false,
    captions: false,
    language: 'en',
  });

  const updateSetting = (key: keyof AccessibilitySettings, value: any): void => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = (): void => {
    setSettings({
      fontSize: 'medium',
      contrast: 'normal',
      colorBlindness: 'none',
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      focusIndicators: true,
      audioDescriptions: false,
      captions: false,
      language: 'en',
    });
  };

  return { settings, updateSetting, resetSettings };
};

/**
 * Accessibility Settings Component
 */
const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ onClose }) => {
  const { settings, updateSetting, resetSettings } = useAccessibility();
  const [activeTab, setActiveTab] = useState<string>('visual');

  const handleChange = (key: keyof AccessibilitySettings, value: any): void => {
    updateSetting(key, value);
  };

  const handleReset = (): void => {
    if (window.confirm('Are you sure you want to reset all accessibility settings to defaults?')) {
      resetSettings();
    }
  };

  const tabs = [
    { id: 'visual', label: 'Visual', icon: Eye },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'motor', label: 'Motor', icon: Hand },
    { id: 'cognitive', label: 'Cognitive', icon: MessageSquare },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Accessibility Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close accessibility settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 pt-6 border-t">
              <button
                onClick={handleReset}
                className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {activeTab === 'visual' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Visual Accessibility</h3>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['small', 'medium', 'large', 'extra-large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => handleChange('fontSize', size)}
                        className={`p-3 border rounded-lg text-center transition-all ${
                          settings.fontSize === size
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Type className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-xs capitalize">{size.replace('-', ' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contrast */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contrast
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['normal', 'high', 'extra-high'].map((contrast) => (
                      <button
                        key={contrast}
                        onClick={() => handleChange('contrast', contrast)}
                        className={`p-3 border rounded-lg text-center transition-all ${
                          settings.contrast === contrast
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Monitor className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-xs capitalize">{contrast.replace('-', ' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Blindness */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Vision Support
                  </label>
                  <select
                    value={settings.colorBlindness}
                    onChange={(e) => handleChange('colorBlindness', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="none">No color vision issues</option>
                    <option value="protanopia">Protanopia (Red-blind)</option>
                    <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                    <option value="tritanopia">Tritanopia (Blue-blind)</option>
                  </select>
                </div>

                {/* Reduced Motion */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Reduce Motion</label>
                    <p className="text-xs text-gray-500">Minimize animations and transitions</p>
                  </div>
                  <button
                    onClick={() => handleChange('reducedMotion', !settings.reducedMotion)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Audio Accessibility</h3>

                {/* Screen Reader */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Screen Reader Support</label>
                    <p className="text-xs text-gray-500">Enhanced compatibility with screen readers</p>
                  </div>
                  <button
                    onClick={() => handleChange('screenReader', !settings.screenReader)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.screenReader ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.screenReader ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Audio Descriptions */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Audio Descriptions</label>
                    <p className="text-xs text-gray-500">Descriptive audio for visual content</p>
                  </div>
                  <button
                    onClick={() => handleChange('audioDescriptions', !settings.audioDescriptions)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.audioDescriptions ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.audioDescriptions ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Captions */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Captions</label>
                    <p className="text-xs text-gray-500">Show captions for audio content</p>
                  </div>
                  <button
                    onClick={() => handleChange('captions', !settings.captions)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.captions ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.captions ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'motor' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Motor Accessibility</h3>

                {/* Keyboard Navigation */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Keyboard Navigation</label>
                    <p className="text-xs text-gray-500">Enhanced keyboard navigation support</p>
                  </div>
                  <button
                    onClick={() => handleChange('keyboardNavigation', !settings.keyboardNavigation)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.keyboardNavigation ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.keyboardNavigation ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Focus Indicators */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Focus Indicators</label>
                    <p className="text-xs text-gray-500">Enhanced visual focus indicators</p>
                  </div>
                  <button
                    onClick={() => handleChange('focusIndicators', !settings.focusIndicators)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.focusIndicators ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.focusIndicators ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'cognitive' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Cognitive Accessibility</h3>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                    <option value="pt">Português</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                    <option value="zh">中文</option>
                  </select>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Additional Support</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        For additional cognitive accessibility features, please contact our support team.
                        We're continuously working to improve accessibility for all users.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Check className="w-4 h-4 text-green-600" />
            <span>Settings saved automatically</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AccessibilitySettings;