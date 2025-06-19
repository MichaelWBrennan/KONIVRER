import {
  PlusCircle,
  Database,
  BookOpen,
  TrendingUp,
  Users,
  Zap,
  Trophy,
  Shield,
  Calendar,
  Target,
  Clock,
  User,
  Layers,
  Star,
  ArrowRight,
  Sparkles,
  Gamepad2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';

const Home = () => {
  const { stats, recentActivity, getRecentDecks } = useData();

  const features = [
    {
      icon: Database,
      title: 'Cards',
      description:
        'Browse and search through all KONIVRER cards with advanced filtering and search capabilities in one unified interface.',
      link: '/cards',
      gradient: 'from-blue-500 to-cyan-600',
      delay: 0.1,
    },
    {
      icon: Layers,
      title: 'Decks',
      description:
        'Build, manage, and discover decks with our comprehensive deck management tools and intuitive interface.',
      link: '/decklists',
      gradient: 'from-purple-500 to-pink-600',
      delay: 0.2,
    },
    {
      icon: Trophy,
      title: 'Tournaments',
      description:
        'Join tournaments, compete in events, track your progress on leaderboards, and analyze your performance.',
      link: '/tournaments',
      gradient: 'from-yellow-500 to-orange-600',
      delay: 0.3,
    },
    {
      icon: Users,
      title: 'Community',
      description:
        'Connect with other players, explore the hall of fame, and find local game stores in your area.',
      link: '/social',
      gradient: 'from-green-500 to-emerald-600',
      delay: 0.4,
    },
    {
      icon: BookOpen,
      title: 'Resources',
      description:
        'Dive into the lore, stay updated with product releases, and analyze the current meta trends.',
      link: '/lore',
      gradient: 'from-indigo-500 to-purple-600',
      delay: 0.5,
    },
    {
      icon: Shield,
      title: 'Judge Center',
      description:
        'Access judge center and administrative tools for certified judges and tournament organizers.',
      link: '/judge-center',
      gradient: 'from-red-500 to-pink-600',
      delay: 0.6,
    },
  ];

  // Dynamic stats from real data
  const dynamicStats = [
    {
      label: 'Total Cards',
      value: stats.totalCards.toLocaleString(),
      icon: Database,
    },
    {
      label: 'Active Players',
      value:
        stats.activePlayers > 1000
          ? `${(stats.activePlayers / 1000).toFixed(1)}K+`
          : `${stats.activePlayers}+`,
      icon: Users,
    },
    {
      label: 'Tournaments',
      value: `${stats.tournaments}+`,
      icon: Trophy,
    },
    {
      label: 'Certified Judges',
      value: `${stats.certifiedJudges}+`,
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Enhanced Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-center mb-6">
              Master the Elements
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-success animate-fade-in">
                with KONIVRER
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-secondary text-center max-w-4xl mx-auto mb-8 leading-relaxed">
              Build powerful decks, discover new strategies, and compete in
              official tournaments in the ultimate elemental card game platform.
              Experience enhanced readability with OpenDyslexic font and modern,
              accessible design principles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/tournaments" className="btn btn-primary btn-lg group">
                <Trophy
                  size={24}
                  className="group-hover:scale-110 transition-transform"
                />
                Compete Now
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link to="/decklists" className="btn btn-secondary btn-lg group">
                <Layers
                  size={24}
                  className="group-hover:scale-110 transition-transform"
                />
                Explore Decks
              </Link>
              <Link to="/cards" className="btn btn-outline btn-lg group">
                <Database
                  size={24}
                  className="group-hover:scale-110 transition-transform"
                />
                Browse Cards
              </Link>
            </div>
          </motion.div>

          {/* Hero Features Grid */}
          <div className="hero-features">
            <motion.div
              className="hero-feature"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="hero-feature-icon">
                <Sparkles size={28} />
              </div>
              <h3 className="hero-feature-title">Modern Design</h3>
              <p className="hero-feature-description">
                Beautiful, accessible interface with OpenDyslexic font for
                enhanced readability
              </p>
            </motion.div>

            <motion.div
              className="hero-feature"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="hero-feature-icon">
                <Gamepad2 size={28} />
              </div>
              <h3 className="hero-feature-title">Competitive Play</h3>
              <p className="hero-feature-description">
                Join tournaments, analyze matches, and climb the competitive
                ladder
              </p>
            </motion.div>

            <motion.div
              className="hero-feature"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="hero-feature-icon">
                <Star size={28} />
              </div>
              <h3 className="hero-feature-title">Deck Discovery</h3>
              <p className="hero-feature-description">
                Explore winning decklists and discover new strategies from top
                players
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
        <div className="container relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Join the Community
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Be part of a thriving community of players, builders, and
              competitors
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {dynamicStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="text-center group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="glass-card p-6 hover:transform hover:scale-105 transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                      <Icon size={28} className="text-white" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2 font-mono">
                      {stat.value}
                    </div>
                    <div className="text-sm text-secondary font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-primary relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
        <div className="container relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
              Powerful tools and features designed to enhance your KONIVRER
              experience with modern design and accessibility in mind.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: feature.delay }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Link
                    to={feature.link}
                    className="card card-interactive h-full flex flex-col relative overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, var(--accent-primary), var(--accent-purple))`,
                      }}
                    ></div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`w-14 h-14 bg-gradient-to-br ${feature.gradient || 'from-blue-500 to-purple-600'} rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
                        >
                          <Icon size={28} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-primary group-hover:text-blue-400 transition-colors">
                            {feature.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-secondary text-sm leading-relaxed mb-4 flex-1">
                        {feature.description}
                      </p>

                      <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                        <span>Explore</span>
                        <ArrowRight
                          size={16}
                          className="ml-2 group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Recent Activity Section */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5"></div>
        <div className="container relative z-10">
          <motion.div
            className="flex items-center justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">
                Recent Activity
              </h2>
              <p className="text-secondary">
                See what the community is building
              </p>
            </div>
            <Link to="/decklists" className="btn btn-ghost">
              View All
              <TrendingUp size={16} />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card hover:border-accent-primary transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {activity.type === 'deck_created' ? (
                        <PlusCircle size={20} className="text-white" />
                      ) : activity.type === 'tournament_started' ? (
                        <Trophy size={20} className="text-white" />
                      ) : (
                        <User size={20} className="text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-primary">
                        {activity.title}
                      </div>
                      <div className="text-sm text-secondary">
                        by {activity.user}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-secondary mb-4 leading-relaxed">
                    {activity.description}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>
                      {activity.cardCount && `${activity.cardCount} cards`}
                      {activity.participants &&
                        `${activity.participants} players`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(activity.timestamp).toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="glass-card max-w-md mx-auto">
                  <TrendingUp
                    size={64}
                    className="mx-auto mb-4 text-blue-400 opacity-50"
                  />
                  <h3 className="text-xl font-bold text-primary mb-2">
                    No Recent Activity
                  </h3>
                  <p className="text-secondary mb-6">
                    Start building decks to see activity here!
                  </p>
                  <Link to="/decklists" className="btn btn-primary">
                    <Layers size={16} />
                    Create Your First Deck
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20"></div>
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="container relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Ready to Master the Elements?
            </h2>
            <p className="text-xl text-secondary mb-8 leading-relaxed max-w-2xl mx-auto">
              Join thousands of players in the ultimate KONIVRER experience.
              Build decks, compete in tournaments, and become a legend.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/decklists" className="btn btn-primary btn-lg">
                <Layers size={24} />
                Start Building
                <ArrowRight size={20} />
              </Link>
              <Link to="/tournaments" className="btn btn-secondary btn-lg">
                <Trophy size={24} />
                Join Tournament
              </Link>
              <Link to="/social" className="btn btn-ghost btn-lg">
                <Users size={24} />
                Join Community
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="glass-card">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  10K+
                </div>
                <div className="text-sm text-secondary">Active Players</div>
              </div>
              <div className="glass-card">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  500+
                </div>
                <div className="text-sm text-secondary">Daily Matches</div>
              </div>
              <div className="glass-card">
                <div className="text-3xl font-bold text-cyan-400 mb-2">50+</div>
                <div className="text-sm text-secondary">Weekly Tournaments</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export { Home };
export default Home;
