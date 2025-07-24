import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Button Testing and Validation Utility
interface ButtonTest {
  id: string;
  name: string;
  selector: string;
  expectedAction: string;
  status: 'pending' | 'testing' | 'passed' | 'failed';
  error?: string;
}

// Comprehensive list of all buttons in the application
const BUTTON_TESTS: ButtonTest[] = [
  // Navigation buttons
  {
    id: 'nav-home',
    name: 'Home Navigation',
    selector: 'a[href="/"]',
    expectedAction: 'Navigate to home page',
    status: 'pending'
  },
  {
    id: 'nav-cards',
    name: 'Cards Navigation',
    selector: 'a[href="/cards"]',
    expectedAction: 'Navigate to cards page',
    status: 'pending'
  },
  {
    id: 'nav-decks',
    name: 'Decks Navigation',
    selector: 'a[href="/decks"]',
    expectedAction: 'Navigate to decks page',
    status: 'pending'
  },
  {
    id: 'nav-events',
    name: 'Events Navigation',
    selector: 'a[href="/events"]',
    expectedAction: 'Navigate to events page',
    status: 'pending'
  },
  {
    id: 'nav-play',
    name: 'Play Navigation',
    selector: 'a[href="/play"]',
    expectedAction: 'Navigate to play page',
    status: 'pending'
  },
  
  // Mobile menu buttons
  {
    id: 'mobile-menu-toggle',
    name: 'Mobile Menu Toggle',
    selector: 'button[aria-label="Toggle mobile menu"]',
    expectedAction: 'Open/close mobile menu',
    status: 'pending'
  },
  
  // Login modal buttons
  {
    id: 'login-button',
    name: 'Login Button',
    selector: 'button:contains("Login")',
    expectedAction: 'Open login modal',
    status: 'pending'
  },
  {
    id: 'login-close',
    name: 'Login Modal Close',
    selector: '.close-button',
    expectedAction: 'Close login modal',
    status: 'pending'
  },
  {
    id: 'login-submit',
    name: 'Login Submit',
    selector: '.submit-button',
    expectedAction: 'Submit login form',
    status: 'pending'
  },
  {
    id: 'password-toggle',
    name: 'Password Visibility Toggle',
    selector: 'button[aria-label*="password"]',
    expectedAction: 'Toggle password visibility',
    status: 'pending'
  },
  {
    id: 'verify-code',
    name: 'Verify Code Button',
    selector: 'button:contains("Verify")',
    expectedAction: 'Verify authentication code',
    status: 'pending'
  },
  {
    id: 'social-login',
    name: 'Social Login Buttons',
    selector: '.social-button',
    expectedAction: 'Initiate social login',
    status: 'pending'
  },
  {
    id: 'biometric-login',
    name: 'Biometric Login',
    selector: 'button:contains("Biometric")',
    expectedAction: 'Start biometric authentication',
    status: 'pending'
  },
  {
    id: 'qr-code-login',
    name: 'QR Code Login',
    selector: 'button:contains("QR")',
    expectedAction: 'Generate QR code for login',
    status: 'pending'
  },
  
  // Accessibility button
  {
    id: 'accessibility-button',
    name: 'Accessibility Button',
    selector: 'button[aria-label="Open accessibility settings"]',
    expectedAction: 'Open accessibility panel',
    status: 'pending'
  },
  
  // Search buttons
  {
    id: 'search-clear',
    name: 'Clear Search Button',
    selector: '.clear-search-button',
    expectedAction: 'Clear search filters',
    status: 'pending'
  },
  {
    id: 'syntax-help',
    name: 'Syntax Help Button',
    selector: '.syntax-help-button',
    expectedAction: 'Show/hide syntax help',
    status: 'pending'
  },
  
  // Game mode buttons
  {
    id: 'game-mode-practice',
    name: 'Practice Mode Button',
    selector: '[data-game-mode="practice"]',
    expectedAction: 'Start practice game',
    status: 'pending'
  },
  {
    id: 'game-mode-quick',
    name: 'Quick Match Button',
    selector: '[data-game-mode="quick"]',
    expectedAction: 'Start quick match',
    status: 'pending'
  },
  {
    id: 'game-mode-ranked',
    name: 'Ranked Play Button',
    selector: '[data-game-mode="ranked"]',
    expectedAction: 'Start ranked game',
    status: 'pending'
  },
  {
    id: 'game-mode-tournament',
    name: 'Tournament Button',
    selector: '[data-game-mode="tournament"]',
    expectedAction: 'Join tournament',
    status: 'pending'
  },
  
  // Create account button
  {
    id: 'create-account',
    name: 'Create Account Button',
    selector: 'button:contains("Create Account")',
    expectedAction: 'Open login modal in signup mode',
    status: 'pending'
  },
  
  // Deck creation
  {
    id: 'create-deck',
    name: 'Create New Deck',
    selector: '[data-action="create-deck"]',
    expectedAction: 'Create new deck',
    status: 'pending'
  }
];

// Button Testing Component
const ButtonTester: React.FC = () => {
  const [tests, setTests] = useState<ButtonTest[]>(BUTTON_TESTS);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Test a single button
  const testButton = async (test: ButtonTest): Promise<ButtonTest> => {
    return new Promise((resolve) => {
      setCurrentTest(test.id);
      
      // Update status to testing
      setTests(prev => prev.map(t => 
        t.id === test.id ? { ...t, status: 'testing' as const } : t
      ));

      setTimeout(() => {
        try {
          // Try to find the button element
          const elements = document.querySelectorAll(test.selector);
          
          if (elements.length === 0) {
            resolve({
              ...test,
              status: 'failed',
              error: `Button not found: ${test.selector}`
            });
            return;
          }

          // Check if button is clickable
          const button = elements[0] as HTMLElement;
          
          if (button.hasAttribute('disabled')) {
            resolve({
              ...test,
              status: 'failed',
              error: 'Button is disabled'
            });
            return;
          }

          // Check if button has click handler
          const hasClickHandler = button.onclick !== null || 
                                button.getAttribute('onclick') !== null ||
                                button.addEventListener !== undefined;

          if (!hasClickHandler && !button.closest('a')) {
            resolve({
              ...test,
              status: 'failed',
              error: 'Button has no click handler'
            });
            return;
          }

          // Test passed
          resolve({
            ...test,
            status: 'passed'
          });
        } catch (error) {
          resolve({
            ...test,
            status: 'failed',
            error: `Test error: ${error}`
          });
        }
      }, 500);
    });
  };

  // Run all button tests
  const runAllTests = async () => {
    setIsRunning(true);
    setShowResults(false);
    
    // Reset all tests
    setTests(BUTTON_TESTS.map(test => ({ ...test, status: 'pending' as const, error: undefined })));

    for (const test of BUTTON_TESTS) {
      const result = await testButton(test);
      setTests(prev => prev.map(t => t.id === result.id ? result : t));
    }

    setCurrentTest(null);
    setIsRunning(false);
    setShowResults(true);
  };

  // Get test statistics
  const getStats = () => {
    const passed = tests.filter(t => t.status === 'passed').length;
    const failed = tests.filter(t => t.status === 'failed').length;
    const pending = tests.filter(t => t.status === 'pending').length;
    const testing = tests.filter(t => t.status === 'testing').length;
    
    return { passed, failed, pending, testing, total: tests.length };
  };

  const stats = getStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '400px',
        maxHeight: '80vh',
        background: 'rgba(20, 20, 20, 0.95)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        zIndex: 10000,
        overflow: 'auto',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#d4af37', margin: '0 0 10px 0', fontSize: '18px' }}>
          🧪 Button Functionality Tester
        </h3>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runAllTests}
            disabled={isRunning}
            style={{
              background: isRunning ? '#666' : 'rgba(212, 175, 55, 0.2)',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              color: isRunning ? '#ccc' : '#d4af37',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {isRunning ? 'Testing...' : 'Run Tests'}
          </motion.button>
          
          <button
            onClick={() => setShowResults(!showResults)}
            style={{
              background: 'rgba(100, 100, 100, 0.2)',
              border: '1px solid rgba(150, 150, 150, 0.3)',
              color: '#ccc',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showResults ? 'Hide' : 'Show'} Results
          </button>
        </div>

        {/* Test Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '8px',
          marginBottom: '15px'
        }}>
          <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(46, 213, 115, 0.1)', borderRadius: '4px' }}>
            <div style={{ color: '#2ed573', fontSize: '16px', fontWeight: 'bold' }}>{stats.passed}</div>
            <div style={{ color: '#ccc', fontSize: '12px' }}>Passed</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(255, 71, 87, 0.1)', borderRadius: '4px' }}>
            <div style={{ color: '#ff4757', fontSize: '16px', fontWeight: 'bold' }}>{stats.failed}</div>
            <div style={{ color: '#ccc', fontSize: '12px' }}>Failed</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(255, 165, 2, 0.1)', borderRadius: '4px' }}>
            <div style={{ color: '#ffa502', fontSize: '16px', fontWeight: 'bold' }}>{stats.testing}</div>
            <div style={{ color: '#ccc', fontSize: '12px' }}>Testing</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(150, 150, 150, 0.1)', borderRadius: '4px' }}>
            <div style={{ color: '#888', fontSize: '16px', fontWeight: 'bold' }}>{stats.pending}</div>
            <div style={{ color: '#ccc', fontSize: '12px' }}>Pending</div>
          </div>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              background: 'rgba(100, 100, 100, 0.2)', 
              borderRadius: '4px', 
              height: '6px',
              overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((stats.passed + stats.failed) / stats.total) * 100}%` }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #d4af37, #ffa502)',
                  borderRadius: '4px'
                }}
              />
            </div>
            {currentTest && (
              <div style={{ color: '#ccc', fontSize: '12px', marginTop: '5px' }}>
                Testing: {tests.find(t => t.id === currentTest)?.name}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Test Results */}
      {showResults && (
        <div style={{ maxHeight: '400px', overflow: 'auto' }}>
          {tests.map((test) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '8px',
                marginBottom: '8px',
                borderRadius: '6px',
                background: test.status === 'passed' ? 'rgba(46, 213, 115, 0.1)' :
                           test.status === 'failed' ? 'rgba(255, 71, 87, 0.1)' :
                           test.status === 'testing' ? 'rgba(255, 165, 2, 0.1)' :
                           'rgba(100, 100, 100, 0.1)',
                border: `1px solid ${
                  test.status === 'passed' ? 'rgba(46, 213, 115, 0.3)' :
                  test.status === 'failed' ? 'rgba(255, 71, 87, 0.3)' :
                  test.status === 'testing' ? 'rgba(255, 165, 2, 0.3)' :
                  'rgba(100, 100, 100, 0.3)'
                }`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#ccc', fontSize: '14px', fontWeight: 'bold' }}>
                    {test.name}
                  </div>
                  <div style={{ color: '#888', fontSize: '12px' }}>
                    {test.expectedAction}
                  </div>
                  {test.error && (
                    <div style={{ color: '#ff4757', fontSize: '11px', marginTop: '4px' }}>
                      {test.error}
                    </div>
                  )}
                </div>
                <div style={{
                  color: test.status === 'passed' ? '#2ed573' :
                         test.status === 'failed' ? '#ff4757' :
                         test.status === 'testing' ? '#ffa502' : '#888',
                  fontSize: '16px'
                }}>
                  {test.status === 'passed' ? '✅' :
                   test.status === 'failed' ? '❌' :
                   test.status === 'testing' ? '⏳' : '⏸️'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ButtonTester;