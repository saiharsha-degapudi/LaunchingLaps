import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useScrollReveal } from '../utils/design'

const INTEREST_TYPES = [
  { key: 'all',      label: 'All Activity' },
  { key: 'interest', label: 'Expressed Interest' },
  { key: 'watchlist', label: 'Saved (Watchlist)' },
  { key: 'view',     label: 'Viewed' },
]

function ActivityRow({ item }) {
  const date = new Date(item.created_at || Date.now())
  const label = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const typeConfig = {
    interest: { label: 'Expressed Interest', badge: 'bg-emerald-50 text-emerald-700', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    watchlist: { label: 'Saved to Watchlist', badge: 'bg-blue-50 text-blue-700', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' },
    view:      { label: 'Viewed Pitch',        badge: 'bg-zinc-100 text-zinc-600',   icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
  }
  const cfg = typeConfig[item.type] || typeConfig['view']

  return (
    <div className="reveal flex items-start gap-4 bg-white border border-zinc-200 rounded-xl p-4">
      <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center flex-shrink-0 font-semibold text-sm">
        {item.investor?.full_name?.[0] || 'I'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-zinc-900">{item.investor?.full_name || 'Anonymous Investor'}</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cfg.badge}`}>
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cfg.icon} />
            </svg>
            {cfg.label}
          </span>
        </div>
        {item.note && (
          <p className="text-sm text-zinc-500 mt-1.5 leading-relaxed">"{item.note}"</p>
        )}
        <p className="text-xs text-zinc-400 mt-1">{label}</p>
      </div>
      {item.investor?.email && (
        <a href={`mailto:${item.investor.email}`}
          className="flex-shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
          Contact
        </a>
      )}
    </div>
  )
}

function SummaryCard({ label, value, sub, color }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4">
      <p className="text-xs text-zinc-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color || 'text-zinc-900'}`}>{value}</p>
      {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function InvestorInterest() {
  useScrollReveal()
  const [activity, setActivity] = useState([])
  const [pitches, setPitches] = useState([])
  const [selectedPitch, setSelectedPitch] = useState('all')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [pitchRes, actRes] = await Promise.all([
          api.get('/pitches/my/'),
          api.get('/investor-interest/'),
        ])
        const myPitches = Array.isArray(pitchRes.data) ? pitchRes.data : [pitchRes.data].filter(Boolean)
        setPitches(myPitches)
        setActivity(Array.isArray(actRes.data) ? actRes.data : [])
      } catch {
        setActivity([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = activity.filter(item => {
    const matchPitch = selectedPitch === 'all' || String(item.pitch_id) === selectedPitch
    const matchType  = filter === 'all' || item.type === filter
    return matchPitch && matchType
  })

  const counts = {
    interest:  activity.filter(a => a.type === 'interest').length,
    watchlist: activity.filter(a => a.type === 'watchlist').length,
    view:      activity.filter(a => a.type === 'view').length,
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="mb-8">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Entrepreneur</p>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Investor Activity</h1>
          <p className="text-sm text-zinc-500 mt-1">See who is watching, saving, and expressing interest in your pitches.</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <SummaryCard label="Interest Expressed" value={counts.interest} color="text-emerald-600" sub="investors ready to engage" />
          <SummaryCard label="Watchlisted" value={counts.watchlist} color="text-blue-600" sub="saved for later" />
          <SummaryCard label="Total Views" value={counts.view} color="text-zinc-700" sub="unique pitch views" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {pitches.length > 1 && (
            <select
              value={selectedPitch}
              onChange={e => setSelectedPitch(e.target.value)}
              className="input text-xs py-1.5 w-auto"
            >
              <option value="all">All Pitches</option>
              {pitches.map(p => (
                <option key={p.id} value={String(p.id)}>{p.title || p.company_name}</option>
              ))}
            </select>
          )}
          <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-lg p-1">
            {INTEREST_TYPES.map(t => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                  filter === t.key ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((item, i) => <ActivityRow key={item.id ?? i} item={item} />)}
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm text-zinc-500 font-medium">No investor activity yet</p>
            <p className="text-xs text-zinc-400 mt-1">Once your pitch goes live, investor activity will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
