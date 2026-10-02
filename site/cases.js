(() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function CIO_VALS(props) {
    const showInferred = props.showInferred ?? true;
    const tag = (i) => i.t
      ? { ...i, label: i.t, bs: 'solid', bc: '#181d26', tc: '#181d26' }
      : { ...i, label: 'Inferred', bs: 'dashed', bc: '#9297a0', tc: '#41454d' };
    const keep = (arr) => arr.filter(i => showInferred || i.t).map(tag);
    const M = 'Manu';
    const stages = [
      { phase: '01 · Trigger', name: 'Pressure to "do something with AI"',
        goal: 'Respond to demand for AI across every team without fragmenting the stack or the data.',
        actions: ['Field AI requests by team, use case and vertical', 'Ask what each means for app stack, data flow and access', 'Balance business transformation with own-team transformation'],
        quote: 'Everybody wants AI for their specific use case, their specific team, their specific vertical.', quoteBy: M, quoteT: '1:07',
        feeling: 'Pressured',
        pains: [
          { text: 'Tools get spun up or evaluated without the right context or integrations, so they underdeliver.', t: '1:43' },
          { text: 'Giving tools full context spreads data across many organizations and cloud environments.', t: '1:49' },
          { text: 'Dual mandate: transform the business and IT’s own teams at the same time.', t: '2:04' },
          { text: 'No single intake for AI requests; shadow tools appear before IT can assess them.' }
        ],
        opps: [
          { text: 'Position Whirl as one governed context layer that many use cases share, reducing tool sprawl.' },
          { text: 'Give CIOs an AI request triage template tied to data classification.' }
        ] },
      { phase: '02 · Evaluate', name: 'Build vs. buy',
        goal: 'Decide whether an engineering-forward team should build internally or trust a startup with core systems.',
        actions: ['Scope the core functionality', 'Add integrations, granular RBAC, security, governance, compliance', 'Weigh the cost to the enterprise apps team’s focus'],
        quote: 'A real product beats a side project for something this critical.', quoteBy: M, quoteT: '3:54',
        feeling: 'Skeptical',
        pains: [
          { text: 'An 80–90% solution looks easy; enterprise requirements become the majority of the build.', t: '2:58' },
          { text: 'Building pulls the enterprise apps team off its core job and turns tooling into a side project.', t: '3:44' },
          { text: 'Internal pressure to justify trusting a small startup with access to core systems.', t: '2:33' },
          { text: 'Startup viability and long-term support risk are hard to price into the decision.' }
        ],
        opps: [
          { text: 'Build-vs-buy worksheet that surfaces the hidden 10–20% (RBAC, compliance, integrations).' },
          { text: 'Vendor-risk pack: roadmap, support model, data exit plan.' }
        ] },
      { phase: '03 · Evaluate', name: 'Security & compliance review',
        goal: 'Confirm the platform meets GitLab’s bar before it touches sensitive enterprise data.',
        actions: ['Classify data sensitivity with internal policy', 'Apply control rubric by sensitivity', 'Require zero retention, no model training, data isolation', 'Hold vendor to internal auth, MFA, endpoint standards'],
        quote: 'Our data should stay our data, not become part of a broader product.', quoteBy: M, quoteT: '5:21',
        feeling: 'Cautious',
        pains: [
          { text: 'For many CIOs, pointing AI at a core system is where the conversation stops.', t: '4:15' },
          { text: 'Every AI tool touching data needs a clear, repeatable set of principles.', t: '4:40' },
          { text: 'Breach blast radius is a live concern; isolation is required, not optional.', t: '5:30' },
          { text: 'Evidence gathering (questionnaires, reports, control mapping) is manual and slow.' }
        ],
        opps: [
          { text: 'Trust kit pre-mapped to common data classification rubrics.' },
          { text: 'Lead with zero retention, no training and tenancy options in the first call, not the last.' }
        ] },
      { phase: '04 · Adopt', name: 'Deploy & build context',
        goal: 'Connect Whirl to Salesforce and core systems with the right access, and get teams using it.',
        actions: ['Connect Salesforce org and GitLab source control', 'Configure role-based access', 'Onboard Salesforce devs, BSAs and process owners'],
        quote: 'Even though we use GitLab for source control, you don’t see everything living on the platform itself.', quoteBy: M, quoteT: '8:12',
        feeling: 'Hopeful',
        pains: [
          { text: 'New CIO stepped into an existing partnership and had to get up to speed on its value.', t: '0:24' },
          { text: 'Time between connecting systems and the first useful insight is unclear.' },
          { text: 'Mapping platform permissions to existing roles adds setup friction.' },
          { text: 'Three distinct personas need different onboarding paths.' }
        ],
        opps: [
          { text: 'Executive handover pack when a sponsor changes: usage, wins, risks.' },
          { text: 'Guided first-insight flow per persona, measured as time-to-value.' }
        ] },
      { phase: '05 · Prove', name: 'Measure productivity',
        goal: 'Show early ROI through faster delivery.',
        actions: ['Track cycle time for programs, projects and incident response', 'Compare weeks-to-days-to-hours'],
        quote: 'That increased efficiency is really the first step toward ROI.', quoteBy: M, quoteT: '7:05',
        feeling: 'Encouraged',
        pains: [
          { text: 'AI ROI is still "the million-dollar question".', t: '6:31' },
          { text: 'Time-savings claims are table stakes; most vendors say the same.', t: '7:13' },
          { text: 'No pre-deployment baseline makes before/after comparisons anecdotal.' }
        ],
        opps: [
          { text: 'Built-in impact reporting with baselines captured at onboarding.' },
          { text: 'Report by persona: Salesforce devs, BSAs, process owners.' }
        ] },
      { phase: '06 · Expand', name: 'Unlock work that wasn’t possible',
        goal: 'Tackle a decade of Salesforce tech debt that was too daunting to attempt.',
        actions: ['Map dependencies across objects, custom code, metadata, formula fields', 'Plan refactoring and modernization', 'Replace trial and error in dev environments'],
        quote: 'We used to rely on tribal knowledge and trial and error in dev environments. Now we can unpack that in minutes.', quoteBy: M, quoteT: '9:00',
        feeling: 'Empowered',
        pains: [
          { text: 'Decade-old Salesforce instance with heavy tech debt and a much larger company around it.', t: '7:45' },
          { text: 'Hidden references and formula fields aren’t visible in source control.', t: '8:12' },
          { text: 'Knowledge lived in people’s heads and was rediscovered by trial and error.', t: '9:00' }
        ],
        opps: [
          { text: 'Name "work unlocked" as its own ROI category alongside hours saved.', t: '7:27' },
          { text: 'Extend dependency mapping to other GTM systems beyond Salesforce.' },
          { text: 'Modernization playbooks built on the dependency map.' }
        ] },
      { phase: '07 · Advocate', name: 'Scale & advocate',
        goal: 'Give GTM and revenue teams reliable, scalable systems and sustain the partnership.',
        actions: ['Extend benefits to GTM and revenue teams', 'Speak as a reference for peer CIOs'],
        quote: 'More reliable, more scalable, less error-prone systems, with less manual intervention required.', quoteBy: M, quoteT: '8:51',
        feeling: 'Advocate',
        pains: [
          { text: 'Revenue teams benefit indirectly, making value hard to attribute to them.' },
          { text: 'New data sources or teams may trigger a fresh security review.' }
        ],
        opps: [
          { text: 'Peer-CIO reference program built on the security and ROI story.', t: '4:33' },
          { text: 'Pre-approved expansion path by data classification tier.' }
        ] }
    ].map(s => ({ ...s, painsV: keep(s.pains), oppsV: keep(s.opps) }));

    return {
      stages,
      showQuotes: props.showQuotes ?? true,
      showEmotion: props.showEmotion ?? true,
      priorities: [
        { n: '01', title: 'Make "work unlocked" measurable', body: 'Manu separates productivity (the way in) from new capability (the real ROI). Capture baselines at onboarding and report both, with named examples like the Salesforce dependency map.', stages: 'Prove · Expand' },
        { n: '02', title: 'Front-load the security answer', body: 'Security is where evaluations stall. Package zero retention, no training, isolation options and auth controls against the buyer’s own classification rubric.', stages: 'Evaluate' },
        { n: '03', title: 'Quantify the hidden build cost', body: 'Engineering-led buyers underestimate integrations, RBAC and compliance. A build-vs-buy worksheet makes the 10–20% that becomes the majority visible.', stages: 'Evaluate' },
        { n: '04', title: 'One governed context layer', body: 'Answer the sprawl problem directly: many AI use cases sharing one integrated, access-controlled context instead of data spreading across tools and clouds.', stages: 'Trigger · Scale' },
        { n: '05', title: 'Sponsor-change handover', body: 'Manu inherited the partnership. A ready-made executive briefing protects renewals when leadership changes.', stages: 'Adopt' }
      ],
      questions: [
        { n: '1', text: 'What did the first 30 days after connecting Salesforce look like, and when was the first useful result?' },
        { n: '2', text: 'How long did the security review take, and which evidence was hardest to produce?' },
        { n: '3', text: 'Which baseline metrics existed before Whirl, and who owns ROI reporting?' },
        { n: '4', text: 'How do Salesforce devs, BSAs and process owners use Whirl differently day to day?' },
        { n: '5', text: 'Which systems beyond Salesforce would you want mapped next?' },
        { n: '6', text: 'What would cause you to reconsider building in-house?' }
      ]
    };
  }
  window.renderCases = el => {
    if (el.dataset.done) return;
    const cio = CIO_VALS({});
    el.innerHTML = `<div style="padding:48px 48px 0;max-width:1280px;margin:0 auto;display:flex;flex-wrap:wrap;gap:8px"><button class="chip" aria-selected="true">GitLab</button></div>
<div style="font-family:'Haas','Inter Display','Inter',system-ui,sans-serif;color:#333840;background:#ffffff;-webkit-font-smoothing:antialiased">
<div style="max-width:1280px;margin:0 auto;padding:72px 48px 32px;display:flex;flex-direction:column;gap:48px">
  <div style="display:flex;flex-wrap:wrap;gap:40px;align-items:flex-start;justify-content:space-between">
  <header style="display:flex;flex-direction:column;gap:16px;max-width:760px;flex:1 1 480px">
    <div style="font-size:14px;font-weight:500;letter-spacing:0.16px;color:#41454d">Customer journey map · Draft v0.1 · Sept 2026</div>
    <h1 style="margin:0;font-size:36px;font-weight:400;line-height:1.15;letter-spacing:-0.4px;color:#181d26;text-wrap:pretty">A CIO's path from AI pressure to platform value: GitLab + Whirl</h1>
    <p style="margin:0;font-size:18px;line-height:1.45;color:#333840;text-wrap:pretty">Built from a 9-minute customer conversation between Marco Castillo (Whirl) and Manu Narayan (CIO, GitLab). Where the transcript is silent, gaps are filled with inferred steps, pain points and opportunities, labelled as such for validation.</p>
  </header>
  <a href="https://www.youtube.com/watch?v=BztNi7cK2mU&amp;t=18s" target="_blank" rel="noopener noreferrer" style="flex:0 1 400px;display:flex;flex-direction:column;gap:10px;color:#181d26;text-decoration:none">
    <div style="position:relative;border-radius:12px;overflow:hidden;border:1px solid #dddddd;aspect-ratio:1.9">
      <img src="thumbs/cio-video-thumb.png" alt="Video: Marco Castillo and Manu Narayan, CIO at GitLab" style="display:block;width:100%;height:100%;object-fit:cover">
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:56px;height:56px;border-radius:9999px;background:#181d26;display:flex;align-items:center;justify-content:center">
        <div style="width:0;height:0;border-top:10px solid transparent;border-bottom:10px solid transparent;border-left:16px solid #ffffff;margin-left:4px"></div>
      </div>
    </div>
    <div style="font-size:14px;font-weight:500;color:#1b61c9">Watch the source conversation on YouTube ↗</div>
  </a>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px">
    <div style="background:#f5e9d4;border-radius:10px;padding:24px;display:flex;flex-direction:column;gap:12px">
      <div style="font-size:14px;font-weight:500;color:#41454d">Primary persona</div>
      <div style="font-size:24px;line-height:1.35;color:#181d26">Manu Narayan, CIO</div>
      <p style="margin:0;font-size:14px;line-height:1.5;color:#333840">Under a year at GitLab; inherited an existing Whirl partnership. Carries a dual mandate: drive AI transformation across the business while transforming his own teams at the same time.</p>
    </div>
    <div style="background:#f8fafc;border-radius:10px;padding:24px;display:flex;flex-direction:column;gap:12px">
      <div style="font-size:14px;font-weight:500;color:#41454d">Supporting roles</div>
      <div style="display:flex;flex-direction:column;gap:8px;font-size:14px;line-height:1.45;color:#333840">
        <div><span style="color:#181d26;font-weight:500">Enterprise applications team</span> — Salesforce developers, business systems analysts, global process owners</div>
        <div><span style="color:#181d26;font-weight:500">Security</span> — owns data classification policy and control rubric</div>
        <div><span style="color:#181d26;font-weight:500">GTM &amp; revenue teams</span> — downstream beneficiaries of the platforms</div>
      </div>
    </div>
    <div style="background:#f8fafc;border-radius:10px;padding:24px;display:flex;flex-direction:column;gap:12px">
      <div style="font-size:14px;font-weight:500;color:#41454d">How to read this map</div>
      <div style="display:flex;flex-direction:column;gap:10px;font-size:14px;color:#333840">
        <div style="display:flex;gap:10px;align-items:center"><span style="font-size:12px;font-weight:500;padding:2px 8px;border-radius:6px;border:1px solid #181d26;color:#181d26">4:48</span>From transcript, with timestamp</div>
        <div style="display:flex;gap:10px;align-items:center"><span style="font-size:12px;font-weight:500;padding:2px 8px;border-radius:6px;border:1px dashed #9297a0;color:#41454d">Inferred</span>Evidence-based gap fill, needs validation</div>
      </div>
    </div>
  </div>
</div>

<div style="overflow-x:auto;padding:0 48px 48px">
  <div style="width:1840px;margin:0 auto;display:flex;flex-direction:column;gap:2px">
    <div style="display:grid;grid-template-columns:160px repeat(7,240px);gap:2px">
      <div></div>
      ${(cio.stages||[]).map(s => `
        <div style="background:#181d26;color:#ffffff;border-radius:12px 12px 0 0;padding:20px;display:flex;flex-direction:column;gap:6px;min-height:112px">
          <div style="font-size:13px;font-weight:500;letter-spacing:0.16px;opacity:0.75">${esc(s.phase)}</div>
          <div style="font-size:20px;line-height:1.3">${esc(s.name)}</div>
        </div>
      `).join('')}
    </div>

    <div style="display:grid;grid-template-columns:160px repeat(7,240px);gap:2px">
      <div style="padding:16px 16px 16px 0;font-size:14px;font-weight:500;color:#181d26">Goal</div>
      ${(cio.stages||[]).map(s => `
        <div style="background:#f8fafc;padding:16px 20px;font-size:14px;line-height:1.45;color:#181d26;text-wrap:pretty">${esc(s.goal)}</div>
      `).join('')}
    </div>

    <div style="display:grid;grid-template-columns:160px repeat(7,240px);gap:2px">
      <div style="padding:16px 16px 16px 0;font-size:14px;font-weight:500;color:#181d26">Actions</div>
      ${(cio.stages||[]).map(s => `
        <div style="background:#ffffff;border:1px solid #dddddd;padding:16px 20px;display:flex;flex-direction:column;gap:10px">
          ${(s.actions||[]).map(a => `
            <div style="display:flex;gap:8px;font-size:14px;line-height:1.4;color:#333840"><span style="color:#9297a0">—</span><span>${esc(a)}</span></div>
          `).join('')}
        </div>
      `).join('')}
    </div>

    ${cio.showQuotes ? `
      <div style="display:grid;grid-template-columns:160px repeat(7,240px);gap:2px">
        <div style="padding:16px 16px 16px 0;font-size:14px;font-weight:500;color:#181d26">In their words</div>
        ${(cio.stages||[]).map(s => `
          <div style="background:#f5e9d4;padding:16px 20px;display:flex;flex-direction:column;gap:10px">
            <div style="font-size:15px;line-height:1.45;color:#181d26;text-wrap:pretty">“${esc(s.quote)}”</div>
            <div style="font-size:12px;font-weight:500;color:#41454d">${esc(s.quoteBy)} · ${esc(s.quoteT)}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${cio.showEmotion ? `
      <div style="display:grid;grid-template-columns:160px 1fr;gap:2px">
        <div style="padding:16px 16px 16px 0;display:flex;flex-direction:column;gap:6px">
          <div style="font-size:14px;font-weight:500;color:#181d26">Emotion</div>
          <div style="font-size:12px;color:#41454d;line-height:1.4">Inferred from tone and language</div>
        </div>
        <div style="background:#f8fafc;position:relative;height:184px">
          <svg width="1678" height="184" viewBox="0 0 1678 184" style="position:absolute;inset:0">
            <line x1="0" y1="92" x2="1678" y2="92" stroke="#dddddd" stroke-dasharray="4 4"></line>
            <polyline points="120,112 362,96 604,124 846,90 1088,66 1330,30 1572,40" fill="none" stroke="#181d26" stroke-width="2"></polyline>
            <circle cx="120" cy="112" r="6" fill="#aa2d00"></circle>
            <circle cx="362" cy="96" r="6" fill="#d9a441"></circle>
            <circle cx="604" cy="124" r="6" fill="#aa2d00"></circle>
            <circle cx="846" cy="90" r="6" fill="#d9a441"></circle>
            <circle cx="1088" cy="66" r="6" fill="#0a2e0e"></circle>
            <circle cx="1330" cy="30" r="6" fill="#0a2e0e"></circle>
            <circle cx="1572" cy="40" r="6" fill="#0a2e0e"></circle>
          </svg>
          <div style="position:absolute;left:0;right:0;bottom:12px;display:grid;grid-template-columns:repeat(7,1fr)">
            ${(cio.stages||[]).map(s => `
              <div style="text-align:center;font-size:13px;font-weight:500;color:#181d26;padding:0 12px">${esc(s.feeling)}</div>
            `).join('')}
          </div>
        </div>
      </div>
    ` : ''}

    <div style="display:grid;grid-template-columns:160px repeat(7,240px);gap:2px">
      <div style="padding:16px 16px 16px 0;display:flex;flex-direction:column;gap:8px">
        <div style="width:24px;height:4px;border-radius:2px;background:#aa2d00"></div>
        <div style="font-size:14px;font-weight:500;color:#181d26">Pain points</div>
      </div>
      ${(cio.stages||[]).map(s => `
        <div style="background:#ffffff;border:1px solid #dddddd;border-top:4px solid #aa2d00;padding:16px;display:flex;flex-direction:column;gap:12px">
          ${(s.painsV||[]).map(p => `
            <div style="display:flex;flex-direction:column;gap:6px">
              <div style="font-size:14px;line-height:1.4;color:#181d26;text-wrap:pretty">${esc(p.text)}</div>
              <span style="align-self:flex-start;font-size:12px;font-weight:500;padding:1px 8px;border-radius:6px;border:1px ${esc(p.bs)} ${esc(p.bc)};color:${esc(p.tc)}">${esc(p.label)}</span>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>

    <div style="display:grid;grid-template-columns:160px repeat(7,240px);gap:2px">
      <div style="padding:16px 16px 16px 0;display:flex;flex-direction:column;gap:8px">
        <div style="width:24px;height:4px;border-radius:2px;background:#0a2e0e"></div>
        <div style="font-size:14px;font-weight:500;color:#181d26">Opportunities</div>
      </div>
      ${(cio.stages||[]).map(s => `
        <div style="background:#ffffff;border:1px solid #dddddd;border-top:4px solid #0a2e0e;border-radius:0 0 12px 12px;padding:16px;display:flex;flex-direction:column;gap:12px">
          ${(s.oppsV||[]).map(o => `
            <div style="display:flex;flex-direction:column;gap:6px">
              <div style="font-size:14px;line-height:1.4;color:#181d26;text-wrap:pretty">${esc(o.text)}</div>
              <span style="align-self:flex-start;font-size:12px;font-weight:500;padding:1px 8px;border-radius:6px;border:1px ${esc(o.bs)} ${esc(o.bc)};color:${esc(o.tc)}">${esc(o.label)}</span>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  </div>
</div>

<div style="max-width:1280px;margin:0 auto;padding:48px 48px 96px;display:flex;flex-direction:column;gap:48px">
  <div style="background:#181d26;color:#ffffff;border-radius:12px;padding:48px;display:flex;flex-direction:column;gap:32px">
    <h2 style="margin:0;font-size:32px;font-weight:400;line-height:1.2">Moments that matter</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:32px">
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="font-size:14px;font-weight:500;opacity:0.7">Low point · Security review</div>
        <div style="font-size:18px;line-height:1.45">Security is where most CIO evaluations stall. GitLab cleared it because Whirl met a pre-defined bar: zero retention, no training, isolation, and GitLab's own auth standards.</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="font-size:14px;font-weight:500;opacity:0.7">Turning point · Measuring impact</div>
        <div style="font-size:18px;line-height:1.45">Time savings got Whirl in the door, but Manu treats them as table stakes. Every vendor claims them.</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="font-size:14px;font-weight:500;opacity:0.7">Peak · Seeing the whole platform</div>
        <div style="font-size:18px;line-height:1.45">Dependency mapping across a decade-old Salesforce org turned tribal knowledge and trial-and-error into minutes of analysis. That is where real ROI lives.</div>
      </div>
    </div>
  </div>

  <section style="display:flex;flex-direction:column;gap:24px">
    <div style="display:flex;flex-direction:column;gap:8px">
      <h2 style="margin:0;font-size:32px;font-weight:400;line-height:1.2;color:#181d26">Priority opportunities</h2>
      <p style="margin:0;font-size:14px;color:#41454d">Draft ranking by strength of evidence and reach across the journey.</p>
    </div>
    <div style="display:flex;flex-direction:column;border-top:1px solid #dddddd">
      ${(cio.priorities||[]).map(r => `
        <div style="display:grid;grid-template-columns:48px minmax(0,1fr) 200px;gap:24px;padding:20px 0;border-bottom:1px solid #dddddd;align-items:baseline">
          <div style="font-size:24px;color:#181d26">${esc(r.n)}</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <div style="font-size:18px;font-weight:500;line-height:1.4;color:#181d26">${esc(r.title)}</div>
            <div style="font-size:14px;line-height:1.5;color:#333840;text-wrap:pretty">${esc(r.body)}</div>
          </div>
          <div style="font-size:14px;font-weight:500;color:#41454d">${esc(r.stages)}</div>
        </div>
      `).join('')}
    </div>
  </section>

  <section style="background:#e0e2e6;border-radius:12px;padding:48px;display:flex;flex-direction:column;gap:24px">
    <h2 style="margin:0;font-size:32px;font-weight:400;line-height:1.2;color:#181d26">Open questions for the next interview</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px 48px">
      ${(cio.questions||[]).map(q => `
        <div style="display:flex;gap:12px;font-size:16px;line-height:1.45;color:#181d26"><span style="color:#41454d">${esc(q.n)}</span><span>${esc(q.text)}</span></div>
      `).join('')}
    </div>
  </section>
</div>
</div>
    `;
    el.dataset.done = '1';
  };
})();
