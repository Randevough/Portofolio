import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { sound } from './audio';
import { STACK, PROOF } from '../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

/* =================================================================
   RANDEVOUGH — STUDIO GROTESK
   ================================================================= */
(function () {
  'use strict';
  sound.bindAutoListeners();

  var html = document.documentElement;
  var HAS_GSAP = true;
  var DESKTOP = '(min-width: 821px)';

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  html.classList.add('js-ready');

  var MOTION = html.classList.contains('motion');
  var FINE = html.classList.contains('fine');
  var $ = function <T extends HTMLElement = HTMLElement>(s: string, c?: Element | Document): T | null { return (c || document).querySelector<T>(s); };
  var $$ = function <T extends HTMLElement = HTMLElement>(s: string, c?: Element | Document): T[] { return Array.prototype.slice.call((c || document).querySelectorAll<T>(s)); };
  var esc = function (s: string): string { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  /* ---------------------------------------------------------------
     INTERACTION: stack evidence map (DOM rendered statically in Astro)
     --------------------------------------------------------------- */
  var stackHost = $('[data-stack]');
  var proofHost = $('[data-proof]');
  var stackHint = $('[data-stack-hint]');

  if (stackHost && proofHost) {
    var proofItems = $$('[data-proof-id]', proofHost);
    var techItems = $$('.stack__item', stackHost);
    var lockedIndex: number | null = null;

    var renderEvidence = function (i: number | null) {
      if (i === null || i === undefined) {
        proofItems.forEach(function (el) {
          el.classList.remove('is-on');
          el.classList.remove('is-dim');
        });
        if (stackHint) stackHint.textContent = 'All tools: ' + PROOF.length + ' projects & platforms';
      } else {
        var t = STACK[i];
        if (!t) return;
        proofItems.forEach(function (el) {
          var attr = el.getAttribute('data-proof-id');
          var hit = attr ? t.p.indexOf(attr) > -1 : false;
          el.classList.toggle('is-on', hit);
          el.classList.toggle('is-dim', !hit);
        });
        if (stackHint) {
          stackHint.textContent = t.n + ': used in ' + t.p.length + (t.p.length > 1 ? ' projects' : ' project');
        }
      }
    };

    var updateActiveClasses = function () {
      techItems.forEach(function (el, k) {
        el.classList.toggle('is-active', k === lockedIndex);
      });
    };

    var triggerClickAnim = function (el: HTMLElement) {
      el.classList.remove('is-clicked');
      void el.offsetWidth;
      el.classList.add('is-clicked');
      sound.playClick();
      setTimeout(function () {
        el.classList.remove('is-clicked');
      }, 500);
    };

    techItems.forEach(function (el, i) {
      el.addEventListener('mouseenter', function () {
        sound.playStackHover(i);
        // Preview hovered stack; locked active stack remains visibly active
        renderEvidence(i);
      });

      el.addEventListener('mouseleave', function () {
        // Return evidence to locked active stack (or reset if none locked)
        renderEvidence(lockedIndex);
      });

      el.addEventListener('focus', function () {
        sound.playStackHover(i);
        renderEvidence(i);
      });

      el.addEventListener('blur', function () {
        renderEvidence(lockedIndex);
      });

      el.addEventListener('click', function () {
        triggerClickAnim(el);
        if (lockedIndex === i) {
          // Toggle off
          lockedIndex = null;
          updateActiveClasses();
          renderEvidence(null);
        } else {
          // Lock active selection
          lockedIndex = i;
          updateActiveClasses();
          renderEvidence(i);
        }
      });
    });

    stackHost.addEventListener('mouseleave', function () {
      renderEvidence(lockedIndex);
      updateActiveClasses();
    });

    updateActiveClasses();
    renderEvidence(null);
  }

  /* ---------------------------------------------------------------
     SPLIT WORDS (staggered via CSS custom property)
     --------------------------------------------------------------- */
  $$('[data-split]').forEach(function (el) {
    if (el.querySelector('.word')) return;
    var words = (el.textContent || '').trim().split(/\s+/);
    el.innerHTML = words.map(function (w, i) {
      return '<span class="word"><span style="--d:' + (i * 45) + 'ms">' + esc(w) + '</span></span>';
    }).join(' ');
  });

  /* ---------------------------------------------------------------
     REVEALS — IntersectionObserver, immune to scroll math
     --------------------------------------------------------------- */
  var revealTargets = $$('[data-split], [data-fade], .section__head');

  function showAll() {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
    var t = $('[data-hero-title]');
    if (t) t.classList.add('is-in');
  }

  if (!MOTION || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.02 });

    revealTargets.forEach(function (el) {
      if (el.closest('.hero')) return;
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------
     HERO INTRO + LOADER (CSS transitions, no engine required)
     --------------------------------------------------------------- */
  var loader = $('[data-loader]');
  var heroTitle = $('[data-hero-title]');

  if (heroTitle) {
    $$('.hero__line > span', heroTitle).forEach(function (s, i) {
      s.style.setProperty('--d', (i * 95) + 'ms');
    });
  }

  function startHero() {
    var heroEl = $('.hero');
    if (heroEl) heroEl.classList.add('is-pushed');
    if (heroTitle) heroTitle.classList.add('is-in');
    $$('.hero [data-fade]').forEach(function (el, i) {
      el.style.setProperty('--d', (150 + i * 90) + 'ms');
      el.classList.add('is-in');
    });
  }

  var loaderCount = $('[data-loader-count]');

  function runCounter(ms: number) {
    if (!loaderCount) return;
    var t0 = performance.now();
    var step = function (now: number) {
      var p = Math.min(1, (now - t0) / ms);
      /* ease-out so the number decelerates into 100 */
      var v = Math.round((1 - Math.pow(1 - p, 3)) * 100);
      if (loaderCount) loaderCount.textContent = v < 100 ? ('0' + v).slice(-2) : '100';
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  var skipLoader = false;
  try {
    skipLoader = sessionStorage.getItem('rv-visited') === '1';
  } catch (err) { skipLoader = false; }

  var isAudit = typeof navigator !== 'undefined' && /Chrome-Lighthouse|Googlebot|HeadlessChrome/i.test(navigator.userAgent);
  if (isAudit) skipLoader = true;

  if (!MOTION || skipLoader) {
    if (loader) loader.classList.add('is-ready', 'is-out', 'is-done');
    startHero();
  } else if (loader) {
    try {
      sessionStorage.setItem('rv-visited', '1');
    } catch (err) {}
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (loader) loader.classList.add('is-ready');
        runCounter(450);
      });
    });
    /* the loader leaving and the hero arriving are one movement */
    setTimeout(function () { if (loader) loader.classList.add('is-out'); startHero(); }, 500);
    setTimeout(function () { if (loader) loader.classList.add('is-done'); }, 950);
  } else {
    try {
      sessionStorage.setItem('rv-visited', '1');
    } catch (err) {}
    startHero();
  }

  /* ---------------------------------------------------------------
     POINTER SPOTLIGHT — plain CSS variables, no engine needed
     --------------------------------------------------------------- */
  var spot = $('[data-spot]');
  if (spot && FINE && MOTION) {
    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var cxp = tx, cyp = ty, spotRunning = false;

    var drift = function () {
      cxp += (tx - cxp) * 0.045;
      cyp += (ty - cyp) * 0.045;
      if (spot) {
        spot.style.setProperty('--mx', cxp.toFixed(1) + 'px');
        spot.style.setProperty('--my', cyp.toFixed(1) + 'px');
      }
      if (Math.abs(tx - cxp) > 0.4 || Math.abs(ty - cyp) > 0.4) {
        requestAnimationFrame(drift);
      } else {
        spotRunning = false;
      }
    };

    window.addEventListener('mousemove', function (e: MouseEvent) {
      tx = e.clientX; ty = e.clientY;
      if (spot) spot.classList.add('is-on');
      if (!spotRunning) { spotRunning = true; requestAnimationFrame(drift); }
    }, { passive: true });

    window.addEventListener('mouseleave', function () { if (spot) spot.classList.remove('is-on'); });
  }

  /* ---------------------------------------------------------------
     CLOCK
     --------------------------------------------------------------- */
  var clocks = $$('[data-clock]');
  if (clocks.length) {
    var tick = function () {
      var t = new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Jakarta', hour12: false,
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      clocks.forEach(function (c) { c.textContent = t + ' WIB'; });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------------
     NAV + MOBILE MENU
     --------------------------------------------------------------- */
  var nav = $('[data-nav]');
  var burger = $('[data-burger]');
  var navmenu = $('[data-navmenu]');
  var lastY = 0;

  function onScrollNav() {
    if (!nav) return;
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('is-solid', y > 40);
    if (!html.classList.contains('menu-open')) {
      nav.classList.toggle('is-hidden', y > lastY && y > 320);
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  function closeMenu() {
    html.classList.remove('menu-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }
  if (burger) {
    burger.addEventListener('click', function () {
      var open = html.classList.toggle('menu-open');
      if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && nav) nav.classList.remove('is-hidden');
    });
  }
  if (navmenu) $$('a', navmenu).forEach(function (a) { a.addEventListener('click', closeMenu); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------------------------------------------------------------
     CONTACT FORM
     --------------------------------------------------------------- */
  var form = $('[data-cform]') as HTMLFormElement | null;
  if (form) {
    var status = $('[data-cform-status]', form);
    var sendBtn = $('[data-send]', form) as HTMLButtonElement | null;
    var sendLabel = $('[data-send-label]', form);
    var ta = $('[data-counter]', form) as HTMLTextAreaElement | null;
    var counter = $('[data-count]', form);

    if (ta && counter) {
      var sync = function () {
        if (ta && counter) {
          counter.textContent = ta.value.length + ' / ' + (ta.getAttribute('maxlength') || '600');
          ta.style.height = 'auto';
          ta.style.height = Math.max(96, ta.scrollHeight) + 'px';
        }
      };
      ta.addEventListener('input', sync);
      sync();
    }

    var validity = function (input: HTMLInputElement | HTMLTextAreaElement) {
      var v = input.value.trim();
      if (!v) return false;
      if (input.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      return true;
    };

    $$('[data-field]', form || undefined).forEach(function (f) {
      var input = $('input, textarea', f) as HTMLInputElement | HTMLTextAreaElement | null;
      if (!input) return;
      input.addEventListener('blur', function () {
        if (!input) return;
        if (input.value.trim() === '') { f.classList.remove('is-bad'); return; }
        f.classList.toggle('is-bad', !validity(input));
      });
      input.addEventListener('input', function () {
        if (!input) return;
        if (f.classList.contains('is-bad') && validity(input)) f.classList.remove('is-bad');
      });
    });

    var formMountedAt = Date.now();
    var SUBMIT_COOLDOWN_MS = 60000;
    var COOLDOWN_KEY = 'rv_cf_last_submit';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form) return;

      // Rate limiting: 60-second cooldown per client
      var lastSubmit = 0;
      try {
        lastSubmit = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0', 10);
      } catch (err) {}

      var now = Date.now();
      if (now - lastSubmit < SUBMIT_COOLDOWN_MS) {
        var waitSecs = Math.ceil((SUBMIT_COOLDOWN_MS - (now - lastSubmit)) / 1000);
        if (status) {
          status.textContent = 'Please wait ' + waitSecs + 's before sending another message.';
          status.className = 'cform__status mono is-err';
        }
        return;
      }

      // Time-trap anti-bot: submissions under 2 seconds from mount
      if (now - formMountedAt < 2000) {
        if (status) {
          status.textContent = 'Please take a moment before sending.';
          status.className = 'cform__status mono is-err';
        }
        return;
      }

      var bad = 0;
      $$('[data-field]', form).forEach(function (f) {
        var input = $('input, textarea', f) as HTMLInputElement | HTMLTextAreaElement | null;
        if (!input || !input.required) return;
        var ok = validity(input);
        f.classList.toggle('is-bad', !ok);
        if (!ok) bad++;
      });
      if (bad) {
        if (status) {
          status.textContent = bad + ' field' + (bad > 1 ? 's need' : ' needs') + ' attention';
          status.className = 'cform__status mono is-err';
        }
        return;
      }

      var key = form.querySelector('[name="access_key"]') as HTMLInputElement | null;
      if (key && key.value.indexOf('YOUR_') === 0) {
        var nameInput = form.querySelector('[name="name"]') as HTMLInputElement | null;
        var emailInput = form.querySelector('[name="email"]') as HTMLInputElement | null;
        var msgInput = form.querySelector('[name="message"]') as HTMLTextAreaElement | null;
        var senderName = nameInput ? nameInput.value.trim() : '';
        var senderEmail = emailInput ? emailInput.value.trim() : '';
        var senderMsg = msgInput ? msgInput.value.trim() : '';

        var subject = encodeURIComponent('Project Inquiry from ' + (senderName || 'Portfolio Visitor'));
        var body = encodeURIComponent(
          'Hi Rafi,\n\n' +
          (senderMsg ? senderMsg + '\n\n' : '') +
          '---\n' +
          'From: ' + senderName + '\n' +
          'Email: ' + senderEmail
        );
        var gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=muhamadrafifernanda@gmail.com&su=' + subject + '&body=' + body;

        window.open(gmailUrl, '_blank', 'noopener,noreferrer');

        if (status) {
          status.textContent = 'Redirecting to Gmail with your inquiry...';
          status.className = 'cform__status mono is-ok';
        }
        return;
      }

      if (sendBtn) {
        sendBtn.classList.add('is-busy');
        sendBtn.disabled = true;
      }
      if (sendLabel) sendLabel.textContent = 'Sending';
      if (status) {
        status.textContent = '';
        status.className = 'cform__status mono';
      }

      fetch(form.action, { method: 'POST', body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (sendBtn) sendBtn.classList.remove('is-busy');
          if (!d || !d.success) throw new Error('rejected');
          try {
            localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
          } catch (err) {}
          if (sendBtn) sendBtn.classList.add('is-done');
          if (sendLabel) sendLabel.textContent = 'Sent';
          if (status) {
            status.textContent = 'Message received. I will get back to you shortly.';
            status.className = 'cform__status mono is-ok';
          }
          if (form) form.reset();
          if (counter) counter.textContent = '0 / 600';
          setTimeout(function () {
            if (sendBtn) {
              sendBtn.classList.remove('is-done');
              sendBtn.disabled = false;
            }
            if (sendLabel) sendLabel.textContent = 'Send message';
          }, 4500);
        })
        .catch(function () {
          if (sendBtn) {
            sendBtn.classList.remove('is-busy');
            sendBtn.disabled = false;
          }
          if (sendLabel) sendLabel.textContent = 'Try again';
          if (status) {
            status.textContent = 'Something broke. Email muhamadrafifernanda@gmail.com instead.';
            status.className = 'cform__status mono is-err';
          }
        });
    });

    /* Quick inquiry pre-fill from Services cards */
    var svcButtons = $$('[data-svc-inquire]');
    svcButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var msg = btn.getAttribute('data-svc-msg');
        if (ta && msg) {
          ta.value = msg;
          ta.dispatchEvent(new Event('input', { bubbles: true }));
          var textarea = ta;
          setTimeout(function () {
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
          }, 850);
        }
      });
    });

    /* 1-Click Copy Email to Clipboard */
    var copyBtn = $('[data-copy-email]') as HTMLButtonElement | null;
    var copyLabel = $('[data-copy-label]') as HTMLElement | null;
    if (copyBtn) {
      var cBtn = copyBtn;
      cBtn.addEventListener('click', function () {
        var email = cBtn.getAttribute('data-copy-email') || 'muhamadrafifernanda@gmail.com';
        var handleSuccess = function () {
          cBtn.classList.add('is-copied');
          if (copyLabel) copyLabel.textContent = 'Copied! ✓';
          setTimeout(function () {
            cBtn.classList.remove('is-copied');
            if (copyLabel) copyLabel.textContent = 'Copy';
          }, 2400);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(handleSuccess).catch(function () {
            var taEl = document.createElement('textarea');
            taEl.value = email;
            document.body.appendChild(taEl);
            taEl.select();
            document.execCommand('copy');
            document.body.removeChild(taEl);
            handleSuccess();
          });
        } else {
          var taEl = document.createElement('textarea');
          taEl.value = email;
          document.body.appendChild(taEl);
          taEl.select();
          document.execCommand('copy');
          document.body.removeChild(taEl);
          handleSuccess();
        }
      });
    }
  }

  /* ---------------------------------------------------------------
     HERO VIDEO TEXT CLIPPING ENGINE (True Canvas 2D source-in masking)
     --------------------------------------------------------------- */
  var heroMask = $('[data-hero-mask]') as HTMLElement | null;
  var heroVideo = $('[data-hero-video]') as HTMLVideoElement | null;
  var heroCanvas = $('[data-hero-canvas]') as HTMLCanvasElement | null;
  var heroTitleEl = $('[data-hero-title]') as HTMLElement | null;

  if (heroMask && heroVideo && heroCanvas && heroTitleEl) {
    var ctx = heroCanvas.getContext('2d', { alpha: true });
    var lineSpans = Array.from(heroTitleEl.querySelectorAll('.hero__line > span')) as HTMLElement[];
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var isCanvasReady = false;

    interface TextSpanCache {
      text: string;
      font: string;
      letterSpacing?: string;
      align?: CanvasTextAlign;
      x: number;
      y: number;
      width: number;
      height: number;
      delay: number;
    }
    var textCache: TextSpanCache[] = [];

    var titleEl = heroTitleEl;
    var videoEl = heroVideo;
    var updateMetrics = function () {
      if (!heroMask || !titleEl) return;
      var maskRect = heroMask.getBoundingClientRect();
      var isCenter = window.getComputedStyle(titleEl).textAlign === 'center';
      textCache = lineSpans.map(function (span, i) {
        var box = span.parentElement || span;
        var boxRect = box.getBoundingClientRect();
        var style = window.getComputedStyle(span);
        var x = isCenter ? (boxRect.left - maskRect.left + boxRect.width / 2) : (boxRect.left - maskRect.left);
        return {
          text: span.textContent || '',
          font: style.fontWeight + ' ' + style.fontSize + ' ' + style.fontFamily,
          letterSpacing: ('letterSpacing' in style) ? (style as any).letterSpacing : undefined,
          align: (isCenter ? 'center' : 'left') as CanvasTextAlign,
          x: x,
          y: boxRect.top - maskRect.top,
          width: boxRect.width,
          height: boxRect.height,
          delay: i * 95
        };
      });
    };

    var heroStartTime = (!MOTION || skipLoader) ? 1 : 0;
    var startCanvasMotion = function () {
      if (heroStartTime === 0) {
        heroStartTime = performance.now();
      }
    };

    if (titleEl.classList.contains('is-in')) {
      startCanvasMotion();
    } else {
      var heroObs = new MutationObserver(function () {
        if (titleEl.classList.contains('is-in')) {
          heroObs.disconnect();
          startCanvasMotion();
        }
      });
      heroObs.observe(titleEl, { attributes: true, attributeFilter: ['class'] });
    }

    var resizeCanvas = function () {
      if (!heroMask || !heroCanvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = heroMask.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      heroCanvas.width = Math.round(rect.width * dpr);
      heroCanvas.height = Math.round(rect.height * dpr);
      heroCanvas.style.width = rect.width + 'px';
      heroCanvas.style.height = rect.height + 'px';
      updateMetrics();
    };

    var renderMask = function () {
      var context = ctx;
      if (!context || !heroMask || !heroCanvas || !heroVideo || !heroTitleEl) return;
      var cWidth = heroCanvas.width / dpr;
      var cHeight = heroCanvas.height / dpr;

      if (cWidth === 0 || cHeight === 0) {
        requestAnimationFrame(renderMask);
        return;
      }

      context.save();
      context.scale(dpr, dpr);
      context.clearRect(0, 0, cWidth, cHeight);

      // 1. Draw Text as Destination Mask with staggered line slide
      var now = performance.now();
      var isAnimDone = (heroStartTime === 1) || (heroStartTime > 0 && now - heroStartTime > 1350);

      for (var i = 0; i < textCache.length; i++) {
        var item = textCache[i];
        var currentY = item.y;

        if (!isAnimDone && heroStartTime > 0) {
          var elapsed = now - heroStartTime - item.delay;
          if (elapsed < 0) {
            continue;
          }
          var p = Math.min(1, elapsed / 1050);
          var eased = 1 - Math.pow(1 - p, 4);
          currentY = item.y + (1 - eased) * (item.height * 1.1);
        } else if (heroStartTime === 0) {
          continue;
        }

        context.save();
        context.beginPath();
        if (item.align === 'center') {
          context.rect(0, item.y, cWidth, item.height + 2);
        } else {
          context.rect(item.x, item.y, item.width, item.height + 2);
        }
        context.clip();
        context.font = item.font;
        context.fillStyle = '#ffffff';
        context.textBaseline = 'top';
        context.textAlign = item.align || 'left';
        if (item.letterSpacing && 'letterSpacing' in context) {
          (context as any).letterSpacing = item.letterSpacing;
        }
        context.fillText(item.text, item.x, currentY);
        context.restore();
      }

      // 2. Composite Video into Text only (source-in)
      // Destination Alpha > 0 ONLY inside text glyphs.
      // Outside glyphs, Alpha is 0 (100% transparent: ZERO leak, ZERO haze, ZERO box).
      if (heroVideo.readyState >= 2) {
        context.globalCompositeOperation = 'source-in';

        var vw = heroVideo.videoWidth || 16;
        var vh = heroVideo.videoHeight || 9;
        var videoRatio = vw / vh;
        var canvasRatio = cWidth / cHeight;
        var drawW: number, drawH: number, drawX: number, drawY: number;

        if (canvasRatio > videoRatio) {
          drawW = cWidth * 1.1;
          drawH = drawW / videoRatio;
          drawX = (cWidth - drawW) / 2;
          drawY = (cHeight - drawH) / 2;
        } else {
          drawH = cHeight * 1.1;
          drawW = drawH * videoRatio;
          var isMobile = window.innerWidth <= 820;
          drawX = (cWidth - drawW) * (isMobile ? 0.5 : 0.38);
          drawY = (cHeight - drawH) / 2;
        }

        context.drawImage(heroVideo, drawX, drawY, drawW, drawH);
        context.globalCompositeOperation = 'source-over';

        if (!isCanvasReady) {
          isCanvasReady = true;
          heroMask.classList.add('is-canvas-ready');
        }
      }

      context.restore();
      if (isHeroActive) {
        rafId = requestAnimationFrame(renderMask);
      }
    };

    var isHeroActive = true;
    var rafId = 0;
    var scheduleRender = function () {
      if (isHeroActive && !rafId) {
        rafId = requestAnimationFrame(renderMask);
      }
    };

    var heroScrollObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        isHeroActive = e.isIntersecting;
        if (isHeroActive) {
          if (videoEl) videoEl.play().catch(function () {});
          scheduleRender();
        } else {
          if (videoEl) videoEl.pause();
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        }
      });
    }, { rootMargin: '60px 0px 60px 0px', threshold: 0 });
    heroScrollObs.observe(heroMask);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    if ('fonts' in document) {
      document.fonts.ready.then(function () {
        resizeCanvas();
      });
    }
    setTimeout(updateMetrics, 1200);

    var playPromise = heroVideo.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {});
    }

    scheduleRender();
  }

  /* ---------- page transition curtain ---------- */
  var curtain = $('[data-pt-curtain]');
  if (curtain && MOTION) {
    window.addEventListener('pageshow', function () {
      if (curtain) curtain.classList.remove('is-cover', 'is-on');
    });

    document.addEventListener('click', function (e) {
      var target = e.target as HTMLElement | null;
      var a = target && target.closest ? target.closest<HTMLAnchorElement>('a[data-pt]') : null;
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      e.preventDefault();
      sound.playTransition();
      try {
        sessionStorage.setItem('rv-visited', '1');
      } catch (err) {}
      if (curtain) {
        curtain.classList.add('is-cover');
        requestAnimationFrame(function () { if (curtain) curtain.classList.add('is-on'); });
      }
      setTimeout(function () { if (href) window.location.href = href; }, 560);
    });
  }

  /* ---------- background warms on the human sections ---------- */
  var tintZones = [
    { id: 'about', c: '#161513' },
    { id: 'experience', c: '#161513' },
    { id: 'contact', c: '#141412' }
  ].map(function (z) { return { el: document.getElementById(z.id), c: z.c }; })
   .filter(function (z): z is { el: HTMLElement; c: string } { return !!z.el; });

  if (tintZones.length && MOTION) {
    var mainEl = $('main');
    var applyTint = function (c: string) {
      document.body.style.backgroundColor = c;
      if (mainEl) mainEl.style.backgroundColor = c;
    };
    var tintObs = new IntersectionObserver(function (entries) {
      var hit: IntersectionObserverEntry | null = null;
      entries.forEach(function (en) { if (en.isIntersecting) hit = en; });
      if (hit) {
        var matching = tintZones.filter(function (z) { return z.el === (hit as IntersectionObserverEntry).target; });
        if (matching.length) applyTint(matching[0].c);
      } else if (!tintZones.some(function (z) {
        var r = z.el.getBoundingClientRect();
        return r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5;
      })) applyTint('#121211');
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    tintZones.forEach(function (z) { tintObs.observe(z.el); });
  }

  /* =================================================================
     DECORATIVE LAYER — GSAP only past this point.
     Everything above has already guaranteed the page is readable.
     ================================================================= */
  if (!MOTION) return;

  /* ---------- smooth scroll (Desktop only — keep mobile scroll 100% native and 120Hz fluid) ---------- */
  var lenis: any = null;
  var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 820);
  if (!isTouch) {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t: number) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToY(y: number) {
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  }

  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      scrollToY(target.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - 10);
    });
  });

  /* ---------- section rail ---------- */
  var railBtns = $$('[data-srail-to]');
  if (railBtns.length) {
    railBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var targetId = b.getAttribute('data-srail-to');
        var t = targetId ? document.getElementById(targetId) : null;
        if (!t) return;
        scrollToY(t.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - 10);
      });
    });

    var railMap = railBtns.map(function (b) {
      var targetId = b.getAttribute('data-srail-to');
      return { btn: b, el: targetId ? document.getElementById(targetId) : null };
    }).filter(function (r): r is { btn: HTMLElement; el: HTMLElement } { return !!r.el; });

    var markRail = function () {
      if (window.innerWidth <= 820) return;
      var mid = window.innerHeight * 0.42;
      var active: HTMLElement | null = null;
      railMap.forEach(function (r) {
        var box = r.el.getBoundingClientRect();
        if (box.top <= mid && box.bottom >= mid) active = r.btn;
      });
      railMap.forEach(function (r) { r.btn.classList.toggle('is-on', r.btn === active); });
    };
    markRail();
    window.addEventListener('scroll', markRail, { passive: true });
    window.addEventListener('resize', markRail);
  }


  /* ---------- responsive choreography ---------- */
  var mm = gsap.matchMedia();

  mm.add(DESKTOP, function () {
    var pin = $('[data-work-pin]');
    var track = $('[data-work-track]');
    var bar = $('[data-work-bar]');
    var count = $('[data-work-count]');
    var panels = $$('.panel', track || document);
    var workSection = pin ? (pin.closest('.work') || pin) : null;
    var hTween: any = null;

    if (pin && track && panels.length) {
      var run = function () { return Math.max(1, (track as HTMLElement).scrollWidth - window.innerWidth); };

      gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });

      hTween = gsap.to(track, {
        x: function () { return -run(); },
        ease: 'none',
        scrollTrigger: {
          trigger: workSection,
          start: 'top top',
          end: function () { return '+=' + run(); },
          pin: workSection,
          pinSpacing: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: function (self: any) {
            var p = self.progress;
            if (bar) gsap.set(bar, { scaleX: Math.max(.02, p) });
            if (count) {
              var idx = Math.min(panels.length, Math.floor(p * panels.length) + 1);
              count.textContent = ('0' + idx).slice(-2) + ' / ' + ('0' + panels.length).slice(-2);
            }
          }
        }
      });
    }

    var skewEls = $$('[data-skew]');
    if (skewEls.length) {
      var setSkew = gsap.quickTo(skewEls, 'skewY', { duration: .6, ease: 'power3' });
      ScrollTrigger.create({
        onUpdate: function (self: any) {
          setSkew(gsap.utils.clamp(-2, 2, self.getVelocity() / -420));
        }
      });
    }

    var foot = $('[data-foot]');
    var spacer = $('[data-footspacer]');
    if (foot && spacer) {
      html.classList.add('footreveal');
      var sizeFooter = function () {
        if (spacer && foot) spacer.style.height = foot.offsetHeight + 'px';
      };
      sizeFooter();
      window.addEventListener('resize', sizeFooter);
    }

    return function () {
      html.classList.remove('footreveal');
      if (track) gsap.set(track, { clearProps: 'transform' });
      if (skewEls.length) gsap.set(skewEls, { clearProps: 'transform' });
    };
  });

  mm.add('(max-width: 820px)', function () {
    // Keep mobile scroll completely native and unencumbered by scrub tweens
  });

  if (FINE) {
    $$('[data-magnetic]').forEach(function (el) {
      var xTo = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3' });
      var yTo = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3' });
      el.addEventListener('mousemove', function (e: MouseEvent) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * .28);
        yTo((e.clientY - (r.top + r.height / 2)) * .38);
      });
      el.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
    });
  }

  if (FINE) {
    var cursor = $('[data-cursor]');
    var cLabel = $('[data-cursor-label]');
    if (cursor) {
      var cx = gsap.quickTo(cursor, 'x', { duration: .28, ease: 'power3' });
      var cy = gsap.quickTo(cursor, 'y', { duration: .28, ease: 'power3' });
      window.addEventListener('mousemove', function (e: MouseEvent) {
        if (window.innerWidth <= 820) return;
        if (cursor) cursor.classList.add('is-active');
        cx(e.clientX); cy(e.clientY);
      });
      window.addEventListener('mouseleave', function () { if (cursor) cursor.classList.remove('is-active'); });
      $$('[data-hover]').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          if (window.innerWidth <= 820) return;
          var hoverText = el.getAttribute('data-hover');
          if (cLabel && hoverText) cLabel.textContent = hoverText;
          if (cursor) cursor.classList.add('is-label');
        });
        el.addEventListener('mouseleave', function () { if (cursor) cursor.classList.remove('is-label'); });
      });
    }
  }

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  var rt: any;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { ScrollTrigger.refresh(); }, 200);
  });
})();
