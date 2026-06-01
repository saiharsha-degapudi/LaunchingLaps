import { Link } from 'react-router-dom'

const STAGE_COLORS = {
  idea: 'bg-purple-100 text-purple-700',
  seed: 'bg-green-100 text-green-700',
  growth: 'bg-blue-100 text-blue-700',
}

export default function PitchCard({ pitch }) {
  const stage = pitch.stage || 'idea'
  const stageColor = STAGE_COLORS[stage] || 'bg-gray-100 text-gray-700'

  return (
    <div className="card hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-brand-800 text-lg leading-tight">{pitch.title}</h3>
        <span className={`badge ${stageColor} capitalize whitespace-nowrap`}>{stage}</span>
      </div>

      <p className="text-gray-600 text-sm line-clamp-3">{pitch.description}</p>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="badge bg-gray-100 text-gray-600">{pitch.industry}</span>
        <span className="badge bg-gold-100 text-gold-700 font-semibold">
          ${Number(pitch.funding_goal).toLocaleString()} goal
        </span>
      </div>

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
