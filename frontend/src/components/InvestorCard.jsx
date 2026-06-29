import { Link } from 'react-router-dom'
import { Card3D, useScrollReveal } from '../utils/design'

export default function InvestorCard({ investor }) {
  useScrollReveal()

  const stages = investor.preferred_stages?.split(',').map((s) => s.trim()) || []
  const industries = investor.industry_focus?.split(',').slice(0, 3).map((i) => i.trim()) || []

  return (
    <Card3D>
      <div className="reveal bg-white border border-zinc-200 rounded-xl p-5 flex flex-col gap-4 hover:border-zinc-300 hover:shadow-sm transition-all h-full">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {investor.user?.full_name?.[0] || 'I'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-zinc-900">{investor.user?.full_name}</h3>
            {investor.firm_name && (
              <p className="text-xs text-zinc-500">{investor.firm_name}</p>
            )}
            {investor.location && (
              <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {investor.location}
              </p>
            )}
          </div>
        </div>

        {/* Investment range */}
        <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
          <p className="text-xs text-zinc-400 mb-1">Investment Range</p>
          <p className="text-sm font-semibold text-zinc-900">
            ${Number(investor.investment_min).toLocaleString()} – ${Number(investor.investment_max).toLocaleString()}
          </p>
        </div>

        {/* Focus areas */}
        {industries.length > 0 && (
          <div>
            <p className="text-xs text-zinc-400 mb-1.5">Focus Areas</p>
            <div className="flex flex-wrap gap-1.5">
              {industries.map((ind) => (
                <span key={ind} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600">{ind}</span>
              ))}
            </div>
          </div>
        )}

        {/* Stages */}
        {stages.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {stages.map((s) => (
              <span key={s} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 capitalize">{s}</span>
            ))}
          </div>
        )}

        {/* Links */}
        {(investor.website || investor.linkedin) && (
          <div className="flex gap-3 text-xs pt-2 border-t border-zinc-100 mt-auto">
            {investor.website && (
              <a
                href={investor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Website
              </a>
            )}
            {investor.linkedin && (
              <a
                href={investor.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                LinkedIn
              </a>
            )}
          </div>
        )}
      </div>
    </Card3D>
  )
}
