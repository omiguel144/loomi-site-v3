# Loomi — Natural Fiber Clothing E-commerce

## Overview
Loomi is a curated e-commerce platform for natural fiber clothing (cotton, linen, merino wool, cashmere, silk, hemp). It serves as both a marketplace and educational resource about sustainable fashion.

## Tech Stack
- **Frontend**: Vanilla HTML/CSS/JS with Tailwind CSS (CDN)
- **Backend**: Python `server.py` — simple static file server on port 5000
- **Fonts**: Cormorant Garamond (display) + DM Sans (UI) via Google Fonts
- **Routing**: Custom client-side router (`js/page.js`) using `window.PAGE_CONFIG`

## Project Structure
```
/                     Root — static pages
├── server.py         Python HTTP server (port 5000, no-cache headers)
├── index.html        Homepage
├── styles.css        Global CSS (design tokens, components)
├── js/
│   ├── data.js       Product/brand/fiber data
│   ├── components.js Nav, footer, product cards, fiber charts
│   └── page.js       Router + page renderers + interaction handlers
├── women/            Women's category pages
├── men/              Men's category pages
├── kids/             Kids' category pages
├── fibers/           Fiber detail pages
├── brands/           Brand pages
├── new/              New arrivals
├── the-standard/     Loomi Standard pages
└── attached_assets/  User-uploaded assets (not served)
```

## Key Architecture
- Each page defines `PAGE_CONFIG` (type, title, activePath) then loads `data.js`, `components.js`, `page.js`
- `page.js` reads config, injects nav/footer, dispatches to page renderer
- Nav uses mega-menu with hover-to-open (JS hover intent with 300ms close timer)
- Clicking a nav category navigates to that category page; hovering opens the dropdown
- Mega-menu has a backdrop overlay for better visual focus
- Mobile nav uses expandable accordion sections with animated hamburger-to-X icon
- Accessibility: aria-haspopup, aria-expanded, keyboard focus handlers, Escape to close

## Workflow
- **Start application**: `python3 server.py` on port 5000 (webview)
