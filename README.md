# SIGMA — Industrial editorial redesign

[Live GitHub Pages](https://ed100084.github.io/sigma/)

A non-official design concept informed by SIGMA 新格集團's publicly readable company website. Traditional Chinese, graphite/mineral-white/molten-orange industrial editorial style. No framework, server-side data collection, analytics or runtime external fonts.

## Features
- Five material families with source-linked native dialogs and application-led discovery.
- ADC 3/6/10/12/14 composition comparison, 40 source-checked values.
- Circular manufacturing story, casting field notes and nine production-base selector.
- Local-only inquiry drafts with clipboard/manual fallback and clear-page controls.
- Responsive tablet menu, keyboard tabs/focus loops and reduced-motion support.
- Locally hosted SIL-OFL typography subsets.

## Preview
```sh
python3 -m http.server 4286 --bind 127.0.0.1
```
Open http://127.0.0.1:4286/. If port is occupied, use a different port and update performance-check target.

## Validation
```sh
python3 docs/verify-site.py
python3 docs/verify-site.py --source
node --check app.js
node --check alloys.js
```
Browser tests use the globally installed Playwright CLI:
```sh
PLAYWRIGHT_MCP_BROWSER=chromium playwright-cli -s=sigma-check open http://127.0.0.1:4286/
PLAYWRIGHT_MCP_BROWSER=chromium playwright-cli -s=sigma-check run-code --filename=docs/browser-smoke.js
PLAYWRIGHT_MCP_BROWSER=chromium playwright-cli -s=sigma-check run-code --filename=docs/focus-check.js
PLAYWRIGHT_MCP_BROWSER=chromium playwright-cli -s=sigma-check run-code --filename=docs/performance-check.js
PLAYWRIGHT_MCP_BROWSER=chromium playwright-cli -s=sigma-check run-code --filename=docs/throttled-performance.js
PLAYWRIGHT_MCP_BROWSER=chromium playwright-cli -s=sigma-check eval '()=>window.sigmaThrottled'
PLAYWRIGHT_MCP_BROWSER=chromium playwright-cli -s=sigma-check close
```
The original performance script measures localhost fresh contexts. The throttled script uses the active site's root with three cold contexts, 150ms latency, 1.6Mbps down / 750Kbps up and 4x CPU slowdown. Results are laboratory samples, not production field Core Web Vitals; compare under identical host/conditions. Automated accessibility checks do not certify complete WCAG compliance.

## Content and fonts
Company source provenance is documented in [design notes](docs/design-and-sources.md), and iteration reports record checks and limits. Recheck official claims before commercial release. The original website's displayed email differs from its mailto link; do not guess a recipient or turn draft creation into transmission without confirmation.

After adding copy, run `python3 docs/update-font-subset.py`, bump the font URL in fonts.css and matching preload in index.html, then check the page. Fonts are licensed under SIL OFL; retain both license texts in assets/fonts. User-entered/new characters can use system fallback.

## Deploy
GitHub Pages serves `main` branch repository root with `.nojekyll`. Push to main triggers native Pages build and deployment. Confirm the workflow commit SHA and public assets before saying an update is live. Bump CSS/JS asset query versions whenever content changes to avoid stale browser cache. Never commit private inquiry data.

## Scope
This is a quality-focused redesign, not an official corporate site, validated engineering recommendation, certified accessible product, or guaranteed competition winner. Image/source commercial rights and official contact details need confirmation for a production corporate launch. Original SVG/CSS artwork is conceptual, not a product photograph.
