# zachmn.com

Personal site for Zach, hosted on GitHub Pages from `main` of
https://github.com/zach-mn/zach-mn.github.io. Custom domain `zachmn.com` (set by `CNAME` — do not delete or rename it).

## Stack

Plain static HTML/CSS/JS. No framework, no build step, no package.json. Pushing to `main` deploys (GitHub Pages, usually live in ~1 min).

| File | What's in it |
|---|---|
| `index.html` | All content: header/nav, hero, About (01), Projects (02), Contact (03), footer. Meta/OG tags and an inline SVG favicon in `<head>`. |
| `style.css` | Everything visual. Design tokens live in `:root` (colors, fonts, widths). Sections are marked with `/* ── Name ── */` banners. Mobile breakpoint is a single `@media (max-width: 720px)` block near the end. |
| `script.js` | Scroll-reveal (IntersectionObserver), header hairline on scroll, mobile menu toggle, footer year. |
| `_config.yml` | Only used to keep repo docs (this file, etc.) out of the published site. |

## Design system (current: "warm-paper editorial", commit 3585001)

- Colors: `--paper #faf9f5` bg, `--ink #1c1b17` text, `--muted`, `--line`/`--line-strong` hairlines, single accent `--accent #23573f` (forest green). Change colors via tokens, not hard-coded values. Note `.site-header` background and `<meta name="theme-color">` and the favicon data-URI duplicate the paper/accent colors — update them together.
- Fonts (Google Fonts link in `<head>`): Newsreader = display/headings, Schibsted Grotesk = body, Spline Sans Mono = small labels/tags/numbers.
- Light theme only; no dark mode.

## Common edits

- **Add a project:** copy an existing `<li class="project" data-reveal ...>` in `index.html`. Right side is either `<span class="project-meta">Private repo</span>` or an `<a class="project-meta project-link">` with the arrow SVG. Stagger reveal delays with `style="--rd: 0.08s"`, `0.16s`, … .
- **Add a section:** copy a `<section class="section">` with a `.section-head` (`section-num` + `h2`), bump the number, and add a nav link in both the `<ul class="nav-links">` (mobile menu uses the same list).
- **Reveal animation:** any element with `data-reveal` fades in on scroll; `--rd` sets its delay.
- Use HTML entities already in use: `&#8209;` (non-breaking hyphen) to keep hyphenated words together, `&amp;`, `&copy;`.

## Preview locally

```
python -m http.server 8000
```
then open http://localhost:8000. Check the mobile layout at < 720px width (menu toggle) and with reduced-motion if touching animations.

## Gotchas

- **Encoding:** keep all files UTF-8 (no BOM), LF line endings. A past commit (1cd2f0a) had to fix mojibake in CSS comments caused by an encoding mishap — on Windows, never write files with PowerShell `Set-Content`/`Out-File` defaults; use the Edit/Write tools. The box-drawing characters in comments (`──`, `═══`) and em dashes are the first things that break.
- **Mobile menu stacking:** many past commits fought z-index/stacking-context bugs with the full-screen mobile menu. The `.nav-links` overlay is `position: fixed` inside the sticky header; don't add `transform`, `filter`, or `opacity` < 1 to ancestors of `.nav-links` (it creates a containing block and traps the overlay). The header's `backdrop-filter` is fine on desktop but test the menu on mobile after any header change.
- `[data-reveal]` elements are only hidden (pre-animation) when `<html>` has the `js` class, added by an inline script in `<head>`. Keep that gating so the page stays readable if `script.js` fails.

## Workflow

`main` is the live site — anything that lands there is on zachmn.com within a minute — so never commit to or push `main` directly.

1. Branch off an up-to-date `main` (short descriptive name, e.g. `tagline-public-data`), one focused commit per change with a descriptive message.
2. Push the branch and open a PR with `gh pr create`. For wording that describes private projects, show Zach the text before opening the PR.
3. Zach reviews and merges (on GitHub, or by telling Claude "merge it" → `gh pr merge --merge`).
4. After a merge: `git switch main`, `git pull`, `git branch -d <branch>`, `git fetch --prune`, then confirm the Pages deploy succeeded (`gh run list -L1`) and the change is live on zachmn.com. GitHub auto-deletes the remote branch on merge.
