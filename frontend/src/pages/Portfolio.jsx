import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const STATUS_STYLES = {
  active: 'badge-green',
  exited: 'badge-blue',
  written_off: 'badge-red',
  follow_on: 'badge-amber',
}

function PortfolioCard({ item }) {
  const status = item.status || 'active'
  const invested = Number(item.amount_invested || item.amount_committed || 0)
  const currentValue = Number(item.current_value || invested)
  const multiple = invested > 0 ? (currentValue / invested).toFixed(2) : '—'
  const isUp = currentValue >= invested

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 hover:shadow-sm transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {(item.company_name || 'S')[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 text-sm">{item.company_name || 'Portfolio Company'}</h3>
            <p className="text-xs text-zinc-500 mt-0.5">{item.industry || 'Technology'} &bull; {item.stage || 'Seed'}</p>
          </div>
        </div>
        <span className={`badge text-[11px] ${STATUS_STYLES[status] || 'badge'}`}>
          {status.replace('_', ' ')}
        </span>
      </div>

      {/* Financials */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-zinc-50 rounded-lg p-2.5">
          <p className="text-[10px] text-zinc-400 mb-0.5 uppercase tracking-wide">Invested</p>
          <p className="text-sm font-semibold text-zinc-900">
            ₹{invested > 0 ? invested.toLocaleString('en-IN') : '—'}
          </p>
        </div>
        <div className="bg-zinc-50 rounded-lg p-2.5">
          <p className="text-[10px] text-zinc-400 mb-0.5 uppercase tracking-wide">Current</p>
          <p className={`text-sm font-semibold ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
            ₹{currentValue > 0 ? currentValue.toLocaleString('en-IN') : '—'}
          </p>
        </div>
        <div className="bg-zinc-50 rounded-lg p-2.5">
          <p className="text-[10px] text-zinc-400 mb-0.5 uppercase tracking-wide">Multiple</p>
          <p className={`text-sm font-semibold ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
            {multiple}x
          </p>
        </div>
      </div>

      {/* Latest update */}
      {item.latest_update && (
        <div className="bg-zinc-50 rounded-lg px-3 py-2.5 mb-4">
          <p className="text-[10px] text-zinc-400 uppercase tracking-wide mb-1">Latest Update</p>
          <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">{item.latest_update}</p>
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-4">
        <span>Invested {item.investment_date ? new Date(item.investment_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}</span>
        {item.follow_on_round && <span className="badge-amber text-[10px]">Follow-on available</span>}
      </div>

      <Link to={`/pitches/${item.pitch_id}`}
        className="block text-center text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-100 hover:border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg py-2 transition-colors">
        View Company
      </Link>
    </div>
  )
}

function SummaryBar({ items }) {
  const total = items.reduce((s, i) => s + Number(i.amount_invested || 0), 0)
  const current = items.reduce((s, i) => s + Number(i.current_value || i.amount_invested || 0), 0)
  const pct = total > 0 ? (((current - total) / total) * 100).toFixed(1) : 0
  const isUp = current >= total

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        { label: 'Portfolio companies', value: items.length, suffix: '' },
        { label: 'Total invested', value: `₹${total.toLocaleString('en-IN')}`, suffix: '' },
        { label: 'Portfolio value', value: `₹${current.toLocaleString('en-IN')}`, suffix: '' },
        { label: 'Overall return', value: `${isUp ? '+' : ''}${pct}%`, color: isUp ? 'text-emerald-600' : 'text-red-500' },
      ].map(({ label, value, suffix, color }) => (
        <div key={label} className="bg-white border border-zinc-200 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">{label}</p>
          <p className={`text-xl font-bold tracking-tight ${color || 'text-zinc-900'}`}>{value}{suffix}</p>
        </div>
      ))}
    </div>
  )
}

export default function Portfolio() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/portfolio/').then(res => {
      setItems(Array.isArray(res.data) ? res.data : res.data?.investments ?? [])
    }).catch(() => setItems([])).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter)

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Investor</p>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Portfolio</h1>
            <p className="text-sm text-zinc-500 mt-1">Track your investments and founder updates.</p>
          </div>
          <Link to="/pitches" className="btn-secondary">Browse Deals</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-900 mb-1">No investments yet</p>
            <p className="text-xs text-zinc-500 mb-5">Express interest in deals to start building your portfolio.</p>
            <Link to="/pitches" className="btn-primary">View Deal Flow</Link>
          </div>
        ) : (
          <>
            <SummaryBar items={items} />

            {/* Filter tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {[
                { key: 'all', label: `All (${items.length})` },
                { key: 'active', label: 'Active' },
                { key: 'follow_on', label: 'Follow-on' },
                { key: 'exited', label: 'Exited' },
                { key: 'written_off', label: 'Written Off' },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                    filter === key
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item, i) => <PortfolioCard key={item.id ?? i} item={item} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
