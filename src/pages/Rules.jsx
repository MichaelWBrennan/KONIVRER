/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Shield } from 'lucide-react';
import PDFViewer from '../components/PDFViewer';
import ErrorBoundary from '../components/ErrorBoundary';

const Rules = () => {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    {
      id: 'basic',
      label: 'Basic Rules',
      icon: FileText,
      pdfUrl: '/assets/konivrer-rules.pdf',
      description: 'Core game mechanics and rules'
    },
    {
      id: 'tournament',
      label: 'Tournament Rules',
      icon: Users,
      pdfUrl: '/assets/konivrer-tournament-rules.pdf',
      description: 'Official tournament guidelines and procedures'
    },
    {
      id: 'conduct',
      label: 'Code of Conduct',
      icon: Shield,
      pdfUrl: '/assets/konivrer-code-of-conduct.pdf',
      description: 'Community standards and behavior guidelines'
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 border border-white/20"
          >
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">KONIVRER Rules & Guidelines</h1>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Description */}
            <div className="bg-blue-500/20 backdrop-blur-md rounded-lg p-4 border border-blue-500/30">
              <h2 className="text-lg font-semibold text-white mb-2">{activeTabData?.label}</h2>
              <p className="text-gray-300 text-sm mb-3">{activeTabData?.description}</p>
              
              {/* Show KONIVRER Basic Rules only for the basic rules tab */}
              {activeTab === 'basic' && (
                <div className="text-gray-300 text-sm space-y-1">
                  <p>• No artifacts or sorceries - Everything can be cast at instant speed</p>
                  <p>• All familiars have haste and vigilance</p>
                  <p>• No graveyard - Only a removed from play zone</p>
                  <p>• Power and toughness are combined into one stat called "strength"</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* PDF Viewer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            key={activeTab} // Force re-render when tab changes
          >
            <PDFViewer pdfUrl={activeTabData?.pdfUrl} showHeader={false} />
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Rules;
