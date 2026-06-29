import { useState, useRef, useEffect } from 'react'
import api from '../api/axios'
import { WordReveal, useScrollReveal } from '../utils/design'

const CHECKLIST = [
  'Business model clearly articulated',
  'Market size well-defined and credible',
  'Financial projections are realistic',
  'Team background is verifiable',
  'Legal structure is investment-ready',
  'IP / competitive moat documented',
  'Traction metrics provided and validated',
  'Use of funds clearly specified',
]

function ScoreRing({ score }) {
  const circumference = 2 * Math.PI * 38
  const scoreColor = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  const ringRef = useRef(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); observer.disconnect() } },
      { threshold: 0.5 }
    )
    if (ringRef.current) observer.observe(ringRef.current)
    return () => observer.disconnect()
  }, [])

  const dashArray = animated
    ? `${circumference * score / 100} ${circumference}`
    : `0 ${circumference}`

  return (
    <div ref={ringRef} className="relative w-20 h-20">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="38" fill="none" stroke="#e4e4e7" strokeWidth="10" />
        <circle
          cx="50" cy="50" r="38"
          fill="none"
          stroke={scoreColor}
          strokeWidth="10"
          strokeDasharray={dashArray}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.32, 0.72, 0, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-semibold leading-none" style={{ color: scoreColor }}>{score}</span>
        <span className="text-[9px] text-zinc-400">/100</span>
      </div>
    </div>
  )
}

export default function AuditReportForm({ pitch, onSuccess }) {
  useScrollReveal()

  const [form, setForm] = useState({
    verdict: 'pending',
    score: 70,
    risk_level: 'medium',
    executive_summary: '',
    recommendations: '',
    strengths: [''],
    concerns: [''],
    checklist: {},
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  function listChange(field, i, val) {
    const arr = [...form[field]]; arr[i] = val; set(field, arr)
  }
  function listAdd(field) { set(field, [...form[field], '']) }
  function listRemove(field, i) { set(field, form[field].filter((_, idx) => idx !== i)) }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true); setError('')
    try {
      const auditStatus = form.verdict === 'proceed' ? 'proceed' : form.verdict === 'rejected' ? 'rejected' : 'open'
      await api.patch(`/pitches/${pitch.id}/audit`, { audit_status: auditStatus })
      await api.post(`/pitches/${pitch.id}/audit-report`, {
        verdict: form.verdict,
        score: form.score,
        risk_level: form.risk_level,
        executive_summary: form.executive_summary,
        recommendations: form.recommendations,
        strengths: JSON.stringify(form.strengths.filter(Boolean)),
        concerns: JSON.stringify(form.concerns.filter(Boolean)),
        findings: JSON.stringify(CHECKLIST.filter(item => form.checklist[item])),
      })
      setDone(true)
      onSuccess?.()
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to submit report.')
    } finally {
      setSubmitting(false)
    }
  }

  const scoreColor = form.score >= 75 ? '#10b981' : form.score >= 50 ? '#f59e0b' : '#ef4444'

  if (done) return (
    <div className="reveal bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-emerald-800 mb-1">Report Submitted</p>
      <p className="text-xs text-emerald-600">
        Audit report for <strong>&ldquo;{pitch.title}&rdquo;</strong> saved.
      </p>
    </div>
  )

  const submitBg =
    form.verdict === 'proceed'  ? 'bg-emerald-600 hover:bg-emerald-700' :
    form.verdict === 'rejected' ? 'bg-red-600 hover:bg-red-700' :
                                  'bg-zinc-900 hover:bg-zinc-700'

  const submitLabel =
    form.verdict === 'proceed'  ? 'Submit — Approve Pitch' :
    form.verdict === 'rejected' ? 'Submit — Reject Pitch' :
                                  'Submit — Save as Pending'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="reveal bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Verdict + Score */}
      <div className="reveal reveal-delay-1 grid grid-cols-2 gap-4">
        {/* Verdict */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <WordReveal
            text="Verdict"
            tag="p"
            className="text-xs font-medium text-zinc-500 mb-3"
          />
          <div className="flex flex-col gap-2">
            {[
              { v: 'proceed',  label: 'Approve', activeClass: 'bg-emerald-600 text-white border-emerald-600' },
              { v: 'pending',  label: 'Pending', activeClass: 'bg-amber-500 text-white border-amber-500' },
              { v: 'rejected', label: 'Reject',  activeClass: 'bg-red-600 text-white border-red-600' },
            ].map(opt => (
              <button
                key={opt.v}
                type="button"
                onClick={() => set('verdict', opt.v)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  form.verdict === opt.v
                    ? opt.activeClass
                    : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Score */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col items-center justify-between">
          <WordReveal
            text="Quality Score"
            tag="p"
            className="text-xs font-medium text-zinc-500 mb-2 self-start"
          />
          <ScoreRing score={form.score} />
          <input
            type="range" min="0" max="100" value={form.score}
            onChange={e => set('score', Number(e.target.value))}
            className="w-full mt-3"
            style={{ accentColor: scoreColor }}
          />
        </div>
      </div>

      {/* Risk level */}
      <div className="reveal reveal-delay-2">
        <WordReveal
          text="Risk Level"
          tag="p"
          className="text-xs font-medium text-zinc-500 mb-2"
        />
        <div className="flex gap-2">
          {[
            { r: 'low',    label: 'Low',    activeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
            { r: 'medium', label: 'Medium', activeClass: 'bg-amber-50 text-amber-700 border-amber-300' },
            { r: 'high',   label: 'High',   activeClass: 'bg-red-50 text-red-700 border-red-300' },
          ].map(({ r, label, activeClass }) => (
            <button
              key={r}
              type="button"
              onClick={() => set('risk_level', r)}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium capitalize transition-all duration-200 ${
                form.risk_level === r
                  ? activeClass
                  : 'border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Due diligence checklist */}
      <div className="reveal reveal-delay-3">
        <WordReveal
          text="Due Diligence Checklist"
          tag="p"
          className="text-xs font-medium text-zinc-500 mb-2"
        />
        <div className="grid grid-cols-2 gap-1.5">
          {CHECKLIST.map(item => (
            <label
              key={item}
              className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer text-xs leading-snug transition-all duration-200 ${
                form.checklist[item]
                  ? 'bg-blue-50 border-blue-200 text-zinc-800'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
              }`}
            >
              <input
                type="checkbox"
                className="mt-0.5 flex-shrink-0 accent-blue-600"
                checked={!!form.checklist[item]}
                onChange={e => set('checklist', { ...form.checklist, [item]: e.target.checked })}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* Executive summary */}
      <div className="reveal reveal-delay-4">
        <WordReveal
          text="Executive Summary"
          tag="p"
          className="text-xs font-medium text-zinc-500 mb-1.5"
        />
        <textarea
          rows={3}
          value={form.executive_summary}
          onChange={e => set('executive_summary', e.target.value)}
          placeholder="Overall assessment of this pitch..."
          className="input w-full resize-none"
        />
      </div>

      {/* Strengths + Concerns */}
      <div className="reveal reveal-delay-5 grid grid-cols-2 gap-4">
        {[
          { field: 'strengths', label: 'Strengths', addColor: 'text-emerald-600', borderActive: 'border-emerald-100' },
          { field: 'concerns',  label: 'Concerns',  addColor: 'text-red-500',     borderActive: 'border-red-100'     },
        ].map(({ field, label, addColor, borderActive }) => (
          <div key={field} className={`bg-white border rounded-xl p-4 transition-colors duration-200 ${
            form[field].some(Boolean) ? borderActive : 'border-zinc-200'
          }`}>
            <WordReveal
              text={label}
              tag="p"
              className="text-xs font-medium text-zinc-500 mb-2"
            />
            <div className="space-y-2">
              {form[field].map((val, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <input
                    value={val}
                    onChange={e => listChange(field, i, e.target.value)}
                    placeholder={`Add ${label.toLowerCase()}...`}
                    className="flex-1 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white"
                  />
                  {form[field].length > 1 && (
                    <button
                      type="button"
                      onClick={() => listRemove(field, i)}
                      className="text-zinc-300 hover:text-red-400 font-semibold text-base leading-none transition-colors duration-200"
                    >
                      &#215;
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => listAdd(field)}
                className={`text-xs font-medium ${addColor} hover:opacity-80 transition-opacity duration-200`}
              >
                + Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="reveal">
        <WordReveal
          text="Recommendations for Founder"
          tag="p"
          className="text-xs font-medium text-zinc-500 mb-1.5"
        />
        <textarea
          rows={2}
          value={form.recommendations}
          onChange={e => set('recommendations', e.target.value)}
          placeholder="What should the founder do next..."
          className="input w-full resize-none"
        />
      </div>

      <div className="reveal">
        <button
          type="submit"
          disabled={submitting}
          className={`btn-primary w-full py-3 text-sm font-medium transition-all duration-300 disabled:opacity-50 ${submitBg}`}
        >
          {submitting ? 'Submitting...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
