// ── AI assistant panel ──────────────────────────────────────────────
function Assistant({ onSeek, onRunEndToEnd }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  function ask(suggestionId, customText) {
    const userText = customText || SkanData.SUGGESTIONS.find(s => s.id === suggestionId)?.label || "";
    const answer = ASSISTANT_ANSWERS[suggestionId] || {
      text: "I can help you investigate this run. Try one of the prompts below, or ask about insights, cycle time, or automation opportunities.",
      links: [],
    };
    setMessages(m => [...m, { role: "user", text: userText }]);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages(m => [...m, { role: "ai", ...answer }]);
    }, 650);
  }

  function submit(e) {
    e.preventDefault();
    const v = input.trim();
    if (!v) return;
    const lc = v.toLowerCase();
    let id = "fallback";
    if (lc.includes("insight") || lc.includes("deviation")) id = "deviations";
    else if (lc.includes("autom")) id = "automation";
    else if (lc.includes("history") || lc.includes("chat")) id = "history";
    setInput("");
    ask(id, v);
  }

  const empty = messages.length === 0 && !thinking;

  return (
    <aside className="assistant">
      <div className="assist-head">
        <div className="assist-empty-icon"><Icon.Sparkle s={22}/></div>
        <span className="assist-badge"><Icon.Sparkle s={13}/> AI</span>
      </div>

      <div className="assist-body" ref={bodyRef}>
        {empty && (
          <div className="assist-empty">
          </div>
        )}
        {messages.map((m, i) => (
          <Message key={i} m={m} onSeek={onSeek} />
        ))}
        {thinking && (
          <div className="msg msg-ai">
            <div className="msg-avatar"><Icon.Sparkle s={13}/></div>
            <div className="msg-bubble typing"><span/><span/><span/></div>
          </div>
        )}
      </div>

      <div className="assist-suggestions">
        {SkanData.SUGGESTIONS.map(s => (
          <button key={s.id} className="suggest" onClick={() => ask(s.id)}>{s.label}</button>
        ))}
        <button className="run-e2e" onClick={onRunEndToEnd}>
          <Icon.Play s={16}/> Run process end-to-end
        </button>
      </div>

      <form className="assist-input" onSubmit={submit}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter a reply" />
        <button type="submit" className="assist-send" aria-label="Send"><Icon.Send s={18}/></button>
        <button type="button" className="assist-voice" aria-label="Voice input"><Icon.Mic s={18}/></button>
      </form>
    </aside>
  );
}

function Message({ m, onSeek }) {
  if (m.role === "user") {
    return <div className="msg msg-user"><div className="msg-bubble">{m.text}</div></div>;
  }
  return (
    <div className="msg msg-ai">
      <div className="msg-avatar"><Icon.Sparkle s={13}/></div>
      <div className="msg-bubble">
        <p className="msg-text">{m.text}</p>
        {m.links && m.links.length > 0 && (
          <div className="msg-links">
            {m.links.map((lk, i) => (
              <button key={i} className="msg-link" onClick={() => onSeek(lk.t, lk.sub)}>
                <span className="msg-link-icon">{lk.note && lk.note.match(/risk|path|policy|cycle/) ? <Icon.Alert s={13}/> : <Icon.Bolt s={13}/>}</span>
                <span className="msg-link-main">
                  <span className="msg-link-label">{lk.label}</span>
                  <span className="msg-link-note">{lk.note}</span>
                </span>
                <span className="msg-link-jump">{SkanData.fmt(lk.t)} <Icon.Arrow s={14}/></span>
              </button>
            ))}
          </div>
        )}
        {m.foot && <p className="msg-foot">{m.foot}</p>}
      </div>
    </div>
  );
}

window.Assistant = Assistant;
