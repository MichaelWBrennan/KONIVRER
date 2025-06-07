import {
  Home,
  Database,
  PlusCircle,
  BookOpen,
  User,
  Search,
  Menu,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { analytics } from '../utils/analytics';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Deck Builder', href: '/deckbuilder', icon: PlusCircle },
    { name: 'Card Database', href: '/cards', icon: Database },
    { name: 'My Decks', href: '/decks', icon: BookOpen },
  ];

  // Track page views when location changes
  useEffect(() => {
    const pageName =
      location.pathname === '/' ? 'home' : location.pathname.slice(1);
    analytics.pageView(pageName, {
      path: location.pathname,
      search: location.search,
    });
  }, [location]);

  // Handle navigation clicks
  const handleNavClick = (itemName, href) => {
    analytics.navigationClick(href, location.pathname);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Handle search
  const handleSearch = e => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      analytics.cardSearch(searchTerm.trim());
      // Navigate to cards page with search
      window.location.href = `/cards?search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    analytics.buttonClick('mobile_menu', newState ? 'open' : 'close');
  };

  const isActive = path => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-secondary border-b border-color sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={() => analytics.navigationClick('/', location.pathname)}
            >
              <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-primary">KONIVRER</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-accent-primary text-white'
                        : 'text-secondary hover:text-primary hover:bg-tertiary'
                    }`}
                    onClick={() => handleNavClick(item.name, item.href)}
                  >
                    <Icon size={16} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Search Bar */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search cards..."
                  className="input pl-10 w-64"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
              <button className="btn btn-ghost">
                <User size={16} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden btn btn-ghost"
              onClick={handleMobileMenuToggle}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-secondary border-t border-color">
            <div className="container py-4">
              <nav className="flex flex-col gap-2">
                {navigation.map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-accent-primary text-white'
                          : 'text-secondary hover:text-primary hover:bg-tertiary'
                      }`}
                      onClick={() => handleNavClick(item.name, item.href)}
                    >
                      <Icon size={16} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Search */}
              <div className="mt-4 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search cards..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-color mt-auto">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">
                © 2024 KONIVRER Deck Database. Built with ❤️ for the community.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/about"
                className="text-sm text-secondary hover:text-primary"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-sm text-secondary hover:text-primary"
              >
                Contact
              </Link>
              <Link
                to="/how-to-play"
                className="text-sm text-secondary hover:text-primary"
              >
                How to Play
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
