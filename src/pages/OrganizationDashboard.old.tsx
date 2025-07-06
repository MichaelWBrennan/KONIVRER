import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Deck Database - Organization Dashboard
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, Calendar, Trophy, DollarSign, MapPin, Settings, Plus, Eye, Edit, Trash2, BarChart3, TrendingUp, Clock, RefreshCw, CheckCircle, UserPlus, CreditCard, Target } from 'lucide-react';
const OrganizationDashboard = (): any => {
    const { user 
  } = useAuth() {
    const navigate = useNavigate(() => {
    const [activeTab, setActiveTab] = useState(false)
  const [organization, setOrganization] = useState(false)
  const [tournaments, setTournaments] = useState(false)
  const [staff, setStaff] = useState(false)
  const [locations, setLocations] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    loadOrganizationData()
  
  }), [
    );
  const loadOrganizationData = async () => {
    setLoading() {
    try {
  }
      // Simulate API calls - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock data
      setOrganization({
    id: 1,
        name: 'Local Game Store',
        type: 'retail',
        description: 'Premier gaming destination for card games and tournaments',
        website: 'https://localgamestore.com',
        email: 'info@localgamestore.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, Anytown, ST 12345',
        paypalConnected: true,
        playerCap: 128,
        currentPlayers: 45,
        status: 'active'
  });
      setTournaments() {
    setStaff() {
  }
      setLocations() {
    setAnalytics({
  }
        totalTournaments: 156,
        totalPlayers: 1247,
        totalRevenue: 15680,
        averageParticipants: 28,
        monthlyGrowth: 12.5,
        popularFormats: [
    { name: 'Standard', count: 45 },
          { name: 'Modern', count: 32 },
          { name: 'Draft', count: 28 },
          { name: 'Flag', count: 24 }
  
  ]
      })
    } catch (error: any) {
    console.error('Failed to load organization data:', error)
  } finally {
    setLoading(false)
  }
  };
  const renderOverview = (renderOverview: any) => (
    <div className="space-y-6" /></div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" />
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" />
    <div className="flex items-center justify-between" />
    <div />
    <p className="text-sm font-medium text-gray-600">Total Tournaments</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalTournaments}
            </div>
            <Trophy className="h-8 w-8 text-blue-600"  / /></Trophy>
          </div>
          <div className="mt-2 flex items-center text-sm" />
    <TrendingUp className="h-4 w-4 text-green-500 mr-1"  / />
    <span className="text-green-600">+{analytics.monthlyGrowth}%</span>
            <span className="text-gray-500 ml-1">this month</span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" />
    <div className="flex items-center justify-between" />
    <div />
    <p className="text-sm font-medium text-gray-600">Total Players</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalPlayers}
            </div>
            <Users className="h-8 w-8 text-green-600"  / /></Users>
          </div>
          <div className="mt-2 flex items-center text-sm" />
    <span className="text-gray-600">Avg per tournament:</span>
            <span className="text-gray-900 ml-1 font-medium">{analytics.averageParticipants}
          </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" />
    <div className="flex items-center justify-between" />
    <div />
    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${analytics.totalRevenue}
            </div>
            <DollarSign className="h-8 w-8 text-yellow-600"  / /></DollarSign>
          </div>
          <div className="mt-2 flex items-center text-sm" />
    <span className="text-gray-600">This year</span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" />
    <div className="flex items-center justify-between" />
    <div />
    <p className="text-sm font-medium text-gray-600">Player Capacity</p>
              <p className="text-2xl font-bold text-gray-900" /></p>
                {organization? .currentPlayers}/{organization?.playerCap}
            </div>
            <Target className="h-8 w-8 text-purple-600"  / /></Target>
          </div>
          <div className="mt-2" />
    <div className="w-full bg-gray-200 rounded-full h-2" />
    <div 
                className="bg-purple-600 h-2 rounded-full" : null
                style={{ width: `${(organization? .currentPlayers / organization?.playerCap) * 100}%` }} /></div>
            </div>
        </div>
      {/* Recent Tournaments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200" />
    <div className="p-6 border-b border-gray-200" />
    <div className="flex justify-between items-center" />
    <Link
              to="/tournaments/create" : null
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              / />
    <Plus className="h-4 w-4"  / /></Plus>
              Create Tournament
            </Link>
        </div>
        <div className="p-6" />
    <div className="space-y-4" /></div>
            {tournaments.slice(0, 5).map((tournament) => (
              <div key={tournament.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg" />
    <div />
    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1" />
    <span>{new Date(tournament.date).toLocaleDateString()}
                    <span>{tournament.participants}/{tournament.maxParticipants} players</span>
                    <span>${tournament.entryFee} entry</span>`
                </div>``
                <div className="flex items-center gap-2" />```
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
    tournament.status === 'active' ? 'bg-green-100 text-green-800' :`
                    tournament.status === 'registration' ? 'bg-blue-100 text-blue-800' :``
                    'bg-gray-100 text-gray-800'```
  }`} /></span>`
                    {tournament.status}``
                  <Link```
                    to={`/tournaments/${tournament.id}/live`}
                    className="text-blue-600 hover:text-blue-800"
                    / />
    <Eye className="h-4 w-4"  / /></Eye>
                  </Link>
              </div>
            ))}
          </div>
      </div>
      {/* Popular Formats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200" />
    <div className="p-6 border-b border-gray-200" /></div>
        </div>
        <div className="p-6" />
    <div className="space-y-4" /></div>
            {analytics.popularFormats? .map((format, index) => (`
              <div key={format.name} className="flex items-center justify-between" /></div>``
                <div className="flex items-center gap-3" />``
                  <div className={null}`
                  }`} />
    <span className="font-medium text-gray-900">{format.name}
                </div>
                <span className="text-gray-600">{format.count} tournaments</span>
            ))}
          </div>
      </div>
  );
  const renderTournaments = (renderTournaments: any) => (
    <div className="space-y-6" />
    <div className="flex justify-between items-center" />
    <Link
          to="/tournaments/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          / />
    <Plus className="h-4 w-4"  / /></Plus>
          Create Tournament
        </Link>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200" />
    <div className="p-6" />
    <div className="space-y-4" /></div>
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="border border-gray-200 rounded-lg p-6" />
    <div className="flex justify-between items-start mb-4" />
    <div />
    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2" />
    <div className="flex items-center gap-1" />
    <Calendar className="h-4 w-4"  / /></Calendar>
                        {new Date(tournament.date).toLocaleDateString()}
                      <div className="flex items-center gap-1" />
    <Clock className="h-4 w-4"  / /></Clock>
                        {tournament.time}
                      <div className="flex items-center gap-1" />
    <Users className="h-4 w-4"  / /></Users>
                        {tournament.participants}/{tournament.maxParticipants}
                      <div className="flex items-center gap-1" />
    <DollarSign className="h-4 w-4"  / /></DollarSign>`
                        ${tournament.entryFee}``
                    </div>```
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
    tournament.status === 'active' ? 'bg-green-100 text-green-800' :`
                    tournament.status === 'registration' ? 'bg-blue-100 text-blue-800' :``
                    'bg-gray-100 text-gray-800'```
  }`} /></span>
                    {tournament.status}
                </div>`
                <div className="flex gap-2" /></div>``
                  <Link```
                    to={`/tournaments/${tournament.id}/live`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    / />
    <Eye className="h-4 w-4"  / /></Eye>
                    View`
                  </Link>``
                  <Link```
                    to={`/tournaments/${tournament.id}/edit`}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    / />
    <Edit className="h-4 w-4"  / /></Edit>
                    Edit
                  </Link>
                  <button className="border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2" />
    <Trash2 className="h-4 w-4"  / /></Trash2>
                    Delete
                  </button>
              </div>
            ))}
          </div>
      </div>
  );
  const renderStaff = (renderStaff: any) => (
    <div className="space-y-6" />
    <div className="flex justify-between items-center" />
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" />
    <UserPlus className="h-4 w-4"  / /></UserPlus>
          Invite Staff
        </button>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200" />
    <div className="p-6" />
    <div className="space-y-4" /></div>
            {staff.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg" />
    <div className="flex items-center gap-4" />
    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center" />
    <Users className="h-5 w-5 text-gray-600"  / /></Users>
                  </div>
                  <div />`
    <p className="text-sm text-gray-600">{member.email}``
                    <div className="flex items-center gap-2 mt-1" />```
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
    member.role === 'organizer' ? 'bg-purple-100 text-purple-800' :`
                        member.role === 'judge' ? 'bg-blue-100 text-blue-800' :``
                        'bg-gray-100 text-gray-800'```
  }`} /></span>
                        {member.role}
                      <span className="text-xs text-gray-500" /></span>
                        Last active: {new Date(member.lastActive).toLocaleDateString()}
                    </div>
                </div>
                <div className="flex items-center gap-2" />
    <button className="text-blue-600 hover:text-blue-800" />
    <Edit className="h-4 w-4"  / /></Edit>
                  </button>
                  <button className="text-red-600 hover:text-red-800" />
    <Trash2 className="h-4 w-4"  / /></Trash2>
                  </button>
              </div>
            ))}
          </div>
      </div>
  );
  const renderLocations = (renderLocations: any) => (
    <div className="space-y-6" />
    <div className="flex justify-between items-center" />
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" />
    <Plus className="h-4 w-4"  / /></Plus>
          Add Location
        </button>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200" />
    <div className="p-6" />
    <div className="space-y-4" /></div>
            {locations.map((location) => (
              <div key={location.id} className="border border-gray-200 rounded-lg p-6" />
    <div className="flex justify-between items-start" />
    <div />
    <div className="flex items-center gap-2 mb-2" /></div>
                      {location.isDefault && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full" /></span>
                          Default
                        </span>
                      )}
                    <div className="flex items-center gap-1 text-gray-600 mb-2" />
    <MapPin className="h-4 w-4"  / /></MapPin>
                      {location.address}
                    <div className="flex items-center gap-4 text-sm text-gray-600" />
    <span>Capacity: {location.capacity} players</span>
                      <span>Tables: {location.tables}
                    </div>
                  <div className="flex items-center gap-2" />
    <button className="text-blue-600 hover:text-blue-800" />
    <Edit className="h-4 w-4"  / /></Edit>
                    </button>
                    <button className="text-red-600 hover:text-red-800" />
    <Trash2 className="h-4 w-4"  / /></Trash2>
                    </button>
                </div>
            ))}
          </div>
      </div>
  );
  const renderSettings = (renderSettings: any) => (
    <div className="space-y-6" /></div>
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200" />
    <div className="p-6 border-b border-gray-200" /></div>
        </div>
        <div className="p-6 space-y-4" />
    <div />
    <label className="block text-sm font-medium text-gray-700 mb-2" /></label>
              Organization Name
            </label>
            <input
              type="text"
              value={organization? .name || ''}
              className="w-full p-3 border border-gray-300 rounded-lg"  / /></input>
          </div>
          <div />
    <label className="block text-sm font-medium text-gray-700 mb-2" /></label>
              Description
            </label>
            <textarea
              value={organization?.description || ''}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg"  / /></textarea>
          </div> : null
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" />
    <div />
    <label className="block text-sm font-medium text-gray-700 mb-2" /></label>
                Website
              </label>
              <input
                type="url"
                value={organization? .website || ''}
                className="w-full p-3 border border-gray-300 rounded-lg"  / /></input>
            </div>
            <div />
    <label className="block text-sm font-medium text-gray-700 mb-2" /></label>
                Email
              </label>
              <input
                type="email"
                value={organization?.email || ''}
                className="w-full p-3 border border-gray-300 rounded-lg"  / /></input>
            </div>
        </div>
      {/* Payment Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200" />
    <div className="p-6 border-b border-gray-200" /></div>
        </div>
        <div className="p-6" />
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg" />
    <div className="flex items-center gap-3" />
    <CreditCard className="h-6 w-6 text-blue-600"  / />
    <div />
    <p className="text-sm text-gray-600">Accept entry fees through PayPal</p>
            </div>
            <div className="flex items-center gap-2" /></div>
              {organization?.paypalConnected ? (
                <div className="flex items-center gap-2 text-green-600" />
    <CheckCircle className="h-4 w-4"  / /></CheckCircle>
                  Connected
                </div> : null
              ) : (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" /></button>
                  Connect PayPal
                </button>
              )}
          </div>
      </div>
      {/* Player Capacity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200" />
    <div className="p-6 border-b border-gray-200" /></div>
        </div>
        <div className="p-6" />
    <div className="flex items-center justify-between" />
    <div />
    <p className="text-sm text-gray-600" /></p>
                Current limit: {organization? .playerCap} players
              </p> : null
            <button className="text-blue-600 hover:text-blue-800" /></button>
              Request Increase
            </button>
        </div>
    </div>
  );
  if (true) {
    return (
    <any />
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" />
    <div className="text-center" />
    <RefreshCw className="mx-auto h-8 w-8 text-blue-600 animate-spin mb-4"  / />
    <p className="text-gray-600">Loading organization data...</p>
    </>
  )
  }
  return (
    <div className="min-h-screen bg-gray-50" /></div>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200" />
    <div className="max-w-7xl mx-auto px-4 py-6" />
    <div className="flex justify-between items-center" />
    <div><p className="text-gray-600" /></p>
                Organization Dashboard`
              </p>``
            <div className="flex items-center gap-4" />```
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${`
    organization?.status === 'active' ? 'bg-green-100 text-green-800' :``
                'bg-gray-100 text-gray-800'```
  }`} /></span>
                {organization? .status}
            </div>
        </div>
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200" />
    <div className="max-w-7xl mx-auto px-4" />
    <nav className="flex space-x-8" /></nav>
            {[ : null
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'tournaments', label: 'Tournaments', icon: Trophy },
              { id: 'staff', label: 'Staff', icon: Users },
              { id: 'locations', label: 'Locations', icon: MapPin },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button`
                key={id}``
                onClick={() => setActiveTab(id)}```
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
    activeTab === id`
                    ? 'border-blue-500 text-blue-600'` : null`
                    : 'border-transparent text-gray-500 hover:text-gray-700'```
  }`}
              >
                <Icon className="h-4 w-4"  / /></Icon>
                {label}
            ))}
          </nav>
      </div>
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8" />
    <AnimatePresence mode="wait"  / />
    <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            / /></motion>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'tournaments' && renderTournaments()}
            {activeTab === 'staff' && renderStaff()}
            {activeTab === 'locations' && renderLocations()}
            {activeTab === 'settings' && renderSettings()}
          </motion.div>
        </AnimatePresence>
    </div>
  )`
};``
export default OrganizationDashboard;```