import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    // Mock blog posts data
    const mockBlogPosts = [
      {
        id: 1,
        title: 'New Set Release: Elemental Convergence',
        excerpt: 'Discover the powerful new mechanics and cards in our latest expansion. Elemental Convergence brings fresh strategies and exciting gameplay to KONIVRER.',
        author: 'Game Design Team',
        date: '2025-06-15',
        readTime: '5 min read',
        category: 'Game Updates',
        image: '/api/placeholder/400/250',
        featured: true,
      },
      {
        id: 2,
        title: 'Tournament Meta Analysis: June 2025',
        excerpt: 'A deep dive into the current competitive landscape. Which archetypes are dominating and what strategies are emerging in high-level play.',
        author: 'Pro Player Council',
        date: '2025-06-12',
        readTime: '8 min read',
        category: 'Strategy',
        image: '/api/placeholder/400/250',
      },
      {
        id: 3,
        title: 'Community Spotlight: Deck Builder Showcase',
        excerpt: 'Featuring innovative deck builds from our community. See how creative players are pushing the boundaries of what\'s possible.',
        author: 'Community Team',
        date: '2025-06-10',
        readTime: '6 min read',
        category: 'Community',
        image: '/api/placeholder/400/250',
      },
      {
        id: 4,
        title: 'Judge Corner: Rules Clarifications',
        excerpt: 'Important updates to tournament rules and common misconceptions clarified. Essential reading for competitive players.',
        author: 'Judge Committee',
        date: '2025-06-08',
        readTime: '4 min read',
        category: 'Rules',
        image: '/api/placeholder/400/250',
      },
      {
        id: 5,
        title: 'Behind the Scenes: Card Art Process',
        excerpt: 'Take a look at how our amazing card artwork comes to life, from initial concept sketches to final digital masterpieces.',
        author: 'Art Team',
        date: '2025-06-05',
        readTime: '7 min read',
        category: 'Development',
        image: '/api/placeholder/400/250',
      },
      {
        id: 6,
        title: 'Beginner\'s Guide: Building Your First Deck',
        excerpt: 'New to KONIVRER? Learn the fundamentals of deck construction and start your journey to becoming a master duelist.',
        author: 'Education Team',
        date: '2025-06-03',
        readTime: '10 min read',
        category: 'Tutorial',
        image: '/api/placeholder/400/250',
      },
    ];
    setBlogPosts(mockBlogPosts);
  }, []);

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
      'Game Updates': 'bg-blue-500',
      'Strategy': 'bg-purple-500',
      'Community': 'bg-green-500',
      'Rules': 'bg-red-500',
      'Development': 'bg-yellow-500',
      'Tutorial': 'bg-indigo-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <section className="py-16 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
        <div className="container relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
              KONIVRER Blog
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stay updated with the latest news, strategies, and insights from the world of KONIVRER
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-primary">
        <div className="container">
          {/* Featured Post */}
          {blogPosts.length > 0 && blogPosts[0].featured && (
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass-card overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="order-2 lg:order-1 p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getCategoryColor(blogPosts[0].category)}`}>
                        {blogPosts[0].category}
                      </span>
                      <span className="text-blue-400 text-sm font-bold">FEATURED</span>
                    </div>
                    <h2 className="text-3xl font-bold text-primary mb-4 hover:text-blue-400 transition-colors cursor-pointer">
                      {blogPosts[0].title}
                    </h2>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                      {blogPosts[0].excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        <span>By {blogPosts[0].author}</span>
                        <span>•</span>
                        <span>{formatDate(blogPosts[0].date)}</span>
                        <span>•</span>
                        <span>{blogPosts[0].readTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 lg:order-2">
                    <img
                      src={blogPosts[0].image}
                      alt={blogPosts[0].title}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Regular Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <motion.article
                key={post.id}
                className="glass-card overflow-hidden hover:border-accent-primary transition-all duration-300 group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">By {post.author}</span>
                      <div className="flex items-center gap-2">
                        <span>{formatDate(post.date)}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More Button */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <button className="btn btn-primary btn-lg">
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
