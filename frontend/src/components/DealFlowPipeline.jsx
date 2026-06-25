import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const STAGES = [
  { key: 'submitted',   label: 'Submitted',        desc: 'Created by founder' },
  { key: 'under_audit', label: 'Under Audit',       desc: 'In review' },
  { key: 'approved',    label: 'Audit Approved',    desc: 'Cleared for discovery' },
  { key: 'live',        label: 'Live to Investors', desc: 'Receiving interest' },
  { key: 'funded',      label: 'Funded',            desc: 'Capital raised' },
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
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Deal Flow Pipeline</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Live view of every pitch — from submission to funding</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-zinc-500">Live</span>
        </div>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="flex gap-2">
            {STAGES.map(s => (
              <div key={s.key} className="flex-1 h-24 bg-zinc-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Stage row */}
            <div className="flex items-center gap-0 mb-5">
              {STAGES.map((stage, i) => {
                const count = buckets[stage.key]?.length || 0
                const isActive = active === stage.key
                return (
                  <div key={stage.key} className="flex items-center flex-1">
                    <button
                      onClick={() => setActive(isActive ? null : stage.key)}
                      className={`flex-1 flex flex-col px-3 py-3 rounded-lg border transition-all cursor-pointer text-left ${
                        isActive
                          ? 'border-blue-600 bg-blue-50 border-l-2'
                          : 'border-zinc-200 bg-white hover:bg-zinc-50'
                      }`}
                    >
                      <span className="text-xs font-medium uppercase tracking-wide text-zinc-400 leading-none mb-2">
                        {stage.label}
                      </span>
                      <span className={`text-3xl font-semibold leading-none ${isActive ? 'text-blue-600' : 'text-zinc-900'}`}>
                        {count}
                      </span>
                      <span className="text-xs text-zinc-400 mt-1 leading-tight">{stage.desc}</span>
                    </button>
                    {i < STAGES.length - 1 && (
                      <span className="flex-shrink-0 px-1.5 text-sm text-zinc-300 select-none">→</span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Expanded pitch list */}
            {active && (
              <div className="border border-zinc-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50 flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-800">
                    {STAGES.find(s => s.key === active)?.label}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600 ml-1">
                    {buckets[active]?.length || 0}
                  </span>
                  <button
                    onClick={() => setActive(null)}
                    className="ml-auto text-zinc-400 hover:text-zinc-600 transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                </div>

                {!buckets[active]?.length ? (
                  <div className="px-4 py-10 text-center text-sm text-zinc-400">
                    No pitches in this stage yet.
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100">
                    {buckets[active].slice(0, 8).map(p => {
                      const goal = p.funding_goal >= 1e6
                        ? `$${(p.funding_goal / 1e6).toFixed(1)}M`
                        : `$${(p.funding_goal / 1000).toFixed(0)}K`
                      return (
                        <Link
                          key={p.id}
                          to={`/pitches/${p.id}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {p.title[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-900 truncate">{p.title}</p>
                            <p className="text-xs text-zinc-400 truncate">{p.industry} · {p.stage}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-medium text-zinc-700">{goal}</p>
                            <p className="text-xs text-zinc-400">{p.interests?.length || 0} interested</p>
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
