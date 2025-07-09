import * as Tone from 'tone';
import { Card } from '../data/cards';

// Advanced Dynamic Audio Engine with procedural generation
export class DynamicAudioEngine {
  private static instance: DynamicAudioEngine;
  private isInitialized = false;
  private masterVolume: Tone.Volume;
  private musicBus: Tone.Channel;
  private sfxBus: Tone.Channel;
  private ambienceBus: Tone.Channel;
  private currentTheme: string = 'menu';
  private gameState: any = {};
  private audioContext: AudioContext | null = null;

  // Synthesizers for different elements
  private elementSynths: Map<string, Tone.PolySynth> = new Map();
  private raritySynths: Map<string, Tone.Synth> = new Map();
  private ambientSynths: Map<string, Tone.Synth> = new Map();

  // Effects chains
  private reverbEffect: Tone.Reverb;
  private delayEffect: Tone.PingPongDelay;
  private chorusEffect: Tone.Chorus;
  private distortionEffect: Tone.Distortion;
  private filterEffect: Tone.Filter;

  // Sequencers for dynamic music
  private melodySequencer: Tone.Sequence | null = null;
  private bassSequencer: Tone.Sequence | null = null;
  private drumSequencer: Tone.Sequence | null = null;

  private constructor() {
    this.masterVolume = new Tone.Volume(-10);
    this.musicBus = new Tone.Channel();
    this.sfxBus = new Tone.Channel();
    this.ambienceBus = new Tone.Channel();

    // Initialize effects
    this.reverbEffect = new Tone.Reverb(2);
    this.delayEffect = new Tone.PingPongDelay("8n", 0.3);
    this.chorusEffect = new Tone.Chorus(4, 2.5, 0.5);
    this.distortionEffect = new Tone.Distortion(0.4);
    this.filterEffect = new Tone.Filter(800, "lowpass");

    this.setupAudioChain();
    this.initializeSynthesizers();
  }

  public static getInstance(): DynamicAudioEngine {
    if (!DynamicAudioEngine.instance) {
      DynamicAudioEngine.instance = new DynamicAudioEngine();
    }
    return DynamicAudioEngine.instance;
  }

  // Initialize audio system
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Tone.start();
      this.audioContext = Tone.context.rawContext;
      this.isInitialized = true;
      console.log('Dynamic Audio Engine initialized');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  // Setup audio routing and effects chain
  private setupAudioChain(): void {
    // Connect buses to master volume
    this.musicBus.connect(this.masterVolume);
    this.sfxBus.connect(this.masterVolume);
    this.ambienceBus.connect(this.masterVolume);

    // Connect master to destination
    this.masterVolume.toDestination();

    // Setup effects chain
    this.musicBus.chain(this.reverbEffect, this.chorusEffect);
    this.sfxBus.chain(this.delayEffect, this.filterEffect);
    this.ambienceBus.chain(this.reverbEffect);
  }

  // Initialize synthesizers for different game elements
  private initializeSynthesizers(): void {
    // Element-based synthesizers
    this.elementSynths.set('Fire', new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.3, release: 0.8 },
      filter: { frequency: 1000, type: 'lowpass' }
    }));

    this.elementSynths.set('Water', new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.3, decay: 0.5, sustain: 0.7, release: 1.2 },
      filter: { frequency: 800, type: 'lowpass' }
    }));

    this.elementSynths.set('Earth', new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'square' },
      envelope: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.5 },
      filter: { frequency: 600, type: 'lowpass' }
    }));

    this.elementSynths.set('Air', new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.2, decay: 0.3, sustain: 0.4, release: 1.0 },
      filter: { frequency: 1200, type: 'highpass' }
    }));

    this.elementSynths.set('Light', new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.9, release: 0.7 },
      filter: { frequency: 1500, type: 'bandpass' }
    }));

    this.elementSynths.set('Dark', new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.2, decay: 0.8, sustain: 0.2, release: 1.5 },
      filter: { frequency: 400, type: 'lowpass' }
    }));

    // Connect element synths to SFX bus
    this.elementSynths.forEach(synth => {
      synth.connect(this.sfxBus);
    });

    // Rarity-based synthesizers
    this.raritySynths.set('Common', new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.3, release: 0.5 }
    }));

    this.raritySynths.set('Uncommon', new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.1, decay: 0.3, sustain: 0.4, release: 0.6 }
    }));

    this.raritySynths.set('Rare', new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.1, decay: 0.4, sustain: 0.5, release: 0.8 }
    }));

    this.raritySynths.set('Epic', new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.2, decay: 0.5, sustain: 0.6, release: 1.0 }
    }));

    this.raritySynths.set('Legendary', new Tone.Synth({
      oscillator: { type: 'fatsawtooth' },
      envelope: { attack: 0.3, decay: 0.7, sustain: 0.8, release: 1.5 }
    }));

    // Connect rarity synths to SFX bus with effects
    this.raritySynths.forEach(synth => {
      synth.chain(this.delayEffect, this.sfxBus);
    });
  }

  // Play card sound based on element and rarity
  public playCardSound(card: Card, action: 'play' | 'hover' | 'select' = 'play'): void {
    if (!this.isInitialized) return;

    const elementSynth = this.elementSynths.get(card.element);
    const raritySynth = this.raritySynths.get(card.rarity);

    if (!elementSynth || !raritySynth) return;

    const baseNote = this.getCardNote(card);
    const volume = this.getActionVolume(action);

    switch (action) {
      case 'play':
        // Play element chord
        const chord = this.generateChord(baseNote, card.element);
        elementSynth.triggerAttackRelease(chord, '4n', undefined, volume);
        
        // Play rarity accent
        setTimeout(() => {
          raritySynth.triggerAttackRelease(baseNote, '8n', undefined, volume * 0.7);
        }, 100);
        break;

      case 'hover':
        elementSynth.triggerAttackRelease(baseNote, '16n', undefined, volume * 0.5);
        break;

      case 'select':
        raritySynth.triggerAttackRelease(baseNote, '8n', undefined, volume * 0.8);
        break;
    }
  }

  // Generate procedural background music based on game state
  public generateDynamicMusic(gameState: any): void {
    this.gameState = gameState;
    this.stopCurrentMusic();

    const tempo = this.calculateTempo(gameState);
    const key = this.calculateKey(gameState);
    const mood = this.calculateMood(gameState);

    Tone.Transport.bpm.value = tempo;

    // Create melody sequencer
    this.createMelodySequencer(key, mood);
    
    // Create bass sequencer
    this.createBassSequencer(key, mood);
    
    // Create drum sequencer
    this.createDrumSequencer(tempo, mood);

    // Start the transport
    Tone.Transport.start();
  }

  // Create melody sequencer based on game state
  private createMelodySequencer(key: string, mood: string): void {
    const scale = this.getScale(key, mood);
    const pattern = this.generateMelodyPattern(mood);

    const melodySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.8 }
    });

    melodySynth.connect(this.musicBus);

    this.melodySequencer = new Tone.Sequence((time, note) => {
      if (note !== null) {
        melodySynth.triggerAttackRelease(note, '8n', time, 0.3);
      }
    }, pattern, '8n');

    this.melodySequencer.start(0);
  }

  // Create bass sequencer
  private createBassSequencer(key: string, mood: string): void {
    const bassNotes = this.getBassNotes(key);
    const bassPattern = this.generateBassPattern(mood);

    const bassSynth = new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.3 },
      filter: { frequency: 200, type: 'lowpass' }
    });

    bassSynth.connect(this.musicBus);

    this.bassSequencer = new Tone.Sequence((time, note) => {
      if (note !== null) {
        bassSynth.triggerAttackRelease(note, '4n', time, 0.5);
      }
    }, bassPattern, '4n');

    this.bassSequencer.start(0);
  }

  // Create drum sequencer
  private createDrumSequencer(tempo: number, mood: string): void {
    const drumSynth = new Tone.MembraneSynth();
    const hihatSynth = new Tone.NoiseSynth();
    const snareSynth = new Tone.NoiseSynth();

    drumSynth.connect(this.musicBus);
    hihatSynth.connect(this.musicBus);
    snareSynth.connect(this.musicBus);

    const drumPattern = this.generateDrumPattern(mood);

    this.drumSequencer = new Tone.Sequence((time, note) => {
      switch (note) {
        case 'kick':
          drumSynth.triggerAttackRelease('C1', '8n', time, 0.6);
          break;
        case 'snare':
          snareSynth.triggerAttackRelease('8n', time, 0.4);
          break;
        case 'hihat':
          hihatSynth.triggerAttackRelease('32n', time, 0.2);
          break;
      }
    }, drumPattern, '16n');

    this.drumSequencer.start(0);
  }

  // Calculate tempo based on game state
  private calculateTempo(gameState: any): number {
    let baseTempo = 120;
    
    if (gameState.inCombat) baseTempo += 20;
    if (gameState.playerHealth < 0.3) baseTempo += 15;
    if (gameState.turnTimeRemaining < 10) baseTempo += 10;
    
    return Math.min(Math.max(baseTempo, 80), 160);
  }

  // Calculate musical key based on game state
  private calculateKey(gameState: any): string {
    const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    
    if (gameState.dominantElement) {
      const elementKeys = {
        'Fire': 'D',
        'Water': 'F',
        'Earth': 'G',
        'Air': 'A',
        'Light': 'C',
        'Dark': 'E'
      };
      return elementKeys[gameState.dominantElement as keyof typeof elementKeys] || 'C';
    }
    
    return keys[Math.floor(Math.random() * keys.length)];
  }

  // Calculate mood based on game state
  private calculateMood(gameState: any): string {
    if (gameState.playerWinning) return 'triumphant';
    if (gameState.playerLosing) return 'tense';
    if (gameState.inCombat) return 'aggressive';
    return 'neutral';
  }

  // Get musical scale for key and mood
  private getScale(key: string, mood: string): string[] {
    const scales = {
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      dorian: [0, 2, 3, 5, 7, 9, 10],
      phrygian: [0, 1, 3, 5, 7, 8, 10]
    };

    const scaleType = mood === 'tense' ? 'minor' : 
                     mood === 'aggressive' ? 'phrygian' :
                     mood === 'triumphant' ? 'major' : 'dorian';

    const baseNote = Tone.Frequency(key + '4').toMidi();
    return scales[scaleType].map(interval => 
      Tone.Frequency(baseNote + interval, 'midi').toNote()
    );
  }

  // Generate melody pattern based on mood
  private generateMelodyPattern(mood: string): (string | null)[] {
    const patterns = {
      neutral: [null, 'C4', null, 'E4', null, 'G4', null, 'C5'],
      aggressive: ['C4', null, 'E4', 'G4', null, 'C5', 'E5', null],
      tense: [null, 'C4', 'D4', null, 'E4', null, 'F4', 'G4'],
      triumphant: ['C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4', null]
    };

    return patterns[mood as keyof typeof patterns] || patterns.neutral;
  }

  // Generate bass pattern
  private generateBassPattern(mood: string): (string | null)[] {
    const patterns = {
      neutral: ['C2', null, null, null],
      aggressive: ['C2', null, 'C2', null],
      tense: ['C2', null, 'G1', null],
      triumphant: ['C2', 'G1', 'C2', 'G1']
    };

    return patterns[mood as keyof typeof patterns] || patterns.neutral;
  }

  // Generate drum pattern
  private generateDrumPattern(mood: string): (string | null)[] {
    const patterns = {
      neutral: ['kick', null, 'hihat', null, 'snare', null, 'hihat', null],
      aggressive: ['kick', 'hihat', 'kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat'],
      tense: ['kick', null, null, 'hihat', 'snare', null, 'hihat', null],
      triumphant: ['kick', 'hihat', 'hihat', 'hihat', 'snare', 'hihat', 'hihat', 'hihat']
    };

    return patterns[mood as keyof typeof patterns] || patterns.neutral;
  }

  // Get bass notes for key
  private getBassNotes(key: string): string[] {
    const baseNote = Tone.Frequency(key + '2').toMidi();
    return [0, 7, 5, 7].map(interval => 
      Tone.Frequency(baseNote + interval, 'midi').toNote()
    );
  }

  // Get note for card based on properties
  private getCardNote(card: Card): string {
    const elementNotes = {
      'Fire': 'C4',
      'Water': 'D4',
      'Earth': 'E4',
      'Air': 'F4',
      'Light': 'G4',
      'Dark': 'A4'
    };

    const baseNote = elementNotes[card.element as keyof typeof elementNotes] || 'C4';
    const costOffset = Math.min(card.cost, 10);
    
    return Tone.Frequency(baseNote).transpose(costOffset).toNote();
  }

  // Generate chord for element
  private generateChord(baseNote: string, element: string): string[] {
    const chordTypes = {
      'Fire': [0, 4, 7], // Major
      'Water': [0, 3, 7], // Minor
      'Earth': [0, 4, 7, 10], // Dominant 7th
      'Air': [0, 4, 7, 11], // Major 7th
      'Light': [0, 3, 6, 9], // Diminished
      'Dark': [0, 3, 6] // Diminished triad
    };

    const intervals = chordTypes[element as keyof typeof chordTypes] || [0, 4, 7];
    const baseMidi = Tone.Frequency(baseNote).toMidi();
    
    return intervals.map(interval => 
      Tone.Frequency(baseMidi + interval, 'midi').toNote()
    );
  }

  // Get volume for action type
  private getActionVolume(action: string): number {
    const volumes = {
      'play': 0.8,
      'hover': 0.3,
      'select': 0.6
    };
    return volumes[action as keyof typeof volumes] || 0.5;
  }

  // Play ambient sound for environment
  public playAmbientSound(environment: string): void {
    if (!this.isInitialized) return;

    this.stopAmbientSound();

    const ambientSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 2, decay: 0, sustain: 1, release: 2 }
    });

    ambientSynth.connect(this.ambienceBus);

    const environmentSounds = {
      'forest': ['C3', 'E3', 'G3'],
      'mountain': ['F3', 'A3', 'C4'],
      'ocean': ['D3', 'F#3', 'A3'],
      'desert': ['E3', 'G#3', 'B3'],
      'dungeon': ['A2', 'C3', 'E3']
    };

    const notes = environmentSounds[environment as keyof typeof environmentSounds] || ['C3'];
    
    notes.forEach((note, index) => {
      setTimeout(() => {
        ambientSynth.triggerAttack(note, undefined, 0.1);
      }, index * 1000);
    });
  }

  // Stop current music
  private stopCurrentMusic(): void {
    if (this.melodySequencer) {
      this.melodySequencer.stop();
      this.melodySequencer.dispose();
      this.melodySequencer = null;
    }

    if (this.bassSequencer) {
      this.bassSequencer.stop();
      this.bassSequencer.dispose();
      this.bassSequencer = null;
    }

    if (this.drumSequencer) {
      this.drumSequencer.stop();
      this.drumSequencer.dispose();
      this.drumSequencer = null;
    }

    Tone.Transport.stop();
    Tone.Transport.cancel();
  }

  // Stop ambient sound
  public stopAmbientSound(): void {
    this.ambienceBus.disconnect();
    this.ambienceBus = new Tone.Channel();
    this.ambienceBus.connect(this.masterVolume);
  }

  // Set master volume
  public setMasterVolume(volume: number): void {
    this.masterVolume.volume.value = Tone.gainToDb(volume);
  }

  // Set music volume
  public setMusicVolume(volume: number): void {
    this.musicBus.volume.value = Tone.gainToDb(volume);
  }

  // Set SFX volume
  public setSFXVolume(volume: number): void {
    this.sfxBus.volume.value = Tone.gainToDb(volume);
  }

  // Set ambience volume
  public setAmbienceVolume(volume: number): void {
    this.ambienceBus.volume.value = Tone.gainToDb(volume);
  }

  // Cleanup
  public dispose(): void {
    this.stopCurrentMusic();
    this.stopAmbientSound();
    
    this.elementSynths.forEach(synth => synth.dispose());
    this.raritySynths.forEach(synth => synth.dispose());
    this.ambientSynths.forEach(synth => synth.dispose());
    
    this.reverbEffect.dispose();
    this.delayEffect.dispose();
    this.chorusEffect.dispose();
    this.distortionEffect.dispose();
    this.filterEffect.dispose();
    
    this.masterVolume.dispose();
    this.musicBus.dispose();
    this.sfxBus.dispose();
    this.ambienceBus.dispose();
  }
}

// Export singleton instance
export const audioEngine = DynamicAudioEngine.getInstance();