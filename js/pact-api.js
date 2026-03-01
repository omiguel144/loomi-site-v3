/* ═══════════════════════════════════════════════════════════════════
   PACT CATALOG  —  js/pact-api.js
   Fetches js/pact-products.json (static snapshot) and renders product
   cards into the Pact brand page. Exposes window.PACT_API = { init }.
   To refresh: curl -s "https://wearpact.com/products.json?limit=250" \
               -o js/pact-products.json
═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var FILTERS = [
    { label: 'all',    value: '' },
    { label: 'cotton', value: 'cotton' },
    { label: 'hemp',   value: 'hemp' },
    { label: 'linen',  value: 'linen' },
    { label: 'wool',   value: 'wool' },
    { label: 'tencel', value: 'tencel' },
  ];

  var NATURAL_FIBERS = [
    'cotton', 'linen', 'wool', 'silk', 'hemp', 'cashmere',
    'alpaca', 'bamboo', 'tencel', 'modal', 'lyocell',
  ];

  /* ── Helpers ─────────────────────────────────────────────────── */

  function isNatural(name) {
    var lower = name.toLowerCase();
    return NATURAL_FIBERS.some(function (n) { return lower.indexOf(n) !== -1; });
  }

  function parseFibers(bodyHtml) {
    if (!bodyHtml) return [{ pct: 100, name: 'Natural Fibers' }];
    // Strip HTML, then normalize non-fiber punctuation (periods, parens, etc.) to spaces
    var text = bodyHtml.replace(/<[^>]+>/g, ' ').replace(/[^\w\s%\/,&\-]/g, ' ');
    var re = /(\d+)\s*%\s*([\w\s\-]+?)(?=\s*[\/,&%]|\s*\d+\s*%|\s*$)/gi;
    var results = [];
    var match;
    while ((match = re.exec(text)) !== null && results.length < 3) {
      var pct = parseInt(match[1], 10);
      var name = match[2].trim().replace(/\s+/g, ' ');
      if (pct > 0 && name.length > 0) {
        results.push({ pct: pct, name: name });
      }
    }
    return results.length > 0 ? results : [{ pct: 100, name: 'Natural Fibers' }];
  }

  /* ── Fetch ───────────────────────────────────────────────────── */

  var _cachedProducts = null;

  async function fetchWithRetry(url, attempts) {
    for (var i = 0; i < attempts; i++) {
      try {
        var res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res;
      } catch (e) {
        if (i === attempts - 1) throw e;
        await new Promise(function (resolve) { setTimeout(resolve, 1000 * (i + 1)); });
      }
    }
  }

  async function fetchProducts() {
    if (_cachedProducts) return _cachedProducts;
    /* Check sessionStorage for cross-navigation cache */
    var CACHE_KEY = 'loomi_pact_v1';
    try {
      var stored = sessionStorage.getItem(CACHE_KEY);
      if (stored) { _cachedProducts = JSON.parse(stored); return _cachedProducts; }
    } catch (e) { /* sessionStorage blocked — ignore */ }

    var url = (window.LOOMI_ROOT || '') + 'js/pact-products.json';
    var res = await fetchWithRetry(url, 3);
    var data;
    try { data = await res.json(); } catch (e) { throw new Error('Invalid JSON: ' + e.message); }
    if (!data || !Array.isArray(data.products)) throw new Error('Unexpected response shape');

    _cachedProducts = data.products;
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(_cachedProducts)); } catch (e) {}
    return _cachedProducts;
  }

  /* ── Render ──────────────────────────────────────────────────── */

  function renderLiveCard(p) {
    var img = (p.images && p.images[0]) ? p.images[0].src : '';
    var price = parseFloat((p.variants && p.variants[0]) ? p.variants[0].price : 0).toFixed(0);
    var fibers = parseFibers(p.body_html);
    var fiberText = fibers.map(function (f) { return f.pct + '% ' + f.name; }).join(' / ');
    var naturalPct = fibers
      .filter(function (f) { return isNatural(f.name); })
      .reduce(function (s, f) { return s + f.pct; }, 0);
    var href = 'https://wearpact.com/products/' + p.handle;
    var certBadge = naturalPct >= 90
      ? '<div class="card-badges"><span class="badge-certified"><span class="badge-certified-text">✦︎ Loomi Pick</span></span></div>'
      : '';

    return '<article class="product-card" data-fibers="' + fiberText.toLowerCase() + '">' +
      '<a href="' + href + '" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;display:block;">' +
        '<div class="relative overflow-hidden" style="aspect-ratio:3/4;background:var(--bg-soft);border-radius:12px;">' +
          (img ? '<img src="' + img + '" alt="' + p.title.replace(/"/g, '&quot;') + '" class="product-img w-full h-full object-cover" loading="lazy" />' : '') +
          certBadge +
        '</div>' +
      '</a>' +
      '<div class="card-text">' +
        '<p style="font-size:9px;color:var(--green);letter-spacing:0.1em;margin-bottom:3px;">🌿 ' + (fiberText || 'Natural Fiber') + '</p>' +
        '<a href="' + href + '" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;">' +
          '<p class="card-name">' + p.title + '</p>' +
        '</a>' +
        '<p class="card-price">$' + price + '</p>' +
      '</div>' +
    '</article>';
  }

  function renderSkeletons(grid) {
    var html = '';
    for (var i = 0; i < 6; i++) {
      html +=
        '<div>' +
          '<div class="pact-skeleton" style="aspect-ratio:3/4;margin-bottom:12px;"></div>' +
          '<div class="pact-skeleton" style="height:9px;width:70%;margin-bottom:8px;border-radius:4px;"></div>' +
          '<div class="pact-skeleton" style="height:11px;width:85%;margin-bottom:6px;border-radius:4px;"></div>' +
          '<div class="pact-skeleton" style="height:10px;width:30%;border-radius:4px;"></div>' +
        '</div>';
    }
    grid.innerHTML = html;
  }

  function renderError(grid) {
    grid.innerHTML =
      '<div class="empty-state" style="grid-column:1/-1;">' +
        '<p class="empty-state-title" style="margin-bottom:12px;">Couldn\'t load live products.</p>' +
        '<a href="https://wearpact.com" target="_blank" rel="noopener" class="cta-link">Shop directly at wearpact.com →</a>' +
      '</div>';
  }

  /* ── Filter bar ──────────────────────────────────────────────── */

  function renderFilterBar(filterBar, onFilter) {
    filterBar.innerHTML = FILTERS.map(function (f) {
      return '<button class="pact-filter-pill' + (f.value === '' ? ' is-active' : '') + '"' +
        ' data-filter="' + f.value + '">' + f.label + '</button>';
    }).join('');

    filterBar.addEventListener('click', function (e) {
      var pill = e.target.closest('.pact-filter-pill');
      if (!pill) return;
      onFilter(pill.dataset.filter);
    });
  }

  function applyFilter(keyword) {
    document.querySelectorAll('#pact-live-grid .product-card').forEach(function (card) {
      var match = !keyword || card.dataset.fibers.includes(keyword);
      card.style.display = match ? '' : 'none';
    });
    document.querySelectorAll('.pact-filter-pill').forEach(function (pill) {
      pill.classList.toggle('is-active', pill.dataset.filter === keyword);
    });
  }

  /* ── Public init ─────────────────────────────────────────────── */

  var _initialized = false;

  function init(containerId, filterBarId) {
    if (_initialized) return;   /* guard against double-init race condition */
    _initialized = true;

    var grid = document.getElementById(containerId);
    var filterBar = document.getElementById(filterBarId);
    if (!grid) return;

    /* Show skeletons immediately */
    renderSkeletons(grid);

    /* Render filter bar (disabled until data loads) */
    if (filterBar) {
      renderFilterBar(filterBar, applyFilter);
      filterBar.style.opacity = '0.4';
      filterBar.style.pointerEvents = 'none';
    }

    fetchProducts().then(function (products) {
      grid.innerHTML = products.map(renderLiveCard).join('');

      /* Re-enable filter bar */
      if (filterBar) {
        filterBar.style.opacity = '';
        filterBar.style.pointerEvents = '';
      }

      /* Trigger motion observer if available */
      if (window.LOOMI && window.LOOMI.initMotion) {
        window.LOOMI.initMotion();
      }
    }).catch(function () {
      renderError(grid);
      if (filterBar) {
        filterBar.style.opacity = '';
        filterBar.style.pointerEvents = '';
        filterBar.style.display = 'none';
      }
    });
  }

  /* ── Expose ──────────────────────────────────────────────────── */

  window.PACT_API = { init: init };
}());
