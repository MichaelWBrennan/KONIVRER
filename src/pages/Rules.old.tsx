import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, FileText } from 'lucide-react';
import EnhancedPDFViewer from '../components/EnhancedPDFViewer';
import ErrorBoundary from '../components/ErrorBoundary';

const Rules = (): any => {
  const [activeTab, setActiveTab] = useState('basic');
  const tabs = [
    {
      id: 'basic',
      label: 'Basic Rules',
      icon: FileText,
      pdfUrl: '/assets/konivrer-rules.pdf',
      title: 'KONIVRER Basic Rules',
      description: 'Core game mechanics and rules'
    },
    {
      id: 'tournament',
      label: 'Tournament Rules',
      icon: Users,
      pdfUrl: '/assets/konivrer-tournament-rules.pdf',
      title: 'KONIVRER Tournament Rules',
      description: 'Official tournament guidelines and procedures'
    },
    {
      id: 'conduct',
      label: 'Code of Conduct',
      icon: Shield,
      pdfUrl: '/assets/konivrer-code-of-conduct.pdf',
      title: 'KONIVRER Code of Conduct',
      description: 'Community standards and behavior guidelines'
    }
  ];
  
  const activeTabData = tabs.find(tab => tab.id === activeTab);
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 border border-white/20"
           />
            <div className="flex flex-wrap gap-2 justify-center"></div>
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
                    <span className="font-medium">{tab.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
          
          {/* PDF Viewer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            key={activeTab} // Force re-render when tab changes
           />
            <EnhancedPDFViewer 
              pdfUrl={activeTabData?.pdfUrl} 
              title={activeTabData?.title} />
          </motion.div>
        </div>
    </ErrorBoundary>
  );
};

export default Rules;