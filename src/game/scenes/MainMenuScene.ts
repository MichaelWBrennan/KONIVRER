import Phaser from 'phaser';

// Extend window interface for game integration
declare global {
  interface Window {
    setShowGame?: (show: boolean) => void;
    KONIVRER_GAME_MODES?: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      difficulty: string;
      requiresAccount: boolean;
    }>;
    KONIVRER_USER_DATA?: {
      isLoggedIn: boolean;
      showLoginModal: () => void;
    };
    KONIVRER_ACCESSIBILITY_CLICKED?: () => void;
    KONIVRER_CURRENT_SCENE?: string;
  }
}

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  preload(): void {
    // Create simple colored rectangles as placeholders for card graphics
    this.load.image('card-back', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create(): void {
    // Set current scene in window object
    window.KONIVRER_CURRENT_SCENE = 'MainMenuScene';
    
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a1a);

    // Title
    const title = this.add.text(width / 2, height / 8, 'KONIVRER', {
      fontSize: '64px',
      color: '#d4af37',
      fontFamily: 'Arial, sans-serif'
    });
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(width / 2, height / 8 + 80, 'Mystical Trading Card Game', {
      fontSize: '24px',
      color: '#cccccc',
      fontFamily: 'Arial, sans-serif'
    });
    subtitle.setOrigin(0.5);

    // Welcome Message
    const welcomeText = this.add.text(width / 2, height / 4 + 40, 'Choose Your Battle', {
      fontSize: '28px',
      color: '#d4af37',
      fontFamily: 'Arial, sans-serif'
    });
    welcomeText.setOrigin(0.5);

    const welcomeSubtext = this.add.text(width / 2, height / 4 + 80, 'Select a game mode below and begin your mystical journey', {
      fontSize: '16px',
      color: '#cccccc',
      fontFamily: 'Arial, sans-serif'
    });
    welcomeSubtext.setOrigin(0.5);

    // Get game modes from window object or use defaults
    const gameModes = window.KONIVRER_GAME_MODES || [
      {
        id: 'practice',
        title: 'Practice Mode',
        description: 'Play against AI opponents to learn the game',
        icon: '',
        difficulty: 'Beginner Friendly',
        requiresAccount: false
      },
      {
        id: 'quick',
        title: 'Quick Match',
        description: 'Jump into a game with a random opponent',
        icon: '',
        difficulty: 'All Levels',
        requiresAccount: false
      },
      {
        id: 'ranked',
        title: 'Ranked Play',
        description: 'Compete for ranking points and seasonal rewards',
        icon: '',
        difficulty: 'Competitive',
        requiresAccount: false
      },
      {
        id: 'tournament',
        title: 'Tournament',
        description: 'Join structured tournaments with prizes',
        icon: '👑',
        difficulty: 'Expert',
        requiresAccount: false
      }
    ];

    // User data
    const userData = window.KONIVRER_USER_DATA || { isLoggedIn: false, showLoginModal: () => {} };

    // Account Benefits Banner (if not logged in)
    if (!userData.isLoggedIn) {
      const bannerBg = this.add.rectangle(width / 2, height / 3 + 20, width * 0.8, 100, 0x2a2a2a);
      bannerBg.setStrokeStyle(1, 0xd4af37);
      
      const bannerTitle = this.add.text(width / 2, height / 3, 'Play Instantly - No Account Required!', {
        fontSize: '18px',
        color: '#d4af37',
        fontFamily: 'Arial, sans-serif'
      });
      bannerTitle.setOrigin(0.5);
      
      const bannerText = this.add.text(width / 2, height / 3 + 30, 'Jump right into the action! Having an account lets you save decks,\ntrack progress, and compete in ranked matches.', {
        fontSize: '14px',
        color: '#cccccc',
        fontFamily: 'Arial, sans-serif',
        align: 'center'
      });
      bannerText.setOrigin(0.5);
      
      // Create Account Button
      const createAccountButton = this.add.rectangle(width / 2 - 80, height / 3 + 70, 150, 30, 0x3a3a3a);
      createAccountButton.setStrokeStyle(1, 0xd4af37);
      createAccountButton.setInteractive({ useHandCursor: true });
      
      const createAccountText = this.add.text(width / 2 - 80, height / 3 + 70, 'Create Account', {
        fontSize: '14px',
        color: '#d4af37',
        fontFamily: 'Arial, sans-serif'
      });
      createAccountText.setOrigin(0.5);
      
      // Play as Guest Button
      const guestButton = this.add.rectangle(width / 2 + 80, height / 3 + 70, 150, 30, 0x2a2a2a);
      guestButton.setStrokeStyle(1, 0x888888);
      guestButton.setInteractive({ useHandCursor: true });
      
      const guestText = this.add.text(width / 2 + 80, height / 3 + 70, 'Play as Guest', {
        fontSize: '14px',
        color: '#888888',
        fontFamily: 'Arial, sans-serif'
      });
      guestText.setOrigin(0.5);
      
      // Button interactions
      createAccountButton.on('pointerdown', () => {
        if (userData.showLoginModal) {
          userData.showLoginModal();
        }
      });
      
      guestButton.on('pointerdown', () => {
        this.scene.start('CardBattleScene');
      });
      
      // Hover effects
      createAccountButton.on('pointerover', () => {
        createAccountButton.setFillStyle(0x4a4a4a);
      });
      createAccountButton.on('pointerout', () => {
        createAccountButton.setFillStyle(0x3a3a3a);
      });
      
      guestButton.on('pointerover', () => {
        guestButton.setFillStyle(0x3a3a3a);
      });
      guestButton.on('pointerout', () => {
        guestButton.setFillStyle(0x2a2a2a);
      });
    }

    // Game Mode Buttons - Create a grid of buttons for each game mode
    const startY = userData.isLoggedIn ? height / 3 + 40 : height / 2 + 20;
    const buttonWidth = 280;
    const buttonHeight = 120;
    const buttonSpacing = 20;
    const buttonsPerRow = 2;
    
    gameModes.forEach((mode, index) => {
      const row = Math.floor(index / buttonsPerRow);
      const col = index % buttonsPerRow;
      
      const xPos = width / 2 + (col - 0.5) * (buttonWidth + buttonSpacing);
      const yPos = startY + row * (buttonHeight + buttonSpacing);
      
      // Button background
      const button = this.add.rectangle(xPos, yPos, buttonWidth, buttonHeight, 0x2a2a2a);
      button.setStrokeStyle(1, 0xd4af37);
      button.setInteractive({ useHandCursor: true });
      
      // Title
      const modeTitle = this.add.text(xPos - buttonWidth / 2 + 20, yPos - buttonHeight / 2 + 20, mode.title, {
        fontSize: '18px',
        color: '#d4af37',
        fontFamily: 'Arial, sans-serif'
      });
      
      // Description
      const modeDesc = this.add.text(xPos - buttonWidth / 2 + 20, yPos - buttonHeight / 2 + 50, mode.description, {
        fontSize: '14px',
        color: '#cccccc',
        fontFamily: 'Arial, sans-serif',
        wordWrap: { width: buttonWidth - 40 }
      });
      
      // Difficulty tag
      const difficultyTag = this.add.text(xPos - buttonWidth / 2 + 20, yPos + buttonHeight / 2 - 20, mode.difficulty, {
        fontSize: '12px',
        color: '#888888',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#1a1a1a',
        padding: { x: 8, y: 4 }
      });
      
      // Arrow indicator
      const arrow = this.add.text(xPos + buttonWidth / 2 - 30, yPos + buttonHeight / 2 - 20, '→', {
        fontSize: '18px',
        color: '#d4af37',
        fontFamily: 'Arial, sans-serif'
      });
      
      // Button interactions based on mode
      button.on('pointerdown', () => {
        switch(mode.id) {
          case 'practice':
            this.scene.start('CardBattleScene');
            break;
          case 'quick':
            this.scene.start('EnhancedCardBattleScene');
            break;
          case 'ranked':
            this.scene.start('PremiumCardBattleScene');
            break;
          case 'tournament':
            this.scene.start('PremiumCardBattleScene');
            break;
          default:
            this.scene.start('CardBattleScene');
        }
      });
      
      // Hover effects
      button.on('pointerover', () => {
        button.setFillStyle(0x3a3a3a);
        button.setStrokeStyle(2, 0xd4af37);
      });
      
      button.on('pointerout', () => {
        button.setFillStyle(0x2a2a2a);
        button.setStrokeStyle(1, 0xd4af37);
      });
    });

    // Quick Start Section
    const quickStartY = startY + Math.ceil(gameModes.length / buttonsPerRow) * (buttonHeight + buttonSpacing) + 20;
    
    const quickStartBg = this.add.rectangle(width / 2, quickStartY + 50, width * 0.8, 120, 0x1a1a1a);
    quickStartBg.setStrokeStyle(1, 0xd4af37);
    
    const quickStartTitle = this.add.text(width / 2, quickStartY + 20, 'New to KONIVRER?', {
      fontSize: '18px',
      color: '#d4af37',
      fontFamily: 'Arial, sans-serif'
    });
    quickStartTitle.setOrigin(0.5);
    
    const quickStartText = this.add.text(width / 2, quickStartY + 50, 'Start with Practice Mode to learn the basics,\nthen challenge other players in Quick Match!', {
      fontSize: '14px',
      color: '#cccccc',
      fontFamily: 'Arial, sans-serif',
      align: 'center'
    });
    quickStartText.setOrigin(0.5);
    
    // Tutorial Button
    const tutorialButton = this.add.rectangle(width / 2 - 80, quickStartY + 90, 150, 40, 0x3a3a3a);
    tutorialButton.setStrokeStyle(2, 0xd4af37);
    tutorialButton.setInteractive({ useHandCursor: true });
    
    const tutorialText = this.add.text(width / 2 - 80, quickStartY + 90, 'Start Tutorial', {
      fontSize: '16px',
      color: '#d4af37',
      fontFamily: 'Arial, sans-serif'
    });
    tutorialText.setOrigin(0.5);
    
    // Quick Match Button
    const quickMatchButton = this.add.rectangle(width / 2 + 80, quickStartY + 90, 150, 40, 0x2a2a2a);
    quickMatchButton.setStrokeStyle(2, 0xd4af37);
    quickMatchButton.setInteractive({ useHandCursor: true });
    
    const quickMatchText = this.add.text(width / 2 + 80, quickStartY + 90, 'Quick Match', {
      fontSize: '16px',
      color: '#d4af37',
      fontFamily: 'Arial, sans-serif'
    });
    quickMatchText.setOrigin(0.5);
    
    // Button interactions
    tutorialButton.on('pointerdown', () => {
      this.scene.start('CardBattleScene');
    });
    
    quickMatchButton.on('pointerdown', () => {
      this.scene.start('EnhancedCardBattleScene');
    });
    
    // Hover effects
    tutorialButton.on('pointerover', () => {
      tutorialButton.setFillStyle(0x4a4a4a);
    });
    tutorialButton.on('pointerout', () => {
      tutorialButton.setFillStyle(0x3a3a3a);
    });
    
    quickMatchButton.on('pointerover', () => {
      quickMatchButton.setFillStyle(0x3a3a3a);
    });
    quickMatchButton.on('pointerout', () => {
      quickMatchButton.setFillStyle(0x2a2a2a);
    });

    // Deck Builder Button
    const deckBuilderButton = this.add.rectangle(width / 2, quickStartY + 150, 200, 40, 0x2a2a2a);
    deckBuilderButton.setStrokeStyle(2, 0x4ecdc4);
    deckBuilderButton.setInteractive({ useHandCursor: true });

    const deckBuilderText = this.add.text(width / 2, quickStartY + 150, 'DECK BUILDER', {
      fontSize: '16px',
      color: '#4ecdc4',
      fontFamily: 'Arial, sans-serif'
    });
    deckBuilderText.setOrigin(0.5);

    // Button interactions
    deckBuilderButton.on('pointerdown', () => {
      this.scene.start('DeckBuilderScene');
    });

    // Hover effects
    deckBuilderButton.on('pointerover', () => {
      deckBuilderButton.setFillStyle(0x3a3a3a);
    });
    deckBuilderButton.on('pointerout', () => {
      deckBuilderButton.setFillStyle(0x2a2a2a);
    });

    // Close Game Button
    const closeButton = this.add.rectangle(width - 50, 30, 80, 30, 0xff6b6b);
    closeButton.setInteractive({ cursor: 'pointer' });
    
    const closeText = this.add.text(width - 50, 30, 'Close', {
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);

    closeButton.on('pointerdown', () => {
      if (window.setShowGame) {
        window.setShowGame(false);
      }
    });
    
    // Accessibility Button
    const accessibilityButton = this.add.rectangle(width - 150, 30, 120, 30, 0x3498db);
    accessibilityButton.setInteractive({ cursor: 'pointer' });
    
    const accessibilityText = this.add.text(width - 150, 30, '♿ Accessibility', {
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);

    accessibilityButton.on('pointerdown', () => {
      // Store the current scene state
      const currentSceneData = this.scene.settings.data;
      
      // Show accessibility options dialog
      alert('Accessibility options coming soon!');
      
      // Signal to the GameContainer that the accessibility button was clicked
      if (window.KONIVRER_ACCESSIBILITY_CLICKED) {
        window.KONIVRER_ACCESSIBILITY_CLICKED();
      }
    });
    
    // Hover effects for accessibility button
    accessibilityButton.on('pointerover', () => {
      accessibilityButton.setFillStyle(0x2980b9);
    });
    accessibilityButton.on('pointerout', () => {
      accessibilityButton.setFillStyle(0x3498db);
    });
  }
}