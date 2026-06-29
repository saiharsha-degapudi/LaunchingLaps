import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { Card3D, useScrollReveal } from '../utils/design'
import FundingMeter from './FundingMeter'

function StatusBadge({ status }) {
  if (status === 'forming') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium px-2 py-0.5 rounded-md">
        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
        Forming
      </span>
    )
  }
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-medium px-2 py-0.5 rounded-md">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-500 border border-zinc-200 text-xs font-medium px-2 py-0.5 rounded-md">
      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
      Closed
    </span>
  )
}

function fmt(n) {
  if (!n && n !== 0) return '—'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n}`
}

export default function SPVCard({ spv }) {
  useScrollReveal()

  const barRef = useRef(null)
  const deadline = spv.deadline
    ? new Date(spv.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  const pct = spv.pct_funded ?? 0
  const committed = spv.committed_amount ?? 0
  const target = spv.target_amount ?? 0

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        bar.style.width = `${Math.min(pct, 100)}%`
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    observer.observe(bar)
    return () => observer.disconnect()
  }, [pct])

  return (
    <Card3D>
      <div className="reveal bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col transition-all duration-300">
        <div className="p-5 flex flex-col gap-3.5 flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <StatusBadge status={spv.status} />
            {spv.pitch_industry && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600 truncate max-w-[140px]">
                {spv.pitch_industry}
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 leading-snug">{spv.title}</h3>
            {spv.pitch_title && (
              <p className="text-xs text-zinc-400 mt-0.5 truncate">Pitch: {spv.pitch_title}</p>
            )}
          </div>

          {/* Lead investor */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {spv.lead_investor_name?.charAt(0) ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-zinc-700 truncate">{spv.lead_investor_name}</p>
              {spv.lead_investor_firm && (
                <p className="text-xs text-zinc-400 truncate">{spv.lead_investor_firm}</p>
              )}
            </div>
          </div>

          {/* Progress bar — animates width on mount via IntersectionObserver */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-zinc-500">{fmt(committed)} raised</span>
              <span className="text-xs font-medium text-zinc-700">{pct.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div
                ref={barRef}
                className="h-full bg-blue-500 rounded-full"
                style={{ width: '0%', transition: 'width 800ms cubic-bezier(0.32, 0.72, 0, 1)' }}
              />
            </div>
            <p className="text-xs text-zinc-400 mt-1">Target: {fmt(target)}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-zinc-50 rounded-lg py-2 px-1">
              <p className="text-xs font-semibold text-zinc-900">{spv.carry_pct}%</p>
              <p className="text-[10px] text-zinc-400">Carry</p>
            </div>
            <div className="bg-zinc-50 rounded-lg py-2 px-1">
              <p className="text-xs font-semibold text-zinc-900">{fmt(spv.min_check)}</p>
              <p className="text-[10px] text-zinc-400">Min</p>
            </div>
            <div className="bg-zinc-50 rounded-lg py-2 px-1">
              <p className="text-xs font-semibold text-zinc-900">{spv.backer_count ?? 0}</p>
              <p className="text-[10px] text-zinc-400">Backers</p>
            </div>
          </div>

          {deadline && (
            <p className="text-xs text-zinc-400">
              <span className="font-medium text-zinc-500">Deadline:</span> {deadline}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="px-5 pb-5">
          <Link
            to={`/spvs/${spv.id}`}
            className="block w-full text-center bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
          >
            View Syndicate
          </Link>
        </div>
      </div>
    </Card3D>
  )
}
