import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useScrollReveal } from '../utils/design'

const VERDICT_CONFIG = {
  proceed:  { label: 'Approved',       badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'M5 13l4 4L19 7', iconColor: 'text-emerald-500' },
  approved: { label: 'Approved',       badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'M5 13l4 4L19 7', iconColor: 'text-emerald-500' },
  rejected: { label: 'Not Approved',   badge: 'bg-red-50 text-red-700 border-red-200',             icon: 'M6 18L18 6M6 6l12 12', iconColor: 'text-red-500' },
  pending:  { label: 'Under Review',   badge: 'bg-amber-50 text-amber-700 border-amber-200',        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', iconColor: 'text-amber-500' },
}

const RISK_CONFIG = {
  low:    'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  high:   'bg-red-50 text-red-700',
}

function CheckItem({ label, verified, note }) {
  return (
    <div className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border text-xs ${
      verified ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
    }`}>
      <span className={`flex-shrink-0 mt-0.5 ${verified ? 'text-emerald-500' : 'text-red-500'}`}>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {verified
            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          }
        </svg>
      </span>
      <div className="flex-1 min-w-0">
        <span className={`font-medium ${verified ? 'text-emerald-800' : 'text-red-800'}`}>{label}</span>
        {note && <span className="text-current/70 ml-1">— {note}</span>}
      </div>
    </div>
  )
}

export default function AuditFeedback() {
  useScrollReveal()
  const [report, setReport] = useState(null)
  const [pitch, setPitch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const pitchRes = await api.get('/pitches/my/')
        const myPitch = Array.isArray(pitchRes.data) ? pitchRes.data[0] : pitchRes.data
        if (!myPitch?.id) { setNotFound(true); setLoading(false); return }
        setPitch(myPitch)
        const reportRes = await api.get(`/pitches/${myPitch.id}/audit-report`)
        setReport(reportRes.data)
      } catch (e) {
        if (e?.response?.status === 404) setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  let strengths = [], concerns = [], findings = [], comments = []
  if (report) {
    try { strengths = JSON.parse(report.strengths || '[]') } catch {}
    try { concerns  = JSON.parse(report.concerns  || '[]') } catch {}
    try { findings  = JSON.parse(report.findings  || '[]') } catch {}
    try { comments  = JSON.parse(report.comments  || '[]') } catch {}
  }

  const verdictKey = report?.verdict || 'pending'
  const vcfg = VERDICT_CONFIG[verdictKey] || VERDICT_CONFIG['pending']

  const C = 2 * Math.PI * 38
  const scoreColor = !report?.score ? '#a1a1aa'
    : report.score >= 75 ? '#10b981'
    : report.score >= 50 ? '#f59e0b'
    : '#ef4444'

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="mb-8">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Entrepreneur</p>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Audit Feedback</h1>
          <p className="text-sm text-zinc-500 mt-1">Review the LaunchingLaps audit team's assessment of your pitch.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
          </div>
        ) : notFound || !report ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-600">No audit report yet</p>
            <p className="text-xs text-zinc-400 mt-1 mb-5">The LaunchingLaps audit team will review your pitch after submission.</p>
            <Link to="/submit-pitch" className="btn-primary">Submit or Edit Pitch</Link>
          </div>
        ) : (
          <div className="space-y-5">

            {/* Verdict banner */}
            <div className={`reveal flex items-center gap-4 border rounded-xl p-5 ${vcfg.badge}`}>
              <div className={`w-10 h-10 rounded-full bg-current/10 flex items-center justify-center flex-shrink-0 ${vcfg.iconColor}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={vcfg.icon} />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{vcfg.label}</p>
                {pitch?.title && <p className="text-xs mt-0.5 opacity-70">{pitch.title}</p>}
              </div>
              {report.risk_level && (
                <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${RISK_CONFIG[report.risk_level] || RISK_CONFIG['medium']}`}>
                  {report.risk_level.toUpperCase()} RISK
                </span>
              )}
            </div>

            {/* Score + summary */}
            <div className="reveal bg-white border border-zinc-200 rounded-xl p-5">
              <div className="flex items-center gap-5">
                {report.score != null && (
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#e4e4e7" strokeWidth="12"/>
                      <circle cx="50" cy="50" r="38" fill="none" stroke={scoreColor} strokeWidth="12"
                        strokeDasharray={`${C * report.score / 100} ${C}`} strokeLinecap="round"/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-zinc-900 leading-none">{Math.round(report.score)}</span>
                      <span className="text-[9px] text-zinc-400">/100</span>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {!report.score ? 'Pending Score' : report.score >= 75 ? 'Strong Pitch' : report.score >= 50 ? 'Solid Pitch' : 'Needs Improvement'}
                  </p>
                  <p className="text-xs text-zinc-400">Overall audit quality score</p>
                  {report.auditor?.full_name && (
                    <p className="text-xs text-zinc-400 mt-1">
                      Reviewed by {report.auditor.full_name} · {new Date(report.audited_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>

              {report.executive_summary && (
                <div className="mt-4 pt-4 border-t border-zinc-100">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Executive Summary</p>
                  <p className="text-sm text-zinc-600 leading-relaxed">{report.executive_summary}</p>
                </div>
              )}
            </div>

            {/* Strengths & Concerns */}
            {(strengths.length > 0 || concerns.length > 0) && (
              <div className="reveal grid grid-cols-1 sm:grid-cols-2 gap-4">
                {strengths.length > 0 && (
                  <div className="bg-white border border-zinc-200 rounded-xl p-5">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-3">Strengths</p>
                    <ul className="space-y-2">
                      {strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-600">
                          <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {concerns.length > 0 && (
                  <div className="bg-white border border-zinc-200 rounded-xl p-5">
                    <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-3">Concerns to Address</p>
                    <ul className="space-y-2">
                      {concerns.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-600">
                          <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v4m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
                          </svg>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Due diligence checklist */}
            {findings.length > 0 && (
              <div className="reveal bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Due Diligence Checklist</p>
                <div className="space-y-2">
                  {findings.map((f, i) => (
                    <CheckItem key={i} label={f.label || f.item} verified={f.verified} note={f.note} />
                  ))}
                </div>
              </div>
            )}

            {/* Audit team comments */}
            {comments.length > 0 && (
              <div className="reveal bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Audit Team Comments</p>
                <div className="space-y-3">
                  {comments.map((c, i) => (
                    <div key={i} className="bg-zinc-50 border border-zinc-100 rounded-lg px-4 py-3">
                      <p className="text-xs font-medium text-zinc-500 mb-1">{c.section || 'General'}</p>
                      <p className="text-sm text-zinc-700">{c.comment || c}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {report.recommendations && (
              <div className="reveal bg-blue-50 border border-blue-100 rounded-xl p-5">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Recommendations</p>
                <p className="text-sm text-blue-800 leading-relaxed">{report.recommendations}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="reveal flex flex-wrap gap-3 pt-2">
              <Link to="/submit-pitch" className="btn-primary">Edit & Resubmit Pitch</Link>
              <Link to="/data-room" className="btn-secondary">Manage Documents</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
