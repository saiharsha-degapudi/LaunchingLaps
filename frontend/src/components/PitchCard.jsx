import { Link } from 'react-router-dom'

const STAGE_COLORS = {
  idea: 'bg-purple-100 text-purple-700',
  seed: 'bg-green-100 text-green-700',
  growth: 'bg-blue-100 text-blue-700',
}

const AUDIT_STATUS = {
  open:     { label: '⏳ Under Review', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  proceed:  { label: '✅ Proceed',       bg: 'bg-green-100',  text: 'text-green-700'  },
  rejected: { label: '❌ Rejected',      bg: 'bg-red-100',    text: 'text-red-600'    },
}

export default function PitchCard({ pitch }) {
  const stage = pitch.stage || 'idea'
  const stageColor = STAGE_COLORS[stage] || 'bg-gray-100 text-gray-700'

  const fundingGoal = Number(pitch.funding_goal) || 0
  const committedAmount = Number(pitch.committed_amount) || 0
  const fundingPct = fundingGoal > 0 ? Math.min(100, Math.round((committedAmount / fundingGoal) * 100)) : 0
  const auditStatus = AUDIT_STATUS[pitch.audit_status] || AUDIT_STATUS['open']

  return (
    <div className="card hover:shadow-md transition-shadow flex flex-col gap-3">
      {/* Audit status bar at top */}
      <div className={`-mx-5 -mt-5 px-5 py-2 rounded-t-xl flex items-center justify-between ${auditStatus.bg}`}>
        <span className={`text-xs font-semibold ${auditStatus.text}`}>{auditStatus.label}</span>
        <span className="text-xs text-gray-400">LaunchingLaps Audit</span>
      </div>

      <div className="flex items-start justify-between gap-2 mt-1">
        <h3 className="font-bold text-brand-800 text-lg leading-tight">{pitch.title}</h3>
        <span className={`badge ${stageColor} capitalize whitespace-nowrap flex-shrink-0`}>{stage}</span>
      </div>

      <p className="text-gray-600 text-sm line-clamp-3">{pitch.description}</p>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="badge bg-gray-100 text-gray-600">{pitch.industry}</span>
        <span className="badge bg-gold-100 text-gold-700 font-semibold">
          ${Number(pitch.funding_goal).toLocaleString()} goal
        </span>
        {pitch.interest_count != null && (
          <span className="badge bg-gray-100 text-gray-500">
            👁 {pitch.interest_count} interested
          </span>
        )}
      </div>

      {/* Funding Progress Bar */}
      {fundingGoal > 0 && (
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>${committedAmount.toLocaleString()} raised</span>
            <span className="font-medium text-blue-600">{fundingPct}% funded</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${fundingPct}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          by <span className="font-medium text-gray-700">{pitch.owner?.full_name}</span>
        </span>
        <Link to={`/pitches/${pitch.id}`} className="btn-primary text-xs px-4 py-1.5">
          View Pitch
        </Link>
      </div>
    </div>
  )
}
