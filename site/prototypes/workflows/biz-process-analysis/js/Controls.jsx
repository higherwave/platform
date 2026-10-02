// ── Sub-process progress header (center top) ────────────────────────
function SubProcessBar({ playhead, activeSub, onSeekSub }) {
  return (
    <div className="subbar">
      {SkanData.SUBPROCESSES.map(sp => {
        const span = sp.end - sp.start;
        const pct = Math.max(0, Math.min(1, (playhead - sp.start) / span));
        const state = playhead >= sp.end ? "done" : sp.id === activeSub ? "active" : pct > 0 ? "active" : "future";
        return (
          <button key={sp.id} className={`subtab ${state}`} onClick={() => onSeekSub(sp)}>
            <span className="subtab-label">{sp.name}</span>
            <span className="subtab-track"><span className="subtab-fill" style={{ width: `${pct * 100}%` }} /></span>
          </button>
        );
      })}
    </div>
  );
}

// ── Transport / playback bar (center bottom) ────────────────────────
function TransportBar({ playhead, playing, onPlayPause, onSeek, onRestart, onSkip,
                        showPreviews, onTogglePreviews, pauseOnDev, onTogglePauseDev }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const TOTAL = SkanData.TOTAL;

  function seekFromEvent(clientX) {
    const r = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    onSeek(pct * TOTAL);
  }
  function down(e) { setDragging(true); seekFromEvent(e.clientX); e.preventDefault(); }
  useEffect(() => {
    if (!dragging) return;
    const move = e => seekFromEvent(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [dragging]);

  const pct = (playhead / TOTAL) * 100;

  return (
    <div className="transport">
      <div className="tp-left">
        <button className="tp-btn" onClick={onRestart} title="Restart"><Icon.Restart s={18}/></button>
        <button className="tp-play" onClick={onPlayPause} title={playing ? "Pause" : "Play"}>
          {playing ? <Icon.Pause s={20}/> : <Icon.Play s={20}/>}
        </button>
        <button className="tp-btn" onClick={onSkip} title="Skip to next event"><Icon.Skip s={18}/></button>
      </div>

      <div className="tp-scrub">
        <div className="tp-track" ref={trackRef} onPointerDown={down}>
          {/* sub-process segment dividers */}
          {SkanData.SUBPROCESSES.slice(1).map(sp => (
            <span key={sp.id} className="tp-divider" style={{ left: `${(sp.start / TOTAL) * 100}%` }} />
          ))}
          <span className="tp-fill" style={{ width: `${pct}%` }} />
          {/* deviation markers */}
          {SkanData.deviations().map((d, i) => (
            <span key={i} className="tp-dev" style={{ left: `${(d.t / TOTAL) * 100}%` }} title={`Insight · ${d.clock}`} />
          ))}
          <span className="tp-thumb" style={{ left: `${pct}%` }} />
        </div>
      </div>

      <div className="tp-time"><b>{SkanData.fmt(playhead)}</b> / {SkanData.fmt(TOTAL)}</div>

      <div className="tp-right">
        <button className={`tp-toggle ${showPreviews ? "on" : ""}`} aria-pressed={showPreviews} onClick={onTogglePreviews}>
          Show UI Previews
        </button>
        <button className={`tp-toggle ${pauseOnDev ? "on" : ""}`} aria-pressed={pauseOnDev} onClick={onTogglePauseDev}>
          Pause on Insights
        </button>
      </div>
    </div>
  );
}

window.SubProcessBar = SubProcessBar;
window.TransportBar = TransportBar;
