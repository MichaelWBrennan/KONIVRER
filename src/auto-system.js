/**
 * KONIVRER Auto-System
 * 
 * This module automatically starts the fully autonomous development system
 * when the application loads. It runs in the background with no need for
 * user input or interaction.
 * 
 * It's designed to be imported once at application startup and will
 * automatically handle all development tasks.
 */

// Only run in development mode
const isDevelopment = 
  // Check for development environment
  (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') && 
  // Skip in Vercel environment
  !process.env.VERCEL && 
  // Skip in CI environment
  !process.env.CI && 
  // Skip in build environment
  !process.env.BUILD_MODE && 
  // Skip if explicitly disabled
  process.env.DISABLE_AUTO_SYSTEM !== 'true';

// Auto-start the autonomous system
if (isDevelopment) {
  console.log('🚀 Auto-starting fully autonomous development system...');
  
  // Self-healing mechanism - if the system fails, it will restart after a delay
  const startAutonomousSystem = () => {
    // Import the dev-automation module dynamically to avoid bundling it in production
    import('../dev-automation.js')
      .then(module => {
        // Start the zero-interaction mode
        module.default.startZeroInteractionMode()
          .then(() => {
            console.log('✅ Fully autonomous system started successfully');
          })
          .catch(error => {
            console.error('❌ Error starting autonomous system:', error);
            // Retry after a delay
            setTimeout(startAutonomousSystem, 5000);
          });
      })
      .catch(error => {
        console.error('❌ Error importing dev-automation module:', error);
        // Retry after a delay
        setTimeout(startAutonomousSystem, 5000);
      });
  };
  
  // Start the system
  startAutonomousSystem();
  
  // Also start the system when the window loads (for browser environments)
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      console.log('🔄 Ensuring autonomous system is running after window load...');
      startAutonomousSystem();
    });
  }
}

// Export the auto-system status
export default {
  isRunning: isDevelopment,
  version: '2.0.0',
  description: 'Fully autonomous development system'
};