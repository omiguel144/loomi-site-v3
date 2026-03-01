/* ═══ LOOMI PLP ENGINE ══════════════════════════════════════════════
   Filter state management, filter engine, and render functions.
   Exposed as window.PLP.
═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var D = null;          // set in init() = window.LOOMI
  var C = null;          // set in init() = window.LOOMI_COMPONENTS
  var _cfg = null;       // current PAGE_CONFIG
  var _state = null;     // current filter state
  var _baseProducts = []; // products after 90% rule + page config pre-filters

  var DEFAULT_STATE = {
    sort:     'new',
    gender:   [],
    category: [],
    fiber:    [],
    brand:    [],
    price:    null,
    pureOnly: false
  };

  /* ─── CATEGORY LABELS ─────────────────────────────────────────── */
  var CATEGORY_LABELS = {
    tops:      'Tops & Tees',
    dresses:   'Dresses',
    trousers:  'Trousers',
    knitwear:  'Knitwear',
    outerwear: 'Outerwear',
    sleepwear: 'Sleepwear',
    shirts:    'Shirts',
    underwear: 'Underwear',
    bottoms:   'Bottoms',
    sets:      'Sets'
  };

  var PRICE_RANGES = {
    'under-50':  function (p) { return effectivePrice(p) < 50; },
    '50-100':    function (p) { var ep = effectivePrice(p); return ep >= 50 && ep <= 100; },
    '100-200':   function (p) { var ep = effectivePrice(p); return ep > 100 && ep <= 200; },
    '200-plus':  function (p) { return effectivePrice(p) > 200; }
  };

  var SORTERS = {
    'new':          function (a, b) { return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0); },
    'price-asc':    function (a, b) { return effectivePrice(a) - effectivePrice(b); },
    'price-desc':   function (a, b) { return effectivePrice(b) - effectivePrice(a); },
    'best-sellers': function (a, b) { return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0); }
  };

  function effectivePrice(p) { return p.salePrice !== null ? p.salePrice : p.price; }

  /* ─── APPLY PRE-FILTERS (from PAGE_CONFIG.filters) ───────────── */
  function applyPreFilters(products, cfg) {
    var result = products.slice();

    /* 1. 90% rule — brand pages only, ALWAYS first */
    if (cfg.type === 'brand') {
      result = result.filter(function (p) { return p.naturalPct >= 90; });
    }

    /* 2. Page-level pre-filters (silent, not shown in UI) */
    var pf = cfg.filters || {};
    if (pf.brand)         result = result.filter(function (p) { return p.brand === pf.brand; });
    if (pf.fiberSlug)     result = result.filter(function (p) { return (p.fibers || []).some(function (f) { return f.slug === pf.fiberSlug; }); });
    if (pf.gender)        result = result.filter(function (p) { return (p.gender || []).indexOf(pf.gender) !== -1; });
    if (pf.category)      result = result.filter(function (p) { return (p.categories || []).indexOf(pf.category) !== -1; });
    if (pf.isNew)         result = result.filter(function (p) { return p.isNew; });
    if (pf.isBestSeller)  result = result.filter(function (p) { return p.isBestSeller; });
    if (pf.isOnSale)      result = result.filter(function (p) { return p.isOnSale; });

    return result;
  }

  /* ─── APPLY USER FILTERS (from _state) ───────────────────────── */
  function applyUserFilters(products) {
    var s = _state;
    var result = products.slice();

    if (s.gender.length)
      result = result.filter(function (p) { return s.gender.some(function (g) { return (p.gender || []).indexOf(g) !== -1; }); });
    if (s.category.length)
      result = result.filter(function (p) { return s.category.some(function (c) { return (p.categories || []).indexOf(c) !== -1; }); });
    if (s.fiber.length)
      result = result.filter(function (p) { return s.fiber.some(function (fs) { return (p.fibers || []).some(function (f) { return f.slug === fs; }); }); });
    if (s.brand.length)
      result = result.filter(function (p) { return s.brand.indexOf(p.brand) !== -1; });
    if (s.price && PRICE_RANGES[s.price])
      result = result.filter(PRICE_RANGES[s.price]);
    if (s.pureOnly)
      result = result.filter(function (p) { return p.naturalPct === 100; });

    result.sort(SORTERS[s.sort] || SORTERS['new']);
    return result;
  }

  /* ─── RENDER FILTER SIDEBAR ───────────────────────────────────── */
  function renderSidebar(avail) {
    var html = '';

    /* Sort */
    var sorts = [
      { val: 'new',          label: 'New In' },
      { val: 'price-asc',    label: 'Price: Low – High' },
      { val: 'price-desc',   label: 'Price: High – Low' },
      { val: 'best-sellers', label: 'Best Sellers' }
    ];
    html += '<div class="plp-filter-group">' +
            '<span class="plp-filter-label">Sort</span>';
    sorts.forEach(function (s) {
      var active = _state.sort === s.val ? ' active' : '';
      html += '<button class="plp-sort-btn' + active + '" onclick="PLP.setSort(\'' + s.val + '\')">' + s.label + '</button>';
    });
    html += '</div>';

    /* Gender */
    if (avail.indexOf('gender') !== -1) {
      var genders = [
        { val: 'women', label: 'Women' },
        { val: 'men',   label: 'Men' },
        { val: 'kids',  label: 'Kids' }
      ];
      html += '<div class="plp-filter-group"><span class="plp-filter-label">Gender</span>';
      genders.forEach(function (g) {
        var checked = _state.gender.indexOf(g.val) !== -1 ? ' checked' : '';
        html += '<label class="plp-filter-option">' +
                '<input type="checkbox"' + checked + ' onchange="PLP.toggle(\'gender\',\'' + g.val + '\')">' +
                g.label + '</label>';
      });
      html += '</div>';
    }

    /* Category */
    if (avail.indexOf('category') !== -1) {
      /* derive from base products */
      var catSet = {};
      _baseProducts.forEach(function (p) {
        (p.categories || []).forEach(function (c) { catSet[c] = true; });
      });
      var cats = Object.keys(catSet).sort();
      if (cats.length) {
        html += '<div class="plp-filter-group"><span class="plp-filter-label">Category</span>';
        cats.forEach(function (c) {
          var checked = _state.category.indexOf(c) !== -1 ? ' checked' : '';
          html += '<label class="plp-filter-option">' +
                  '<input type="checkbox"' + checked + ' onchange="PLP.toggle(\'category\',\'' + c + '\')">' +
                  (CATEGORY_LABELS[c] || c) + '</label>';
        });
        html += '</div>';
      }
    }

    /* Fiber */
    if (avail.indexOf('fiber') !== -1) {
      var fiberSet = {};
      _baseProducts.forEach(function (p) {
        (p.fibers || []).forEach(function (f) {
          if (f.slug !== 'elastane') fiberSet[f.slug] = f.name;
        });
      });
      var fiberSlugs = Object.keys(fiberSet).sort();
      if (fiberSlugs.length) {
        html += '<div class="plp-filter-group"><span class="plp-filter-label">Fiber</span>';
        fiberSlugs.forEach(function (fs) {
          var checked = _state.fiber.indexOf(fs) !== -1 ? ' checked' : '';
          html += '<label class="plp-filter-option">' +
                  '<input type="checkbox"' + checked + ' onchange="PLP.toggle(\'fiber\',\'' + fs + '\')">' +
                  fiberSet[fs] + '</label>';
        });
        html += '</div>';
      }
    }

    /* Brand */
    if (avail.indexOf('brand') !== -1) {
      var brandSet = {};
      _baseProducts.forEach(function (p) { brandSet[p.brand] = true; });
      var brandSlugs = Object.keys(brandSet).sort();
      if (brandSlugs.length) {
        html += '<div class="plp-filter-group"><span class="plp-filter-label">Brand</span>';
        brandSlugs.forEach(function (bs) {
          var brandObj = D.BRANDS.find(function (b) { return b.slug === bs; });
          var label = brandObj ? brandObj.name : bs;
          var checked = _state.brand.indexOf(bs) !== -1 ? ' checked' : '';
          html += '<label class="plp-filter-option">' +
                  '<input type="checkbox"' + checked + ' onchange="PLP.toggle(\'brand\',\'' + bs + '\')">' +
                  label + '</label>';
        });
        html += '</div>';
      }
    }

    /* Price */
    if (avail.indexOf('price') !== -1) {
      var prices = [
        { val: 'under-50',  label: 'Under $50' },
        { val: '50-100',    label: '$50 – $100' },
        { val: '100-200',   label: '$100 – $200' },
        { val: '200-plus',  label: '$200+' }
      ];
      html += '<div class="plp-filter-group"><span class="plp-filter-label">Price</span>';
      prices.forEach(function (p) {
        var checked = _state.price === p.val ? ' checked' : '';
        html += '<label class="plp-filter-option">' +
                '<input type="radio" name="plp-price"' + checked + ' onchange="PLP.setPrice(\'' + p.val + '\')">' +
                p.label + '</label>';
      });
      html += '</div>';
    }

    /* No synthetics toggle */
    if (avail.indexOf('pureOnly') !== -1) {
      html += '<div class="plp-filter-group">' +
              '<label class="plp-filter-option plp-filter-option--toggle">' +
              '<input type="checkbox"' + (_state.pureOnly ? ' checked' : '') +
              ' onchange="PLP.togglePure(this.checked)">' +
              'No synthetics (100% natural)' +
              '</label>' +
              '</div>';
    }

    return html;
  }

  /* ─── RENDER CHIPS ────────────────────────────────────────────── */
  function renderChips() {
    var s = _state;
    var chips = [];

    var dimLabels = { gender: 'Gender', category: 'Category', fiber: 'Fiber', brand: 'Brand' };
    ['gender', 'category', 'fiber', 'brand'].forEach(function (dim) {
      s[dim].forEach(function (val) {
        var label = val;
        if (dim === 'category') label = CATEGORY_LABELS[val] || val;
        if (dim === 'brand') {
          var b = D.BRANDS.find(function (br) { return br.slug === val; });
          if (b) label = b.name;
        }
        if (dim === 'fiber') {
          var f = D.FIBERS.find(function (fi) { return fi.slug === val; });
          if (f) label = f.name;
        }
        chips.push('<button class="plp-chip" onclick="PLP.remove(\'' + dim + '\',\'' + val + '\')">' +
                   label + '<span class="plp-chip-x">×</span></button>');
      });
    });

    if (s.price) {
      var priceLabels = { 'under-50': 'Under $50', '50-100': '$50–$100', '100-200': '$100–$200', '200-plus': '$200+' };
      chips.push('<button class="plp-chip" onclick="PLP.setPrice(null)">' +
                 priceLabels[s.price] + '<span class="plp-chip-x">×</span></button>');
    }

    if (s.pureOnly) {
      chips.push('<button class="plp-chip" onclick="PLP.togglePure(false)">No synthetics<span class="plp-chip-x">×</span></button>');
    }

    if (!chips.length) return '<div class="plp-chips-row"></div>';

    return '<div class="plp-chips-row">' + chips.join('') +
           '<button class="plp-clear-btn" onclick="PLP.clearAll()">clear all</button>' +
           '</div>';
  }

  /* ─── RENDER PRODUCT GRID ─────────────────────────────────────── */
  function renderGrid(products) {
    if (!products.length) {
      return '<div class="empty-state" style="padding:40px 0;">' +
             '<div class="empty-state-icon">◯</div>' +
             '<p class="empty-state-title">No pieces found</p>' +
             '<p class="empty-state-desc">Try adjusting your filters.</p>' +
             '<button class="cta-link" onclick="PLP.clearAll()">clear filters</button>' +
             '</div>';
    }
    return products.map(function (p) {
      return C.renderProductCard(p, { mode: 'grid', aspectRatio: '3/4' });
    }).join('');
  }

  /* ─── FULL RENDER ─────────────────────────────────────────────── */
  function render() {
    var avail = (_cfg && _cfg.availableFilters) || ['sort', 'gender', 'category', 'fiber', 'brand', 'price'];
    var filtered = applyUserFilters(_baseProducts);

    /* Update count */
    var countEl = document.getElementById('plp-count');
    if (countEl) countEl.textContent = filtered.length + ' pieces';

    /* Sidebar */
    var sidebar = document.getElementById('plp-sidebar');
    if (sidebar) sidebar.innerHTML = renderSidebar(avail);

    /* Mobile drawer sidebar */
    var drawerSidebar = document.getElementById('plp-drawer-sidebar');
    if (drawerSidebar) drawerSidebar.innerHTML = renderSidebar(avail);

    /* Chips */
    var chips = document.getElementById('plp-chips');
    if (chips) chips.innerHTML = renderChips();

    /* Grid */
    var grid = document.getElementById('plp-grid');
    if (grid) grid.innerHTML = renderGrid(filtered);

    /* Re-observe new cards for scroll animations */
    if (window.LOOMI && window.LOOMI.initMotion) window.LOOMI.initMotion();
  }

  /* ─── PUBLIC API ──────────────────────────────────────────────── */
  var PLP = {
    init: function (cfg) {
      D = window.LOOMI;
      C = window.LOOMI_COMPONENTS;
      _cfg = cfg;
      _state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      _baseProducts = applyPreFilters(D.PRODUCTS, cfg);
    },

    getFiltered: function () {
      return applyUserFilters(_baseProducts);
    },

    getBase: function () {
      return _baseProducts;
    },

    render: render,

    toggle: function (dim, val) {
      var arr = _state[dim];
      var idx = arr.indexOf(val);
      if (idx === -1) arr.push(val);
      else arr.splice(idx, 1);
      render();
    },

    setSort: function (val) {
      _state.sort = val;
      render();
    },

    setPrice: function (val) {
      _state.price = val;
      render();
    },

    togglePure: function (val) {
      _state.pureOnly = !!val;
      render();
    },

    remove: function (dim, val) {
      if (dim === 'price') {
        _state.price = null;
      } else {
        var arr = _state[dim];
        var idx = arr.indexOf(val);
        if (idx !== -1) arr.splice(idx, 1);
      }
      render();
    },

    clearAll: function () {
      _state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      render();
    },

    openDrawer: function () {
      var drawer = document.getElementById('plp-mobile-drawer');
      if (drawer) drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    },

    closeDrawer: function () {
      var drawer = document.getElementById('plp-mobile-drawer');
      if (drawer) drawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  window.PLP = PLP;

})();
