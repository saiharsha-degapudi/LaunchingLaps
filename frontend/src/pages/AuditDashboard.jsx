import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import AuditReportForm from '../components/AuditReportForm'

const STATUS_OPTIONS = [
  { value: 'open',     label: 'Under Review', icon: '⏳', bg: 'bg-yellow-100', text: 'text-yellow-700', btn: 'bg-yellow-400 hover:bg-yellow-500 text-white' },
  { value: 'proceed',  label: 'Proceed',       icon: '✅', bg: 'bg-green-100',  text: 'text-green-700',  btn: 'bg-green-500 hover:bg-green-600 text-white' },
  { value: 'rejected', label: 'Rejected',      icon: '❌', bg: 'bg-red-100',    text: 'text-red-600',    btn: 'bg-red-500 hover:bg-red-600 text-white' },
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
    all: pitches.length,
    open: pitches.filter(p => p.audit_status === 'open').length,
    proceed: pitches.filter(p => p.audit_status === 'proceed').length,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-7 mb-8 text-white">
          <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">Internal Tool</p>
          <h1 className="text-3xl font-black mb-1">Audit Dashboard</h1>
          <p className="text-gray-300 text-sm">Review submitted pitches, run due diligence, and submit structured audit reports.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total',        value: counts.all,      color: 'text-gray-700',   key: 'all' },
            { label: 'Under Review', value: counts.open,     color: 'text-yellow-600', key: 'open' },
            { label: 'Approved',     value: counts.proceed,  color: 'text-green-600',  key: 'proceed' },
            { label: 'Rejected',     value: counts.rejected, color: 'text-red-600',    key: 'rejected' },
          ].map(s => (
            <button key={s.key} onClick={() => setFilter(s.key)}
              className={`card text-center cursor-pointer transition-all ${filter === s.key ? 'ring-2 ring-brand-500' : ''}`}>
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-5">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by pitch title, founder, or industry..."
            className="input w-full sm:max-w-md" />
        </div>

        {/* Pitch list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
          </div>
        ) : visible.length === 0 ? (
          <div className="card text-center py-16 text-gray-400">No pitches match this filter.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {visible.map(pitch => {
              const meta = statusMeta(pitch.audit_status)
              const isUpdating = updating[pitch.id]
              return (
                <div key={pitch.id} className="card flex flex-col sm:flex-row gap-4 sm:items-start">
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-brand-800 text-base leading-tight">{pitch.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${meta.bg} ${meta.text}`}>
                        {meta.icon} {meta.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                      <span className="font-medium text-gray-700">{pitch.owner?.full_name}</span>
                      <span>·</span><span>{pitch.industry}</span>
                      <span>·</span><span className="capitalize">{pitch.stage}</span>
                      <span>·</span><span className="font-semibold text-gold-600">${Number(pitch.funding_goal).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{pitch.description}</p>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col gap-2 sm:w-52 flex-shrink-0">
                    {/* Full report button */}
                    <button onClick={() => setSelectedPitch(pitch)}
                      className="w-full py-2.5 px-4 rounded-xl font-black text-sm text-white text-center transition-all hover:scale-[1.02]"
                      style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', boxShadow: '0 4px 16px #1e3a5f40' }}>
                      📋 Full Audit Report →
                    </button>
                    <p className="text-[10px] text-gray-400 text-center font-semibold uppercase tracking-wider">Quick status</p>
                    {STATUS_OPTIONS.map(opt => (
                      <button key={opt.value}
                        disabled={isUpdating || pitch.audit_status === opt.value}
                        onClick={() => setStatus(pitch.id, opt.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${pitch.audit_status === opt.value ? `${opt.bg} ${opt.text} opacity-60 cursor-default` : `${opt.btn} cursor-pointer`} ${isUpdating ? 'opacity-50 cursor-wait' : ''}`}>
                        {opt.icon} {opt.label}
                      </button>
                    ))}
                    <a href={`/pitches/${pitch.id}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-center text-brand-700 hover:underline mt-1">
                      View full pitch →
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Slide-out audit report panel */}
      {selectedPitch && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelectedPitch(null)} />
          <div className="fixed right-0 top-16 h-[calc(100vh-64px)] w-[500px] max-w-full bg-white shadow-2xl border-l border-gray-100 z-50 flex flex-col">
            {/* Panel header */}
            <div className="flex items-start justify-between p-5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Audit Report</p>
                <h2 className="font-black text-gray-900 text-base leading-tight">{selectedPitch.title}</h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span>{selectedPitch.owner?.full_name}</span>
                  <span>·</span><span>{selectedPitch.industry}</span>
                  <span>·</span>
                  <span className="font-semibold text-amber-600">${Number(selectedPitch.funding_goal).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => setSelectedPitch(null)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg flex-shrink-0 transition-colors">
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
