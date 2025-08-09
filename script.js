// KONIVRER Demo Interactive Functionality
document.addEventListener('DOMContentLoaded', function() {
  initBubbleMenu();
  initAccessibilitySettings();
  initTabs();
  initFilters();
  initBottomNav();
  setResponsiveBubbleMenu();
});

// Bubble Menu Functionality
function initBubbleMenu() {
  const bubbleMenu = document.getElementById('bubble-menu');
  const bubbles = [
    { btn: 'accessibility-btn', panel: 'accessibility-panel' },
    { btn: 'search-btn', panel: 'search-panel' },
    { btn: 'login-btn', panel: 'login-panel' },
    { btn: 'menu-btn', panel: 'menu-panel' }
  ];

  // Set responsive positioning
  setResponsiveBubbleMenu();
  
  // Handle bubble interactions
  bubbles.forEach(({ btn, panel }) => {
    const button = document.getElementById(btn);
    const panelElement = document.getElementById(panel);
    
    if (button && panelElement) {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePanel(panelElement, button);
        
        // Update hamburger animation for menu button
        if (btn === 'menu-btn') {
          const hamburger = document.getElementById('hamburger');
          if (hamburger) {
            hamburger.classList.toggle('open');
          }
        }
      });
    }
  });

  // Close panels when clicking outside
  document.addEventListener('click', (e) => {
    if (!bubbleMenu.contains(e.target)) {
      closeAllPanels();
    }
  });

  // Close panels on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllPanels();
    }
  });
}

function togglePanel(panel, button) {
  const isVisible = panel.style.display !== 'none';
  
  // Close all other panels first
  closeAllPanels();
  
  if (!isVisible) {
    panel.style.display = 'block';
    button.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
  }
}

function closeAllPanels() {
  const panels = ['accessibility-panel', 'search-panel', 'login-panel', 'menu-panel'];
  const buttons = ['accessibility-btn', 'search-btn', 'login-btn', 'menu-btn'];
  
  panels.forEach(id => {
    const panel = document.getElementById(id);
    if (panel) {
      panel.style.display = 'none';
      panel.setAttribute('aria-hidden', 'true');
    }
  });
  
  buttons.forEach(id => {
    const button = document.getElementById(id);
    if (button) {
      button.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close hamburger animation
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.classList.remove('open');
  }
}

// Accessibility Settings
function initAccessibilitySettings() {
  const fontSizeSelect = document.getElementById('font-size');
  const contrastSelect = document.getElementById('contrast');
  const dyslexicFontCheckbox = document.getElementById('dyslexic-font');
  
  if (fontSizeSelect) {
    fontSizeSelect.addEventListener('change', (e) => {
      document.documentElement.setAttribute('data-font-size', e.target.value);
      localStorage.setItem('font-size', e.target.value);
    });
    
    // Load saved setting
    const savedFontSize = localStorage.getItem('font-size');
    if (savedFontSize) {
      fontSizeSelect.value = savedFontSize;
      document.documentElement.setAttribute('data-font-size', savedFontSize);
    }
  }
  
  if (contrastSelect) {
    contrastSelect.addEventListener('change', (e) => {
      document.documentElement.setAttribute('data-contrast', e.target.value);
      localStorage.setItem('contrast', e.target.value);
    });
    
    // Load saved setting
    const savedContrast = localStorage.getItem('contrast');
    if (savedContrast) {
      contrastSelect.value = savedContrast;
      document.documentElement.setAttribute('data-contrast', savedContrast);
    }
  }
  
  if (dyslexicFontCheckbox) {
    dyslexicFontCheckbox.addEventListener('change', (e) => {
      document.documentElement.setAttribute('data-dyslexic-font', e.target.checked);
      localStorage.setItem('dyslexic-font', e.target.checked);
    });
    
    // Load saved setting
    const savedDyslexicFont = localStorage.getItem('dyslexic-font');
    if (savedDyslexicFont === 'true') {
      dyslexicFontCheckbox.checked = true;
      document.documentElement.setAttribute('data-dyslexic-font', 'true');
    }
  }
}

// Responsive Bubble Menu Positioning
function setResponsiveBubbleMenu() {
  const bubbleMenu = document.getElementById('bubble-menu');
  if (!bubbleMenu) return;
  
  function updatePosition() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      bubbleMenu.classList.remove('desktop');
      bubbleMenu.classList.add('mobile');
    } else {
      bubbleMenu.classList.remove('mobile');
      bubbleMenu.classList.add('desktop');
    }
  }
  
  updatePosition();
  window.addEventListener('resize', updatePosition);
}

// Tabs Functionality
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      
      // Remove active class from all buttons and panels
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));
      
      // Add active class to clicked button and corresponding panel
      button.classList.add('active');
      const targetPanel = document.getElementById(tabId + '-tab');
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
      
      // Update ARIA attributes
      tabButtons.forEach(btn => btn.setAttribute('aria-selected', 'false'));
      button.setAttribute('aria-selected', 'true');
    });
  });
}

// Post Filters
function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const postCards = document.querySelectorAll('.post-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      
      // Update active filter button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter posts
      postCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.3s ease-in';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Bottom Navigation
function initBottomNav() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const page = item.getAttribute('data-page');
      
      // Update active nav item
      navItems.forEach(navItem => navItem.classList.remove('active'));
      item.classList.add('active');
      
      // In a real app, this would navigate to different pages
      console.log(`Navigating to ${page} page`);
      
      // For demo purposes, show a notification
      showNotification(`Navigating to ${page.charAt(0).toUpperCase() + page.slice(1)} page`);
    });
  });
}

// Menu Navigation
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('menu-item')) {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    e.target.classList.add('active');
    
    const label = e.target.querySelector('.menu-label')?.textContent || 'Unknown';
    showNotification(`Selected ${label} from menu`);
  }
});

// Search functionality
document.addEventListener('submit', (e) => {
  if (e.target.querySelector('.search-input')) {
    e.preventDefault();
    const searchTerm = e.target.querySelector('.search-input').value;
    if (searchTerm.trim()) {
      showNotification(`Searching for: ${searchTerm}`);
      // In a real app, this would perform actual search
    }
  }
});

// Notification system
function showNotification(message) {
  // Remove any existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--accent-color);
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    animation: slideDown 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideUp 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideDown {
    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateX(-50%) translateY(0); opacity: 1; }
    to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
  // Tab navigation for accessibility
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-navigation');
});

// Initialize demo data
function initDemoData() {
  // This would normally load from an API
  console.log('Demo initialized with sample data');
}

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
  setResponsiveBubbleMenu();
});

// Initialize all demo functionality
window.addEventListener('load', () => {
  initDemoData();
});