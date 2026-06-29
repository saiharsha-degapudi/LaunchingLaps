const STAGES = [
  { key: 'draft',             label: 'Draft',                color: 'bg-zinc-300' },
  { key: 'submitted',         label: 'Submitted',            color: 'bg-blue-400' },
  { key: 'screening',         label: 'Screening',            color: 'bg-blue-500' },
  { key: 'documents_missing', label: 'Docs Missing',         color: 'bg-amber-400' },
  { key: 'audit_in_progress', label: 'Audit In Progress',    color: 'bg-violet-500' },
  { key: 'changes_required',  label: 'Changes Required',     color: 'bg-orange-500' },
  { key: 'approved',          label: 'Approved',             color: 'bg-emerald-500' },
  { key: 'approved_warnings', label: 'Approved w/ Warnings', color: 'bg-emerald-400' },
  { key: 'rejected',          label: 'Rejected',             color: 'bg-red-500' },
  { key: 'live',              label: 'Live',                 color: 'bg-emerald-600' },
  { key: 'funding_in_progress', label: 'Funding In Progress', color: 'bg-blue-600' },
  { key: 'funded',            label: 'Funded',               color: 'bg-emerald-700' },
]

const MAIN_FLOW = [
  'draft', 'submitted', 'screening', 'audit_in_progress', 'approved', 'live', 'funded'
]

const STATUS_MESSAGES = {
  draft:             { text: 'Complete your pitch and submit it for review.', action: 'Continue Pitch', link: '/submit-pitch', type: 'info' },
  submitted:         { text: 'Your pitch has been submitted. The team will begin screening shortly.', type: 'info' },
  screening:         { text: 'Your pitch is being reviewed for completeness and eligibility.', type: 'info' },
  documents_missing: { text: 'Documents are missing. Upload required documents to continue.', action: 'Go to Data Room', link: '/data-room', type: 'warning' },
  audit_in_progress: { text: 'The audit team is reviewing your documents and financials.', type: 'info' },
  changes_required:  { text: 'The audit team has requested changes. Check your audit feedback.', action: 'View Feedback', link: '/audit-feedback', type: 'warning' },
  approved:          { text: 'Congratulations! Your pitch has been approved and is being prepared for investors.', type: 'success' },
  approved_warnings: { text: 'Approved with notes. Review audit concerns to prepare for investor questions.', action: 'View Audit Report', link: '/audit-feedback', type: 'success' },
  rejected:          { text: 'Your pitch was not approved at this time. Review the feedback and consider resubmitting.', action: 'View Feedback', link: '/audit-feedback', type: 'error' },
  live:              { text: 'Your pitch is live and visible to verified investors.', type: 'success' },
  funding_in_progress: { text: 'Investors are actively committing. Keep sending updates.', action: 'Post Update', link: '/founder-updates', type: 'success' },
  funded:            { text: 'Funded! Keep your investors informed with regular updates.', action: 'Post Update', link: '/founder-updates', type: 'success' },
}

export default function PitchProgressTracker({ status, pitchTitle }) {
  const currentIdx = MAIN_FLOW.indexOf(status) !== -1
    ? MAIN_FLOW.indexOf(status)
    : -1

  const msg = STATUS_MESSAGES[status]
  const isOffFlow = !MAIN_FLOW.includes(status) && status

  const msgStyles = {
    info:    'bg-blue-50 border-blue-100 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error:   'bg-red-50 border-red-200 text-red-800',
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">Pitch Status</p>
          <p className="text-sm font-semibold text-zinc-900 truncate max-w-xs">{pitchTitle || 'My Pitch'}</p>
        </div>
        {status && (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
            STAGES.find(s => s.key === status)?.color || 'bg-zinc-200'
          } text-white`}>
            {STAGES.find(s => s.key === status)?.label || status}
          </span>
        )}
      </div>

      {/* Main flow tracker */}
      <div className="flex items-center gap-0 mb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {MAIN_FLOW.map((stageKey, idx) => {
          const stage = STAGES.find(s => s.key === stageKey)
          const isPast = currentIdx > idx
          const isCurrent = currentIdx === idx
          const isFuture = currentIdx < idx

          return (
            <div key={stageKey} className="flex items-center flex-shrink-0">
              {/* Node */}
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isPast
                    ? 'bg-zinc-900 text-white'
                    : isCurrent
                    ? `${stage.color} text-white ring-4 ring-offset-1 ring-current/20`
                    : 'bg-zinc-100 text-zinc-400'
                }`}>
                  {isPast ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <p className={`text-[9px] mt-1 text-center whitespace-nowrap font-medium ${
                  isCurrent ? 'text-zinc-900' : isPast ? 'text-zinc-500' : 'text-zinc-300'
                }`}>
                  {stage?.label}
                </p>
              </div>
              {/* Connector */}
              {idx < MAIN_FLOW.length - 1 && (
                <div className={`h-0.5 w-6 mx-0.5 mb-4 flex-shrink-0 transition-colors ${
                  isPast ? 'bg-zinc-900' : 'bg-zinc-100'
                }`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Off-flow status (documents_missing, changes_required, approved_warnings, rejected) */}
      {isOffFlow && (
        <div className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border mb-3 ${msgStyles[msg?.type] || msgStyles.info}`}>
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span>{STAGES.find(s => s.key === status)?.label}</span>
        </div>
      )}

      {/* Status message + action */}
      {msg && (
        <div className={`border rounded-lg px-3 py-2.5 flex items-center justify-between gap-3 ${msgStyles[msg.type]}`}>
          <p className="text-xs leading-relaxed">{msg.text}</p>
          {msg.action && msg.link && (
            <a href={msg.link}
              className="flex-shrink-0 text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">
              {msg.action}
            </a>
          )}
        </div>
      )}

      {!status && (
        <div className="bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2.5">
          <p className="text-xs text-zinc-500">No pitch submitted yet.</p>
          <a href="/submit-pitch" className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-1 inline-block">
            Submit your first pitch →
          </a>
        </div>
      )}
    </div>
  )
}
