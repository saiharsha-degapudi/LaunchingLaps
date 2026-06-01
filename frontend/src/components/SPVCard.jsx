import { Link } from 'react-router-dom'
import FundingMeter from './FundingMeter'

function StatusBadge({ status }) {
  if (status === 'forming') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-gold-100 text-gold-700 border border-gold-300 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
        <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" />
        Forming
      </span>
    )
  }
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 border border-green-300 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 border border-gray-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
      Closed
    </span>
  )
}

function accentBorder(status) {
  if (status === 'forming') return 'border-l-gold-400'
  if (status === 'active') return 'border-l-green-400'
  return 'border-l-gray-300'
}

function fmt(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n}`
}

export default function SPVCard({ spv }) {
  const deadline = spv.deadline ? new Date(spv.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${accentBorder(spv.status)} shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col overflow-hidden`}>
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <StatusBadge status={spv.status} />
          {spv.pitch_industry && (
            <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium truncate max-w-[140px]">
              {spv.pitch_industry}
            </span>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="font-black text-brand-800 text-base leading-snug">{spv.title}</h3>
          {spv.pitch_title && (
            <p className="text-gray-400 text-xs mt-1 truncate">Pitch: {spv.pitch_title}</p>
          )}
        </div>

        {/* Lead investor */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
            {spv.lead_investor_name?.charAt(0) ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-700 truncate">{spv.lead_investor_name}</p>
            {spv.lead_investor_firm && (
              <p className="text-xs text-gray-400 truncate">{spv.lead_investor_firm}</p>
            )}
          </div>
        </div>

        {/* Funding meter */}
        <FundingMeter
          committed={spv.committed_amount}
          target={spv.target_amount}
          pctFunded={spv.pct_funded}
        />

        {/* Key stats row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 rounded-xl py-2 px-1">
            <p className="text-xs font-black text-brand-800">{spv.carry_pct}%</p>
            <p className="text-[10px] text-gray-400 font-medium">Carry</p>
          </div>
          <div className="bg-gray-50 rounded-xl py-2 px-1">
            <p className="text-xs font-black text-brand-800">{fmt(spv.min_check)}</p>
            <p className="text-[10px] text-gray-400 font-medium">Min Check</p>
          </div>
          <div className="bg-gray-50 rounded-xl py-2 px-1">
            <p className="text-xs font-black text-brand-800">{spv.backer_count ?? 0}</p>
            <p className="text-[10px] text-gray-400 font-medium">Backers</p>
          </div>
        </div>

        {/* Deadline */}
        {deadline && (
          <p className="text-xs text-gray-400">
            <span className="font-semibold text-gray-500">Deadline:</span> {deadline}
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <Link
          to={`/spvs/${spv.id}`}
          className="block w-full text-center bg-brand-800 hover:bg-brand-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
        >
          View Syndicate →
        </Link>
      </div>
    </div>
  )
}
