import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import {
  ArrowLeft, CheckCircle, Circle, FileText, ClipboardText,
  ChartBar, FilePdf, Stamp, Check, X, Warning, UploadSimple,
  ArrowRight, Eye, Link as LinkIcon, CurrencyDollar,
} from '@phosphor-icons/react'

// ─── Audit checklist categories ───────────────────────────────────────────────
const AUDIT_CATEGORIES = [
  {
    key: 'founder', label: 'Founder', maxScore: 10,
    items: [
      'Founder identity verified', 'Background check completed',
      'LinkedIn / online profile verified', 'Previous companies reviewed',
      'Conflicts of interest assessed', 'Legal / fraud history checked',
    ],
  },
  {
    key: 'company', label: 'Company', maxScore: 15,
    items: [
      'Company registration verified', 'Country / jurisdiction confirmed',
      'Registered address verified', 'Ownership structure documented',
      'Shareholders list provided', 'Directors list verified',
      'Licenses and permits reviewed',
    ],
  },
  {
    key: 'legal', label: 'Legal', maxScore: 15,
    items: [
      'Incorporation documents reviewed', 'Shareholder agreements reviewed',
      'Existing investor agreements reviewed', 'Debt and liability documents reviewed',
      'Litigation / disputes assessed', 'IP ownership confirmed',
      'Key contracts reviewed', 'Regulatory risks identified',
    ],
  },
  {
    key: 'financials', label: 'Financials', maxScore: 15,
    items: [
      'Revenue proof provided', 'Financial statements reviewed',
      'Bank statements reviewed', 'Tax filings reviewed',
      'Burn rate calculated', 'Runway assessed',
      'Debt obligations documented', 'Expenses validated',
      'Financial projections reviewed',
    ],
  },
  {
    key: 'captable', label: 'Cap Table', maxScore: 0,
    items: [
      'Founder ownership confirmed', 'Existing investors documented',
      'Option pool reviewed', 'Convertible notes / SAFEs documented',
      'Debt instruments reviewed', 'Dilution risk assessed',
    ],
  },
  {
    key: 'traction', label: 'Traction', maxScore: 15,
    items: [
      'Product demo reviewed', 'Screenshots / recordings provided',
      'User metrics validated', 'Revenue traction verified',
      'Customer contracts reviewed', 'LOIs / MOUs reviewed',
      'Retention / churn data provided', 'Key partnerships documented',
    ],
  },
  {
    key: 'market', label: 'Market', maxScore: 10,
    items: [
      'Target market clearly defined', 'Market size credibly estimated',
      'Competition landscape reviewed', 'Differentiation clearly articulated',
      'Pricing strategy reviewed', 'Go-to-market strategy assessed',
    ],
  },
  {
    key: 'valuation', label: 'Valuation', maxScore: 10,
    items: [
      'Valuation amount noted', 'Valuation method explained',
      'Comparable companies cited', 'Revenue multiple assessed',
      'Stage appropriateness confirmed', 'Investor terms reviewed',
    ],
  },
  {
    key: 'use_of_funds', label: 'Use of Funds', maxScore: 10,
    items: [
      'Hiring plan specified', 'Product development budget specified',
      'Marketing budget specified', 'Operations budget specified',
      'Legal / compliance budget specified', 'Runway post-funding calculated',
      'Requested amount is realistic',
    ],
  },
  {
    key: 'risk', label: 'Risk', maxScore: 15,
    items: [
      'Business risk assessed', 'Financial risk assessed',
      'Legal risk assessed', 'Regulatory risk assessed',
      'Founder risk assessed', 'Market risk assessed',
      'Technology risk assessed', 'Execution risk assessed',
    ],
  },
]

function buildInitialAuditData() {
  const d = {}
  for (const cat of AUDIT_CATEGORIES) {
    d[cat.key] = { scores: Object.fromEntries(cat.items.map(i => [i, ''])), score: 0, notes: '' }
  }
  return d
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ current, steps }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, idx) => {
        const done    = idx < current
        const active  = idx === current
        const Icon    = step.icon
        return (
          <div key={idx} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                done   ? 'bg-emerald-500' :
                active ? 'bg-amber-500'   : 'bg-gray-200'
              }`}>
                {done
                  ? <Check size={16} weight="bold" className="text-white" />
                  : <Icon size={16} weight={active ? 'fill' : 'regular'}
                      className={active ? 'text-white' : 'text-gray-400'} />
                }
              </div>
              <span className={`text-[10px] font-semibold mt-1.5 whitespace-nowrap ${
                done ? 'text-emerald-600' : active ? 'text-amber-600' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 rounded ${done ? 'bg-emerald-400' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, maxScore = 100, size = 72, stroke = 6 }) {
  const r   = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct  = maxScore > 0 ? Math.min(score / maxScore, 1) : 0
  const off  = circ - pct * circ
  const col  = pct >= 0.7 ? '#10b981' : pct >= 0.4 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'all 0.5s ease' }} />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize: size * 0.22, fontWeight: 700, color: col }}>{score}</span>
        <span style={{ fontSize: size * 0.12, color: '#9ca3af' }}>pts</span>
      </div>
    </div>
  )
}

// ─── Checklist item ───────────────────────────────────────────────────────────
function CheckItem({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
      <span className="text-sm text-gray-700 flex-1 leading-snug">{label}</span>
      <div className="flex gap-1.5 flex-shrink-0">
        {[
          { val: 'pass', label: 'Pass', bg: '#dcfce7', active: '#16a34a', icon: Check },
          { val: 'fail', label: 'Fail', bg: '#fee2e2', active: '#dc2626', icon: X    },
          { val: 'na',   label: 'N/A',  bg: '#f4f4f5', active: '#71717a', icon: null },
        ].map(opt => {
          const isOn = value === opt.val
          return (
            <button
              key={opt.val}
              onClick={() => onChange(isOn ? '' : opt.val)}
              className="flex items-center justify-center rounded-lg text-xs font-bold transition-all"
              style={{
                width: 34, height: 28,
                background: isOn ? opt.bg : '#f9fafb',
                color: isOn ? opt.active : '#9ca3af',
                border: isOn ? `1.5px solid ${opt.active}40` : '1px solid #f0f0f0',
              }}
            >
              {opt.icon ? <opt.icon size={12} weight="bold" /> : 'N/A'}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AuditWorkspace() {
  const { pitchId } = useParams()
  const navigate    = useNavigate()
  const { user }    = useAuth()
  const fileRef     = useRef(null)

  const [pitch,        setPitch]        = useState(null)
  const [loadingPitch, setLoadingPitch] = useState(true)
  const [error,        setError]        = useState(null)
  const [step,         setStep]         = useState(0)   // 0-3
  const [activeCat,    setActiveCat]    = useState(0)   // index into AUDIT_CATEGORIES
  const [auditData,    setAuditData]    = useState(buildInitialAuditData)
  const [form, setForm] = useState({
    status:            'under_review',
    risk_level:        'Medium',
    risk_reason:       '',
    executive_summary: '',
    strengths:         [''],
    concerns:          [''],
    auditor_notes:     '',
    founder_feedback:  '',
  })
  const [pdfFile,      setPdfFile]      = useState(null)
  const [pdfUrl,       setPdfUrl]       = useState(null)
  const [uploading,    setUploading]    = useState(false)
  const [submitting,   setSubmitting]   = useState(false)
  const [submitError,  setSubmitError]  = useState(null)

  // Redirect non-audit users
  useEffect(() => {
    if (user && user.role !== 'audit' && user.role !== 'admin') navigate('/')
  }, [user, navigate])

  // Load pitch + existing report
  useEffect(() => {
    if (!pitchId) return
    async function load() {
      setLoadingPitch(true)
      try {
        const { data: pitches } = await api.get('/pitches/')
        const found = pitches.find(p => String(p.id) === String(pitchId))
        if (!found) { setError('Pitch not found.'); return }
        setPitch(found)
        setForm(f => ({ ...f, status: found.audit_status || 'under_review' }))

        try {
          const { data: report } = await api.get(`/pitches/${pitchId}/audit-report`)
          if (report) {
            if (report.pdf_url) setPdfUrl(report.pdf_url)
            setForm(f => ({
              ...f,
              risk_level:        report.risk_level || 'Medium',
              executive_summary: report.executive_summary || '',
              founder_feedback:  report.recommendations || '',
              strengths: report.strengths
                ? (typeof report.strengths === 'string' ? JSON.parse(report.strengths) : report.strengths)
                : [''],
              concerns: report.concerns
                ? (typeof report.concerns === 'string' ? JSON.parse(report.concerns) : report.concerns)
                : [''],
            }))
            if (report.findings) {
              const findings = typeof report.findings === 'string' ? JSON.parse(report.findings) : report.findings
              if (findings?.categories) {
                setAuditData(prev => {
                  const merged = { ...prev }
                  for (const key of Object.keys(findings.categories)) {
                    if (merged[key]) merged[key] = { ...merged[key], ...findings.categories[key] }
                  }
                  return merged
                })
              }
              if (findings?.auditor_notes) setForm(f => ({ ...f, auditor_notes: findings.auditor_notes }))
              if (findings?.risk_reason)   setForm(f => ({ ...f, risk_reason: findings.risk_reason }))
            }
          }
        } catch { /* no existing report */ }
      } catch (err) {
        setError(err?.response?.data?.detail || 'Failed to load pitch.')
      } finally {
        setLoadingPitch(false)
      }
    }
    load()
  }, [pitchId])

  // Computed score
  const totalScore = AUDIT_CATEGORIES.reduce((sum, cat) => {
    const s = Number(auditData[cat.key]?.score) || 0
    return sum + (cat.maxScore > 0 ? Math.min(s, cat.maxScore) : s)
  }, 0)
  const maxTotalScore = AUDIT_CATEGORIES.reduce((s, c) => s + c.maxScore, 0)

  function updateCat(key, newData) {
    setAuditData(prev => ({ ...prev, [key]: newData }))
  }
  function updateForm(partial) { setForm(f => ({ ...f, ...partial })) }

  async function handlePdfUpload() {
    if (!pdfFile) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', pdfFile)
      const { data } = await api.post(`/pitches/${pitchId}/audit-report/upload-pdf`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setPdfUrl(data.pdf_url)
      setPdfFile(null)
    } catch (err) {
      alert(err?.response?.data?.detail || 'PDF upload failed.')
    } finally {
      setUploading(false)
    }
  }

  async function submitDecision(decision) {
    if (!pdfUrl) {
      setSubmitError('Please upload the audit report PDF before making a decision.')
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      const statusMap = {
        approved:               'approved',
        approved_with_warnings: 'approved_with_warnings',
        rejected:               'rejected',
        changes_required:       'changes_required',
      }
      await api.patch(`/pitches/${pitchId}/audit`, { audit_status: statusMap[decision] || decision })
      await api.post(`/pitches/${pitchId}/audit-report`, {
        verdict:           decision,
        score:             totalScore,
        risk_level:        form.risk_level,
        executive_summary: form.executive_summary,
        recommendations:   form.founder_feedback,
        strengths:         JSON.stringify(form.strengths.filter(Boolean)),
        concerns:          JSON.stringify(form.concerns.filter(Boolean)),
        pdf_url:           pdfUrl,
        findings:          JSON.stringify({
          categories:    auditData,
          auditor_notes: form.auditor_notes,
          risk_reason:   form.risk_reason,
        }),
      })
      navigate('/audit')
    } catch (err) {
      setSubmitError(err?.response?.data?.detail || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Loading / error states ──────────────────────────────────────────────────
  if (loadingPitch) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#f1f4f8' }}>
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"
          style={{ border: '3px solid #e5e7eb', borderTopColor: '#f59e0b' }} />
        <p className="text-sm text-gray-500">Loading audit workspace...</p>
      </div>
    </div>
  )

  if (error || !pitch) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#f1f4f8' }}>
      <div className="text-center">
        <p className="text-red-500 mb-4">{error || 'Pitch not found.'}</p>
        <Link to="/audit" className="text-amber-500 font-semibold text-sm">Back to Audit Dashboard</Link>
      </div>
    </div>
  )

  const STEPS = [
    { label: 'Review Details',   icon: Eye          },
    { label: 'Audit Checklist',  icon: ClipboardText },
    { label: 'Write Report',     icon: FileText     },
    { label: 'Upload & Decide',  icon: Stamp        },
  ]

  const cat = AUDIT_CATEGORIES[activeCat]
  const catData = auditData[cat.key]

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#f1f4f8' }}>
      <div className="max-w-5xl mx-auto">

        {/* Top bar */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/audit" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">
            <ArrowLeft size={15} />
            Back
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black text-gray-900 truncate">{pitch.title}</h1>
            <p className="text-xs text-gray-400">{pitch.owner?.full_name} · {pitch.industry} · {pitch.stage}</p>
          </div>
          <div className="flex items-center gap-3">
            <ScoreRing score={totalScore} maxScore={maxTotalScore} />
            <div className="text-right">
              <p className="text-xs text-gray-400">Audit Score</p>
              <p className="text-sm font-bold text-gray-900">{totalScore} / {maxTotalScore}</p>
            </div>
          </div>
        </div>

        {/* Step bar */}
        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
          <StepBar current={step} steps={STEPS} />
        </div>

        {/* ── STEP 0: Review Details & Documents ──────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">Pitch Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-5">
                {[
                  { label: 'Pitch Title',    value: pitch.title },
                  { label: 'Founder',        value: pitch.owner?.full_name },
                  { label: 'Industry',       value: pitch.industry },
                  { label: 'Stage',          value: pitch.stage },
                  { label: 'Funding Goal',   value: `$${Number(pitch.funding_goal || 0).toLocaleString()}` },
                  { label: 'Audit Status',   value: pitch.audit_status },
                ].map(row => (
                  <div key={row.label}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{row.label}</p>
                    <p className="text-sm font-semibold text-gray-900 capitalize">{row.value || '—'}</p>
                  </div>
                ))}
              </div>
              {pitch.tagline && (
                <div className="border-t border-gray-50 pt-4 mb-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Tagline</p>
                  <p className="text-sm text-gray-700 italic">{pitch.tagline}</p>
                </div>
              )}
              {pitch.description && (
                <div className="border-t border-gray-50 pt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{pitch.description}</p>
                </div>
              )}
            </div>

            {/* Documents submitted by founder */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-1">Submitted Documents</h2>
              <p className="text-xs text-gray-400 mb-5">Documents uploaded by the entrepreneur with their pitch submission.</p>
              <div className="space-y-3">
                {pitch.deck_url ? (
                  <a
                    href={pitch.deck_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-amber-300 hover:bg-amber-50/50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50">
                      <FilePdf size={20} weight="fill" className="text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">Pitch Deck</p>
                      <p className="text-xs text-gray-400 truncate">{pitch.deck_url}</p>
                    </div>
                    <LinkIcon size={14} className="text-gray-300 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-gray-200">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                      <FilePdf size={20} className="text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400">No pitch deck submitted</p>
                  </div>
                )}
                {pitch.video_url ? (
                  <a
                    href={pitch.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50">
                      <Eye size={20} weight="fill" className="text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">Pitch Video</p>
                      <p className="text-xs text-gray-400 truncate">{pitch.video_url}</p>
                    </div>
                    <LinkIcon size={14} className="text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-gray-200">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                      <Eye size={20} className="text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400">No pitch video submitted</p>
                  </div>
                )}
              </div>
            </div>

            {/* Risk level */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">Initial Risk Assessment</h2>
              <div className="flex gap-3 mb-4">
                {['Low', 'Medium', 'High'].map(lvl => {
                  const col = lvl === 'Low' ? '#10b981' : lvl === 'Medium' ? '#f59e0b' : '#ef4444'
                  const on  = form.risk_level === lvl
                  return (
                    <button key={lvl} onClick={() => updateForm({ risk_level: lvl })}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                      style={{
                        border: `1.5px solid ${on ? col : '#e5e7eb'}`,
                        background: on ? `${col}15` : '#fff',
                        color: on ? col : '#9ca3af',
                      }}>
                      {lvl}
                    </button>
                  )
                })}
              </div>
              <textarea
                value={form.risk_reason}
                onChange={e => updateForm({ risk_reason: e.target.value })}
                placeholder="Briefly explain the initial risk assessment..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300/40 font-inherit"
              />
            </div>

            <div className="flex justify-end">
              <button onClick={() => setStep(1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                style={{ background: '#060e1f', color: '#f59e0b' }}>
                Continue to Checklist
                <ArrowRight size={15} weight="bold" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: Audit Checklist ──────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Category tabs */}
              <div className="flex overflow-x-auto border-b border-gray-100" style={{ scrollbarWidth: 'none' }}>
                {AUDIT_CATEGORIES.map((c, idx) => {
                  const s   = Number(auditData[c.key]?.score) || 0
                  const pct = c.maxScore > 0 ? s / c.maxScore : 0
                  const col = pct >= 0.7 ? '#10b981' : pct >= 0.4 ? '#f59e0b' : s > 0 ? '#ef4444' : '#9ca3af'
                  return (
                    <button
                      key={c.key}
                      onClick={() => setActiveCat(idx)}
                      className="flex flex-col items-center gap-1 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 flex-shrink-0"
                      style={{
                        borderBottomColor: activeCat === idx ? '#f59e0b' : 'transparent',
                        color: activeCat === idx ? '#f59e0b' : '#6b7280',
                        background: activeCat === idx ? '#fffbeb' : 'transparent',
                      }}
                    >
                      {c.label}
                      {c.maxScore > 0 && (
                        <span className="text-[10px] font-bold" style={{ color: activeCat === idx ? '#f59e0b' : col }}>
                          {s}/{c.maxScore}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Category content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{cat.label} Review</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Mark each item and assign a score for this category.</p>
                  </div>
                  {cat.maxScore > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Score:</span>
                      <input
                        type="number" min={0} max={cat.maxScore}
                        value={catData.score}
                        onChange={e => {
                          const n = Math.max(0, Math.min(cat.maxScore, Number(e.target.value) || 0))
                          updateCat(cat.key, { ...catData, score: n })
                        }}
                        className="w-16 text-center py-1.5 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-300/40"
                      />
                      <span className="text-xs text-gray-400">/ {cat.maxScore}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-5">
                  {cat.items.map(item => (
                    <CheckItem
                      key={item}
                      label={item}
                      value={catData.scores[item] || ''}
                      onChange={val => updateCat(cat.key, {
                        ...catData,
                        scores: { ...catData.scores, [item]: val },
                      })}
                    />
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Notes for {cat.label}
                  </label>
                  <textarea
                    value={catData.notes}
                    onChange={e => updateCat(cat.key, { ...catData, notes: e.target.value })}
                    placeholder={`Add notes about the ${cat.label.toLowerCase()} review...`}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300/40"
                  />
                </div>
              </div>
            </div>

            {/* Category nav */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(0)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                {activeCat > 0 && (
                  <button
                    onClick={() => setActiveCat(i => i - 1)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Prev Category
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                {activeCat < AUDIT_CATEGORIES.length - 1 ? (
                  <button
                    onClick={() => setActiveCat(i => i + 1)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{ background: '#060e1f', color: '#f59e0b' }}
                  >
                    Next Category
                    <ArrowRight size={14} weight="bold" />
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                    style={{ background: '#060e1f', color: '#f59e0b' }}
                  >
                    Continue to Report
                    <ArrowRight size={14} weight="bold" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Write Final Report ───────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Executive summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-1">Executive Summary</h2>
              <p className="text-xs text-gray-400 mb-4">A concise overview visible to investors and the team.</p>
              <textarea
                value={form.executive_summary}
                onChange={e => updateForm({ executive_summary: e.target.value })}
                placeholder="Provide an executive summary of the audit findings..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300/40"
              />
            </div>

            {/* Strengths + Concerns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900">Strengths</h3>
                  <button
                    onClick={() => updateForm({ strengths: [...form.strengths, ''] })}
                    className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2">
                  {form.strengths.map((s, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        value={s}
                        onChange={e => {
                          const a = [...form.strengths]; a[idx] = e.target.value
                          updateForm({ strengths: a })
                        }}
                        placeholder={`Strength ${idx + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300/40"
                      />
                      {form.strengths.length > 1 && (
                        <button
                          onClick={() => updateForm({ strengths: form.strengths.filter((_, i) => i !== idx) })}
                          className="w-8 h-8 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors flex items-center justify-center flex-shrink-0"
                        >
                          <X size={13} weight="bold" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900">Concerns</h3>
                  <button
                    onClick={() => updateForm({ concerns: [...form.concerns, ''] })}
                    className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2">
                  {form.concerns.map((c, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        value={c}
                        onChange={e => {
                          const a = [...form.concerns]; a[idx] = e.target.value
                          updateForm({ concerns: a })
                        }}
                        placeholder={`Concern ${idx + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300/40"
                      />
                      {form.concerns.length > 1 && (
                        <button
                          onClick={() => updateForm({ concerns: form.concerns.filter((_, i) => i !== idx) })}
                          className="w-8 h-8 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors flex items-center justify-center flex-shrink-0"
                        >
                          <X size={13} weight="bold" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Auditor notes (internal) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                Auditor Notes
                <span className="text-[11px] font-normal text-gray-400 ml-2">Internal — not shown to founders or investors</span>
              </h3>
              <textarea
                value={form.auditor_notes}
                onChange={e => updateForm({ auditor_notes: e.target.value })}
                placeholder="Internal notes for the audit team..."
                rows={4}
                className="w-full mt-3 px-4 py-3 border border-amber-100 bg-amber-50/40 rounded-xl text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300/40"
              />
            </div>

            {/* Founder feedback */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                Founder Feedback
                <span className="text-[11px] font-normal text-gray-400 ml-2">Sent to the founder after the decision</span>
              </h3>
              <textarea
                value={form.founder_feedback}
                onChange={e => updateForm({ founder_feedback: e.target.value })}
                placeholder="Provide actionable feedback for the founder..."
                rows={5}
                className="w-full mt-3 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300/40"
              />
            </div>

            <div className="flex items-center justify-between">
              <button onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                style={{ background: '#060e1f', color: '#f59e0b' }}>
                Continue to Decision
                <ArrowRight size={15} weight="bold" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Upload PDF + Decision ────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Score summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-6">
              <ScoreRing score={totalScore} maxScore={maxTotalScore} size={80} stroke={7} />
              <div>
                <p className="text-sm font-bold text-gray-900">Total Audit Score</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{totalScore} <span className="text-base font-normal text-gray-400">/ {maxTotalScore}</span></p>
                <p className="text-xs text-gray-400 mt-1">
                  Risk Level: <span className="font-semibold" style={{
                    color: form.risk_level === 'Low' ? '#10b981' : form.risk_level === 'High' ? '#ef4444' : '#f59e0b'
                  }}>{form.risk_level}</span>
                </p>
              </div>
            </div>

            {/* PDF Upload — required */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FilePdf size={20} weight="fill" className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Upload Audit Report PDF</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Required before making a decision. This PDF will be visible to investors on the pitch page.
                  </p>
                </div>
              </div>

              {pdfUrl ? (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50">
                  <CheckCircle size={20} weight="fill" className="text-emerald-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-emerald-700">Audit report uploaded</p>
                    <a
                      href={`${import.meta.env.VITE_API_URL || 'http://localhost:8001'}${pdfUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 hover:underline truncate block"
                    >
                      View PDF
                    </a>
                  </div>
                  <button
                    onClick={() => { setPdfUrl(null); setPdfFile(null) }}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={e => setPdfFile(e.target.files?.[0] || null)}
                  />
                  {pdfFile ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 mb-3">
                      <FilePdf size={18} weight="fill" className="text-amber-500 flex-shrink-0" />
                      <p className="text-sm font-semibold text-amber-700 flex-1 truncate">{pdfFile.name}</p>
                      <button onClick={() => setPdfFile(null)} className="text-amber-400 hover:text-amber-600">
                        <X size={14} weight="bold" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-amber-300 hover:bg-amber-50/30 transition-colors group mb-3"
                    >
                      <UploadSimple size={28} className="mx-auto text-gray-300 group-hover:text-amber-400 transition-colors mb-2" />
                      <p className="text-sm font-semibold text-gray-500 group-hover:text-gray-700">Click to select audit report PDF</p>
                      <p className="text-xs text-gray-400 mt-1">PDF files only · Max 20MB</p>
                    </button>
                  )}
                  {pdfFile && (
                    <button
                      onClick={handlePdfUpload}
                      disabled={uploading}
                      className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                      style={{ background: uploading ? '#e5e7eb' : '#f59e0b', color: uploading ? '#9ca3af' : '#000' }}
                    >
                      {uploading ? 'Uploading...' : 'Upload PDF'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Final Decision */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-1">Final Decision</h2>
              <p className="text-xs text-gray-400 mb-5">
                This action is permanent. The founder will be notified and the audit report PDF will be attached.
              </p>

              {!pdfUrl && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 mb-5">
                  <Warning size={16} className="text-amber-500 flex-shrink-0" />
                  <p className="text-xs text-amber-700 font-medium">Upload the audit report PDF above before making a decision.</p>
                </div>
              )}

              {submitError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mb-5">
                  <Warning size={16} className="text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-700">{submitError}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => submitDecision('changes_required')}
                  disabled={submitting || !pdfUrl}
                  className="p-5 rounded-xl border text-left transition-all hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ border: '1.5px solid #d1d5db', background: '#fff' }}
                >
                  <p className="text-sm font-bold text-gray-700 mb-0.5">Request Changes</p>
                  <p className="text-xs text-gray-400">Ask the founder for more information</p>
                </button>

                <button
                  onClick={() => submitDecision('approved')}
                  disabled={submitting || !pdfUrl}
                  className="p-5 rounded-xl border text-left transition-all hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ border: '1.5px solid #10b981', background: '#f0fdf4' }}
                >
                  <p className="text-sm font-bold text-emerald-700 mb-0.5">Approve</p>
                  <p className="text-xs text-emerald-600">Pitch cleared for investor access</p>
                </button>

                <button
                  onClick={() => submitDecision('approved_with_warnings')}
                  disabled={submitting || !pdfUrl}
                  className="p-5 rounded-xl border text-left transition-all hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ border: '1.5px solid #f59e0b', background: '#fffbeb' }}
                >
                  <p className="text-sm font-bold text-amber-700 mb-0.5">Approve with Warnings</p>
                  <p className="text-xs text-amber-600">Conditionally approved — caveats apply</p>
                </button>

                <button
                  onClick={() => submitDecision('rejected')}
                  disabled={submitting || !pdfUrl}
                  className="p-5 rounded-xl border text-left transition-all hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ border: '1.5px solid #ef4444', background: '#fef2f2' }}
                >
                  <p className="text-sm font-bold text-red-700 mb-0.5">Reject</p>
                  <p className="text-xs text-red-500">Does not meet requirements</p>
                </button>
              </div>

              {submitting && (
                <p className="text-center text-sm text-gray-400 mt-4">Submitting audit report...</p>
              )}
            </div>

            <div className="flex justify-start">
              <button onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors">
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
