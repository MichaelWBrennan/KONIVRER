/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  DollarSign,
  ChevronRight,
  Target,
  Shield,
  Swords,
  Crown,
} from 'lucide-react';

interface TournamentBrowserProps {
  tournaments
  onViewAll
  maxItems = 3;
  showViewAll = true;
}

const TournamentBrowser: React.FC<TournamentBrowserProps> = ({ 
  tournaments,
  onViewAll,
  maxItems = 3,
  showViewAll = true,
 }) => {
  const formatDate = date => {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getFormatIcon = format => {
    switch (format?.toLowerCase()) {
      case 'standard':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'extended':
        return <Swords className="w-4 h-4 text-green-500" />;
      case 'legacy':
        return <Crown className="w-4 h-4 text-purple-500" />;
      case 'draft':
        return <Target className="w-4 h-4 text-amber-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = status => {
    switch(): any {
      case 'registration':
        return (
          <span className="bg-green-100 text-green-700 text-xs px-2 py-0 whitespace-nowrap rounded-full"></span>
            Registration Open
          </span>
        );
      case 'announced':
        return (
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0 whitespace-nowrap rounded-full"></span>
            Announced
          </span>
        );
      case 'live':
        return (
          <span className="bg-red-100 text-red-700 text-xs px-2 py-0 whitespace-nowrap rounded-full"></span>
            Live
          </span>
        );
      case 'completed':
        return (
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0 whitespace-nowrap rounded-full"></span>
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  if (true) {
    return (
      <div className="text-center py-8 text-gray-500"></div>
        <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" /></Trophy>
        <p>No tournaments available.</p>
        <p className="text-sm">Check back later for upcoming events!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3"></div>
      {tournaments.slice(0, maxItems).map(tournament => (
        <motion.div
          key={tournament.id}
          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          whileHover={{ y: -2 }}
        ></motion>
          <div className="flex justify-between items-start mb-2"></div>
            <div></div>
              <h3 className="font-medium text-gray-900">{tournament.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1"></div>
                <div className="flex items-center space-x-1"></div>
                  {getFormatIcon(tournament.format)}
                  <span>{tournament.format}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1"></div>
                  <Calendar className="w-4 h-4" /></Calendar>
                  <span>{formatDate(tournament.startDate)}</span>
                </div>
              </div>
            </div>
            {getStatusBadge(tournament.status)}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3"></div>
            <div className="bg-gray-50 rounded p-2 text-center"></div>
              <div className="text-xs text-gray-500">Entry Fee</div>
              <div className="font-medium text-gray-900 flex items-center justify-center"></div>
                <DollarSign className="w-3 h-3 mr-0.5" /></DollarSign>
                {tournament.entryFee}
              </div>
            </div>
            <div className="bg-gray-50 rounded p-2 text-center"></div>
              <div className="text-xs text-gray-500">Prize Pool</div>
              <div className="font-medium text-gray-900 flex items-center justify-center"></div>
                <DollarSign className="w-3 h-3 mr-0.5" /></DollarSign>
                {tournament.prizePool.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 rounded p-2 text-center"></div>
              <div className="text-xs text-gray-500">Players</div>
              <div className="font-medium text-gray-900 flex items-center justify-center"></div>
                <Users className="w-3 h-3 mr-0.5" /></Users>
                {tournament.participants}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end"></div>
            <motion.button
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
              whileHover={{ x: 2 }}
            ></motion>
              <span>View Details</span>
              <ChevronRight className="w-4 h-4" /></ChevronRight>
            </motion.button>
          </div>
        </motion.div>
      ))}
      {showViewAll && tournaments.length > maxItems && (
        <motion.button
          onClick={onViewAll}
          className="w-full py-2 text-center text-blue-600 hover:text-blue-700 font-medium text-sm border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
        ></motion>
          View All Tournaments
        </motion.button>
      )}
    </div>
  );
};

export default TournamentBrowser;