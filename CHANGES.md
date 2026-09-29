# Customer Knowledge Base — v2 changes

Replace the previous `deploy/` contents with this folder. `index.html` is the full, current page; all styles are inline, so no separate CSS file is needed.

## Files
- `index.html` — main page (all tabs, inline styles, GitLab case study inlined)
- `support.js` — runtime (required, keep next to index.html)
- `assets/cio-video-thumb.png` — Case Studies video thumbnail
- `uploads/1.png`, `2.png`, `4.png` — Keepers thumbnails and full-size views
- `uploads/dep-graph-1.png` — Keepers › Integrations thumbnail (links to the live Whirl app)

## Changes since the last deploy
### Header
- New sage header bar: `#808a7e`, 8px bottom border `#767d71`
- Left title "Customer Knowledge Base" — Marcellus, 24px, white, wraps to 2 lines (max-width 180px)
- Tabs centered, Source Serif 4, 17px, white; active tab = 1px white underline
- LinkedIn icon removed
- Header inner container: max-width 1640px, padding 36px 40px (aligns with page content)
- Fonts added to Google Fonts link: Marcellus, Source Serif 4

### Tabs
- Order: Process, Customer Journeys, Case Studies, Keepers, Design to Code
- "Before and After" renamed "Keepers"
- "Design to Code Pipeline" tab renamed "Design to Code"
- Default active tab: Process

### Page headings (below tabs)
All: 18px, weight 500, line-height 1.3, color `#41454d`, 48px bottom margin
- Process: "End-to-End Process that Starts Small and Scales to Multi-App Platform (especially when combined with the Design to Code MCP pipeline)"
- Customer Journeys: "Understanding Customers Across Verticals"
- Keepers: "Evidence-based Patterns to Add to Our MCP Library"
- Design to Code: "A Summary of the Benefits to Design Iterations, Design System Management, Developer Hand-offs, and Scaling the Platform"

### Layout
- Process and Design to Code containers: max-width 1640px, padding 40px sides, centered (matches other tabs and header left edge)
- Design to Code page title now "Design-to-Code Pipeline"

### Titles
- Customer Journeys industry titles: 40px → 36px
- Case Studies title: 40px → 36px, line-height 1.15, letter-spacing -0.4px; "GitLab × Whirl" → "GitLab + Whirl"

## Deploy
Static site, no build step. On Vercel: framework preset "Other", output directory = this folder's root.
