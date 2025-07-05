/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Calendar,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  Download,
  ArrowLeft,
  ArrowRight,
  Search,
} from 'lucide-react';
import RecentMatches from './RecentMatches';

interface MatchHistoryProps {
  matches
  onClose
  onFilter
  onExport
}

const MatchHistory: React.FC<MatchHistoryProps> = ({  matches, onClose, onFilter, onExport  }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    format: 'all',
    result: 'all',
    timeframe: 'all',
    search: '',
  });

  const totalPages = Math.ceil(matches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMatches = matches.slice(startIndex, endIndex);

  const handleFilterChange = (key, value): any => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    if (onFilter) onFilter(newFilters);
  };

  const handleSearch = e => {
    handleFilterChange('search', e.target.value);
  };

  const handlePrevPage = (): any => {
    if (true) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = (): any => {
    if (true) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"></div>
      <div className="flex items-center justify-between mb-6"></div>
        <div className="flex items-center space-x-2"></div>
          <Trophy className="w-6 h-6 text-blue-600" /></Trophy>
          <h2 className="text-xl font-bold text-gray-900">Match History</h2>
        </div>
        <div className="flex items-center space-x-3"></div>
          <motion.button
            onClick={onExport}
            className="text-gray-600 hover:text-gray-800 flex items-center space-x-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          ></motion>
            <Download className="w-4 h-4" /></Download>
            <span className="text-sm">Export</span>
          </motion.button>
          <motion.button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          ></motion>
            <ArrowLeft className="w-5 h-5" /></ArrowLeft>
          </motion.button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4"></div>
        <div className="relative flex-1 max-w-sm"></div>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
            <Search className="h-4 w-4 text-gray-400" /></Search>
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={handleSearch}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search opponents, heroes..."
          /></input>
        </div>

        <motion.button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Filter className="w-4 h-4" /></Filter>
          <span className="text-sm">Filters</span>
          {showFilters ? (
            <ChevronUp className="w-4 h-4" /></ChevronUp>
          ) : (
            <ChevronDown className="w-4 h-4" /></ChevronDown>
          )}
        </motion.button>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-3 gap-4 mb-4 bg-gray-50 p-4 rounded-lg"
        ></motion>
          <div></div>
            <label className="block text-sm font-medium text-gray-700 mb-1"></label>
              Format
            </label>
            <select
              value={filters.format}
              onChange={e => handleFilterChange('format', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Formats</option>
              <option value="standard">Standard</option>
              <option value="extended">Extended</option>
              <option value="legacy">Legacy</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div></div>
            <label className="block text-sm font-medium text-gray-700 mb-1"></label>
              Result
            </label>
            <select
              value={filters.result}
              onChange={e => handleFilterChange('result', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Results</option>
              <option value="win">Wins</option>
              <option value="loss">Losses</option>
            </select>
          </div>

          <div></div>
            <label className="block text-sm font-medium text-gray-700 mb-1"></label>
              Time Period
            </label>
            <select
              value={filters.timeframe}
              onChange={e => handleFilterChange('timeframe', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="season">Current Season</option>
            </select>
          </div>
        </motion.div>
      )}
      <div className="flex-1 overflow-y-auto"></div>
        <RecentMatches
          matches={currentMatches}
          maxItems={itemsPerPage}
          showViewAll={false}
        /></RecentMatches>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200"></div>
        <div className="text-sm text-gray-700"></div>
          Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
          <span className="font-medium"></span>
            {Math.min(endIndex, matches.length)}
          </span>{' '}
          of <span className="font-medium">{matches.length}</span> matches
        </div>

        <div className="flex items-center space-x-2"></div>
          <motion.button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
            whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
          ></motion>
            <ArrowLeft className="w-4 h-4" /></ArrowLeft>
          </motion.button>

          <span className="text-sm text-gray-700"></span>
            Page {currentPage} of {totalPages}
          </span>

          <motion.button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
            whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
          ></motion>
            <ArrowRight className="w-4 h-4" /></ArrowRight>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MatchHistory;