// ── ERP screen templates rendered inside playing flow nodes ─────────
// Each is authored at full card size; the flow node scales it down to a
// thumbnail when idle and up to 2× ("playing") when active.

function erpKeyword(label) {
  if (!label) return null;
  const l = label.toLowerCase();
  if (l.includes("invoice date")) return "Invoice date";
  if (l.includes("due date")) return "Posting Date";
  if (l.includes("total amount") || l.includes("amount")) return "Amount";
  if (l.includes("cost center")) return "cost-center";
  return null;
}

function SapInvoice({ mini, activeField }) {
  const hl = erpKeyword(activeField);
  const rows = [
    ["Vendor","100000"],["Invoice date","05/08/2024"],["Posting Date","05/08/2024"],
    ["Amount","1,250.00","USD"],["Tax amount","0.00","USD"],["Text","Office supplies"],["Paymt terms","Net 30"]
  ];
  return (
    <div className={`sap ${mini ? "sap-mini" : ""}`}>
      <div className="sap-bar">
        <span className="sap-back">‹</span>
        <span className="sap-logo">SAP</span>
        <span className="sap-bartitle">Create Vendor Invoice: Company Code 1000</span>
        <span className="sap-baricons"><Icon.Search s={13}/></span>
      </div>
      <div className="sap-toolbar">
        <span className="sap-menu">Menu ▾</span>
        <span className="sap-field" />
        {["Hold","Simulate","Park"].map(t=>(
          <span key={t} className="sap-tbtn">{t}</span>
        ))}
      </div>
      <div className="sap-tabs">
        {["Basic data","Payment","Details","Tax","Amount split","Notes"].map((t,i)=>(
          <span key={t} className={`sap-tab ${i===0?"on":""}`}>{t}</span>
        ))}
      </div>
      <div className="sap-body">
        <div className="sap-form">
          {rows.map(([l,v,x])=>(
            <div className={`sap-row ${hl===l ? "sap-row-active" : ""}`} key={l}>
              <span className="sap-label">{l}:</span>
              <span className="sap-input">{v}</span>
              {x && <span className="sap-suffix">{x}</span>}
            </div>
          ))}
        </div>
        <div className="sap-vendor">
          <div className="sap-vendor-h">Vendor</div>
          <div className="sap-vendor-card">
            ABC Supplies Ltd.<br/>456 Market Street<br/>Suite 300<br/>Boston MA 02109<br/>USA
          </div>
        </div>
      </div>
      <div className="sap-items">
        <span className="sap-items-h">Items (1) <b>Standard ▾</b></span>
        <div className="sap-table">
          <div className="sap-thead">
            {["#","G/L acct","Short Text","Qty","OUn","Amount","Tax","Cost Ctr"].map(h=><span key={h}>{h}</span>)}
          </div>
          <div className={`sap-trow ${hl==="cost-center" ? "sap-row-active" : ""}`}>
            {["1","400000","Office supplies","10","EA","1,250.00","V0","1000"].map((c,i)=><span key={i}>{c}</span>)}
          </div>
        </div>
      </div>
      <div className="sap-foot"><span className="sap-post">Post</span><span className="sap-cancel">Cancel</span></div>
    </div>
  );
}

// Shared lightweight ERP chrome for the secondary screens
function ErpFrame({ title, children, foot }) {
  return (
    <div className="erp">
      <div className="erp-bar"><span className="sap-logo">SAP</span><span className="erp-title">{title}</span><Icon.Search s={12}/></div>
      <div className="erp-body">{children}</div>
      {foot && <div className="erp-foot">{foot}</div>}
    </div>
  );
}

function MatchScreen({ dev }) {
  const rows = [
    ["Quantity", "10 EA", "10 EA", "12 EA", true],
    ["Unit price", "$125.00", "$125.00", "$125.00", false],
    ["Net amount", "$1,250.00", "$1,250.00", "$1,500.00", true],
    ["Tax", "$0.00", "$0.00", "$0.00", false],
  ];
  return (
    <ErpFrame title="Three-Way Match · PO #4500017"
      foot={<><span className="erp-warn"><Icon.Alert s={11}/> Quantity / amount mismatch — manual override applied</span><span className="erp-btn">Confirm</span></>}>
      <div className="mt-cols"><span/><span>Purchase Order</span><span>Goods Receipt</span><span>Invoice</span></div>
      {rows.map(([k, po, gr, inv, miss]) => (
        <div className={`mt-row ${miss ? "miss" : ""}`} key={k}>
          <span className="mt-key">{k}</span><span>{po}</span><span>{gr}</span>
          <span className="mt-inv">{inv}{miss && <i className="mt-flag" />}</span>
        </div>
      ))}
    </ErpFrame>
  );
}

function ApprovalScreen() {
  return (
    <ErpFrame title="Approval Workflow · INV-100000"
      foot={<><span className="erp-btn ghost">Reject</span><span className="erp-btn">Approve</span></>}>
      <div className="ap-amount"><span>Amount to approve</span><b>$1,250.00 USD</b></div>
      <div className="ap-chain">
        {[["AP","AP Specialist","done"],["TL","Team Lead","done"],["FC","Finance Ctrl.","active"]].map(([ini, role, st]) => (
          <div className={`ap-step ${st}`} key={role}>
            <span className="ap-av">{ini}</span>
            <span className="ap-role">{role}</span>
            <span className="ap-state">{st === "done" ? "Approved" : "Pending"}</span>
          </div>
        ))}
      </div>
      <div className="ap-note">Routed to Finance Controller · SLA 4h</div>
    </ErpFrame>
  );
}

function PostingScreen() {
  return (
    <ErpFrame title="Post Document · Company Code 1000"
      foot={<><span className="erp-tag ok">Posted · Doc 1900004421</span><span className="erp-btn">Display</span></>}>
      <div className="pg-doc"><span>Document type</span><b>KR · Vendor invoice</b></div>
      <div className="pg-table">
        <div className="pg-h"><span>Pos</span><span>G/L account</span><span>D/C</span><span>Amount</span></div>
        <div className="pg-r"><span>1</span><span>160000 Payables</span><span className="cr">Cr</span><span>1,250.00</span></div>
        <div className="pg-r"><span>2</span><span>400000 Expense</span><span className="dr">Dr</span><span>1,250.00</span></div>
        <div className="pg-bal"><span>Balance</span><b>0.00 — balanced</b></div>
      </div>
    </ErpFrame>
  );
}

function PaymentScreen() {
  return (
    <ErpFrame title="Payment Proposal · F110"
      foot={<><span className="erp-tag">Run date 06/12/2026</span><span className="erp-btn">Schedule</span></>}>
      <div className="pm-grid">
        <div><span>Vendor</span><b>ABC Supplies Ltd.</b></div>
        <div><span>Open amount</span><b>$1,250.00</b></div>
        <div><span>Payment method</span><b>T · Bank transfer</b></div>
        <div className="pm-edit"><span>Payment terms</span><b>14 days <i>(was 30)</i></b></div>
        <div><span>Due date</span><b>06/12/2026</b></div>
        <div><span>House bank</span><b>CITI · ****4021</b></div>
      </div>
    </ErpFrame>
  );
}

function PaymentRunScreen() {
  return (
    <ErpFrame title="Payment Run · F110 Batch 0612"
      foot={<><span className="erp-tag run">Running…</span><span className="erp-btn">Remittance</span></>}>
      <div className="pr-stat">
        <div><b>1</b><span>Invoices</span></div>
        <div><b>$1,250</b><span>Total</span></div>
        <div><b>CITI</b><span>House bank</span></div>
      </div>
      <div className="pr-steps">
        {[["Proposal created","done"],["Payment document posted","done"],["Bank file generated","active"],["Remittance advice sent","wait"]].map(([s, st]) => (
          <div className={`pr-step ${st}`} key={s}><span className="pr-dot" />{s}</div>
        ))}
      </div>
    </ErpFrame>
  );
}

function ScreenContent({ type, event, active }) {
  switch (type) {
    case "match":       return <MatchScreen />;
    case "approval":    return <ApprovalScreen />;
    case "posting":     return <PostingScreen />;
    case "payment":     return <PaymentScreen />;
    case "payment-run": return <PaymentRunScreen />;
    case "sap-invoice":
    default:            return <SapInvoice mini activeField={event && event.node === "screen" ? event.label : null} />;
  }
}

Object.assign(window, { SapInvoice, ScreenContent });
