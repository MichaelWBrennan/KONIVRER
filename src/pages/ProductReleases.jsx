import React, { useState, useEffect } from 'react';
import { Package, Calendar, Star, Download, Eye, ShoppingCart, Gift, Zap } from 'lucide-react';

const ProductReleases = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  // Sample product data
  const sampleProducts = [
    {
      id: 1,
      name: "High Seas: Tides of Fortune",
      type: "Booster Set",
      category: "expansion",
      status: "upcoming",
      releaseDate: "2025-07-15",
      preorderDate: "2025-06-20",
      description: "Set sail for adventure in the latest KONIVRER expansion featuring pirate heroes, naval combat, and treasure hunting mechanics.",
      features: [
        "3 New Pirate Heroes",
        "150+ New Cards",
        "Naval Combat System",
        "Treasure Hunt Mechanics",
        "Legendary Artifacts"
      ],
      price: "$4.99",
      image: "/api/placeholder/400/300",
      featured: true,
      preorderAvailable: true
    },
    {
      id: 2,
      name: "Shadow Realm Starter Deck",
      type: "Starter Product",
      category: "starter",
      status: "available",
      releaseDate: "2025-06-01",
      description: "Perfect introduction to KONIVRER featuring the Shadow Realm theme with pre-constructed decks and tutorial materials.",
      features: [
        "2 Pre-built Decks",
        "Tutorial Guide",
        "Shadow Realm Heroes",
        "Beginner-Friendly Cards",
        "Quick Start Rules"
      ],
      price: "$24.99",
      image: "/api/placeholder/400/300",
      featured: false,
      preorderAvailable: false
    },
    {
      id: 3,
      name: "Elemental Masters Collection",
      type: "Premium Set",
      category: "premium",
      status: "available",
      releaseDate: "2025-05-15",
      description: "Deluxe collection featuring foil versions of the most powerful elemental cards and exclusive artwork.",
      features: [
        "50 Premium Foil Cards",
        "Exclusive Artwork",
        "Collector's Box",
        "Art Book",
        "Limited Edition Tokens"
      ],
      price: "$99.99",
      image: "/api/placeholder/400/300",
      featured: true,
      preorderAvailable: false
    },
    {
      id: 4,
      name: "Tournament Pack: Spring 2025",
      type: "Tournament Pack",
      category: "tournament",
      status: "available",
      releaseDate: "2025-04-01",
      description: "Official tournament pack with balanced cards for competitive play and exclusive tournament promos.",
      features: [
        "Tournament Legal Cards",
        "Exclusive Promos",
        "Balanced Meta",
        "Judge Materials",
        "Official Sleeves"
      ],
      price: "$19.99",
      image: "/api/placeholder/400/300",
      featured: false,
      preorderAvailable: false
    },
    {
      id: 5,
      name: "Ancient Legends: Mythic Edition",
      type: "Special Edition",
      category: "special",
      status: "preorder",
      releaseDate: "2025-08-30",
      preorderDate: "2025-07-01",
      description: "Ultra-premium set featuring legendary heroes from KONIVRER's ancient past with unique mechanics and stunning art.",
      features: [
        "Mythic Rarity Cards",
        "Ancient Hero Variants",
        "Premium Packaging",
        "Lore Compendium",
        "Numbered Collectibles"
      ],
      price: "$149.99",
      image: "/api/placeholder/400/300",
      featured: true,
      preorderAvailable: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'expansion', name: 'Expansions' },
    { id: 'starter', name: 'Starter Products' },
    { id: 'premium', name: 'Premium Sets' },
    { id: 'tournament', name: 'Tournament Packs' },
    { id: 'special', name: 'Special Editions' }
  ];

  const statuses = [
    { id: 'all', name: 'All Status' },
    { id: 'upcoming', name: 'Upcoming' },
    { id: 'preorder', name: 'Pre-order' },
    { id: 'available', name: 'Available Now' }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProducts(sampleProducts);
      setFilteredProducts(sampleProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(product => product.status === selectedStatus);
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedStatus]);

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      preorder: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      available: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    
    const labels = {
      upcoming: 'Coming Soon',
      preorder: 'Pre-order',
      available: 'Available Now'
    };

    return { class: badges[status], label: labels[status] };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading product releases...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Product Releases</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Stay up to date with the latest KONIVRER products, expansions, and special releases. 
            From starter decks to premium collections, discover what's new in the world of KONIVRER.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex space-x-2 bg-gray-800/50 rounded-lg p-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2 bg-gray-800/50 rounded-lg p-2">
            {statuses.map(status => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedStatus === status.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {status.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Star className="w-6 h-6 text-yellow-400 mr-2" />
            Featured Releases
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProducts.filter(product => product.featured).map(product => {
              const statusBadge = getStatusBadge(product.status);
              return (
                <div
                  key={product.id}
                  className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30 hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm border ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                      <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                        {product.type}
                      </span>
                    </div>
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">{product.name}</h3>
                  <p className="text-gray-300 mb-4">{product.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {product.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="text-gray-300 text-sm flex items-center">
                            <Zap className="w-3 h-3 text-purple-400 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-purple-400 mb-2">{product.price}</div>
                        <div className="text-gray-400 text-sm">
                          Release: {formatDate(product.releaseDate)}
                        </div>
                        {product.preorderDate && (
                          <div className="text-gray-400 text-sm">
                            Pre-order: {formatDate(product.preorderDate)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    {product.preorderAvailable && (
                      <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                        <Gift className="w-4 h-4 mr-2" />
                        Pre-order Now
                      </button>
                    )}
                    {product.status === 'available' && (
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now
                      </button>
                    )}
                    <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Products */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Package className="w-6 h-6 text-purple-400 mr-2" />
            All Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => {
              const statusBadge = getStatusBadge(product.status);
              return (
                <div
                  key={product.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm border ${statusBadge.class}`}>
                      {statusBadge.label}
                    </span>
                    {product.featured && <Star className="w-5 h-5 text-yellow-400" />}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{product.type}</p>
                  <p className="text-gray-300 mb-4 text-sm">{product.description}</p>

                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2 text-sm">Key Features:</h4>
                    <ul className="space-y-1">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-gray-300 text-xs flex items-center">
                          <Zap className="w-3 h-3 text-purple-400 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="text-2xl font-bold text-purple-400">{product.price}</div>
                    <div className="text-right text-xs text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(product.releaseDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {product.preorderAvailable && (
                      <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded-lg transition-colors text-sm">
                        Pre-order
                      </button>
                    )}
                    {product.status === 'available' && (
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg transition-colors text-sm">
                        Buy Now
                      </button>
                    )}
                    <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-gray-400">
              Try adjusting your filters or check back later for new releases.
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-8 border border-purple-500/30">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Be the first to know about new product releases, pre-orders, and exclusive offers. 
              Subscribe to our newsletter for the latest KONIVRER updates.
            </p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReleases;