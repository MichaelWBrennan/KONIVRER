import { motion } from 'framer-motion';

const Home = () => {
  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      title: 'New Set Release: Elemental Convergence',
      excerpt: 'Discover the powerful new mechanics and cards in our latest expansion. Elemental Convergence brings fresh strategies and exciting gameplay to KONIVRER.',
      author: 'Design Team',
      date: '2024-06-15',
      readTime: '5 min read',
      category: 'Set Release',
      image: '/api/placeholder/400/250',
      featured: true,
    },
    {
      id: 2,
      title: 'Tournament Meta Analysis: June 2024',
      excerpt: 'A deep dive into the current competitive landscape. Which archetypes are dominating and what strategies are emerging in the tournament scene.',
      author: 'Pro Player Council',
      date: '2024-06-12',
      readTime: '8 min read',
      category: 'Strategy',
      image: '/api/placeholder/400/250',
    },
    {
      id: 3,
      title: 'Community Spotlight: Deck Builder Showcase',
      excerpt: 'Featuring innovative deck builds from our community. See how creative players are pushing the boundaries of what\'s possible.',
      author: 'Community Team',
      date: '2024-06-10',
      readTime: '6 min read',
      category: 'Community',
      image: '/api/placeholder/400/250',
    },
    {
      id: 4,
      title: 'Rules Update: Clarifications and Changes',
      excerpt: 'Important updates to game rules and interactions. Stay informed about the latest official rulings and clarifications.',
      author: 'Rules Committee',
      date: '2024-06-08',
      readTime: '4 min read',
      category: 'Rules',
      image: '/api/placeholder/400/250',
    },
    {
      id: 5,
      title: 'Behind the Scenes: Art and Lore Development',
      excerpt: 'Get an exclusive look at how we create the stunning artwork and rich lore that brings KONIVRER to life.',
      author: 'Creative Team',
      date: '2024-06-05',
      readTime: '7 min read',
      category: 'Development',
      image: '/api/placeholder/400/250',
    },
    {
      id: 6,
      title: 'Player Interview: World Champion Insights',
      excerpt: 'An in-depth conversation with our reigning world champion about strategy, preparation, and the future of competitive play.',
      author: 'Editorial Team',
      date: '2024-06-03',
      readTime: '10 min read',
      category: 'Interview',
      image: '/api/placeholder/400/250',
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Set Release': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Strategy': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Community': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Rules': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'Development': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      'Interview': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              KONIVRER
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                Blog
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stay updated with the latest news, strategies, and insights from the world of KONIVRER
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Featured Post */}
          {blogPosts.filter(post => post.featured).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                        FEATURED
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                      <span className="text-gray-400 text-sm">{post.readTime}</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-white hover:text-blue-400 transition-colors cursor-pointer">
                      {post.title}
                    </h2>
                    <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        <div>
                          <p className="text-white font-medium">{post.author}</p>
                          <p className="text-gray-400 text-sm">{formatDate(post.date)}</p>
                        </div>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        Read More →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}

          {/* Regular Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                className="group cursor-pointer"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-gray-400 text-sm">{post.readTime}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400 text-sm">{formatDate(post.date)}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        <span className="text-gray-400 text-sm">{post.author}</span>
                      </div>
                      <span className="text-blue-400 group-hover:text-blue-300 text-sm font-medium transition-colors">
                        Read More →
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:transform hover:scale-105">
              Load More Posts
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export { Home };
export default Home;
