// Web Audio micro-interaction sound engine

// Pentatonic frequencies (D2 to E3)
const DARK_STACK_FREQUENCIES = [
  73.42,  // D2
  87.31,  // F2
  98.00,  // G2
  110.00, // A2
  130.81, // C3
  146.83, // D3
  164.81  // E3
];

class DarkAudioEngine {
  private ctx: AudioContext | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private delayFilter: BiquadFilterNode | null = null;
  private lastStackTime: number = 0;
  private lastMagneticTime: number = 0;
  private lastRowTime: number = 0;
  private lastNextTime: number = 0;
  private lastTransitionTime: number = 0;
  private paperNoiseBuffer: AudioBuffer | null = null;

  private getPaperNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (this.paperNoiseBuffer) return this.paperNoiseBuffer;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.055);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.2965164;
      b2 = 0.57000 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.14;
    }
    this.paperNoiseBuffer = buffer;
    return buffer;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        this.delayNode = this.ctx.createDelay();
        this.delayNode.delayTime.setValueAtTime(0.13, this.ctx.currentTime);

        this.delayFeedback = this.ctx.createGain();
        this.delayFeedback.gain.setValueAtTime(0.18, this.ctx.currentTime);

        this.delayFilter = this.ctx.createBiquadFilter();
        this.delayFilter.type = 'lowpass';
        this.delayFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

        this.delayNode.connect(this.delayFilter);
        this.delayFilter.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delayNode);
        this.delayFilter.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Button click
  public playClick() {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.032);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.032);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {}
  }

  // Magnetic button hover snap
  public playMagnetic() {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    const nowMs = performance.now();
    if (nowMs - this.lastMagneticTime < 140) return;
    this.lastMagneticTime = nowMs;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.024);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.024);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.028);
    } catch {}
  }

  // Stack hover tone
  public playStackHover(index: number = 0) {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    const nowMs = performance.now();
    if (nowMs - this.lastStackTime < 120) return;
    this.lastStackTime = nowMs;

    try {
      const now = this.ctx.currentTime;
      const freq = DARK_STACK_FREQUENCIES[Math.abs(index) % DARK_STACK_FREQUENCIES.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, now);
      filter.frequency.exponentialRampToValueAtTime(70, now + 0.14);

      gain.gain.setValueAtTime(0.10, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  // Menu open/close latch
  public playBurger(isOpen: boolean) {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const startFreq = isOpen ? 360 : 180;
      const endFreq = isOpen ? 120 : 60;

      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.04);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {}
  }

  // Row hover sound
  public playRow() {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    const nowMs = performance.now();
    if (nowMs - this.lastRowTime < 160) return;
    this.lastRowTime = nowMs;

    try {
      const now = this.ctx.currentTime;
      const buffer = this.getPaperNoiseBuffer();
      if (!buffer) return;

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(820, now);
      filter.frequency.exponentialRampToValueAtTime(540, now + 0.05);
      filter.Q.setValueAtTime(1.1, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.036, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.052);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 0.055);
    } catch {}
  }

  // Next project card hover
  public playNextProject() {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    const nowMs = performance.now();
    if (nowMs - this.lastNextTime < 250) return;
    this.lastNextTime = nowMs;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  // Page transition sound
  public playTransition() {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    const nowMs = performance.now();
    if (nowMs - this.lastTransitionTime < 350) return;
    this.lastTransitionTime = nowMs;

    try {
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(68, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.16);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, now);
      filter.frequency.exponentialRampToValueAtTime(70, now + 0.16);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.17);

      const snap = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snap.type = 'triangle';
      snap.frequency.setValueAtTime(220, now);
      snap.frequency.exponentialRampToValueAtTime(60, now + 0.028);

      snapGain.gain.setValueAtTime(0.08, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

      snap.connect(snapGain);
      snapGain.connect(this.ctx.destination);

      snap.start(now);
      snap.stop(now + 0.03);
    } catch {}
  }

  public bindAutoListeners() {
    const unlock = () => {
      this.initContext();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    document.addEventListener('click', (e) => {
      const target = (e.target as Element)?.closest('a, button, .panel');
      if (
        target &&
        !target.classList.contains('stack__item') &&
        !target.hasAttribute('data-burger') &&
        !target.closest('a[data-pt]')
      ) {
        this.playClick();
      }
    });

    document.addEventListener('click', (e) => {
      const burger = (e.target as Element)?.closest('[data-burger]');
      if (burger) {
        const isMenuOpen = document.documentElement.classList.contains('menu-open');
        this.playBurger(!isMenuOpen);
      }
    });

    let lastNextCard: Element | null = null;
    document.addEventListener('mouseover', (e) => {
      const nextCard = (e.target as Element)?.closest('.cs__next a');
      if (nextCard) {
        if (nextCard !== lastNextCard) {
          lastNextCard = nextCard;
          this.playNextProject();
        }
      } else {
        lastNextCard = null;
      }
    }, { passive: true });

    let lastRowCard: Element | null = null;
    document.addEventListener('mouseover', (e) => {
      const row = (e.target as Element)?.closest('.row, .how__item');
      if (row) {
        if (row !== lastRowCard) {
          lastRowCard = row;
          this.playRow();
        }
      } else {
        lastRowCard = null;
      }
    }, { passive: true });

    let lastMagneticTarget: Element | null = null;
    if (document.documentElement.classList.contains('fine')) {
      document.addEventListener('pointerover', (e) => {
        const target = (e.target as Element)?.closest('[data-magnetic]');
        if (target && !target.classList.contains('stack__item')) {
          if (target !== lastMagneticTarget) {
            lastMagneticTarget = target;
            this.playMagnetic();
          }
        } else {
          lastMagneticTarget = null;
        }
      }, { passive: true });
    }
  }
}

export const sound = new DarkAudioEngine();
