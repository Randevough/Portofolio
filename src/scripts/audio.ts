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
   * Crisp felt/paper switch click when hovering/expanding Experience timeline rows
   */
  public playRow() {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.022);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
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

    // Next Project card in case studies
    document.addEventListener('mouseenter', (e) => {
      const nextCard = (e.target as Element)?.closest('.cs__next a');
      if (nextCard) {
        this.playNextProject();
      }
    }, { capture: true, passive: true });

    // Experience timeline row hovers
    document.addEventListener('mouseenter', (e) => {
      const row = (e.target as Element)?.closest('.row');
      if (row) {
        this.playRow();
      }
    }, { capture: true, passive: true });

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
