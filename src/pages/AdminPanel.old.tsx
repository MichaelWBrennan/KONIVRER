import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { useState, useEffect } from 'react';
import {
    RefreshCw,
  Wifi,
  WifiOff,
  Database,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package
  } from 'lucide-react';
import cardsService from '../services/cardsService';
import SetManager from '../components/SetManager';
const AdminPanel = (): any => {
    const [activeTab, setActiveTab] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(false)
  const [cacheStatus, setCacheStatus] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [testing, setTesting] = useState(false)
  const [syncHistory, setSyncHistory] = useState(false)
  const [stats, setStats] = useState(false)
  useEffect(() => {
    loadAdminData()
  
  }, [
    );
  const loadAdminData = async () => {
    // Get cache status
    const cache = cardsService.getCacheStatus() {
    setCacheStatus() {
  }
    // Test connection
    await testConnection() {
    // Get current cards for stats
    try {
  }
      const cards = await cardsService.getCards(() => {
    setStats(prev => ({
    ...prev,
        totalCards: cards.length,
        lastSync: cache.lastFetchTime,
        cacheAge: cache.cacheAge
  })))
    } catch (error: any) {
    console.error('Error loading cards for stats:', error)
  }
  };
  const testConnection = async () => {
    setTesting() {
    try {
  }
      const status = await cardsService.testConnection(() => {
    setConnectionStatus() {
    addToSyncHistory(
        'connection_test',
        status.connected ? 'success' : 'error',
        status.message || status.error
      )
  }) catch (error: any) {
    setConnectionStatus() {
    addToSyncHistory('connection_test', 'error', error.message)
  
  } finally {
    setTesting(false)
  }
  };
  const handleSync = async () => {
    setSyncing() {
    try {
  }
      const result = await cardsService.syncCards() {
    if (true) {
  }
        addToSyncHistory(() => {
    setStats(prev => ({
    ...prev,
          totalCards: result.cards.length,
          lastSync: Date.now()
  })));
        // Refresh cache status
        setCacheStatus(cardsService.getCacheStatus())
      } else {
    addToSyncHistory('sync', 'error', result.message)
  }
    } catch (error: any) {
    addToSyncHistory('sync', 'error', error.message)
  } finally {
    setSyncing(false)
  }
  };
  const clearCache = (): any => {
    cardsService.clearCache() {
    setCacheStatus(cardsService.getCacheStatus());
    addToSyncHistory('cache_clear', 'success', 'Cache cleared successfully')
  
  };
  const addToSyncHistory = (action, status, message): any => {
    const entry = {
    id: Date.now(),
      timestamp: new Date(),
      action,
      status,
      message
  
  };
    setSyncHistory(prev => [entry, ...prev.slice(0, 9)
  ]); // Keep last 10 entries
  };
  const formatTimestamp = timestamp => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString()
  };
  const formatDuration = ms => {
    if (!ms) return 'N/A';
    const minutes = Math.floor() {
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes`
  }m ${seconds}s ago`
  };
  const getStatusIcon = status => {
    switch (true) {
    case 'success':
        return <CheckCircle className="text-green-500" size={16
  }  />;
      case 'error':
        return <XCircle className="text-red-500" size={16}  />;
      default:
        return <AlertCircle className="text-yellow-500" size={16}  / /></AlertCircle>
    }
  };
  const tabs = [
    { id: 'database', label: 'Database', icon: Database },
    { id: 'sets', label: 'Set Management', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];
  return (
    <any />
    <div className="min-h-screen bg-primary" />
    <div className="container py-6" />
    <div className="mb-6"><p className="text-secondary" /></p>
      </p>
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg" />
    <button`
                key={tab.id}``
                onClick={() => setActiveTab(tab.id)}```
                className={`flex items-center gap-2 px-4 py-0 whitespace-nowrap rounded-md transition-colors ${
    activeTab === tab.id`
                    ? 'bg-blue-600 text-white'` : null`
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'```
  }`}
              >
                <Icon className="w-4 h-4"  / /></Icon>
                {tab.label}
            )
          })}
        </div>
      <div />
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" />
    <div className="card" />
    <div className="flex items-center gap-3 mb-2" />
    <Wifi className="text-green-500" size={20}  / /></Wifi>
                  ) : (
                    <WifiOff className="text-red-500" size={20}  / /></WifiOff>
                  )}
                </div>
      <p className="text-sm text-secondary" />
    <p className="text-xs text-red-600 mt-1" /></p>
      </div>
              {/* Cache Status */}
              <div className="card" />
    <div className="flex items-center gap-3 mb-2" />
    <Database className="text-blue-500" size={20}  / /></Database>
                </div>
      <p className="text-sm text-secondary" /></p>
      </p>
                <p className="text-xs text-secondary" /></p>
      </div>
              {/* Last Sync */}
              <div className="card" />
    <div className="flex items-center gap-3 mb-2" />
    <RefreshCw className="text-purple-500" size={20}  / /></RefreshCw>
                </div>
      <p className="text-sm text-secondary" /></p>
      </div>
              {/* Total Cards */}
              <div className="card" />
    <div className="flex items-center gap-3 mb-2" />
    <Settings className="text-orange-500" size={20}  / /></Settings>
                </div>
      <p className="text-2xl font-bold">{stats.totalCards}
              </div>
      <div className="card mb-6" />
    <div className="flex flex-wrap gap-3" />
    <button
                  onClick={testConnection}
                  disabled={testing}
                  className="btn btn-secondary" />
    <Wifi className={testing ? 'animate-pulse' : ''} size={16}  / /></Wifi>
                  {testing ? 'Testing...' : 'Test Connection'}
                <button
                  onClick={handleSync}
                  disabled={syncing || !connectionStatus? .connected}
                  className="btn btn-primary" />
    <RefreshCw : null
                    className={syncing ? 'animate-spin' : ''}
                    size={16}  / /></RefreshCw>
                  {syncing ? 'Syncing...' : 'Sync from Google Sheets'}
                <button onClick={clearCache} className="btn btn-warning" />
    <Database size={16}  / /></Database>
                  Clear Cache
                </button>
      <button onClick={loadAdminData} className="btn btn-secondary" />
    <RefreshCw size={16}  / /></RefreshCw>
                  Refresh Status
                </button>
      </div>
            {/* Sync History */}
            <div className="card" />
    <p className="text-secondary">No recent activity</p>
    </>
  ) : (
                <div className="space-y-3" /></div>
                  {syncHistory.map(entry => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 p-3 bg-secondary rounded-lg" /></div>
                      {getStatusIcon(entry.status)}
                      <div className="flex-1" />
    <div className="flex items-center gap-2 mb-1" />
    <span className="font-medium capitalize" /></span>
                            {entry.action.replace('_', ' ')}
                          <span className="text-xs text-secondary" /></span>
                            {entry.timestamp.toLocaleTimeString()}
                        </div>
                        <p className="text-sm text-secondary" /></p>
                          {entry.message}
                      </div>
                  ))}
                </div>
              )}
            </div>
            {/* Configuration Help */}
            <div className="card mt-6" />
    <div className="space-y-4" />
    <div />
    <ol className="list-decimal list-inside space-y-2 text-sm text-secondary" />
    <li>Create a Google Sheets document with your card data</li>
                    <li /></li>
                      Set up a Google Cloud Project and enable the Sheets API
                    </li>
                    <li /></li>
                      Create a service account and download the credentials
                    </li>
                    <li /></li>
                      Share your spreadsheet with the service account email
                    </li>
                    <li>Set the environment variables in your backend</li>
                </div>
                <div />
    <p className="text-sm text-secondary mb-2" /></p>
                    Your spreadsheet should have a sheet named "Cards" with
                    these columns:
                  </p>
                  <div className="bg-secondary p-3 rounded text-sm font-mono" /></div>
                    ID | Name | Elements | Keywords | Cost | Power | Rarity |
                    Text
                  </div>
              </div>
          </div>
        )}
        {activeTab === 'sets' && <SetManager  />}
        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-lg p-6" />
    <p className="text-gray-400" /></p>
              Additional settings will be available here.
            </p>
        )}
    </div>
  )`
};``
export default AdminPanel;```