import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Bot, Send, Sparkles, Trash2, User } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { getAssistantReply, QUICK_PROMPTS } from '../utils/assistant.js'

const GREETING =
  'Namaste! 🙏 I am your AgriSmart assistant. Ask me about crop diseases, fertilizers, weather, mandi prices or government schemes.'
const today = () => new Date().toISOString().slice(0, 10)

export default function AIAssistant() {
  const { chat, addChat, setChat, addHistory } = useApp()
  const routeState = useLocation().state
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)
  const timerRef = useRef(null)
  const autoSent = useRef(false)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat, typing])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const send = (raw) => {
    const text = (raw ?? input).trim()
    if (!text || typing) return
    addChat({ role: 'user', text })
    addHistory({ type: 'chat', text: `Asked assistant: “${text.slice(0, 60)}${text.length > 60 ? '…' : ''}”`, date: today() })
    setInput('')
    setTyping(true)
    timerRef.current = setTimeout(() => {
      addChat({ role: 'assistant', text: getAssistantReply(text) })
      setTyping(false)
    }, 800 + Math.min(text.length * 12, 900))
  }

  // Auto-send a question passed from the dashboard assistant bar (once).
  useEffect(() => {
    if (!autoSent.current && routeState?.q) {
      autoSent.current = true
      send(routeState.q)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeState])

  const clear = () => {
    clearTimeout(timerRef.current)
    setTyping(false)
    setChat([{ id: 'greet', role: 'assistant', text: GREETING }])
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="row-between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="page-title">
              <span className="ico"><Bot size={24} /></span>
              AI Farmer Assistant
            </div>
            <p className="page-sub">Ask anything about crops, soil, diseases, fertilizers, weather, market or schemes.</p>
          </div>
          <button className="btn btn-ghost" onClick={clear}><Trash2 size={16} /> Clear chat</button>
        </div>
      </div>

      <div className="card chat-card">
        <div className="chat-window">
          {chat.map((m) => (
            <div key={m.id} className={`msg ${m.role}`}>{m.text}</div>
          ))}
          {typing && (
            <div className="msg assistant" aria-label="Assistant is typing">
              <span className="typing"><i /><i /><i /></span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="chat-quick">
          {QUICK_PROMPTS.map((p) => (
            <button key={p} className="chip" onClick={() => send(p)} disabled={typing}>
              <Sparkles size={13} style={{ verticalAlign: -2, marginRight: 4 }} />{p}
            </button>
          ))}
        </div>

        <form
          className="chat-input-bar"
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <input
            placeholder="Type your question here…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button className="btn btn-primary" type="submit" disabled={typing || !input.trim()}>
            <Send size={18} /> Send
          </button>
        </form>
      </div>
    </div>
  )
}
