
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';

const Home = () => {
  const { stats, recentActivity, getRecentDecks } = useData();

  const features = [
    {
      title: 'Game Platform',
      link: '/hub',
      delay: 0.1,
      featured: true,
    },
    {
      title: 'Tournaments',
      link: '/tournaments',
      delay: 0.3,
    },
    {
      title: 'Community',
      link: '/social',
      delay: 0.4,
    },
    {
      title: 'Resources',
      link: '/lore',
      delay: 0.5,
    },
    {
      title: 'Judge Center',
      link: '/judge-center',
      delay: 0.6,
    },
  ];

  // Dynamic stats from real data
  const dynamicStats = [
    {
      value: stats.totalCards.toLocaleString(),
    },
    {
      value:
        stats.activePlayers > 1000
          ? `${(stats.activePlayers / 1000).toFixed(1)}K+`
          : `${stats.activePlayers}+`,
    },
    {
      value: `${stats.tournaments}+`,
    },
    {
      value: `${stats.certifiedJudges}+`,
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/tournaments" className="btn btn-primary btn-lg group">
                Compete Now
              </Link>
              <Link to="/decklists" className="btn btn-secondary btn-lg group">
                Explore Decks
              </Link>
              <Link to="/cards" className="btn btn-outline btn-lg group">
                Browse Cards
              </Link>
            </div>
          </motion.div>


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

          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {dynamicStats.map((stat, index) => {
              return (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="glass-card p-6 hover:transform hover:scale-105 transition-all duration-300">
                    <div className="text-3xl font-bold text-primary mb-2 font-mono">
                      {stat.value}
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

          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => {
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
                    className={`card card-interactive h-full flex flex-col relative overflow-hidden ${
                      feature.featured
                        ? 'ring-2 ring-blue-500 ring-opacity-50'
                        : ''
                    }`}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, var(--accent-primary), var(--accent-purple))`,
                      }}
                    ></div>

                    <div className="relative z-10">
                      {feature.featured && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                          NEW
                        </div>
                      )}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-primary group-hover:text-blue-400 transition-colors">
                            {feature.title}
                          </h3>
                        </div>
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

            </div>
            <Link to="/decklists" className="btn btn-ghost">
              View All
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
                    <div className="flex-1">
                      <div className="font-bold text-primary">
                        {activity.title}
                      </div>
                    </div>
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
                  <Link to="/decklists" className="btn btn-primary">
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


            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/decklists" className="btn btn-primary btn-lg">
                Start Building
              </Link>
              <Link to="/tournaments" className="btn btn-secondary btn-lg">
                Join Tournament
              </Link>
              <Link to="/social" className="btn btn-ghost btn-lg">
                Join Community
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export { Home };
export default Home;
