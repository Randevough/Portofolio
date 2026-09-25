/**
 * Dark Industrial Micro-Interaction Sound Engine
 * Synthesizes deep, tactile analog feedback via native Web Audio API.
 * Features dark sub-mid feedback delay for tech stacks, mechanical burger latches,
 * and weighted card transit thuds. Zero external audio assets, zero latency.
 */

// Low-register industrial frequencies (D2 to C3) for a moody, serious studio aesthetic
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

        // Dark feedback delay network (filtered to low-mid room echo)
        this.delayNode = this.ctx.createDelay();
        this.delayNode.delayTime.setValueAtTime(0.13, this.ctx.currentTime);

        this.delayFeedback = this.ctx.createGain();
        this.delayFeedback.gain.setValueAtTime(0.18, this.ctx.currentTime);

        this.delayFilter = this.ctx.createBiquadFilter();
        this.delayFilter.type = 'lowpass';
        this.delayFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

        // Connect delay feedback loop: Delay -> Filter -> Feedback -> Delay
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

  /**
   * Tactile analog microswitch click for buttons and links
   */
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

  /**
   * Subtle low magnetic snap when cursor catches magnetic buttons
   */
  public playMagnetic() {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    const nowMs = performance.now();
    if (nowMs - this.lastMagneticTime < 80) return;
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

  /**
   * Dark, low-frequency industrial encoder note with muted room echo for Tech Stack hovers
   */
  public playStackHover(index: number = 0) {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    const nowMs = performance.now();
    if (nowMs - this.lastStackTime < 50) return;
    this.lastStackTime = nowMs;

    try {
      const now = this.ctx.currentTime;
      const freq = DARK_STACK_FREQUENCIES[Math.abs(index) % DARK_STACK_FREQUENCIES.length];

      // Muted triangular sub-tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.18);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      // Send to dark room feedback delay
      if (this.delayNode) {
        gain.connect(this.delayNode);
      }

      osc.start(now);
      osc.stop(now + 0.24);
    } catch {}
  }

  /**
   * Dual mechanical latch for mobile hamburger menu
   */
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

  /**
   * Velvet paper / folio brush whisper when hovering How I Work items and timeline rows
   */
  public playRow() {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;
      const buffer = this.getPaperNoiseBuffer();
      if (!buffer) return;

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Bandpass filter shaping to mimic fibrous matte card paper sliding across surface
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(820, now);
      filter.frequency.exponentialRampToValueAtTime(540, now + 0.05);
      filter.Q.setValueAtTime(1.1, now);

      const gain = this.ctx.createGain();
      // Whisper-level envelope: soft attack (6ms) + smooth decay (45ms)
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

  /**
   * Deep, low-frequency weighted transit thud for Next Project case study card
   */
  public playNextProject() {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

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

  /**
   * Deep analog weighted shutter/slide transit when changing pages
   */
  public playTransition() {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    const nowMs = performance.now();
    if (nowMs - this.lastTransitionTime < 350) return;
    this.lastTransitionTime = nowMs;

    try {
      const now = this.ctx.currentTime;

      // Sub-bass resonant transit (68Hz down to 32Hz)
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

      // Soft high-frequency shutter transient (analog mechanical release)
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

    // Standard tactile clicks on interactive elements (excluding page transitions)
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

    // Mobile burger menu latch
    document.addEventListener('click', (e) => {
      const burger = (e.target as Element)?.closest('[data-burger]');
      if (burger) {
        const isMenuOpen = document.documentElement.classList.contains('menu-open');
        this.playBurger(!isMenuOpen);
      }
    });

    // Next Project card in case studies (single trigger per card)
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

    // Experience timeline row hovers and How I Work items (single trigger per card)
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

    // Magnetic button snap
    if (document.documentElement.classList.contains('fine')) {
      document.addEventListener('pointerover', (e) => {
        const target = (e.target as Element)?.closest('[data-magnetic]');
        if (target && !target.classList.contains('stack__item')) {
          this.playMagnetic();
        }
      }, { passive: true });
    }
  }
}

export const sound = new DarkAudioEngine();
