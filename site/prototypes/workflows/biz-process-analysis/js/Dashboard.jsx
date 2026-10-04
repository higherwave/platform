// ── Dashboard + Investigations list (secondary views) ───────────────
const RUNS = [
  { id: "r1", name: "Tom Brinks", initials: "TB", role: "AP Specialist", process: "Procure-to-Pay (P2P)", variant: "Invoice-to-Pay", dur: "15:28", events: 24, dev: 5, date: "Jun 5, 2026", status: "Ready", open: true },
  { id: "r2", name: "Maya Chen", initials: "MC", role: "AP Specialist", process: "Procure-to-Pay (P2P)", variant: "Invoice-to-Pay", dur: "11:02", events: 19, dev: 1, date: "Jun 5, 2026", status: "Ready" },
  { id: "r3", name: "Diego Alvarez", initials: "DA", role: "Procurement", process: "Procure-to-Pay (P2P)", variant: "PO Creation", dur: "08:47", events: 16, dev: 3, date: "Jun 4, 2026", status: "Ready" },
  { id: "r4", name: "Priya Nair", initials: "PN", role: "AP Lead", process: "Order-to-Cash (O2C)", variant: "Cash Application", dur: "19:13", events: 31, dev: 0, date: "Jun 4, 2026", status: "Ready" },
  { id: "r5", name: "Sam Whitfield", initials: "SW", role: "Treasury", process: "Procure-to-Pay (P2P)", variant: "Payment Run", dur: "06:21", events: 12, dev: 2, date: "Jun 3, 2026", status: "Processing" },
  { id: "r6", name: "Lena Petrov", initials: "LP", role: "AP Specialist", process: "Procure-to-Pay (P2P)", variant: "Invoice-to-Pay", dur: "13:54", events: 27, dev: 4, date: "Jun 3, 2026", status: "Ready" },
];

const AV_COLORS = ["#4061e7", "#2e8a6f", "#c2603c", "#7a4ed6", "#b8472f", "#3a7bd0"];

function Avatar({ initials, i, size = 34 }) {
  return (
    <span className="avatar" style={{ width: size, height: size, background: AV_COLORS[i % AV_COLORS.length], fontSize: size * 0.4 }}>
      {initials}
    </span>
  );
}

function DashboardView({ onOpenRun }) {
  const stats = [
    { label: "Recordings captured", value: "1,240", sub: "Invoice-to-Pay", trend: "+8% wk" },
    { label: "Avg. cycle time", value: "12:41", sub: "per invoice", trend: "−3% wk" },
    { label: "Deviations found", value: "318", sub: "across all runs", trend: "26% of runs" },
    { label: "Automation potential", value: "73 hrs", sub: "saved / month", trend: "est." },
  ];
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Procure-to-Pay (P2P)</div>
          <h1 className="page-title">Process Dashboard</h1>
        </div>
      </div>
      <div className="stat-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-foot"><span className="stat-sub">{s.sub}</span><span className="stat-trend">{s.trend}</span></div>
          </div>
        ))}
      </div>
      <div className="dash-2col">
        <div className="panel">
          <div className="panel-head"><h3>Recent participant recordings</h3><span className="panel-link">View all</span></div>
          <div className="runlist">
            {RUNS.slice(0, 4).map((r, i) => (
              <button key={r.id} className="runrow" onClick={() => r.open && onOpenRun(r)} disabled={!r.open}>
                <Avatar initials={r.initials} i={i} />
                <span className="runrow-main">
                  <span className="runrow-name">{r.name}</span>
                  <span className="runrow-meta">{r.variant} · {r.dur}</span>
                </span>
                {r.dev > 0 && <span className="chip chip-dev"><Icon.Alert s={11}/> {r.dev}</span>}
                {r.open && <span className="runrow-open">Open <Icon.Arrow s={14}/></span>}
              </button>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h3>Top deviations</h3></div>
          <div className="devbars">
            {[["Manual 3-way match override", 82], ["Help drawer opened mid-task", 64], ["Approver re-assignment", 47], ["Payment terms edited", 39], ["Duplicate invoice search", 21]].map(([l, v], i) => (
              <div className="devbar" key={i}>
                <span className="devbar-label">{l}</span>
                <span className="devbar-track"><span className="devbar-fill" style={{ width: `${v}%` }} /></span>
                <span className="devbar-val">{v}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InvestigationsView({ onOpenRun }) {
  const [q, setQ] = useState("");
  const rows = RUNS.filter(r => (r.name + r.variant + r.process).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Procure-to-Pay (P2P)</div>
          <h1 className="page-title">Investigations</h1>
        </div>
        <div className="page-search">
          <Icon.Search s={17}/>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search participant or process…" />
        </div>
      </div>

      <div className="table">
        <div className="trow thead">
          <span>Participant</span><span>Process variant</span><span>Duration</span>
          <span>Events</span><span>Deviations</span><span>Captured</span><span></span>
        </div>
        {rows.map((r, i) => (
          <div className={`trow ${r.open ? "open-row" : ""}`} key={r.id}>
            <span className="td-part">
              <Avatar initials={r.initials} i={i} />
              <span><b>{r.name}</b><span className="td-role">{r.role}</span></span>
            </span>
            <span className="td-variant"><b>{r.variant}</b><span className="td-proc">{r.process}</span></span>
            <span className="td-mono">{r.dur}</span>
            <span className="td-mono">{r.events}</span>
            <span>{r.dev > 0 ? <span className="chip chip-dev"><Icon.Alert s={11}/> {r.dev}</span> : <span className="chip chip-clean">Clean</span>}</span>
            <span className="td-date">{r.date}</span>
            <span className="td-action">
              {r.status === "Processing"
                ? <span className="chip chip-proc">Processing…</span>
                : <button className="open-btn" onClick={() => onOpenRun(r)} disabled={!r.open}>{r.open ? "Investigate" : "Open"} <Icon.Arrow s={14}/></button>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

window.DashboardView = DashboardView;
window.InvestigationsView = InvestigationsView;
window.Avatar = Avatar;
