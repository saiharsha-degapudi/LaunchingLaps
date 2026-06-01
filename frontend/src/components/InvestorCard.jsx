import { Link } from 'react-router-dom'

export default function InvestorCard({ investor }) {
  const stages = investor.preferred_stages?.split(',').map((s) => s.trim()) || []
  const industries = investor.industry_focus?.split(',').slice(0, 3).map((i) => i.trim()) || []

  return (
    <div className="card hover:shadow-md transition-shadow flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-brand-800 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {investor.user?.full_name?.[0] || 'I'}
        </div>
        <div>
          <h3 className="font-bold text-brand-800">{investor.user?.full_name}</h3>
          {investor.firm_name && (
            <p className="text-sm text-gray-500">{investor.firm_name}</p>
          )}
          {investor.location && (
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {investor.location}
            </p>
          )}
        </div>
      </div>

      {/* Investment range */}
      <div className="bg-gold-50 border border-gold-200 rounded-lg p-3">
        <p className="text-xs text-gray-500 mb-1">Investment Range</p>
        <p className="font-bold text-brand-800 text-sm">
          ${Number(investor.investment_min).toLocaleString()} – ${Number(investor.investment_max).toLocaleString()}
        </p>
      </div>

      {/* Industries */}
      <div>
        <p className="text-xs text-gray-500 mb-1.5">Focus Areas</p>
        <div className="flex flex-wrap gap-1.5">
          {industries.map((ind) => (
            <span key={ind} className="badge bg-brand-100 text-brand-700 text-xs">{ind}</span>
          ))}
        </div>
      </div>

      {/* Stages */}
      <div className="flex flex-wrap gap-1.5">
        {stages.map((s) => (
          <span key={s} className="badge bg-green-100 text-green-700 capitalize text-xs">{s}</span>
        ))}
      </div>

      {/* Links */}
      {(investor.website || investor.linkedin) && (
        <div className="flex gap-3 text-xs pt-1 border-t border-gray-100">
          {investor.website && (
            <a href={investor.website} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
              Website
            </a>
          )}
          {investor.linkedin && (
            <a href={investor.linkedin} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
              LinkedIn
            </a>
          )}
        </div>
      )}
    </div>
  )
}
