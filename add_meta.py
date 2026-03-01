"""
add_meta.py — One-time script to bake static SEO meta tags into all 64
subdirectory index.html files. Safe to re-run: skips files that already
have a canonical tag. The JS setPageMeta() will override these with
accurate per-page values at runtime; these serve as the crawlable fallback.
"""
import os, re

ROOT  = os.path.dirname(os.path.abspath(__file__))
SITE  = 'https://loomi.com'
DESC  = ('Natural fiber clothing curated to a 90% purity standard. '
         'Cotton, linen, merino wool, cashmere, silk and hemp, '
         'from verified brands.')
OG_IMG = SITE + '/images/main%20hero%20image.jpg'

updated = 0
skipped = 0

for dirpath, dirnames, filenames in os.walk(ROOT):
    # Skip hidden dirs and node_modules-style dirs
    dirnames[:] = [d for d in dirnames if not d.startswith('.')]
    for fname in filenames:
        if fname != 'index.html':
            continue
        fpath = os.path.join(dirpath, fname)

        # Skip root index.html — it already has full meta
        if os.path.abspath(fpath) == os.path.join(ROOT, 'index.html'):
            continue

        with open(fpath, 'r', encoding='utf-8') as f:
            html = f.read()

        # Skip if canonical already baked in
        if 'rel="canonical"' in html:
            skipped += 1
            continue

        # Build canonical URL from path relative to project root
        rel     = os.path.relpath(dirpath, ROOT)
        rel_url = rel.replace(os.sep, '/')
        canonical = SITE + '/' + rel_url + '/'

        # Extract existing <title> text for og:title
        m     = re.search(r'<title>([^<]+)</title>', html)
        title = m.group(1).strip() if m else 'Loomi — Natural Fiber Clothing'

        tags = (
            '\n  <!-- SEO meta — runtime JS will override with page-specific values -->'
            '\n  <meta name="description" content="' + DESC + '" />'
            '\n  <link rel="canonical" href="' + canonical + '" />'
            '\n  <meta property="og:title" content="' + title + '" />'
            '\n  <meta property="og:description" content="' + DESC + '" />'
            '\n  <meta property="og:type" content="website" />'
            '\n  <meta property="og:url" content="' + canonical + '" />'
            '\n  <meta property="og:image" content="' + OG_IMG + '" />'
        )

        # Inject just before </head>
        new_html = html.replace('</head>', tags + '\n</head>', 1)
        if new_html == html:
            print(f'WARN: no </head> found in {fpath}')
            continue

        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_html)

        updated += 1
        print(f'✓ {os.path.relpath(fpath, ROOT)}')

print(f'\nDone — {updated} files updated, {skipped} already had canonical tag.')
