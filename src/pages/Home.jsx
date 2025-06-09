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
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const Home = () => {
  const { stats, recentActivity, getRecentDecks } = useData();
  
  const features = [
    {
      icon: PlusCircle,
      title: 'Advanced Deck Builder',
      description:
        'Create and customize your decks with our intuitive drag-and-drop interface.',
      link: '/deckbuilder',
    },
    {
      icon: Database,
      title: 'Complete Card Database',
      description:
        'Browse and search through all KONIVRER cards with advanced filtering options.',
      link: '/cards',
    },
    {
      icon: BookOpen,
      title: 'Deck Management',
      description:
        'Organize, share, and track your deck collections with ease.',
      link: '/decks',
    },
    {
      icon: Trophy,
      title: 'Organized Play',
      description:
        'Join official tournaments, compete with players worldwide, and climb the rankings.',
      link: '/tournaments',
    },
    {
      icon: Shield,
      title: 'Judge Center',
      description:
        'Access official rules, manage tournaments, and advance your judge certification.',
      link: '/judge-center',
    },
    {
      icon: Target,
      title: 'Tournament Tools',
      description:
        'Create and manage tournaments with comprehensive bracket and pairing systems.',
      link: '/tournaments/create',
    },
  ];

  // Dynamic stats from real data
  const dynamicStats = [
    { 
      label: 'Total Cards', 
      value: stats.totalCards.toLocaleString(), 
      icon: Database 
    },
    { 
      label: 'Active Players', 
      value: stats.activePlayers > 1000 
        ? `${(stats.activePlayers / 1000).toFixed(1)}K+` 
        : `${stats.activePlayers}+`, 
      icon: Users 
    },
    { 
      label: 'Tournaments', 
      value: `${stats.tournaments}+`, 
      icon: Trophy 
    },
    { 
      label: 'Certified Judges', 
      value: `${stats.certifiedJudges}+`, 
      icon: Shield 
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="hero-title">Master the Elements</h1>
            <p className="hero-subtitle">
              Build powerful decks, discover new strategies, and compete in
              official tournaments in the ultimate elemental card game platform.
            </p>
            <div className="btn-group">
              <Link
                to="/tournaments"
                className="btn btn-primary text-lg px-8 py-3"
              >
                <Trophy size={20} />
                Join Tournament
              </Link>
              <Link
                to="/deckbuilder"
                className="btn btn-secondary text-lg px-8 py-3"
              >
                <PlusCircle size={20} />
                Build Deck
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {dynamicStats.map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-primary rounded-lg mb-4">
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-secondary">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              Powerful tools and features designed to enhance your KONIVRER
              experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(feature => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  to={feature.link}
                  className="card hover:border-accent-primary transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-accent-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-secondary">{feature.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <Link to="/decks" className="btn btn-ghost">
              View All
              <TrendingUp size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentActivity.length > 0 ? (
              recentActivity.map(activity => (
                <div key={activity.id} className="card hover:border-accent-primary transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center">
                      {activity.type === 'deck_created' ? (
                        <PlusCircle size={16} className="text-white" />
                      ) : activity.type === 'tournament_started' ? (
                        <Trophy size={16} className="text-white" />
                      ) : (
                        <User size={16} className="text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-secondary">by {activity.user}</div>
                    </div>
                  </div>
                  <div className="text-sm text-secondary mb-3">
                    {activity.description}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">
                      {activity.cardCount && `${activity.cardCount} cards`}
                      {activity.participants && `${activity.participants} players`}
                    </span>
                    <span className="text-muted flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(activity.timestamp).toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              // Fallback when no real activity exists
              <div className="col-span-full text-center py-8">
                <div className="text-secondary mb-4">
                  <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No recent activity yet</p>
                  <p className="text-sm">Start building decks to see activity here!</p>
                </div>
                <Link to="/deckbuilder" className="btn btn-primary">
                  <PlusCircle size={16} />
                  Create Your First Deck
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Begin?</h2>
            <p className="text-xl text-secondary mb-8">
              Join thousands of players and start building your ultimate deck
              today.
            </p>
            <Link
              to="/deckbuilder"
              className="btn btn-primary text-lg px-8 py-3"
            >
              <PlusCircle size={20} />
              Create Your First Deck
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export { Home };
export default Home;
