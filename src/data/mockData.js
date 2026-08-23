/* ============================================================
   AgriSmart — seed data & knowledge bases
   (used for initial state + graceful fallbacks + rule engines)
   ============================================================ */

export const uid = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

export const SEED_USER = {
  name: 'Ramesh Kumar',
  email: 'ramesh.kumar@example.com',
  phone: '+91 98765 43210',
  state: 'Uttar Pradesh',
  district: 'Lucknow',
  avatar: '',
  farmSize: '4.5',
  crops: ['Wheat', 'Paddy', 'Mustard'],
  memberSince: 'Jan 2024',
}

export const DEFAULT_LOCATION = {
  name: 'Lucknow',
  admin1: 'Uttar Pradesh',
  country: 'India',
  lat: 26.85,
  lon: 80.95,
}

/* ---- Market prices (fallback when data.gov.in is unavailable) ----
   Prices are ₹ per quintal (modal), matching the reference mockup. */
export const MARKET_FALLBACK = [
  { commodity: 'Wheat', market: 'Lucknow', state: 'Uttar Pradesh', min: 2180, max: 2340, modal: 2275, trend: 2.35 },
  { commodity: 'Paddy', market: 'Lucknow', state: 'Uttar Pradesh', min: 1850, max: 2010, modal: 1940, trend: 1.12 },
  { commodity: 'Maize', market: 'Kanpur', state: 'Uttar Pradesh', min: 1900, max: 2080, modal: 2000, trend: -0.8 },
  { commodity: 'Chana', market: 'Kanpur', state: 'Uttar Pradesh', min: 5150, max: 5480, modal: 5320, trend: 1.25 },
  { commodity: 'Mustard', market: 'Agra', state: 'Uttar Pradesh', min: 5680, max: 6010, modal: 5850, trend: 2.75 },
  { commodity: 'Bajra', market: 'Agra', state: 'Uttar Pradesh', min: 1980, max: 2160, modal: 2075, trend: 0.6 },
  { commodity: 'Sugarcane', market: 'Meerut', state: 'Uttar Pradesh', min: 340, max: 375, modal: 360, trend: 0.15 },
  { commodity: 'Potato', market: 'Agra', state: 'Uttar Pradesh', min: 1100, max: 1420, modal: 1250, trend: -1.4 },
  { commodity: 'Onion', market: 'Varanasi', state: 'Uttar Pradesh', min: 1600, max: 2100, modal: 1850, trend: 3.1 },
  { commodity: 'Soybean', market: 'Jhansi', state: 'Uttar Pradesh', min: 4400, max: 4720, modal: 4560, trend: -0.45 },
  { commodity: 'Tomato', market: 'Lucknow', state: 'Uttar Pradesh', min: 900, max: 1500, modal: 1180, trend: 4.2 },
  { commodity: 'Arhar (Tur)', market: 'Kanpur', state: 'Uttar Pradesh', min: 6800, max: 7300, modal: 7050, trend: 1.9 },
]

/* Trend arrows on the dashboard card mirror the mockup exactly */
export const DASHBOARD_MARKET = MARKET_FALLBACK.slice(0, 5)

/* ---- Seed reports (the 3 shown in the mockup) ---- */
export const SEED_REPORTS = [
  {
    id: 'seed-disease',
    type: 'disease',
    title: 'Wheat Leaf - Yellow Rust',
    crop: 'Wheat',
    date: '2024-05-20',
    summary: 'Confidence: 92%',
    confidence: 92,
    detail: {
      disease: 'Yellow Rust (Stripe Rust)',
      cause: 'Fungus Puccinia striiformis, favoured by cool, humid weather.',
      symptoms: [
        'Yellow-orange pustules in stripes along leaf veins',
        'Premature leaf drying and reduced grain filling',
      ],
      treatment: [
        'Spray Propiconazole 25% EC @ 0.1% (200 ml/acre)',
        'Repeat after 15 days if infection persists',
        'Remove and destroy heavily infected debris',
      ],
    },
  },
  {
    id: 'seed-soil',
    type: 'soil',
    title: 'Soil Health Report',
    crop: 'General',
    date: '2024-05-18',
    summary: 'NPK: Low | pH: 6.2',
    detail: {
      n: 'Low',
      p: 'Medium',
      k: 'Medium',
      ph: 6.2,
      recommendation: [
        'Apply 45 kg Urea/acre to correct nitrogen deficiency',
        'Add well-decomposed FYM (4-5 tonnes/acre) before sowing',
        'Soil is slightly acidic — monitor before next season',
      ],
    },
  },
  {
    id: 'seed-advisory',
    type: 'advisory',
    title: 'Wheat Crop Advisory',
    crop: 'Wheat',
    date: '2024-05-15',
    summary: 'Next Irrigation: 3 Days',
    detail: {
      stage: 'Grain filling',
      nextIrrigation: 'In 3 days (critical for grain weight)',
      advice: [
        'Maintain adequate soil moisture during grain filling',
        'Watch for yellow rust in cool humid spells',
        'Avoid nitrogen top-dressing at this stage',
      ],
    },
  },
]

/* ---- Alerts / notifications ---- */
export const SEED_ALERTS = [
  {
    id: 'al1',
    tone: 'warn',
    title: 'Yellow Rust is high in your area',
    body: 'Wheat crop may be at risk. Tap to know more.',
    time: '2h ago',
    read: false,
    link: '/disease-detection',
  },
  {
    id: 'al2',
    tone: 'info',
    title: 'Soil nitrogen is low',
    body: 'Use urea or organic fertilizer to improve.',
    time: '1d ago',
    read: false,
    link: '/soil-nutrition',
  },
  {
    id: 'al3',
    tone: 'success',
    title: 'Good sowing window ahead',
    body: 'Favourable weather expected for the next 5 days.',
    time: '2d ago',
    read: true,
    link: '/weather',
  },
]

/* ---- Seed farms ---- */
export const SEED_FARMS = [
  {
    id: 'farm1',
    name: 'North Field',
    village: 'Kakori, Lucknow',
    area: '2.5',
    crop: 'Wheat',
    soil: 'Loam',
    sownOn: '2024-11-12',
    lat: 26.87,
    lon: 80.78,
  },
  {
    id: 'farm2',
    name: 'Canal Plot',
    village: 'Mohanlalganj, Lucknow',
    area: '2.0',
    crop: 'Paddy',
    soil: 'Clay',
    sownOn: '2024-06-25',
    lat: 26.68,
    lon: 80.98,
  },
]

/* ---- Seed history ---- */
export const SEED_HISTORY = [
  { id: 'h1', type: 'disease', text: 'Analyzed wheat leaf — Yellow Rust (92%)', date: '2024-05-20' },
  { id: 'h2', type: 'soil', text: 'Soil health checked — NPK Low, pH 6.2', date: '2024-05-18' },
  { id: 'h3', type: 'advisory', text: 'Generated wheat crop advisory', date: '2024-05-15' },
  { id: 'h4', type: 'market', text: 'Viewed mandi prices for Lucknow', date: '2024-05-14' },
]

export const COMMODITIES = [
  'Wheat', 'Paddy', 'Maize', 'Chana', 'Mustard', 'Bajra', 'Sugarcane',
  'Potato', 'Onion', 'Tomato', 'Soybean', 'Arhar (Tur)',
]

export const INDIAN_STATES = [
  'Uttar Pradesh', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Maharashtra',
  'Rajasthan', 'Bihar', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Telangana',
  'Andhra Pradesh', 'West Bengal', 'Odisha', 'Kerala',
]

/* ============================================================
   Crop knowledge base — powers Crop Advisory
   ============================================================ */
export const CROP_KB = {
  Wheat: {
    seasons: ['Rabi'],
    sowing: 'Mid-Nov to early Dec (Rabi)',
    irrigation: '4–6 irrigations; critical at crown-root (21 DAS), tillering, flowering & grain-filling',
    fertilizer: '120 kg N, 60 kg P₂O₅, 40 kg K₂O per hectare. Half N basal, rest in two splits.',
    pests: ['Yellow/Brown rust', 'Aphids', 'Termites'],
    yield: '18–22 quintal/acre',
    tips: [
      'Treat seed with fungicide before sowing',
      'Do not delay first irrigation beyond crown-root stage',
      'Scout for rust during cool, humid weather',
    ],
  },
  Paddy: {
    seasons: ['Kharif'],
    sowing: 'Nursery in mid-May; transplant Jun–Jul',
    irrigation: 'Keep 5 cm standing water; drain 10 days before harvest',
    fertilizer: '100 kg N, 50 kg P₂O₅, 50 kg K₂O per hectare in 3 splits.',
    pests: ['Stem borer', 'Leaf folder', 'Blast', 'BLB'],
    yield: '20–26 quintal/acre',
    tips: [
      'Maintain 2–5 cm water during tillering',
      'Use certified, treated seed',
      'Avoid excess nitrogen to reduce blast risk',
    ],
  },
  Maize: {
    seasons: ['Kharif', 'Rabi'],
    sowing: 'Kharif: Jun–Jul; Rabi: Oct–Nov',
    irrigation: 'Critical at knee-high, tasseling & grain-filling',
    fertilizer: '120 kg N, 60 kg P₂O₅, 40 kg K₂O per hectare.',
    pests: ['Fall armyworm', 'Stem borer', 'Common rust'],
    yield: '22–28 quintal/acre',
    tips: [
      'Scout weekly for fall armyworm whorls',
      'Ensure good drainage in Kharif',
    ],
  },
  Mustard: {
    seasons: ['Rabi'],
    sowing: 'Oct to mid-Nov',
    irrigation: '2 irrigations: pre-flowering & pod formation',
    fertilizer: '80 kg N, 40 kg P₂O₅, 40 kg K₂O + 40 kg S per hectare.',
    pests: ['Aphids', 'Painted bug', 'White rust'],
    yield: '7–10 quintal/acre',
    tips: [
      'Sulphur boosts oil content — do not skip',
      'Monitor aphids at flowering, spray if needed',
    ],
  },
  Chana: {
    seasons: ['Rabi'],
    sowing: 'Oct–Nov',
    irrigation: '1–2 light irrigations; avoid waterlogging',
    fertilizer: '20 kg N, 40 kg P₂O₅ per hectare + Rhizobium seed treatment.',
    pests: ['Pod borer (Helicoverpa)', 'Wilt'],
    yield: '6–9 quintal/acre',
    tips: [
      'Use wilt-resistant varieties in problem fields',
      'Install pheromone traps for pod borer',
    ],
  },
  Sugarcane: {
    seasons: ['Annual'],
    sowing: 'Autumn (Sep–Oct) or Spring (Feb–Mar)',
    irrigation: 'Frequent; every 7–10 days in summer',
    fertilizer: '250 kg N, 100 kg P₂O₅, 120 kg K₂O per hectare in splits.',
    pests: ['Early shoot borer', 'Top borer', 'Pyrilla'],
    yield: '300–400 quintal/acre',
    tips: ['Earthing-up improves anchorage', 'Trash mulching conserves moisture'],
  },
  Potato: {
    seasons: ['Rabi'],
    sowing: 'Mid-Oct to Nov',
    irrigation: 'Light frequent irrigation; critical at tuberization',
    fertilizer: '150 kg N, 80 kg P₂O₅, 100 kg K₂O per hectare.',
    pests: ['Late blight', 'Early blight', 'Aphids'],
    yield: '100–120 quintal/acre',
    tips: ['Spray preventively for late blight in humid weather', 'Earthing-up prevents greening'],
  },
  Tomato: {
    seasons: ['Rabi', 'Kharif'],
    sowing: 'Nursery then transplant; Jul–Aug or Oct–Nov',
    irrigation: 'Regular; avoid water stress at flowering & fruiting',
    fertilizer: '100 kg N, 60 kg P₂O₅, 60 kg K₂O per hectare.',
    pests: ['Fruit borer', 'Late blight', 'Leaf curl virus'],
    yield: '120–160 quintal/acre',
    tips: ['Stake plants for better fruit quality', 'Remove leaf-curl infected plants early'],
  },
  Cotton: {
    seasons: ['Kharif'],
    sowing: 'Apr–May (irrigated) / with monsoon',
    irrigation: 'Critical at flowering & boll development',
    fertilizer: '120 kg N, 60 kg P₂O₅, 60 kg K₂O per hectare.',
    pests: ['Pink bollworm', 'Whitefly', 'Jassids'],
    yield: '8–12 quintal/acre',
    tips: ['Use pheromone traps for pink bollworm', 'Avoid late-season nitrogen'],
  },
}

/* ============================================================
   Disease knowledge base — powers (simulated) Disease Detection
   ============================================================ */
export const DISEASE_KB = [
  {
    id: 'wheat-yellow-rust',
    crop: 'Wheat',
    disease: 'Yellow Rust (Stripe Rust)',
    severity: 'High',
    keywords: ['wheat', 'rust', 'yellow', 'stripe'],
    cause: 'Fungus Puccinia striiformis; spreads in cool (10–15°C), humid weather.',
    symptoms: [
      'Yellow-orange pustules arranged in stripes along leaf veins',
      'Leaves dry prematurely, reducing grain filling',
    ],
    treatment: [
      'Spray Propiconazole 25% EC @ 0.1% (200 ml/acre)',
      'Repeat after 12–15 days if disease persists',
      'Remove volunteer wheat plants that harbour spores',
    ],
    prevention: ['Grow resistant varieties', 'Avoid excess nitrogen', 'Timely sowing'],
  },
  {
    id: 'rice-blast',
    crop: 'Paddy',
    disease: 'Rice Blast',
    severity: 'High',
    keywords: ['rice', 'paddy', 'blast'],
    cause: 'Fungus Magnaporthe oryzae; high humidity and excess nitrogen worsen it.',
    symptoms: [
      'Spindle-shaped spots with grey centres and brown margins',
      'Neck rot causing whiteheads and yield loss',
    ],
    treatment: [
      'Spray Tricyclazole 75% WP @ 0.06% (120 g/acre)',
      'Drain excess water from the field',
      'Reduce nitrogen top-dressing temporarily',
    ],
    prevention: ['Balanced fertilization', 'Certified seed', 'Avoid dense planting'],
  },
  {
    id: 'tomato-late-blight',
    crop: 'Tomato',
    disease: 'Late Blight',
    severity: 'High',
    keywords: ['tomato', 'blight', 'late'],
    cause: 'Oomycete Phytophthora infestans; cool, wet, cloudy conditions.',
    symptoms: [
      'Water-soaked greasy patches on leaves turning brown',
      'White fungal growth on leaf undersides in humidity',
    ],
    treatment: [
      'Spray Mancozeb 75% WP @ 0.25% preventively',
      'On infection, use Cymoxanil + Mancozeb combination',
      'Remove and destroy infected foliage',
    ],
    prevention: ['Avoid overhead irrigation', 'Ensure spacing/airflow', 'Resistant varieties'],
  },
  {
    id: 'potato-early-blight',
    crop: 'Potato',
    disease: 'Early Blight',
    severity: 'Medium',
    keywords: ['potato', 'early', 'blight', 'alternaria'],
    cause: 'Fungus Alternaria solani; warm, humid weather and older leaves.',
    symptoms: [
      'Concentric “target-board” rings on lower leaves',
      'Yellowing and drop of affected leaves',
    ],
    treatment: [
      'Spray Mancozeb 75% WP @ 0.25% at 10-day intervals',
      'Improve plant nutrition and drainage',
    ],
    prevention: ['Crop rotation', 'Balanced potassium', 'Remove crop debris'],
  },
  {
    id: 'maize-common-rust',
    crop: 'Maize',
    disease: 'Common Rust',
    severity: 'Medium',
    keywords: ['maize', 'corn', 'rust', 'common'],
    cause: 'Fungus Puccinia sorghi; moderate temperatures and high humidity.',
    symptoms: [
      'Cinnamon-brown powdery pustules on both leaf surfaces',
      'Severe infection dries leaves early',
    ],
    treatment: [
      'Spray Propiconazole @ 0.1% at first sign',
      'Ensure balanced nutrition',
    ],
    prevention: ['Resistant hybrids', 'Timely sowing', 'Field sanitation'],
  },
  {
    id: 'healthy',
    crop: 'General',
    disease: 'Healthy — No disease detected',
    severity: 'None',
    keywords: ['healthy', 'green', 'good'],
    cause: 'The leaf appears healthy with no visible disease symptoms.',
    symptoms: ['Uniform green colour', 'No lesions, pustules or spots'],
    treatment: [
      'Continue current crop management',
      'Keep scouting weekly for early symptoms',
    ],
    prevention: ['Balanced nutrition', 'Preventive monitoring', 'Field hygiene'],
  },
]

/* WMO weather code → label + emoji-ish icon key (used by weather UI) */
export const WEATHER_CODES = {
  0: { label: 'Clear sky', icon: 'sun' },
  1: { label: 'Mainly clear', icon: 'sun' },
  2: { label: 'Partly cloudy', icon: 'cloud-sun' },
  3: { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Fog', icon: 'cloud' },
  48: { label: 'Rime fog', icon: 'cloud' },
  51: { label: 'Light drizzle', icon: 'drizzle' },
  53: { label: 'Drizzle', icon: 'drizzle' },
  55: { label: 'Dense drizzle', icon: 'drizzle' },
  61: { label: 'Light rain', icon: 'rain' },
  63: { label: 'Rain', icon: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain' },
  66: { label: 'Freezing rain', icon: 'rain' },
  67: { label: 'Freezing rain', icon: 'rain' },
  71: { label: 'Light snow', icon: 'snow' },
  73: { label: 'Snow', icon: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow' },
  80: { label: 'Rain showers', icon: 'rain' },
  81: { label: 'Rain showers', icon: 'rain' },
  82: { label: 'Violent showers', icon: 'rain' },
  95: { label: 'Thunderstorm', icon: 'storm' },
  96: { label: 'Thunderstorm', icon: 'storm' },
  99: { label: 'Thunderstorm', icon: 'storm' },
}
