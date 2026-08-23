import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import {
  SEED_USER,
  DEFAULT_LOCATION,
  SEED_REPORTS,
  SEED_ALERTS,
  SEED_FARMS,
  SEED_HISTORY,
  uid,
} from '../data/mockData.js'

const STORAGE_KEY = 'agrismart.state.v1'

const DEFAULT_STATE = {
  user: SEED_USER,
  location: DEFAULT_LOCATION,
  language: 'en',
  theme: 'light',
  units: { temp: 'C' },
  settings: {
    notifications: true,
    priceAlerts: true,
    weatherAlerts: true,
    diseaseAlerts: true,
  },
  farms: SEED_FARMS,
  savedReports: SEED_REPORTS,
  history: SEED_HISTORY,
  notifications: SEED_ALERTS,
  chat: [
    {
      id: 'greet',
      role: 'assistant',
      text: 'Namaste! 🙏 I am your AgriSmart assistant. Ask me about crop diseases, fertilizers, weather, mandi prices or government schemes.',
    },
  ],
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const saved = JSON.parse(raw)
    // shallow-merge so newly added default keys survive upgrades
    return {
      ...DEFAULT_STATE,
      ...saved,
      units: { ...DEFAULT_STATE.units, ...(saved.units || {}) },
      settings: { ...DEFAULT_STATE.settings, ...(saved.settings || {}) },
    }
  } catch {
    return DEFAULT_STATE
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: { ...state.user, ...action.payload } }
    case 'SET_LOCATION':
      return { ...state, location: action.payload }
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SET_UNITS':
      return { ...state, units: { ...state.units, ...action.payload } }
    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }

    case 'ADD_FARM':
      return { ...state, farms: [{ ...action.payload, id: uid() }, ...state.farms] }
    case 'UPDATE_FARM':
      return {
        ...state,
        farms: state.farms.map((f) => (f.id === action.payload.id ? { ...f, ...action.payload } : f)),
      }
    case 'REMOVE_FARM':
      return { ...state, farms: state.farms.filter((f) => f.id !== action.payload) }

    case 'ADD_REPORT':
      return { ...state, savedReports: [{ ...action.payload, id: uid() }, ...state.savedReports] }
    case 'REMOVE_REPORT':
      return { ...state, savedReports: state.savedReports.filter((r) => r.id !== action.payload) }

    case 'ADD_HISTORY':
      return { ...state, history: [{ ...action.payload, id: uid() }, ...state.history].slice(0, 100) }
    case 'CLEAR_HISTORY':
      return { ...state, history: [] }

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [{ ...action.payload, id: uid(), read: false }, ...state.notifications],
      }
    case 'MARK_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      }
    case 'MARK_ALL_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }

    case 'SET_CHAT':
      return { ...state, chat: action.payload }
    case 'ADD_CHAT':
      return { ...state, chat: [...state.chat, { ...action.payload, id: uid() }] }

    case 'RESET_ALL':
      return { ...DEFAULT_STATE }

    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  // transient toasts live outside persisted state
  const [toasts, dispatchToast] = useReducer(
    (list, action) => {
      if (action.type === 'ADD') return [...list, action.payload]
      if (action.type === 'REMOVE') return list.filter((t) => t.id !== action.payload)
      return list
    },
    []
  )
  const toastTimers = useRef({})

  // Persist (everything except transient toasts)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota errors */
    }
  }, [state])

  // Apply theme + language to <html>
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
    document.documentElement.lang = state.language
  }, [state.theme, state.language])

  const pushToast = (text, tone = 'success') => {
    const id = uid()
    dispatchToast({ type: 'ADD', payload: { id, text, tone } })
    toastTimers.current[id] = setTimeout(() => {
      dispatchToast({ type: 'REMOVE', payload: id })
      delete toastTimers.current[id]
    }, 3200)
  }
  const removeToast = (id) => dispatchToast({ type: 'REMOVE', payload: id })

  useEffect(() => {
    const timers = toastTimers.current
    return () => Object.values(timers).forEach(clearTimeout)
  }, [])

  const actions = useMemo(
    () => ({
      dispatch,
      setUser: (payload) => dispatch({ type: 'SET_USER', payload }),
      setLocation: (payload) => dispatch({ type: 'SET_LOCATION', payload }),
      setLanguage: (payload) => dispatch({ type: 'SET_LANGUAGE', payload }),
      toggleLanguage: () =>
        dispatch({ type: 'SET_LANGUAGE', payload: state.language === 'en' ? 'hi' : 'en' }),
      setTheme: (payload) => dispatch({ type: 'SET_THEME', payload }),
      toggleTheme: () =>
        dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' }),
      setUnits: (payload) => dispatch({ type: 'SET_UNITS', payload }),
      setSettings: (payload) => dispatch({ type: 'SET_SETTINGS', payload }),
      addFarm: (payload) => dispatch({ type: 'ADD_FARM', payload }),
      updateFarm: (payload) => dispatch({ type: 'UPDATE_FARM', payload }),
      removeFarm: (payload) => dispatch({ type: 'REMOVE_FARM', payload }),
      addReport: (payload) => dispatch({ type: 'ADD_REPORT', payload }),
      removeReport: (payload) => dispatch({ type: 'REMOVE_REPORT', payload }),
      addHistory: (payload) => dispatch({ type: 'ADD_HISTORY', payload }),
      clearHistory: () => dispatch({ type: 'CLEAR_HISTORY' }),
      addNotification: (payload) => dispatch({ type: 'ADD_NOTIFICATION', payload }),
      markRead: (id) => dispatch({ type: 'MARK_READ', payload: id }),
      markAllRead: () => dispatch({ type: 'MARK_ALL_READ' }),
      setChat: (payload) => dispatch({ type: 'SET_CHAT', payload }),
      addChat: (payload) => dispatch({ type: 'ADD_CHAT', payload }),
      resetAll: () => dispatch({ type: 'RESET_ALL' }),
      pushToast,
      removeToast,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.language, state.theme]
  )

  const value = useMemo(() => ({ ...state, toasts, ...actions }), [state, toasts, actions])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within <AppProvider>')
  return ctx
}
