import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Bot } from 'lucide-react'
import { useT } from '../../i18n/strings.js'

export default function AssistantBar() {
  const t = useT()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const text = q.trim()
    navigate('/ai-assistant', text ? { state: { q: text } } : undefined)
  }

  return (
    <section className="card assistant-bar">
      <div className="assistant-ava">
        <Bot size={30} />
      </div>
      <div className="assistant-info">
        <div className="assistant-title-row">
          <span className="assistant-title">{t('assistant.title')}</span>
          <span className="pill pill-green">{t('assistant.new')}</span>
        </div>
        <div className="assistant-desc">{t('assistant.desc')}</div>
      </div>
      <form className="assistant-form" onSubmit={submit}>
        <input
          placeholder={t('assistant.placeholder')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="assistant-send" type="submit" aria-label="Send">
          <Send size={18} />
        </button>
      </form>
    </section>
  )
}
