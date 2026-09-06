/* ============================================================
   Unified Book — chapter interactivity
   1) Reading progress line
   2) TOC scroll-spy
   3) Mark-as-read (localStorage)
   4) Listen aloud (Web Speech API + enhanced TTS)
   5) Code copy buttons
   ============================================================ */

const KEY_READ = 'unifiedbook-read-v1';

/* ---------- shared read-state helpers ---------- */
function getRead(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY_READ) || '[]');
    return Array.isArray(v) ? v : [];
  } catch { return []; }
}
function setRead(list: string[]) { localStorage.setItem(KEY_READ, JSON.stringify([...new Set(list)])); }

/* ---------- 1. Progress line ---------- */
const line = document.getElementById('progress-line');
const body = document.getElementById('chapter-body');

function updateProgress() {
  if (!line || !body) return;
  const rect = body.getBoundingClientRect();
  const total = rect.height - window.innerHeight * 0.5;
  const scrolled = Math.max(0, -rect.top + window.innerHeight * 0.25);
  const pct = Math.max(0, Math.min(1, total > 0 ? scrolled / total : 0));
  line.style.width = `${(pct * 100).toFixed(2)}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

/* ---------- 2. TOC scroll-spy ---------- */
const tocLinks = Array.from(document.querySelectorAll<HTMLLIElement>('#toc-list li[data-slug]'));
if (tocLinks.length && body) {
  const headings = tocLinks.map((li) => document.getElementById(li.dataset.slug || '')).filter((el): el is HTMLElement => el !== null);
  const spy = new IntersectionObserver((entries) => {
    for (const entry of entries) { if (entry.isIntersecting) { const id = entry.target.id; tocLinks.forEach((li) => li.classList.toggle('active', li.dataset.slug === id)); } }
  }, { rootMargin: '-12% 0px -70% 0px' });
  headings.forEach((h) => spy.observe(h));
}

/* ---------- 3. Mark as read ---------- */
const markBtn = document.getElementById('mark-read') as HTMLButtonElement | null;
let paintMark: () => void = () => {};
if (markBtn) {
  const slug = markBtn.dataset.slug || '';
  const tick = markBtn.querySelector('.tick') as HTMLElement;
  const label = markBtn.querySelector('[data-label]') as HTMLElement;
  paintMark = () => {
    const read = getRead().includes(slug);
    markBtn.classList.toggle('read-done', read);
    tick.textContent = read ? '✓' : '';
    label.textContent = read ? 'Read — mark as unread' : 'Mark chapter as read';
  };
  paintMark();
  markBtn.addEventListener('click', () => {
    const list = getRead();
    const idx = list.indexOf(slug);
    if (idx >= 0) list.splice(idx, 1); else list.push(slug);
    setRead(list); paintMark();
  });
}

/* ---------- 4. Code copy buttons ---------- */
document.querySelectorAll('.code-copy-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const codeEl = btn.parentElement?.querySelector('code') || btn.parentElement?.querySelector('pre code');
    if (!codeEl) return;
    const text = codeEl.textContent || '';
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✓ Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
    }).catch(() => { btn.textContent = 'Failed'; setTimeout(() => { btn.textContent = 'Copy'; }, 2000); });
  });
});

/* ---------- 5. Listen aloud (Web Speech API) ---------- */
const synth = window.speechSynthesis;
const startBtn = document.getElementById('listen-start') as HTMLButtonElement | null;
const bar = document.getElementById('listen-bar');
const playBtn = document.getElementById('tts-play') as HTMLButtonElement | null;
const stopBtn = document.getElementById('tts-stop') as HTMLButtonElement | null;
const statusEl = document.getElementById('tts-status');
const rateSel = document.getElementById('tts-rate') as HTMLSelectElement | null;
const voiceSel = document.getElementById('tts-voice') as HTMLSelectElement | null;
const iconPlay = document.getElementById('tts-icon-play');
const iconPause = document.getElementById('tts-icon-pause');

if (synth && startBtn && bar && playBtn && stopBtn && statusEl && rateSel && voiceSel && body) {
  type Chunk = { el: HTMLElement; text: string };
  let queue: Chunk[] = [];
  let pos = 0;
  let state: 'idle' | 'playing' | 'paused' = 'idle';
  let generation = 0;
  let voices: SpeechSynthesisVoice[] = [];

  function liText(li: Element): string {
    let t = '';
    li.childNodes.forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) t += n.textContent;
      else if (n.nodeType === Node.ELEMENT_NODE) { const el = n as Element; if (!/^(UL|OL)$/.test(el.tagName)) t += el.textContent; }
    });
    return t;
  }
  function collect(): Chunk[] {
    const chunks: Chunk[] = [];
    const els = body.querySelectorAll('h2, h3, p, li, blockquote');
    els.forEach((el) => {
      if (el.closest('pre, .listen-skip')) return;
      if (el.tagName === 'P' && el.closest('li, blockquote')) return;
      if (el.tagName === 'LI' && el.closest('blockquote')) return;
      if (el.tagName === 'LI' && el.parentElement && el.parentElement.closest('li')) return;
      const raw = el.tagName === 'LI' ? liText(el) : (el as HTMLElement).innerText || el.textContent || '';
      const text = raw.replace(/\s+/g, ' ').trim();
      if (!text) return;
      for (const c of chunkText(text)) chunks.push({ el: el as HTMLElement, text: c });
    });
    return chunks;
  }
  function chunkText(text: string): string[] {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const pieces: string[] = [];
    for (let s of sentences) {
      while (s.length > 240) { let cut = s.lastIndexOf(', ', 220); if (cut < 80) cut = s.lastIndexOf(' ', 220); if (cut < 80) cut = 220; pieces.push(s.slice(0, cut + 1)); s = s.slice(cut + 1).trim(); }
      if (s) pieces.push(s);
    }
    const out: string[] = [];
    for (const p of pieces) { const last = out[out.length - 1]; if (last && (last + ' ' + p).length <= 240) out[out.length - 1] = `${last} ${p}`; else out.push(p); }
    return out;
  }
  function loadVoices() {
    const all = synth.getVoices();
    voices = all.filter((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
    if (voices.length === 0) voices = all;
    if (!voiceSel) return;
    voiceSel.innerHTML = '';
    voices.forEach((v) => { const o = document.createElement('option'); o.value = v.voiceURI; o.textContent = `${v.name} (${v.lang})`; voiceSel.appendChild(o); });
    const saved = localStorage.getItem('unifiedbook-voice');
    if (saved && voices.some((v) => v.voiceURI === saved)) voiceSel.value = saved;
    else { const pick = voices.find((v) => /natural|neural|premium|enhanced/i.test(v.name)) || voices.find((v) => v.default) || voices[0]; if (pick) voiceSel.value = pick.voiceURI; }
  }
  loadVoices();
  synth.addEventListener('voiceschanged', loadVoices);
  voiceSel.addEventListener('change', () => { localStorage.setItem('unifiedbook-voice', voiceSel.value); if (state === 'playing') restartCurrent(); });
  const savedRate = localStorage.getItem('unifiedbook-rate');
  if (savedRate) rateSel.value = savedRate;
  rateSel.addEventListener('change', () => { localStorage.setItem('unifiedbook-rate', rateSel.value); if (state === 'playing') restartCurrent(); });

  function clearHighlight() { document.querySelectorAll('.tts-active').forEach((el) => el.classList.remove('tts-active')); }
  function highlight(el: HTMLElement) { clearHighlight(); el.classList.add('tts-active'); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  function paintPlayIcon() { if (iconPlay) iconPlay.style.display = state === 'playing' ? 'none' : ''; if (iconPause) iconPause.style.display = state === 'playing' ? '' : 'none'; playBtn.setAttribute('aria-label', state === 'playing' ? 'Pause' : 'Play'); }
  function setStatus(msg: string) { statusEl.textContent = msg; }
  function speakCurrent() {
    const myGen = generation;
    if (pos >= queue.length) { finish(); return; }
    const { el, text } = queue[pos];
    const u = new SpeechSynthesisUtterance(text);
    const v = voices.find((x) => x.voiceURI === voiceSel.value);
    if (v) u.voice = v;
    u.rate = parseFloat(rateSel.value || '1'); u.pitch = 1;
    u.onstart = () => { if (myGen !== generation) return; highlight(el); setStatus(`Reading — passage ${pos + 1} of ${queue.length}`); };
    u.onend = () => { if (myGen !== generation || state !== 'playing') return; pos += 1; speakCurrent(); };
    u.onerror = (e) => { if (myGen !== generation) return; if (e.error === 'interrupted' || e.error === 'canceled') return; pos += 1; speakCurrent(); };
    synth.speak(u);
  }
  function restartCurrent() { if (state !== 'playing') return; generation += 1; synth.cancel(); speakCurrent(); }
  function start() { generation += 1; synth.cancel(); queue = collect(); if (queue.length === 0) { setStatus('Nothing to read on this page'); return; } if (voices.length === 0) loadVoices(); if (voices.length === 0) { bar.classList.add('open'); paintPlayIcon(); setStatus('No speech voices found'); return; } pos = 0; state = 'playing'; bar.classList.add('open'); paintPlayIcon(); speakCurrent(); }
  function pause() { if (state !== 'playing') return; synth.pause(); state = 'paused'; paintPlayIcon(); setStatus('Paused'); }
  function resume() { if (state !== 'paused') return; state = 'playing'; paintPlayIcon(); setStatus(`Reading — passage ${pos + 1} of ${queue.length}`); synth.resume(); }
  function stop() { generation += 1; synth.cancel(); state = 'idle'; queue = []; pos = 0; clearHighlight(); bar.classList.remove('open'); paintPlayIcon(); }
  function finish() { state = 'idle'; queue = []; pos = 0; clearHighlight(); bar.classList.remove('open'); paintPlayIcon(); setStatus('Finished'); if (markBtn && markBtn.dataset.slug && !getRead().includes(markBtn.dataset.slug)) { const list = getRead(); list.push(markBtn.dataset.slug); setRead(list); paintMark(); } }
  startBtn.addEventListener('click', start);
  playBtn.addEventListener('click', () => { if (state === 'playing') pause(); else if (state === 'paused') resume(); else start(); });
  stopBtn.addEventListener('click', stop);
  window.addEventListener('beforeunload', () => synth.cancel());
} else if (startBtn) { startBtn.style.display = 'none'; }
