import * as Tone from 'tone';

/**
 * Advanced Audio Engine for KONIVRER
 * Handles dynamic music, sound effects, spatial audio, and voice acting
 */
export class AudioEngine {
  constructor(options = {}) {
    this.options = {
      masterVolume: 0.7,
      musicVolume: 0.5,
      sfxVolume: 0.8,
      voiceVolume: 0.9,
      enableSpatialAudio: true,
      ...options
    };

    // Audio context and nodes
    this.context = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.voiceGain = null;

    // Music system
    this.currentTrack = null;
    this.musicTracks = new Map();
    this.adaptiveMusic = {
      tension: 0, // 0-1 scale
      energy: 0,  // 0-1 scale
      currentTheme: 'menu'
    };

    // Sound effects
    this.sfxLibrary = new Map();
    this.activeSounds = new Set();

    // Spatial audio
    this.spatialSounds = new Map();
    this.listenerPosition = { x: 0, y: 0, z: 0 };

    // Voice acting
    this.voiceLines = new Map();
    this.currentVoice = null;

    // Performance
    this.isInitialized = false;
    this.loadingPromises = new Map();

    this.init();
  }

  async init() {
    try {
      // Initialize Tone.js
      await Tone.start();
      this.context = Tone.context;

      this.setupAudioNodes();
      this.loadAudioAssets();
      this.setupAdaptiveMusic();

      this.isInitialized = true;
      console.log('Audio Engine initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Audio Engine:', error);
    }
  }

  setupAudioNodes() {
    // Master gain control
    this.masterGain = new Tone.Gain(this.options.masterVolume);
    this.masterGain.toDestination();

    // Separate gain nodes for different audio types
    this.musicGain = new Tone.Gain(this.options.musicVolume);
    this.sfxGain = new Tone.Gain(this.options.sfxVolume);
    this.voiceGain = new Tone.Gain(this.options.voiceVolume);

    // Connect to master
    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.voiceGain.connect(this.masterGain);

    // Create reverb for spatial effects
    this.reverb = new Tone.Reverb({
      decay: 2,
      wet: 0.3
    });
    this.reverb.connect(this.masterGain);

    // Create compressor for dynamic range
    this.compressor = new Tone.Compressor({
      threshold: -24,
      ratio: 8,
      attack: 0.003,
      release: 0.1
    });
    this.compressor.connect(this.masterGain);
  }

  async loadAudioAssets() {
    const audioAssets = {
      // Background music tracks
      music: {
        menu: '/audio/music/menu_theme.mp3',
        gameplay_calm: '/audio/music/gameplay_calm.mp3',
        gameplay_tense: '/audio/music/gameplay_tense.mp3',
        gameplay_epic: '/audio/music/gameplay_epic.mp3',
        victory: '/audio/music/victory.mp3',
        defeat: '/audio/music/defeat.mp3'
      },
      
      // Sound effects
      sfx: {
        card_draw: '/audio/sfx/card_draw.wav',
        card_play: '/audio/sfx/card_play.wav',
        card_hover: '/audio/sfx/card_hover.wav',
        spell_cast_fire: '/audio/sfx/spell_fire.wav',
        spell_cast_water: '/audio/sfx/spell_water.wav',
        spell_cast_earth: '/audio/sfx/spell_earth.wav',
        spell_cast_air: '/audio/sfx/spell_air.wav',
        attack_melee: '/audio/sfx/attack_melee.wav',
        attack_ranged: '/audio/sfx/attack_ranged.wav',
        damage_taken: '/audio/sfx/damage_taken.wav',
        heal: '/audio/sfx/heal.wav',
        button_click: '/audio/sfx/button_click.wav',
        button_hover: '/audio/sfx/button_hover.wav',
        notification: '/audio/sfx/notification.wav',
        error: '/audio/sfx/error.wav',
        legendary_summon: '/audio/sfx/legendary_summon.wav',
        mythic_summon: '/audio/sfx/mythic_summon.wav'
      },

      // Voice lines
      voice: {
        game_start: '/audio/voice/game_start.mp3',
        turn_start: '/audio/voice/turn_start.mp3',
        victory: '/audio/voice/victory.mp3',
        defeat: '/audio/voice/defeat.mp3',
        legendary_play: '/audio/voice/legendary_play.mp3',
        low_health: '/audio/voice/low_health.mp3'
      }
    };

    // Load all audio assets
    for (const [category, assets] of Object.entries(audioAssets)) {
      for (const [name, path] of Object.entries(assets)) {
        this.loadAudioFile(category, name, path);
      }
    }
  }

  async loadAudioFile(category, name, path) {
    const key = `${category}_${name}`;
    
    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        let audio;
        
        if (category === 'music') {
          audio = new Tone.Player({
            url: path,
            loop: true,
            autostart: false
          });
          audio.connect(this.musicGain);
          this.musicTracks.set(name, audio);
        } else if (category === 'sfx') {
          audio = new Tone.Player({
            url: path,
            autostart: false
          });
          audio.connect(this.sfxGain);
          this.sfxLibrary.set(name, audio);
        } else if (category === 'voice') {
          audio = new Tone.Player({
            url: path,
            autostart: false
          });
          audio.connect(this.voiceGain);
          this.voiceLines.set(name, audio);
        }

        resolve(audio);
      } catch (error) {
        console.warn(`Failed to load audio: ${path}`, error);
        reject(error);
      }
    });

    this.loadingPromises.set(key, promise);
    return promise;
  }

  setupAdaptiveMusic() {
    // Create adaptive music system that responds to game state
    this.adaptiveMusicSystem = {
      updateInterval: 1000, // Update every second
      lastUpdate: 0,
      
      // Music layers for dynamic mixing
      layers: {
        base: null,
        tension: null,
        energy: null,
        ambient: null
      }
    };

    // Start adaptive music update loop
    setInterval(() => {
      this.updateAdaptiveMusic();
    }, this.adaptiveMusicSystem.updateInterval);
  }

  updateAdaptiveMusic() {
    if (!this.isInitialized) return;

    const { tension, energy, currentTheme } = this.adaptiveMusic;
    
    // Adjust music based on game state
    if (this.currentTrack) {
      // Modify playback rate based on tension
      const playbackRate = 1 + (tension * 0.2); // 1.0 to 1.2x speed
      this.currentTrack.playbackRate = playbackRate;

      // Adjust volume based on energy
      const volume = 0.5 + (energy * 0.3); // 0.5 to 0.8 volume
      this.musicGain.gain.rampTo(volume, 0.5);

      // Add filter effects based on tension
      if (tension > 0.7) {
        // High tension - add high-pass filter
        if (!this.tensionFilter) {
          this.tensionFilter = new Tone.Filter({
            frequency: 200 + (tension * 800),
            type: 'highpass'
          });
          this.currentTrack.disconnect();
          this.currentTrack.connect(this.tensionFilter);
          this.tensionFilter.connect(this.musicGain);
        }
      } else if (this.tensionFilter) {
        // Remove tension filter
        this.currentTrack.disconnect();
        this.currentTrack.connect(this.musicGain);
        this.tensionFilter.dispose();
        this.tensionFilter = null;
      }
    }
  }

  /**
   * Play background music with smooth transitions
   */
  async playMusic(trackName, fadeTime = 2.0) {
    if (!this.isInitialized) {
      await this.init();
    }

    const newTrack = this.musicTracks.get(trackName);
    if (!newTrack) {
      console.warn(`Music track not found: ${trackName}`);
      return;
    }

    // Fade out current track
    if (this.currentTrack && this.currentTrack.state === 'started') {
      this.currentTrack.volume.rampTo(-60, fadeTime);
      setTimeout(() => {
        this.currentTrack.stop();
      }, fadeTime * 1000);
    }

    // Fade in new track
    newTrack.volume.value = -60;
    newTrack.start();
    newTrack.volume.rampTo(0, fadeTime);
    
    this.currentTrack = newTrack;
    this.adaptiveMusic.currentTheme = trackName;
  }

  /**
   * Play sound effect with optional spatial positioning
   */
  playSFX(effectName, options = {}) {
    if (!this.isInitialized) return;

    const sound = this.sfxLibrary.get(effectName);
    if (!sound) {
      console.warn(`Sound effect not found: ${effectName}`);
      return;
    }

    const {
      volume = 1.0,
      pitch = 1.0,
      position = null,
      loop = false,
      delay = 0
    } = options;

    // Clone the sound for multiple simultaneous plays
    const soundInstance = sound.clone();
    
    // Apply modifications
    soundInstance.volume.value = Tone.gainToDb(volume);
    soundInstance.playbackRate = pitch;
    soundInstance.loop = loop;

    // Apply spatial audio if position provided
    if (position && this.options.enableSpatialAudio) {
      this.applySpatialAudio(soundInstance, position);
    }

    // Play with delay
    soundInstance.start(`+${delay}`);
    
    this.activeSounds.add(soundInstance);

    // Clean up when sound finishes
    soundInstance.onstop = () => {
      this.activeSounds.delete(soundInstance);
      soundInstance.dispose();
    };

    return soundInstance;
  }

  /**
   * Apply spatial audio effects based on position
   */
  applySpatialAudio(sound, position) {
    const distance = this.calculateDistance(position, this.listenerPosition);
    const maxDistance = 20; // Maximum audible distance
    
    if (distance > maxDistance) {
      sound.volume.value = -60; // Effectively mute
      return;
    }

    // Calculate volume based on distance
    const volumeMultiplier = 1 - (distance / maxDistance);
    const spatialVolume = sound.volume.value + Tone.gainToDb(volumeMultiplier);
    sound.volume.value = Math.max(spatialVolume, -60);

    // Apply panning based on horizontal position
    const panValue = Math.max(-1, Math.min(1, (position.x - this.listenerPosition.x) / 10));
    
    // Create panner if it doesn't exist
    if (!sound.panner) {
      sound.panner = new Tone.Panner(panValue);
      sound.disconnect();
      sound.connect(sound.panner);
      sound.panner.connect(this.sfxGain);
    } else {
      sound.panner.pan.value = panValue;
    }

    // Apply reverb based on distance for depth perception
    const reverbAmount = Math.min(0.5, distance / maxDistance);
    if (reverbAmount > 0.1) {
      sound.connect(this.reverb);
    }
  }

  calculateDistance(pos1, pos2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Play voice line with emotion and character variation
   */
  async playVoiceLine(lineName, character = 'narrator', emotion = 'neutral') {
    if (!this.isInitialized) return;

    // Stop current voice if playing
    if (this.currentVoice && this.currentVoice.state === 'started') {
      this.currentVoice.stop();
    }

    const voiceLine = this.voiceLines.get(lineName);
    if (!voiceLine) {
      console.warn(`Voice line not found: ${lineName}`);
      return;
    }

    // Apply character and emotion modifications
    const modifiedVoice = this.applyVoiceModifications(voiceLine, character, emotion);
    
    modifiedVoice.start();
    this.currentVoice = modifiedVoice;

    return new Promise((resolve) => {
      modifiedVoice.onstop = resolve;
    });
  }

  applyVoiceModifications(voice, character, emotion) {
    const voiceInstance = voice.clone();
    
    // Character-specific modifications
    const characterMods = {
      narrator: { pitch: 1.0, reverb: 0.2 },
      hero: { pitch: 1.1, reverb: 0.1 },
      villain: { pitch: 0.9, reverb: 0.3 },
      mystic: { pitch: 1.2, reverb: 0.4 }
    };

    // Emotion-specific modifications
    const emotionMods = {
      neutral: { pitch: 1.0, volume: 1.0 },
      excited: { pitch: 1.15, volume: 1.2 },
      angry: { pitch: 0.9, volume: 1.3 },
      sad: { pitch: 0.85, volume: 0.8 },
      mysterious: { pitch: 0.95, volume: 0.9 }
    };

    const charMod = characterMods[character] || characterMods.narrator;
    const emotMod = emotionMods[emotion] || emotionMods.neutral;

    // Apply modifications
    voiceInstance.playbackRate = charMod.pitch * emotMod.pitch;
    voiceInstance.volume.value = Tone.gainToDb(emotMod.volume);

    // Apply reverb for character depth
    if (charMod.reverb > 0.1) {
      voiceInstance.connect(this.reverb);
    }

    return voiceInstance;
  }

  /**
   * Create dynamic spell casting audio
   */
  createSpellAudio(spellType, intensity = 1.0, duration = 2.0) {
    const spellSynth = new Tone.Synth({
      oscillator: {
        type: this.getSpellOscillatorType(spellType)
      },
      envelope: {
        attack: 0.1,
        decay: 0.3,
        sustain: 0.6,
        release: duration * 0.4
      }
    });

    // Add effects based on spell type
    const effects = this.createSpellEffects(spellType);
    spellSynth.chain(...effects, this.sfxGain);

    // Generate spell melody
    const melody = this.generateSpellMelody(spellType, intensity, duration);
    
    // Play the spell audio
    melody.forEach((note, index) => {
      const time = `+${index * 0.2}`;
      spellSynth.triggerAttackRelease(note.frequency, note.duration, time, note.velocity);
    });

    // Clean up after duration
    setTimeout(() => {
      spellSynth.dispose();
      effects.forEach(effect => effect.dispose());
    }, (duration + 1) * 1000);
  }

  getSpellOscillatorType(spellType) {
    const types = {
      fire: 'sawtooth',
      water: 'sine',
      earth: 'square',
      air: 'triangle',
      dark: 'fmsawtooth',
      light: 'fmtriangle'
    };
    return types[spellType] || 'sine';
  }

  createSpellEffects(spellType) {
    const effects = [];

    switch (spellType) {
      case 'fire':
        effects.push(
          new Tone.Distortion(0.4),
          new Tone.Filter({ frequency: 2000, type: 'lowpass' })
        );
        break;
      case 'water':
        effects.push(
          new Tone.Chorus({ frequency: 4, delayTime: 2.5, depth: 0.5 }),
          new Tone.Reverb({ decay: 3, wet: 0.4 })
        );
        break;
      case 'earth':
        effects.push(
          new Tone.Filter({ frequency: 500, type: 'lowpass' }),
          new Tone.Compressor({ threshold: -20, ratio: 8 })
        );
        break;
      case 'air':
        effects.push(
          new Tone.PingPongDelay({ delayTime: '8n', feedback: 0.3 }),
          new Tone.Filter({ frequency: 4000, type: 'highpass' })
        );
        break;
      case 'dark':
        effects.push(
          new Tone.BitCrusher({ bits: 6 }),
          new Tone.Reverb({ decay: 5, wet: 0.6 })
        );
        break;
      case 'light':
        effects.push(
          new Tone.Chorus({ frequency: 8, delayTime: 1, depth: 0.3 }),
          new Tone.Filter({ frequency: 6000, type: 'highpass' })
        );
        break;
    }

    return effects;
  }

  generateSpellMelody(spellType, intensity, duration) {
    const baseFrequencies = {
      fire: [220, 277, 330, 415],
      water: [174, 220, 261, 329],
      earth: [110, 138, 165, 207],
      air: [349, 440, 523, 659],
      dark: [146, 185, 220, 277],
      light: [523, 659, 784, 987]
    };

    const frequencies = baseFrequencies[spellType] || baseFrequencies.fire;
    const noteCount = Math.floor(duration * 5 * intensity);
    const melody = [];

    for (let i = 0; i < noteCount; i++) {
      const frequency = frequencies[Math.floor(Math.random() * frequencies.length)];
      const velocity = 0.5 + (intensity * 0.5) + (Math.random() * 0.2 - 0.1);
      
      melody.push({
        frequency,
        duration: '8n',
        velocity: Math.min(1.0, velocity)
      });
    }

    return melody;
  }

  /**
   * Update game state for adaptive music
   */
  updateGameState(gameState) {
    const { playerHealth, opponentHealth, turnNumber, cardsInHand, gamePhase } = gameState;
    
    // Calculate tension based on game state
    let tension = 0;
    
    // Health-based tension
    const healthRatio = playerHealth / 100; // Assuming max health is 100
    tension += (1 - healthRatio) * 0.4;
    
    // Turn-based tension
    const turnTension = Math.min(turnNumber / 20, 1) * 0.3; // Increases over 20 turns
    tension += turnTension;
    
    // Hand size tension
    const handTension = cardsInHand < 3 ? (3 - cardsInHand) * 0.1 : 0;
    tension += handTension;

    // Calculate energy based on game activity
    let energy = 0;
    
    // Phase-based energy
    const phaseEnergy = {
      draw: 0.2,
      main: 0.6,
      combat: 1.0,
      end: 0.3
    };
    energy = phaseEnergy[gamePhase] || 0.5;

    // Update adaptive music state
    this.adaptiveMusic.tension = Math.min(1, tension);
    this.adaptiveMusic.energy = Math.min(1, energy);
  }

  /**
   * Set listener position for spatial audio
   */
  setListenerPosition(x, y, z) {
    this.listenerPosition = { x, y, z };
  }

  /**
   * Volume controls
   */
  setMasterVolume(volume) {
    this.masterGain.gain.rampTo(volume, 0.1);
    this.options.masterVolume = volume;
  }

  setMusicVolume(volume) {
    this.musicGain.gain.rampTo(volume, 0.1);
    this.options.musicVolume = volume;
  }

  setSFXVolume(volume) {
    this.sfxGain.gain.rampTo(volume, 0.1);
    this.options.sfxVolume = volume;
  }

  setVoiceVolume(volume) {
    this.voiceGain.gain.rampTo(volume, 0.1);
    this.options.voiceVolume = volume;
  }

  /**
   * Stop all audio
   */
  stopAll() {
    if (this.currentTrack) {
      this.currentTrack.stop();
    }
    
    this.activeSounds.forEach(sound => {
      sound.stop();
    });
    
    if (this.currentVoice) {
      this.currentVoice.stop();
    }
  }

  /**
   * Clean up resources
   */
  dispose() {
    this.stopAll();
    
    // Dispose of all audio nodes
    this.musicTracks.forEach(track => track.dispose());
    this.sfxLibrary.forEach(sound => sound.dispose());
    this.voiceLines.forEach(voice => voice.dispose());
    
    if (this.masterGain) this.masterGain.dispose();
    if (this.reverb) this.reverb.dispose();
    if (this.compressor) this.compressor.dispose();
  }
}

export default AudioEngine;