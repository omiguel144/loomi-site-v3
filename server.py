import http.server
import socketserver
import os

# Static asset extensions get long-term immutable cache (1 year)
# HTML always revalidated so content updates are seen immediately
# pact-products.json gets 1-hour cache (live product data refreshed periodically)

STATIC_EXTS = {
    '.js', '.css', '.webp', '.png', '.jpg', '.jpeg',
    '.avif', '.woff', '.woff2', '.ttf', '.svg', '.ico',
}

class SmartCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        path = self.path.split('?')[0]   # strip query string
        ext  = os.path.splitext(path)[1].lower()

        if path.endswith('pact-products.json'):
            # Live product snapshot — cache for 1 hour
            self.send_header('Cache-Control', 'public, max-age=3600')
        elif ext in STATIC_EXTS:
            # JS, CSS, images, fonts — immutable for 1 year
            self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
        else:
            # HTML pages — always revalidate
            self.send_header('Cache-Control', 'no-store')

        super().end_headers()

    def log_message(self, format, *args):
        # Suppress per-request logging noise; keep errors visible
        if args and len(args) >= 2 and str(args[1]).startswith(('4', '5')):
            super().log_message(format, *args)

PORT = int(os.environ.get('PORT', 5000))
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("0.0.0.0", PORT), SmartCacheHandler) as httpd:
    print(f"Loomi dev server running on port {PORT}")
    print(f"  HTML:               no-store (always fresh)")
    print(f"  JS/CSS/images:      1-year immutable cache")
    print(f"  pact-products.json: 1-hour cache")
    httpd.serve_forever()
