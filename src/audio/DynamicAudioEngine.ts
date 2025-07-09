import * as Tone from 'tone';

export interface AudioConfig {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  spatialAudio: boolean;
  adaptiveMusic: boolean;
}

export interface GameState {
  phase: 'menu' | 'deck-building' | 'match' | 'victory' | 'defeat';
  tension: number; // 0-1
  playerHealth: number;
  opponentHealth: number;
  cardsInHand: number;
  turnNumber: number;
}

export interface SoundEffect {
  id: string;
  type: 'card-play' | 'attack' | 'spell' | 'ui' | 'ambient';
  position?: { x: number; y: number; z: number };
  priority: number;
}

export class DynamicAudioEngine {
  private isInitialized = false;
  private config: AudioConfig;
  private currentGameState: GameState;
  private musicSynths: Map<string, Tone.Synth> = new Map();
  private sfxSynths: Map<string, Tone.Synth> = new Map();
  private masterGain: Tone.Gain;
  private musicGain: Tone.Gain;
  private sfxGain: Tone.Gain;
  private spatialPanner: Tone.Panner3D;
  private currentMusicPattern: Tone.Pattern | null = null;
  private ambientLoop: Tone.Loop | null = null;

  constructor() {
    this.config = {
      masterVolume: 0.7,
      musicVolume: 0.5,
      sfxVolume: 0.8,
      spatialAudio: true,
      adaptiveMusic: true
    };

    this.currentGameState = {
      phase: 'menu',
      tension: 0,
      playerHealth: 100,
      opponentHealth: 100,
      cardsInHand: 7,
      turnNumber: 1
    };

    // Initialize audio chain
    this.masterGain = new Tone.Gain(this.config.masterVolume);
    this.musicGain = new Tone.Gain(this.config.musicVolume);
    this.sfxGain = new Tone.Gain(this.config.sfxVolume);
    this.spatialPanner = new Tone.Panner3D(0, 0, 0);

    // Connect audio chain
    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.spatialPanner);
    this.spatialPanner.connect(this.masterGain);
    this.masterGain.toDestination();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Tone.start();
      
      // Initialize synthesizers
      this.initializeSynths();
      
      // Start ambient audio
      this.startAmbientAudio();
      
      this.isInitialized = true;
      console.log('DynamicAudioEngine initialized successfully');
    } catch (error) {
      console.error('Failed to initialize DynamicAudioEngine:', error);
    }
  }

  private initializeSynths(): void {
    // Music synthesizers
    this.musicSynths.set('lead', new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.3, release: 1 }
    }).connect(this.musicGain));

    this.musicSynths.set('bass', new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.5 }
    }).connect(this.musicGain));

    this.musicSynths.set('pad', new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.5, decay: 0.2, sustain: 0.7, release: 2 }
    }).connect(this.musicGain));

    // SFX synthesizers
    this.sfxSynths.set('card', new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
    }).connect(this.sfxGain));

    this.sfxSynths.set('spell', new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.05, decay: 0.3, sustain: 0.2, release: 0.5 }
    }).connect(this.sfxGain));

    this.sfxSynths.set('ui', new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.05, sustain: 0, release: 0.05 }
    }).connect(this.sfxGain));
  }

  private startAmbientAudio(): void {
    // Create ambient background loop
    this.ambientLoop = new Tone.Loop((time) => {
      const padSynth = this.musicSynths.get('pad');
      if (padSynth) {
        // Generate ambient chord based on game state
        const chord = this.generateAmbientChord();
        chord.forEach((note, index) => {
          padSynth.triggerAttackRelease(note, '2n', time + index * 0.1);
        });
      }
    }, '4n');

    this.ambientLoop.start();
  }

  updateGameState(newState: Partial<GameState>): void {
    this.currentGameState = { ...this.currentGameState, ...newState };
    
    if (this.config.adaptiveMusic) {
      this.adaptMusic();
    }
  }

  private adaptMusic(): void {
    const { phase, tension, playerHealth, opponentHealth } = this.currentGameState;
    
    // Adjust music based on game state
    switch (phase) {
      case 'menu':
        this.playMenuMusic();
        break;
      case 'deck-building':
        this.playDeckBuildingMusic();
        break;
      case 'match':
        this.playMatchMusic(tension);
        break;
      case 'victory':
        this.playVictoryMusic();
        break;
      case 'defeat':
        this.playDefeatMusic();
        break;
    }

    // Adjust tempo based on tension
    if (this.currentMusicPattern) {
      const baseTempo = 120;
      const tempoMultiplier = 1 + (tension * 0.5);
      Tone.Transport.bpm.value = baseTempo * tempoMultiplier;
    }

    // Health-based audio effects
    if (playerHealth < 30) {
      this.addLowHealthEffect();
    }
  }

  private playMenuMusic(): void {
    this.stopCurrentMusic();
    
    const leadSynth = this.musicSynths.get('lead');
    const bassSynth = this.musicSynths.get('bass');
    
    if (leadSynth && bassSynth) {
      const melody = ['C4', 'E4', 'G4', 'C5', 'G4', 'E4'];
      const bassLine = ['C2', 'C2', 'F2', 'F2', 'G2', 'G2'];
      
      this.currentMusicPattern = new Tone.Pattern((time, note) => {
        leadSynth.triggerAttackRelease(note, '8n', time);
      }, melody, 'up');
      
      const bassPattern = new Tone.Pattern((time, note) => {
        bassSynth.triggerAttackRelease(note, '4n', time);
      }, bassLine, 'up');
      
      this.currentMusicPattern.start();
      bassPattern.start();
    }
  }

  private playMatchMusic(tension: number): void {
    this.stopCurrentMusic();
    
    const leadSynth = this.musicSynths.get('lead');
    const bassSynth = this.musicSynths.get('bass');
    
    if (leadSynth && bassSynth) {
      // Generate dynamic melody based on tension
      const baseMelody = ['D4', 'F4', 'A4', 'D5'];
      const tenseMelody = ['D#4', 'F#4', 'A#4', 'D#5'];
      
      const melody = baseMelody.map((note, index) => {
        return tension > 0.5 ? tenseMelody[index] : note;
      });
      
      this.currentMusicPattern = new Tone.Pattern((time, note) => {
        leadSynth.triggerAttackRelease(note, '8n', time);
      }, melody, 'upDown');
      
      this.currentMusicPattern.start();
    }
  }

  private playDeckBuildingMusic(): void {
    // Calm, focused music for deck building
    this.stopCurrentMusic();
    
    const padSynth = this.musicSynths.get('pad');
    if (padSynth) {
      const chords = [
        ['C4', 'E4', 'G4'],
        ['F4', 'A4', 'C5'],
        ['G4', 'B4', 'D5'],
        ['C4', 'E4', 'G4']
      ];
      
      this.currentMusicPattern = new Tone.Pattern((time, chord) => {
        chord.forEach((note: string, index: number) => {
          padSynth.triggerAttackRelease(note, '2n', time + index * 0.1);
        });
      }, chords, 'up');
      
      this.currentMusicPattern.start();
    }
  }

  private playVictoryMusic(): void {
    this.stopCurrentMusic();
    
    const leadSynth = this.musicSynths.get('lead');
    if (leadSynth) {
      const victoryMelody = ['C5', 'E5', 'G5', 'C6'];
      victoryMelody.forEach((note, index) => {
        leadSynth.triggerAttackRelease(note, '4n', `+${index * 0.2}`);
      });
    }
  }

  private playDefeatMusic(): void {
    this.stopCurrentMusic();
    
    const bassSynth = this.musicSynths.get('bass');
    if (bassSynth) {
      const defeatMelody = ['C3', 'A#2', 'G2', 'F2'];
      defeatMelody.forEach((note, index) => {
        bassSynth.triggerAttackRelease(note, '2n', `+${index * 0.5}`);
      });
    }
  }

  playSoundEffect(effect: SoundEffect): void {
    if (!this.isInitialized) return;

    const synth = this.sfxSynths.get(this.getSynthForEffect(effect.type));
    if (!synth) return;

    // Apply spatial positioning if enabled
    if (this.config.spatialAudio && effect.position) {
      this.spatialPanner.positionX.value = effect.position.x;
      this.spatialPanner.positionY.value = effect.position.y;
      this.spatialPanner.positionZ.value = effect.position.z;
    }

    // Play appropriate sound for effect type
    switch (effect.type) {
      case 'card-play':
        synth.triggerAttackRelease('C4', '8n');
        break;
      case 'attack':
        synth.triggerAttackRelease('G3', '16n');
        break;
      case 'spell':
        synth.triggerAttackRelease('E5', '4n');
        break;
      case 'ui':
        synth.triggerAttackRelease('A4', '32n');
        break;
      case 'ambient':
        synth.triggerAttackRelease('C3', '1n');
        break;
    }
  }

  private getSynthForEffect(type: string): string {
    switch (type) {
      case 'card-play':
      case 'attack':
        return 'card';
      case 'spell':
        return 'spell';
      case 'ui':
      case 'ambient':
        return 'ui';
      default:
        return 'ui';
    }
  }

  private generateAmbientChord(): string[] {
    const { phase, tension } = this.currentGameState;
    
    // Base chord progressions for different phases
    const chordProgressions = {
      menu: [['C3', 'E3', 'G3'], ['F3', 'A3', 'C4']],
      'deck-building': [['D3', 'F#3', 'A3'], ['G3', 'B3', 'D4']],
      match: [['E3', 'G#3', 'B3'], ['A3', 'C#4', 'E4']],
      victory: [['C4', 'E4', 'G4'], ['F4', 'A4', 'C5']],
      defeat: [['A2', 'C3', 'E3'], ['D3', 'F3', 'A3']]
    };
    
    const progressions = chordProgressions[phase] || chordProgressions.menu;
    const chordIndex = Math.floor(Date.now() / 4000) % progressions.length;
    
    return progressions[chordIndex];
  }

  private addLowHealthEffect(): void {
    // Add heartbeat-like effect when health is low
    const bassSynth = this.musicSynths.get('bass');
    if (bassSynth) {
      const heartbeat = new Tone.Loop((time) => {
        bassSynth.triggerAttackRelease('C2', '32n', time);
        bassSynth.triggerAttackRelease('C2', '32n', time + 0.1);
      }, '2n');
      
      heartbeat.start();
      
      // Stop after 10 seconds
      setTimeout(() => heartbeat.stop(), 10000);
    }
  }

  private stopCurrentMusic(): void {
    if (this.currentMusicPattern) {
      this.currentMusicPattern.stop();
      this.currentMusicPattern = null;
    }
  }

  updateConfig(newConfig: Partial<AudioConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Apply volume changes
    this.masterGain.gain.value = this.config.masterVolume;
    this.musicGain.gain.value = this.config.musicVolume;
    this.sfxGain.gain.value = this.config.sfxVolume;
  }

  setListenerPosition(x: number, y: number, z: number): void {
    if (this.config.spatialAudio) {
      Tone.Listener.positionX.value = x;
      Tone.Listener.positionY.value = y;
      Tone.Listener.positionZ.value = z;
    }
  }

  dispose(): void {
    this.stopCurrentMusic();
    
    if (this.ambientLoop) {
      this.ambientLoop.stop();
      this.ambientLoop = null;
    }
    
    // Dispose all synthesizers
    this.musicSynths.forEach(synth => synth.dispose());
    this.sfxSynths.forEach(synth => synth.dispose());
    
    // Dispose audio nodes
    this.masterGain.dispose();
    this.musicGain.dispose();
    this.sfxGain.dispose();
    this.spatialPanner.dispose();
    
    this.isInitialized = false;
  }
}

// Singleton instance
export const audioEngine = new DynamicAudioEngine();