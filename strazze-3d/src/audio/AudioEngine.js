/**
 * Procedural Web Audio Engine for Sci-Fi Spatial UI Micro-Interactions
 * Generates custom synthesized sounds with zero external audio assets.
 */
class SpatialAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.enabled = true;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('Web Audio not supported or blocked by autoplay policy', e);
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setEnabled(val) {
    this.enabled = val;
  }

  /**
   * Ohzi Camera Zoom / World Flip Sound:
   * Deep low-pass filter sweep with sub-bass whoosh
   */
  playWhoosh() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.35);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.8);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, t);
    filter.frequency.exponentialRampToValueAtTime(1200, t + 0.3);
    filter.frequency.exponentialRampToValueAtTime(80, t + 0.8);
    filter.Q.setValueAtTime(4, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.9);
  }

  /**
   * Lusion Magnetic Hover Tone:
   * Crystalline high-frequency sine with slight vibrato and detuned sparkle
   */
  playMagneticHover() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, t); // A5
    osc1.frequency.exponentialRampToValueAtTime(1320, t + 0.08);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(886, t); // slight detune for chorus shimmer
    osc2.frequency.exponentialRampToValueAtTime(1326, t + 0.08);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.25);
    osc2.stop(t + 0.25);
  }

  /**
   * Bruno Simon Physics Impact Sound:
   * Heavy punchy kick transient with metallic resonance upon hitting the floor
   */
  playPhysicsImpact(intensity = 1.0) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.28);

    const volume = Math.min(0.5, 0.25 * intensity);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.35);
  }
}

export const sound = new SpatialAudioEngine();

