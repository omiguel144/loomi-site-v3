/* ═══ LOOMI PAGE ROUTER ═════════════════════════════════════════════
   Reads window.PAGE_CONFIG, renders nav/footer, dispatches to page
   renderer by type. Also globalises shared interaction functions.
═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var C = window.LOOMI_COMPONENTS;
  var D = window.LOOMI;
  var cfg = window.PAGE_CONFIG || { type: 'home' };
  var r = window.LOOMI_ROOT || '';

  /* ─── DATA GUARD — graceful error if data.js failed to load ─── */
  if (!D || !D.PRODUCTS || !C) {
    var _m = document.getElementById('loomi-main');
    if (_m) _m.innerHTML =
      '<div style="padding:80px 20px;text-align:center;">' +
        '<p style="font-size:14px;color:#8A8477;line-height:2;">Something went wrong loading the page.<br>' +
        '<a href="javascript:location.reload()" style="color:#5B705C;border-bottom:1px solid #5B705C;">Refresh to try again</a></p>' +
      '</div>';
    return;
  }

  /* ─── META TAG HELPER (Reformation pattern) ───────────────────── */
  var SITE_URL = 'https://loomi.com';

  function setPageMeta(title, desc, image) {
    document.title = title + ' — Loomi';
    var setMeta = function (name, content, prop) {
      var sel = prop ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
      var el = document.querySelector(sel);
      if (!el) {
        el = document.createElement('meta');
        if (prop) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    var setLink = function (rel, href) {
      var el = document.querySelector('link[rel="' + rel + '"]');
      if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
      el.setAttribute('href', href);
    };
    if (desc) setMeta('description', desc);
    if (title) { setMeta('og:title', title + ' — Loomi', true); }
    if (desc)  { setMeta('og:description', desc, true); }
    setMeta('og:type', 'website', true);
    setMeta('og:url', SITE_URL + window.location.pathname, true);
    setLink('canonical', SITE_URL + window.location.pathname);
    /* og:image — use supplied image or fall back to site default */
    setMeta('og:image',
      image ? (image.indexOf('http') === 0 ? image : SITE_URL + '/' + image.replace(/^\//, ''))
            : SITE_URL + '/images/main%20hero%20image.jpg',
      true);
  }

  /* ─── SHARED INTERACTION FUNCTIONS (must be global) ──────────── */
  window.toggleAcc = function (btn) {
    var content = btn.nextElementSibling;
    var icon = btn.querySelector('span');
    var isOpen = content.classList.contains('open');
    content.classList.toggle('open', !isOpen);
    icon.textContent = isOpen ? '+' : '−';
  };

  window.toggleFaq = function (btn) {
    var content = btn.nextElementSibling;
    var icon = btn.querySelector('.faq-icon');
    var isOpen = content.classList.contains('open');
    content.classList.toggle('open', !isOpen);
    if (icon) icon.textContent = isOpen ? '+' : '−';
  };

  function updateAriaExpanded() {
    document.querySelectorAll('.mega-nav-item').forEach(function (item) {
      var link = item.querySelector('.nav-link[aria-haspopup]');
      if (link) link.setAttribute('aria-expanded', item.classList.contains('is-open'));
    });
  }

  function showBackdrop(show) {
    var bd = document.getElementById('mega-backdrop');
    if (bd) bd.classList.toggle('is-visible', !!show);
  }

  function closeAllMega() {
    document.querySelectorAll('.mega-nav-item.is-open')
      .forEach(function (i) { i.classList.remove('is-open'); });
    updateAriaExpanded();
    showBackdrop(false);
  }

  function openMega(item) {
    document.querySelectorAll('.mega-nav-item').forEach(function (i) {
      if (i !== item) i.classList.remove('is-open');
    });
    item.classList.add('is-open');
    updateAriaExpanded();
    showBackdrop(true);
  }

  window.toggleMobileMenu = function () {
    var drawer = document.getElementById('mobile-nav-drawer');
    var btn = document.getElementById('mobile-menu-btn');
    if (!drawer) return;
    var isOpen = drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', !isOpen);
    if (btn) {
      btn.classList.toggle('is-active', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen);
    }
  };

  window.toggleMobileSection = function (btn) {
    var sub = btn.nextElementSibling;
    var arrow = btn.querySelector('.mobile-nav-arrow');
    var isOpen = sub.classList.contains('is-open');
    sub.classList.toggle('is-open', !isOpen);
    btn.setAttribute('aria-expanded', !isOpen);
    if (arrow) arrow.textContent = isOpen ? '+' : '\u2212';
  };

  window.slide = function (id, dir) {
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollBy({ left: dir * (el.offsetWidth * 0.65), behavior: 'smooth' });
  };

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.mega-nav-item') && !e.target.closest('.mega-menu')) {
      closeAllMega();
    }
  });

  /* ─── INJECT NAV AND FOOTER ───────────────────────────────────── */
  var navEl = document.getElementById('loomi-nav');
  var footerEl = document.getElementById('loomi-footer');
  if (navEl) navEl.innerHTML = C.renderNav({ activePath: cfg.activePath || '' });
  if (footerEl) footerEl.innerHTML = C.renderFooter();

  /* ─── BACKDROP CLICK CLOSES MEGA ────────────────────────────── */
  var backdropEl = document.getElementById('mega-backdrop');
  if (backdropEl) {
    backdropEl.addEventListener('click', closeAllMega);
  }

  /* ─── JS HOVER HANDLERS FOR MEGA-MENU ─────────────────────────── */
  var _closeTimer = null;
  function attachMegaHover() {
    document.querySelectorAll('.mega-nav-item').forEach(function (item) {
      var menu = item.querySelector('.mega-menu');
      item.addEventListener('mouseenter', function () {
        clearTimeout(_closeTimer);
        openMega(item);
      });
      item.addEventListener('mouseleave', function () {
        _closeTimer = setTimeout(closeAllMega, 300);
      });
      if (menu) {
        menu.addEventListener('mouseenter', function () {
          clearTimeout(_closeTimer);
        });
        menu.addEventListener('mouseleave', function () {
          _closeTimer = setTimeout(closeAllMega, 300);
        });
      }
    });
  }
  attachMegaHover();

  /* ─── KEYBOARD / FOCUS HANDLERS ────────────────────────────── */
  document.querySelectorAll('.mega-nav-item').forEach(function (item) {
    item.addEventListener('focusin', function () {
      clearTimeout(_closeTimer);
      openMega(item);
    });
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) {
        _closeTimer = setTimeout(closeAllMega, 150);
      }
    });
  });

  /* ─── MOBILE ACCORDION ARIA ────────────────────────────────── */
  document.querySelectorAll('.mobile-nav-toggle').forEach(function (btn) {
    btn.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllMega();
  });

  var main = document.getElementById('loomi-main');
  if (!main) return;

  /* ─── DISPATCH ────────────────────────────────────────────────── */
  switch (cfg.type) {
    case 'home': break; /* homepage keeps its inline HTML */
    case 'plp':         renderPLP(main, cfg); break;
    case 'fiber':       renderFiberPage(main, cfg); break;
    case 'brand':       renderBrandPage(main, cfg); break;
    case 'directory':   renderDirectory(main, cfg); break;
    case 'pdp':         renderPDP(main, cfg); break;
    case 'the-standard': renderTheStandard(main, cfg); break;
    case 'utility':     renderUtility(main, cfg); break;
    case 'editorial':   renderEditorial(main, cfg); break;
    default: break;
  }

  /* ════════════════════════════════════════════════════════════════
     PLP
  ════════════════════════════════════════════════════════════════ */
  function renderPLP(container, cfg) {
    var genderDesc = {
      women: 'Browse women\'s natural fiber clothing from verified brands — cotton, linen, silk, cashmere and more. Every listing 90%+ natural.',
      men:   'Browse men\'s natural fiber clothing from verified brands. Every listing 90%+ natural fiber.',
      kids:  'Browse kids\' natural fiber clothing from verified brands. Every listing 90%+ natural.'
    };
    var plpDesc = (cfg.filters && genderDesc[cfg.filters.gender]) ||
      'Browse ' + (cfg.title || 'natural fiber clothing') + ' from verified brands. Every listing 90%+ natural.';
    setPageMeta(cfg.title || 'Shop', plpDesc);

    PLP.init(cfg);
    var base = PLP.getBase();
    var avail = cfg.availableFilters || ['sort', 'gender', 'category', 'fiber', 'brand', 'price'];

    container.innerHTML =
      '<div class="py-14 px-5 md:px-10">' +
        C.renderPLPHeader(cfg.title || 'Shop', base.length) +
        '<div id="plp-chips"></div>' +
        /* Mobile filter button */
        '<button class="plp-mobile-filter-btn md:hidden" onclick="PLP.openDrawer()">Filter + Sort</button>' +
        '<div class="flex gap-8">' +
          '<aside id="plp-sidebar" class="hidden md:block w-48 flex-shrink-0" style="padding-top:4px;"></aside>' +
          '<div class="flex-1">' +
            '<div id="plp-count" class="section-label mb-4 block md:hidden">' + base.length + ' pieces</div>' +
            '<div id="plp-grid" class="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10"></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      /* Mobile drawer */
      '<div id="plp-mobile-drawer" class="plp-mobile-drawer">' +
        '<div class="plp-drawer-header">' +
          '<span class="section-label">Filter + Sort</span>' +
          '<button class="plp-drawer-close" onclick="PLP.closeDrawer()">×</button>' +
        '</div>' +
        '<div id="plp-drawer-sidebar"></div>' +
        '<div style="margin-top:20px;">' +
          '<button onclick="PLP.clearAll()" class="plp-clear-btn" style="margin-right:12px;">clear all</button>' +
          '<button onclick="PLP.closeDrawer()" class="cta-link">view results</button>' +
        '</div>' +
      '</div>';

    PLP.render();
  }

  /* ════════════════════════════════════════════════════════════════
     FIBER PAGE
  ════════════════════════════════════════════════════════════════ */
  function renderFiberPage(container, cfg) {
    var fiber = D.FIBERS.find(function (f) { return f.slug === cfg.fiberSlug; });
    if (!fiber) { container.innerHTML = '<p class="p-10">Fiber not found.</p>'; return; }
    setPageMeta(fiber.name + ' Clothing',
      'Browse ' + fiber.name.toLowerCase() + ' clothing from natural fiber brands. ' + fiber.tagline +
      ' Every listing 90%+ natural.');

    var fiberCfg = {
      type: 'plp',
      title: fiber.name,
      filters: { fiberSlug: fiber.slug },
      availableFilters: ['sort', 'gender', 'category', 'brand', 'price', 'pureOnly']
    };
    PLP.init(fiberCfg);
    var base = PLP.getBase();

    /* Benefits list */
    var benefitsList = fiber.properties.map(function (p) {
      return '<li>' + p + '</li>';
    }).join('');

    container.innerHTML =
      /* Hero */
      (function () {
        var heroUrl = fiber.heroImage
          ? (r + fiber.heroImage)
          : ('https://picsum.photos/seed/' + fiber.heroSeed + '/1600/900');
        var srcsetAttr = fiber.heroImage
          ? ''
          : ' srcset="https://picsum.photos/seed/' + fiber.heroSeed + '/800/450 800w,' +
            'https://picsum.photos/seed/' + fiber.heroSeed + '/1200/675 1200w,' +
            'https://picsum.photos/seed/' + fiber.heroSeed + '/1600/900 1600w" sizes="100vw"';
        return '<section class="relative overflow-hidden" style="height:60vh;min-height:380px;">' +
          '<img src="' + heroUrl + '"' + srcsetAttr +
          ' alt="' + fiber.name + '" class="w-full h-full object-cover" style="filter:brightness(0.80);" />';
      })() +
        '<div class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,0.35) 0%,transparent 60%);"></div>' +
        '<div class="absolute bottom-12 left-6 md:left-10" data-motion="opacity from-bottom">' +
          '<h1 class="hero-headline">' + fiber.name + '</h1>' +
        '</div>' +
      '</section>' +

      /* Editorial + Benefits */
      '<section class="py-12 px-5 md:px-10 max-w-3xl" data-motion="opacity from-bottom">' +
        '<p style="font-size:13px;line-height:2;color:var(--text-muted);letter-spacing:0.04em;">' +
        fiber.editorial + '</p>' +
        '<ul class="fiber-benefits" style="margin-top:24px;">' + benefitsList + '</ul>' +
      '</section>' +

      /* PLP */
      '<section class="py-10 px-5 md:px-10" style="border-top:1px solid var(--border);">' +
        '<div class="flex items-end justify-between mb-3">' +
          '<h2 class="serif" style="font-size:clamp(1.4rem,3vw,2.2rem);font-weight:400;">' + fiber.name + ' Clothing</h2>' +
          '<span id="plp-count" class="section-label">' + base.length + ' pieces</span>' +
        '</div>' +
        '<div id="plp-chips"></div>' +
        '<button class="plp-mobile-filter-btn md:hidden" onclick="PLP.openDrawer()">Filter + Sort</button>' +
        '<div class="flex gap-8 mt-2">' +
          '<aside id="plp-sidebar" class="hidden md:block w-48 flex-shrink-0"></aside>' +
          '<div class="flex-1"><div id="plp-grid" class="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10"></div></div>' +
        '</div>' +
      '</section>' +
      /* Mobile drawer */
      '<div id="plp-mobile-drawer" class="plp-mobile-drawer">' +
        '<div class="plp-drawer-header">' +
          '<span class="section-label">Filter + Sort</span>' +
          '<button class="plp-drawer-close" onclick="PLP.closeDrawer()">×</button>' +
        '</div>' +
        '<div id="plp-drawer-sidebar"></div>' +
        '<div style="margin-top:20px;"><button onclick="PLP.closeDrawer()" class="cta-link">view results</button></div>' +
      '</div>';

    PLP.render();
  }

  /* ════════════════════════════════════════════════════════════════
     BRAND PAGE
  ════════════════════════════════════════════════════════════════ */
  function renderBrandPage(container, cfg) {
    var brand = D.BRANDS.find(function (b) { return b.slug === cfg.brandSlug; });
    if (!brand) { container.innerHTML = '<p class="p-10">Brand not found.</p>'; return; }
    setPageMeta(brand.name,
      brand.name + ': ' + brand.oneLiner + ' Shop on Loomi — verified 90%+ natural fiber.');

    var brandCfg = {
      type: 'brand',
      title: brand.name,
      filters: { brand: brand.slug },
      availableFilters: ['sort', 'gender', 'category', 'fiber', 'price']
    };
    PLP.init(brandCfg);
    var eligible = PLP.getBase();

    /* Carousel items */
    var carouselItems = eligible.slice(0, 8).map(function (p) {
      return C.renderProductCard(p, { mode: 'carousel', aspectRatio: '4/5' });
    }).join('');

    /* Criteria chips */
    var criteriaHTML = brand.criteria.map(function (c) {
      return '<span style="font-size:9px;letter-spacing:0.14em;border:1px solid var(--border);padding:5px 12px;color:var(--text-muted);">' + c + '</span>';
    }).join('');

    container.innerHTML =
      /* Hero */
      (function () {
        var heroUrl = brand.heroImage
          ? (r + brand.heroImage)
          : ('https://picsum.photos/seed/' + brand.heroSeed + '/1600/900');
        var srcsetAttr = brand.heroImage
          ? ''
          : ' srcset="https://picsum.photos/seed/' + brand.heroSeed + '/800/450 800w,' +
            'https://picsum.photos/seed/' + brand.heroSeed + '/1200/675 1200w,' +
            'https://picsum.photos/seed/' + brand.heroSeed + '/1600/900 1600w" sizes="100vw"';
        return '<section class="relative overflow-hidden" style="height:60vh;min-height:380px;">' +
          '<img src="' + heroUrl + '"' + srcsetAttr +
          ' alt="' + brand.name + '" class="w-full h-full object-cover" style="filter:brightness(0.78);" />';
      })() +
        '<div class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,0.4) 0%,transparent 60%);"></div>' +
        '<div class="absolute bottom-12 left-6 md:left-10" data-motion="opacity from-bottom">' +
          '<h1 class="hero-headline">' + brand.name + '.</h1>' +
          '<p style="font-size:11px;letter-spacing:0.1em;color:rgba(255,255,255,0.85);margin-top:10px;">' +
          brand.oneLiner + '</p>' +
        '</div>' +
      '</section>' +

      /* Trust strip */
      '<div class="trust-strip">' +
        '<div class="trust-item"><span class="chk">✓</span> All ' + brand.name + ' pieces listed here are ≥90% natural</div>' +
      '</div>' +

      /* Brand one-liner + fiber chart */
      '<section class="py-12 px-5 md:px-10">' +
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl">' +
          '<div>' +
            '<span class="section-label">' + brand.name + '</span>' +
            '<p style="margin-top:16px;font-size:13px;line-height:2;color:var(--text-muted);">' + brand.description + '</p>' +
          '</div>' +
          '<div>' +
            '<span class="section-label" style="display:block;margin-bottom:12px;">Typical Fiber Profile</span>' +
            C.renderFiberChart(brand.avgFibers) +
          '</div>' +
        '</div>' +
      '</section>' +

      /* Criteria */
      '<section class="px-5 md:px-10 pb-10">' +
        '<span class="section-label" style="display:block;margin-bottom:12px;">Brand Criteria</span>' +
        '<div class="flex flex-wrap gap-3">' + criteriaHTML + '</div>' +
      '</section>' +

      /* Carousel */
      '<section class="py-10 px-5 md:px-10" style="border-top:1px solid var(--border);">' +
        '<div class="flex items-center justify-between mb-7">' +
          '<span class="section-label">' + brand.name + ' Picks</span>' +
          '<div class="flex gap-1.5">' +
            '<button class="arrow-btn" onclick="slide(\'brand-carousel\',-1)">&#8249;</button>' +
            '<button class="arrow-btn" onclick="slide(\'brand-carousel\',1)">&#8250;</button>' +
          '</div>' +
        '</div>' +
        '<div id="brand-carousel" class="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">' +
          carouselItems +
        '</div>' +
      '</section>' +

      /* Full PLP */
      '<section class="py-10 px-5 md:px-10" style="border-top:1px solid var(--border);">' +
        '<div class="flex items-end justify-between mb-3">' +
          '<h2 class="serif" style="font-size:clamp(1.4rem,3vw,2.2rem);font-weight:400;">All ' + brand.name + '</h2>' +
          '<span id="plp-count" class="section-label">' + eligible.length + ' pieces</span>' +
        '</div>' +
        '<div id="plp-chips"></div>' +
        '<button class="plp-mobile-filter-btn md:hidden" onclick="PLP.openDrawer()">Filter + Sort</button>' +
        '<div class="flex gap-8 mt-2">' +
          '<aside id="plp-sidebar" class="hidden md:block w-48 flex-shrink-0"></aside>' +
          '<div class="flex-1"><div id="plp-grid" class="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10"></div></div>' +
        '</div>' +
      '</section>' +
      '<div id="plp-mobile-drawer" class="plp-mobile-drawer">' +
        '<div class="plp-drawer-header">' +
          '<span class="section-label">Filter + Sort</span>' +
          '<button class="plp-drawer-close" onclick="PLP.closeDrawer()">×</button>' +
        '</div>' +
        '<div id="plp-drawer-sidebar"></div>' +
        '<div style="margin-top:20px;"><button onclick="PLP.closeDrawer()" class="cta-link">view results</button></div>' +
      '</div>' +

      /* Live Pact catalog (pact brand only) */
      (brand.slug === 'pact'
        ? '<section class="py-12 px-5 md:px-10" style="border-top:1px solid var(--border);">' +
            '<div class="flex items-end justify-between mb-6">' +
              '<h2 class="serif" style="font-size:clamp(1.4rem,3vw,2.2rem);font-weight:400;">Live from Pact</h2>' +
              '<a href="https://wearpact.com" target="_blank" rel="noopener"' +
              ' style="font-size:9px;letter-spacing:0.1em;color:var(--text-muted);">wearpact.com ↗</a>' +
            '</div>' +
            '<div id="pact-filter-bar" class="pact-filter-bar"></div>' +
            '<div id="pact-live-grid" class="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 mt-6"></div>' +
          '</section>'
        : '');

    PLP.render();

    if (brand.slug === 'pact' && window.PACT_API) {
      window.PACT_API.init('pact-live-grid', 'pact-filter-bar');
    }
  }

  /* ════════════════════════════════════════════════════════════════
     DIRECTORY (fibers/ or brands/ index)
  ════════════════════════════════════════════════════════════════ */
  function renderDirectory(container, cfg) {
    var subtype = cfg.subtype || 'fibers';

    if (subtype === 'categories') {
      var cats = [
        { label: 'New In',         href: r + 'new/',           seed: 'loomi-browse-newin',    tagline: 'freshly curated' },
        { label: 'Women',          href: r + 'women/',         seed: 'loomi-browse-women',
          tagline: D.PRODUCTS.filter(function(p){ return p.gender.indexOf('women') !== -1; }).length + ' pieces' },
        { label: 'Men',            href: r + 'men/',           seed: 'loomi-browse-men',
          tagline: D.PRODUCTS.filter(function(p){ return p.gender.indexOf('men') !== -1; }).length + ' pieces' },
        { label: 'Kids',           href: r + 'kids/',          seed: 'loomi-browse-kids',
          tagline: D.PRODUCTS.filter(function(p){ return p.gender.indexOf('kids') !== -1; }).length + ' pieces' },
        { label: 'Natural Fibers', href: r + 'fibers/',        seed: 'loomi-browse-fibers',   tagline: D.FIBERS.length + ' natural fibers' },
        { label: 'The Standard',   href: r + 'the-standard/', seed: 'loomi-browse-standard', tagline: 'how we verify' },
        { label: 'Brands',         href: r + 'brands/',        seed: 'loomi-browse-brands',   tagline: D.BRANDS.length + ' certified brands' }
      ];
      var catTiles = cats.map(function(c) {
        return '<a href="' + c.href + '" class="directory-tile">' +
               '<div class="relative overflow-hidden" style="aspect-ratio:3/4;background:var(--bg-soft);">' +
               '<img src="https://picsum.photos/seed/' + c.seed + '/500/667" alt="' + c.label + '"' +
               ' class="product-img w-full h-full object-cover" loading="lazy"/>' +
               '<div class="absolute inset-0 flex items-end p-4"' +
               ' style="background:linear-gradient(to top,rgba(0,0,0,0.45),transparent 55%);">' +
               '<div>' +
               '<p style="font-size:14px;font-weight:400;color:#fff;letter-spacing:0.02em;">' + c.label + '</p>' +
               '<p style="font-size:9px;color:rgba(255,255,255,0.72);margin-top:3px;letter-spacing:0.1em;">' + c.tagline + '</p>' +
               '</div></div></div></a>';
      }).join('');
      container.innerHTML =
        '<div class="py-14 px-5 md:px-10">' +
          '<div class="flex items-end justify-between mb-10">' +
            '<h1 class="serif" style="font-size:clamp(2rem,4vw,3.5rem);font-weight:400;">Browse</h1>' +
            '<span class="section-label">' + cats.length + ' destinations</span>' +
          '</div>' +
          '<div class="directory-grid">' + catTiles + '</div>' +
        '</div>';
      return;
    }

    if (subtype === 'fibers') {
      var tiles = D.FIBERS.map(function (f) {
        return '<a href="' + r + 'fibers/' + f.slug + '/" class="directory-tile">' +
               '<div class="relative overflow-hidden" style="aspect-ratio:1/1;background:var(--bg-soft);">' +
               '<img src="' + (f.cardImage ? (r + f.cardImage) : ('https://picsum.photos/seed/' + f.cardSeed + '/500/500')) + '"' +
               ' alt="' + f.name + '" class="product-img w-full h-full object-cover" loading="lazy" />' +
               '<div class="absolute inset-0 flex items-end p-4" style="background:linear-gradient(to top,rgba(0,0,0,0.4),transparent 50%);">' +
               '<div><p style="font-size:13px;font-weight:400;color:#fff;">' + f.name + '</p>' +
               '<p style="font-size:9px;color:rgba(255,255,255,0.8);margin-top:2px;">' + f.tagline + '</p>' +
               '</div></div></div></a>';
      }).join('');

      container.innerHTML =
        '<div class="py-14 px-5 md:px-10">' +
          '<div class="flex items-end justify-between mb-10">' +
            '<h1 class="serif" style="font-size:clamp(2rem,4vw,3.5rem);font-weight:400;">Natural Fibers</h1>' +
            '<span class="section-label">' + D.FIBERS.length + ' fibers</span>' +
          '</div>' +
          '<p style="font-size:12px;line-height:2;color:var(--text-muted);max-width:480px;margin-bottom:40px;">' +
          'Every listing on Loomi is made from one or more of the fibers below — grown from the earth, not a laboratory. Click any fiber to learn more and browse the listings.' +
          '</p>' +
          '<div class="directory-grid">' + tiles + '</div>' +
        '</div>';

    } else {
      var isCertified = cfg.certified === true;
      var brandsToShow = isCertified
        ? D.BRANDS.filter(function (b) { return (b.ecoTier || 0) >= 3; })
        : D.BRANDS;

      /* Star SVG for certified badge on tiles */
      var starSVG = '<svg viewBox="0 0 12 12" fill="white" xmlns="http://www.w3.org/2000/svg" style="width:10px;height:10px;flex-shrink:0;" aria-hidden="true">' +
                    '<path d="M6 1.5L7.2 4.6L10.5 4.9L8.1 7L8.9 10.2L6 8.5L3.1 10.2L3.9 7L1.5 4.9L4.8 4.6Z"/></svg>';

      var btiles = brandsToShow.map(function (b) {
        var count = D.PRODUCTS.filter(function (p) { return p.brand === b.slug && p.naturalPct >= 90; }).length;
        var certBadge = (b.ecoTier || 0) >= 3
          ? '<span style="display:inline-flex;align-items:center;gap:3px;background:var(--green-dark);border-radius:9px;padding:2px 6px;margin-top:5px;">' + starSVG +
            '<span style="font-size:7px;letter-spacing:0.1em;color:#fff;text-transform:uppercase;">Certified</span></span>'
          : '';
        return '<a href="' + r + 'brands/' + b.slug + '/" class="directory-tile">' +
               '<div class="relative overflow-hidden" style="aspect-ratio:4/3;background:var(--bg-soft);">' +
               '<img src="' + (b.heroImage ? (r + b.heroImage) : ('https://picsum.photos/seed/' + b.heroSeed + '/600/450')) + '"' +
               ' alt="' + b.name + '" class="product-img w-full h-full object-cover" loading="lazy" />' +
               '<div class="absolute inset-0 flex items-end p-4" style="background:linear-gradient(to top,rgba(0,0,0,0.5),transparent 60%);">' +
               '<div><p style="font-size:13px;font-weight:400;color:#fff;">' + b.name + '</p>' +
               '<p style="font-size:9px;color:rgba(255,255,255,0.8);margin-top:2px;">' + b.tagline + '</p>' +
               '<p style="font-size:8px;color:rgba(255,255,255,0.7);margin-top:4px;">' + count + ' pieces</p>' +
               certBadge +
               '</div></div></div></a>';
      }).join('');

      var pageTitle = isCertified ? 'Loomi Pick' : 'Our Brands';
      var pageDesc = isCertified
        ? 'Every brand below has been independently verified for natural fibers, ethical sourcing, and third-party certifications — GOTS, B-Corp, Bluesign, or Fair Trade. Our highest standard.'
        : 'Every brand listed on Loomi meets one standard: at least 90% natural fibers in every product we feature. No exceptions.';

      container.innerHTML =
        '<div class="py-14 px-5 md:px-10">' +
          (isCertified
            ? '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">' +
              '<span class="section-label" style="color:var(--green);">Brands</span>' +
              '</div>'
            : '') +
          '<div class="flex items-end justify-between mb-10">' +
            '<h1 class="serif" style="font-size:clamp(2rem,4vw,3.5rem);font-weight:400;">' + pageTitle + '</h1>' +
            '<span class="section-label">' + brandsToShow.length + ' brands</span>' +
          '</div>' +
          '<p style="font-size:12px;line-height:2;color:var(--text-muted);max-width:480px;margin-bottom:40px;">' + pageDesc + '</p>' +
          '<div class="directory-grid">' + btiles + '</div>' +
          (isCertified
            ? '<div style="margin-top:40px;padding-top:32px;border-top:1px solid var(--border);">' +
              '<a href="' + r + 'brands/" style="font-size:10px;letter-spacing:0.1em;color:var(--text-muted);text-decoration:underline;text-underline-offset:3px;">View all brands →</a>' +
              '</div>'
            : '') +
        '</div>';
    }
  }

  /* ════════════════════════════════════════════════════════════════
     PRODUCT DETAIL PAGE
  ════════════════════════════════════════════════════════════════ */
  function renderPDP(container, cfg) {
    var slug = new URLSearchParams(window.location.search).get('slug');
    var product = D.PRODUCTS.find(function (p) { return p.slug === slug; });

    if (!product) {
      container.innerHTML =
        '<div class="empty-state" style="padding:80px 20px;">' +
          '<p class="empty-state-title">Product not found.</p>' +
          '<p class="empty-state-desc">The product you\'re looking for doesn\'t exist or has been removed.</p>' +
          '<a href="' + r + 'new/" class="cta-link">browse new arrivals</a>' +
        '</div>';
      return;
    }

    var brand = D.BRANDS.find(function (b) { return b.slug === product.brand; });
    var isCertified = brand && (brand.ecoTier || 0) >= 3;
    setPageMeta(product.name,
      product.name + (brand ? ' by ' + brand.name : '') + '. ' +
      product.naturalPct + '% natural fibers. ' + (product.description || (brand && brand.oneLiner) || ''),
      product.image);

    /* ── Product JSON-LD structured data ── */
    (function () {
      var ld = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': product.name,
        'image': product.image || '',
        'description': product.description || (brand ? brand.oneLiner : '') || '',
        'brand': brand ? { '@type': 'Brand', 'name': brand.name } : undefined,
        'offers': {
          '@type': 'Offer',
          'price': String(product.salePrice !== null ? product.salePrice : product.price),
          'priceCurrency': 'USD',
          'availability': 'https://schema.org/InStock',
          'url': product.shopUrl || ''
        }
      };
      var existing = document.querySelector('script[data-loomi-ld="product"]');
      if (existing) existing.remove();
      var s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-loomi-ld', 'product');
      s.textContent = JSON.stringify(ld);
      document.head.appendChild(s);
    })();

    var priceHTML = product.salePrice
      ? '<span style="text-decoration:line-through;color:var(--text-muted);margin-right:8px;">$' + product.price + '</span>' +
        '<span style="color:#9a3d3d;">$' + product.salePrice + '</span>'
      : '$' + product.price;

    /* ── Sizes ── */
    var sizesHTML = '';
    if (product.sizes && product.sizes.length) {
      sizesHTML =
        '<div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border);">' +
          '<p style="font-size:9px;letter-spacing:0.12em;color:var(--text-muted);margin-bottom:10px;">Sizes available</p>' +
          '<div class="pdp-sizes">' +
          product.sizes.map(function (s) { return '<span class="pdp-size">' + s + '</span>'; }).join('') +
          '</div>' +
        '</div>';
    }

    /* ── Description / about this piece ── */
    var aboutText = product.description || (brand && brand.oneLiner) || '';
    var aboutHTML = aboutText
      ? '<div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border);">' +
          '<p style="font-size:9px;letter-spacing:0.12em;color:var(--text-muted);margin-bottom:8px;">About this piece</p>' +
          '<p style="font-size:12px;color:var(--text);line-height:1.9;">' + aboutText + '</p>' +
        '</div>'
      : '';

    /* ── Why it's here: ring + criteria chips ── */
    var criteriaChips = brand && brand.criteria && brand.criteria.length
      ? '<div class="pdp-criteria">' +
        brand.criteria.map(function (c) { return '<span class="pdp-criterion">' + c + '</span>'; }).join('') +
        '</div>'
      : '';
    var whyHTML = isCertified
      ? '<div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border);">' +
          '<p style="font-size:9px;letter-spacing:0.12em;color:var(--text-muted);margin-bottom:12px;">Why it\'s here</p>' +
          '<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">' +
            '<div>' +
              '<span class="badge-certified" style="display:inline-flex;margin-bottom:8px;"><span class="badge-certified-text">\u2726\ufe0e Loomi Pick</span></span>' +
              criteriaChips +
            '</div>' +
          '</div>' +
        '</div>'
      : '<div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border);">' +
          criteriaChips +
        '</div>';

    /* ── Affiliate CTA ── */
    var shopLink = product.shopUrl || (brand && brand.shopUrl) || '#';
    var shopName = brand ? brand.name : 'Brand';
    var ctaHTML =
      '<a href="' + shopLink + '" target="_blank" rel="nofollow sponsored" class="pdp-shop-btn">' +
        'Shop at ' + shopName + ' →' +
      '</a>';

    /* ── Affiliate note ── */
    var metaHTML = '<p class="pdp-meta" style="color:var(--text-muted);">You\'ll be taken to ' + (brand ? brand.name : 'the brand') + '\'s site to complete your purchase.</p>';

    /* ── Related products: same brand or fiber, max 4 ── */
    var related = D.PRODUCTS.filter(function (p) {
      if (p.slug === product.slug) return false;
      var sameBrand = p.brand === product.brand;
      var sameFiber = p.fibers.some(function (f) {
        return product.fibers.some(function (pf) { return pf.slug === f.slug; });
      });
      return sameBrand || sameFiber;
    }).slice(0, 4);

    var relatedHTML = related.length
      ? '<section class="py-10 px-5 md:px-10" style="border-top:1px solid var(--border);">' +
          '<span class="section-label" style="display:block;margin-bottom:20px;">You may also like</span>' +
          '<div class="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">' +
          related.map(function (p) { return C.renderProductCard(p); }).join('') +
          '</div>' +
        '</section>'
      : '';

    container.innerHTML =
      '<div class="pdp-grid">' +

        /* ── Left: image ── */
        '<div class="pdp-image-wrap">' +
          (isCertified
            ? '<div class="card-badges" style="position:absolute;top:16px;left:16px;z-index:2;">' +
                '<span class="badge-certified"><span class="badge-certified-text">\u2726\ufe0e Loomi Pick</span></span>' +
              '</div>'
            : '') +
          '<img src="' + product.image + '" alt="' + product.name + '"' +
          ' class="w-full h-full object-cover" style="min-height:50vh;" />' +
        '</div>' +

        /* ── Right: info ── */
        '<div class="pdp-info">' +

          /* Brand link */
          (brand
            ? '<a href="' + r + 'brands/' + brand.slug + '/" class="pdp-brand-link">' + brand.name + '</a>'
            : '') +

          /* Name + price */
          '<h1 class="pdp-title">' + product.name + '</h1>' +
          '<p class="pdp-price">' + priceHTML + '</p>' +

          /* Fiber chart */
          '<div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border);">' +
            '<p style="font-size:9px;letter-spacing:0.12em;color:var(--text-muted);margin-bottom:10px;">Composition</p>' +
            C.renderFiberChart(product.fibers) +
          '</div>' +

          /* Sizes */
          sizesHTML +

          /* About this piece */
          aboutHTML +

          /* Why it's here */
          whyHTML +

          /* CTA */
          ctaHTML +
          metaHTML +

          /* Standard link */
          '<div style="margin-top:14px;">' +
            '<a href="' + r + 'the-standard/" style="font-size:9px;letter-spacing:0.12em;color:var(--text-muted);text-decoration:underline;text-underline-offset:3px;">How Loomi checks listings →</a>' +
          '</div>' +

        '</div>' +
      '</div>' +
      relatedHTML;
  }

  /* ════════════════════════════════════════════════════════════════
     THE STANDARD
  ════════════════════════════════════════════════════════════════ */
  function renderTheStandard(container, cfg) {
    var sub = cfg.subpage || 'main';

    var pages = {
      'main': renderStandardMain,
      'how-we-verify': renderStandardVerify,
      'fiber-guide': renderStandardFiberGuide,
      'brand-criteria': renderStandardBrandCriteria
    };

    var fn = pages[sub] || renderStandardMain;
    container.innerHTML = fn();
  }

  function standardNav() {
    var sub = cfg.subpage || 'index';
    function tabStyle(id) {
      var active = sub === id;
      return 'font-size:10px;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;display:inline-block;padding-bottom:8px;margin-bottom:-1px;' +
        'color:' + (active ? 'var(--text);font-weight:500' : 'var(--text-muted);font-weight:400') + ';' +
        'border-bottom:' + (active ? '2px solid var(--text)' : '2px solid transparent') + ';';
    }
    return '<div class="px-5 md:px-10 flex flex-wrap gap-6" style="padding-top:24px;border-bottom:1px solid var(--border);">' +
      '<a href="' + r + 'the-standard/" style="' + tabStyle('index') + '">The Standard</a>' +
      '<a href="' + r + 'the-standard/how-we-verify/" style="' + tabStyle('how-we-verify') + '">How We Verify</a>' +
      '<a href="' + r + 'the-standard/fiber-guide/" style="' + tabStyle('fiber-guide') + '">Fiber Guide</a>' +
      '<a href="' + r + 'the-standard/brand-criteria/" style="' + tabStyle('brand-criteria') + '">Brand Criteria</a>' +
      '</div>';
  }

  function renderStandardMain() {
    /* ── Anchor nav ──────────────────────────────────────────────── */
    var anchorNav =
      '<div class="ts-anchor-nav">' +
        '<a href="#ts-problem">the problem</a>' +
        '<a href="#ts-natural">why natural</a>' +
        '<a href="#ts-rule">our rule</a>' +
        '<a href="#ts-sources">the sources</a>' +
      '</div>';

    /* ── Stat grid ───────────────────────────────────────────────── */
    var stats = [
      { num: '700,000', label: 'Microplastic fibers shed per wash of a single synthetic garment', ref: '1' },
      { num: '35%',     label: 'Of all ocean microplastics come from washing synthetic clothes', ref: '2' },
      { num: '80 lbs',  label: 'Of clothing discarded per American every year', ref: '3' },
      { num: '200+ yrs', label: 'For synthetic fibers to break down — they just become smaller plastic', ref: '3' }
    ];
    var statGrid =
      '<div class="ts-stat-grid" data-motion="opacity">' +
        stats.map(function (s) {
          return '<div class="ts-stat-cell">' +
            '<div class="ts-stat-num">' + s.num + '</div>' +
            '<div class="ts-stat-label">' + s.label +
              ' <sup class="ts-ref"><a href="#ts-fn-' + s.ref + '">' + s.ref + '</a></sup>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>';

    /* ── Claim blocks ────────────────────────────────────────────── */
    var claims = [
      {
        text: '"Microplastics have been found in human blood, lungs, placentas, and breast milk."',
        source: 'PMC NCBI (2024) — microplastics in human tissue',
        url: 'https://pmc.ncbi.nlm.nih.gov',
        ref: '4'
      },
      {
        text: '"Polyester is made from the same petroleum as plastic water bottles — it\'s PET, a plastic, in fiber form."',
        source: 'Wikipedia / Ecoaya — PET polymer',
        url: 'https://en.wikipedia.org/wiki/Polyethylene_terephthalate',
        ref: '5'
      },
      {
        text: '"Many synthetic fabrics contain phthalates, BPA, and PFAS — chemicals classified as endocrine disruptors by the U.S. National Institute of Environmental Health Sciences."',
        source: 'NIEHS / Discover Magazine — chemicals in synthetic textiles',
        url: 'https://www.niehs.nih.gov/health/topics/agents/endocrine',
        ref: '6'
      },
      {
        text: '"PFAS \'forever chemicals\' — used in performance and water-resistant fabrics — are linked to hormonal disruption and reduced fertility."',
        source: 'Vibrant Body Company — PFAS health impacts',
        url: 'https://vibrantbodycompany.com',
        ref: '7'
      }
    ];
    var claimBlocks = claims.map(function (c) {
      return '<div class="ts-claim" data-motion="opacity from-bottom">' +
        '<p class="ts-claim-text">' + c.text + ' <sup class="ts-ref"><a href="#ts-fn-' + c.ref + '">' + c.ref + '</a></sup></p>' +
        '<p class="ts-claim-source">Source: <a href="' + c.url + '" target="_blank" rel="noopener">' + c.source + '</a></p>' +
      '</div>';
    }).join('');

    /* ── Fiber benefit rows ──────────────────────────────────────── */
    var fibers = [
      {
        name: 'Organic Cotton',
        claim: 'Breathable and hypoallergenic. Conventional cotton covers just 2.5% of farmland but accounts for roughly 16% of global insecticide use. Organic cotton, used by Loomi Pick brands, is grown without synthetic pesticides.',
        refs: ['8', '9']
      },
      {
        name: 'Merino Wool',
        claim: 'Naturally thermoregulating and antimicrobial — no synthetic chemistry required. The fiber\'s microscopic crimp structure wicks moisture, adapts to body temperature, and resists odor-causing bacteria on its own.',
        refs: ['10']
      },
      {
        name: 'Hemp',
        claim: 'Gets softer with repeated washing. Hemp cultivation generally requires fewer synthetic inputs than conventional cotton and uses significantly less water per kilogram of fibre — though exact figures vary by farming practice.',
        refs: ['11']
      }
    ];
    var fiberRows = fibers.map(function (f) {
      var refLinks = f.refs.map(function (r) {
        return '<sup class="ts-ref"><a href="#ts-fn-' + r + '">' + r + '</a></sup>';
      }).join(' ');
      return '<div class="ts-fiber-row" data-motion="opacity from-bottom">' +
        '<div class="ts-fiber-name">' + f.name + '</div>' +
        '<div class="ts-fiber-claim">' + f.claim + ' ' + refLinks + '</div>' +
      '</div>';
    }).join('');

    var gotsBlock =
      '<div class="ts-gots-block" data-motion="opacity from-bottom">' +
        '<p style="font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:var(--green);margin-bottom:10px;">GOTS Certification</p>' +
        '<p style="font-family:var(--font-display);font-size:clamp(1.1rem,2.2vw,1.6rem);font-weight:300;font-style:italic;line-height:1.5;color:var(--text);margin-bottom:12px;">' +
          '"GOTS certification means no toxic dyes, no heavy metals, no formaldehyde in finishing — verified at every stage of the supply chain, not just the final garment."' +
          ' <sup class="ts-ref"><a href="#ts-fn-12">12</a></sup>' +
        '</p>' +
        '<p style="font-size:9px;letter-spacing:0.1em;color:var(--text-muted);">Source: <a href="https://global-standard.org" target="_blank" rel="noopener" style="color:var(--green);text-decoration:underline;">Global-Standard.org</a> / <a href="https://orbasics.com" target="_blank" rel="noopener" style="color:var(--green);text-decoration:underline;">Orbasics</a></p>' +
        '<p style="font-size:11px;letter-spacing:0.03em;color:var(--text-muted);margin-top:10px;">Loomi Pick brands hold one or more of these certifications.</p>' +
      '</div>';

    /* ── Footnotes ───────────────────────────────────────────────── */
    var footnotes = [
      { n: 1,  text: 'Napper & Thompson (2016), <em>Science Direct</em> — a 6 kg wash of acrylic fabric can release over 700,000 microfibers per cycle.', url: 'https://www.sciencedirect.com' },
      { n: 2,  text: 'IUCN / Institution of Mechanical Engineers — approximately 35% of ocean microplastics originate from washing synthetic textiles.', url: 'https://www.iucn.org' },
      { n: 3,  text: 'Earth.org / Road Runner Waste Management — Americans discard ~80 lbs of clothing per year; synthetic fibers persist in landfill for 200+ years.', url: 'https://earth.org' },
      { n: 4,  text: 'PMC NCBI (2024) — microplastics detected in human placenta, lungs, liver, urine, sputum, breast milk, and blood.', url: 'https://pmc.ncbi.nlm.nih.gov' },
      { n: 5,  text: 'Wikipedia / Ecoaya — polyester (PET) is the same polymer used in plastic water bottles, derived from petroleum.', url: 'https://en.wikipedia.org/wiki/Polyethylene_terephthalate' },
      { n: 6,  text: 'U.S. National Institute of Environmental Health Sciences (NIEHS) / Discover Magazine — phthalates, BPA, and PFAS classified as endocrine disruptors found in synthetic garments.', url: 'https://www.niehs.nih.gov/health/topics/agents/endocrine' },
      { n: 7,  text: 'Vibrant Body Company — PFAS exposure linked to reduced fertility, hormonal disruption, and reproductive disorders.', url: 'https://vibrantbodycompany.com' },
      { n: 8,  text: 'EJF Foundation — conventional cotton covers ~2.5% of cultivated land but uses ~16% of global insecticides.', url: 'https://ejfoundation.org' },
      { n: 9,  text: 'Lucid Collective — organic cotton grown without synthetic pesticides; promoted as hypoallergenic and skin-gentle.', url: 'https://lucid-collective.com' },
      { n: 10, text: 'COSH — Merino wool\'s thermoregulation and antimicrobial properties are intrinsic to fiber structure, not added finishes.', url: 'https://cosh.ca' },
      { n: 11, text: 'Citizen Wolf / Heartland — hemp requires low to zero pesticides; uses a fraction of cotton\'s water per kg of fiber; softens with washing.', url: 'https://citizenwolf.com' },
      { n: 12, text: 'Global-Standard.org / Orbasics — GOTS prohibits azo dyes releasing carcinogenic amines, formaldehyde finishes, chlorine bleach, and heavy metals.', url: 'https://global-standard.org' }
    ];
    var footnoteItems = footnotes.map(function (f) {
      return '<li id="ts-fn-' + f.n + '">' +
        f.text + ' <a href="' + f.url + '" target="_blank" rel="noopener">↗</a>' +
      '</li>';
    }).join('');

    /* ── Assemble page ───────────────────────────────────────────── */
    return standardNav() +

      /* Hero */
      '<div class="py-16 px-5 md:px-10" style="border-bottom:1px solid var(--border);max-width:760px;">' +
        '<span class="section-label" style="color:var(--green);">The Loomi Standard</span>' +
        '<h1 class="serif" data-motion="opacity from-bottom" style="font-size:clamp(2.4rem,6vw,4.5rem);font-weight:400;line-height:1.1;margin-top:16px;margin-bottom:24px;">' +
          'Your clothes touch<br>you 24 hours a day.' +
        '</h1>' +
        '<p class="editorial-prose" data-motion="opacity from-bottom" style="max-width:560px;font-size:13px;line-height:2;color:var(--text-muted);">' +
          'Most people read food labels. Almost no one reads clothing labels. That\'s not because clothing is safe — it\'s because clothing isn\'t regulated the same way. We built Loomi to change that.' +
        '</p>' +
      '</div>' +

      /* Sticky anchor nav */
      anchorNav +

      /* §1 — The problem */
      '<section id="ts-problem" style="border-bottom:1px solid var(--border);">' +
        '<div class="px-5 md:px-10 pt-12 pb-6">' +
          '<span class="section-label" style="color:var(--green);">The Problem</span>' +
          '<h2 class="serif" style="font-size:clamp(1.6rem,4vw,3rem);font-weight:400;line-height:1.15;margin-top:12px;margin-bottom:4px;">' +
            'Synthetic fabrics aren\'t just<br>an environmental problem.' +
          '</h2>' +
          '<p style="font-size:11px;color:var(--text-muted);margin-top:8px;margin-bottom:32px;">' +
            'They\'re a body problem. And the data is clear.' +
          '</p>' +
        '</div>' +
        statGrid +
        '<div class="px-5 md:px-10 pb-12">' +
          claimBlocks +
        '</div>' +
      '</section>' +

      /* §2 — Why natural */
      '<section id="ts-natural" style="border-bottom:1px solid var(--border);">' +
        '<div class="px-5 md:px-10 pt-12 pb-10">' +
          '<span class="section-label" style="color:var(--green);">Why Natural</span>' +
          '<h2 class="serif" style="font-size:clamp(1.6rem,4vw,3rem);font-weight:400;line-height:1.15;margin-top:12px;margin-bottom:8px;">' +
            'Natural fibers aren\'t just<br>better for the planet.' +
          '</h2>' +
          '<p style="font-size:11px;color:var(--text-muted);margin-bottom:40px;">' +
            'They\'re better for the body wearing them.' +
          '</p>' +
          fiberRows +
          gotsBlock +
        '</div>' +
      '</section>' +

      /* §3 — Our rule */
      '<section id="ts-rule" style="border-bottom:1px solid var(--border);">' +
        '<div class="px-5 md:px-10 py-12 max-w-2xl">' +
          '<span class="section-label" style="color:var(--green);">Our Rule</span>' +
          '<h2 class="serif" style="font-size:clamp(1.6rem,4vw,3rem);font-weight:400;line-height:1.15;margin-top:12px;margin-bottom:24px;">' +
            'No more label<br>detective work.' +
          '</h2>' +
          '<div class="editorial-prose">' +
            '<p>We built Loomi because buying safe clothes shouldn\'t require two hours of label-reading and supply-chain research. The Loomi Standard is our answer: a single, non-negotiable threshold every garment must pass before it appears on our site.</p>' +
            '<p><strong style="color:var(--text);">The rule:</strong> At least 90% of every garment\'s composition must be natural fibers — cotton, linen, merino wool, cashmere, silk, hemp, or alpaca. No exceptions. No greenwashing. No hidden polyester.</p>' +
            '<p>Why 90% and not 100%? Because some natural-fiber garments use a small percentage of elastane for fit — excluding stretch would mean excluding perfectly natural-forward pieces. The 10% maximum synthetic allowance is a pragmatic threshold, not a compromise on values. Every synthetic fiber is flagged clearly on every product page.</p>' +
          '</div>' +
          '<div style="margin-top:40px;display:flex;gap:20px;flex-wrap:wrap;">' +
            '<a href="' + r + 'the-standard/how-we-verify/" class="cta-link">How we verify →</a>' +
            '<a href="' + r + 'the-standard/fiber-guide/" class="cta-link">Fiber guide →</a>' +
            '<a href="' + r + 'the-standard/brand-criteria/" class="cta-link">Brand criteria →</a>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* Footnotes */
      '<section id="ts-sources" class="px-5 md:px-10">' +
        '<div class="ts-footnotes">' +
          '<span class="section-label">Sources</span>' +
          '<ol>' + footnoteItems + '</ol>' +
        '</div>' +
      '</section>';
  }

  function renderStandardVerify() {
    var steps = [
      { n: '01', title: 'Brand Application', body: 'Every brand applies to be listed on Loomi. We review their supply chain documentation, certifications, and fibre sourcing before a single product goes live.' },
      { n: '02', title: 'Garment Submission', body: 'Each garment is submitted with its complete care label composition data. We cross-reference this against certification documents where available.' },
      { n: '03', title: 'Natural Percentage Calculation', body: 'We calculate the exact percentage of natural fibers by weight. Elastane and other synthetics are flagged. Any garment below 90% natural is rejected — automatically, not manually.' },
      { n: '04', title: 'Fiber Transparency Display', body: 'Approved garments display our full fiber composition chart — not just "100% cotton" but the exact breakdown of every fiber, with colour-coded bars and percentages.' },
      { n: '05', title: 'Ongoing Monitoring', body: 'Brands are reviewed annually. If a product\'s composition changes without notification, it is removed from the site until re-verified.' }
    ];
    var stepsHTML = steps.map(function (s) {
      return '<div class="standard-step">' +
             '<div class="standard-step-num">' + s.n + '</div>' +
             '<div class="standard-step-body"><h3>' + s.title + '</h3><p>' + s.body + '</p></div>' +
             '</div>';
    }).join('');

    return standardNav() +
      '<div class="py-14 px-5 md:px-10 max-w-2xl">' +
        '<span class="section-label" style="color:var(--green);">How We Verify</span>' +
        '<h1 class="serif" style="font-size:clamp(2rem,4.5vw,3.5rem);font-weight:400;line-height:1.1;margin-top:16px;margin-bottom:32px;">Every garment,<br>checked.</h1>' +
        stepsHTML +
      '</div>';
  }

  function renderStandardFiberGuide() {
    var cards = D.FIBERS.map(function (f) {
      /* Rating bar helper */
      function ratingBar(val) {
        var bars = '';
        for (var i = 1; i <= 5; i++) {
          bars += '<div style="width:16px;height:3px;border-radius:1px;background:' + (i <= val ? 'var(--green)' : 'var(--border)') + ';"></div>';
        }
        return '<div style="display:flex;gap:2px;">' + bars + '</div>';
      }
      return '<div style="padding:28px 0;border-bottom:1px solid var(--border);">' +
             '<div style="display:flex;align-items:center;gap:16px;margin-bottom:12px;">' +
             '<div style="width:40px;height:40px;border-radius:2px;overflow:hidden;flex-shrink:0;background:' + f.color + ';">' +
             (f.cardImage ? '<img src="' + r + f.cardImage + '" alt="' + f.name + '" style="width:100%;height:100%;object-fit:cover;" />' : '') +
             '</div>' +
             '<div><h3 class="section-label">' + f.name + '</h3>' +
             '<p style="font-size:10px;color:var(--text-muted);margin-top:2px;">' + f.tagline + '</p></div>' +
             '</div>' +
             '<p style="font-size:11px;line-height:2;color:var(--text-muted);max-width:480px;margin-bottom:14px;">' + f.editorial + '</p>' +
             '<div style="display:flex;gap:24px;flex-wrap:wrap;">' +
             '<div><p style="font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-muted);margin-bottom:6px;">Eco Score</p>' + ratingBar(f.ecoRating) + '</div>' +
             '<div><p style="font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-muted);margin-bottom:6px;">Softness</p>' + ratingBar(f.softnessRating) + '</div>' +
             '<div><p style="font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-muted);margin-bottom:6px;">Durability</p>' + ratingBar(f.durabilityRating) + '</div>' +
             '</div>' +
             '<div style="margin-top:14px;">' +
             '<a href="' + r + 'fibers/' + f.slug + '/" class="cta-link">Shop ' + f.name + ' →</a>' +
             '</div>' +
             '</div>';
    }).join('');

    return standardNav() +
      '<div class="py-14 px-5 md:px-10 max-w-2xl">' +
        '<span class="section-label" style="color:var(--green);">Fiber Guide</span>' +
        '<h1 class="serif" style="font-size:clamp(2rem,4.5vw,3.5rem);font-weight:400;line-height:1.1;margin-top:16px;margin-bottom:32px;">The fibers<br>we trust.</h1>' +
        cards +
      '</div>';
  }

  function renderStandardBrandCriteria() {
    return standardNav() +
      '<div class="py-14 px-5 md:px-10 max-w-2xl">' +
        '<span class="section-label" style="color:var(--green);">Brand Criteria</span>' +
        '<h1 class="serif" style="font-size:clamp(2rem,4.5vw,3.5rem);font-weight:400;line-height:1.1;margin-top:16px;margin-bottom:24px;">What it takes<br>to be listed.</h1>' +
        '<div class="editorial-prose">' +
          '<h3>The 90% rule</h3>' +
          '<p>Every garment a brand sells through Loomi must be at least 90% natural fibers by composition. This is a hard threshold enforced at the data layer — not a guideline, not a goal, not a marketing claim.</p>' +
          '<h3>Supply Chain Transparency</h3>' +
          '<p>Brands must be able to name their fabric mills and final assembly factories. We don\'t require perfection — we require honesty. Brands in active improvement are welcome if they meet the fibre threshold.</p>' +
          '<h3>Certifications (Preferred, Not Required)</h3>' +
          '<p>GOTS, Bluesign, Responsible Wool Standard, Fair Trade, B-Corp — we look for certifications as signals of seriousness, not as gatekeepers. A small-batch mill with no certification but full transparency may be listed; a large brand with a certification but hidden synthetics won\'t be.</p>' +
          '<h3>Ongoing Compliance</h3>' +
          '<p>Brands are reviewed annually. Changes to product composition must be notified before going live. Violations result in immediate product removal pending re-verification.</p>' +
        '</div>' +
        '<div style="margin-top:32px;">' +
          '<a href="mailto:brands@loomi.com" class="cta-link">Apply to be listed →</a>' +
        '</div>' +
      '</div>';
  }

  /* ════════════════════════════════════════════════════════════════
     UTILITY PAGES
  ════════════════════════════════════════════════════════════════ */
  function renderUtility(container, cfg) {
    var sub = cfg.subtype || 'bag';
    switch (sub) {
      case 'search':    renderSearch(container); break;
      case 'bag':       renderBag(container); break;
      case 'account':   renderAccount(container, 'account'); break;
      case 'orders':    renderAccount(container, 'orders'); break;
      case 'wishlist':  renderAccount(container, 'wishlist'); break;
      default: container.innerHTML = '<div class="empty-state"><p class="empty-state-title">Coming soon.</p></div>';
    }
  }

  function renderSearch(container) {
    var allProducts = D.PRODUCTS;

    container.innerHTML =
      '<div class="py-14 px-5 md:px-10">' +
        '<div class="text-center mb-10">' +
          '<h1 class="serif" style="font-size:clamp(2rem,4vw,3rem);font-weight:400;margin-bottom:16px;">Search</h1>' +
        '</div>' +
        '<div class="search-input-wrap">' +
          '<input type="text" id="search-input" class="search-input" placeholder="search pieces, fibers, brands..." autocomplete="off" oninput="doSearch(this.value)" />' +
          '<span style="font-size:14px;color:var(--text-muted);">&#8981;</span>' +
        '</div>' +
        '<div id="search-count" class="section-label mb-4" style="text-align:center;"></div>' +
        '<div id="search-grid" class="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10"></div>' +
      '</div>';

    window.doSearch = function (q) {
      var qLow = q.trim().toLowerCase();
      var results = !qLow ? [] : allProducts.filter(function (p) {
        return p.name.toLowerCase().indexOf(qLow) !== -1 ||
               p.brand.toLowerCase().indexOf(qLow) !== -1 ||
               p.fibers.some(function (f) { return f.name.toLowerCase().indexOf(qLow) !== -1; });
      });
      var count = document.getElementById('search-count');
      var grid = document.getElementById('search-grid');
      if (count) count.textContent = qLow ? results.length + ' pieces found' : '';
      if (grid) {
        if (!qLow) { grid.innerHTML = ''; return; }
        if (!results.length) {
          grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;padding:40px 0;">' +
            '<p class="empty-state-title">No results for "' + q + '"</p>' +
            '</div>';
          return;
        }
        grid.innerHTML = results.map(function (p) { return C.renderProductCard(p); }).join('');
      }
    };
  }

  function renderBag(container) {
    container.innerHTML =
      '<div class="py-14 px-5 md:px-10" style="min-height:60vh;">' +
        '<h1 class="serif" style="font-size:clamp(2rem,4vw,3rem);font-weight:400;margin-bottom:32px;border-bottom:1px solid var(--border);padding-bottom:16px;">Your Bag</h1>' +
        '<div class="empty-state" style="padding:60px 0;">' +
          '<div class="empty-state-icon">○</div>' +
          '<p class="empty-state-title">Your bag is empty.</p>' +
          '<p class="empty-state-desc">Nothing but nature here — yet. Start shopping.</p>' +
          '<a href="' + r + 'new/" class="cta-link" style="margin-top:8px;display:inline-block;">shop new arrivals →</a>' +
        '</div>' +
      '</div>';
  }

  function renderAccount(container, section) {
    var tabs = [
      { key: 'account',  label: 'Overview',   href: r + 'account/' },
      { key: 'orders',   label: 'Orders',      href: r + 'account/orders/' },
      { key: 'wishlist', label: 'Wishlist',    href: r + 'account/wishlist/' }
    ];
    var tabHTML = tabs.map(function (t) {
      var active = t.key === section;
      return '<a href="' + t.href + '" style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;' +
             'color:' + (active ? 'var(--text)' : 'var(--text-muted)') + ';text-decoration:' + (active ? 'underline' : 'none') + ';' +
             'text-underline-offset:4px;">' + t.label + '</a>';
    }).join('');

    var bodyHTML = {
      account: '<div class="empty-state" style="padding:60px 0;"><div class="empty-state-icon">○</div><p class="empty-state-title">Sign in to your account.</p><p class="empty-state-desc">Track orders, save favourites, and manage your Loomi profile.</p><a href="#" class="cta-link">sign in →</a></div>',
      orders:  '<div class="empty-state" style="padding:60px 0;"><div class="empty-state-icon">○</div><p class="empty-state-title">No orders yet.</p><p class="empty-state-desc">Your orders will appear here once you\'ve made a purchase.</p><a href="' + r + 'new/" class="cta-link">start shopping →</a></div>',
      wishlist:'<div class="empty-state" style="padding:60px 0;"><div class="empty-state-icon">○</div><p class="empty-state-title">Your wishlist is empty.</p><p class="empty-state-desc">Save pieces you love and find them here anytime.</p><a href="' + r + 'new/" class="cta-link">browse new arrivals →</a></div>'
    }[section] || '';

    container.innerHTML =
      '<div class="py-14 px-5 md:px-10" style="min-height:60vh;">' +
        '<h1 class="serif" style="font-size:clamp(2rem,4vw,3rem);font-weight:400;margin-bottom:24px;">Account</h1>' +
        '<div class="flex gap-6 flex-wrap" style="border-bottom:1px solid var(--border);padding-bottom:16px;margin-bottom:32px;">' + tabHTML + '</div>' +
        bodyHTML +
      '</div>';
  }

  /* ════════════════════════════════════════════════════════════════
     EDITORIAL PAGES (about, blog, contact, faq, legal, etc.)
  ════════════════════════════════════════════════════════════════ */
  function renderEditorial(container, cfg) {
    var sub = cfg.subtype || 'about';
    var pages = {
      about:            renderAbout,
      blog:             renderBlog,
      contact:          renderContact,
      faq:              renderFAQ,
      'shipping-returns': renderShippingReturns,
      'size-guide':     renderSizeGuide,
      'privacy-policy': function () { return renderLegal('Privacy Policy', privacyContent()); },
      'terms':          function () { return renderLegal('Terms & Conditions', termsContent()); },
      'returns-policy': function () { return renderLegal('Returns Policy', returnsContent()); }
    };
    var fn = pages[sub] || renderAbout;
    container.innerHTML = fn();
  }

  function renderAbout() {
    return '<section class="relative overflow-hidden" style="height:50vh;min-height:300px;">' +
      '<img src="https://picsum.photos/seed/loomi-about-hero/1600/900" alt="About Loomi" class="w-full h-full object-cover" style="filter:brightness(0.80);" />' +
      '<div class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,0.35),transparent 60%);"></div>' +
      '<div class="absolute bottom-12 left-6 md:left-10"><h1 class="hero-headline">Our Story.</h1></div>' +
    '</section>' +
    '<div class="py-14 px-5 md:px-10 max-w-2xl">' +
      '<span class="section-label" style="color:var(--green);">About Loomi</span>' +
      '<div class="editorial-prose" style="margin-top:20px;">' +
        '<p>Loomi started with a simple frustration: finding clothes genuinely made from natural fibers required a chemistry degree and two hours of label-reading. So we built the index we wanted to exist.</p>' +
        '<p>Every listing on Loomi has been checked against the Loomi Standard — at least 90% natural fibers, zero hidden synthetics, every fiber breakdown displayed clearly. No greenwashing. No asterisks.</p>' +
        '<p>We\'re a small team of natural-fibre obsessives based in London. We believe clothing should be made from what the earth offers, not what a laboratory synthesises.</p>' +
        '<h3>Our Mission</h3>' +
        '<p>Make it effortless to dress in natural fibers. Not as a luxury. Not as a compromise. As the default.</p>' +
      '</div>' +
      '<a href="' + r + 'the-standard/" class="cta-link" style="margin-top:32px;display:inline-block;">Read about The Loomi Standard →</a>' +
    '</div>';
  }

  function renderBlog() {
    return '<div class="py-14 px-5 md:px-10">' +
      '<h1 class="serif" style="font-size:clamp(2rem,4vw,3.5rem);font-weight:400;margin-bottom:40px;">Journal</h1>' +
      '<div class="empty-state" style="padding:60px 0;">' +
        '<p class="empty-state-title">Coming soon.</p>' +
        '<p class="empty-state-desc">Essays on natural fibers, slow fashion, and the science of what we wear.</p>' +
      '</div>' +
    '</div>';
  }

  function renderContact() {
    return '<div class="py-14 px-5 md:px-10 max-w-lg">' +
      '<span class="section-label" style="color:var(--green);">Contact</span>' +
      '<h1 class="serif" style="font-size:clamp(2rem,4vw,3rem);font-weight:400;margin-top:16px;margin-bottom:32px;">Get in touch.</h1>' +
      '<div class="editorial-prose">' +
        '<p>We read every message. Responses within 2 business days.</p>' +
      '</div>' +
      '<div style="margin-top:32px;display:flex;flex-direction:column;gap:20px;">' +
        ['Your name', 'Your email', 'Message'].map(function (label, i) {
          var isTextarea = i === 2;
          return '<div>' +
            '<label style="font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:8px;">' + label + '</label>' +
            (isTextarea
              ? '<textarea rows="5" style="width:100%;background:transparent;border-bottom:1px solid var(--border);border-top:none;border-left:none;border-right:none;outline:none;font-size:11px;font-family:var(--font-ui);resize:none;padding-bottom:8px;color:var(--text);"></textarea>'
              : '<input type="text" style="width:100%;background:transparent;border-bottom:1px solid var(--border);border:none;border-bottom:1px solid var(--border);outline:none;font-size:11px;font-family:var(--font-ui);padding-bottom:8px;color:var(--text);" />') +
            '</div>';
        }).join('') +
        '<button class="pdp-add-btn">Send Message</button>' +
      '</div>' +
    '</div>';
  }

  function renderFAQ() {
    var faqs = [
      { q: 'What is the Loomi Standard?', a: 'The Loomi Standard is our single quality threshold: every garment we list must be at least 90% natural fibers by weight. This means cotton, linen, merino wool, cashmere, silk, hemp, or alpaca. The remaining 10% may include functional synthetics like elastane, but any synthetic content is clearly displayed on every product page.' },
      { q: 'Why 90% and not 100%?', a: 'Many natural-fibre garments include a small percentage of elastane for fit and durability — completely eliminating stretch would mean excluding genuinely natural-forward pieces. Our 90% threshold is where performance and purity intersect. We flag every synthetic fibre clearly, so you always know exactly what you\'re wearing.' },
      { q: 'How do you verify fiber content?', a: 'Every brand submits their composition data and certification documents before any product goes live. We calculate the natural fibre percentage precisely, cross-reference with care label data, and reject anything that doesn\'t meet the threshold — automatically, not manually.' },
      { q: 'Can I return items?', a: 'Yes. We offer free returns within 30 days of delivery for unworn, unwashed items with original tags attached. See our Returns Policy for full details.' },
      { q: 'How long does shipping take?', a: 'Standard shipping takes 3–5 business days. Express shipping (1–2 business days) is available at checkout. Free standard shipping on all orders over $75.' },
      { q: 'Are the brands on Loomi ethical?', a: 'Every brand goes through our onboarding process which reviews supply chain transparency, factory conditions, and fibre sourcing. We require honesty over perfection — brands actively improving are welcome if they meet the fibre threshold and can provide factory-level transparency.' }
    ];
    var faqHTML = faqs.map(function (f) {
      return '<div class="faq-item">' +
             '<button class="faq-btn" onclick="toggleFaq(this)">' + f.q +
             '<span class="faq-icon" style="font-size:16px;line-height:1;flex-shrink:0;">+</span></button>' +
             '<div class="faq-content"><p>' + f.a + '</p></div>' +
             '</div>';
    }).join('');

    return '<div class="py-14 px-5 md:px-10 max-w-2xl">' +
      '<span class="section-label" style="color:var(--green);">FAQ</span>' +
      '<h1 class="serif" style="font-size:clamp(2rem,4vw,3rem);font-weight:400;margin-top:16px;margin-bottom:32px;">Frequently asked<br>questions.</h1>' +
      faqHTML +
    '</div>';
  }

  function renderShippingReturns() {
    return '<div class="py-14 px-5 md:px-10 max-w-2xl">' +
      '<span class="section-label" style="color:var(--green);">Shipping & Returns</span>' +
      '<h1 class="serif" style="font-size:clamp(2rem,4vw,3rem);font-weight:400;margin-top:16px;margin-bottom:32px;">Delivery &<br>returns.</h1>' +
      '<div class="editorial-prose">' +
        '<h3>Shipping</h3>' +
        '<p>Standard shipping (3–5 business days): Free on orders over $75, otherwise $6.95. Express shipping (1–2 business days): $14.95. All orders ship with carbon-offset delivery.</p>' +
        '<h3>Free Returns</h3>' +
        '<p>We offer free returns within 30 days of delivery. Items must be unworn, unwashed, and returned with original tags. To initiate a return, visit your account page or contact us.</p>' +
        '<h3>International Shipping</h3>' +
        '<p>We currently ship to the US, Canada, UK, EU, and Australia. Duties and taxes are calculated at checkout.</p>' +
      '</div>' +
    '</div>';
  }

  function renderSizeGuide() {
    return '<div class="py-14 px-5 md:px-10 max-w-2xl">' +
      '<span class="section-label" style="color:var(--green);">Size Guide</span>' +
      '<h1 class="serif" style="font-size:clamp(2rem,4vw,3rem);font-weight:400;margin-top:16px;margin-bottom:32px;">Finding your fit.</h1>' +
      '<div class="editorial-prose">' +
        '<p>Natural fibers behave differently to synthetics — they breathe, drape, and move with your body. Our size guide is structured around fit, not vanity sizing.</p>' +
        '<h3>Women\'s Sizing (US)</h3>' +
        '<p>XS (2–4) · S (6–8) · M (10–12) · L (14–16) · XL (18–20)</p>' +
        '<h3>Men\'s Sizing (US)</h3>' +
        '<p>XS (28–30) · S (30–32) · M (34–36) · L (38–40) · XL (42–44)</p>' +
        '<h3>Kids Sizing</h3>' +
        '<p>2–3Y · 4–5Y · 6–7Y · 8–9Y · 10–11Y · 12–13Y</p>' +
        '<h3>Natural Fibre Care</h3>' +
        '<p>Linen and cotton: cool machine wash. Merino and cashmere: hand wash or wool cycle. Silk: hand wash or dry clean. Always air dry natural fibers where possible.</p>' +
      '</div>' +
    '</div>';
  }

  function renderLegal(title, content) {
    return '<div class="py-14 px-5 md:px-10 max-w-2xl">' +
      '<span class="section-label">Legal</span>' +
      '<h1 class="serif" style="font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:400;margin-top:16px;margin-bottom:32px;">' + title + '</h1>' +
      '<div class="editorial-prose">' + content + '</div>' +
    '</div>';
  }

  function privacyContent() {
    return '<p>Last updated: January 2026</p>' +
           '<h3>What we collect</h3><p>When you make a purchase or create an account, we collect your name, email, shipping address, and payment information (processed securely by Stripe). We also collect browsing data to improve site experience.</p>' +
           '<h3>How we use it</h3><p>To process orders, send shipping updates, and occasionally contact you about products we think you\'ll love. We never sell your data.</p>' +
           '<h3>Your rights</h3><p>You may request access to, correction of, or deletion of your personal data at any time by emailing privacy@loomi.com.</p>';
  }

  function termsContent() {
    return '<p>Last updated: January 2026</p>' +
           '<h3>Use of site</h3><p>By using Loomi you agree to our terms. Content is for personal, non-commercial use only.</p>' +
           '<h3>Products</h3><p>All products are subject to availability. We reserve the right to limit quantities and discontinue products.</p>' +
           '<h3>Pricing</h3><p>All prices are in USD and include applicable taxes where required. Prices may change without notice.</p>';
  }

  function returnsContent() {
    return '<p>Last updated: January 2026</p>' +
           '<h3>30-day returns</h3><p>Items may be returned within 30 days of delivery if unworn, unwashed, and with original tags attached.</p>' +
           '<h3>How to return</h3><p>Log in to your account and select the item you wish to return, or contact us at returns@loomi.com.</p>' +
           '<h3>Refunds</h3><p>Refunds are processed within 5–7 business days of receiving your return.</p>';
  }

  /* ─── MOTION OBSERVER (Reformation data-motion pattern) ──────── */
  function initMotion() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-motion]').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-motion]').forEach(function (el) {
      obs.observe(el);
    });
  }
  window.LOOMI = window.LOOMI || {};
  window.LOOMI.initMotion = initMotion;
  initMotion();

})();
