// ── Event timeline (right rail) ─────────────────────────────────────
function Timeline({ playhead, activeSub, currentIdx, onSeek }) {
  const [expanded, setExpanded] = useState({ create: true });
  const scrollRef = useRef(null);
  const activeRef = useRef(null);

  // keep active sub expanded
  useEffect(() => {
    setExpanded(e => ({ ...e, [activeSub]: true }));
  }, [activeSub]);

  // auto-scroll current event into view
  useEffect(() => {
    const cont = scrollRef.current, el = activeRef.current;
    if (!cont || !el) return;
    const top = el.offsetTop - cont.clientHeight / 2 + el.offsetHeight / 2;
    cont.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [currentIdx, activeSub]);

  const groups = SkanData.SUBPROCESSES.map(sp => ({
    sp,
    events: SkanData.EVENTS.map((e, i) => ({ ...e, idx: i })).filter(e => e.sub === sp.id),
  }));

  return (
    <aside className="timeline">
      <div className="tl-head">
        <span className="tl-target"><Icon.Target s={22}/></span>
        <div>
          <div className="tl-title">Timeline</div>
          <div className="tl-sub">Invoice-to-Pay</div>
        </div>
      </div>

      <div className="tl-scroll" ref={scrollRef}>
        {groups.map(({ sp, events }) => {
          const isActiveSub = sp.id === activeSub;
          const open = !!expanded[sp.id];
          const done = playhead >= sp.end;
          const devCount = events.filter(e => e.dev).length;
          return (
            <div key={sp.id} className={`tl-group ${isActiveSub ? "tl-group-active" : ""}`}>
              <button className="tl-group-head" onClick={() => setExpanded(e => ({ ...e, [sp.id]: !e[sp.id] }))}>
                <span className={`tl-marker ${isActiveSub ? "on" : done ? "done" : ""}`}>
                  {isActiveSub ? <Icon.Target s={18}/> : <span className="tl-marker-dot" />}
                </span>
                <span className="tl-group-name">{sp.name}</span>
                {devCount > 0 && <span className="tl-devcount">{devCount}</span>}
                <span className="tl-group-chev"><Icon.Chevron s={15} deg={open ? 0 : -90}/></span>
              </button>

              {open && (
                <div className="tl-events">
                  {events.map(e => {
                    const isCurrent = e.idx === currentIdx;
                    const past = playhead >= e.t;
                    return (
                      <button key={e.idx} ref={isCurrent ? activeRef : null}
                        className={`tl-event ${isCurrent ? "current" : ""} ${e.dev ? "dev" : ""} ${past ? "past" : "future"}`}
                        onClick={() => onSeek(e.t, e.sub)}>
                        <span className="tl-rail"><span className="tl-rail-dot" /></span>
                        <span className="tl-event-body">
                          <span className="tl-time">{e.clock}</span>
                          <span className="tl-label">{e.label}</span>
                          {e.dev && <span className="tl-devtag"><Icon.Alert s={11}/> Insight</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

window.Timeline = Timeline;
