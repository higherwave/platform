# Signal Flow: Handoff

Desktop app that takes a research project from test plan to user stories in one workspace. This prototype is plain HTML Design Components (`*.dc.html`) with inline styles and sample data. Target: a React app with a database and API, styles replaced by design system tokens (checked by the linter service).

Out of scope for the next build: AI analysis (phase 2) and third-party integrations such as Jira (phase 3). Both are stubbed; see "Stubs".

## 1. File map

| File | Role |
|---|---|
| `Signal Flow.dc.html` | App shell. 88px left toolbar (Research Projects, Platform Insights), project side menu (Plan / Analyze / Deliver), tab locking, hosts the other screens in iframes and routes between them with `postMessage`. |
| `Research.dc.html` | Home (project cards), new-project wizard, Test Plan, Task List, Transcripts, Themes, Priorities, Journey Map. Owns the project record. |
| `Spec Writer.dc.html` | Requirements: pick or create a doc, edit requirements, Agent Reasoning cards, publish. |
| `Boards.dc.html` | User Stories board: columns To Do / In Progress / In Review / Done, detail panel, theme filters. |
| `Platform Insights.dc.html` | Team knowledge base: Platform Themes, Case Studies, Onboarding (placeholder). |
| `data/*.js` | Sample data, one file per screen (see section 5). |

React mapping: replace the iframe shell with a router. Suggested routes:
`/projects`, `/projects/new`, `/projects/:id/{plan|tasks|transcripts|themes|journey|prio|requirements|stories}`, `/insights/{themes|case-studies|onboarding}`.

## 2. Workflow

Linear, one project at a time:

1. **Plan**: Test Plan, then Task List and Transcripts.
2. **Analyze**: Themes, Priorities, Journey Map (all derived from transcripts).
3. **Deliver**: Requirements (from themes and priorities), then User Stories (from published requirements).

Side menu numbering: 1 Test Plan, 2 Task List, 3 Transcripts, 4 Themes, 5 Journey Map, 6 Priorities, 7 Requirements, 8 Stories.

## 3. State transitions

Tab availability (`avail()` in the shell):

| Tab | Enabled when | Disabled hint |
|---|---|---|
| Test Plan | always | none |
| Task List, Transcripts | project exists (plan saved) | "Save the test plan first" |
| Themes, Priorities, Journey Map | project has at least one theme (transcript analyzed) | "Save and analyze a transcript first" |
| Requirements | project has themes | "Save and analyze a transcript first" |
| Stories | a requirements doc for this project is published | "Publish the doc first" |

Project lifecycle: `Draft` (no themes) to `Analyzed` (themes present).

Events:
- Wizard finished: create project, go to Task List.
- Transcripts added, removed or edited: project is dirty. Button reads "Save and analyze" when an analysis already exists and transcripts changed, otherwise "Save". Saving re-runs analysis, replaces themes, and clears pinned items.
- Transcripts removed entirely: themes, pins and analysis key are cleared. Analyze tabs lock again.
- Analysis run: shows a 5-step progress list (Parsing transcripts, Identifying speakers, Clustering statements, Scoring and prioritizing, Porting themes to journey map).
- Requirements doc: Agent Reasoning cards are editable. An edit marks the card as needing re-approval; it cannot be saved until approved again.
- Publish doc: writes a published spec record, unlocks Stories, navigates to Stories. Every new story starts in To Do. Themes with effort 3 become open-question stories.
- Stories board: cards move between statuses (drag between columns). Card shows theme label (light grey); stage and assignment metadata are hidden on the card and shown in the detail panel.
- Remove project / doc / board: hides it (soft delete in prototype).

Journey Map has no save control; edits persist immediately.

## 4. Data model sketch

Derived from the prototype's project record. Names in `snake_case` for the database; the prototype uses camelCase.

```
Project
  id, name, template (usability|discovery|concept|blank), what_we_are_testing,
  jtbd_when, jtbd_want, jtbd_so, color, status (draft|analyzed),
  analyzed_key (hash of transcripts at last analysis), created_at

ProjectOutcome   project_id, text, position
ProjectMethod    project_id, method
Participant      id, project_id, name, role, email, session_date
Task             id, project_id, position, q (the question or task prompt), fups[] (follow-up prompts)
Transcript       id, project_id, name, platform (Zoom|Meet|Teams), raw_text
Speaker          id, transcript_id, name, role (participant|moderator),
                 participant_id (nullable; null for moderators and unmatched names)
Utterance        id, transcript_id, speaker_id, timestamp, text

AnalysisRun      id, project_id, provider, run_at, transcript_key
Theme            id, project_id, analysis_run_id, title, category (Pain point|Need|Expectation|Delight),
                 journey_stage (0-4), severity (-1..1), description, opportunity,
                 suggested_priority (Low|Medium|High), suggested_effort (1-3), effort_note,
                 participant_count, mention_count, score
ThemeOverride    theme_id, priority (nullable), effort (nullable), journey_stage (nullable),
                 name (nullable), pinned (bool)      -- user edits, kept apart from provider output
ThemeQuote       id, theme_id, utterance_id, text
JourneyStage     index 0-4: Find a provider, Book a time, Confirm & pay, Prepare or change, Visit & follow-up

Spec             id, project_id, name, is_standalone, problem_frame, published_at, hidden
SpecStep         id, spec_id, position (1-8), title, reasoning_text, status (pending|review|approved),
                 edited_text (nullable), redo_note (nullable), rejected_alternatives[]
SpecStepEvidence spec_step_id, theme_id
                 -- the 8 steps: Frame the problem, Identify users and jobs, Define goals and success metrics,
                 --   Set scope, Draft requirements, Assess risks and dependencies, Plan the rollout, List open questions
Requirement      id, spec_id, theme_id, title, category, priority, effort, opportunity, supporting_quote

Story            id, spec_id, kind (requirement|open_question), requirement_id (nullable), theme_id (nullable),
                 name, theme_label, status (todo|in_progress|in_review|done), position, owner,
                 priority (Low|Medium|High), participants_label, short, why_it_matters, next_step
StoryChecklistItem  id, story_id, position, kind (criterion|task), text, met (bool)
JiraTicket       story_id, key, created_at                               (phase 3)

PlatformTheme    id, title, category
PlatformThemeSource  platform_theme_id, project_id, theme_id, participant_count
Recommendation   id, title, why, priority, platform_theme_ids[]
CaseStudy        id, title, summary, outcome, owner, date, color, platform_theme_ids[]
```

Decisions encoded above:
- **Story status** is one enum: `todo`, `in_progress`, `in_review`, `done`. Column titles are To Do, In Progress, In Review, Done.
- **Acceptance criteria and tasks** are one table, `StoryChecklistItem`, with a `kind` column. The card progress bar and "N of M criteria met" count only `kind = criterion`; tasks are listed alongside.
- **Story kind**: `requirement` or `open_question`. `requirement_id` and `theme_id` are nullable (an open question such as the fee policy is not derived from a theme).
- **New stories start in `todo`**. Publishing no longer sorts by priority. Themes with effort 3 become `open_question` stories; all others become `requirement` stories, ordered by priority.
- **Legacy fields removed**: `obligations`, `evidenced`, `dateLabel`, audience toggle, confidence toggle, and the Likely / Possible tone. `exposure` and `action` became `why_it_matters` and `next_step`.
- **Spec steps** belong to the Spec, not to a Requirement. Each Spec has the 8 steps listed above, each with evidence themes, rejected alternatives, redo text and edits.
- **Analysis output**: effort and suggested priority are columns written by the analysis provider on each Theme, with an `analysis_run_id`. Theme ids are generated per run; the prototype's `t1` to `t9` keys and the `EFF` lookup are stub-only (kept inside the keyword analyzer).
- **Re-analysis** replaces the run's themes. User edits live in `ThemeOverride`, keyed by a stable theme identity. The prototype clears pins and overrides on re-run; decide whether production should carry them over by matching titles.
- **Speakers**: a `Speaker` row maps each transcript speaker name to a participant (case-insensitive name match in the prototype) or marks it as moderator. Participant counts ("2 of 3") count distinct `participant_id`, falling back to the speaker when unmatched. The prototype stores this as `project.speakers` and as `pid` on each quote.

Platform Themes roll up project Themes. The prototype shows "N of 13 participants across M of 3 projects" per platform theme, with a project-by-theme matrix and quotes for the selected cell. Needed: a rule for mapping project themes to platform themes (manual tagging first, matching later).

Seed data shape lives in `data/*.js`; use it for fixtures and the first migration. Platform Insights counts are computed (participants = sum of project participants, projects = number of projects). Its three sample projects now start from the same project as the Research sample ("Clinic booking, usability round 1").

## 5. Sample data modules

Each screen loads `data/<name>.js` through a `<script>` in its helmet and reads `window.SFData.<name>`. Replace each read with a fetch.

| Module | Contains | Real source |
|---|---|---|
| `data/research.js` | `STAGES`, `CATS` (category colors), `METHODS`, `TH` (theme definitions with keyword lists), `SAMPLES` (3 transcripts), `TEMPLATES`, `EFF` (effort by theme), `LV`, `PLAT` (transcript export help per platform), `STEPS`, `STEP_COPY`, `BUSY` | Templates, stages, methods: config tables. `SAMPLES`: seed fixtures. `TH` and `EFF`: output of analysis. |
| `data/specWriter.js` | `CATS`, `LOAD` (loading step labels), `EFF`, `BGS` | Same as above |
| `data/boards.js` | `defaultData` (10 sample stories: status, kind, criteria checklist) | `Story` + `StoryChecklistItem` |
| `data/platformInsights.js` | `C` (case studies), `P` (3 projects), `CAT`, `T` (platform themes with per-project quotes), `R` (recommendations) | `CaseStudy`, `Project`, `PlatformTheme`, `Recommendation` |

Not yet extracted: `sample()` in `Spec Writer.dc.html` builds sample requirements inline from a table of theme rows.

## 6. Persistence to replace

All state is in `localStorage` and syncs between iframes through the `storage` event.

| Key | Holds |
|---|---|
| `signalflow-projects-v1` | `{ projects: Project[], at }` (full project records) |
| `signalflow-colors-v1` | project name to card color |
| `signalflow-published-specs-v1` | published requirement docs |
| `signalflow-hidden-specs-v1` | hidden doc ids |
| `signalflow-hidden-boards-v1` | hidden board names |

Cross-frame messages (`postMessage`, field `sf`): `new`, `open`, `home`, `tab`, `planSaved`, `published`, and the shell's `nav` with `view`, `pid`, `section`. In React these become route changes and shared store updates.

Colors keyed by project name should become a `color` field on Project.

## 7. Stubs

- **Analysis** (`analyze()` in Research): keyword matching over transcript text against `TH[].kw`. Stand-in for the phase 2 AI step. Keep the interface: input transcripts, output Theme[] with quotes, stage, severity, priority, effort.
- **Agent Reasoning text**: static sample copy.
- **Jira ticket**: button creates a placeholder number (SF-101 style, "Created Oct 19, 2026 View ticket SF-101"). No link target. Phase 3.
- **Platform Insights**: not connected to projects. Search field removed. Onboarding tab is a "coming soon" placeholder. Guidelines tab and data were deleted.
- **Participant invites / email**: stored only; nothing is sent.

## 8. Inline styles to replace with design system tokens

The design system is Airtable's. Every style is inline in the markup, with raw hex values repeated per element. Nothing is defined once. Below is what exists, grouped to map onto tokens. Counts are occurrences across all screens.

**Text and neutral colors**

| Value | Count | Use | Token role |
|---|---|---|---|
| `#181d26` | 163 | primary text, dark buttons, active nav fill | text/primary |
| `#41454d` | 128 | secondary text, descriptions | text/secondary |
| `#9297a0` | 16 | disabled / locked text | text/disabled |
| `#6b7078` | 1 | tertiary text | text/tertiary |
| `#333840` | 15 | body text color on page | text/body |
| `#fff` / `#ffffff` | 104 | page and card surface, text on dark | surface/default |
| `#f8fafc` | 22 | subtle panel fill | surface/subtle |
| `#f2f3f5`, `#e8eaed`, `#e0e2e6` | 17 | hover fills, gray badges | surface/hover, badge/neutral |
| `#ddd` / `#dddddd` | 88 | borders, dividers | border/default |

**Accent**

| Value | Count | Use |
|---|---|---|
| `#1b61c9` | 22 | primary action (Save and analyze), links |
| `#1a3866` | 6 | link hover |
| `#458fff` | 14 | focus / secondary accent |
| `#aa2d00` | 21 | high priority text, arrows |
| `#0a2e0e` | 22 | success text and status dot |
| `#fcab79` | 2 | unsaved-changes dot |

**Pastel fills** (project cards, recommendations, badges, roadmap columns): `#faf3e6`, `#e4f3ec`, `#fbe9e0`, `#fbf3cf`, `#eef2fa`, `#eeeafa`, `#e6f2fa`, `#fae6ed`, `#faf1df`, `#fddcc6`. Category text pairs: Pain point `#7a1f00`, Need `#5a3d00`, Expectation `#0a2e0e`, Delight `#181d26`.

One palette is used everywhere, including `data/platformInsights.js`.

**Type**: Inter (weights 300, 400, 500, 600). Sizes in use: 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 28, 32, 40 px. Weight 500 is the default emphasis (136 uses); 300 for page titles and the "Signal Flow" wordmark.
Page header pattern: title 28px weight 300 on project pages, 32px on Research Projects and Platform Insights; description 16px / 400 / `#41454d`, 12px below the title. Section label: 12px, 500, uppercase, `.16px` letter spacing, `#41454d`.
Body text 14-16px. Normalize the 13/15/17 sizes onto the token scale.

**Radius**: 6px (badges, chips, small buttons), 8px (nav rows, small cards), 10px (cards, panels), 12px (buttons, large cards), 50% (circles), 9999px (count pills).

**Layout**: left toolbar 88px; top app header 64px (Platform Insights) / 56px (project); project side menu rows 9px 12px padding with 12px gap, item spacing 16px between toolbar items; page content max width 1200px, 32px side padding; 12 to 24px gaps in grids; page sections separated by 44 to 56px on Platform Insights.

**Interaction states** use the `style-hover` and `style-active` attributes; map to token hover/pressed states. Disabled controls use `#f8fafc` fill, `#9297a0` text, `default` cursor.

**Component candidates for React**: AppShell, ToolbarItem, ProjectNav (grouped steps with lock state), PageHeader (title, description, actions, status), Button (primary, secondary, dark, disabled), Badge (neutral, category), Chip (toggle), Card (pastel), Tab bar with count, Table/matrix, DropZone, Wizard stepper, Board column + card, Detail panel, Modal.

Lint expectation: no raw hex or px values in component styles; colors, spacing, radius and type come from tokens. Use the lists above to build the token map; ask for design system token names before mapping.

## 9. Known gaps

- The live GitHub build once broke the Save and analyze header layout; fixed in `Research.dc.html` (header no longer wraps, button and status pinned top right). Confirm on the live page.
- Platform Insights seed projects are still sample data, separate from real projects.
