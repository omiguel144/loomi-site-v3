/* ═══ LOOMI DATA LAYER ═══════════════════════════════════════════════
   Central source of truth for all products, brands, and fibers.
   Exposed as window.LOOMI = { PRODUCTS, BRANDS, FIBERS }
═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── FIBERS ──────────────────────────────────────────────────── */
  var FIBERS = [
    {
      slug: 'cotton',
      name: 'Cotton',
      tagline: 'Breathable, hypoallergenic, biodegradable.',
      color: 'var(--fc-cotton)',
      properties: ['Breathable', 'Hypoallergenic', 'Biodegradable', 'Moisture-absorbent'],
      ecoRating: 4,
      softnessRating: 4,
      durabilityRating: 4,
      editorial: 'Cotton is a natural cellulose fibre harvested from the seed pod of the cotton plant. It is soft and breathable, with a high capacity for moisture absorption. Cotton has been used in textile production for thousands of years and is one of the most widely cultivated natural fibres globally.',
      heroSeed: 'loomi-cotton-hero',
      heroImage: 'images/Cotton Hero.webp',
      cardSeed: 'cotton-fiber',
      cardImage: 'images/Cotton Fabric texture.avif'
    },
    {
      slug: 'linen',
      name: 'Linen',
      tagline: 'Moisture-wicking, antibacterial, cooling.',
      color: 'var(--fc-linen)',
      properties: ['Cooling', 'Moisture-wicking', 'Antibacterial', 'Softens with age'],
      ecoRating: 5,
      softnessRating: 3,
      durabilityRating: 5,
      editorial: 'Linen is a fibre derived from the stalks of the flax plant. It is breathable and moisture-wicking, which makes it well-suited to warm conditions. Linen fabric tends to have a crisp texture when new and softens gradually with use and washing.',
      heroSeed: 'loomi-linen-hero',
      heroImage: 'images/Flax Field.webp',
      cardSeed: 'linen-fiber',
      cardImage: 'images/linen fabric texture.webp'
    },
    {
      slug: 'merino-wool',
      name: 'Merino Wool',
      tagline: 'Temperature-regulating, naturally soft.',
      color: 'var(--fc-wool)',
      properties: ['Temperature-regulating', 'Odour-resistant', 'Naturally elastic', 'Biodegradable'],
      ecoRating: 4,
      softnessRating: 5,
      durabilityRating: 4,
      editorial: 'Merino wool comes from Merino sheep and is defined by its fine fibre diameter — typically between 15 and 24 microns — which allows it to be worn close to the skin. It is a protein-based fibre with natural crimp that contributes to its elasticity and thermal insulation.',
      heroSeed: 'loomi-merino-hero',
      heroImage: 'images/Merino Wool Hero.webp',
      cardSeed: 'merino-fiber',
      cardImage: 'images/Merino Wool Fabric Texture.webp'
    },
    {
      slug: 'cashmere',
      name: 'Cashmere',
      tagline: 'Ultra-soft, non-irritating, long-lasting.',
      color: 'var(--fc-cashmere)',
      properties: ['Ultra-soft', 'Non-irritating', 'Insulating', 'Long-lasting'],
      ecoRating: 3,
      softnessRating: 5,
      durabilityRating: 5,
      editorial: 'Cashmere is derived from the fine undercoat of cashmere goats, typically collected during the spring moulting season. The fibres are fine and lightweight. Because each animal yields a limited amount of usable fibre per year, cashmere is one of the less abundant natural fibres in textile production.',
      heroSeed: 'loomi-cashmere-hero',
      heroImage: 'images/Cashmere Hero.webp',
      cardSeed: 'cashmere-fiber',
      cardImage: 'images/Cashmere fabric texture.jpg'
    },
    {
      slug: 'silk',
      name: 'Silk',
      tagline: 'Naturally smooth, gentle on sensitive skin.',
      color: 'var(--fc-silk)',
      properties: ['Naturally smooth', 'Temperature-balancing', 'Hypoallergenic', 'Biodegradable'],
      ecoRating: 3,
      softnessRating: 5,
      durabilityRating: 3,
      editorial: 'Silk is a natural protein fibre produced by silkworms as they spin their cocoons, most commonly from the Bombyx mori species. The fibre has a triangular cross-section that gives it a characteristic lustre and smooth texture. It is lightweight and naturally temperature-regulating.',
      heroSeed: 'loomi-silk-hero',
      heroImage: 'images/Silk Hero.webp',
      cardSeed: 'silk-fiber',
      cardImage: 'images/Silk fabric texture.webp'
    },
    {
      slug: 'hemp',
      name: 'Hemp',
      tagline: 'Durable, UV-resistant, earth-replenishing.',
      color: 'var(--fc-hemp)',
      properties: ['UV-resistant', 'Durable', 'Earth-replenishing', 'Mildew-resistant'],
      ecoRating: 5,
      softnessRating: 3,
      durabilityRating: 5,
      editorial: 'Hemp fibre is extracted from the stalks of the Cannabis sativa plant. It is among the more durable natural textile fibres and can be grown across a range of climates. Hemp fabric tends to be coarser initially and softens with repeated use and washing.',
      heroSeed: 'loomi-hemp-hero',
      heroImage: 'images/Hemp hero.webp',
      cardSeed: 'hemp-fiber',
      cardImage: 'images/Hemp Fabric Texture.webp'
    }
  ];

  /* ─── BRANDS ──────────────────────────────────────────────────── */
  var BRANDS = [
    {
      slug: 'pact',
      name: 'Pact',
      tagline: 'Organic Cotton Essentials',
      oneLiner: 'GOTS-certified organic cotton basics made in Fair Trade certified factories.',
      description: 'Pact has been making organic cotton basics since 2009. Every garment is GOTS-certified and produced in Fair Trade certified factories. Their ethos: better basics, better world — at prices that don\'t require a second thought.',
      heroSeed: 'loomi-pact-hero',
      primaryFiber: 'cotton',
      avgFibers: [
        { name: 'Organic Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton)' }
      ],
      criteria: ['GOTS Certified', 'Fair Trade Certified', 'Carbon offset shipping', 'Plastic-free packaging'],
      ecoTier: 3,
      /* ── Affiliate integration ── */
      affiliateNetwork: 'Partnerize',
      shopUrl: 'https://wearpact.com',
      freeShip: '$35+',
      returnWindow: '30 days',
      commission: '10%'
    },
    {
      slug: 'kotn',
      name: 'Kotn',
      tagline: 'Egyptian Cotton Staples',
      oneLiner: 'Direct-trade Egyptian cotton grown in the Nile Delta, no middlemen.',
      description: 'Kotn works directly with Egyptian cotton farmers in the Nile Delta, cutting out every middleman. The result is exceptionally fine cotton at honest prices, traceable to the field. B-Corp certified since 2020.',
      heroSeed: 'loomi-kotn-hero',
      primaryFiber: 'cotton',
      avgFibers: [
        { name: 'Egyptian Cotton', slug: 'cotton', pct: 97, color: 'var(--fc-cotton-eg)' },
        { name: 'Elastane', slug: 'elastane', pct: 3, color: 'var(--fc-elastane)' }
      ],
      criteria: ['Direct trade', 'Egyptian Cotton Association', 'Living wages verified', 'B-Corp certified'],
      ecoTier: 3,
      /* ── Affiliate integration ── */
      affiliateNetwork: 'ShareASale',
      shopUrl: 'https://kotn.com',
      freeShip: '$100+',
      returnWindow: '15 days',
      commission: '5%'
    },
    {
      slug: 'thought',
      name: 'Thought',
      tagline: 'Sustainable Lifestyle Mix',
      oneLiner: 'Considered clothing for everyday life, in hemp, linen and merino.',
      description: 'Thought (formerly Braintree) has been making considered clothing since 1995. They pioneered natural-blend fabrics and remain committed to organic and low-impact fibers across their entire range. Climate Neutral certified.',
      heroSeed: 'loomi-thought-hero',
      primaryFiber: 'hemp',
      avgFibers: [
        { name: 'Hemp', slug: 'hemp', pct: 55, color: 'var(--fc-hemp)' },
        { name: 'Organic Cotton', slug: 'cotton', pct: 45, color: 'var(--fc-cotton)' }
      ],
      criteria: ['B-Corp certified', 'Climate Neutral', 'GOTS organic fibers', 'OEKO-TEX Standard 100'],
      ecoTier: 3,
      /* ── Affiliate integration ── */
      affiliateNetwork: 'Awin',
      shopUrl: 'https://www.thoughtclothing.com',
      freeShip: '£60+',
      returnWindow: '30 days',
      commission: '8%'
    },
    {
      slug: 'eileen-fisher',
      name: 'Eileen Fisher',
      tagline: 'Timeless Premium Natural',
      oneLiner: 'Simple, timeless silhouettes in silk, merino, linen and organic cotton since 1984.',
      description: 'Eileen Fisher has been simplifying wardrobes since 1984. Their system of dressing — where every piece works with every other — is built on the finest natural fibers: silk, merino, linen, organic cotton. Take-back program included.',
      heroSeed: 'loomi-ef-hero',
      primaryFiber: 'silk',
      avgFibers: [
        { name: 'Mulberry Silk', slug: 'silk', pct: 60, color: 'var(--fc-silk)' },
        { name: 'Merino Wool', slug: 'merino-wool', pct: 40, color: 'var(--fc-wool)' }
      ],
      criteria: ['Bluesign certified', 'Responsible Wool Standard', 'GOTS cotton', 'Take-back program'],
      ecoTier: 3,
      /* ── Affiliate integration ── */
      affiliateNetwork: 'ShareASale',
      shopUrl: 'https://www.eileenfisher.com',
      freeShip: '$250+',
      returnWindow: '30 days',
      commission: '5%'
    },
    {
      slug: 'finisterre',
      name: 'Finisterre',
      tagline: 'Cold Water Surf & Outdoor',
      oneLiner: 'Designed for cold water and wild places, built from merino, hemp and wool.',
      description: 'Born on the Cornish coast, Finisterre makes technical clothing for the sea and mountains. They use merino wool, hemp and responsibly-sourced materials — performance without petroleum derivatives.',
      heroSeed: 'loomi-fin-hero',
      primaryFiber: 'merino-wool',
      avgFibers: [
        { name: 'Merino Wool', slug: 'merino-wool', pct: 70, color: 'var(--fc-wool)' },
        { name: 'Hemp', slug: 'hemp', pct: 30, color: 'var(--fc-hemp)' }
      ],
      criteria: ['B-Corp certified', 'Responsible Wool Standard', 'Climate Positive', 'Repair & return service'],
      ecoTier: 3,
      /* ── Affiliate integration ── */
      affiliateNetwork: 'Awin',
      shopUrl: 'https://finisterre.com',
      freeShip: '£50+',
      returnWindow: '30 days',
      commission: '8%'
    }
  ];

  /* ── API INTEGRATION ROADMAP ──────────────────────────────────────
     Brands vetted and READY for catalog API integration (all 4 gates passed):
     ┌─────────────────────┬────────────────┬────────┬──────────────────┐
     │ Brand               │ Network        │ Comm.  │ Products.json    │
     ├─────────────────────┼────────────────┼────────┼──────────────────┤
     │ Pact ✓ (live)       │ Partnerize     │ 10%    │ Open, paginated  │
     │ WAMA Underwear      │ Refersion      │ 15-20% │ Open (~11 SKUs)  │
     │ KENT                │ ShareASale     │ 10%    │ Open (~5 SKUs)   │
     │ Faherty             │ Rakuten        │ 4-7%   │ Open (300-500)   │
     │ Indigenous          │ Refersion      │ 10%    │ Open (~20-40)    │
     │ Harvest & Mill      │ Awin           │ TBD    │ Open (~18)       │
     │ Knickey/Subset      │ ShareASale     │ 10-15% │ Open (~16)       │
     │ Groceries Apparel   │ ShareASale     │ Varies │ Open (~18)       │
     │ Toad&Co             │ Impact         │ 8%     │ Open (80-120)    │
     └─────────────────────┴────────────────┴────────┴──────────────────┘
     Next step: /products.json → parse material % from body_html → map to PRODUCTS array schema.
     Material data format per brand documented in tier-a-integration-gates.csv.
  ── */

  /* ─── PRODUCTS (48) ───────────────────────────────────────────── */
  var PRODUCTS = [

    /* ══ PACT ══════════════════════════════════════════════════════ */
    {
      slug: 'pact-classic-crewneck-tee',
      name: 'Organic Cotton Classic Crewneck Tee',
      brand: 'pact',
      price: 38,
      salePrice: null,
      gender: ['women', 'men'],
      categories: ['tops'],
      fibers: [{ name: 'Organic Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: true,
      isOnSale: false,
      image: 'https://picsum.photos/seed/pact-crewneck-tee/600/800',
      description: 'A wardrobe anchor in 100% GOTS-certified organic cotton. Relaxed crewneck fit, pre-shrunk, in 12 earthy tones. The tee you reach for first.',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      shopUrl: 'https://wearpact.com/products/organic-cotton-classic-crewneck-tee'
    },
    {
      slug: 'pact-waffle-henley',
      name: 'Waffle-Knit Organic Cotton Henley',
      brand: 'pact',
      price: 52,
      salePrice: null,
      gender: ['men'],
      categories: ['tops'],
      fibers: [{ name: 'Organic Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton)' }],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/pact-waffle-henley/600/800',
      description: 'Textured waffle knit in GOTS-certified organic cotton. Three-button henley placket, relaxed fit. Wears as well over a long-sleeve as it does alone.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      shopUrl: 'https://wearpact.com/products/waffle-knit-organic-cotton-henley'
    },
    {
      slug: 'pact-kids-bodysuit',
      name: 'Kids Go-To Organic Cotton Bodysuit',
      brand: 'pact',
      price: 28,
      salePrice: null,
      gender: ['kids'],
      categories: ['tops', 'sets'],
      fibers: [{ name: 'Organic Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: true,
      isOnSale: false,
      image: 'https://picsum.photos/seed/pact-kids-bodysuit/600/800',
      description: 'Snap-close bodysuit in ultra-soft organic cotton. Gentle on new skin, easy for parents. GOTS-certified, dye-free options available.',
      sizes: ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
      shopUrl: 'https://wearpact.com/products/kids-go-to-organic-cotton-bodysuit'
    },
    {
      slug: 'pact-french-terry-jogger',
      name: 'Organic French Terry Jogger',
      brand: 'pact',
      price: 68,
      salePrice: 48,
      gender: ['women', 'men'],
      categories: ['trousers'],
      fibers: [{ name: 'Organic Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: false,
      isOnSale: true,
      image: 'https://picsum.photos/seed/pact-terry-jogger/600/800',
      description: 'Soft French terry in 100% organic cotton — the jogger that works from morning to evening. Elastic waist, side pockets, tapered leg. Currently on sale.',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      shopUrl: 'https://wearpact.com/products/organic-french-terry-jogger'
    },
    {
      slug: 'pact-longsleeve-pocket-tee',
      name: 'Organic Cotton Long-Sleeve Pocket Tee',
      brand: 'pact',
      price: 44,
      salePrice: null,
      gender: ['women', 'men'],
      categories: ['tops'],
      fibers: [{ name: 'Organic Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton)' }],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/pact-longsleeve-tee/600/800',
      description: 'Lightweight long-sleeve with a chest pocket in GOTS-certified organic cotton. A layering essential that moves from under a shirt to on its own.',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      shopUrl: 'https://wearpact.com/products/organic-cotton-long-sleeve-pocket-tee'
    },
    {
      slug: 'pact-kids-everyday-tee-2pack',
      name: 'Kids Organic Cotton Everyday Tee 2-Pack',
      brand: 'pact',
      price: 34,
      salePrice: null,
      gender: ['kids'],
      categories: ['tops'],
      fibers: [{ name: 'Organic Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: true,
      isOnSale: false,
      image: 'https://picsum.photos/seed/pact-kids-tee-2pack/600/800'
    },
    {
      slug: 'pact-womens-vneck-tee',
      name: 'Organic Cotton V-Neck Tee',
      brand: 'pact',
      price: 36,
      salePrice: 26,
      gender: ['women'],
      categories: ['tops'],
      fibers: [{ name: 'Organic Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: false,
      isOnSale: true,
      image: 'https://picsum.photos/seed/pact-vneck-tee/600/800'
    },
    {
      slug: 'pact-kids-legging',
      name: 'Kids Organic Cotton Legging',
      brand: 'pact',
      price: 32,
      salePrice: null,
      gender: ['kids'],
      categories: ['bottoms'],
      fibers: [
        { name: 'Organic Cotton', slug: 'cotton', pct: 95, color: 'var(--fc-cotton)' },
        { name: 'Elastane', slug: 'elastane', pct: 5, color: 'var(--fc-elastane)' }
      ],
      naturalPct: 95,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/pact-kids-legging/600/800'
    },
    {
      slug: 'pact-kids-puffer',
      name: 'Kids Organic Cotton Puffer Jacket',
      brand: 'pact',
      price: 72,
      salePrice: null,
      gender: ['kids'],
      categories: ['outerwear'],
      fibers: [{ name: 'Organic Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton)' }],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/pact-kids-puffer/600/800'
    },
    {
      slug: 'pact-kids-sleepwear',
      name: 'Kids Organic Cotton Sleepwear Set',
      brand: 'pact',
      price: 46,
      salePrice: null,
      gender: ['kids'],
      categories: ['sleepwear'],
      fibers: [{ name: 'Organic Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: true,
      isOnSale: false,
      image: 'https://picsum.photos/seed/pact-kids-sleep/600/800'
    },

    /* ══ KOTN ═══════════════════════════════════════════════════════ */
    {
      slug: 'kotn-relaxed-shirt',
      name: 'Egyptian Cotton Relaxed Shirt',
      brand: 'kotn',
      price: 88,
      salePrice: null,
      gender: ['women', 'men'],
      categories: ['tops', 'shirts'],
      fibers: [{ name: 'Egyptian Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton-eg)' }],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/kotn-relaxed-shirt/600/800'
    },
    {
      slug: 'kotn-rib-tank',
      name: 'Essential Cotton Rib Tank',
      brand: 'kotn',
      price: 45,
      salePrice: null,
      gender: ['women'],
      categories: ['tops'],
      fibers: [
        { name: 'Egyptian Cotton', slug: 'cotton', pct: 95, color: 'var(--fc-cotton-eg)' },
        { name: 'Elastane', slug: 'elastane', pct: 5, color: 'var(--fc-elastane)' }
      ],
      naturalPct: 95,
      isNew: false,
      isBestSeller: true,
      isOnSale: false,
      image: 'https://picsum.photos/seed/kotn-rib-tank/600/800'
    },
    {
      slug: 'kotn-slub-pullover',
      name: 'Cotton Slub Pullover Sweater',
      brand: 'kotn',
      price: 98,
      salePrice: null,
      gender: ['women', 'men'],
      categories: ['knitwear'],
      fibers: [{ name: 'Egyptian Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton-eg)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/kotn-slub-pullover/600/800'
    },
    {
      slug: 'kotn-linen-cotton-midi-dress',
      name: 'Linen-Cotton Midi Shirt Dress',
      brand: 'kotn',
      price: 120,
      salePrice: null,
      gender: ['women'],
      categories: ['dresses'],
      fibers: [
        { name: 'Linen', slug: 'linen', pct: 55, color: 'var(--fc-linen)' },
        { name: 'Organic Cotton', slug: 'cotton', pct: 45, color: 'var(--fc-cotton)' }
      ],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/kotn-linen-midi/600/800'
    },
    {
      slug: 'kotn-kids-cotton-set',
      name: 'Kids Egyptian Cotton Tee + Short Set',
      brand: 'kotn',
      price: 58,
      salePrice: null,
      gender: ['kids'],
      categories: ['sets', 'tops', 'bottoms'],
      fibers: [{ name: 'Egyptian Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton-eg)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: true,
      isOnSale: false,
      image: 'https://picsum.photos/seed/kotn-kids-set/600/800'
    },
    {
      slug: 'kotn-wide-leg-trousers',
      name: 'Wide-Leg Cotton Twill Trousers',
      brand: 'kotn',
      price: 110,
      salePrice: 82,
      gender: ['women'],
      categories: ['trousers'],
      fibers: [{ name: 'Egyptian Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton-eg)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: false,
      isOnSale: true,
      image: 'https://picsum.photos/seed/kotn-wide-trousers/600/800'
    },
    {
      slug: 'kotn-mens-oxford-shirt',
      name: 'Egyptian Cotton Oxford Shirt',
      brand: 'kotn',
      price: 94,
      salePrice: null,
      gender: ['men'],
      categories: ['shirts'],
      fibers: [{ name: 'Egyptian Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton-eg)' }],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/kotn-oxford-shirt/600/800'
    },
    {
      slug: 'kotn-sleep-set',
      name: 'Egyptian Cotton Sleep Set',
      brand: 'kotn',
      price: 128,
      salePrice: null,
      gender: ['women'],
      categories: ['sleepwear'],
      fibers: [{ name: 'Egyptian Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton-eg)' }],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/kotn-sleep-set/600/800'
    },
    {
      slug: 'kotn-mens-underwear',
      name: 'Egyptian Cotton Boxer Brief 3-Pack',
      brand: 'kotn',
      price: 68,
      salePrice: null,
      gender: ['men'],
      categories: ['underwear'],
      fibers: [
        { name: 'Egyptian Cotton', slug: 'cotton', pct: 95, color: 'var(--fc-cotton-eg)' },
        { name: 'Elastane', slug: 'elastane', pct: 5, color: 'var(--fc-elastane)' }
      ],
      naturalPct: 95,
      isNew: false,
      isBestSeller: true,
      isOnSale: false,
      image: 'https://picsum.photos/seed/kotn-boxer-brief/600/800'
    },

    /* ══ THOUGHT ════════════════════════════════════════════════════ */
    {
      slug: 'thought-hemp-linen-shirt',
      name: 'Hemp & Linen Everyday Shirt',
      brand: 'thought',
      price: 95,
      salePrice: null,
      gender: ['women', 'men'],
      categories: ['tops', 'shirts'],
      fibers: [
        { name: 'Hemp', slug: 'hemp', pct: 55, color: 'var(--fc-hemp)' },
        { name: 'Linen', slug: 'linen', pct: 45, color: 'var(--fc-linen)' }
      ],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/thought-hemp-linen-shirt/600/800'
    },
    {
      slug: 'thought-merino-cardigan',
      name: 'Merino Wool Open Cardigan',
      brand: 'thought',
      price: 145,
      salePrice: null,
      gender: ['women'],
      categories: ['knitwear', 'outerwear'],
      fibers: [{ name: 'Merino Wool', slug: 'merino-wool', pct: 100, color: 'var(--fc-wool)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: true,
      isOnSale: false,
      image: 'https://picsum.photos/seed/thought-merino-cardigan/600/800'
    },
    {
      slug: 'thought-hemp-trousers',
      name: 'Hemp Twill Tapered Trousers',
      brand: 'thought',
      price: 110,
      salePrice: 79,
      gender: ['men'],
      categories: ['trousers'],
      fibers: [
        { name: 'Hemp', slug: 'hemp', pct: 55, color: 'var(--fc-hemp)' },
        { name: 'Organic Cotton', slug: 'cotton', pct: 45, color: 'var(--fc-cotton)' }
      ],
      naturalPct: 100,
      isNew: false,
      isBestSeller: false,
      isOnSale: true,
      image: 'https://picsum.photos/seed/thought-hemp-trousers/600/800'
    },
    {
      slug: 'thought-hemp-wrap-dress',
      name: 'Hemp & Cotton Wrap Dress',
      brand: 'thought',
      price: 118,
      salePrice: null,
      gender: ['women'],
      categories: ['dresses'],
      fibers: [
        { name: 'Hemp', slug: 'hemp', pct: 60, color: 'var(--fc-hemp)' },
        { name: 'Organic Cotton', slug: 'cotton', pct: 40, color: 'var(--fc-cotton)' }
      ],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/thought-wrap-dress/600/800'
    },
    {
      slug: 'thought-merino-longsleeeve',
      name: 'Merino Wool Long-Sleeve Top',
      brand: 'thought',
      price: 88,
      salePrice: null,
      gender: ['women'],
      categories: ['tops'],
      fibers: [{ name: 'Merino Wool', slug: 'merino-wool', pct: 100, color: 'var(--fc-wool)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/thought-merino-top/600/800'
    },
    {
      slug: 'thought-hemp-linen-mens-shirt',
      name: 'Hemp Linen Long-Sleeve Shirt',
      brand: 'thought',
      price: 98,
      salePrice: null,
      gender: ['men'],
      categories: ['tops', 'shirts'],
      fibers: [
        { name: 'Hemp', slug: 'hemp', pct: 50, color: 'var(--fc-hemp)' },
        { name: 'Linen', slug: 'linen', pct: 50, color: 'var(--fc-linen)' }
      ],
      naturalPct: 100,
      isNew: false,
      isBestSeller: true,
      isOnSale: false,
      image: 'https://picsum.photos/seed/thought-hemp-ls-shirt/600/800'
    },
    {
      slug: 'thought-kids-cotton-play-set',
      name: 'Kids Organic Cotton Play Set',
      brand: 'thought',
      price: 62,
      salePrice: null,
      gender: ['kids'],
      categories: ['sets'],
      fibers: [{ name: 'Organic Cotton', slug: 'cotton', pct: 100, color: 'var(--fc-cotton)' }],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/thought-kids-set/600/800'
    },
    {
      slug: 'thought-mens-merino-crew',
      name: 'Merino Wool Crew Neck Jumper',
      brand: 'thought',
      price: 138,
      salePrice: null,
      gender: ['men'],
      categories: ['knitwear'],
      fibers: [{ name: 'Merino Wool', slug: 'merino-wool', pct: 100, color: 'var(--fc-wool)' }],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/thought-merino-crew/600/800'
    },
    {
      slug: 'thought-silk-blouse',
      name: 'Silk & Organic Cotton Blouse',
      brand: 'thought',
      price: 128,
      salePrice: null,
      gender: ['women'],
      categories: ['tops'],
      fibers: [
        { name: 'Mulberry Silk', slug: 'silk', pct: 70, color: 'var(--fc-silk)' },
        { name: 'Organic Cotton', slug: 'cotton', pct: 30, color: 'var(--fc-cotton)' }
      ],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/thought-silk-blouse/600/800'
    },

    /* ══ EILEEN FISHER ══════════════════════════════════════════════ */
    {
      slug: 'ef-silk-georgette-blouse',
      name: 'Silk Georgette Boxy Blouse',
      brand: 'eileen-fisher',
      price: 298,
      salePrice: null,
      gender: ['women'],
      categories: ['tops'],
      fibers: [{ name: 'Mulberry Silk', slug: 'silk', pct: 100, color: 'var(--fc-silk)' }],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/ef-silk-blouse/600/800'
    },
    {
      slug: 'ef-merino-tunic',
      name: 'Fine Merino Wool Tunic',
      brand: 'eileen-fisher',
      price: 278,
      salePrice: 198,
      gender: ['women'],
      categories: ['tops', 'knitwear'],
      fibers: [{ name: 'Merino Wool', slug: 'merino-wool', pct: 100, color: 'var(--fc-wool)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: true,
      isOnSale: true,
      image: 'https://picsum.photos/seed/ef-merino-tunic/600/800'
    },
    {
      slug: 'ef-linen-wide-pant',
      name: 'Organic Linen Wide-Leg Pant',
      brand: 'eileen-fisher',
      price: 248,
      salePrice: null,
      gender: ['women'],
      categories: ['trousers'],
      fibers: [{ name: 'Organic Linen', slug: 'linen', pct: 100, color: 'var(--fc-linen)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: true,
      isOnSale: false,
      image: 'https://picsum.photos/seed/ef-linen-pant/600/800'
    },
    {
      slug: 'ef-silk-slip-dress',
      name: 'Silk Charmeuse Slip Dress',
      brand: 'eileen-fisher',
      price: 368,
      salePrice: null,
      gender: ['women'],
      categories: ['dresses'],
      fibers: [{ name: 'Mulberry Silk', slug: 'silk', pct: 100, color: 'var(--fc-silk)' }],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/ef-silk-slip/600/800'
    },
    {
      slug: 'ef-cashmere-cardigan',
      name: 'Cashmere Open-Front Cardigan',
      brand: 'eileen-fisher',
      price: 498,
      salePrice: null,
      gender: ['women'],
      categories: ['knitwear', 'outerwear'],
      fibers: [{ name: 'Cashmere', slug: 'cashmere', pct: 100, color: 'var(--fc-cashmere)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/ef-cashmere-cardi/600/800'
    },
    {
      slug: 'ef-linen-shirt-dress',
      name: 'Linen Chambray Shirt Dress',
      brand: 'eileen-fisher',
      price: 318,
      salePrice: 228,
      gender: ['women'],
      categories: ['dresses'],
      fibers: [{ name: 'Organic Linen', slug: 'linen', pct: 100, color: 'var(--fc-linen)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: false,
      isOnSale: true,
      image: 'https://picsum.photos/seed/ef-linen-shirtdress/600/800'
    },
    {
      slug: 'ef-silk-merino-coat',
      name: 'Silk & Merino Wool Coat',
      brand: 'eileen-fisher',
      price: 598,
      salePrice: null,
      gender: ['women'],
      categories: ['outerwear'],
      fibers: [
        { name: 'Merino Wool', slug: 'merino-wool', pct: 70, color: 'var(--fc-wool)' },
        { name: 'Mulberry Silk', slug: 'silk', pct: 30, color: 'var(--fc-silk)' }
      ],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/ef-silk-merino-coat/600/800'
    },
    {
      slug: 'ef-merino-sleep-set',
      name: 'Merino Wool Sleepwear Set',
      brand: 'eileen-fisher',
      price: 348,
      salePrice: null,
      gender: ['women'],
      categories: ['sleepwear'],
      fibers: [{ name: 'Merino Wool', slug: 'merino-wool', pct: 100, color: 'var(--fc-wool)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/ef-merino-sleep/600/800'
    },
    {
      slug: 'ef-cashmere-scarf',
      name: 'Cashmere Knit Wrap',
      brand: 'eileen-fisher',
      price: 228,
      salePrice: null,
      gender: ['women'],
      categories: ['knitwear'],
      fibers: [{ name: 'Cashmere', slug: 'cashmere', pct: 100, color: 'var(--fc-cashmere)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: true,
      isOnSale: false,
      image: 'https://picsum.photos/seed/ef-cashmere-scarf/600/800'
    },

    /* ══ FINISTERRE ═════════════════════════════════════════════════ */
    {
      slug: 'fin-merino-base-layer',
      name: 'Merino Wool 200 Base Layer Top',
      brand: 'finisterre',
      price: 110,
      salePrice: null,
      gender: ['women', 'men'],
      categories: ['tops'],
      fibers: [{ name: 'Merino Wool', slug: 'merino-wool', pct: 100, color: 'var(--fc-wool)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: true,
      isOnSale: false,
      image: 'https://picsum.photos/seed/fin-merino-base/600/800'
    },
    {
      slug: 'fin-hemp-canvas-trouser',
      name: 'Hemp Canvas Utility Trouser',
      brand: 'finisterre',
      price: 148,
      salePrice: null,
      gender: ['men'],
      categories: ['trousers'],
      fibers: [
        { name: 'Hemp', slug: 'hemp', pct: 55, color: 'var(--fc-hemp)' },
        { name: 'Organic Cotton', slug: 'cotton', pct: 45, color: 'var(--fc-cotton)' }
      ],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/fin-hemp-trouser/600/800'
    },
    {
      slug: 'fin-wool-fleece-jacket',
      name: 'Merino Wool Fleece Jacket',
      brand: 'finisterre',
      price: 245,
      salePrice: null,
      gender: ['women', 'men'],
      categories: ['outerwear'],
      fibers: [{ name: 'Merino Wool', slug: 'merino-wool', pct: 100, color: 'var(--fc-wool)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: true,
      isOnSale: false,
      image: 'https://picsum.photos/seed/fin-wool-fleece/600/800'
    },
    {
      slug: 'fin-hemp-tshirt',
      name: 'Hemp & Cotton Graphic Tee',
      brand: 'finisterre',
      price: 58,
      salePrice: null,
      gender: ['men'],
      categories: ['tops'],
      fibers: [
        { name: 'Hemp', slug: 'hemp', pct: 55, color: 'var(--fc-hemp)' },
        { name: 'Organic Cotton', slug: 'cotton', pct: 45, color: 'var(--fc-cotton)' }
      ],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/fin-hemp-tee/600/800'
    },
    {
      slug: 'fin-merino-midlayer',
      name: 'Merino Wool Mid-Layer Crew',
      brand: 'finisterre',
      price: 165,
      salePrice: 118,
      gender: ['men'],
      categories: ['knitwear'],
      fibers: [{ name: 'Merino Wool', slug: 'merino-wool', pct: 100, color: 'var(--fc-wool)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: false,
      isOnSale: true,
      image: 'https://picsum.photos/seed/fin-merino-midlayer/600/800'
    },
    {
      slug: 'fin-womens-rollneck',
      name: 'Merino Wool Roll-Neck',
      brand: 'finisterre',
      price: 125,
      salePrice: null,
      gender: ['women'],
      categories: ['tops', 'knitwear'],
      fibers: [{ name: 'Merino Wool', slug: 'merino-wool', pct: 100, color: 'var(--fc-wool)' }],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/fin-womens-rollneck/600/800'
    },
    {
      slug: 'fin-hemp-linen-shirt',
      name: 'Hemp & Linen Coastal Shirt',
      brand: 'finisterre',
      price: 98,
      salePrice: null,
      gender: ['men'],
      categories: ['tops', 'shirts'],
      fibers: [
        { name: 'Hemp', slug: 'hemp', pct: 60, color: 'var(--fc-hemp)' },
        { name: 'Linen', slug: 'linen', pct: 40, color: 'var(--fc-linen)' }
      ],
      naturalPct: 100,
      isNew: false,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/fin-hemp-linen-shirt/600/800'
    },
    {
      slug: 'fin-merino-womens-dress',
      name: 'Merino Wool Jersey Dress',
      brand: 'finisterre',
      price: 168,
      salePrice: null,
      gender: ['women'],
      categories: ['dresses'],
      fibers: [{ name: 'Merino Wool', slug: 'merino-wool', pct: 100, color: 'var(--fc-wool)' }],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/fin-merino-dress/600/800'
    },
    {
      slug: 'fin-kids-merino-top',
      name: 'Kids Merino Wool Long-Sleeve Top',
      brand: 'finisterre',
      price: 68,
      salePrice: null,
      gender: ['kids'],
      categories: ['tops'],
      fibers: [{ name: 'Merino Wool', slug: 'merino-wool', pct: 100, color: 'var(--fc-wool)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/fin-kids-merino/600/800'
    },
    {
      slug: 'fin-kids-fleece',
      name: 'Kids Merino Wool Fleece',
      brand: 'finisterre',
      price: 92,
      salePrice: null,
      gender: ['kids'],
      categories: ['outerwear'],
      fibers: [{ name: 'Merino Wool', slug: 'merino-wool', pct: 100, color: 'var(--fc-wool)' }],
      naturalPct: 100,
      isNew: false,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/fin-kids-fleece/600/800'
    },

    /* ══ ADDITIONAL CROSS-BRAND ════════════════════════════════════ */
    {
      slug: 'kotn-linen-relaxed-top',
      name: 'Linen & Egyptian Cotton Relaxed Top',
      brand: 'kotn',
      price: 75,
      salePrice: null,
      gender: ['women'],
      categories: ['tops'],
      fibers: [
        { name: 'Linen', slug: 'linen', pct: 50, color: 'var(--fc-linen)' },
        { name: 'Egyptian Cotton', slug: 'cotton', pct: 50, color: 'var(--fc-cotton-eg)' }
      ],
      naturalPct: 100,
      isNew: true,
      isBestSeller: false,
      isOnSale: false,
      image: 'https://picsum.photos/seed/kotn-linen-top/600/800'
    }

  ];

  /* ─── EXPOSE ──────────────────────────────────────────────────── */
  window.LOOMI = { PRODUCTS: PRODUCTS, BRANDS: BRANDS, FIBERS: FIBERS };

})();
