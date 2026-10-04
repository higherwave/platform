// ── Step insights panel (v2 right rail): replaces click-level timeline ──
const STEP_INSIGHTS = {
  create: {
    summary: "Captures the vendor invoice in SAP: date, due date, amount, and cost center, then saves the record.",
    recs: [
      { kind: "Automation", text: "Pre-fill header fields from the PDF invoice with OCR. Date, amount and vendor are typed manually today.", t: 95 },
      { kind: "Improvement", text: "Add inline guidance for the date fields. The participant opened help for 25s mid-entry.", t: 140 },
    ],
  },
  match: {
    summary: "Finds the purchase order and checks invoice, PO and goods receipt agree on quantity and price.",
    recs: [
      { kind: "Compliance", text: "Route quantity mismatches to the exception queue instead of allowing a manual override.", t: 432 },
      { kind: "Automation", text: "Auto-match within tolerance. About 92% of matches in similar runs are rules-based.", t: 405 },
    ],
  },
  approve: {
    summary: "Sends the invoice to the right approver and records sign-off before it can post.",
    recs: [
      { kind: "Improvement", text: "Assign the approver from cost center and amount rules. Two re-assignments added 41s here.", t: 548 },
    ],
  },
  post: {
    summary: "Validates the G/L account and posts the balanced entry, creating the accounting document.",
    recs: [
      { kind: "Automation", text: "Post automatically once validation passes. The step is ~88% deterministic.", t: 620 },
    ],
  },
  schedule: {
    summary: "Adds the invoice to a payment proposal and sets terms and the run date.",
    recs: [
      { kind: "Compliance", text: "Lock payment terms after approval. Terms were changed from 30 to 14 days.", t: 758 },
    ],
  },
  execute: {
    summary: "Runs the payment batch, generates the bank file and sends remittance advice.",
    recs: [],
  },
};

function InsightsPanel({ playhead, activeSub, onSeek }) {
  const scrollRef = useRef(null);
  const activeRef = useRef(null);
  const [open, setOpen] = useState({});

  useEffect(() => {
    const cont = scrollRef.current, el = activeRef.current;
    setOpen({});
    if (!cont || !el) return;
    cont.scrollTo({ top: Math.max(0, el.offsetTop - 12), behavior: "smooth" });
  }, [activeSub]);

  return (
    <aside className="timeline" aria-label="Step insights">
      <div className="tl-head">
        <span className="tl-target"><Icon.Target s={22}/></span>
        <div>
          <div className="tl-title">Steps &amp; insights</div>
          <div className="tl-sub">Invoice-to-Pay</div>
        </div>
      </div>
      <div className="tl-scroll" ref={scrollRef}>
        {SkanData.SUBPROCESSES.map((sp, i) => {
          const info = STEP_INSIGHTS[sp.id];
          const isActive = sp.id === activeSub;
          const done = playhead >= sp.end;
          const expanded = open[sp.id] !== undefined ? open[sp.id] : isActive;
          const dur = SkanData.fmt(sp.end - sp.start);
          const devs = SkanData.EVENTS.filter(e => e.sub === sp.id && e.dev).length;
          return (
            <div key={sp.id} ref={isActive ? activeRef : null}
              className={`ins-step ${isActive ? "on" : ""} ${done ? "done" : ""}`}>
              <div className="ins-head">
                <button className="ins-title" onClick={() => onSeek(sp.start + 1, sp.id)}>
                  <span className="ins-num">{done ? "✓" : i + 1}</span>
                  <span className="ins-name">{sp.name}</span>
                </button>
                <button className="ins-chev" aria-label={expanded ? "Collapse" : "Expand"}
                  onClick={() => setOpen(o => ({ ...o, [sp.id]: !expanded }))}>
                  <Icon.Chevron s={15} deg={expanded ? 0 : -90}/>
                </button>
              </div>
              <div className="ins-meta">
                <span><Icon.Clock s={12}/> {dur}</span>
                {devs > 0 && <span className="ins-dev"><Icon.Alert s={11}/> {devs} insight{devs > 1 ? "s" : ""}</span>}
              </div>
              {expanded && (
                <div className="ins-body">
                  <p className="ins-summary">{info.summary}</p>
                  {info.recs.length > 0 ? (
                    <div className="ins-recs">
                      {info.recs.map((r, k) => (
                        <button key={k} className="ins-rec" onClick={() => onSeek(r.t, sp.id)}>
                          <span className={`ins-kind k-${r.kind.toLowerCase()}`}>{r.kind}</span>
                          <span className="ins-rec-text">{r.text}</span>
                          <span className="ins-rec-jump">{SkanData.fmt(r.t)} <Icon.Arrow s={12}/></span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="ins-none">No recommendations for this step.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

window.Timeline = InsightsPanel;
