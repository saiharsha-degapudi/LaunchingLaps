import { Link } from 'react-router-dom'

const STAGE_COLORS = {
  idea: 'bg-purple-100 text-purple-700',
  seed: 'bg-green-100 text-green-700',
  growth: 'bg-blue-100 text-blue-700',
}

function auditBadgeColor(score) {
  if (score >= 76) return 'bg-green-500'
  if (score >= 60) return 'bg-yellow-400'
  return 'bg-red-500'
}

export default function PitchCard({ pitch }) {
  const stage = pitch.stage || 'idea'
  const stageColor = STAGE_COLORS[stage] || 'bg-gray-100 text-gray-700'

  const fundingGoal = Number(pitch.funding_goal) || 0
  const committedAmount = Number(pitch.committed_amount) || 0
  const fundingPct = fundingGoal > 0 ? Math.min(100, Math.round((committedAmount / fundingGoal) * 100)) : 0

  return (
    <div className="card hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-brand-800 text-lg leading-tight">{pitch.title}</h3>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {pitch.audit_score != null && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-semibold ${auditBadgeColor(pitch.audit_score)}`}
              title={`Audit Score: ${pitch.audit_score}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
              {pitch.audit_score} Audit
            </span>
          )}
          <span className={`badge ${stageColor} capitalize whitespace-nowrap`}>{stage}</span>
        </div>
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
