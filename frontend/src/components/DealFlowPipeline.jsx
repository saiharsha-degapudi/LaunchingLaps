import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const STAGES = [
  { key: 'submitted',   label: 'Submitted',        icon: '📋', color: '#6366f1', desc: 'Pitch created by founder' },
  { key: 'under_audit', label: 'Under Audit',       icon: '🔍', color: '#f59e0b', desc: 'Being reviewed by audit team' },
  { key: 'approved',    label: 'Audit Approved',    icon: '✅', color: '#10b981', desc: 'Cleared for investor discovery' },
  { key: 'live',        label: 'Live to Investors', icon: '💡', color: '#3b82f6', desc: 'Actively receiving investor interest' },
  { key: 'funded',      label: 'Funded',            icon: '💰', color: '#059669', desc: 'Capital raised via syndicate' },
]

function categorize(pitches, spvs) {
  const funded = new Set(
    spvs.filter(s => s.status === 'active' || s.status === 'closed').map(s => s.pitch_id)
  )
  return {
    submitted:   pitches,
    under_audit: pitches.filter(p => p.audit_status === 'open'),
    approved:    pitches.filter(p => p.audit_status === 'proceed'),
    live:        pitches.filter(p => p.audit_status === 'proceed' && p.is_active && !funded.has(p.id)),
    funded:      pitches.filter(p => funded.has(p.id)),
  }
}

export default function DealFlowPipeline() {
  const [pitches, setPitches] = useState([])
  const [spvs, setSpvs] = useState([])
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/pitches/').then(r => r.data).catch(() => []),
      api.get('/spvs/').then(r => r.data).catch(() => []),
    ]).then(([p, s]) => { setPitches(p); setSpvs(s); setLoading(false) })
  }, [])

  const buckets = categorize(pitches, spvs)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-900">Deal Flow Pipeline</h2>
          <p className="text-xs text-gray-400 mt-0.5">Live view of every pitch — from submission to funding</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-gray-500">Live</span>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex gap-3">
            {STAGES.map(s => <div key={s.key} className="flex-1 h-28 bg-gray-50 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <>
            <div className="flex items-stretch gap-0 mb-6">
              {STAGES.map((stage, i) => {
                const count = buckets[stage.key]?.length || 0
                const isActive = active === stage.key
                return (
                  <div key={stage.key} className="flex items-center flex-1">
                    <button onClick={() => setActive(isActive ? null : stage.key)}
                      className={`flex-1 flex flex-col items-center p-4 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                        isActive
                          ? 'border-current shadow-lg scale-[1.04]'
                          : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200'
                      }`}
                      style={isActive ? { borderColor: stage.color, background: stage.color + '10' } : {}}>
                      <span className="text-2xl mb-2">{stage.icon}</span>
                      <span className="text-3xl font-black mb-1" style={{ color: stage.color }}>{count}</span>
                      <span className="text-xs font-bold text-gray-700 leading-tight">{stage.label}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5 leading-tight">{stage.desc}</span>
                    </button>
                    {i < STAGES.length - 1 && (
                      <div className="flex-shrink-0 px-1">
                        <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                          <path d="M0 6H14M10 1L18 6L10 11" stroke={count > 0 ? stage.color : '#d1d5db'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {active && (
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2"
                  style={{ background: (STAGES.find(s => s.key === active)?.color || '#000') + '12' }}>
                  <span>{STAGES.find(s => s.key === active)?.icon}</span>
                  <span className="font-bold text-sm text-gray-800">{STAGES.find(s => s.key === active)?.label}</span>
                  <span className="ml-auto text-xs text-gray-400">{buckets[active]?.length || 0} pitches</span>
                  <button onClick={() => setActive(null)} className="text-gray-300 hover:text-gray-500 text-xl ml-1">×</button>
                </div>
                {!buckets[active]?.length ? (
                  <div className="px-4 py-8 text-center text-gray-400 text-sm">No pitches in this stage yet</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {buckets[active].slice(0, 8).map(p => {
                      const goal = p.funding_goal >= 1e6
                        ? `$${(p.funding_goal / 1e6).toFixed(1)}M`
                        : `$${(p.funding_goal / 1000).toFixed(0)}K`
                      return (
                        <Link key={p.id} to={`/pitches/${p.id}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                            {p.title[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-900 truncate">{p.title}</p>
                            <p className="text-xs text-gray-400">{p.industry} · {p.stage}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-black text-amber-600">{goal}</p>
                            <p className="text-[10px] text-gray-400">{p.interests?.length || 0} interested</p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
