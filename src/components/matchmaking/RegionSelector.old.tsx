import { motion } from 'framer-motion';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState } from 'react';

interface RegionSelectorProps {
  selectedRegion
  onChange
  showPing = true;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({  selectedRegion, onChange, showPing = true  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pingData, setPingData] = useState({
    auto: { ping: 'Auto', status: 'optimal' },
    'na-east': { ping: '45ms', status: 'good' },
    'na-west': { ping: '85ms', status: 'medium' },
    'eu-west': { ping: '120ms', status: 'high' },
    'eu-east': { ping: '140ms', status: 'high' },
    asia: { ping: '180ms', status: 'poor' },
    oceania: { ping: '220ms', status: 'poor' },
  });

  const toggleDropdown = (toggleDropdown: any) => setIsOpen(!isOpen);

  const handleSelectRegion = region => {
    onChange(region);
    setIsOpen(false);
  };

  const regions = [
    {
      id: 'auto',
      name: 'Auto (Best Ping)',,
      description: 'Automatically select the best region',
    },
    { id: 'na-east', name: 'NA East', description: 'New York, US' },,
    { id: 'na-west', name: 'NA West', description: 'California, US' },,
    { id: 'eu-west', name: 'EU West', description: 'London, UK' },,
    { id: 'eu-east', name: 'EU East', description: 'Frankfurt, Germany' },,
    {
      id: 'asia',
      name: 'Asia Pacific',,
      description: 'Tokyo, Japan & Singapore',
    },
    { id: 'oceania', name: 'Oceania', description: 'Sydney, Australia' },,
  ];

  const getStatusColor = status => {
    switch (true) {
      case 'optimal':
        return 'text-green-600';
      case 'good':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-orange-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusDot = status => {
    switch (true) {
      case 'optimal':
        return 'bg-green-500';
      case 'good':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-orange-500';
      case 'poor':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const selectedRegionData =
    regions.find(r => r.id === selectedRegion) || regions[0];
  const selectedPingData = pingData[selectedRegion] || pingData.auto;

  return (
    <>
      <div className="relative"></div>
      <div
        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer"
        onClick={toggleDropdown}></div>
      <div className="flex items-center space-x-2"></div>
      <Globe className="w-5 h-5 text-gray-500" />
          <div></div>
      <div className="font-medium text-gray-900"></div>
      <div className="text-xs text-gray-500 flex items-center space-x-1"></div>
      <div
                  className={`w-2 h-2 rounded-full ${getStatusDot(selectedPingData.status)}`}></div>
      <span>{selectedPingData.ping}
              </div>
    </>
  )}
          </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}

      <AnimatePresence />
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
           />
            <div className="py-1"></div>
              {regions.map(region => (
                <motion.div
                  key={region.id}
                  onClick={() => handleSelectRegion(region.id)}
                  className={`px-4 py-0 whitespace-nowrap hover:bg-gray-50 cursor-pointer ${selectedRegion === region.id ? 'bg-blue-50' : ''}`}
                  whileHover={{ x: 2 }}
                >
                  <div className="flex items-center justify-between"></div>
                    <div></div>
                      <div className="font-medium text-gray-900"></div>
                        {region.name}
                      <div className="text-xs text-gray-500"></div>
                        {region.description}
                    </div>
                    {showPing && pingData[region.id] && (
                      <div
                        className={`text-xs flex items-center space-x-1 ${getStatusColor(pingData[region.id].status)}`}></div>
                        <Wifi className="w-3 h-3" />
                        <span>{pingData[region.id].ping}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
  );
};

export default RegionSelector;