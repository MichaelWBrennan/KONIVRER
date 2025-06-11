import React, { useState, useEffect } from 'react';
import {
  Book,
  Globe,
  Users,
  Scroll,
  Star,
  Calendar,
  Eye,
  Heart,
  Share2,
} from 'lucide-react';

const LoreCenter = () => {
  const [activeCategory, setActiveCategory] = useState('stories');
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample lore data
  const loreData = {
    stories: [
      {
        id: 1,
        title: 'The Rise of the Shadow Realm',
        author: 'KONIVRER Lore Team',
        date: '2025-06-10',
        category: 'Main Story',
        readTime: '15 min',
        featured: true,
        likes: 234,
        views: 1520,
        excerpt:
          "In the depths of the ancient forests, a darkness stirs that threatens to consume all of Aethermoor. Follow the journey of our heroes as they discover the truth behind the Shadow Realm's emergence.",
        content: `The morning mist clung to the ancient oaks of Whisperwood Forest like ghostly fingers, reluctant to release their hold on the world of dreams. Lyra Nightwhisper moved silently through the undergrowth, her elven senses attuned to every sound, every shift in the natural harmony that had been her home for over two centuries.

Something was wrong.

The forest spoke to those who knew how to listen, and today its voice carried notes of discord that made her silver hair stand on end. The usual chorus of birdsong was muted, replaced by an oppressive silence that seemed to press against her very soul.

As she crested a small hill, Lyra's breath caught in her throat. Before her stretched a sight that defied all natural law – a tear in reality itself, edges crackling with dark energy that seemed to devour the very light around it. Through this rift, she could see another realm, one of perpetual twilight and twisted shadows.

"The Shadow Realm," she whispered, the words tasting of ash and fear.

This was the beginning of the end, or perhaps, the beginning of something far worse.`,
      },
      {
        id: 2,
        title: 'Chronicles of the Elemental Wars',
        author: 'Master Chronicler Thane',
        date: '2025-06-05',
        category: 'Historical',
        readTime: '22 min',
        featured: false,
        likes: 189,
        views: 987,
        excerpt:
          'Delve into the ancient conflicts that shaped the world of KONIVRER, where elemental forces clashed in battles that would determine the fate of all existence.',
        content:
          'The Elemental Wars began not with armies or declarations, but with a single drop of corrupted water...',
      },
      {
        id: 3,
        title: "The Last Dragon's Prophecy",
        author: 'Sage Meridian',
        date: '2025-05-28',
        category: 'Prophecy',
        readTime: '18 min',
        featured: true,
        likes: 312,
        views: 2103,
        excerpt:
          'Ancient prophecies speak of a time when the last dragon will awaken, bringing either salvation or destruction to the realm. That time may be closer than we think.',
        content:
          "In the tongue of the ancients, it was written: 'When shadow meets light at the world's end...'",
      },
    ],
    worldGuide: [
      {
        id: 1,
        title: 'The Realm of Aethermoor',
        type: 'Location',
        description:
          'The primary realm where most KONIVRER adventures take place, a world of magic and mystery.',
        details:
          'Aethermoor is a vast continent divided into several distinct regions, each with its own unique characteristics and inhabitants.',
      },
      {
        id: 2,
        title: 'The Elemental Crystals',
        type: 'Artifact',
        description:
          'Ancient crystals that contain the pure essence of the elemental forces.',
        details:
          'These crystals are the source of all elemental magic in the world, carefully guarded by the Elemental Orders.',
      },
      {
        id: 3,
        title: 'The Shadow Realm',
        type: 'Dimension',
        description:
          'A parallel dimension of darkness and corruption that threatens to consume all reality.',
        details:
          'The Shadow Realm exists as a twisted mirror of our world, where light cannot penetrate and hope withers.',
      },
    ],
    characters: [
      {
        id: 1,
        name: 'Lyra Nightwhisper',
        race: 'Elf',
        class: 'Shadow Ranger',
        description:
          'A mysterious elven ranger who walks the line between light and shadow.',
        background:
          'Born in the Whisperwood Forest, Lyra has dedicated her life to protecting the natural balance.',
      },
      {
        id: 2,
        name: 'Thane Ironforge',
        race: 'Dwarf',
        class: 'Elemental Smith',
        description:
          'Master craftsman who can forge weapons imbued with elemental power.',
        background:
          'Heir to an ancient line of smiths, Thane discovered the secret of elemental forging.',
      },
      {
        id: 3,
        name: 'Zara Stormcaller',
        race: 'Human',
        class: 'Storm Mage',
        description:
          'A powerful mage who commands the fury of storms and lightning.',
        background:
          'Trained in the Tower of Storms, Zara seeks to master the most volatile of elements.',
      },
    ],
  };

  const categories = [
    { id: 'stories', name: 'Stories', icon: Book },
    { id: 'worldGuide', name: 'World Guide', icon: Globe },
    { id: 'characters', name: 'Characters', icon: Users },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const renderStories = () => (
    <div className="space-y-6">
      {loreData.stories.map(story => (
        <div
          key={story.id}
          className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:transform hover:scale-105 cursor-pointer ${
            story.featured
              ? 'border-purple-500/50 bg-gradient-to-r from-purple-500/10 to-blue-500/10'
              : 'border-gray-700 hover:border-purple-500'
          }`}
          onClick={() => setSelectedStory(story)}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {story.featured && <Star className="w-5 h-5 text-yellow-400" />}
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                  {story.category}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {story.title}
              </h3>
              <p className="text-gray-400 mb-3">By {story.author}</p>
            </div>
            <div className="text-right text-sm text-gray-400">
              <div className="flex items-center space-x-1 mb-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(story.date).toLocaleDateString()}</span>
              </div>
              <div>{story.readTime} read</div>
            </div>
          </div>

          <p className="text-gray-300 mb-4 leading-relaxed">{story.excerpt}</p>

          <div className="flex justify-between items-center">
            <div className="flex space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{story.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{story.likes}</span>
              </div>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
              Read Story
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderWorldGuide = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loreData.worldGuide.map(item => (
        <div
          key={item.id}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105"
        >
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                {item.type}
              </span>
            </div>
            <p className="text-gray-300 mb-4">{item.description}</p>
            <p className="text-gray-400 text-sm">{item.details}</p>
          </div>
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
            Learn More
          </button>
        </div>
      ))}
    </div>
  );

  const renderCharacters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loreData.characters.map(character => (
        <div
          key={character.id}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105"
        >
          <div className="text-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              {character.name}
            </h3>
            <div className="flex justify-center space-x-2 mb-2">
              <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm">
                {character.race}
              </span>
              <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-sm">
                {character.class}
              </span>
            </div>
          </div>
          <p className="text-gray-300 mb-3 text-center">
            {character.description}
          </p>
          <p className="text-gray-400 text-sm mb-4">{character.background}</p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
            View Profile
          </button>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case 'stories':
        return renderStories();
      case 'worldGuide':
        return renderWorldGuide();
      case 'characters':
        return renderCharacters();
      default:
        return renderStories();
    }
  };

  if (selectedStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedStory(null)}
            className="mb-6 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← Back to Stories
          </button>

          <article className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <header className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                {selectedStory.featured && (
                  <Star className="w-5 h-5 text-yellow-400" />
                )}
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                  {selectedStory.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {selectedStory.title}
              </h1>
              <div className="flex justify-between items-center text-gray-400 mb-6">
                <div>
                  <p>By {selectedStory.author}</p>
                  <p>
                    {new Date(selectedStory.date).toLocaleDateString()} •{' '}
                    {selectedStory.readTime} read
                  </p>
                </div>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{selectedStory.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{selectedStory.likes}</span>
                  </div>
                  <button className="flex items-center space-x-1 hover:text-purple-400 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </header>

            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                {selectedStory.content}
              </div>
            </div>

            <footer className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>Like ({selectedStory.likes})</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </footer>
          </article>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading lore content...</p>
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
          <h1 className="text-4xl font-bold text-white mb-4">
            World of KONIVRER
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Immerse yourself in the rich lore and captivating stories of the
            KONIVRER universe. Discover the heroes, villains, and epic tales
            that shape this magical realm.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-gray-800/50 rounded-lg p-2">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">{renderContent()}</div>

        {/* Featured Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-8 border border-purple-500/30">
          <div className="text-center">
            <Scroll className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Contribute to the Lore
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Have an idea for a story or character? The KONIVRER community
              welcomes creative contributions to expand our shared universe.
              Submit your stories and become part of the legend.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors">
              Submit Your Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoreCenter;
