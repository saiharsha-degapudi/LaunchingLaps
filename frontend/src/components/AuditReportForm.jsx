import { useState } from 'react'
import api from '../api/axios'

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

export default function AuditReportForm({ pitch, onSuccess }) {
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
  const circumference = 2 * Math.PI * 38

  if (done) return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-emerald-800 mb-1">Report Submitted</p>
      <p className="text-xs text-emerald-600">Audit report for <strong>"{pitch.title}"</strong> saved.</p>
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
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Verdict + Score */}
      <div className="grid grid-cols-2 gap-4">
        {/* Verdict */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <label className="block text-xs font-medium text-zinc-500 mb-3">Verdict</label>
          <div className="flex flex-col gap-2">
            {[
              { v: 'proceed',  label: 'Approve',  activeClass: 'bg-emerald-600 text-white border-emerald-600' },
              { v: 'pending',  label: 'Pending',  activeClass: 'bg-amber-500 text-white border-amber-500' },
              { v: 'rejected', label: 'Reject',   activeClass: 'bg-red-600 text-white border-red-600' },
            ].map(opt => (
              <button
                key={opt.v}
                type="button"
                onClick={() => set('verdict', opt.v)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
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
          <label className="block text-xs font-medium text-zinc-500 mb-2 self-start">Quality Score</label>
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#e4e4e7" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="38"
                fill="none"
                stroke={scoreColor}
                strokeWidth="10"
                strokeDasharray={`${circumference * form.score / 100} ${circumference}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.3s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-semibold leading-none" style={{ color: scoreColor }}>{form.score}</span>
              <span className="text-[9px] text-zinc-400">/100</span>
            </div>
          </div>
          <input
            type="range" min="0" max="100" value={form.score}
            onChange={e => set('score', Number(e.target.value))}
            className="w-full mt-3"
            style={{ accentColor: scoreColor }}
          />
        </div>
      </div>

      {/* Risk level */}
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-2">Risk Level</label>
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
              className={`flex-1 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${
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
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-2">Due Diligence Checklist</label>
        <div className="grid grid-cols-2 gap-1.5">
          {CHECKLIST.map(item => (
            <label
              key={item}
              className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-xs leading-snug ${
                form.checklist[item]
                  ? 'bg-zinc-50 border-zinc-300 text-zinc-800'
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
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Executive Summary</label>
        <textarea
          rows={3}
          value={form.executive_summary}
          onChange={e => set('executive_summary', e.target.value)}
          placeholder="Overall assessment of this pitch..."
          className="w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white resize-none"
        />
      </div>

      {/* Strengths + Concerns */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { field: 'strengths', label: 'Strengths', addColor: 'text-emerald-600' },
          { field: 'concerns',  label: 'Concerns',  addColor: 'text-red-500' },
        ].map(({ field, label, addColor }) => (
          <div key={field} className="bg-white border border-zinc-200 rounded-xl p-4">
            <label className="block text-xs font-medium text-zinc-500 mb-2">{label}</label>
            <div className="space-y-2">
              {form[field].map((val, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <input
                    value={val}
                    onChange={e => listChange(field, i, e.target.value)}
                    placeholder={`Add ${label.toLowerCase()}...`}
                    className="flex-1 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
                  />
                  {form[field].length > 1 && (
                    <button
                      type="button"
                      onClick={() => listRemove(field, i)}
                      className="text-zinc-300 hover:text-red-400 font-semibold text-base leading-none"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => listAdd(field)}
                className={`text-xs font-medium ${addColor} hover:opacity-80 transition-opacity`}
              >
                + Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Recommendations for Founder</label>
        <textarea
          rows={2}
          value={form.recommendations}
          onChange={e => set('recommendations', e.target.value)}
          placeholder="What should the founder do next..."
          className="w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full py-3 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 ${submitBg}`}
      >
        {submitting ? 'Submitting...' : submitLabel}
      </button>
    </form>
  )
}
