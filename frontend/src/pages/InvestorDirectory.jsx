import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const FOCUS_FILTERS = ['All', 'FinTech', 'HealthTech', 'AgriTech', 'EdTech', 'CleanTech', 'AI/ML', 'SaaS', 'Emerging Markets']

function InvestorCard({ investor, onMessage }) {
  const stages = investor.preferred_stages?.split(',').map(s => s.trim()) || []
  const industries = investor.industry_focus?.split(',').slice(0, 3).map(i => i.trim()) || []

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col gap-4 hover:border-zinc-300 hover:shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {investor.user?.full_name?.[0] || 'I'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-zinc-900">{investor.user?.full_name}</h3>
          {investor.firm_name && (
            <p className="text-xs text-zinc-500">{investor.firm_name}</p>
          )}
          {investor.location && (
            <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
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
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">{investor.user.bio}</p>
      )}

      {/* Investment range */}
      <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
        <p className="text-xs text-zinc-400 mb-1">Investment Range</p>
        <p className="text-sm font-semibold text-zinc-900">
          ${Number(investor.investment_min).toLocaleString()} – ${Number(investor.investment_max).toLocaleString()}
        </p>
      </div>

      {/* Focus areas */}
      {industries.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 mb-2">Focus Areas</p>
          <div className="flex flex-wrap gap-1.5">
            {industries.map(ind => (
              <span key={ind} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600">{ind}</span>
            ))}
          </div>
        </div>
      )}

      {/* Stages */}
      {stages.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {stages.map(s => (
            <span key={s} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 capitalize">{s}</span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-zinc-100">
        <button
          onClick={() => onMessage(investor)}
          className="flex-1 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Message
        </button>
        {investor.website && (
          <a
            href={investor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Website
          </a>
        )}
        {investor.linkedin && !investor.website && (
          <a
            href={investor.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            LinkedIn
          </a>
        )}
      </div>
    </div>
  )
}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white border border-zinc-200 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">
              {investor.user?.full_name?.[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">{investor.user?.full_name}</p>
              <p className="text-xs text-zinc-400">{investor.firm_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition"
          >
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSend} className="p-5 flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Your Message</label>
            <textarea
              rows={5}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white resize-none"
              required
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
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
      navigate('/messages')
      return
    }
    setMessageTarget(investor)
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      {messageTarget && (
        <MessageModal
          investor={messageTarget}
          onClose={() => setMessageTarget(null)}
          onSent={() => { setMessageSent(true); setTimeout(() => setMessageSent(false), 4000) }}
        />
      )}

      {messageSent && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Message sent! Check your Messages inbox.
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
            {user?.role === 'entrepreneur' ? 'Find Your Investor' : 'Investor Network'}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {user?.role === 'entrepreneur'
              ? 'Browse global investors and send them a direct message about your pitch.'
              : 'Connect and co-invest with fellow investors on the platform.'}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, firm, industry, or location…"
            className="w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white flex-1"
          />
          <div className="flex gap-2 flex-wrap">
            {FOCUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFocus(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  focus === f
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white border border-zinc-200 rounded-xl text-center py-12">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl text-center py-16">
            <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-700">No investors match your search</p>
            <p className="text-xs text-zinc-400 mt-1">Try a different search term or filter.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-zinc-400 mb-4">
              <span className="font-medium text-zinc-700">{filtered.length}</span> investor{filtered.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(investor => (
                <InvestorCard key={investor.id} investor={investor} onMessage={handleMessage} />
              ))}
            </div>

            {user?.role === 'entrepreneur' && (
              <div className="mt-8 bg-white border border-zinc-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Not sure which investor to pitch?</p>
                  <p className="text-xs text-zinc-500 mt-1">Use our matching tool — we'll recommend investors based on your pitch.</p>
                </div>
                <button
                  onClick={() => navigate('/pitches')}
                  className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  See My Pitch Matches →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
