import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  showPrompt: boolean;
  isStandalone: boolean;
}

interface PWAInstallActions {
  install: () => Promise<void>;
  dismissPrompt: () => void;
  showInstallPrompt: () => void;
}

export const usePWAInstall = (): PWAInstallState & PWAInstallActions => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');
      setIsStandalone(standalone);
      setIsInstalled(standalone);
    };

    checkStandalone();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const beforeInstallEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(beforeInstallEvent);
      setIsInstallable(true);
      
      // Show prompt after a delay if not dismissed before
      setTimeout(() => {
        if (!localStorage.getItem('pwa-prompt-dismissed') && !isInstalled) {
          setShowPrompt(true);
        }
      }, 5000); // Show after 5 seconds
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-prompt-dismissed');
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const install = async (): Promise<void> => {
    if (!deferredPrompt) {
      console.log('No install prompt available');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const dismissPrompt = (): void => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    
    // Auto-show again after 7 days
    const dismissTime = Date.now();
    localStorage.setItem('pwa-prompt-dismiss-time', dismissTime.toString());
  };

  const showInstallPrompt = (): void => {
    if (isInstallable && !isInstalled) {
      setShowPrompt(true);
    }
  };

  // Check if enough time has passed since last dismissal
  useEffect(() => {
    const dismissTime = localStorage.getItem('pwa-prompt-dismiss-time');
    if (dismissTime) {
      const daysSinceDismiss = (Date.now() - parseInt(dismissTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss > 7) {
        localStorage.removeItem('pwa-prompt-dismissed');
        localStorage.removeItem('pwa-prompt-dismiss-time');
      }
    }
  }, []);

  return {
    isInstallable,
    isInstalled,
    showPrompt,
    isStandalone,
    install,
    dismissPrompt,
    showInstallPrompt
  };
};