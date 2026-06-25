import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import MilestoneTracker from '../components/MilestoneTracker'
import ROICalculatorInline from '../components/ROICalculatorInline'

const STAGE_COLORS = {
  idea: 'bg-purple-100 text-purple-700',
  seed: 'bg-green-100 text-green-700',
  growth: 'bg-blue-100 text-blue-700',
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
        <svg className="animate-spin w-10 h-10 text-brand-800" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card">
          <p className="text-red-600 font-medium text-lg mb-4">{error}</p>
          <button onClick={() => navigate('/pitches')} className="btn-primary">
            Back to Pitches
          </button>
        </div>
      </div>
    )
  }

  const stageColor = STAGE_COLORS[pitch.stage] || 'bg-gray-100 text-gray-700'
  const isOwner = user?.id === pitch.owner_id
  const isInvestor = user?.role === 'investor'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/pitches" className="hover:text-brand-800 transition-colors">Pitches</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate max-w-xs">{pitch.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <h1 className="text-2xl font-black text-brand-800 leading-tight">{pitch.title}</h1>
              <span className={`badge ${stageColor} capitalize text-sm`}>{pitch.stage}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="badge bg-gray-100 text-gray-600">{pitch.industry}</span>
              <span className="badge bg-gold-100 text-gold-700 font-semibold">
                ${Number(pitch.funding_goal).toLocaleString()} funding goal
              </span>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {pitch.description}
            </div>
          </div>

          {/* Audit Report Card */}
          {auditReport && (() => {
            const C = 2 * Math.PI * 38
            const scoreColor = auditReport.score >= 75 ? '#10b981' : auditReport.score >= 50 ? '#f59e0b' : '#ef4444'
            let strengths = [], concerns = [], findings = []
            try { strengths = JSON.parse(auditReport.strengths || '[]') } catch {}
            try { concerns  = JSON.parse(auditReport.concerns  || '[]') } catch {}
            try { findings  = JSON.parse(auditReport.findings  || '[]') } catch {}
            return (
              <div className="rounded-2xl overflow-hidden border border-slate-700" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">LaunchingLaps Audit Report</p>
                    <h3 className="text-white font-black text-base">Due Diligence Complete</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${auditReport.verdict === 'proceed' ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' : auditReport.verdict === 'rejected' ? 'bg-red-500/20 border-red-400/30 text-red-300' : 'bg-amber-500/20 border-amber-400/30 text-amber-300'}`}>
                      {auditReport.verdict === 'proceed' ? '✅ Approved' : auditReport.verdict === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${auditReport.risk_level === 'low' ? 'bg-emerald-500/15 border-emerald-400/20 text-emerald-400' : auditReport.risk_level === 'high' ? 'bg-red-500/15 border-red-400/20 text-red-400' : 'bg-amber-500/15 border-amber-400/20 text-amber-400'}`}>
                      {(auditReport.risk_level || 'medium').toUpperCase()} RISK
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Score */}
                  {auditReport.score != null && (
                    <div className="flex items-center gap-5 bg-white/5 rounded-xl p-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12"/>
                          <circle cx="50" cy="50" r="38" fill="none" stroke={scoreColor} strokeWidth="12"
                            strokeDasharray={`${C * auditReport.score / 100} ${C}`} strokeLinecap="round"/>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-lg font-black text-white leading-none">{Math.round(auditReport.score)}</span>
                          <span className="text-[9px] text-slate-400">/100</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-white font-bold">{auditReport.score >= 75 ? 'Strong Pitch' : auditReport.score >= 50 ? 'Solid Pitch' : 'Needs Work'}</p>
                        <p className="text-slate-400 text-xs">Overall quality score</p>
                        {findings.length > 0 && <p className="text-slate-500 text-xs mt-1">{findings.length} due diligence items verified</p>}
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  {auditReport.executive_summary && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Executive Summary</p>
                      <p className="text-slate-200 text-sm leading-relaxed">{auditReport.executive_summary}</p>
                    </div>
                  )}

                  {/* Strengths + Concerns */}
                  {(strengths.length > 0 || concerns.length > 0) && (
                    <div className="grid grid-cols-2 gap-4">
                      {strengths.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-2">💪 Strengths</p>
                          <ul className="space-y-1.5">
                            {strengths.map((s, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>{s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {concerns.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black text-red-400 uppercase tracking-wider mb-2">⚠️ Concerns</p>
                          <ul className="space-y-1.5">
                            {concerns.map((c, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                <span className="text-red-400 mt-0.5 flex-shrink-0">!</span>{c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recommendations */}
                  {auditReport.recommendations && (
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-wider mb-1.5">💡 Recommendations</p>
                      <p className="text-slate-300 text-xs leading-relaxed">{auditReport.recommendations}</p>
                    </div>
                  )}

                  <p className="text-slate-600 text-[10px]">
                    Audited by {auditReport.auditor?.full_name} · {new Date(auditReport.audited_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            )
          })()}

          {/* Media links */}
          {(pitch.deck_url || pitch.video_url) && (
            <div className="card flex flex-wrap gap-4">
              {pitch.deck_url && (
                <a
                  href={pitch.deck_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
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
                  className="btn-secondary"
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

          {/* Milestone Tracker — owner only */}
          {isOwner && <MilestoneTracker />}

          {/* ROI Calculator for investors */}
          {isInvestor && (
            <div className="card border border-blue-100">
              <h2 className="font-bold text-brand-800 text-base mb-1">💰 ROI Calculator</h2>
              <p className="text-xs text-gray-400 mb-4">Model your return on this pitch based on check size and exit scenario.</p>
              <ROICalculatorInline fundingGoal={pitch.funding_goal} />
            </div>
          )}

          {/* Investor interest form */}
          {isInvestor && (
            <div className="card border-2 border-gold-200">
              <h2 className="font-bold text-brand-800 text-lg mb-3">Express Investment Interest</h2>

              {interestSuccess ? (
                <div className="flex items-center gap-3 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm font-medium">Interest expressed! The entrepreneur will be notified.</p>
                </div>
              ) : (
                <>
                  {!showInterestForm ? (
                    <div>
                      <p className="text-gray-600 text-sm mb-4">
                        Let the entrepreneur know you're interested in their pitch.
                      </p>
                      <button onClick={() => setShowInterestForm(true)} className="btn-gold">
                        Express Interest
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleExpressInterest} className="flex flex-col gap-4">
                      {interestError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                          {interestError}
                        </div>
                      )}
                      <div>
                        <label className="label">Personal note (optional)</label>
                        <textarea
                          rows={3}
                          value={interestNote}
                          onChange={(e) => setInterestNote(e.target.value)}
                          placeholder="Share your thoughts or questions for the entrepreneur…"
                          className="input resize-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" disabled={interestLoading} className="btn-gold">
                          {interestLoading ? 'Sending…' : 'Send Interest'}
                        </button>
                        <button type="button" onClick={() => setShowInterestForm(false)} className="btn-secondary">
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
          <div className="card">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Founder</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {pitch.owner?.full_name?.[0] || 'E'}
              </div>
              <div>
                <p className="font-bold text-brand-800 text-sm">{pitch.owner?.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">{pitch.owner?.role}</p>
              </div>
            </div>
            {pitch.owner?.bio && (
              <p className="text-gray-600 text-xs mt-3 leading-relaxed line-clamp-4">{pitch.owner.bio}</p>
            )}
          </div>

          {/* Audit Status */}
          {(() => {
            const STATUS = {
              open:     { label: 'Under Review', icon: '⏳', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', desc: 'Our audit team is reviewing this pitch.' },
              proceed:  { label: 'Proceed',       icon: '✅', bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  desc: 'This pitch has passed our audit review.' },
              rejected: { label: 'Rejected',      icon: '❌', bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-600',    desc: 'This pitch did not meet our criteria.' },
            }
            const s = STATUS[pitch.audit_status] || STATUS['open']
            return (
              <div className={`card border ${s.border} ${s.bg}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{s.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">LaunchingLaps Audit</p>
                    <p className={`font-bold text-sm ${s.text}`}>{s.label}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            )
          })()}

          {/* Pitch info card */}
          <div className="card flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pitch Details</h3>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Stage</span>
                <span className="font-semibold capitalize text-brand-800">{pitch.stage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Industry</span>
                <span className="font-semibold text-brand-800">{pitch.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Funding Goal</span>
                <span className="font-semibold text-gold-600">${Number(pitch.funding_goal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Posted</span>
                <span className="font-semibold text-brand-800">
                  {new Date(pitch.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="card border border-dashed border-gray-300">
              <p className="text-xs text-gray-500 mb-3 font-medium">Quick Links</p>
              <div className="flex flex-col gap-2">
                <Link to="/idea-audit" className="text-xs text-indigo-600 hover:underline font-medium">🎯 Run Idea Audit</Link>
                <Link to="/budget-planner" className="text-xs text-indigo-600 hover:underline font-medium">📊 Budget Planner</Link>
                <Link to="/roi-calculator" className="text-xs text-indigo-600 hover:underline font-medium">💰 ROI Calculator</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
