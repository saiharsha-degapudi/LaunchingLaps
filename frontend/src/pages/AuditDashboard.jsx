import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import AuditReportForm from '../components/AuditReportForm'

const STATUS_OPTIONS = [
  { value: 'open',     label: 'Under Review', bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
  { value: 'proceed',  label: 'Approved',      bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  { value: 'rejected', label: 'Rejected',      bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200' },
]

function statusMeta(v) {
  return STATUS_OPTIONS.find(s => s.value === v) || STATUS_OPTIONS[0]
}

export default function AuditDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [pitches, setPitches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState({})
  const [search, setSearch] = useState('')
  const [selectedPitch, setSelectedPitch] = useState(null)

  useEffect(() => {
    if (user?.role !== 'audit') { navigate('/'); return }
    fetchPitches()
  }, [user])

  async function fetchPitches() {
    setLoading(true)
    try {
      const { data } = await api.get('/pitches/')
      setPitches(data)
    } finally {
      setLoading(false)
    }
  }

  async function setStatus(pitchId, newStatus) {
    setUpdating(u => ({ ...u, [pitchId]: true }))
    try {
      const { data } = await api.patch(`/pitches/${pitchId}/audit`, { audit_status: newStatus })
      setPitches(ps => ps.map(p => p.id === pitchId ? { ...p, audit_status: data.audit_status } : p))
    } catch (err) {
      alert(err?.response?.data?.detail || 'Failed to update status')
    } finally {
      setUpdating(u => ({ ...u, [pitchId]: false }))
    }
  }

  const counts = {
    all:      pitches.length,
    open:     pitches.filter(p => p.audit_status === 'open').length,
    proceed:  pitches.filter(p => p.audit_status === 'proceed').length,
    rejected: pitches.filter(p => p.audit_status === 'rejected').length,
  }

  const visible = pitches.filter(p => {
    const matchFilter = filter === 'all' || p.audit_status === filter
    const matchSearch = search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.owner?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.industry.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  if (user?.role !== 'audit') return null

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1">Internal Tool</p>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Audit Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Review submitted pitches, run due diligence, and submit structured audit reports.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total',        value: counts.all,      key: 'all',      activeColor: 'border-zinc-900' },
            { label: 'Under Review', value: counts.open,     key: 'open',     activeColor: 'border-amber-500' },
            { label: 'Approved',     value: counts.proceed,  key: 'proceed',  activeColor: 'border-emerald-500' },
            { label: 'Rejected',     value: counts.rejected, key: 'rejected', activeColor: 'border-red-500' },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`bg-white border rounded-xl p-5 text-left cursor-pointer transition-all hover:shadow-sm ${
                filter === s.key ? `${s.activeColor} border-2` : 'border-zinc-200'
              }`}
            >
              <div className="text-3xl font-semibold text-zinc-900 leading-none">{s.value}</div>
              <div className="text-xs text-zinc-500 mt-1.5">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by pitch title, founder, or industry..."
            className="w-full sm:max-w-md border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
          />
        </div>

        {/* Pitch list */}
        {loading ? (
          <div className="bg-white border border-zinc-200 rounded-xl divide-y divide-zinc-100">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-100 rounded w-48" />
                  <div className="h-3 bg-zinc-100 rounded w-64" />
                </div>
                <div className="h-7 bg-zinc-100 rounded-lg w-28" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-16 text-center text-sm text-zinc-400">
            No pitches match this filter.
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_140px_110px_100px_auto] gap-4 px-5 py-2.5 border-b border-zinc-100 bg-zinc-50">
              <span className="text-xs font-medium text-zinc-400">Pitch / Founder</span>
              <span className="text-xs font-medium text-zinc-400">Industry</span>
              <span className="text-xs font-medium text-zinc-400">Funding Goal</span>
              <span className="text-xs font-medium text-zinc-400">Status</span>
              <span className="text-xs font-medium text-zinc-400">Action</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-zinc-100">
              {visible.map((pitch, idx) => {
                const meta = statusMeta(pitch.audit_status)
                const isUpdating = updating[pitch.id]
                return (
                  <div
                    key={pitch.id}
                    className={`grid grid-cols-[1fr_140px_110px_100px_auto] gap-4 items-center px-5 py-3.5 ${idx % 2 === 1 ? 'bg-zinc-50/50' : 'bg-white'} hover:bg-zinc-50 transition-colors`}
                  >
                    {/* Title + founder */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">{pitch.title}</p>
                      <p className="text-xs text-zinc-400 truncate">{pitch.owner?.full_name}</p>
                    </div>

                    {/* Industry */}
                    <div className="min-w-0">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600 truncate">
                        {pitch.industry}
                      </span>
                    </div>

                    {/* Funding goal */}
                    <div>
                      <span className="text-sm font-medium text-zinc-700">
                        ${Number(pitch.funding_goal).toLocaleString()}
                      </span>
                    </div>

                    {/* Status badge */}
                    <div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${meta.bg} ${meta.text} ${meta.border}`}>
                        {meta.label}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setSelectedPitch(pitch)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Write Report
                      </button>
                      <div className="relative group">
                        <button
                          disabled={isUpdating}
                          className="border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium px-2 py-2 rounded-lg transition-colors disabled:opacity-50"
                          title="Quick status"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                          </svg>
                        </button>
                        <div className="absolute right-0 top-full mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-10 hidden group-hover:block w-36">
                          {STATUS_OPTIONS.map(opt => (
                            <button
                              key={opt.value}
                              disabled={isUpdating || pitch.audit_status === opt.value}
                              onClick={() => setStatus(pitch.id, opt.value)}
                              className={`w-full text-left px-3 py-2 text-xs hover:bg-zinc-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                pitch.audit_status === opt.value ? 'font-semibold text-zinc-900' : 'text-zinc-600'
                              }`}
                            >
                              {pitch.audit_status === opt.value && <span className="mr-1">✓</span>}
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <a
                        href={`/pitches/${pitch.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors whitespace-nowrap"
                      >
                        View →
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Slide-out audit report panel */}
      {selectedPitch && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelectedPitch(null)} />
          <div className="fixed right-0 top-16 h-[calc(100vh-64px)] w-[520px] max-w-full bg-white shadow-2xl border-l border-zinc-200 z-50 flex flex-col">
            {/* Panel header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-zinc-100 flex-shrink-0">
              <div>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-0.5">Audit Report</p>
                <h2 className="text-sm font-semibold text-zinc-900 leading-tight">{selectedPitch.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-500">{selectedPitch.owner?.full_name}</span>
                  <span className="text-zinc-300">·</span>
                  <span className="text-xs text-zinc-500">{selectedPitch.industry}</span>
                  <span className="text-zinc-300">·</span>
                  <span className="text-xs font-medium text-zinc-700">${Number(selectedPitch.funding_goal).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPitch(null)}
                className="w-7 h-7 rounded-lg border border-zinc-200 hover:bg-zinc-50 flex items-center justify-center text-zinc-500 text-lg leading-none flex-shrink-0 transition-colors ml-3"
              >
                ×
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto p-5">
              <AuditReportForm
                pitch={selectedPitch}
                onSuccess={() => {
                  setSelectedPitch(null)
                  fetchPitches()
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}
