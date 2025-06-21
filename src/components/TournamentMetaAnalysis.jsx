import React from 'react';
import {
  TrendingUp,
  Users,
  Trophy,
  Target,
  Calendar,
  MapPin,
  Award,
} from 'lucide-react';
import { motion } from 'framer-motion';

const TournamentMetaAnalysis = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center">
            <Trophy className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Tournament Statistics</h2>
            <p className="text-sm text-secondary">
              Competitive play insights and trends
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-background border border-color rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <p className="text-xs text-secondary">Active Players</p>
              <p className="text-xl font-bold">3,247</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp size={10} />
                +12.3%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background border border-color rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Trophy className="text-white" size={20} />
            </div>
            <div>
              <p className="text-xs text-secondary">Tournaments</p>
              <p className="text-xl font-bold">95</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp size={10} />
                +8.7%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background border border-color rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Award className="text-white" size={20} />
            </div>
            <div>
              <p className="text-xs text-secondary">Prize Pool</p>
              <p className="text-xl font-bold">$24,750</p>
              <p className="text-xs text-blue-500 flex items-center gap-1">
                <TrendingUp size={10} />
                +15.2%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Tournaments */}
      <div className="bg-background border border-color rounded-xl p-4">
        <h3 className="text-lg font-bold mb-4">Upcoming Tournaments</h3>
        <div className="space-y-3">
          {[
            {
              name: 'KONIVRER Championship Series',
              date: 'June 25, 2025',
              location: 'Online',
              players: 128,
              prizePool: '$5,000',
            },
            {
              name: 'Regional Qualifier',
              date: 'July 2, 2025',
              location: 'New York, NY',
              players: 64,
              prizePool: '$2,500',
            },
            {
              name: 'Community Cup',
              date: 'July 10, 2025',
              location: 'Online',
              players: 256,
              prizePool: '$1,000',
            },
          ].map((tournament, index) => (
            <div
              key={index}
              className="border border-color rounded-lg p-3 hover:bg-tertiary transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-sm">{tournament.name}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-xs text-secondary">
                      <Calendar className="w-3 h-3" />
                      <span>{tournament.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-secondary">
                      <MapPin className="w-3 h-3" />
                      <span>{tournament.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium">{tournament.prizePool}</div>
                  <div className="flex items-center gap-1 text-xs text-secondary mt-1">
                    <Users className="w-3 h-3" />
                    <span>{tournament.players} players</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all tournaments →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TournamentMetaAnalysis;