/* Lightweight offline "AI" for the farmer assistant — keyword/intent based.
   No external LLM needed; responses are curated agronomy guidance. */

export const QUICK_PROMPTS = [
  'How do I control yellow rust in wheat?',
  'Best fertilizer for low nitrogen soil?',
  'When should I irrigate my wheat crop?',
  "Today's mandi price for wheat?",
  'Which government schemes can help me?',
]

const INTENTS = [
  {
    match: /(hello|hi|hey|namaste|namaskar|good (morning|evening|afternoon))/i,
    reply: () =>
      'Namaste! 🙏 How can I help with your farm today? You can ask about diseases, fertilizers, irrigation, mandi prices or schemes.',
  },
  {
    match: /(thank|thanks|dhanyavad|shukriya)/i,
    reply: () => 'You’re welcome! 🌱 Wishing you a healthy harvest. Ask me anything else anytime.',
  },
  {
    match: /(rust|yellow rust|stripe rust)/i,
    reply: () =>
      'Yellow rust in wheat 🌾\n• Spray Propiconazole 25% EC @ 0.1% (about 200 ml/acre).\n• Repeat after 12–15 days if it persists.\n• Remove volunteer wheat plants and avoid excess nitrogen.\nScout fields during cool, humid weather when risk is highest.',
  },
  {
    match: /(blight|late blight|early blight)/i,
    reply: () =>
      'For blight (potato/tomato) 🍅\n• Preventive spray of Mancozeb 75% WP @ 0.25%.\n• On infection use Cymoxanil + Mancozeb.\n• Avoid overhead irrigation and improve airflow between plants.',
  },
  {
    match: /(pest|insect|borer|aphid|whitefly|armyworm)/i,
    reply: () =>
      'Integrated pest management helps 🐛\n• Install pheromone/yellow sticky traps to monitor.\n• Encourage natural enemies; spray only above the economic threshold.\n• Rotate insecticide groups to avoid resistance. Tell me the crop + pest for a specific dose.',
  },
  {
    match: /(fertiliz|urea|nitrogen|npk|nutrient|dap|potash)/i,
    reply: () =>
      'Fertilizer guidance 🧪\n• Base it on a soil test (use the Soil Nutrition tool).\n• Low N: top-dress urea (~45 kg/acre) in splits.\n• Add well-rotted FYM (4–5 t/acre) to build organic matter.\n• Don’t over-apply nitrogen — it invites disease and lodging.',
  },
  {
    match: /(soil|ph|acidic|alkaline)/i,
    reply: () =>
      'Soil health 🌱\n• Ideal pH for most crops is 6.0–7.5.\n• Acidic soil (<6): apply agricultural lime.\n• Alkaline soil (>8): add gypsum and organic matter.\nRun the Soil Nutrition tool to get NPK-based recommendations.',
  },
  {
    match: /(irrigat|water|when.*water|moisture)/i,
    reply: () =>
      'Irrigation tips 💧\n• Wheat: irrigate at crown-root (~21 days), tillering, flowering and grain-filling.\n• Check the Weather page — skip irrigation if rain is likely in 24–48h.\n• Water early morning or evening to cut evaporation.',
  },
  {
    match: /(price|mandi|market|rate|sell|bhav)/i,
    reply: () =>
      'Mandi prices 📈 Open the Market Price page for live rates. Recent modal prices (₹/quintal): Wheat ~2,275 · Paddy ~1,940 · Mustard ~5,850 · Chana ~5,320. Prices vary by market and day.',
  },
  {
    match: /(weather|rain|forecast|temperature|storm)/i,
    reply: () =>
      'Weather ⛅ Check the Weather page for a live 7-day forecast for your location. If heavy rain is expected, delay spraying and top-dressing until the field dries.',
  },
  {
    match: /(scheme|subsidy|loan|pm.?kisan|kcc|insurance|fasal bima)/i,
    reply: () =>
      'Helpful schemes 🏛️\n• PM-KISAN: ₹6,000/year income support.\n• Kisan Credit Card (KCC): low-interest crop loans.\n• PM Fasal Bima Yojana: crop insurance against losses.\n• Soil Health Card: free soil testing. Visit your nearest CSC or agriculture office to apply.',
  },
  {
    match: /(wheat|gehu)/i,
    reply: () =>
      'Wheat 🌾 Sow mid-Nov to early Dec. Use 120:60:40 NPK kg/ha (half N basal). Give 4–6 irrigations; the crown-root stage (~21 DAS) is the most critical. Watch for yellow rust in cool, humid weather.',
  },
  {
    match: /(rice|paddy|dhan)/i,
    reply: () =>
      'Paddy 🌾 Transplant Jun–Jul; keep 2–5 cm standing water during tillering. Use 100:50:50 NPK kg/ha in 3 splits. Watch for stem borer and blast; avoid excess nitrogen.',
  },
]

const FALLBACK =
  'I can help with crop diseases, fertilizers, soil health, irrigation, weather, mandi prices and government schemes. Try asking, e.g. “How do I control yellow rust in wheat?” or tap a suggestion below.'

export function getAssistantReply(message = '') {
  const text = message.trim()
  if (!text) return FALLBACK
  for (const intent of INTENTS) {
    if (intent.match.test(text)) return intent.reply()
  }
  return FALLBACK
}
