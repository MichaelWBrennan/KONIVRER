import React, { useState, useEffect } from 'react';
import { MapPin, Search, Phone, Mail, Globe, Calendar, Star, Filter } from 'lucide-react';

const StoreLocator = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sample store data
  const sampleStores = [
    {
      id: 1,
      name: "Dragon's Den Gaming",
      address: "123 Main Street, New York, NY 10001, USA",
      country: "US",
      phone: "+1 555-123-4567",
      email: "info@dragonsden.com",
      website: "https://dragonsden.com",
      armoryDay: "Friday",
      rating: 4.8,
      onlineStore: true,
      events: ["Armory", "Battle Hardened", "Weekly Tournaments"],
      description: "Premier gaming store with weekly KONIVRER events and competitive play."
    },
    {
      id: 2,
      name: "Mystic Cards & Games",
      address: "456 Oak Avenue, Toronto, ON M5V 3A8, Canada",
      country: "CA",
      phone: "+1 416-555-7890",
      email: "contact@mysticcards.ca",
      website: "https://mysticcards.ca",
      armoryDay: "Wednesday",
      rating: 4.6,
      onlineStore: true,
      events: ["Armory", "Draft", "Casual Play"],
      description: "Friendly local game store with a strong KONIVRER community."
    },
    {
      id: 3,
      name: "The Gaming Tavern",
      address: "789 High Street, London, SW1A 1AA, UK",
      country: "GB",
      phone: "+44 20 7123 4567",
      email: "hello@gamingtavern.co.uk",
      website: "https://gamingtavern.co.uk",
      armoryDay: "Saturday",
      rating: 4.9,
      onlineStore: false,
      events: ["Armory", "Championship Qualifiers", "Beginner Nights"],
      description: "Historic gaming venue in the heart of London with top-tier events."
    },
    {
      id: 4,
      name: "Samurai Games",
      address: "321 Shibuya, Tokyo, 150-0002, Japan",
      country: "JP",
      phone: "+81 3-1234-5678",
      email: "info@samuraigames.jp",
      website: "https://samuraigames.jp",
      armoryDay: "Thursday",
      rating: 4.7,
      onlineStore: true,
      events: ["Armory", "Pro Tour Qualifiers", "Draft"],
      description: "Leading gaming store in Tokyo with international tournament support."
    },
    {
      id: 5,
      name: "Outback Gaming",
      address: "654 Collins Street, Melbourne, VIC 3000, Australia",
      country: "AU",
      phone: "+61 3 9123 4567",
      email: "contact@outbackgaming.com.au",
      website: "https://outbackgaming.com.au",
      armoryDay: "Sunday",
      rating: 4.5,
      onlineStore: true,
      events: ["Armory", "Regional Championships", "Casual Play"],
      description: "Australia's premier KONIVRER destination with regular major events."
    }
  ];

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'JP', name: 'Japan' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' }
  ];

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStores(sampleStores);
      setFilteredStores(sampleStores);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = stores;

    if (searchTerm) {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter(store => store.country === selectedCountry);
    }

    if (selectedDay) {
      filtered = filtered.filter(store => store.armoryDay === selectedDay);
    }

    if (showOnlineOnly) {
      filtered = filtered.filter(store => store.onlineStore);
    }

    setFilteredStores(filtered);
  }, [stores, searchTerm, selectedCountry, selectedDay, showOnlineOnly]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-400" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading store locations...</p>
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
          <h1 className="text-4xl font-bold text-white mb-4">Store Locator</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Find local game stores that host KONIVRER events and tournaments. 
            Connect with your local gaming community and join the action!
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search stores or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Country Filter */}
            <div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full py-3 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Armory Day Filter */}
            <div>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full py-3 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Any Armory Day</option>
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Online Store Filter */}
            <div className="flex items-center">
              <label className="flex items-center space-x-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlineOnly}
                  onChange={(e) => setShowOnlineOnly(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <span>Online Store</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-300">
            Found {filteredStores.length} store{filteredStores.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStores.map(store => (
            <div
              key={store.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Store Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{store.name}</h3>
                  <div className="flex items-center space-x-1 mb-2">
                    {renderStars(store.rating)}
                    <span className="text-gray-400 ml-2">({store.rating})</span>
                  </div>
                </div>
                {store.onlineStore && (
                  <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                    Online Store
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="flex items-start space-x-3 mb-4">
                <MapPin className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300">{store.address}</p>
              </div>

              {/* Armory Day */}
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="text-gray-300">
                  <span className="font-semibold text-white">Armory Day:</span> {store.armoryDay}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                {store.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-purple-400" />
                    <a href={`tel:${store.phone}`} className="text-purple-400 hover:text-purple-300">
                      {store.phone}
                    </a>
                  </div>
                )}
                {store.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-purple-400" />
                    <a href={`mailto:${store.email}`} className="text-purple-400 hover:text-purple-300">
                      {store.email}
                    </a>
                  </div>
                )}
                {store.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <a 
                      href={store.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              {/* Events */}
              <div className="mb-4">
                <h4 className="text-white font-semibold mb-2">Events:</h4>
                <div className="flex flex-wrap gap-2">
                  {store.events.map((event, index) => (
                    <span
                      key={index}
                      className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm">{store.description}</p>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-4">
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                  View Details
                </button>
                {store.onlineStore && (
                  <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
                    Shop Online
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No stores found</h3>
            <p className="text-gray-400">
              Try adjusting your search criteria or check back later for new store listings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreLocator;