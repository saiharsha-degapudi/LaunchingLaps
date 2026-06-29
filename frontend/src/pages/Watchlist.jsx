import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const RISK_COLORS = {
  Low: 'badge-green',
  Medium: 'badge-amber',
  High: 'badge-red',
}

function WatchlistCard({ pitch, onRemove }) {
  const [removing, setRemoving] = useState(false)

  async function handleRemove() {
    setRemoving(true)
    try {
      await api.delete(`/watchlist/${pitch.id}/`)
      onRemove(pitch.id)
    } catch {
      setRemoving(false)
    }
  }

  const auditScore = pitch.audit_score ?? null
  const riskLevel = pitch.risk_level || 'Medium'
  const pct = pitch.funding_raised && pitch.funding_ask
    ? Math.min(100, Math.round((pitch.funding_raised / pitch.funding_ask) * 100))
    : 0

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 hover:shadow-sm transition-all duration-200">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {(pitch.company_name || pitch.startup_name || 'S')[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 text-sm">
              {pitch.company_name || pitch.startup_name || 'Startup'}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {pitch.industry || pitch.sector || 'Technology'} &bull; {pitch.stage || 'Seed'} &bull; {pitch.city || 'India'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`badge text-[11px] ${RISK_COLORS[riskLevel] || 'badge'}`}>{riskLevel} Risk</span>
          <button onClick={handleRemove} disabled={removing}
            className="text-zinc-300 hover:text-red-400 transition-colors"
            title="Remove from watchlist">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-4">
        {pitch.problem_statement || pitch.description || 'No description available.'}
      </p>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-zinc-50 rounded-lg p-2.5 text-center">
          <p className="text-xs text-zinc-400 mb-0.5">Target</p>
          <p className="text-sm font-semibold text-zinc-900">
            {pitch.funding_ask ? `₹${Number(pitch.funding_ask).toLocaleString('en-IN')}` : '—'}
          </p>
        </div>
        <div className="bg-zinc-50 rounded-lg p-2.5 text-center">
          <p className="text-xs text-zinc-400 mb-0.5">Valuation</p>
          <p className="text-sm font-semibold text-zinc-900">
            {pitch.valuation ? `₹${Number(pitch.valuation).toLocaleString('en-IN')}` : '—'}
          </p>
        </div>
        <div className="bg-zinc-50 rounded-lg p-2.5 text-center">
          <p className="text-xs text-zinc-400 mb-0.5">Audit Score</p>
          <p className={`text-sm font-semibold ${auditScore !== null ? (auditScore >= 70 ? 'text-emerald-600' : auditScore >= 50 ? 'text-amber-600' : 'text-red-600') : 'text-zinc-400'}`}>
            {auditScore !== null ? `${auditScore}/100` : 'Pending'}
          </p>
        </div>
      </div>

      {/* Funding progress */}
      {pct > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
            <span>Funding progress</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Link to={`/pitches/${pitch.id}`} className="btn-primary flex-1 justify-center text-xs py-2">
          View Deal
        </Link>
        <button className="btn-secondary text-xs py-2 px-3">Express Interest</button>
      </div>
    </div>
  )
}

export default function Watchlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/watchlist/').then(res => {
      setItems(Array.isArray(res.data) ? res.data : res.data?.items ?? [])
    }).catch(() => setItems([])).finally(() => setLoading(false))
  }, [])

  function handleRemove(id) {
    setItems(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Investor</p>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Watchlist</h1>
            <p className="text-sm text-zinc-500 mt-1">Deals you have saved for closer review.</p>
          </div>
          <Link to="/pitches" className="btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Browse Deals
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-900 mb-1">Your watchlist is empty</p>
            <p className="text-xs text-zinc-500 mb-5">Browse approved deals and save the ones you want to track.</p>
            <Link to="/pitches" className="btn-primary">Browse Deal Flow</Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-zinc-400 mb-5">
              <span className="font-medium text-zinc-600">{items.length}</span> saved deal{items.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(pitch => (
                <WatchlistCard key={pitch.id} pitch={pitch} onRemove={handleRemove} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
