/* =================================================================
   RANDEVOUGH — STUDIO GROTESK

   ARCHITECTURE RULE (learned the hard way, three times):
   Text reveals are driven by IntersectionObserver + CSS classes ONLY.
   They never depend on ScrollTrigger positions, pinning, or smooth
   scroll math. GSAP is used exclusively for scrubbed choreography
   (horizontal gallery, parallax, skew) — things that are decorative
   and can fail without hiding a single word.
   ================================================================= */
(function () {
  'use strict';

  var html = document.documentElement;
  var HAS_GSAP = !!(window.gsap && window.ScrollTrigger);
  var DESKTOP = '(min-width: 821px)';

  html.classList.add('js-ready');

  var MOTION = html.classList.contains('motion');
  var FINE = html.classList.contains('fine');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  /* ---------------------------------------------------------------
     DATA
     --------------------------------------------------------------- */
  var PROOF = [
    { id: 'codequest',   name: 'CodeQuest',      meta: 'Web app · 2026' },
    { id: 'parking',     name: 'Smart Parking',  meta: 'IoT · 2025' },
    { id: 'school',      name: 'School Connect', meta: 'Web app · 2025' },
    { id: 'song',        name: 'SongUnlocked',   meta: 'Web app · 2024' },
    { id: 'jakartahitz', name: 'JakartaHitz',    meta: 'Web dev · 2024' },
    { id: 'ukm',         name: 'UKM Coding',     meta: 'Lead · 2025' },
    { id: 'ngoepi',      name: 'NGOEPI',         meta: 'Teaching · 2023' },
    { id: 'pushansiber', name: 'PUSHANSIBER',    meta: 'Network · 2022' }
  ];

  var STACK = [
    { n: 'TypeScript',   key: 1, p: ['codequest', 'song', 'jakartahitz'] },
    { n: 'React',        key: 1, p: ['codequest', 'school', 'song', 'jakartahitz', 'ngoepi'] },
    { n: 'Next.js',      key: 1, p: ['codequest', 'song', 'ukm'] },
    { n: 'Node.js',      key: 0, p: ['codequest', 'school'] },
    { n: 'Prisma',       key: 1, p: ['codequest'] },
    { n: 'PostgreSQL',   key: 1, p: ['codequest'] },
    { n: 'MySQL',        key: 0, p: ['school'] },
    { n: 'Supabase',     key: 0, p: ['codequest'] },
    { n: 'Tailwind CSS', key: 1, p: ['codequest', 'song', 'jakartahitz'] },
    { n: 'REST APIs',    key: 0, p: ['school', 'parking', 'jakartahitz'] },
    { n: 'NextAuth',     key: 0, p: ['codequest'] },
    { n: 'Git',          key: 0, p: ['codequest', 'parking', 'school', 'song', 'ukm'] },
    { n: 'Vercel',       key: 0, p: ['codequest', 'song'] },
    { n: 'Figma',        key: 0, p: ['codequest', 'school', 'ngoepi'] },
    { n: 'Linux',        key: 0, p: ['pushansiber', 'codequest'] },
    { n: 'ESP32',        key: 1, p: ['parking'] },
    { n: 'Arduino',      key: 0, p: ['parking'] },
    { n: 'C / C++',      key: 0, p: ['parking'] },
    { n: 'MikroTik',     key: 0, p: ['pushansiber'] },
    { n: 'Networking',   key: 0, p: ['pushansiber', 'parking'] }
  ];

  var ROLES = [
    { year: '2025 — Now', role: 'Ketua UKM Coding', org: 'Cyber University', tag: 'Current',
      detail: 'Leading the campus coding community: curriculum, internal projects, and getting members to ship something real instead of watching tutorials.' },
    { year: '2024 — 2025', role: 'Web Developer', org: 'JakartaHitz · MillenialNews Group', tag: 'Professional',
      detail: 'Built and maintained production web pages for a media brand — fast loads, editable content, and layouts that survive real editorial traffic.' },
    { year: '2024', role: 'Wakil Ketua UKM Coding', org: 'Cyber University', tag: 'Leadership',
      detail: 'Ran the program side of the community: scheduling, mentoring pairs, and keeping internal projects unblocked.' },
    { year: '2024', role: 'Ketua Pelaksana DECOMPE 4.0', org: 'ASEAN UI/UX Competition', tag: 'Leadership',
      detail: 'Led the organizing committee for an international UI/UX competition with around 51 participants — timeline, judging flow, and logistics.' },
    { year: '2023', role: 'Frontend Instructor', org: 'NGOEPI', tag: 'Teaching',
      detail: 'Taught five sessions of frontend fundamentals — layout, state, and the habits that stop beginners from painting themselves into a corner.' },
    { year: '2022 — 2023', role: 'Network Engineer Intern', org: 'PUSHANSIBER · Kemhan RI', tag: 'Start',
      detail: 'Network infrastructure work during my SMK TKJ track. Configuration, monitoring, and tracing faults — where the debugging instinct came from.' }
  ];

  /* ---------------------------------------------------------------
     RENDER: experience rows
     --------------------------------------------------------------- */
  var rowsHost = $('[data-rows]');
  if (rowsHost) {
    rowsHost.innerHTML = ROLES.map(function (r, i) {
      var now = r.tag === 'Current' ? ' row__tag--now' : '';
      return '<div class="row" data-fade style="--d:' + (i % 3) * 60 + 'ms">' +
        '<div class="row__main">' +
          '<span class="row__year">' + esc(r.year) + '</span>' +
          '<h3 class="row__role">' + esc(r.role) + '</h3>' +
          '<span class="row__org">' + esc(r.org) + '</span>' +
          '<span class="row__tag' + now + '">' + esc(r.tag) + '</span>' +
        '</div>' +
        '<div class="row__detail"><p>' + esc(r.detail) + '</p></div>' +
      '</div>';
    }).join('');
  }

  /* ---------------------------------------------------------------
     RENDER: stack evidence map
     --------------------------------------------------------------- */
  var stackHost = $('[data-stack]');
  var proofHost = $('[data-proof]');
  var stackHint = $('[data-stack-hint]');

  if (stackHost && proofHost) {
    proofHost.innerHTML = PROOF.map(function (p) {
      return '<li data-proof-id="' + p.id + '">' +
        '<b>' + esc(p.name) + '</b><span>' + esc(p.meta) + '</span></li>';
    }).join('');

    stackHost.innerHTML = STACK.map(function (t, i) {
      return '<button type="button" class="stack__item' + (t.key ? ' is-key' : '') +
        '" data-tech="' + i + '" data-fade style="--d:' + (i % 7) * 40 + 'ms">' + esc(t.n) + '</button>';
    }).join('');

    var proofItems = $$('[data-proof-id]', proofHost);
    var techItems = $$('.stack__item', stackHost);

    var clearStack = function () {
      techItems.forEach(function (el) { el.classList.remove('is-active'); });
      proofItems.forEach(function (el) {
        el.classList.remove('is-on');
        el.classList.remove('is-dim');
      });
      if (stackHint) stackHint.textContent = 'All tools — ' + PROOF.length + ' shipped projects & roles';
    };

    var litStack = function (i) {
      var t = STACK[i];
      techItems.forEach(function (el, k) { el.classList.toggle('is-active', k === i); });
      proofItems.forEach(function (el) {
        var hit = t.p.indexOf(el.getAttribute('data-proof-id')) > -1;
        el.classList.toggle('is-on', hit);
        el.classList.toggle('is-dim', !hit);
      });
      if (stackHint) {
        stackHint.textContent = t.n + ' — used in ' + t.p.length + (t.p.length > 1 ? ' places' : ' place');
      }
    };

    techItems.forEach(function (el, i) {
      el.addEventListener('mouseenter', function () { litStack(i); });
      el.addEventListener('focus', function () { litStack(i); });
      el.addEventListener('click', function () {
        if (el.classList.contains('is-active')) clearStack(); else litStack(i);
      });
    });
    stackHost.addEventListener('mouseleave', clearStack);
    clearStack();
  }

  /* ---------------------------------------------------------------
     SPLIT WORDS (staggered via CSS custom property)
     --------------------------------------------------------------- */
  $$('[data-split]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
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
    var ct = $('[data-contact-title]');
    if (ct) ct.classList.add('is-in');
  }

  if (!MOTION || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.02 });

    revealTargets.forEach(function (el) {
      if (el.closest('.hero')) return;
      io.observe(el);
    });

    var contactTitle = $('[data-contact-title]');
    if (contactTitle) {
      $$('.hero__line > span', contactTitle).forEach(function (s, i) {
        s.style.setProperty('--d', (i * 110) + 'ms');
      });
      io.observe(contactTitle);
    }

    /* absolute last resort: nothing may stay invisible past 4.5s */
    setTimeout(showAll, 4500);
  }

  window.addEventListener('error', function () { setTimeout(showAll, 50); });

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
  var loaderWord = $('[data-loader-word]');
  var WORDS = ['Building', 'Shipping', 'Debugging', 'Deploying'];

  function runWords(endAt) {
    if (!loaderWord) return;
    var i = 0;
    var swap = function (text, final) {
      loaderWord.classList.add('is-swap');
      setTimeout(function () {
        loaderWord.textContent = text;
        if (final) loaderWord.classList.add('is-final');
        loaderWord.classList.remove('is-swap');
      }, 170);
    };
    var id = setInterval(function () {
      i++;
      swap(WORDS[i % WORDS.length], false);
    }, 320);
    setTimeout(function () { clearInterval(id); swap('Ready', true); }, endAt);
  }

  function runCounter(ms) {
    if (!loaderCount) return;
    var t0 = performance.now();
    var step = function (now) {
      var p = Math.min(1, (now - t0) / ms);
      /* ease-out so the number decelerates into 100 */
      var v = Math.round((1 - Math.pow(1 - p, 3)) * 100);
      loaderCount.textContent = v < 100 ? ('0' + v).slice(-2) : '100';
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  var skipLoader = false;
  try {
    skipLoader = sessionStorage.getItem('rv-skip-loader') === '1';
    sessionStorage.removeItem('rv-skip-loader');
  } catch (err) { skipLoader = false; }

  if (!MOTION || skipLoader) {
    if (loader) loader.classList.add('is-ready', 'is-out', 'is-done');
    startHero();
  } else if (loader) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        loader.classList.add('is-ready');
        runCounter(1450);
        runWords(1400);
      });
    });
    /* the loader leaving and the hero arriving are one movement */
    setTimeout(function () { loader.classList.add('is-out'); startHero(); }, 1800);
    setTimeout(function () { loader.classList.add('is-done'); }, 2800);
  } else {
    startHero();
  }

  /* ---------------------------------------------------------------
     POINTER SPOTLIGHT — plain CSS variables, no engine needed
     --------------------------------------------------------------- */
  var spot = $('[data-spot]');
  if (spot && FINE && MOTION) {
    /* the light lags behind the pointer — it should drift, not track */
    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var cxp = tx, cyp = ty, spotRunning = false;

    var drift = function () {
      cxp += (tx - cxp) * 0.045;
      cyp += (ty - cyp) * 0.045;
      spot.style.setProperty('--mx', cxp.toFixed(1) + 'px');
      spot.style.setProperty('--my', cyp.toFixed(1) + 'px');
      if (Math.abs(tx - cxp) > 0.4 || Math.abs(ty - cyp) > 0.4) {
        requestAnimationFrame(drift);
      } else {
        spotRunning = false;
      }
    };

    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      spot.classList.add('is-on');
      if (!spotRunning) { spotRunning = true; requestAnimationFrame(drift); }
    }, { passive: true });

    window.addEventListener('mouseleave', function () { spot.classList.remove('is-on'); });
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
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && nav) nav.classList.remove('is-hidden');
    });
  }
  if (navmenu) $$('a', navmenu).forEach(function (a) { a.addEventListener('click', closeMenu); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------------------------------------------------------------
     CONTACT FORM
     --------------------------------------------------------------- */
  var form = $('[data-cform]');
  if (form) {
    var status = $('[data-cform-status]', form);
    var sendBtn = $('[data-send]', form);
    var sendLabel = $('[data-send-label]', form);
    var ta = $('[data-counter]', form);
    var counter = $('[data-count]', form);

    if (ta && counter) {
      var sync = function () {
        counter.textContent = ta.value.length + ' / ' + (ta.getAttribute('maxlength') || 600);
        ta.style.height = 'auto';
        ta.style.height = Math.max(96, ta.scrollHeight) + 'px';
      };
      ta.addEventListener('input', sync);
      sync();
    }

    var validity = function (input) {
      var v = input.value.trim();
      if (!v) return false;
      if (input.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      return true;
    };

    $$('[data-field]', form).forEach(function (f) {
      var input = $('input, textarea', f);
      if (!input) return;
      input.addEventListener('blur', function () {
        if (input.value.trim() === '') { f.classList.remove('is-bad'); return; }
        f.classList.toggle('is-bad', !validity(input));
      });
      input.addEventListener('input', function () {
        if (f.classList.contains('is-bad') && validity(input)) f.classList.remove('is-bad');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = 0;
      $$('[data-field]', form).forEach(function (f) {
        var input = $('input, textarea', f);
        if (!input || !input.required) return;
        var ok = validity(input);
        f.classList.toggle('is-bad', !ok);
        if (!ok) bad++;
      });
      if (bad) {
        status.textContent = bad + ' field' + (bad > 1 ? 's need' : ' needs') + ' attention';
        status.className = 'cform__status mono is-err';
        return;
      }

      var key = form.querySelector('[name="access_key"]');
      if (key && key.value.indexOf('YOUR_') === 0) {
        status.textContent = 'Form key not set — email me directly for now';
        status.className = 'cform__status mono is-err';
        return;
      }

      sendBtn.classList.add('is-busy');
      sendBtn.disabled = true;
      if (sendLabel) sendLabel.textContent = 'Sending';
      status.textContent = '';
      status.className = 'cform__status mono';

      fetch(form.action, { method: 'POST', body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          sendBtn.classList.remove('is-busy');
          if (!d || !d.success) throw new Error('rejected');
          sendBtn.classList.add('is-done');
          if (sendLabel) sendLabel.textContent = 'Sent ✓';
          status.textContent = 'Message received. I reply within a day.';
          status.className = 'cform__status mono is-ok';
          form.reset();
          if (counter) counter.textContent = '0 / 600';
        })
        .catch(function () {
          sendBtn.classList.remove('is-busy');
          sendBtn.disabled = false;
          if (sendLabel) sendLabel.textContent = 'Try again';
          status.textContent = 'Something broke. Email randdevs54@gmail.com instead.';
          status.className = 'cform__status mono is-err';
        });
    });
  }

  /* ---------------------------------------------------------------
     HERO VIDEO
     --------------------------------------------------------------- */
  var heroVideo = $('[data-hero-video]');
  if (heroVideo) {
    var play = heroVideo.play();
    if (play && play.catch) play.catch(function () { /* poster carries it */ });
    heroVideo.addEventListener('error', function () { heroVideo.style.display = 'none'; });
  }

  /* ---------- page transition curtain ---------- */
  var curtain = $('[data-pt-curtain]');
  if (curtain && MOTION) {
    // a cached back-navigation must never show a stale curtain
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) curtain.classList.remove('is-cover', 'is-on');
    });

    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[data-pt]') : null;
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      e.preventDefault();
      try {
        // arriving through the curtain means the opening ritual is already spent
        sessionStorage.setItem('rv-skip-loader', '1');
      } catch (err) { /* private mode — the loader simply plays again */ }
      curtain.classList.add('is-cover');
      requestAnimationFrame(function () { curtain.classList.add('is-on'); });
      setTimeout(function () { window.location.href = href; }, 560);
    });
  }

  /* ---------- background warms on the human sections ---------- */
  var tintZones = [
    { id: 'about', c: '#0C0B09' },
    { id: 'experience', c: '#0C0B09' },
    { id: 'contact', c: '#0B0A09' }
  ].map(function (z) { return { el: document.getElementById(z.id), c: z.c }; })
   .filter(function (z) { return !!z.el; });

  if (tintZones.length && MOTION) {
    var mainEl = $('main');
    var applyTint = function (c) {
      document.body.style.backgroundColor = c;
      if (mainEl) mainEl.style.backgroundColor = c;
    };
    var tintObs = new IntersectionObserver(function (entries) {
      var hit = null;
      entries.forEach(function (en) { if (en.isIntersecting) hit = en; });
      if (hit) applyTint(tintZones.filter(function (z) { return z.el === hit.target; })[0].c);
      else if (!tintZones.some(function (z) {
        var r = z.el.getBoundingClientRect();
        return r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5;
      })) applyTint('#0A0A0A');
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    tintZones.forEach(function (z) { tintObs.observe(z.el); });
  }

  /* =================================================================
     DECORATIVE LAYER — GSAP only past this point.
     Everything above has already guaranteed the page is readable.
     ================================================================= */
  if (!HAS_GSAP || !MOTION) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.6 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToY(y) {
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
        var t = document.getElementById(b.getAttribute('data-srail-to'));
        if (!t) return;
        scrollToY(t.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - 10);
      });
    });

    var railMap = railBtns.map(function (b) {
      return { btn: b, el: document.getElementById(b.getAttribute('data-srail-to')) };
    }).filter(function (r) { return !!r.el; });

    var markRail = function () {
      var mid = window.innerHeight * 0.42;
      var active = null;
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

  /* ---------- marquee ---------- */
  var mTrack = $('[data-marquee-track]');
  if (mTrack) {
    mTrack.innerHTML = mTrack.innerHTML + mTrack.innerHTML;
    gsap.to(mTrack, { xPercent: -50, duration: 30, ease: 'none', repeat: -1 });
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
    var hTween = null;
    var stWork = null;

    if (pin && track && panels.length) {
      var run = function () { return Math.max(1, track.scrollWidth - window.innerWidth); };

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
          onUpdate: function (self) {
            var p = self.progress;
            if (bar) gsap.set(bar, { scaleX: Math.max(.02, p) });
            if (count) {
              var idx = Math.min(panels.length, Math.floor(p * panels.length) + 1);
              count.textContent = ('0' + idx).slice(-2) + ' / ' + ('0' + panels.length).slice(-2);
            }
          }
        }
      });
      stWork = hTween.scrollTrigger;

/* gallery is scroll-driven only — drag removed on purpose */

      /* parallax inside each frame, driven by the horizontal tween */
      panels.forEach(function (pnl) {
        var img = $('img', pnl);
        if (!img) return;
        gsap.fromTo(img, { xPercent: -5 }, {
          xPercent: 5, ease: 'none',
          scrollTrigger: {
            trigger: pnl,
            containerAnimation: hTween,
            start: 'left right',
            end: 'right left',
            scrub: true,
            invalidateOnRefresh: true
          }
        });
      });

    }

    /* skew on scroll velocity — applied only to unpinned blocks */
    var skewEls = $$('[data-skew]');
    if (skewEls.length) {
      var setSkew = gsap.quickTo(skewEls, 'skewY', { duration: .6, ease: 'power3' });
      ScrollTrigger.create({
        onUpdate: function (self) {
          setSkew(gsap.utils.clamp(-2, 2, self.getVelocity() / -420));
        }
      });
    }

    /* footer revealed from underneath */
    var foot = $('[data-foot]');
    var spacer = $('[data-footspacer]');
    if (foot && spacer) {
      html.classList.add('footreveal');
      var sizeFooter = function () { spacer.style.height = foot.offsetHeight + 'px'; };
      sizeFooter();
      window.addEventListener('resize', sizeFooter);
      setTimeout(sizeFooter, 1200);
    }

    return function () {
      html.classList.remove('footreveal');
      if (track) gsap.set(track, { clearProps: 'transform' });
      if (skewEls.length) gsap.set(skewEls, { clearProps: 'transform' });
    };
  });

  mm.add('(max-width: 820px)', function () {
    var frames = $$('.panel__media');
    frames.forEach(function (f) {
      var img = $('img', f);
      if (!img) return;
      gsap.fromTo(img, { yPercent: -4 }, {
        yPercent: 4, ease: 'none',
        scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  });

  /* ---------- magnetic buttons ---------- */
  if (FINE) {
    $$('[data-magnetic]').forEach(function (el) {
      var xTo = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3' });
      var yTo = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3' });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * .28);
        yTo((e.clientY - (r.top + r.height / 2)) * .38);
      });
      el.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
    });
  }

  /* ---------- cursor ---------- */
  if (FINE) {
    var cursor = $('[data-cursor]');
    var cLabel = $('[data-cursor-label]');
    if (cursor) {
      var cx = gsap.quickTo(cursor, 'x', { duration: .28, ease: 'power3' });
      var cy = gsap.quickTo(cursor, 'y', { duration: .28, ease: 'power3' });
      window.addEventListener('mousemove', function (e) {
        cursor.classList.add('is-active');
        cx(e.clientX); cy(e.clientY);
      });
      window.addEventListener('mouseleave', function () { cursor.classList.remove('is-active'); });
      $$('[data-hover]').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          if (cLabel) cLabel.textContent = el.getAttribute('data-hover');
          cursor.classList.add('is-label');
        });
        el.addEventListener('mouseleave', function () { cursor.classList.remove('is-label'); });
      });
    }
  }

  /* ---------- keep triggers honest ---------- */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { ScrollTrigger.refresh(); }, 200);
  });
})();
