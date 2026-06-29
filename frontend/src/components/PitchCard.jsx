import { Link } from 'react-router-dom'
import { Card3D, useScrollReveal } from '../utils/design'

const STAGE_COLORS = {
  idea:   'bg-purple-50 text-purple-700',
  seed:   'bg-emerald-50 text-emerald-700',
  growth: 'bg-blue-50 text-blue-700',
}

const AUDIT_STATUS = {
  open:     { label: 'Under Review', bg: 'bg-amber-50',   text: 'text-amber-700'  },
  proceed:  { label: 'Approved',     bg: 'bg-emerald-50', text: 'text-emerald-700' },
  rejected: { label: 'Rejected',     bg: 'bg-red-50',     text: 'text-red-600'    },
}

export default function PitchCard({ pitch }) {
  useScrollReveal()

  const stage = pitch.stage || 'idea'
  const stageColor = STAGE_COLORS[stage] || 'bg-zinc-100 text-zinc-600'

  const fundingGoal = Number(pitch.funding_goal) || 0
  const committedAmount = Number(pitch.committed_amount) || 0
  const fundingPct = fundingGoal > 0 ? Math.min(100, Math.round((committedAmount / fundingGoal) * 100)) : 0
  const auditStatus = AUDIT_STATUS[pitch.audit_status] || AUDIT_STATUS['open']

  return (
    <Card3D>
      <div className="reveal bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col gap-0 hover:border-zinc-300 transition-colors duration-300">
        {/* Audit status bar */}
        <div className={`px-5 py-2 flex items-center justify-between border-b border-zinc-100 ${auditStatus.bg}`}>
          <span className={`text-xs font-semibold ${auditStatus.text}`}>{auditStatus.label}</span>
          <span className="text-xs text-zinc-400">LaunchingLaps Audit</span>
        </div>

        <div className="p-5 flex flex-col gap-3 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-zinc-900 text-base leading-snug">{pitch.title}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium capitalize whitespace-nowrap flex-shrink-0 ${stageColor}`}>
              {stage}
            </span>
          </div>

          <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed">{pitch.description}</p>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md font-medium bg-zinc-100 text-zinc-600">{pitch.industry}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md font-medium bg-blue-50 text-blue-700">
              ${Number(pitch.funding_goal).toLocaleString()} goal
            </span>
            {pitch.interest_count != null && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md font-medium bg-zinc-100 text-zinc-500">
                {pitch.interest_count} interested
              </span>
            )}
          </div>

          {/* Funding Progress Bar */}
          {fundingGoal > 0 && (
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
                <span>${committedAmount.toLocaleString()} raised</span>
                <span className="font-medium text-blue-600">{fundingPct}% funded</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${fundingPct}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-100">
            <span className="text-xs text-zinc-400">
              by <span className="font-medium text-zinc-700">{pitch.owner?.full_name}</span>
            </span>
            <Link
              to={`/pitches/${pitch.id}`}
              className="btn-primary text-xs px-4 py-1.5"
            >
              View Pitch
            </Link>
          </div>
        </div>
      </div>
    </Card3D>
  )
}
