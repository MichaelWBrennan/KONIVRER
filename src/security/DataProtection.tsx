import React, { useState, useEffect } from 'react';
import { useSecurityContext } from './SecurityProvider';

interface UserData {
  gameProgress: any;
  preferences: any;
  statistics: any;
}

interface DataProtectionHooks {
  userData: UserData | null;
  saveUserData: (data: Partial<UserData>) => void;
  clearUserData: () => void;
  exportUserData: () => string;
  importUserData: (data: string) => boolean;
  getDataUsage: () => any;
}

export const useDataProtection = (): DataProtectionHooks => {
  const { encryptData, decryptData, logSecurityEvent, checkDataConsent } = useSecurityContext();
  const [userData, setUserData] = useState<UserData | null>(null);

  // Load user data on mount
  useEffect(() => {
    if (checkDataConsent()) {
      loadUserData();
    }
  }, []);

  const loadUserData = () => {
    try {
      const encryptedData = localStorage.getItem('userData');
      if (encryptedData) {
        const decryptedData = decryptData(encryptedData);
        const parsedData = JSON.parse(decryptedData);
        setUserData(parsedData);
        logSecurityEvent('USER_DATA_LOADED');
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      logSecurityEvent('USER_DATA_LOAD_FAILED', { error: (error as Error).message });
    }
  };

  const saveUserData = (data: Partial<UserData>) => {
    if (!checkDataConsent()) {
      logSecurityEvent('DATA_SAVE_BLOCKED_NO_CONSENT');
      return;
    }

    try {
      const currentData = userData || { gameProgress: {}, preferences: {}, statistics: {} };
      const updatedData = { ...currentData, ...data };
      
      const encryptedData = encryptData(JSON.stringify(updatedData));
      localStorage.setItem('userData', encryptedData);
      localStorage.setItem('dataLastModified', new Date().toISOString());
      
      setUserData(updatedData);
      logSecurityEvent('USER_DATA_SAVED', { dataKeys: Object.keys(data) });
    } catch (error) {
      console.error('Failed to save user data:', error);
      logSecurityEvent('USER_DATA_SAVE_FAILED', { error: (error as Error).message });
    }
  };

  const clearUserData = () => {
    try {
      localStorage.removeItem('userData');
      localStorage.removeItem('dataLastModified');
      localStorage.removeItem('dataConsent');
      localStorage.removeItem('consentTimestamp');
      setUserData(null);
      logSecurityEvent('USER_DATA_CLEARED');
    } catch (error) {
      console.error('Failed to clear user data:', error);
      logSecurityEvent('USER_DATA_CLEAR_FAILED', { error: (error as Error).message });
    }
  };

  const exportUserData = (): string => {
    try {
      const exportData = {
        userData: userData,
        consentTimestamp: localStorage.getItem('consentTimestamp'),
        dataLastModified: localStorage.getItem('dataLastModified'),
        exportTimestamp: new Date().toISOString()
      };
      
      logSecurityEvent('USER_DATA_EXPORTED');
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export user data:', error);
      logSecurityEvent('USER_DATA_EXPORT_FAILED', { error: (error as Error).message });
      return '';
    }
  };

  const importUserData = (data: string): boolean => {
    try {
      const importedData = JSON.parse(data);
      
      if (importedData.userData) {
        saveUserData(importedData.userData);
        logSecurityEvent('USER_DATA_IMPORTED');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to import user data:', error);
      logSecurityEvent('USER_DATA_IMPORT_FAILED', { error: (error as Error).message });
      return false;
    }
  };

  const getDataUsage = () => {
    const usage = {
      totalStorageUsed: 0,
      dataTypes: {} as Record<string, number>,
      lastModified: localStorage.getItem('dataLastModified'),
      consentGranted: checkDataConsent(),
      consentTimestamp: localStorage.getItem('consentTimestamp')
    };

    // Calculate storage usage
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const value = localStorage.getItem(key) || '';
        const size = new Blob([value]).size;
        usage.totalStorageUsed += size;
        usage.dataTypes[key] = size;
      }
    }

    return usage;
  };

  return {
    userData,
    saveUserData,
    clearUserData,
    exportUserData,
    importUserData,
    getDataUsage
  };
};

export const DataProtectionPanel: React.FC = () => {
  const { userData, clearUserData, exportUserData, getDataUsage } = useDataProtection();
  const { logSecurityEvent } = useSecurityContext();
  const [showPanel, setShowPanel] = useState(false);
  const [dataUsage, setDataUsage] = useState<any>(null);

  useEffect(() => {
    if (showPanel) {
      setDataUsage(getDataUsage());
    }
  }, [showPanel]);

  const handleExportData = () => {
    const exportedData = exportUserData();
    const blob = new Blob([exportedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `konivrer-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    logSecurityEvent('DATA_EXPORT_DOWNLOADED');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      clearUserData();
      setDataUsage(getDataUsage());
      logSecurityEvent('DATA_CLEARED_BY_USER');
    }
  };

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}
        title="Data Protection Settings"
      >
        🔒
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#333', margin: 0 }}>🔒 Data Protection & Privacy</h2>
          <button
            onClick={() => setShowPanel(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>📊 Your Data Usage</h3>
          {dataUsage && (
            <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
              <p><strong>Total Storage Used:</strong> {(dataUsage.totalStorageUsed / 1024).toFixed(2)} KB</p>
              <p><strong>Consent Status:</strong> {dataUsage.consentGranted ? '✅ Granted' : '❌ Not Granted'}</p>
              <p><strong>Last Modified:</strong> {dataUsage.lastModified ? new Date(dataUsage.lastModified).toLocaleString() : 'Never'}</p>
              <p><strong>Data Types:</strong></p>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                {Object.entries(dataUsage.dataTypes).map(([key, size]) => (
                  <li key={key}>{key}: {((size as number) / 1024).toFixed(2)} KB</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>🛡️ Your Rights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleExportData}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              📥 Export My Data
            </button>
            <button
              onClick={handleClearData}
              style={{
                background: '#f44336',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🗑️ Delete All My Data
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>🔐 Security Features</h3>
          <ul style={{ color: '#666', lineHeight: 1.6 }}>
            <li>✅ All data encrypted in local storage</li>
            <li>✅ No data sent to external servers</li>
            <li>✅ Security event logging for protection</li>
            <li>✅ GDPR compliant data handling</li>
            <li>✅ Content Security Policy enabled</li>
            <li>✅ XSS and CSRF protection</li>
          </ul>
        </div>

        <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.5 }}>
          <p><strong>Privacy Notice:</strong> This game respects your privacy. All data is stored locally on your device and never transmitted to external servers. You have full control over your data and can export or delete it at any time.</p>
        </div>
      </div>
    </div>
  );
};