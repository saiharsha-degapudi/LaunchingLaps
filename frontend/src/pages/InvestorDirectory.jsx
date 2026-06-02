import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const FOCUS_FILTERS = ['All', 'FinTech', 'HealthTech', 'AgriTech', 'EdTech', 'CleanTech', 'AI/ML', 'SaaS', 'Emerging Markets']

function InvestorCard({ investor, onMessage }) {
  const stages = investor.preferred_stages?.split(',').map(s => s.trim()) || []
  const industries = investor.industry_focus?.split(',').slice(0, 3).map(i => i.trim()) || []

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col gap-4 p-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-md">
          {investor.user?.full_name?.[0] || 'I'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-brand-800 text-base">{investor.user?.full_name}</h3>
          {investor.firm_name && (
            <p className="text-sm text-gray-500 font-medium">{investor.firm_name}</p>
          )}
          {investor.location && (
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {investor.location}
            </p>
          )}
        </div>
      </div>

      {/* Bio */}
      {investor.user?.bio && (
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">{investor.user.bio}</p>
      )}

      {/* Investment range */}
      <div className="bg-gold-50 border border-gold-200 rounded-xl p-3">
        <p className="text-xs text-gray-500 mb-1 font-medium">Investment Range</p>
        <p className="font-black text-brand-800 text-sm">
          ${Number(investor.investment_min).toLocaleString()} – ${Number(investor.investment_max).toLocaleString()}
        </p>
      </div>

      {/* Focus areas */}
      <div>
        <p className="text-xs text-gray-500 mb-2 font-medium">Focus Areas</p>
        <div className="flex flex-wrap gap-1.5">
          {industries.map(ind => (
            <span key={ind} className="bg-brand-100 text-brand-700 text-xs font-semibold px-2.5 py-1 rounded-full">{ind}</span>
          ))}
        </div>
      </div>

      {/* Stages */}
      <div className="flex flex-wrap gap-1.5">
        {stages.map(s => (
          <span key={s} className="bg-green-100 text-green-700 capitalize text-xs font-semibold px-2.5 py-1 rounded-full">{s}</span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button onClick={() => onMessage(investor)}
          className="flex-1 bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
          Send Message
        </button>
        {investor.website && (
          <a href={investor.website} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors">
            Website
          </a>
        )}
        {investor.linkedin && !investor.website && (
          <a href={investor.linkedin} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors">
            LinkedIn
          </a>
        )}
      </div>
    </div>
  )
}

// Modal: compose message to a specific investor
function MessageModal({ investor, onClose, onSent }) {
  const [message, setMessage] = useState(
    `Hi ${investor.user?.full_name?.split(' ')[0]}, I came across your profile on LaunchingLaps and I'm very interested in connecting. `
  )
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function handleSend(e) {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    setError('')
    try {
      await api.post('/community/messages', {
        receiver_id: investor.user_id,
        body: message.trim(),
      })
      onSent()
      onClose()
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-800 text-white flex items-center justify-center font-bold text-sm">
              {investor.user?.full_name?.[0]}
            </div>
            <div>
              <p className="font-black text-brand-800 text-sm">{investor.user?.full_name}</p>
              <p className="text-xs text-gray-500">{investor.firm_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSend} className="p-5 flex flex-col gap-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Your Message</label>
            <textarea rows={5} value={message} onChange={e => setMessage(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              required />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={sending || !message.trim()}
              className="px-6 py-2.5 bg-brand-800 hover:bg-brand-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-50">
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function InvestorDirectory() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [investors, setInvestors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [focus, setFocus] = useState('All')
  const [messageTarget, setMessageTarget] = useState(null)
  const [messageSent, setMessageSent] = useState(false)

  useEffect(() => {
    async function fetchInvestors() {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/investors/')
        setInvestors(data)
      } catch {
        setError('Failed to load investors. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchInvestors()
  }, [])

  const filtered = investors.filter(inv => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      inv.user?.full_name?.toLowerCase().includes(q) ||
      inv.firm_name?.toLowerCase().includes(q) ||
      inv.industry_focus?.toLowerCase().includes(q) ||
      inv.location?.toLowerCase().includes(q)
    const matchFocus = focus === 'All' || inv.industry_focus?.toLowerCase().includes(focus.toLowerCase())
    return matchSearch && matchFocus
  })

  function handleMessage(investor) {
    if (user?.role === 'investor') {
      // Investors shouldn't message each other this way (redirect to messages)
      navigate('/messages')
      return
    }
    setMessageTarget(investor)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {messageTarget && (
        <MessageModal
          investor={messageTarget}
          onClose={() => setMessageTarget(null)}
          onSent={() => { setMessageSent(true); setTimeout(() => setMessageSent(false), 4000) }}
        />
      )}

      {messageSent && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Message sent! Check your Messages inbox.
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-brand-800">
          {user?.role === 'entrepreneur' ? 'Find Your Investor' : 'Investor Network'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {user?.role === 'entrepreneur'
            ? 'Browse global investors and send them a direct message about your pitch.'
            : 'Connect and co-invest with fellow investors on the platform.'}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 flex flex-col sm:flex-row gap-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, firm, industry, or location…"
          className="input flex-1" />
        <div className="flex gap-2 flex-wrap">
          {FOCUS_FILTERS.map(f => (
            <button key={f} onClick={() => setFocus(f)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                focus === f
                  ? 'bg-brand-800 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-12">
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-brand-800 text-white px-5 py-2 rounded-xl text-sm font-bold">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 font-medium">No investors match your search</p>
          <p className="text-gray-400 text-sm mt-1">Try a different search term or filter.</p>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-4">
            <span className="font-bold text-brand-800">{filtered.length}</span> investor{filtered.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(investor => (
              <InvestorCard key={investor.id} investor={investor} onMessage={handleMessage} />
            ))}
          </div>

          {user?.role === 'entrepreneur' && (
            <div className="mt-10 bg-gradient-to-r from-brand-800 to-brand-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div>
                <p className="text-white font-black text-lg">Not sure which investor to pitch?</p>
                <p className="text-blue-200 text-sm">Use our matching tool — we'll recommend investors based on your pitch.</p>
              </div>
              <button onClick={() => navigate('/pitches')}
                className="flex-shrink-0 bg-gold-500 hover:bg-gold-600 text-white font-black px-6 py-3 rounded-xl transition whitespace-nowrap shadow">
                See My Pitch Matches →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
