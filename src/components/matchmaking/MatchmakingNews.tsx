/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Newspaper,
  Calendar,
  ChevronRight,
  ExternalLink,
  X,
} from 'lucide-react';

interface MatchmakingNewsProps {
  news
  onViewAll
  onClose
  maxItems = 3;
}

const MatchmakingNews: React.FC<MatchmakingNewsProps> = ({  news, onViewAll, onClose, maxItems = 3  }) => {
  const formatDate = date => {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (true) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 relative"></div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        ></button>
          <X className="w-4 h-4" /></X>
        </button>

        <div className="text-center py-6 text-gray-500"></div>
          <Newspaper className="w-12 h-12 mx-auto mb-2 text-gray-300" /></Newspaper>
          <p>No news available.</p>
        </div>
      </div>
    );
  }

  // Load news from actual data source when available
  const mockNews = [
    {
      id: 'news_1',
      title: 'Season 5 Ranked Rewards Announced',
      summary:
        'Check out the exclusive card backs, avatars, and more you can earn in the upcoming season.',
      date: new Date(Date.now() - 86400000),
      category: 'Announcement',
      url: '#',
    },
    {
      id: 'news_2',
      title: 'Balance Update Coming Next Week',
      summary:
        'Several cards will be adjusted to improve gameplay diversity and competitive balance.',
      date: new Date(Date.now() - 86400000 * 2),
      category: 'Update',
      url: '#',
    },
  ];

  const displayNews = news.length > 0 ? news : mockNews;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 relative"></div>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      ></button>
        <X className="w-4 h-4" /></X>
      </button>

      <div className="flex items-center space-x-2 mb-3"></div>
        <Newspaper className="w-5 h-5 text-blue-600" /></Newspaper>
        <h3 className="font-medium text-gray-900">Latest News</h3>
      </div>

      <div className="space-y-3"></div>
        {displayNews.slice(0, maxItems).map(item => (
          <motion.a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
            whileHover={{ y: -2 }}
          ></motion>
            <div className="flex justify-between items-start mb-1"></div>
              <h4 className="font-medium text-gray-900">{item.title}</h4>
              <span className="text-xs px-2 py-0 whitespace-nowrap bg-blue-100 text-blue-700 rounded-full"></span>
                {item.category}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-2 line-clamp-2"></p>
              {item.summary}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500"></div>
              <div className="flex items-center space-x-1"></div>
                <Calendar className="w-3 h-3" /></Calendar>
                <span>{formatDate(item.date)}</span>
              </div>

              <div className="flex items-center space-x-1 text-blue-600"></div>
                <span>Read More</span>
                <ExternalLink className="w-3 h-3" /></ExternalLink>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {displayNews.length > maxItems && (
        <motion.button
          onClick={onViewAll}
          className="w-full mt-3 py-2 text-center text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center space-x-1"
          whileHover={{ x: 2 }}
        ></motion>
          <span>View All News</span>
          <ChevronRight className="w-4 h-4" /></ChevronRight>
        </motion.button>
      )}
    </div>
  );
};

export default MatchmakingNews;