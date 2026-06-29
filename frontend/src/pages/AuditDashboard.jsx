import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import {
  MagnifyingGlass, ArrowsClockwise, ArrowUpRight, CaretUpDown,
  ShieldCheck, CheckCircle, XCircle, Clock, Funnel,
} from '@phosphor-icons/react'

const STATUS_META = {
  submitted:              { label: 'Submitted',         color: '#6b7280', dot: '#d1d5db', group: 'pending' },
  screening:              { label: 'Screening',         color: '#92400e', dot: '#fbbf24', group: 'pending' },
  open:                   { label: 'Pending',           color: '#92400e', dot: '#fbbf24', group: 'pending' },
  in_progress:            { label: 'In Progress',       color: '#3730a3', dot: '#818cf8', group: 'in_progress' },
  under_review:           { label: 'Under Review',      color: '#3730a3', dot: '#818cf8', group: 'in_progress' },
  documents_missing:      { label: 'Docs Missing',      color: '#9a3412', dot: '#f97316', group: 'in_progress' },
  changes_required:       { label: 'Changes Required',  color: '#9a3412', dot: '#f97316', group: 'in_progress' },
  approved:               { label: 'Approved',          color: '#065f46', dot: '#34d399', group: 'approved' },
  approved_with_warnings: { label: 'Approved*',         color: '#92400e', dot: '#fbbf24', group: 'approved' },
  proceed:                { label: 'Approved',          color: '#065f46', dot: '#34d399', group: 'approved' },
  rejected:               { label: 'Rejected',          color: '#991b1b', dot: '#f87171', group: 'rejected' },
}

function sm(v) { return STATUS_META[v] || STATUS_META.submitted }
function groupCount(pitches, group) {
  return pitches.filter(p => sm(p.audit_status).group === group).length
}

function fmt(n) {
  const v = Number(n) || 0
  return v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}K`
}

export default function AuditDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [pitches, setPitches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')
  const [sortBy, setSortBy]   = useState('newest')

  useEffect(() => {
    if (user?.role !== 'audit') { navigate('/'); return }
    fetchPitches()
  }, [user])

  async function fetchPitches() {
    setLoading(true)
    try { const { data } = await api.get('/pitches/'); setPitches(data) }
    finally { setLoading(false) }
  }

  const counts = {
    all:         pitches.length,
    pending:     groupCount(pitches, 'pending'),
    in_progress: groupCount(pitches, 'in_progress'),
    approved:    groupCount(pitches, 'approved'),
    rejected:    groupCount(pitches, 'rejected'),
  }

  const visible = pitches
    .filter(p => {
      const meta = sm(p.audit_status)
      const q = search.toLowerCase()
      const matchS = !q || p.title?.toLowerCase().includes(q) ||
        p.owner?.full_name?.toLowerCase().includes(q) || p.industry?.toLowerCase().includes(q)
      const matchF = filter === 'all' ? true : meta.group === filter
      return matchS && matchF
    })
    .sort((a, b) =>
      sortBy === 'newest'    ? b.id - a.id :
      sortBy === 'goal_high' ? Number(b.funding_goal) - Number(a.funding_goal) :
      sortBy === 'goal_low'  ? Number(a.funding_goal) - Number(b.funding_goal) : 0
    )

  if (user?.role !== 'audit') return null

  const STATS = [
    { key: 'pending',     label: 'Pending Review',    icon: Clock,        value: counts.pending,     accent: '#d97706' },
    { key: 'in_progress', label: 'In Progress',       icon: ShieldCheck,  value: counts.in_progress, accent: '#4f46e5' },
    { key: 'approved',    label: 'Approved',           icon: CheckCircle,  value: counts.approved,    accent: '#059669' },
    { key: 'rejected',    label: 'Rejected',           icon: XCircle,      value: counts.rejected,    accent: '#dc2626' },
  ]

  const FILTERS = [
    { key: 'all',         label: 'All',         count: counts.all },
    { key: 'pending',     label: 'Pending',     count: counts.pending },
    { key: 'in_progress', label: 'In Progress', count: counts.in_progress },
    { key: 'approved',    label: 'Approved',    count: counts.approved },
    { key: 'rejected',    label: 'Rejected',    count: counts.rejected },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f1f4f8' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-1" style={{ color: '#f59e0b' }}>
              Internal Tool
            </p>
            <h1 className="text-[22px] font-black tracking-tight text-gray-900">Audit Dashboard</h1>
            <p className="text-[13px] text-gray-400 mt-0.5">
              {counts.all} pitches in queue · {counts.pending} awaiting review
            </p>
          </div>
          <button
            onClick={fetchPitches}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold border transition-colors"
            style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#64748b' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <ArrowsClockwise size={13} />
            Refresh
          </button>
        </div>

        {/* ── Stat row ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {STATS.map(s => {
            const Icon = s.icon
            const active = filter === s.key
            return (
              <button
                key={s.key}
                onClick={() => setFilter(active ? 'all' : s.key)}
                className="text-left rounded-xl px-4 py-3.5 transition-all duration-150"
                style={{
                  background: active ? s.accent : '#fff',
                  border: `1px solid ${active ? s.accent : '#e2e8f0'}`,
                  boxShadow: active ? `0 2px 12px ${s.accent}25` : 'none',
                }}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <Icon
                    size={15}
                    weight="fill"
                    style={{ color: active ? 'rgba(255,255,255,0.8)' : s.accent }}
                  />
                  <span
                    className="text-[22px] font-black leading-none"
                    style={{ color: active ? '#fff' : '#111827' }}
                  >
                    {s.value}
                  </span>
                </div>
                <p
                  className="text-[11px] font-semibold leading-tight"
                  style={{ color: active ? 'rgba(255,255,255,0.75)' : '#6b7280' }}
                >
                  {s.label}
                </p>
              </button>
            )
          })}
        </div>

        {/* ── Toolbar ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-4">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <MagnifyingGlass
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: '#94a3b8' }}
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search pitch, founder, industry…"
              className="w-full pl-8 pr-3 py-2 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-amber-300/40"
              style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#374151' }}
            />
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
                style={{
                  background: filter === f.key ? '#0f172a' : '#fff',
                  color:      filter === f.key ? '#f59e0b' : '#64748b',
                  border:     `1px solid ${filter === f.key ? '#0f172a' : '#e2e8f0'}`,
                }}
              >
                {f.label}
                {f.key !== 'all' && f.count > 0 && (
                  <span className="ml-1 opacity-55">{f.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 rounded-lg text-[12px] font-medium focus:outline-none focus:ring-2 focus:ring-amber-300/40"
              style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#374151' }}
            >
              <option value="newest">Newest first</option>
              <option value="goal_high">Goal ↓</option>
              <option value="goal_low">Goal ↑</option>
            </select>
            <CaretUpDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
        </div>

        {/* ── Table ──────────────────────────────────────────────────────── */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>

          {/* Header */}
          <div
            className="grid px-5 py-2.5 border-b"
            style={{
              gridTemplateColumns: '2fr 130px 100px 160px 120px',
              borderColor: '#f1f5f9',
              background: '#fafafa',
            }}
          >
            {['Pitch / Founder', 'Industry', 'Goal', 'Status', 'Action'].map(h => (
              <span key={h} className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <div>
              {[1,2,3,4,5,6].map(i => (
                <div key={i}
                  className="grid px-5 py-3.5 border-b items-center gap-4 animate-pulse"
                  style={{ gridTemplateColumns: '2fr 130px 100px 160px 120px', borderColor: '#f8fafc' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex-shrink-0" />
                    <div className="space-y-1.5">
                      <div className="h-3 bg-gray-100 rounded w-32" />
                      <div className="h-2.5 bg-gray-100 rounded w-20" />
                    </div>
                  </div>
                  <div className="h-5 bg-gray-100 rounded-lg w-20" />
                  <div className="h-3 bg-gray-100 rounded w-14" />
                  <div className="h-5 bg-gray-100 rounded-full w-24" />
                  <div className="h-7 bg-gray-100 rounded-lg w-24" />
                </div>
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="py-16 text-center">
              <ShieldCheck size={32} className="mx-auto mb-3" style={{ color: '#cbd5e1' }} />
              <p className="text-sm font-semibold text-gray-500">No pitches found</p>
              <p className="text-xs text-gray-400 mt-1">Adjust your search or filter</p>
            </div>
          ) : (
            visible.map((pitch, idx) => {
              const meta = sm(pitch.audit_status)
              return (
                <div
                  key={pitch.id}
                  className="grid px-5 py-3 items-center gap-4 border-b transition-colors hover:bg-slate-50/60"
                  style={{
                    gridTemplateColumns: '2fr 130px 100px 160px 120px',
                    borderColor: '#f8fafc',
                  }}
                >
                  {/* Pitch */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-black flex-shrink-0"
                      style={{ background: '#0f172a', color: '#f59e0b' }}
                    >
                      {pitch.title?.[0]?.toUpperCase() || 'P'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-gray-900 truncate leading-tight">
                        {pitch.title}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate leading-tight mt-0.5">
                        {pitch.owner?.full_name}
                      </p>
                    </div>
                  </div>

                  {/* Industry */}
                  <span
                    className="text-[11px] font-medium px-2 py-1 rounded-md truncate w-fit"
                    style={{ background: '#f1f5f9', color: '#475569' }}
                  >
                    {pitch.industry}
                  </span>

                  {/* Goal */}
                  <span className="text-[13px] font-semibold text-gray-800">
                    {fmt(pitch.funding_goal)}
                  </span>

                  {/* Status */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: meta.dot }}
                    />
                    <span
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                      style={{
                        background: `${meta.color}12`,
                        color: meta.color,
                        border: `1px solid ${meta.color}25`,
                      }}
                    >
                      {meta.label}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/audit/${pitch.id}`}
                      className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: '#0f172a', color: '#f59e0b' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
                      onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
                    >
                      Open
                      <ArrowUpRight size={11} weight="bold" />
                    </Link>
                    <Link
                      to={`/pitches/${pitch.id}`}
                      className="text-[11px] font-medium transition-colors"
                      style={{ color: '#94a3b8' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#475569'}
                      onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                    >
                      View
                    </Link>
                  </div>
                </div>
              )
            })
          )}

          {/* Footer */}
          {!loading && visible.length > 0 && (
            <div className="px-5 py-2.5 flex items-center justify-between" style={{ borderTop: '1px solid #f1f5f9' }}>
              <p className="text-[11px]" style={{ color: '#94a3b8' }}>
                Showing <span className="font-semibold text-gray-600">{visible.length}</span> of{' '}
                <span className="font-semibold text-gray-600">{counts.all}</span> pitches
              </p>
              <p className="text-[11px]" style={{ color: '#94a3b8' }}>
                Last refreshed just now
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
