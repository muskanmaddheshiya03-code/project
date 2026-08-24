/* ============================================================
   AgriSmart — Sell Mode seed data, status machine & helpers
   (Direct Farmer → AgriSmart → Consumer. Mock data only.)

   NOTE: This is deliberately structured so a backend can replace
   SEED_* and the pure helpers below without touching the UI.
   ============================================================ */
import { uid } from './mockData.js'

/* ---- Catalog ---- */
export const UNITS = ['Quintal', 'kg']
export const GRADES = ['A', 'B', 'C']
export const AVAILABILITY = ['Pre-order (before harvest)', 'Available now', 'Limited stock']

export const CATEGORIES = ['Grains', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds', 'Spices']

const CROP_CATEGORY = {
  Wheat: 'Grains', Paddy: 'Grains', 'Basmati Paddy': 'Grains', Maize: 'Grains', Bajra: 'Grains',
  Tomato: 'Vegetables', Potato: 'Vegetables', Onion: 'Vegetables', 'Green Peas': 'Vegetables',
  Chana: 'Pulses', 'Arhar (Tur)': 'Pulses', Moong: 'Pulses',
  Mustard: 'Oilseeds', Soybean: 'Oilseeds', Groundnut: 'Oilseeds',
  Turmeric: 'Spices', Chilli: 'Spices',
  Mango: 'Fruits', Banana: 'Fruits', Guava: 'Fruits',
}
export const categoryOf = (crop) => CROP_CATEGORY[crop] || 'Grains'

/* Crop → gradient used by the placeholder photo tile (keeps localStorage light). */
const CROP_TILE = {
  Grains: ['#e9c46a', '#c99a2e'],
  Vegetables: ['#8fce6b', '#4e9a3d'],
  Fruits: ['#f4a259', '#e07a3a'],
  Pulses: ['#c9a66b', '#9c7a3c'],
  Oilseeds: ['#f2d16b', '#d1a02e'],
  Spices: ['#e07a5f', '#c65b3f'],
}
export const photoTileFor = (crop) => CROP_TILE[categoryOf(crop)] || CROP_TILE.Grains

/* ============================================================
   Order / reservation status machine
   ============================================================ */
export const ORDER_FLOW = [
  'reservation_pending',
  'reservation_confirmed',
  'awaiting_harvest',
  'harvest_confirmed',
  'awaiting_consumer',
  'order_confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
]

export const TERMINAL_STATUSES = ['cancelled', 'unable_to_fulfill']

/* i18n key + pill class per status (label text lives in i18n/strings.js) */
export const STATUS_META = {
  reservation_pending: { i18n: 'sell.status.reservation_pending', pill: 'pill-amber' },
  reservation_confirmed: { i18n: 'sell.status.reservation_confirmed', pill: 'pill-green' },
  awaiting_harvest: { i18n: 'sell.status.awaiting_harvest', pill: 'pill-purple' },
  harvest_confirmed: { i18n: 'sell.status.harvest_confirmed', pill: 'pill-teal' },
  awaiting_consumer: { i18n: 'sell.status.awaiting_consumer', pill: 'pill-amber' },
  order_confirmed: { i18n: 'sell.status.order_confirmed', pill: 'pill-green' },
  preparing: { i18n: 'sell.status.preparing', pill: 'pill-purple' },
  out_for_delivery: { i18n: 'sell.status.out_for_delivery', pill: 'pill-teal' },
  delivered: { i18n: 'sell.status.delivered', pill: 'pill-green' },
  cancelled: { i18n: 'sell.status.cancelled', pill: 'pill-red' },
  unable_to_fulfill: { i18n: 'sell.status.unable_to_fulfill', pill: 'pill-red' },
}

export const isTerminal = (status) => TERMINAL_STATUSES.includes(status)
export const stepIndex = (status) => ORDER_FLOW.indexOf(status)

/* ---- Quantity helpers (pure — safe for a backend to reimplement) ---- */
export const activeOrders = (orders, listingId) =>
  orders.filter((o) => o.listingId === listingId && !isTerminal(o.status))

export const reservedForListing = (orders, listingId) =>
  activeOrders(orders, listingId).reduce((sum, o) => sum + Number(o.quantity || 0), 0)

export function remainingQty(listing, orders) {
  const expected = Number(listing?.quantity || 0)
  return Math.max(0, expected - reservedForListing(orders, listing.id))
}

/* ============================================================
   Seed farmers & buyers (no traders/middlemen — end consumers only)
   ============================================================ */
const ME = { name: 'Ramesh Kumar', village: 'Kakori', district: 'Lucknow', state: 'Uttar Pradesh' }
const F_SUNITA = { name: 'Sunita Devi', village: 'Fatehpur', district: 'Barabanki', state: 'Uttar Pradesh' }
const F_HARPREET = { name: 'Harpreet Singh', village: 'Jagraon', district: 'Ludhiana', state: 'Punjab' }
const F_ANIL = { name: 'Anil Patil', village: 'Niphad', district: 'Nashik', state: 'Maharashtra' }

/* ============================================================
   Seed listings (Expected values — final values arrive at harvest)
   Fixed ids so seeded orders can reference them.
   ============================================================ */
export const SEED_LISTINGS = [
  {
    id: 'lst-wheat-me',
    mine: true,
    farmer: ME,
    crop: 'Wheat',
    category: 'Grains',
    quantity: 50,
    unit: 'Quintal',
    price: 2300,
    harvestDate: '2026-09-20',
    location: 'Kakori, Lucknow',
    images: [],
    description: 'HD-2967 variety, well-irrigated Rabi crop. Sun-dried and cleaned before dispatch.',
    grade: 'A',
    availability: 'Pre-order (before harvest)',
    verified: { info: true, quality: false },
    status: 'listed',
    harvest: null,
    createdAt: '2026-08-10',
  },
  {
    id: 'lst-tomato-me',
    mine: true,
    farmer: ME,
    crop: 'Tomato',
    category: 'Vegetables',
    quantity: 12,
    unit: 'Quintal',
    price: 1180,
    harvestDate: '2026-08-18',
    location: 'Kakori, Lucknow',
    images: [],
    description: 'Hybrid tomatoes, drip-irrigated. Harvest window has arrived — final quantity to be confirmed.',
    grade: 'B',
    availability: 'Available now',
    verified: { info: true, quality: false },
    status: 'listed',
    harvest: null,
    createdAt: '2026-08-01',
  },
  {
    id: 'lst-paddy-harpreet',
    mine: false,
    farmer: F_HARPREET,
    crop: 'Basmati Paddy',
    category: 'Grains',
    quantity: 80,
    unit: 'Quintal',
    price: 3200,
    harvestDate: '2026-10-05',
    location: 'Jagraon, Ludhiana',
    images: [],
    description: 'Pusa Basmati 1121. Long grain, aromatic. Pre-book before the October harvest.',
    grade: 'A',
    availability: 'Pre-order (before harvest)',
    verified: { info: true, quality: false },
    status: 'listed',
    harvest: null,
    createdAt: '2026-08-06',
  },
  {
    id: 'lst-potato-sunita',
    mine: false,
    farmer: F_SUNITA,
    crop: 'Potato',
    category: 'Vegetables',
    quantity: 40,
    unit: 'Quintal',
    price: 1250,
    harvestDate: '2026-08-20',
    location: 'Fatehpur, Barabanki',
    images: [],
    description: 'Kufri Jyoti. Graded and stored in cold-chain immediately after harvest.',
    grade: 'A',
    availability: 'Available now',
    verified: { info: true, quality: false },
    status: 'harvested',
    harvest: {
      actualQuantity: 38,
      finalPrice: 1300,
      grade: 'A',
      images: [],
      harvestDate: '2026-08-21',
      notes: 'Yield slightly below estimate but excellent size and minimal spoilage.',
    },
    createdAt: '2026-07-28',
  },
  {
    id: 'lst-onion-anil',
    mine: false,
    farmer: F_ANIL,
    crop: 'Onion',
    category: 'Vegetables',
    quantity: 60,
    unit: 'Quintal',
    price: 1850,
    harvestDate: '2026-08-12',
    location: 'Niphad, Nashik',
    images: [],
    description: 'Nashik red onion, low pungency. Cured and bagged for long storage.',
    grade: 'A',
    availability: 'Available now',
    verified: { info: true, quality: false },
    status: 'harvested',
    harvest: {
      actualQuantity: 58,
      finalPrice: 1820,
      grade: 'A',
      images: [],
      harvestDate: '2026-08-13',
      notes: 'Good curing weather. Final price slightly lower than expected.',
    },
    createdAt: '2026-07-20',
  },
  {
    id: 'lst-mustard-harpreet',
    mine: false,
    farmer: F_HARPREET,
    crop: 'Mustard',
    category: 'Oilseeds',
    quantity: 25,
    unit: 'Quintal',
    price: 5850,
    harvestDate: '2026-11-01',
    location: 'Jagraon, Ludhiana',
    images: [],
    description: 'High-oil-content mustard for the coming Rabi harvest. Reserve early.',
    grade: 'A',
    availability: 'Pre-order (before harvest)',
    verified: { info: true, quality: false },
    status: 'listed',
    harvest: null,
    createdAt: '2026-08-14',
  },
  {
    id: 'lst-chana-sunita',
    mine: false,
    farmer: F_SUNITA,
    crop: 'Chana',
    category: 'Pulses',
    quantity: 30,
    unit: 'Quintal',
    price: 5320,
    harvestDate: '2026-10-15',
    location: 'Fatehpur, Barabanki',
    images: [],
    description: 'Desi chana, bold grain. Grown without chemical residue concerns.',
    grade: 'B',
    availability: 'Pre-order (before harvest)',
    verified: { info: true, quality: false },
    status: 'listed',
    harvest: null,
    createdAt: '2026-08-09',
  },
]

/* ============================================================
   Seed orders / reservations
   - mine listing  → the user is the FARMER (incoming reservation)
   - buyerMine     → the user is the CONSUMER (their reservation)
   ============================================================ */
export const SEED_ORDERS = [
  {
    id: 'ord-a',
    listingId: 'lst-wheat-me',
    crop: 'Wheat',
    unit: 'Quintal',
    quantity: 5,
    expectedPrice: 2300,
    finalPrice: null,
    buyer: 'Priya Sharma',
    buyerMine: false,
    status: 'reservation_pending',
    history: [{ status: 'reservation_pending', at: '2026-08-22' }],
    createdAt: '2026-08-22',
  },
  {
    id: 'ord-e',
    listingId: 'lst-wheat-me',
    crop: 'Wheat',
    unit: 'Quintal',
    quantity: 10,
    expectedPrice: 2300,
    finalPrice: null,
    buyer: 'Rahul Verma',
    buyerMine: false,
    status: 'awaiting_harvest',
    history: [
      { status: 'reservation_pending', at: '2026-08-18' },
      { status: 'reservation_confirmed', at: '2026-08-19' },
      { status: 'awaiting_harvest', at: '2026-08-19' },
    ],
    createdAt: '2026-08-18',
  },
  {
    id: 'ord-b',
    listingId: 'lst-paddy-harpreet',
    crop: 'Basmati Paddy',
    unit: 'Quintal',
    quantity: 3,
    expectedPrice: 3200,
    finalPrice: null,
    buyer: 'Ramesh Kumar',
    buyerMine: true,
    status: 'awaiting_harvest',
    history: [
      { status: 'reservation_pending', at: '2026-08-15' },
      { status: 'reservation_confirmed', at: '2026-08-16' },
      { status: 'awaiting_harvest', at: '2026-08-16' },
    ],
    createdAt: '2026-08-15',
  },
  {
    id: 'ord-c',
    listingId: 'lst-potato-sunita',
    crop: 'Potato',
    unit: 'Quintal',
    quantity: 4,
    expectedPrice: 1250,
    finalPrice: 1300,
    buyer: 'Ramesh Kumar',
    buyerMine: true,
    status: 'awaiting_consumer',
    history: [
      { status: 'reservation_pending', at: '2026-08-10' },
      { status: 'reservation_confirmed', at: '2026-08-11' },
      { status: 'awaiting_harvest', at: '2026-08-11' },
      { status: 'harvest_confirmed', at: '2026-08-21' },
      { status: 'awaiting_consumer', at: '2026-08-21' },
    ],
    createdAt: '2026-08-10',
  },
  {
    id: 'ord-d',
    listingId: 'lst-onion-anil',
    crop: 'Onion',
    unit: 'Quintal',
    quantity: 2,
    expectedPrice: 1850,
    finalPrice: 1820,
    buyer: 'Ramesh Kumar',
    buyerMine: true,
    status: 'delivered',
    history: [
      { status: 'reservation_pending', at: '2026-07-25' },
      { status: 'reservation_confirmed', at: '2026-07-26' },
      { status: 'awaiting_harvest', at: '2026-07-26' },
      { status: 'harvest_confirmed', at: '2026-08-13' },
      { status: 'awaiting_consumer', at: '2026-08-13' },
      { status: 'order_confirmed', at: '2026-08-14' },
      { status: 'preparing', at: '2026-08-15' },
      { status: 'out_for_delivery', at: '2026-08-16' },
      { status: 'delivered', at: '2026-08-17' },
    ],
    createdAt: '2026-07-25',
  },
]

/* Factory for a new reservation created from the marketplace (user = consumer). */
export function newReservation({ listing, quantity, buyer, at }) {
  return {
    id: uid(),
    listingId: listing.id,
    crop: listing.crop,
    unit: listing.unit,
    quantity: Number(quantity),
    expectedPrice: listing.price,
    finalPrice: listing.harvest?.finalPrice ?? null,
    buyer,
    buyerMine: true,
    status: 'reservation_pending',
    history: [{ status: 'reservation_pending', at }],
    createdAt: at,
  }
}
