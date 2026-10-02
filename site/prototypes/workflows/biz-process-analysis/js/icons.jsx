// ── Inline SVG icons (stroke = currentColor) ────────────────────────
const Icon = {
  Dashboard: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||22} height={p.s||22} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/>
      <rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>
    </svg>
  ),
  Investigations: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||22} height={p.s||22} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/><path d="M11 8v6M8 11h6"/>
    </svg>
  ),
  Help: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||22} height={p.s||22} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><path d="M9.3 9.3a2.7 2.7 0 0 1 5.2 1c0 1.8-2.7 2.3-2.7 2.3"/><path d="M12 17h.01"/>
    </svg>
  ),
  Send: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5v13M6 10l5-5 5 5"/>
    </svg>
  ),
  Play: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||20} height={p.s||20} fill="currentColor"><path d="M7 4.5v15l12-7.5z"/></svg>
  ),
  Pause: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||20} height={p.s||20} fill="currentColor"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>
  ),
  Skip: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||20} height={p.s||20} fill="currentColor"><path d="M4 5v14l9-7zM13 5v14l9-7z"/></svg>
  ),
  SkipBack: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||20} height={p.s||20} fill="currentColor"><path d="M20 5v14l-9-7zM11 5v14l-9-7z"/></svg>
  ),
  Restart: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 2.6-6.3"/><path d="M3 4v4h4"/>
    </svg>
  ),
  Chevron: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||16} height={p.s||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:`rotate(${p.deg||0}deg)`, transition:"transform .18s ease"}}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  Target: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||22} height={p.s||22} fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg>
  ),
  Expand: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5"/>
    </svg>
  ),
  Close: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
  ),
  Sparkle: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||16} height={p.s||16} fill="currentColor"><path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6z"/><path d="M19 14l.8 2.4L22 17l-2.2.6L19 20l-.8-2.4L16 17l2.2-.6z"/></svg>
  ),
  Bolt: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||14} height={p.s||14} fill="currentColor"><path d="M13 2L4.5 13H11l-1 9 8.5-12H12z"/></svg>
  ),
  Alert: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||14} height={p.s||14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>
  ),
  Search: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>
  ),
  Clock: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||14} height={p.s||14} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
  ),
  Arrow: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||16} height={p.s||16} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  ),
  Mic: (p) => (
    <svg viewBox="0 0 24 24" width={p.s||18} height={p.s||18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>
  ),
};
window.Icon = Icon;
