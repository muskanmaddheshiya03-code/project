import { useApp } from '../context/AppContext.jsx'

/* Bilingual UI strings (English / Hindi).
   Data values (crop names, mandi rows, weather API text) are left as-is;
   this covers the chrome, headings, buttons and page intros. */
export const STRINGS = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.disease': 'Disease Detection',
    'nav.soil': 'Soil Nutrition',
    'nav.advisory': 'Crop Advisory',
    'nav.market': 'Market Price',
    'nav.weather': 'Weather',
    'nav.assistant': 'AI Assistant',
    'nav.farms': 'My Farms',
    'nav.history': 'History',
    'nav.reports': 'Saved Reports',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',

    'brand.sub': 'AI Farmer Assistant',
    'search.placeholder': 'Search crops, diseases, solutions...',
    'lang.switch': 'हिंदी',

    'common.viewAll': 'View All',
    'common.viewReport': 'View Report',
    'common.getStarted': 'Get Started',
    'common.save': 'Save Report',
    'common.saved': 'Saved',
    'common.delete': 'Delete',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.analyze': 'Analyze',
    'common.refresh': 'Refresh',
    'common.export': 'Export',
    'common.print': 'Print',
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.clear': 'Clear',

    'hero.title1': 'Smart Farming for',
    'hero.title2': 'Better Tomorrow',
    'hero.desc':
      'Detect diseases, check soil health, get market prices and expert advice — all in one place.',
    'help.title': 'Need Help?',
    'help.sub': 'Ask our AI Assistant',
    'help.chat': 'Chat Now',

    'feature.disease.title': 'Disease Detection',
    'feature.disease.desc': 'Upload leaf image and get disease prediction & solution',
    'feature.disease.cta': 'Upload Image',
    'feature.soil.title': 'Soil Nutrition',
    'feature.soil.desc': 'Check soil health and get fertilizer recommendations',
    'feature.soil.cta': 'Check Soil',
    'feature.market.title': 'Market Prices',
    'feature.market.desc': 'Check current mandi prices and price trends',
    'feature.market.cta': 'View Prices',
    'feature.advisory.title': 'Crop Advisory',
    'feature.advisory.desc': 'Get AI based recommendations for your crop',
    'feature.advisory.cta': 'Get Advice',

    'weather.today': 'Weather Today',
    'weather.humidity': 'Humidity',
    'weather.rain': 'Rain Chance',
    'weather.wind': 'Wind',
    'weather.min': 'Min',
    'weather.max': 'Max',
    'weather.viewForecast': 'View Forecast',

    'market.title': 'Market Prices (Mandi)',
    'market.crop': 'Crop',
    'market.price': 'Price (₹/Quintal)',
    'market.trend': 'Trend',
    'market.checkAll': 'Check All Markets',

    'reports.recent': 'Recent Reports',
    'alerts.title': 'Alerts & Notifications',
    'notif.title': 'Notifications',
    'notif.markAll': 'Mark all read',
    'notif.empty': 'You are all caught up',

    'assistant.title': 'AI Farmer Assistant',
    'assistant.desc':
      'Ask anything about crop, soil, diseases, fertilizers, market or any farming related question...',
    'assistant.placeholder': 'Type your question here...',
    'assistant.new': 'New',
  },
  hi: {
    'nav.dashboard': 'डैशबोर्ड',
    'nav.disease': 'रोग पहचान',
    'nav.soil': 'मृदा पोषण',
    'nav.advisory': 'फसल सलाह',
    'nav.market': 'बाज़ार भाव',
    'nav.weather': 'मौसम',
    'nav.assistant': 'एआई सहायक',
    'nav.farms': 'मेरे खेत',
    'nav.history': 'इतिहास',
    'nav.reports': 'सहेजी रिपोर्ट',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.settings': 'सेटिंग्स',

    'brand.sub': 'एआई किसान सहायक',
    'search.placeholder': 'फसल, रोग, समाधान खोजें...',
    'lang.switch': 'English',

    'common.viewAll': 'सभी देखें',
    'common.viewReport': 'रिपोर्ट देखें',
    'common.getStarted': 'शुरू करें',
    'common.save': 'रिपोर्ट सहेजें',
    'common.saved': 'सहेजा गया',
    'common.delete': 'हटाएँ',
    'common.cancel': 'रद्द करें',
    'common.close': 'बंद करें',
    'common.analyze': 'जाँचें',
    'common.refresh': 'ताज़ा करें',
    'common.export': 'निर्यात',
    'common.print': 'प्रिंट',
    'common.add': 'जोड़ें',
    'common.edit': 'संपादित करें',
    'common.clear': 'साफ़ करें',

    'hero.title1': 'बेहतर कल के लिए',
    'hero.title2': 'स्मार्ट खेती',
    'hero.desc':
      'रोग पहचानें, मृदा स्वास्थ्य जाँचें, बाज़ार भाव और विशेषज्ञ सलाह पाएँ — सब एक ही जगह।',
    'help.title': 'मदद चाहिए?',
    'help.sub': 'हमारे एआई सहायक से पूछें',
    'help.chat': 'अभी चैट करें',

    'feature.disease.title': 'रोग पहचान',
    'feature.disease.desc': 'पत्ती की फ़ोटो अपलोड करें और रोग व समाधान पाएँ',
    'feature.disease.cta': 'फ़ोटो अपलोड करें',
    'feature.soil.title': 'मृदा पोषण',
    'feature.soil.desc': 'मृदा स्वास्थ्य जाँचें और उर्वरक सलाह पाएँ',
    'feature.soil.cta': 'मृदा जाँचें',
    'feature.market.title': 'बाज़ार भाव',
    'feature.market.desc': 'मौजूदा मंडी भाव और मूल्य रुझान देखें',
    'feature.market.cta': 'भाव देखें',
    'feature.advisory.title': 'फसल सलाह',
    'feature.advisory.desc': 'अपनी फसल के लिए एआई आधारित सलाह पाएँ',
    'feature.advisory.cta': 'सलाह पाएँ',

    'weather.today': 'आज का मौसम',
    'weather.humidity': 'नमी',
    'weather.rain': 'बारिश की संभावना',
    'weather.wind': 'हवा',
    'weather.min': 'न्यून.',
    'weather.max': 'अधिक.',
    'weather.viewForecast': 'पूर्वानुमान देखें',

    'market.title': 'बाज़ार भाव (मंडी)',
    'market.crop': 'फसल',
    'market.price': 'भाव (₹/क्विंटल)',
    'market.trend': 'रुझान',
    'market.checkAll': 'सभी मंडियाँ देखें',

    'reports.recent': 'हाल की रिपोर्ट',
    'alerts.title': 'सूचनाएँ',
    'notif.title': 'सूचनाएँ',
    'notif.markAll': 'सभी पढ़ा चिह्नित करें',
    'notif.empty': 'कोई नई सूचना नहीं',

    'assistant.title': 'एआई किसान सहायक',
    'assistant.desc':
      'फसल, मृदा, रोग, उर्वरक, बाज़ार या खेती से जुड़ा कोई भी सवाल पूछें...',
    'assistant.placeholder': 'अपना सवाल यहाँ लिखें...',
    'assistant.new': 'नया',
  },
}

export function translate(key, lang = 'en') {
  return STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key
}

/** Hook returning a translator bound to the active language. */
export function useT() {
  const { language } = useApp()
  return (key) => translate(key, language)
}
