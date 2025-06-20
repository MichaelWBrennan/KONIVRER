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
  Package,
} from 'lucide-react';
import cardsService from '../services/cardsService';
import SetManager from '../components/SetManager';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('database');
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [cacheStatus, setCacheStatus] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncHistory, setSyncHistory] = useState([]);
  const [stats, setStats] = useState({
    totalCards: 0,
    lastSync: null,
    cacheAge: null,
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    // Get cache status
    const cache = cardsService.getCacheStatus();
    setCacheStatus(cache);

    // Test connection
    await testConnection();

    // Get current cards for stats
    try {
      const cards = await cardsService.getCards();
      setStats(prev => ({
        ...prev,
        totalCards: cards.length,
        lastSync: cache.lastFetchTime,
        cacheAge: cache.cacheAge,
      }));
    } catch (error) {
      console.error('Error loading cards for stats:', error);
    }
  };

  const testConnection = async () => {
    setTesting(true);
    try {
      const status = await cardsService.testConnection();
      setConnectionStatus(status);
      addToSyncHistory(
        'connection_test',
        status.connected ? 'success' : 'error',
        status.message || status.error,
      );
    } catch (error) {
      setConnectionStatus({ connected: false, error: error.message });
      addToSyncHistory('connection_test', 'error', error.message);
    } finally {
      setTesting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await cardsService.syncCards();
      if (result.success) {
        addToSyncHistory('sync', 'success', result.message);
        setStats(prev => ({
          ...prev,
          totalCards: result.cards.length,
          lastSync: Date.now(),
        }));
        // Refresh cache status
        setCacheStatus(cardsService.getCacheStatus());
      } else {
        addToSyncHistory('sync', 'error', result.message);
      }
    } catch (error) {
      addToSyncHistory('sync', 'error', error.message);
    } finally {
      setSyncing(false);
    }
  };

  const clearCache = () => {
    cardsService.clearCache();
    setCacheStatus(cardsService.getCacheStatus());
    addToSyncHistory('cache_clear', 'success', 'Cache cleared successfully');
  };

  const addToSyncHistory = (action, status, message) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date(),
      action,
      status,
      message,
    };
    setSyncHistory(prev => [entry, ...prev.slice(0, 9)]); // Keep last 10 entries
  };

  const formatTimestamp = timestamp => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = ms => {
    if (!ms) return 'N/A';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s ago`;
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'error':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <AlertCircle className="text-yellow-500" size={16} />;
    }
  };

  const tabs = [
    { id: 'database', label: 'Database', icon: Database },
    { id: 'sets', label: 'Set Management', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-primary">
      <div className="container py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-secondary">
            Manage Google Sheets integration, card database, and sets
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'database' && (
          <div>
            {/* Status Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Connection Status */}
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              {connectionStatus?.connected ? (
                <Wifi className="text-green-500" size={20} />
              ) : (
                <WifiOff className="text-red-500" size={20} />
              )}
              <h3 className="font-semibold">Connection</h3>
            </div>
            <p className="text-sm text-secondary">
              {connectionStatus?.connected
                ? 'Connected to Google Sheets'
                : 'Disconnected'}
            </p>
            {connectionStatus?.error && (
              <p className="text-xs text-red-600 mt-1">
                {connectionStatus.error}
              </p>
            )}
          </div>

          {/* Cache Status */}
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Database className="text-blue-500" size={20} />
              <h3 className="font-semibold">Cache</h3>
            </div>
            <p className="text-sm text-secondary">
              {cacheStatus?.hasCache
                ? `${stats.totalCards} cards cached`
                : 'No cache'}
            </p>
            <p className="text-xs text-secondary">
              {cacheStatus?.isExpired ? 'Expired' : 'Fresh'} •{' '}
              {formatDuration(cacheStatus?.cacheAge)}
            </p>
          </div>

          {/* Last Sync */}
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <RefreshCw className="text-purple-500" size={20} />
              <h3 className="font-semibold">Last Sync</h3>
            </div>
            <p className="text-sm text-secondary">
              {formatTimestamp(stats.lastSync)}
            </p>
          </div>

          {/* Total Cards */}
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="text-orange-500" size={20} />
              <h3 className="font-semibold">Total Cards</h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalCards}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={testConnection}
              disabled={testing}
              className="btn btn-secondary"
            >
              <Wifi className={testing ? 'animate-pulse' : ''} size={16} />
              {testing ? 'Testing...' : 'Test Connection'}
            </button>

            <button
              onClick={handleSync}
              disabled={syncing || !connectionStatus?.connected}
              className="btn btn-primary"
            >
              <RefreshCw className={syncing ? 'animate-spin' : ''} size={16} />
              {syncing ? 'Syncing...' : 'Sync from Google Sheets'}
            </button>

            <button onClick={clearCache} className="btn btn-warning">
              <Database size={16} />
              Clear Cache
            </button>

            <button onClick={loadAdminData} className="btn btn-secondary">
              <RefreshCw size={16} />
              Refresh Status
            </button>
          </div>
        </div>

        {/* Sync History */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {syncHistory.length === 0 ? (
            <p className="text-secondary">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {syncHistory.map(entry => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 p-3 bg-secondary rounded-lg"
                >
                  {getStatusIcon(entry.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium capitalize">
                        {entry.action.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-secondary">
                        {entry.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-secondary">{entry.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Configuration Help */}
        <div className="card mt-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Google Sheets Setup</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-secondary">
                <li>Create a Google Sheets document with your card data</li>
                <li>Set up a Google Cloud Project and enable the Sheets API</li>
                <li>Create a service account and download the credentials</li>
                <li>Share your spreadsheet with the service account email</li>
                <li>Set the environment variables in your backend</li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium mb-2">Expected Spreadsheet Format</h3>
              <p className="text-sm text-secondary mb-2">
                Your spreadsheet should have a sheet named "Cards" with these
                columns:
              </p>
              <div className="bg-secondary p-3 rounded text-sm font-mono">
                ID | Name | Elements | Keywords | Cost | Power | Rarity | Text
              </div>
            </div>
          </div>
        </div>
          </div>
        )}

        {activeTab === 'sets' && (
          <SetManager />
        )}

        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
            <p className="text-gray-400">Additional settings will be available here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
