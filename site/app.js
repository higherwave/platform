(() => {
  const PROTOS = window.PROTOS;
  const THUMBS = window.THUMBS || {};
  const SHOTS = window.SHOTS || {};
  const shot = p => SHOTS[p.id] || THUMBS[p.id];
  const TINTS = ['#fcab79', '#a8d8c4', '#f5e9d4', '#f4d35e', '#e0e2e6', '#d9a441'];
  const KEY = 'protoGallery.pinned';
  const PIN_PATH = '<path d="M10 1.5l4.5 4.5-2 1-2.5 2.5.5 3-1.5 1.5-3-3L2 15l4-4-3-3L4.5 6.5l3 .5L10 4.5l-1-2z"></path>';
  const pinSvg = s => `<svg width="${s}" height="${s}" viewBox="0 0 16 16" stroke-width="1.5" stroke-linejoin="round">${PIN_PATH}</svg>`;
  const extSvg = '<svg width="12" height="12" viewBox="0 0 12 12" stroke-width="1.5"><path d="M4.5 1.5h6v6M10.5 1.5L2 10"></path></svg>';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = id => document.getElementById(id);

  let filter = 'All';
  let pinned = [];
  try { const p = JSON.parse(localStorage.getItem(KEY) || '[]'); if (Array.isArray(p)) pinned = p; } catch (e) {}

  const tint = p => TINTS[PROTOS.indexOf(p) % TINTS.length];
  const thumbHtml = p => THUMBS[p.id] ? `<img src="${THUMBS[p.id]}" alt="" loading="lazy">` : '';

  function card(p) {
    const on = pinned.includes(p.id);
    return `<a class="card" href="#p=${encodeURIComponent(p.id)}">
      <div class="thumb" style="background:${tint(p)}">${thumbHtml(p)}
        <button class="pin${on ? ' on' : ''}" data-pin="${p.id}" aria-label="${on ? 'Unpin' : 'Pin'}" title="${on ? 'Unpin' : 'Pin to top'}">${pinSvg(16)}</button>
      </div>
      <div class="card-text">
        <span class="eyebrow">${esc(p.category)}</span>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.description)}</p>
      </div>
    </a>`;
  }

  function renderGallery() {
    const cats = [...new Set(PROTOS.map(p => p.category))];
    const pinnedItems = pinned.map(id => PROTOS.find(p => p.id === id)).filter(Boolean);
    const items = PROTOS.filter(p => !pinned.includes(p.id) && (filter === 'All' || p.category === filter));
    $('pinned-section').hidden = pinnedItems.length === 0;
    $('pinned-count').textContent = pinnedItems.length || '';
    $('pinned-grid').innerHTML = pinnedItems.map(card).join('');
    $('filters').innerHTML = ['All', ...cats].map(c => {
      const n = c === 'All' ? PROTOS.length : PROTOS.filter(p => p.category === c).length;
      return `<button class="chip" role="tab" data-filter="${esc(c)}" aria-selected="${c === filter}">${esc(c)}<span>${n}</span></button>`;
    }).join('');
    $('grid-title').textContent = filter === 'All' ? 'All prototypes' : filter;
    $('grid-count').textContent = items.length;
    $('grid-empty').hidden = items.length > 0;
    $('grid').innerHTML = items.map(card).join('');
  }

  function renderDetail(p) {
    const on = pinned.includes(p.id);
    const list = a => (a || []).map(x => `<li>${esc(x)}</li>`).join('');
    $('detail').innerHTML = `
      <a class="back" href="#"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 2L4 7l5 5"></path></svg>${esc(filter === 'All' ? 'All prototypes' : filter)}</a>
      <div class="detail-head">
        <div class="detail-title">
          <span class="eyebrow">${esc(p.category)}</span>
          <h1>${esc(p.title)}</h1>
          <p>${esc(p.description)}</p>
        </div>
        <div class="actions">
          <button class="btn${on ? ' on' : ''}" data-pin="${p.id}">${pinSvg(14)}${on ? 'Pinned' : 'Pin'}</button>
          <button class="btn primary" data-open="${p.id}">${p.url ? 'Open prototype' : 'Prototype coming soon'}${extSvg}</button>
        </div>
      </div>
      <div class="meta">
        <section class="panel"><h2>Why it's useful</h2><p>${esc(p.why || '')}</p></section>
        <section class="panel"><h2>Usability principles</h2><ul>${list(p.principles)}</ul></section>
        <section class="panel ext"><h2>Ways to extend</h2><ul>${list(p.extensions)}</ul></section>
      </div>
      <div class="shot${shot(p) ? '' : ' placeholder'}" style="background:${tint(p)}">${shot(p) ? `<img src="${shot(p)}" alt="${esc(p.title)} screenshot">` : ''}</div>`;
  }

  function route() {
    const cases = location.hash === '#cases';
    const training = location.hash === '#training';
    const m = location.hash.match(/^#p=(.+)$/);
    const p = !cases && !training && m && PROTOS.find(x => x.id === decodeURIComponent(m[1]));
    const tog = (id, cls, on) => { const el = $(id); if (el) el.classList.toggle(cls, on); };
    const hide = (id, h) => { const el = $(id); if (el) el.hidden = h; };
    tog('tab-patterns', 'on', !cases && !training);
    tog('tab-cases', 'on', cases);
    tog('tab-training', 'on', training);
    hide('cases', !cases);
    hide('training', !training);
    hide('gallery', cases || training || !!p);
    hide('detail', cases || training || !p);
    if (training) {
      const f = document.querySelector('.training-frame');
      if (f && !f.src) f.src = 'training/onboarding/index.html';
      document.title = 'Product Training · Knowledge Base';
    }
    else if (cases) { window.renderCases($('cases')); document.title = 'Case Studies · Knowledge Base'; }
    else if (p) { renderDetail(p); document.title = `${p.title} · Knowledge Base`; }
    else { renderGallery(); document.title = 'Patterns and Prototypes · Knowledge Base'; }
  }

  let toastT;
  function toast(msg) {
    const t = $('toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2400);
  }

  document.addEventListener('click', e => {
    const pin = e.target.closest('[data-pin]');
    if (pin) {
      e.preventDefault(); e.stopPropagation();
      const id = pin.dataset.pin;
      pinned = pinned.includes(id) ? pinned.filter(x => x !== id) : [...pinned, id];
      try { localStorage.setItem(KEY, JSON.stringify(pinned)); } catch (err) {}
      route(); return;
    }
    const f = e.target.closest('[data-filter]');
    if (f) { filter = f.dataset.filter; renderGallery(); return; }
    const o = e.target.closest('[data-open]');
    if (o) {
      const p = PROTOS.find(x => x.id === o.dataset.open);
      if (p.url) window.open(p.url, '_blank', 'noopener'); else toast(`“${p.title}” is coming soon.`);
    }
  });
  window.addEventListener('hashchange', () => { route(); window.scrollTo(0, 0); });

  route();
})();
