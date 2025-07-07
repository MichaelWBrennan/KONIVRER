/**
 * Speed Monitor Component
 * Development-only component for real-time performance monitoring
 */

import React, { useState, useEffect } from 'react';
import { speedTracker, getPerformanceReport } from '../utils/speedTracking';
import { shouldSkipAutonomousSystems } from '../utils/buildDetection';

interface SpeedMonitorProps {
  showInProduction?: boolean;
}

const SpeedMonitor: React.FC<SpeedMonitorProps> = ({ showInProduction = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Only show in development or if explicitly enabled for production
    const shouldShow = process.env.NODE_ENV === 'development' || showInProduction;
    const isNotBuilding = !shouldSkipAutonomousSystems();
    
    setIsEnabled(shouldShow && isNotBuilding);

    if (isEnabled) {
      const interval = setInterval(() => {
        const summary = speedTracker.getPerformanceSummary();
        setMetrics(summary);
      }, 2000); // Update every 2 seconds

      return () => clearInterval(interval);
    }
  }, [showInProduction, isEnabled]);

  if (!isEnabled) return null;

  const formatMetric = (value: number): string => {
    if (value < 1000) {
      return `${value.toFixed(1)}ms`;
    } else {
      return `${(value / 1000).toFixed(2)}s`;
    }
  };

  const getMetricColor = (name: string, value: number): string => {
    // Color coding based on performance thresholds
    if (name.includes('LCP') || name.includes('LARGEST_CONTENTFUL_PAINT')) {
      return value < 2500 ? '#22c55e' : value < 4000 ? '#f59e0b' : '#ef4444';
    }
    if (name.includes('FID') || name.includes('FIRST_INPUT_DELAY')) {
      return value < 100 ? '#22c55e' : value < 300 ? '#f59e0b' : '#ef4444';
    }
    if (name.includes('CLS') || name.includes('CUMULATIVE_LAYOUT_SHIFT')) {
      return value < 0.1 ? '#22c55e' : value < 0.25 ? '#f59e0b' : '#ef4444';
    }
    if (name.includes('TTFB') || name.includes('TIME_TO_FIRST_BYTE')) {
      return value < 800 ? '#22c55e' : value < 1800 ? '#f59e0b' : '#ef4444';
    }
    // Default: green for fast, yellow for medium, red for slow
    return value < 1000 ? '#22c55e' : value < 3000 ? '#f59e0b' : '#ef4444';
  };

  const downloadReport = () => {
    const report = getPerformanceReport();
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${new Date().toISOString().slice(0, 19)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 10000,
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        transform: isVisible ? 'translateX(0)' : 'translateX(calc(100% - 40px))',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isVisible ? '10px' : '0',
          cursor: 'pointer',
        }}
        onClick={() => setIsVisible(!isVisible)}
      >
        <span style={{ fontWeight: 'bold' }}>⚡ Speed Monitor</span>
        <span style={{ fontSize: '16px' }}>{isVisible ? '−' : '+'}</span>
      </div>

      {isVisible && (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Core Web Vitals & Performance</strong>
          </div>
          
          {Object.entries(metrics).length === 0 ? (
            <div style={{ color: '#888' }}>Collecting metrics...</div>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {Object.entries(metrics)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([name, value]) => (
                  <div
                    key={name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                      padding: '2px 4px',
                      borderRadius: '3px',
                      background: 'rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <span style={{ fontSize: '10px', opacity: 0.8 }}>
                      {name.replace(/_/g, ' ')}
                    </span>
                    <span
                      style={{
                        color: getMetricColor(name, value),
                        fontWeight: 'bold',
                      }}
                    >
                      {formatMetric(value)}
                    </span>
                  </div>
                ))}
            </div>
          )}

          <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
            <button
              onClick={downloadReport}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer',
              }}
            >
              📊 Export Report
            </button>
            <button
              onClick={() => {
                setMetrics({});
                console.log('[SPEED MONITOR] Metrics cleared');
              }}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer',
              }}
            >
              🗑️ Clear
            </button>
          </div>

          <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.6 }}>
            Updates every 2s • Dev mode only
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedMonitor;