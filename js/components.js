/* ═══ LOOMI COMPONENTS ══════════════════════════════════════════════
   Pure render functions — each returns an HTML string.
   Callers do: el.innerHTML = renderX(...);
   All hrefs prefixed with root() = window.LOOMI_ROOT.
═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function root() { return window.LOOMI_ROOT || ''; }

  /* ─── FIBER CHART ─────────────────────────────────────────────── */
  function renderFiberChart(fibers) {
    if (!fibers || !fibers.length) return '';
    var bars = fibers.map(function (f) {
      return '<div class="fiber-chart-seg" style="flex-grow:' + f.pct + ';flex-shrink:0;background:' + f.color + ';">' +
             '<span class="fiber-chart-pct">' + f.pct + '%</span>' +
             '</div>';
    }).join('');
    var legend = fibers.map(function (f) {
      return '<span style="flex-grow:' + f.pct + ';flex-shrink:1;min-width:0;">' + f.name + '</span>';
    }).join('');
    return '<div class="fiber-chart">' +
           '<div class="fiber-chart-bars">' + bars + '</div>' +
           '<div class="fiber-chart-legend">' + legend + '</div>' +
           '</div>';
  }

  /* ─── PRODUCT CARD ────────────────────────────────────────────── */
  function renderProductCard(product, opts) {
    var mode = (opts && opts.mode) || 'grid';
    var ratio = (opts && opts.aspectRatio) || '3/4';
    var isCarousel = mode === 'carousel';
    var wrapClass = isCarousel
      ? 'product-card snap-start flex-none w-[152px] md:w-[196px]'
      : 'product-card';

    var priceHTML = product.salePrice
      ? '<span style="text-decoration:line-through;color:var(--text-muted);">$' + product.price + '</span>' +
        '<span style="color:#9a3d3d;margin-left:6px;">$' + product.salePrice + '</span>'
      : '$' + product.price;

    var brands = window.LOOMI && window.LOOMI.BRANDS;
    var brand = brands && brands.find(function (b) { return b.slug === product.brand; });
    var isCertified = brand && (brand.ecoTier || 0) >= 3;

    var badges = [];
    if (isCertified)          badges.push('<span class="badge-certified"><span class="badge-certified-text">\u2726\ufe0e Loomi Pick</span></span>');
    if (product.isNew)        badges.push('<span class="badge-new">New</span>');
    if (product.isBestSeller) badges.push('<span class="badge-bs">Best Seller</span>');
    if (product.isOnSale)     badges.push('<span class="badge-sale">Sale</span>');
    var badgeHTML = badges.length
      ? '<div class="card-badges">' + badges.join('') + '</div>'
      : '';

    var isPicsum = product.image.indexOf('picsum.photos/seed/') !== -1;
    var seed = isPicsum ? product.image.split('/seed/')[1].split('/')[0] : '';
    var srcsetAttr = seed
      ? ' srcset="https://picsum.photos/seed/' + seed + '/300/400 300w,' +
        'https://picsum.photos/seed/' + seed + '/400/533 400w,' +
        'https://picsum.photos/seed/' + seed + '/600/800 600w"' +
        ' sizes="(max-width:480px) calc(50vw - 24px),(max-width:768px) calc(33vw - 20px),280px"'
      : '';

    return '<article itemscope itemtype="http://schema.org/Product" class="' + wrapClass + '">' +
           '<a href="' + root() + 'products/?slug=' + product.slug + '"' +
           ' style="text-decoration:none;color:inherit;display:block;">' +
           '<div class="relative overflow-hidden"' +
           ' style="aspect-ratio:' + ratio + ';background:var(--bg-soft);">' +
           '<img src="' + product.image + '"' + srcsetAttr +
           ' alt="' + product.name + '" itemprop="image"' +
           ' class="product-img w-full h-full object-cover" loading="lazy" />' +
           badgeHTML +
           '<div class="quick-add absolute bottom-0 inset-x-0 py-2 text-center">Quick Add</div>' +
           '</div>' +
           '</a>' +
           '<div class="card-text">' +
           renderFiberChart(product.fibers) +
           '<a href="' + root() + 'products/?slug=' + product.slug + '" itemprop="url"' +
           ' style="text-decoration:none;color:inherit;">' +
           '<p class="card-name" itemprop="name">' + product.name + '</p>' +
           '</a>' +
           '<div itemprop="offers" itemscope itemtype="http://schema.org/Offer">' +
           '<meta itemprop="priceCurrency" content="USD" />' +
           '<meta itemprop="price" content="' + (product.salePrice || product.price) + '" />' +
           '<meta itemprop="availability" content="https://schema.org/InStock" />' +
           '<p class="card-price">' + priceHTML + '</p>' +
           '</div>' +
           '</div>' +
           '</article>';
  }

  /* ─── NAV ─────────────────────────────────────────────────────── */
  function renderNav(opts) {
    var r = root();
    /* Auto-detect active section from the current URL path.
       Falls back to explicit opts.activePath for edge cases. */
    var active = (opts && opts.activePath) || (function () {
      try {
        var parts = window.location.pathname.replace(/^\//, '').split('/');
        return parts[0] ? parts[0] + '/' : '';
      } catch (e) { return ''; }
    })();

    function navHref(path) { return r + path; }
    function isActive(path) {
      return !!(active && active !== '' && active === path);
    }
    function activeClass(path) {
      return isActive(path) ? ' is-active' : '';
    }

    return '<a href="#loomi-main" class="skip-to-main">Skip to main content</a>' +
      '<nav class="sticky top-0 z-50" style="background:var(--bg);">' +
      '<div class="flex items-center h-11 px-5 gap-7">' +

      '<a href="' + navHref('') + '" class="nav-link flex-shrink-0 serif"' +
      ' style="font-size:26px;font-weight:500;color:var(--text);letter-spacing:0.01em;">Loomi</a>' +

      '<div class="hidden md:flex items-center gap-6 flex-1">' +

      /* New mega */
      '<div class="mega-nav-item flex items-center">' +
      '<a href="' + navHref('new/') + '" class="nav-link' + activeClass('new/') + '"' +
      ' style="font-size:11px;letter-spacing:0.05em;color:var(--text);"' +
      ' aria-haspopup="true" aria-expanded="false">new</a>' +
      '<div class="mega-menu" role="menu"><div class="mega-menu-grid">' +
      '<div class="mega-col"><span class="mega-col-heading">New In</span>' +
      '<a href="' + navHref('new/') + '" role="menuitem">all new arrivals</a>' +
      '<a href="' + navHref('women/new-arrivals/') + '" role="menuitem">women\'s new</a>' +
      '<a href="' + navHref('men/new-arrivals/') + '" role="menuitem">men\'s new</a>' +
      '<a href="' + navHref('kids/new-arrivals/') + '" role="menuitem">kids\' new</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">Trending</span>' +
      '<a href="' + navHref('women/best-sellers/') + '" role="menuitem">women\'s best sellers</a>' +
      '<a href="' + navHref('men/best-sellers/') + '" role="menuitem">men\'s best sellers</a>' +
      '<a href="' + navHref('kids/best-sellers/') + '" role="menuitem">kids\' best sellers</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">Sale</span>' +
      '<a href="' + navHref('women/sale/') + '" role="menuitem">women\'s sale</a>' +
      '<a href="' + navHref('men/sale/') + '" role="menuitem">men\'s sale</a>' +
      '<a href="' + navHref('kids/sale/') + '" role="menuitem">kids\' sale</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">By Brand</span>' +
      '<a href="' + navHref('brands/pact/') + '" role="menuitem">pact</a>' +
      '<a href="' + navHref('brands/kotn/') + '" role="menuitem">kotn</a>' +
      '<a href="' + navHref('brands/thought/') + '" role="menuitem">thought</a>' +
      '<a href="' + navHref('brands/eileen-fisher/') + '" role="menuitem">eileen fisher</a>' +
      '<a href="' + navHref('brands/finisterre/') + '" role="menuitem">finisterre</a>' +
      '</div></div></div></div>' +

      /* Women mega */
      '<div class="mega-nav-item flex items-center">' +
      '<a href="' + navHref('women/') + '" class="nav-link' + activeClass('women/') + '"' +
      ' style="font-size:11px;letter-spacing:0.05em;color:var(--text);"' +
      ' aria-haspopup="true" aria-expanded="false">women</a>' +
      '<div class="mega-menu" role="menu"><div class="mega-menu-grid">' +
      '<div class="mega-col"><span class="mega-col-heading">Women\'s</span>' +
      '<a href="' + navHref('women/new-arrivals/') + '" role="menuitem">new arrivals</a>' +
      '<a href="' + navHref('women/best-sellers/') + '" role="menuitem">best sellers</a>' +
      '<a href="' + navHref('women/sale/') + '" role="menuitem">sale</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">Clothing</span>' +
      '<a href="' + navHref('women/tops/') + '" role="menuitem">tops &amp; tees</a>' +
      '<a href="' + navHref('women/dresses/') + '" role="menuitem">dresses</a>' +
      '<a href="' + navHref('women/trousers/') + '" role="menuitem">trousers</a>' +
      '<a href="' + navHref('women/knitwear/') + '" role="menuitem">knitwear</a>' +
      '<a href="' + navHref('women/outerwear/') + '" role="menuitem">outerwear</a>' +
      '<a href="' + navHref('women/sleepwear/') + '" role="menuitem">sleepwear</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">By Fiber</span>' +
      '<a href="' + navHref('fibers/cotton/') + '" role="menuitem">cotton</a>' +
      '<a href="' + navHref('fibers/linen/') + '" role="menuitem">linen</a>' +
      '<a href="' + navHref('fibers/merino-wool/') + '" role="menuitem">merino wool</a>' +
      '<a href="' + navHref('fibers/cashmere/') + '" role="menuitem">cashmere</a>' +
      '<a href="' + navHref('fibers/silk/') + '" role="menuitem">silk</a>' +
      '<a href="' + navHref('fibers/hemp/') + '" role="menuitem">hemp</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">Brands</span>' +
      '<a href="' + navHref('brands/pact/') + '" role="menuitem">pact</a>' +
      '<a href="' + navHref('brands/kotn/') + '" role="menuitem">kotn</a>' +
      '<a href="' + navHref('brands/thought/') + '" role="menuitem">thought</a>' +
      '<a href="' + navHref('brands/eileen-fisher/') + '" role="menuitem">eileen fisher</a>' +
      '</div></div></div></div>' +

      /* Men mega */
      '<div class="mega-nav-item flex items-center">' +
      '<a href="' + navHref('men/') + '" class="nav-link' + activeClass('men/') + '"' +
      ' style="font-size:11px;letter-spacing:0.05em;color:var(--text);"' +
      ' aria-haspopup="true" aria-expanded="false">men</a>' +
      '<div class="mega-menu" role="menu"><div class="mega-menu-grid">' +
      '<div class="mega-col"><span class="mega-col-heading">Men\'s</span>' +
      '<a href="' + navHref('men/new-arrivals/') + '" role="menuitem">new arrivals</a>' +
      '<a href="' + navHref('men/best-sellers/') + '" role="menuitem">best sellers</a>' +
      '<a href="' + navHref('men/sale/') + '" role="menuitem">sale</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">Clothing</span>' +
      '<a href="' + navHref('men/t-shirts-tops/') + '" role="menuitem">t-shirts &amp; tops</a>' +
      '<a href="' + navHref('men/shirts/') + '" role="menuitem">shirts</a>' +
      '<a href="' + navHref('men/trousers/') + '" role="menuitem">trousers</a>' +
      '<a href="' + navHref('men/knitwear/') + '" role="menuitem">knitwear</a>' +
      '<a href="' + navHref('men/outerwear/') + '" role="menuitem">outerwear</a>' +
      '<a href="' + navHref('men/underwear/') + '" role="menuitem">underwear</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">By Fiber</span>' +
      '<a href="' + navHref('fibers/cotton/') + '" role="menuitem">cotton</a>' +
      '<a href="' + navHref('fibers/linen/') + '" role="menuitem">linen</a>' +
      '<a href="' + navHref('fibers/merino-wool/') + '" role="menuitem">merino wool</a>' +
      '<a href="' + navHref('fibers/cashmere/') + '" role="menuitem">cashmere</a>' +
      '<a href="' + navHref('fibers/hemp/') + '" role="menuitem">hemp</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">Brands</span>' +
      '<a href="' + navHref('brands/pact/') + '" role="menuitem">pact</a>' +
      '<a href="' + navHref('brands/kotn/') + '" role="menuitem">kotn</a>' +
      '<a href="' + navHref('brands/thought/') + '" role="menuitem">thought</a>' +
      '<a href="' + navHref('brands/finisterre/') + '" role="menuitem">finisterre</a>' +
      '</div></div></div></div>' +

      /* Kids mega */
      '<div class="mega-nav-item flex items-center">' +
      '<a href="' + navHref('kids/') + '" class="nav-link' + activeClass('kids/') + '"' +
      ' style="font-size:11px;letter-spacing:0.05em;color:var(--text);"' +
      ' aria-haspopup="true" aria-expanded="false">kids</a>' +
      '<div class="mega-menu" role="menu"><div class="mega-menu-grid">' +
      '<div class="mega-col"><span class="mega-col-heading">Kids\'</span>' +
      '<a href="' + navHref('kids/new-arrivals/') + '" role="menuitem">new arrivals</a>' +
      '<a href="' + navHref('kids/best-sellers/') + '" role="menuitem">best sellers</a>' +
      '<a href="' + navHref('kids/sale/') + '" role="menuitem">sale</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">Clothing</span>' +
      '<a href="' + navHref('kids/tops/') + '" role="menuitem">tops</a>' +
      '<a href="' + navHref('kids/bottoms/') + '" role="menuitem">bottoms</a>' +
      '<a href="' + navHref('kids/sets/') + '" role="menuitem">sets</a>' +
      '<a href="' + navHref('kids/outerwear/') + '" role="menuitem">outerwear</a>' +
      '<a href="' + navHref('kids/sleepwear/') + '" role="menuitem">sleepwear</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">By Fiber</span>' +
      '<a href="' + navHref('fibers/cotton/') + '" role="menuitem">cotton</a>' +
      '<a href="' + navHref('fibers/linen/') + '" role="menuitem">linen</a>' +
      '<a href="' + navHref('fibers/merino-wool/') + '" role="menuitem">merino wool</a>' +
      '<a href="' + navHref('fibers/cashmere/') + '" role="menuitem">cashmere</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">Brands</span>' +
      '<a href="' + navHref('brands/') + '" role="menuitem">all brands</a>' +
      '<a href="' + navHref('brands/pact/') + '" role="menuitem">pact</a>' +
      '<a href="' + navHref('brands/kotn/') + '" role="menuitem">kotn</a>' +
      '<a href="' + navHref('brands/thought/') + '" role="menuitem">thought</a>' +
      '</div></div></div></div>' +

      '<div class="mega-nav-item flex items-center">' +
      '<a href="' + navHref('fibers/') + '" class="nav-link' + activeClass('fibers/') + '"' +
      ' style="font-size:11px;letter-spacing:0.05em;color:var(--text);"' +
      ' aria-haspopup="true" aria-expanded="false">fibers</a>' +
      '<div class="mega-menu" role="menu"><div class="mega-menu-grid">' +
      '<div class="mega-col"><span class="mega-col-heading">Natural Fibers</span>' +
      '<a href="' + navHref('fibers/') + '" role="menuitem">all fibers</a>' +
      '<a href="' + navHref('fibers/cotton/') + '" role="menuitem">cotton</a>' +
      '<a href="' + navHref('fibers/linen/') + '" role="menuitem">linen</a>' +
      '<a href="' + navHref('fibers/merino-wool/') + '" role="menuitem">merino wool</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">Luxury Fibers</span>' +
      '<a href="' + navHref('fibers/cashmere/') + '" role="menuitem">cashmere</a>' +
      '<a href="' + navHref('fibers/silk/') + '" role="menuitem">silk</a>' +
      '<a href="' + navHref('fibers/hemp/') + '" role="menuitem">hemp</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">Explore</span>' +
      '<a href="' + navHref('the-standard/') + '" role="menuitem">the loomi standard</a>' +
      '<a href="' + navHref('fibers/') + '" role="menuitem">fiber guide</a></div>' +
      '</div></div></div>' +

      /* Brands mega */
      '<div class="mega-nav-item flex items-center">' +
      '<a href="' + navHref('brands/') + '" class="nav-link' + activeClass('brands/') + '"' +
      ' style="font-size:11px;letter-spacing:0.05em;color:var(--text);"' +
      ' aria-haspopup="true" aria-expanded="false">brands</a>' +
      '<div class="mega-menu" role="menu"><div class="mega-menu-grid">' +
      '<div class="mega-col"><span class="mega-col-heading">Our Brands</span>' +
      '<a href="' + navHref('brands/') + '" role="menuitem">all brands</a>' +
      '<a href="' + navHref('brands/pact/') + '" role="menuitem">pact</a>' +
      '<a href="' + navHref('brands/kotn/') + '" role="menuitem">kotn</a>' +
      '<a href="' + navHref('brands/thought/') + '" role="menuitem">thought</a>' +
      '<a href="' + navHref('brands/eileen-fisher/') + '" role="menuitem">eileen fisher</a>' +
      '<a href="' + navHref('brands/finisterre/') + '" role="menuitem">finisterre</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">Shop By Gender</span>' +
      '<a href="' + navHref('women/') + '" role="menuitem">women</a>' +
      '<a href="' + navHref('men/') + '" role="menuitem">men</a>' +
      '<a href="' + navHref('kids/') + '" role="menuitem">kids</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">Our Standards</span>' +
      '<a href="' + navHref('brands/certified/') + '" role="menuitem" style="color:var(--green);">Loomi Pick Brands</a>' +
      '<a href="' + navHref('the-standard/') + '" role="menuitem">the loomi standard</a>' +
      '<a href="' + navHref('the-standard/brand-criteria/') + '" role="menuitem">brand criteria</a>' +
      '<a href="' + navHref('the-standard/how-we-verify/') + '" role="menuitem">how we verify</a>' +
      '<a href="' + navHref('fibers/') + '" role="menuitem">fiber guide</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">Shop</span>' +
      '<a href="' + navHref('women/') + '" role="menuitem">women</a>' +
      '<a href="' + navHref('men/') + '" role="menuitem">men</a>' +
      '<a href="' + navHref('kids/') + '" role="menuitem">kids</a>' +
      '</div></div></div></div>' +

      /* The Standard mega */
      '<div class="mega-nav-item flex items-center">' +
      '<a href="' + navHref('the-standard/') + '" class="nav-link' + activeClass('the-standard/') + '"' +
      ' style="font-size:11px;letter-spacing:0.05em;color:var(--text);"' +
      ' aria-haspopup="true" aria-expanded="false">the standard</a>' +
      '<div class="mega-menu" role="menu"><div class="mega-menu-grid">' +
      '<div class="mega-col"><span class="mega-col-heading">The Standard</span>' +
      '<a href="' + navHref('the-standard/') + '" role="menuitem">the loomi standard</a>' +
      '<a href="' + navHref('the-standard/how-we-verify/') + '" role="menuitem">how we verify</a>' +
      '<a href="' + navHref('the-standard/fiber-guide/') + '" role="menuitem">fiber guide</a>' +
      '<a href="' + navHref('the-standard/brand-criteria/') + '" role="menuitem">brand criteria</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">Fibers</span>' +
      '<a href="' + navHref('fibers/') + '" role="menuitem">all fibers</a>' +
      '<a href="' + navHref('fibers/cotton/') + '" role="menuitem">cotton</a>' +
      '<a href="' + navHref('fibers/linen/') + '" role="menuitem">linen</a>' +
      '<a href="' + navHref('fibers/merino-wool/') + '" role="menuitem">merino wool</a>' +
      '<a href="' + navHref('fibers/cashmere/') + '" role="menuitem">cashmere</a>' +
      '<a href="' + navHref('fibers/silk/') + '" role="menuitem">silk</a>' +
      '<a href="' + navHref('fibers/hemp/') + '" role="menuitem">hemp</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">Certifications</span>' +
      '<a href="' + navHref('the-standard/') + '" role="menuitem">GOTS organic</a>' +
      '<a href="' + navHref('the-standard/') + '" role="menuitem">Bluesign</a>' +
      '<a href="' + navHref('the-standard/') + '" role="menuitem">Fair Trade</a>' +
      '<a href="' + navHref('the-standard/') + '" role="menuitem">B-Corp</a>' +
      '<a href="' + navHref('the-standard/') + '" role="menuitem">Responsible Wool</a></div>' +
      '<div class="mega-col"><span class="mega-col-heading">Shop</span>' +
      '<a href="' + navHref('women/') + '" role="menuitem">women</a>' +
      '<a href="' + navHref('men/') + '" role="menuitem">men</a>' +
      '<a href="' + navHref('kids/') + '" role="menuitem">kids</a>' +
      '<a href="' + navHref('new/') + '" role="menuitem">new arrivals</a>' +
      '<a href="' + navHref('brands/') + '" role="menuitem">all brands</a>' +
      '</div></div></div></div>' +

      '</div>' + /* end primary nav */

      /* Mobile hamburger — animated to X */
      '<button class="md:hidden ml-auto mr-2 mobile-hamburger"' +
      ' id="mobile-menu-btn" aria-label="Menu" aria-expanded="false"' +
      ' aria-controls="mobile-nav-drawer" onclick="toggleMobileMenu()">' +
      '<span></span><span></span><span></span>' +
      '</button>' +

      /* Utility nav */
      '<div class="hidden md:flex items-center gap-5 ml-auto flex-shrink-0">' +
      '<input type="text" id="nav-search-input" class="nav-search-input"' +
      ' placeholder="search" autocomplete="off" spellcheck="false"' +
      ' oninput="navSearch(this.value)"' +
      ' onkeydown="if(event.key===\'Escape\'){this.value=\'\';navSearch(\'\');this.blur();}" />' +
      '<a href="' + navHref('account/') + '" class="nav-link"' +
      ' style="font-size:11px;letter-spacing:0.05em;color:var(--text);">account</a>' +
      '<a href="' + navHref('bag/') + '" class="nav-link" id="bag-count-link"' +
      ' style="font-size:11px;letter-spacing:0.05em;color:var(--text);">bag (0)</a>' +
      '</div>' +

      '</div>' + /* end inner flex */

      /* Mobile nav drawer */
      '<div id="mobile-nav-drawer" class="mobile-drawer">' +
      '<div class="mobile-drawer-inner">' +

      '<div class="mobile-nav-group">' +
      '<button class="mobile-nav-toggle" onclick="toggleMobileSection(this)">' +
      '<span>new</span><span class="mobile-nav-arrow">+</span></button>' +
      '<div class="mobile-nav-sub">' +
      '<a href="' + navHref('new/') + '">all new arrivals</a>' +
      '<a href="' + navHref('women/new-arrivals/') + '">women\'s new</a>' +
      '<a href="' + navHref('men/new-arrivals/') + '">men\'s new</a>' +
      '<a href="' + navHref('kids/new-arrivals/') + '">kids\' new</a>' +
      '</div></div>' +

      '<div class="mobile-nav-group">' +
      '<button class="mobile-nav-toggle" onclick="toggleMobileSection(this)">' +
      '<span>women</span><span class="mobile-nav-arrow">+</span></button>' +
      '<div class="mobile-nav-sub">' +
      '<a href="' + navHref('women/') + '">all women\'s</a>' +
      '<a href="' + navHref('women/tops/') + '">tops & tees</a>' +
      '<a href="' + navHref('women/dresses/') + '">dresses</a>' +
      '<a href="' + navHref('women/knitwear/') + '">knitwear</a>' +
      '<a href="' + navHref('women/outerwear/') + '">outerwear</a>' +
      '</div></div>' +

      '<div class="mobile-nav-group">' +
      '<button class="mobile-nav-toggle" onclick="toggleMobileSection(this)">' +
      '<span>men</span><span class="mobile-nav-arrow">+</span></button>' +
      '<div class="mobile-nav-sub">' +
      '<a href="' + navHref('men/') + '">all men\'s</a>' +
      '<a href="' + navHref('men/t-shirts-tops/') + '">t-shirts & tops</a>' +
      '<a href="' + navHref('men/shirts/') + '">shirts</a>' +
      '<a href="' + navHref('men/knitwear/') + '">knitwear</a>' +
      '<a href="' + navHref('men/outerwear/') + '">outerwear</a>' +
      '</div></div>' +

      '<div class="mobile-nav-group">' +
      '<button class="mobile-nav-toggle" onclick="toggleMobileSection(this)">' +
      '<span>kids</span><span class="mobile-nav-arrow">+</span></button>' +
      '<div class="mobile-nav-sub">' +
      '<a href="' + navHref('kids/') + '">all kids\'</a>' +
      '<a href="' + navHref('kids/tops/') + '">tops</a>' +
      '<a href="' + navHref('kids/bottoms/') + '">bottoms</a>' +
      '<a href="' + navHref('kids/outerwear/') + '">outerwear</a>' +
      '</div></div>' +

      '<a href="' + navHref('fibers/') + '" class="mobile-nav-link">fibers</a>' +
      '<a href="' + navHref('brands/') + '" class="mobile-nav-link">brands</a>' +
      '<a href="' + navHref('the-standard/') + '" class="mobile-nav-link">the standard</a>' +

      '<div class="mobile-nav-divider"></div>' +
      '<a href="' + navHref('search/') + '" class="mobile-nav-link">search</a>' +
      '<a href="' + navHref('account/') + '" class="mobile-nav-link">account</a>' +
      '<a href="' + navHref('bag/') + '" class="mobile-nav-link">bag</a>' +
      '</div>' +
      '</div>' +

      '<div class="mega-backdrop" id="mega-backdrop"></div>' +

      /* Inline search results overlay */
      '<div id="nav-search-overlay" class="nav-search-overlay">' +
        '<div class="py-10 px-5 md:px-10">' +
          '<div id="nav-search-count" class="section-label" style="margin-bottom:20px;"></div>' +
          '<div id="nav-search-grid" class="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10"></div>' +
        '</div>' +
      '</div>' +

      '</nav>';
  }

  /* ─── FOOTER ──────────────────────────────────────────────────── */
  function renderFooter() {
    var r = root();
    return '<footer style="background:var(--bg);overflow:hidden;">' +
      '<div class="grid grid-cols-1 md:grid-cols-[3fr_2fr]" style="min-height:360px;">' +

      '<div class="px-5 md:px-10 pt-12 pb-10 flex flex-col" style="align-self:start;">' +
      '<p class="footer-wordmark-col" style="margin-top:0;overflow:hidden;">Loomi</p>' +
      '<p class="serif" style="font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:400;color:var(--text);line-height:1.45;max-width:480px;font-style:italic;margin-top:12px;">' +
      'Nothing but nature against your skin.</p>' +
      '</div>' +

      '<div class="px-5 md:px-10 pt-12 pb-10 flex flex-col">' +
      '<p style="font-size:10px;color:var(--text-muted);letter-spacing:0.1em;text-transform:lowercase;margin-bottom:14px;">natural fiber finds, direct to your inbox</p>' +
      '<div style="display:flex;align-items:center;border-bottom:1px solid var(--text);max-width:280px;padding-bottom:8px;gap:12px;margin-bottom:24px;">' +
      '<input type="email" placeholder="your email" style="background:transparent;font-size:11px;letter-spacing:0.08em;color:var(--text);outline:none;border:none;font-family:var(--font-ui);flex:1;text-transform:lowercase;" />' +
      '<button style="font-size:11px;letter-spacing:0.08em;color:var(--text);background:none;border:none;cursor:pointer;font-family:var(--font-ui);white-space:nowrap;">sign up +</button>' +
      '</div>' +
      '<div class="flex flex-wrap gap-5" style="margin-bottom:20px;">' +
      '<a href="#" class="nav-link" style="font-size:11px;letter-spacing:0.04em;color:var(--text);">Instagram</a>' +
      '<a href="#" class="nav-link" style="font-size:11px;letter-spacing:0.04em;color:var(--text);">TikTok</a>' +
      '<a href="#" class="nav-link" style="font-size:11px;letter-spacing:0.04em;color:var(--text);">Pinterest</a>' +
      '<a href="#" class="nav-link" style="font-size:11px;letter-spacing:0.04em;color:var(--text);">YouTube</a>' +
      '</div>' +
      /* Accordions */
      '<div class="footer-acc-item"><button class="footer-acc-btn" onclick="toggleAcc(this)">the loomi standard<span style="font-size:16px;line-height:1;">+</span></button>' +
      '<div class="footer-acc-content">' +
      '<a href="' + r + 'the-standard/how-we-verify/">what we verify</a>' +
      '<a href="' + r + 'the-standard/">the 90% rule</a>' +
      '<a href="' + r + 'the-standard/fiber-guide/">fiber guide</a>' +
      '</div></div>' +
      '<div class="footer-acc-item"><button class="footer-acc-btn" onclick="toggleAcc(this)">how it works<span style="font-size:16px;line-height:1;">+</span></button>' +
      '<div class="footer-acc-content">' +
      '<a href="' + r + 'how-it-works/">where to buy</a>' +
      '<a href="' + r + 'returns-support/">returns &amp; support</a>' +
      '<a href="' + r + 'faq/">faq</a>' +
      '<a href="' + r + 'contact/">contact us</a>' +
      '</div></div>' +
      '<div class="footer-acc-item"><button class="footer-acc-btn" onclick="toggleAcc(this)">about us<span style="font-size:16px;line-height:1;">+</span></button>' +
      '<div class="footer-acc-content">' +
      '<a href="' + r + 'about/">our story</a>' +
      '<a href="' + r + 'brands/">our brands</a>' +
      '<a href="' + r + 'blog/">journal</a>' +
      '</div></div>' +
      '<div class="footer-acc-item"><button class="footer-acc-btn" onclick="toggleAcc(this)">legal information<span style="font-size:16px;line-height:1;">+</span></button>' +
      '<div class="footer-acc-content">' +
      '<a href="' + r + 'privacy-policy/">privacy policy</a>' +
      '<a href="' + r + 'terms/">terms &amp; conditions</a>' +
      '<a href="' + r + 'returns-policy/">returns policy</a>' +
      '<a href="' + r + 'affiliate-disclosure/">affiliate disclosure</a>' +
      '</div></div>' +
      '</div>' + /* end right col */
      '</div>' + /* end grid */
      '<div class="px-5 md:px-10 py-5 flex flex-wrap items-center justify-between gap-4">' +
      '<p style="font-size:10px;color:var(--text-muted);letter-spacing:0.08em;">© 2026 Loomi.</p>' +
      '<p style="font-size:10px;color:var(--text-muted);letter-spacing:0.08em;">United States</p>' +
      '</div>' +
      '</footer>';
  }

  /* ─── TRUST TICKER ────────────────────────────────────────────── */
  function renderTrustStrip() {
    var msgs = [
      '90%+ natural fibers only',
      'zero hidden synthetics',
      'every listing checked',
      'natural fibers, minimal processing'
    ];
    var items = msgs.map(function (t) {
      return '<span class="ticker-item"><span class="chk">✓</span>' + t + '</span>';
    }).join('');
    /* Duplicate so the loop appears seamless */
    return '<div class="ticker-wrap" aria-hidden="true">' +
      '<div class="ticker-track">' + items + items + '</div>' +
    '</div>';
  }

  /* ─── PLP HEADER ──────────────────────────────────────────────── */
  function renderPLPHeader(title, count) {
    return '<div class="flex items-end justify-between mb-3">' +
           '<h1 class="serif" style="font-size:clamp(2rem,4vw,3.5rem);font-weight:400;line-height:1.1;">' +
           title + '</h1>' +
           '<span class="section-label">' + count + ' pieces</span>' +
           '</div>';
  }

  /* ─── BREADCRUMB ──────────────────────────────────────────────── */
  function renderBreadcrumb(crumbs) {
    var r = root();
    var parts = crumbs.map(function (c, i) {
      var isLast = i === crumbs.length - 1;
      return isLast
        ? '<span style="color:var(--text);">' + c.label + '</span>'
        : '<a href="' + r + c.href + '">' + c.label + '</a>' +
          '<span class="breadcrumb-sep">/</span>';
    });
    return '<nav class="breadcrumb px-5 md:px-10 pt-5">' + parts.join('') + '</nav>';
  }

  /* ─── EXPOSE ──────────────────────────────────────────────────── */
  window.LOOMI_COMPONENTS = {
    renderFiberChart: renderFiberChart,
    renderProductCard: renderProductCard,
    renderNav: renderNav,
    renderFooter: renderFooter,
    renderTrustStrip: renderTrustStrip,
    renderPLPHeader: renderPLPHeader,
    renderBreadcrumb: renderBreadcrumb
  };

})();

/* ─── NAV SEARCH ──────────────────────────────────────────────────
   Defined outside the IIFE so it's accessible as a global handler.
─────────────────────────────────────────────────────────────────── */

/* Escape user-supplied strings before injecting into innerHTML */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

(function () {
  /* Single persistent close-overlay listener — attached once, never accumulates */
  var _overlayListenerAttached = false;
  function attachOverlayClose() {
    if (_overlayListenerAttached) return;
    _overlayListenerAttached = true;
    document.addEventListener('click', function (e) {
      var overlay = document.getElementById('nav-search-overlay');
      if (!overlay) return;
      if (!e.target.closest('#nav-search-input') && !e.target.closest('#nav-search-overlay')) {
        overlay.classList.remove('is-open');
        var inp = document.getElementById('nav-search-input');
        if (inp) inp.value = '';
      }
    });
  }

  /* Debounced search — fires at most every 200ms regardless of typing speed */
  var _debounceTimer = null;
  function _doSearch(q) {
    var overlay = document.getElementById('nav-search-overlay');
    var count   = document.getElementById('nav-search-count');
    var grid    = document.getElementById('nav-search-grid');
    if (!overlay || !grid) return;

    var qLow = q.trim().toLowerCase();
    if (!qLow) {
      overlay.classList.remove('is-open');
      grid.innerHTML = '';
      if (count) count.textContent = '';
      return;
    }

    var D = window.LOOMI;
    var C = window.LOOMI_COMPONENTS;
    if (!D || !C) return;

    var results = D.PRODUCTS.filter(function (p) {
      return p.name.toLowerCase().indexOf(qLow) !== -1 ||
             p.brand.toLowerCase().indexOf(qLow) !== -1 ||
             (p.fibers || []).some(function (f) { return f.name.toLowerCase().indexOf(qLow) !== -1; });
    });

    overlay.classList.add('is-open');
    if (count) count.textContent = results.length ? results.length + ' pieces' : '';
    grid.innerHTML = results.length
      ? results.map(function (p) { return C.renderProductCard(p); }).join('')
      : '<div style="grid-column:1/-1;padding:20px 0;"><p style="font-size:12px;color:var(--text-muted);">No results for \u201c' + escapeHtml(q) + '\u201d</p></div>';
  }

  window.navSearch = function (q) {
    attachOverlayClose();
    clearTimeout(_debounceTimer);
    _debounceTimer = setTimeout(function () { _doSearch(q); }, 200);
  };
})();
