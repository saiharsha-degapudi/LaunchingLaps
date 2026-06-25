import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import MilestoneTracker from '../components/MilestoneTracker'
import ROICalculatorInline from '../components/ROICalculatorInline'

const STAGE_BADGES = {
  idea: 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700',
  seed: 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700',
  growth: 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700',
}

export default function PitchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [pitch, setPitch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [auditReport, setAuditReport] = useState(null)

  const [interestNote, setInterestNote] = useState('')
  const [interestLoading, setInterestLoading] = useState(false)
  const [interestSuccess, setInterestSuccess] = useState(false)
  const [interestError, setInterestError] = useState('')
  const [showInterestForm, setShowInterestForm] = useState(false)

  useEffect(() => {
    async function fetchPitch() {
      setLoading(true)
      try {
        const { data } = await api.get(`/pitches/${id}`)
        setPitch(data)
      } catch (err) {
        if (err?.response?.status === 404) {
          setError('Pitch not found.')
        } else {
          setError('Failed to load pitch.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchPitch()
    api.get(`/pitches/${id}/audit-report`).then(r => setAuditReport(r.data)).catch(() => {})
  }, [id])

  async function handleExpressInterest(e) {
    e.preventDefault()
    setInterestLoading(true)
    setInterestError('')
    try {
      await api.post(`/pitches/${id}/interest`, {
        pitch_id: Number(id),
        note: interestNote || undefined,
      })
      setInterestSuccess(true)
      setShowInterestForm(false)
    } catch (err) {
      setInterestError(err?.response?.data?.detail || 'Failed to express interest. Please try again.')
    } finally {
      setInterestLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="bg-white border border-zinc-200 rounded-xl p-8">
          <p className="text-red-600 text-sm font-medium mb-4">{error}</p>
          <button
            onClick={() => navigate('/pitches')}
            className="bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Back to Pitches
          </button>
        </div>
      </div>
    )
  }

  const stageBadge = STAGE_BADGES[pitch.stage] || 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600'
  const isOwner = user?.id === pitch.owner_id
  const isInvestor = user?.role === 'investor'

  const AUDIT_STATUS = {
    open:     { label: 'Under Review', badgeClass: 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700', desc: 'Our audit team is reviewing this pitch.' },
    proceed:  { label: 'Approved',     badgeClass: 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700', desc: 'This pitch has passed our audit review.' },
    rejected: { label: 'Rejected',     badgeClass: 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-600', desc: 'This pitch did not meet our criteria.' },
  }
  const auditStatus = AUDIT_STATUS[pitch.audit_status] || AUDIT_STATUS['open']

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
          <Link to="/pitches" className="hover:text-zinc-600 transition-colors">Pitches</Link>
          <span>/</span>
          <span className="text-zinc-600 truncate max-w-xs">{pitch.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Pitch header card */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <div className="flex flex-wrap items-start gap-2 mb-3">
                <span className={`${stageBadge} capitalize`}>{pitch.stage}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600">{pitch.industry}</span>
                <span className={auditStatus.badgeClass}>{auditStatus.label}</span>
              </div>

              <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-3">{pitch.title}</h1>

              <div className="flex items-baseline gap-1.5 mb-5">
                <span className="text-2xl font-semibold text-zinc-900">${Number(pitch.funding_goal).toLocaleString()}</span>
                <span className="text-sm text-zinc-400">funding goal</span>
              </div>

              <div className="prose prose-sm max-w-none text-zinc-600 leading-relaxed whitespace-pre-wrap">
                {pitch.description}
              </div>
            </div>

            {/* Media links */}
            {(pitch.deck_url || pitch.video_url) && (
              <div className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-wrap gap-3">
                {pitch.deck_url && (
                  <a
                    href={pitch.deck_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    View Pitch Deck
                  </a>
                )}
                {pitch.video_url && (
                  <a
                    href={pitch.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Watch Video Pitch
                  </a>
                )}
              </div>
            )}

            {/* Audit Report Card */}
            {auditReport && (() => {
              const C = 2 * Math.PI * 38
              const scoreColor = auditReport.score >= 75 ? '#10b981' : auditReport.score >= 50 ? '#f59e0b' : '#ef4444'
              let strengths = [], concerns = [], findings = []
              try { strengths = JSON.parse(auditReport.strengths || '[]') } catch {}
              try { concerns  = JSON.parse(auditReport.concerns  || '[]') } catch {}
              try { findings  = JSON.parse(auditReport.findings  || '[]') } catch {}

              const verdictBadge =
                auditReport.verdict === 'proceed'
                  ? 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700'
                  : auditReport.verdict === 'rejected'
                  ? 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-600'
                  : 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700'
              const verdictLabel =
                auditReport.verdict === 'proceed' ? 'Approved'
                : auditReport.verdict === 'rejected' ? 'Rejected'
                : 'Pending'

              const riskBadge =
                auditReport.risk_level === 'low'
                  ? 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700'
                  : auditReport.risk_level === 'high'
                  ? 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-600'
                  : 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700'

              return (
                <div className="bg-white border border-zinc-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-zinc-400 mb-0.5">LaunchingLaps Audit Report</p>
                      <h3 className="text-base font-semibold text-zinc-900">Due Diligence</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={verdictBadge}>{verdictLabel}</span>
                      <span className={riskBadge}>{(auditReport.risk_level || 'medium').toUpperCase()} RISK</span>
                    </div>
                  </div>

                  {/* Score */}
                  {auditReport.score != null && (
                    <div className="flex items-center gap-4 bg-zinc-50 rounded-lg p-4 mb-4">
                      <div className="relative w-14 h-14 flex-shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          <circle cx="50" cy="50" r="38" fill="none" stroke="#e4e4e7" strokeWidth="12"/>
                          <circle cx="50" cy="50" r="38" fill="none" stroke={scoreColor} strokeWidth="12"
                            strokeDasharray={`${C * auditReport.score / 100} ${C}`} strokeLinecap="round"/>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-base font-semibold text-zinc-900 leading-none">{Math.round(auditReport.score)}</span>
                          <span className="text-[9px] text-zinc-400">/100</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">
                          {auditReport.score >= 75 ? 'Strong Pitch' : auditReport.score >= 50 ? 'Solid Pitch' : 'Needs Work'}
                        </p>
                        <p className="text-xs text-zinc-400">Overall quality score</p>
                        {findings.length > 0 && (
                          <p className="text-xs text-zinc-400 mt-0.5">{findings.length} due diligence items verified</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Executive Summary */}
                  {auditReport.executive_summary && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Executive Summary</p>
                      <p className="text-sm text-zinc-600 leading-relaxed">{auditReport.executive_summary}</p>
                    </div>
                  )}

                  {/* Strengths + Concerns */}
                  {(strengths.length > 0 || concerns.length > 0) && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {strengths.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-2">Strengths</p>
                          <ul className="space-y-1.5">
                            {strengths.map((s, i) => (
                              <li key={i} className="text-xs text-zinc-600 flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5 flex-shrink-0">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {concerns.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-red-500 uppercase tracking-wider mb-2">Concerns</p>
                          <ul className="space-y-1.5">
                            {concerns.map((c, i) => (
                              <li key={i} className="text-xs text-zinc-600 flex items-start gap-2">
                                <span className="text-red-400 mt-0.5 flex-shrink-0">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v4m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
                                  </svg>
                                </span>
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recommendations */}
                  {auditReport.recommendations && (
                    <div className="border-t border-zinc-100 pt-4">
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1.5">Recommendations</p>
                      <p className="text-xs text-zinc-500 leading-relaxed">{auditReport.recommendations}</p>
                    </div>
                  )}

                  <p className="text-xs text-zinc-400 mt-3">
                    Audited by {auditReport.auditor?.full_name} · {new Date(auditReport.audited_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              )
            })()}

            {/* Milestone Tracker — owner only */}
            {isOwner && <MilestoneTracker />}

            {/* ROI Calculator for investors */}
            {isInvestor && (
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <h2 className="text-base font-semibold text-zinc-900 mb-1">ROI Calculator</h2>
                <p className="text-xs text-zinc-400 mb-4">Model your return on this pitch based on check size and exit scenario.</p>
                <ROICalculatorInline fundingGoal={pitch.funding_goal} />
              </div>
            )}

            {/* Investor interest form */}
            {isInvestor && (
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <h2 className="text-base font-semibold text-zinc-900 mb-1">Express Investment Interest</h2>

                {interestSuccess ? (
                  <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 mt-3">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm font-medium">Interest expressed! The entrepreneur will be notified.</p>
                  </div>
                ) : (
                  <>
                    {!showInterestForm ? (
                      <div>
                        <p className="text-sm text-zinc-500 mb-4">Let the entrepreneur know you're interested in their pitch.</p>
                        <button
                          onClick={() => setShowInterestForm(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                          Express Interest
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleExpressInterest} className="flex flex-col gap-4 mt-3">
                        {interestError && (
                          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                            {interestError}
                          </div>
                        )}
                        <div>
                          <label className="block text-xs font-medium text-zinc-500 mb-1.5">Personal note (optional)</label>
                          <textarea
                            rows={3}
                            value={interestNote}
                            onChange={(e) => setInterestNote(e.target.value)}
                            placeholder="Share your thoughts or questions for the entrepreneur..."
                            className="w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white resize-none"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button type="submit" disabled={interestLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-60">
                            {interestLoading ? 'Sending...' : 'Send Interest'}
                          </button>
                          <button type="button" onClick={() => setShowInterestForm(false)}
                            className="border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">

            {/* Founder card */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Founder</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {pitch.owner?.full_name?.[0] || 'E'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{pitch.owner?.full_name}</p>
                  <p className="text-xs text-zinc-400 capitalize">{pitch.owner?.role}</p>
                </div>
              </div>
              {pitch.owner?.bio && (
                <p className="text-xs text-zinc-500 mt-3 leading-relaxed line-clamp-4">{pitch.owner.bio}</p>
              )}
            </div>

            {/* Audit status */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">LaunchingLaps Audit</p>
              <span className={auditStatus.badgeClass}>{auditStatus.label}</span>
              <p className="text-xs text-zinc-400 mt-2">{auditStatus.desc}</p>
            </div>

            {/* Pitch details */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Pitch Details</p>
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400">Stage</span>
                  <span className="text-xs font-medium text-zinc-700 capitalize">{pitch.stage}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400">Industry</span>
                  <span className="text-xs font-medium text-zinc-700">{pitch.industry}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400">Funding Goal</span>
                  <span className="text-xs font-semibold text-zinc-900">${Number(pitch.funding_goal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400">Posted</span>
                  <span className="text-xs font-medium text-zinc-700">
                    {new Date(pitch.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Quick Links</p>
                <div className="flex flex-col gap-2">
                  <Link to="/idea-audit" className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">Run Idea Audit</Link>
                  <Link to="/budget-planner" className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">Budget Planner</Link>
                  <Link to="/roi-calculator" className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">ROI Calculator</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
