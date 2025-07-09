/**
 * Diagnostic App - Test autonomous systems one by one
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { shouldSkipAutonomousSystems } from '../utils/buildDetection';

const DiagnosticApp: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  
  const addDiagnostic = (message: string) => {
    console.log('[DIAGNOSTIC]', message);
    setDiagnostics(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };
  
  const addError = (error: string) => {
    console.error('[DIAGNOSTIC ERROR]', error);
    setErrors(prev => [...prev, `${new Date().toISOString()}: ${error}`]);
  };

  useEffect(() => {
    addDiagnostic('Starting diagnostic tests...');
    addDiagnostic(`Build detection result: ${shouldSkipAutonomousSystems()}`);
    
    // Test each autonomous system individually
    const testSystems = async () => {
      try {
        addDiagnostic('Testing speedTracking import...');
        const speedTracking = await import('../utils/speedTracking');
        addDiagnostic('✅ speedTracking imported successfully');
        
        if (speedTracking.trackCustomMetric) {
          speedTracking.trackCustomMetric('diagnostic_test', 1);
          addDiagnostic('✅ trackCustomMetric called successfully');
        }
      } catch (error) {
        addError(`❌ speedTracking failed: ${error}`);
      }

      try {
        addDiagnostic('Testing SpeedMonitor import...');
        const SpeedMonitor = await import('../components/SpeedMonitor');
        addDiagnostic('✅ SpeedMonitor imported successfully');
      } catch (error) {
        addError(`❌ SpeedMonitor failed: ${error}`);
      }

      try {
        addDiagnostic('Testing SecurityProvider import...');
        const SecurityProvider = await import('../security/SecurityProvider');
        addDiagnostic('✅ SecurityProvider imported successfully');
      } catch (error) {
        addError(`❌ SecurityProvider failed: ${error}`);
      }

      try {
        addDiagnostic('Testing SecurityAutomation import...');
        const SecurityAutomation = await import('../security/SecurityAutomation');
        addDiagnostic('✅ SecurityAutomation imported successfully');
      } catch (error) {
        addError(`❌ SecurityAutomation failed: ${error}`);
      }

      try {
        addDiagnostic('Testing UltraAutonomousCore import...');
        const UltraAutonomousCore = await import('../automation/UltraAutonomousCore');
        addDiagnostic('✅ UltraAutonomousCore imported successfully');
        
        // Test the hook
        if (UltraAutonomousCore.useUltraAutonomousCore) {
          addDiagnostic('✅ useUltraAutonomousCore hook available');
        }
      } catch (error) {
        addError(`❌ UltraAutonomousCore failed: ${error}`);
      }

      try {
        addDiagnostic('Testing BackgroundCodeEvolution import...');
        const BackgroundCodeEvolution = await import('../automation/BackgroundCodeEvolution');
        addDiagnostic('✅ BackgroundCodeEvolution imported successfully');
      } catch (error) {
        addError(`❌ BackgroundCodeEvolution failed: ${error}`);
      }

      try {
        addDiagnostic('Testing BackgroundDependencyManager import...');
        const BackgroundDependencyManager = await import('../automation/BackgroundDependencyManager');
        addDiagnostic('✅ BackgroundDependencyManager imported successfully');
      } catch (error) {
        addError(`❌ BackgroundDependencyManager failed: ${error}`);
      }

      addDiagnostic('Diagnostic tests completed');
    };

    testSystems();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <Router>
        <header style={{
          background: 'rgba(15, 15, 15, 0.95)',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <nav style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link to="/" style={{ color: '#d4af37', textDecoration: 'none' }}>🏠 Home</Link>
            <Link to="/cards" style={{ color: '#d4af37', textDecoration: 'none' }}>🗃️ Cards</Link>
            <Link to="/decks" style={{ color: '#d4af37', textDecoration: 'none' }}>📚 Decks</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={
            <div>
              <h1 style={{ color: '#d4af37', marginBottom: '30px' }}>🔍 KONIVRER Diagnostic Mode</h1>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  <h3 style={{ color: '#d4af37', marginBottom: '15px' }}>✅ Successful Operations</h3>
                  <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                    {diagnostics.map((diagnostic, index) => (
                      <div key={index} style={{ 
                        color: '#ccc', 
                        fontSize: '12px', 
                        marginBottom: '5px',
                        fontFamily: 'monospace'
                      }}>
                        {diagnostic}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 0, 0, 0.05)',
                  border: '1px solid rgba(255, 0, 0, 0.3)',
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  <h3 style={{ color: '#ff6b6b', marginBottom: '15px' }}>❌ Errors</h3>
                  <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                    {errors.length === 0 ? (
                      <div style={{ color: '#ccc', fontStyle: 'italic' }}>No errors detected</div>
                    ) : (
                      errors.map((error, index) => (
                        <div key={index} style={{ 
                          color: '#ff6b6b', 
                          fontSize: '12px', 
                          marginBottom: '5px',
                          fontFamily: 'monospace'
                        }}>
                          {error}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '8px',
                padding: '20px',
                marginTop: '20px'
              }}>
                <h3 style={{ color: '#d4af37', marginBottom: '15px' }}>📊 System Status</h3>
                <p style={{ color: '#ccc' }}>
                  Build Detection: {shouldSkipAutonomousSystems() ? '🔴 Disabled' : '🟢 Enabled'}
                </p>
                <p style={{ color: '#ccc' }}>
                  Environment: {process.env.NODE_ENV || 'unknown'}
                </p>
                <p style={{ color: '#ccc' }}>
                  Vercel: {process.env.VERCEL ? '🟢 Yes' : '🔴 No'}
                </p>
                <p style={{ color: '#ccc' }}>
                  Window: {typeof window !== 'undefined' ? '🟢 Available' : '🔴 Unavailable'}
                </p>
              </div>
            </div>
          } />
          <Route path="/cards" element={<div style={{ color: '#d4af37' }}>Cards Page</div>} />
          <Route path="/decks" element={<div style={{ color: '#d4af37' }}>Decks Page</div>} />
        </Routes>
      </Router>
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default DiagnosticApp;