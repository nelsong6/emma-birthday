(function () {
  'use strict';

  const pages = Array.isArray(window.BIRTHDAY_PAGES) ? window.BIRTHDAY_PAGES : [];
  const audioFile = window.BIRTHDAY_AUDIO || '';
  const ambienceFile = window.BIRTHDAY_AMBIENCE || '';
  // First page that should have the ambience track audible. -1 = never.
  const ambienceFromIndex = pages.findIndex((p) => p && p.ambience);

  const coverEl = document.getElementById('cover');
  const startBtn = document.getElementById('start');
  const bookEl = document.getElementById('book');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const muteBtn = document.getElementById('mute');
  const progressEl = document.getElementById('progress');
  const audioEl = document.getElementById('audio');
  const ambienceEl = document.getElementById('ambience');

  const MUSIC_VOL = 0.6;
  const AMBIENCE_VOL = 0.5;

  let index = 0;
  let started = false;

  // ---- Build pages ----
  const pageEls = pages.map((page, i) => {
    const el = document.createElement('section');
    el.className = 'page';
    if (page.theme) el.dataset.theme = page.theme;

    // Full-bleed pages: the image fills the whole viewport with no card frame.
    if (page.full) el.classList.add('bleed');

    const card = document.createElement('div');
    card.className = 'page-card' + (page.full ? ' full' : '');

    if (page.image) {
      const img = document.createElement('img');
      img.src = 'images/' + page.image;
      img.alt = page.title || 'Birthday photo ' + (i + 1);
      img.loading = i <= 1 ? 'eager' : 'lazy';
      // If a photo is missing, hide the broken-image icon gracefully.
      img.addEventListener('error', () => { img.style.display = 'none'; });
      card.appendChild(img);
    }
    if (page.title) {
      const h = document.createElement('h2');
      h.className = 'page-title';
      h.textContent = page.title;
      card.appendChild(h);
    }
    if (page.text) {
      const p = document.createElement('p');
      p.className = 'page-text';
      p.textContent = page.text;
      card.appendChild(p);
    }

    el.appendChild(card);
    return el;
  });

  pageEls.forEach((el) => bookEl.appendChild(el));

  // ---- Progress dots ----
  const dots = pages.map(() => {
    const d = document.createElement('span');
    d.className = 'dot';
    progressEl.appendChild(d);
    return d;
  });

  function render() {
    pageEls.forEach((el, i) => {
      el.classList.remove('current', 'upcoming', 'turned');
      if (i < index) el.classList.add('turned');
      else if (i === index) el.classList.add('current');
      else el.classList.add('upcoming');
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === pages.length - 1;
    updateAmbience();
  }

  function go(to) {
    const clamped = Math.max(0, Math.min(pages.length - 1, to));
    if (clamped === index) return;
    index = clamped;
    render();
  }
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  // ---- Audio ----
  let muted = false;

  // Smoothly ramp an <audio> element's volume to `target` over `ms`.
  const fadeTimers = new WeakMap();
  function fadeTo(el, target, ms) {
    const prevTimer = fadeTimers.get(el);
    if (prevTimer) clearInterval(prevTimer);
    const from = el.volume;
    const steps = Math.max(1, Math.round(ms / 50));
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      const v = from + (target - from) * (step / steps);
      el.volume = Math.min(1, Math.max(0, v));
      if (step >= steps) { clearInterval(id); fadeTimers.delete(el); }
    }, 50);
    fadeTimers.set(el, id);
  }

  // Beach/ocean ambience fades in once we reach its page, out if we go back.
  function updateAmbience() {
    if (!ambienceFile || ambienceFromIndex < 0) return;
    const audible = started && !muted && index >= ambienceFromIndex;
    fadeTo(ambienceEl, audible ? AMBIENCE_VOL : 0, 1400);
  }

  function initAudio() {
    if (audioFile) {
      audioEl.src = 'audio/' + audioFile;
      audioEl.volume = MUSIC_VOL;
      const p = audioEl.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
      muteBtn.hidden = false;
    }
    if (ambienceFile && ambienceFromIndex >= 0) {
      ambienceEl.src = 'audio/' + ambienceFile;
      ambienceEl.volume = 0; // starts silent; fades in on its page
      const p = ambienceEl.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
      muteBtn.hidden = false;
      updateAmbience();
    }
  }

  function toggleMute() {
    muted = !muted;
    if (muted) {
      audioEl.pause();
      ambienceEl.pause();
      muteBtn.classList.add('muted');
      muteBtn.textContent = '♪̶';
    } else {
      if (audioFile) audioEl.play().catch(() => {});
      if (ambienceFile && ambienceFromIndex >= 0) ambienceEl.play().catch(() => {});
      muteBtn.classList.remove('muted');
      muteBtn.textContent = '♪';
      updateAmbience();
    }
  }

  // ---- Start ----
  function start() {
    if (started) return;
    started = true;
    coverEl.classList.add('hide');
    setTimeout(() => { coverEl.hidden = true; }, 800);

    bookEl.hidden = false;
    prevBtn.hidden = false;
    nextBtn.hidden = false;
    progressEl.hidden = false;
    render();
    initAudio();
  }

  startBtn.addEventListener('click', start);

  // ---- Navigation wiring ----
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  muteBtn.addEventListener('click', toggleMute);

  // Keyboard
  window.addEventListener('keydown', (e) => {
    if (!started) {
      if (e.key === 'Enter' || e.key === ' ') start();
      return;
    }
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') prev();
  });

  // Tap edges of the book to turn (mobile-friendly, doesn't fight buttons)
  bookEl.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    const x = e.clientX / window.innerWidth;
    if (x > 0.62) next();
    else if (x < 0.38) prev();
  });

  // Swipe
  let touchX = null;
  bookEl.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  bookEl.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    touchX = null;
  }, { passive: true });

  // Guard: if pages.js is empty, show a hint instead of a blank book.
  if (pages.length === 0) {
    startBtn.textContent = 'Add pages in pages.js';
    startBtn.disabled = true;
  }
})();
