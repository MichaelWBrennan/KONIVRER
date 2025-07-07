import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SecurityProvider, useSecurityContext } from '../SecurityProvider';
import React from 'react';

// Mock localStorage and sessionStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock crypto.getRandomValues
Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: vi.fn(() => new Uint32Array([1, 2, 3, 4])),
  },
});

// Test component that uses security context
const TestComponent: React.FC = () => {
  const {
    isSecure,
    encryptData,
    decryptData,
    sanitizeInput,
    logSecurityEvent,
    checkDataConsent,
  } = useSecurityContext();

  return (
    <div>
      <div data-testid="security-status">
        {isSecure ? 'secure' : 'not-secure'}
      </div>
      <button
        data-testid="encrypt-btn"
        onClick={() => {
          const encrypted = encryptData('test data');
          const decrypted = decryptData(encrypted);
          console.log('Encryption test:', { encrypted, decrypted });
        }}
      >
        Test Encryption
      </button>
      <button
        data-testid="sanitize-btn"
        onClick={() => {
          const sanitized = sanitizeInput('<script>alert("xss")</script>');
          console.log('Sanitized:', sanitized);
        }}
      >
        Test Sanitization
      </button>
      <button
        data-testid="log-btn"
        onClick={() => logSecurityEvent('TEST_EVENT', { test: true })}
      >
        Test Logging
      </button>
      <div data-testid="consent-status">
        {checkDataConsent() ? 'granted' : 'not-granted'}
      </div>
    </div>
  );
};

describe('SecurityProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    sessionStorageMock.getItem.mockReturnValue(null);
  });

  it('should provide security context', () => {
    render(
      <SecurityProvider>
        <TestComponent />
      </SecurityProvider>,
    );

    expect(screen.getByTestId('security-status')).toBeInTheDocument();
  });

  it('should initialize security measures', async () => {
    render(
      <SecurityProvider>
        <TestComponent />
      </SecurityProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('security-status')).toHaveTextContent('secure');
    });

    // Should generate session ID
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
      'sessionId',
      expect.any(String),
    );
  });

  it('should encrypt and decrypt data', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <SecurityProvider>
        <TestComponent />
      </SecurityProvider>,
    );

    fireEvent.click(screen.getByTestId('encrypt-btn'));

    expect(consoleSpy).toHaveBeenCalledWith(
      'Encryption test:',
      expect.objectContaining({
        encrypted: expect.any(String),
        decrypted: 'test data',
      }),
    );

    consoleSpy.mockRestore();
  });

  it('should sanitize input to prevent XSS', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <SecurityProvider>
        <TestComponent />
      </SecurityProvider>,
    );

    fireEvent.click(screen.getByTestId('sanitize-btn'));

    expect(consoleSpy).toHaveBeenCalledWith(
      'Sanitized:',
      expect.not.stringContaining('<script>'),
    );

    consoleSpy.mockRestore();
  });

  it('should log security events', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <SecurityProvider>
        <TestComponent />
      </SecurityProvider>,
    );

    fireEvent.click(screen.getByTestId('log-btn'));

    expect(consoleSpy).toHaveBeenCalledWith(
      '[SECURITY LOG]',
      expect.objectContaining({
        event: 'TEST_EVENT',
        details: { test: true },
        timestamp: expect.any(String),
      }),
    );

    consoleSpy.mockRestore();
  });

  it('should check data consent', () => {
    localStorageMock.getItem.mockImplementation(key => {
      if (key === 'dataConsent') return 'granted';
      return null;
    });

    render(
      <SecurityProvider>
        <TestComponent />
      </SecurityProvider>,
    );

    expect(screen.getByTestId('consent-status')).toHaveTextContent('granted');
  });

  it('should handle missing consent', () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <SecurityProvider>
        <TestComponent />
      </SecurityProvider>,
    );

    expect(screen.getByTestId('consent-status')).toHaveTextContent(
      'not-granted',
    );
  });

  it('should throw error when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useSecurityContext must be used within SecurityProvider');

    consoleSpy.mockRestore();
  });
});
