import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSSO } from '../services/ssoService';
import { useKeycloak } from '../services/keycloakService';
import { useRoleAccess, AdminAccess, PremiumAccess, DeckBuilderAccess } from './RoleBasedAccess';

// Keycloak Demo Component
const KeycloakDemo: React.FC = () => {
  const { getCurrentUser, initiateLogin, logout } = useSSO();
  const { validateToken, getUserInfo, isTokenExpired } = useKeycloak();
  const { user, hasRole, hasAnyRole, roles, isKeycloakUser } = useRoleAccess();
  
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Check token validity on mount
  useEffect(() => {
    if (user?.provider === 'keycloak') {
      checkTokenValidity();
    }
  }, [user]);

  const checkTokenValidity = async () => {
    if (!user?.accessToken) return;
    
    setLoading(true);
    try {
      const isValid = await validateToken(user.accessToken);
      setTokenValid(isValid);
      
      if (isValid) {
        const info = await getUserInfo(user.accessToken);
        setUserInfo(info);
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      setTokenValid(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeycloakLogin = () => {
    initiateLogin('keycloak');
  };

  if (!isKeycloakUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="keycloak-demo"
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          color: 'white',
          textAlign: 'center',
          margin: '20px 0'
        }}
      >
        <h2 style={{ marginBottom: '16px' }}>🔐 Keycloak Integration Demo</h2>
        <p style={{ marginBottom: '24px', opacity: 0.9 }}>
          Experience enterprise-grade authentication with role-based access control
        </p>
        
        <button
          onClick={handleKeycloakLogin}
          style={{
            padding: '12px 24px',
            background: '#4d4d4d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#333';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#4d4d4d';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Login with Keycloak
        </button>
        
        <div style={{ marginTop: '24px', fontSize: '14px', opacity: 0.8 }}>
          <p>Demo Features:</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>✅ Role-based access control</li>
            <li>✅ Token validation and refresh</li>
            <li>✅ User profile management</li>
            <li>✅ Secure logout</li>
          </ul>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="keycloak-demo"
      style={{
        padding: '24px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        margin: '20px 0'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>🔐 Keycloak User Dashboard</h2>
        <button
          onClick={logout}
          style={{
            padding: '8px 16px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* User Information */}
      <div style={{ marginBottom: '24px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#495057' }}>User Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div>
            <strong>Name:</strong> {user.name}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>Username:</strong> {user.username}
          </div>
          <div>
            <strong>Realm:</strong> {user.realm}
          </div>
          <div>
            <strong>Email Verified:</strong> {user.emailVerified ? '✅' : '❌'}
          </div>
          <div>
            <strong>Provider:</strong> {user.provider}
          </div>
        </div>
      </div>

      {/* Token Information */}
      <div style={{ marginBottom: '24px', padding: '16px', background: '#e7f3ff', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#0056b3' }}>Token Status</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div>
            <strong>Valid:</strong> {loading ? '⏳' : tokenValid ? '✅' : '❌'}
          </div>
          <div>
            <strong>Expired:</strong> {isTokenExpired(user.accessToken) ? '❌' : '✅'}
          </div>
          <button
            onClick={checkTokenValidity}
            disabled={loading}
            style={{
              padding: '6px 12px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Checking...' : 'Validate Token'}
          </button>
        </div>
      </div>

      {/* Roles and Permissions */}
      <div style={{ marginBottom: '24px', padding: '16px', background: '#fff3cd', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#856404' }}>Roles & Permissions</h3>
        <div style={{ marginBottom: '12px' }}>
          <strong>Assigned Roles:</strong>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
            {roles.map(role => (
              <span
                key={role}
                style={{
                  padding: '4px 8px',
                  background: '#ffc107',
                  color: '#212529',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                {role}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <strong>Groups:</strong>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
            {user.groups?.map(group => (
              <span
                key={group}
                style={{
                  padding: '4px 8px',
                  background: '#17a2b8',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                {group}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Role-Based Access Demo */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Role-Based Access Control Demo</h3>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Admin Access */}
          <AdminAccess
            fallback={
              <div style={{ padding: '12px', background: '#f8d7da', color: '#721c24', borderRadius: '6px' }}>
                ❌ Admin access denied - requires admin, super-admin, or moderator role
              </div>
            }
          >
            <div style={{ padding: '12px', background: '#d4edda', color: '#155724', borderRadius: '6px' }}>
              ✅ Admin Panel Access - You have administrative privileges!
            </div>
          </AdminAccess>

          {/* Premium Access */}
          <PremiumAccess
            fallback={
              <div style={{ padding: '12px', background: '#f8d7da', color: '#721c24', borderRadius: '6px' }}>
                ❌ Premium access denied - requires premium subscription
              </div>
            }
          >
            <div style={{ padding: '12px', background: '#d4edda', color: '#155724', borderRadius: '6px' }}>
              ✅ Premium Features Access - You have premium privileges!
            </div>
          </PremiumAccess>

          {/* Deck Builder Access */}
          <DeckBuilderAccess
            fallback={
              <div style={{ padding: '12px', background: '#f8d7da', color: '#721c24', borderRadius: '6px' }}>
                ❌ Deck builder access denied - requires deck-builder role
              </div>
            }
          >
            <div style={{ padding: '12px', background: '#d4edda', color: '#155724', borderRadius: '6px' }}>
              ✅ Deck Builder Access - You can create and edit decks!
            </div>
          </DeckBuilderAccess>
        </div>
      </div>

      {/* Role Check Examples */}
      <div style={{ padding: '16px', background: '#e2e3e5', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#383d41' }}>Role Check Examples</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
          <div>
            <strong>Is Admin:</strong> {hasRole('admin') ? '✅' : '❌'}
          </div>
          <div>
            <strong>Is Premium:</strong> {hasRole('premium') ? '✅' : '❌'}
          </div>
          <div>
            <strong>Can Build Decks:</strong> {hasRole('deck-builder') ? '✅' : '❌'}
          </div>
          <div>
            <strong>Is Staff:</strong> {hasAnyRole(['admin', 'moderator', 'super-admin']) ? '✅' : '❌'}
          </div>
          <div>
            <strong>Tournament Organizer:</strong> {hasRole('tournament-organizer') ? '✅' : '❌'}
          </div>
          <div>
            <strong>Basic User:</strong> {hasRole('user') ? '✅' : '❌'}
          </div>
        </div>
      </div>

      {/* User Info from Keycloak */}
      {userInfo && (
        <details style={{ marginTop: '24px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#495057' }}>
            Raw Keycloak User Info (Click to expand)
          </summary>
          <pre style={{
            background: '#f8f9fa',
            padding: '16px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '12px',
            marginTop: '12px'
          }}>
            {JSON.stringify(userInfo, null, 2)}
          </pre>
        </details>
      )}
    </motion.div>
  );
};

export default KeycloakDemo;