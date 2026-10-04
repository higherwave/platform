// ── Flow canvas: nodes + orthogonal SVG connectors ─────────────────
const { useRef, useEffect, useState } = React;

function geom(n) {
  if (n.type === "start") return { w: 108, h: 108 };
  if (n.type === "decision") return { w: 150, h: 150 };
  if (n.type === "screen") return { w: n.w, h: n.h };
  return { w: n.w || 200, h: 64 };
}
function box(n) { const g = geom(n); return { x: n.x, y: n.y, w: g.w, h: g.h, cx: n.x + g.w / 2, cy: n.y + g.h / 2 }; }

// Orthogonal connector between two node ids
function connector(nodes, from, to) {
  const a = box(nodes.find(n => n.id === from));
  const b = box(nodes.find(n => n.id === to));
  // Decision branch: horizontal exit from side vertex
  const fromDecision = nodes.find(n => n.id === from).type === "decision";
  if (fromDecision && Math.abs(b.cx - a.cx) > 40) {
    const sideY = a.cy;
    const sideX = b.cx < a.cx ? a.x : a.x + a.w; // left or right vertex
    const midX = b.cx;
    return `M ${sideX} ${sideY} H ${midX} V ${b.y}`;
  }
  const sy = a.y + a.h, ey = b.y;
  if (Math.abs(a.cx - b.cx) < 2) return `M ${a.cx} ${sy} V ${ey}`;
  const midY = sy + (ey - sy) / 2;
  return `M ${a.cx} ${sy} V ${midY} H ${b.cx} V ${ey}`;
}

function edgeLabelPos(nodes, e) {
  const a = box(nodes.find(n => n.id === e.from));
  const b = box(nodes.find(n => n.id === e.to));
  const fromDecision = nodes.find(n => n.id === e.from).type === "decision";
  if (fromDecision && Math.abs(b.cx - a.cx) > 40) {
    const sideX = b.cx < a.cx ? a.x : a.x + a.w;
    return { x: (sideX + b.cx) / 2, y: a.cy - 16 };
  }
  return { x: a.cx + 8, y: a.y + a.h + 14 };
}

function FlowCanvas({ subId, activeNode, playedNodes, onOpenScreen, devNodes, playhead, curEvent, autoZoom = true }) {
  const flow = SkanData.FLOWS[subId];
  const scrollRef = useRef(null);
  const activeRef = useRef(null);
  const [scale, setScale] = useState(1);

  // fit the canvas width to the available container
  useEffect(() => {
    const cont = scrollRef.current;
    if (!cont) return;
    const measure = () => {
      const w = cont.clientWidth;
      const next = Math.max(0.55, Math.min(1, (w - 40) / flow.canvas.w));
      setScale(prev => Math.abs(prev - next) < 0.005 ? prev : next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(cont);
    return () => ro.disconnect();
  }, [subId]);

  // auto-scroll active node into view (a playing screen card grows downward,
  // so anchor its top near the viewport top; otherwise center the node)
  useEffect(() => {
    const cont = scrollRef.current, el = activeRef.current;
    if (!cont || !el) return;
    const activeNodeDef = flow.nodes.find(n => n.id === activeNode);
    const isScreen = autoZoom && activeNodeDef && activeNodeDef.type === "screen";
    const top = isScreen
      ? el.offsetTop * scale - 32
      : el.offsetTop * scale - cont.clientHeight / 2 + (el.offsetHeight * scale) / 2;
    cont.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [activeNode, subId, scale, autoZoom]);

  return (
    <div className="flow-scroll" ref={scrollRef}>
      <div className="flow-fit" style={{ height: flow.canvas.h * scale }}>
      <div className="flow-canvas" style={{ width: flow.canvas.w, height: flow.canvas.h,
        transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center", left: "50%" }}>
        <svg className="flow-edges" width={flow.canvas.w} height={flow.canvas.h}>
          <defs>
            <marker id="arrow" markerWidth="9" markerHeight="9" refX="6.5" refY="4" orient="auto">
              <path d="M1 1 L7 4 L1 7" fill="none" stroke="#b6bcc6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </marker>
            <marker id="arrow-on" markerWidth="9" markerHeight="9" refX="6.5" refY="4" orient="auto">
              <path d="M1 1 L7 4 L1 7" fill="none" stroke="#4061e7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </marker>
          </defs>
          {flow.edges.map((e, i) => {
            const on = playedNodes.has(e.from) && (playedNodes.has(e.to) || e.to === activeNode);
            return (
              <path key={i} d={connector(flow.nodes, e.from, e.to)} fill="none"
                stroke={on ? "#4061e7" : "#cfd4dc"} strokeWidth={on ? 2 : 1.5}
                markerEnd={`url(#${on ? "arrow-on" : "arrow"})`}
                style={{ transition: "stroke .3s ease", opacity: on ? 1 : .9 }} />
            );
          })}
          {flow.edges.filter(e => e.label).map((e, i) => {
            const p = edgeLabelPos(flow.nodes, e);
            return <text key={"l"+i} x={p.x} y={p.y} className="edge-label">{e.label}</text>;
          })}
        </svg>

        {flow.nodes.map(n => {
          const isActive = n.id === activeNode;
          const isPlayed = playedNodes.has(n.id);
          const isDev = devNodes.has(n.id) || n.dev;
          const ref = isActive ? activeRef : null;
          const progress = n.type === "screen" ? SkanData.nodeProgress(subId, n.id, playhead) : 0;
          const nodeEvent = curEvent && curEvent.node === n.id ? curEvent : null;
          return (
            <FlowNode key={n.id} node={n} active={isActive} played={isPlayed}
              dev={isDev} nodeRef={ref} onOpenScreen={onOpenScreen}
              progress={progress} event={nodeEvent} playhead={playhead} autoZoom={autoZoom} />
          );
        })}
        </div>
      </div>
    </div>
  );
}

function FlowNode({ node, active, played, dev, nodeRef, onOpenScreen, progress, event, playhead, autoZoom }) {
  const g = geom(node);
  const base = { position: "absolute", left: node.x, top: node.y, width: g.w, height: g.h };
  const stateClass = `${active ? "fn-active" : ""} ${played && !active ? "fn-played" : ""} ${dev ? "fn-dev" : ""}`;

  if (node.type === "start" || node.type === "start2") {
    if (node.type === "start") {
      return (
        <div ref={nodeRef} className={`fnode fn-start ${stateClass}`} style={base}>
          <span>{node.label.split("\n").map((l,i)=><div key={i}>{l}</div>)}</span>
        </div>
      );
    }
    return (
      <div ref={nodeRef} className={`fnode fn-pill fn-startpill ${stateClass}`} style={base}>
        <span className="fn-startdot" /> <span>{node.label}</span>
      </div>
    );
  }

  if (node.type === "decision") {
    return (
      <div ref={nodeRef} className={`fnode fn-decision ${stateClass}`} style={base}>
        <div className="fn-diamond" />
        <div className="fn-decision-label">{node.label.split("\n").map((l,i)=><div key={i}>{l}</div>)}</div>
      </div>
    );
  }

  if (node.type === "screen") {
    return (
      <ScreenNode node={node} active={active} played={played} dev={dev} nodeRef={nodeRef}
        onOpenScreen={onOpenScreen} progress={progress} event={event} playhead={playhead} autoZoom={autoZoom} />
    );
  }

  // activity / end
  return (
    <div ref={nodeRef} className={`fnode fn-pill ${stateClass}`} style={base}>
      <span>{node.label}</span>
      {node.endDev || (node.type === "end" && dev)
        ? <span className="fn-enddot" /> : null}
      <span className="fn-underline" />
    </div>
  );
}

// ── Screen node: thumbnail that scales to a playing card when active ──
function ScreenNode({ node, active, played, dev, nodeRef, onOpenScreen, progress, event, playhead, autoZoom }) {
  const card = node.card;
  const zoomed = active && autoZoom;
  const scale = zoomed ? 2 : node.w / card.w;
  const stateClass = `${active ? "fn-active" : ""} ${played && !active ? "fn-played" : ""} ${dev ? "fn-dev" : ""}`;
  const pct = Math.round(progress * 100);
  return (
    <div ref={nodeRef} className={`fnode fn-screen ${zoomed ? "screen-open" : ""}`}
      style={{ position: "absolute", left: node.x, top: node.y, width: node.w, height: node.h, zIndex: zoomed ? 40 : 2 }}>
      <div className="screen-wrap" style={{ width: card.w, height: card.h, left: (node.w - card.w) / 2,
        transform: `scale(${scale})`, transformOrigin: "top center" }}>
        <div className={`screencard ${stateClass} ${active ? "sc-active" : ""}`}>
          <div className="sc-progress"><span style={{ width: `${pct}%` }} /></div>
          <div className="sc-head">
            <span className={`sc-playdot ${active ? "on" : ""}`} />
            <div className="sc-title">{node.label}</div>
            {dev && <span className="sc-devbadge">Insight</span>}
            {active && <span className="sc-time">{SkanData.fmt(playhead)}</span>}
          </div>
          <div className="sc-screen"><ScreenContent type={node.screenType} event={event} active={active} /></div>
          <div className="sc-ribbon" />
        </div>
      </div>
    </div>
  );
}

window.FlowCanvas = FlowCanvas;
