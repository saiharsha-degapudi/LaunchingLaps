import { Link } from 'react-router-dom'

export default function FounderActionChecklist({ pitch, documents, companyProfile }) {
  const rawStatus = pitch?.audit_status || ''
  const statusMap = { open: 'draft', in_progress: 'audit_in_progress', approved_with_warnings: 'approved_warnings', proceed: 'approved' }
  const status = statusMap[rawStatus] || rawStatus
  const uploadedDocs = documents || []

  const REQUIRED_DOCS = [
    'registration_certificate', 'founder_id', 'cap_table',
    'financials', 'tax_documents', 'pitch_deck',
  ]

  const missingDocs = REQUIRED_DOCS.filter(d => !uploadedDocs.includes(d))
  const profileComplete = !!(companyProfile?.company_name && companyProfile?.registration_number)

  const items = [
    {
      done: profileComplete,
      label: 'Set up company profile',
      sub: profileComplete ? 'Company profile complete' : 'Legal name, registration number, and founders required',
      link: '/company-profile',
      cta: 'Go to Profile',
    },
    {
      done: missingDocs.length === 0,
      label: 'Upload required documents',
      sub: missingDocs.length > 0
        ? `${missingDocs.length} document${missingDocs.length !== 1 ? 's' : ''} still needed in Data Room`
        : 'All 6 required documents uploaded',
      link: '/data-room',
      cta: 'Open Data Room',
    },
    {
      done: !!pitch?.title && !!pitch?.description && !!pitch?.industry && !!pitch?.funding_goal,
      label: 'Complete pitch details',
      sub: 'Problem, solution, market size, funding ask',
      link: pitch?.id ? `/submit-pitch/${pitch.id}` : '/submit-pitch',
      cta: pitch?.id ? 'Edit Pitch' : 'Start Pitch',
    },
    {
      done: ['submitted', 'screening', 'audit_in_progress', 'approved', 'approved_warnings', 'live', 'funding_in_progress', 'funded'].includes(status),
      label: 'Submit pitch for review',
      sub: 'Platform will screen for completeness and eligibility',
      link: pitch?.id ? `/submit-pitch/${pitch.id}` : '/submit-pitch',
      cta: 'Submit',
    },
    {
      done: ['approved', 'approved_warnings', 'live', 'funding_in_progress', 'funded'].includes(status),
      label: 'Pass the audit',
      sub: status === 'changes_required'
        ? 'Action required — audit team has requested changes'
        : status === 'audit_in_progress'
        ? 'Audit in progress — no action needed'
        : 'Await audit team review',
      link: status === 'changes_required' ? '/audit-feedback' : null,
      cta: status === 'changes_required' ? 'View Feedback' : null,
      urgent: status === 'changes_required',
    },
    {
      done: ['live', 'funding_in_progress', 'funded'].includes(status),
      label: 'Go live to investors',
      sub: 'Once approved, your pitch is visible to verified investors',
      link: null,
    },
    {
      done: false,
      label: 'Send first investor update',
      sub: 'Keep investors informed after funding',
      link: '/founder-updates',
      cta: 'Post Update',
      hidden: !['live', 'funding_in_progress', 'funded'].includes(status),
    },
  ].filter(i => !i.hidden)

  const doneCount = items.filter(i => i.done).length
  const pct = Math.round((doneCount / items.length) * 100)

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">Action Checklist</p>
          <p className="text-sm font-semibold text-zinc-900">{doneCount} of {items.length} complete</p>
        </div>
        <div className="relative w-10 h-10">
          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f4f4f5" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#18181b" strokeWidth="3"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-zinc-900">
            {pct}%
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx}
            className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
              item.urgent
                ? 'bg-amber-50 border border-amber-200'
                : item.done
                ? 'bg-zinc-50'
                : 'border border-zinc-100'
            }`}>
            {/* Step number / check */}
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold ${
              item.done ? 'bg-emerald-500' : item.urgent ? 'bg-amber-400' : 'border-2 border-zinc-200 text-zinc-400'
            }`}>
              {item.done ? (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : item.urgent ? (
                <span className="text-white text-[8px] font-bold">!</span>
              ) : (
                <span>{idx + 1}</span>
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium ${item.done ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>
                {item.label}
              </p>
              <p className={`text-[11px] mt-0.5 ${item.urgent ? 'text-amber-700' : 'text-zinc-400'}`}>
                {item.sub}
              </p>
            </div>

            {/* CTA */}
            {item.cta && item.link && !item.done && (
              <Link to={item.link}
                className={`flex-shrink-0 text-[11px] font-semibold px-2 py-1 rounded-md transition-colors ${
                  item.urgent
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}>
                {item.cta}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
