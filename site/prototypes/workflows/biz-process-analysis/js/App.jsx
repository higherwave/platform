// ── Root app: header, nav, view routing, playback engine ────────────
function App() {
  const [view, setView] = useState("player"); // player | investigations | dashboard
  const [playhead, setPlayhead] = useState(0); // default: start
  const [playing, setPlaying] = useState(false);
  const [pauseOnDev, setPauseOnDev] = useState(true);
  const [showPreviews, setShowPreviews] = useState(true);
  const [devFlash, setDevFlash] = useState(null);

  const headRef = useRef(playhead);
  headRef.current = playhead;
  const rafRef = useRef(0);

  // playback loop (interval-based for reliability)
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      const cur = headRef.current;
      let next = cur + dt * 6; // 6× playback speed
      // deviation pause: stop at first deviation crossed
      if (pauseOnDev) {
        const crossed = SkanData.deviations().find(d => d.t > cur && d.t <= next);
        if (crossed) {
          headRef.current = crossed.t;
          setPlayhead(crossed.t);
          setPlaying(false);
          setDevFlash(crossed.t);
          setTimeout(() => setDevFlash(null), 1600);
          return;
        }
      }
      if (next >= SkanData.TOTAL) {
        headRef.current = SkanData.TOTAL;
        setPlayhead(SkanData.TOTAL);
        setPlaying(false);
        return;
      }
      headRef.current = next;
      setPlayhead(next);
    }, 40);
    return () => clearInterval(id);
  }, [playing, pauseOnDev]);

  // derived
  const activeSub = SkanData.subFor(playhead).id;
  const currentIdx = SkanData.currentEventIndex(playhead);
  const curEvent = currentIdx >= 0 ? SkanData.EVENTS[currentIdx] : null;
  const flow = SkanData.FLOWS[activeSub];

  const playedNodes = new Set();
  const devNodes = new Set();
  SkanData.EVENTS.forEach(e => {
    if (e.sub === activeSub && e.t <= playhead) { playedNodes.add(e.node); if (e.dev) devNodes.add(e.node); }
  });
  let activeNode = curEvent && curEvent.sub === activeSub ? curEvent.node : flow.nodes[0].id;
  playedNodes.add(activeNode);

  function seek(t, sub) {
    headRef.current = t;
    setPlayhead(t);
    if (view !== "player") setView("player");
  }
  function seekSub(sp) { seek(sp.start + 1, sp.id); }
  function skipNext() {
    const nxt = SkanData.EVENTS.find(e => e.t > playhead);
    seek(nxt ? nxt.t : SkanData.TOTAL);
  }
  function runEndToEnd() { seek(0); setPlaying(true); }
  function openRun() { setView("player"); }

  return (
    <div className="app">
      <Header view={view} />
      <div className="app-main">
        <SideNav view={view} setView={setView} />

        {view === "player" ? (
          <React.Fragment>
            <Assistant onSeek={seek} onRunEndToEnd={runEndToEnd} />

            <main className="stage">
              <SubProcessBar playhead={playhead} activeSub={activeSub} onSeekSub={seekSub} />

              <div className="stage-flow">
                <FlowCanvas subId={activeSub} activeNode={activeNode} playedNodes={playedNodes}
                  devNodes={devNodes} playhead={playhead} curEvent={curEvent}
                  autoZoom={showPreviews} />
                {devFlash !== null && (
                  <div className="dev-toast"><Icon.Alert s={16}/> Paused on insight · {SkanData.fmt(devFlash)}</div>
                )}
              </div>

              <TransportBar
                playhead={playhead} playing={playing}
                onPlayPause={() => { if (playhead >= SkanData.TOTAL) seek(0); setPlaying(p => !p); }}
                onSeek={seek} onRestart={() => { seek(0); setPlaying(false); }} onSkip={skipNext}
                showPreviews={showPreviews} onTogglePreviews={() => setShowPreviews(s => !s)}
                pauseOnDev={pauseOnDev} onTogglePauseDev={() => setPauseOnDev(p => !p)} />
            </main>

            <Timeline playhead={playhead} activeSub={activeSub} currentIdx={currentIdx} onSeek={seek} />
          </React.Fragment>
        ) : view === "investigations" ? (
          <ScrollArea><InvestigationsView onOpenRun={openRun} /></ScrollArea>
        ) : (
          <ScrollArea><DashboardView onOpenRun={openRun} /></ScrollArea>
        )}
      </div>
    </div>
  );
}

function ScrollArea({ children }) {
  return <div className="scroll-area">{children}</div>;
}

function Header({ view }) {
  return (
    <header className="appbar">
      <div className="appbar-left">
        <img className="appbar-logo" src={(window.__resources && window.__resources.skanLogo) || "assets/skan-logo.png"} alt="Skan AI" />
        <span className="appbar-divider" />
        <span className="appbar-process">Procure-to-Pay (P2P)</span>
      </div>
      {view === "player" && (
        <label className="appbar-center appbar-search"><Icon.Search s={15}/><input type="search" placeholder="Search" aria-label="Search" /></label>
      )}
      <div className="appbar-right">
        <button className="appbar-icon" title="Help"><Icon.Help s={22}/></button>
        <span className="appbar-vsep" />
        <Avatar initials="AR" i={0} size={32} />
      </div>
    </header>
  );
}

function SideNav({ view, setView }) {
  const items = [
    { id: "dashboard", icon: Icon.Dashboard, label: "Dashboard" },
    { id: "investigations", icon: Icon.Investigations, label: "Investigate" },
  ];
  const activeId = view === "player" ? "investigations" : view;
  return (
    <nav className="sidenav">
      {items.map(it => {
        const I = it.icon;
        const active = activeId === it.id;
        return (
          <button key={it.id} className={`navitem ${active ? "on" : ""}`} onClick={() => setView(it.id)}>
            <span className="navitem-icon"><I s={22}/></span>
            <span className="navitem-label">{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ── Full SAP UI preview modal (Prototype 2) ─────────────────────────
function PreviewModal({ onClose, sub }) {
  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={e => e.stopPropagation()}>
        <div className="preview-head">
          <span className="preview-title">Create Invoice Record</span>
          <span className="sc-devbadge">Insights</span>
          <button className="preview-close" onClick={onClose}><Icon.Close s={20}/></button>
        </div>
        <div className="preview-body">
          <SapInvoice />
        </div>
        <div className="preview-ribbon" />
      </div>
    </div>
  );
}

window.App = App;
