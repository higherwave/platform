// ── Skan.ai investigation data model ───────────────────────────────
// One participant recording: "Invoice-to-Pay" run by Tom Brinks.
// Total duration 15:28 (928s). Default playhead 5:07 (307s).

const TOTAL = 928;

// Helper to format mm:ss
function fmt(s) {
  s = Math.max(0, Math.round(s));
  const m = Math.floor(s / 60);
  const ss = String(s % 60).padStart(2, "0");
  return `${m}:${ss}`;
}

// ── Sub-processes (activities). Each owns a time span + a flow graph ──
const SUBPROCESSES = [
  { id: "create",  name: "Create Invoice Record", start: 0,   end: 360 },
  { id: "match",   name: "Match to Purchase Order", start: 360, end: 490 },
  { id: "approve", name: "Approve Invoice",        start: 490, end: 600 },
  { id: "post",    name: "Post to Ledger",         start: 600, end: 700 },
  { id: "schedule",name: "Schedule Payment",       start: 700, end: 812 },
  { id: "execute", name: "Execute Payment",        start: 812, end: 928 },
];

// ── Timeline events (chronological clickstream) ─────────────────────
// t = seconds offset · node = flow node it lights · dev = deviation
const EVENTS = [
  // Create Invoice Record
  { t: 12,  clock: "8:35 am", label: "Launched ERP Accounts Payable", sub: "create", node: "start" },
  { t: 55,  clock: "8:36 am", label: "Clicked Create New Invoice",     sub: "create", node: "decision" },
  { t: 95,  clock: "8:36 am", label: "Entered Invoice Date",           sub: "create", node: "screen" },
  { t: 140, clock: "8:36 am", label: "Opened help",                    sub: "create", node: "screen", dev: true, devNote: "Out-of-path: help drawer is not part of the standard invoice path." },
  { t: 165, clock: "8:36 am", label: "Closed help",                    sub: "create", node: "screen", dev: true, devNote: "Returned from help drawer after 25s." },
  { t: 205, clock: "8:37 am", label: "Entered due date",               sub: "create", node: "screen" },
  { t: 250, clock: "8:37 am", label: "Entered total amount",           sub: "create", node: "screen" },
  { t: 300, clock: "8:37 am", label: "Selected cost center",           sub: "create", node: "screen" },
  { t: 345, clock: "8:38 am", label: "Clicked Save",                   sub: "create", node: "next" },

  // Match to Purchase Order
  { t: 372, clock: "8:39 am", label: "Opened PO search",               sub: "match", node: "m_start" },
  { t: 405, clock: "8:39 am", label: "Searched PO #4500017",           sub: "match", node: "m_search" },
  { t: 432, clock: "8:40 am", label: "Manual 3-way match override",    sub: "match", node: "m_match", dev: true, devNote: "Quantity mismatch overridden manually instead of routing to exception queue." },
  { t: 470, clock: "8:41 am", label: "Confirmed line items",           sub: "match", node: "m_confirm" },

  // Approve Invoice
  { t: 505, clock: "8:42 am", label: "Routed for approval",            sub: "approve", node: "a_route" },
  { t: 548, clock: "8:43 am", label: "Re-assigned approver",           sub: "approve", node: "a_reassign", dev: true, devNote: "Approver re-assigned twice before sign-off — adds 41s of cycle time." },
  { t: 588, clock: "8:44 am", label: "Approval granted",               sub: "approve", node: "a_grant" },

  // Post to Ledger
  { t: 620, clock: "8:45 am", label: "Validated GL account",           sub: "post", node: "p_validate" },
  { t: 662, clock: "8:46 am", label: "Posted to ledger",               sub: "post", node: "p_post" },
  { t: 690, clock: "8:46 am", label: "Document #1900004421 created",   sub: "post", node: "p_doc" },

  // Schedule Payment
  { t: 720, clock: "8:47 am", label: "Opened payment proposal",        sub: "schedule", node: "s_open" },
  { t: 758, clock: "8:48 am", label: "Edited payment terms",           sub: "schedule", node: "s_terms", dev: true, devNote: "Payment terms changed from 30 to 14 days post-approval." },
  { t: 798, clock: "8:49 am", label: "Scheduled run 06/12",           sub: "schedule", node: "s_sched" },

  // Execute Payment
  { t: 836, clock: "8:50 am", label: "Initiated payment run",          sub: "execute", node: "e_run" },
  { t: 882, clock: "8:51 am", label: "Generated remittance advice",    sub: "execute", node: "e_remit" },
  { t: 918, clock: "8:52 am", label: "Process complete",               sub: "execute", node: "e_done" },
];

// ── Flow graphs per sub-process ─────────────────────────────────────
// node: { id, type, label, x, y, w?, h? }  · type: start|decision|activity|screen|end
// edge: { from, to, label?, dev? }
// Screen nodes render as a half-size thumbnail and scale to 2× their card when active.
const FLOWS = {
  create: {
    canvas: { w: 980, h: 1470 },
    nodes: [
      { id: "start",    type: "start",    label: "Start\nInvoice",          x: 436, y: 20 },
      { id: "decision", type: "decision", label: "Record\nAlready\nStarted?", x: 415, y: 170 },
      { id: "locate",   type: "activity", label: "Locate Record by Date",   x: 50,  y: 360, w: 200 },
      { id: "branchnext", type: "activity", label: "Next Activity",         x: 50,  y: 470, w: 200 },
      { id: "screen",   type: "screen",   label: "Create Invoice Record",   x: 380, y: 380, w: 220, h: 215, screenType: "sap-invoice", card: { w: 440, h: 430 } },
      { id: "next",     type: "activity", label: "Next Activity",           x: 398, y: 1280, w: 184 },
      { id: "next2",    type: "activity", label: "Next Activity",           x: 398, y: 1378, w: 184, endDev: true },
    ],
    edges: [
      { from: "start", to: "decision" },
      { from: "decision", to: "locate", label: "Yes" },
      { from: "locate", to: "branchnext" },
      { from: "decision", to: "screen", label: "No" },
      { from: "screen", to: "next" },
      { from: "next", to: "next2" },
    ],
  },
  match: chain([
    { id: "m_start",   label: "Open PO Search" },
    { id: "m_search",  label: "Search Purchase Order" },
    { id: "m_match",   label: "3-Way Match", dev: true, screen: true, screenType: "match" },
    { id: "m_confirm", label: "Confirm Line Items" },
  ]),
  approve: chain([
    { id: "a_route",    label: "Route for Approval", screen: true, screenType: "approval" },
    { id: "a_reassign", label: "Re-assign Approver", dev: true },
    { id: "a_grant",    label: "Approval Granted" },
  ]),
  post: chain([
    { id: "p_validate", label: "Validate GL Account" },
    { id: "p_post",     label: "Post to Ledger", screen: true, screenType: "posting" },
    { id: "p_doc",      label: "Ledger Document Created" },
  ]),
  schedule: chain([
    { id: "s_open",  label: "Open Payment Proposal", screen: true, screenType: "payment" },
    { id: "s_terms", label: "Edit Payment Terms", dev: true },
    { id: "s_sched", label: "Schedule Payment Run" },
  ]),
  execute: chain([
    { id: "e_run",   label: "Initiate Payment Run", screen: true, screenType: "payment-run" },
    { id: "e_remit", label: "Generate Remittance" },
    { id: "e_done",  label: "Process Complete", end: true },
  ]),
};

// Build a clean centered vertical flow. Pills are 260×64; screen nodes are
// 200×130 thumbnails that scale to 2× their 400×260 card when active.
function chain(items) {
  const W = 900, GAP = 80, SCREEN_GAP = 430, TOP = 48;
  let y = TOP;
  const nodes = items.map((it, i) => {
    const isScreen = !!it.screen;
    const w = isScreen ? 200 : 260;
    const h = isScreen ? 130 : 64;
    const node = {
      id: it.id,
      type: isScreen ? "screen" : (i === 0 ? "start2" : it.end ? "end" : "activity"),
      label: it.label,
      x: (W - w) / 2, y, w, h,
      dev: it.dev,
      screenType: it.screenType,
      card: isScreen ? { w: 400, h: 260 } : undefined,
    };
    y += h + (isScreen ? SCREEN_GAP : GAP);
    return node;
  });
  const edges = items.slice(1).map((it, i) => ({ from: items[i].id, to: it.id, dev: it.dev || items[i].dev }));
  return { canvas: { w: W, h: y + 24 }, nodes, edges };
}

// ── Assistant canned conversation ───────────────────────────────────
const SUGGESTIONS = [
  { id: "deviations", label: "List all insights with links" },
  { id: "automation", label: "List opportunities for automation with links" },
  { id: "history",    label: "How do I get to my chat history?" },
];

const ASSISTANT_ANSWERS = {
  deviations: {
    text: "I found 5 insights in Tom Brinks' Invoice-to-Pay run. Each link jumps the player to that moment:",
    links: [
      { t: 140, sub: "create",   label: "Opened help drawer", note: "8:36 am · out-of-path" },
      { t: 432, sub: "match",    label: "Manual 3-way match override", note: "8:40 am · control risk" },
      { t: 548, sub: "approve",  label: "Approver re-assigned twice", note: "8:43 am · +41s cycle time" },
      { t: 758, sub: "schedule", label: "Payment terms edited post-approval", note: "8:48 am · policy" },
    ],
    foot: "1 more low-severity insight hidden. Toggle “Pause on Insights” to auto-stop at each.",
  },
  automation: {
    text: "3 steps in this process are strong automation candidates based on repetition across 1,240 similar runs:",
    links: [
      { t: 405, sub: "match",    label: "PO search & 3-way match", note: "~92% rules-based · est. 2.1 min saved" },
      { t: 620, sub: "post",     label: "GL validation & posting", note: "~88% deterministic · est. 1.4 min saved" },
      { t: 836, sub: "execute",  label: "Payment run initiation", note: "~95% scheduled · est. 0.9 min saved" },
    ],
    foot: "Estimated 4.4 min saved per invoice — ~73 hrs/month at current volume.",
  },
  history: {
    text: "Your chat history lives in the left rail. Click the Investigations icon, then open any recording — every conversation is saved per participant run and synced to your workspace. You can also press ⌘K to search past threads.",
    links: [],
  },
};

window.SkanData = {
  TOTAL, fmt, SUBPROCESSES, EVENTS, FLOWS, SUGGESTIONS, ASSISTANT_ANSWERS,
  subFor(t) {
    return SUBPROCESSES.find(s => t >= s.start && t < s.end) || SUBPROCESSES[SUBPROCESSES.length - 1];
  },
  currentEventIndex(t) {
    let idx = -1;
    for (let i = 0; i < EVENTS.length; i++) { if (EVENTS[i].t <= t) idx = i; else break; }
    return idx;
  },
  deviations() { return EVENTS.filter(e => e.dev); },
  // Per-node time spans within a sub-process: a node is "playing" from its
  // first event until the next distinct node's first event (or sub end).
  nodeSegments(subId) {
    const sub = SUBPROCESSES.find(s => s.id === subId);
    const evs = EVENTS.filter(e => e.sub === subId);
    const order = [];
    const seg = {};
    evs.forEach(e => { if (!(e.node in seg)) { seg[e.node] = { start: e.t, end: sub.end }; order.push(e.node); } });
    order.forEach((nid, i) => { seg[nid].end = order[i + 1] ? seg[order[i + 1]].start : sub.end; });
    if (order.length) seg[order[0]].start = sub.start;
    return seg;
  },
  nodeProgress(subId, nodeId, t) {
    const seg = this.nodeSegments(subId)[nodeId];
    if (!seg) return 0;
    return Math.max(0, Math.min(1, (t - seg.start) / Math.max(1, seg.end - seg.start)));
  },
};
