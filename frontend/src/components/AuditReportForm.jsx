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
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
      <div className="text-5xl mb-3">✅</div>
      <p className="font-black text-emerald-800 text-lg mb-1">Report Submitted</p>
      <p className="text-emerald-600 text-sm">Audit report for <strong>"{pitch.title}"</strong> saved. The entrepreneur can now see it on their pitch.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {/* Verdict + Score */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Verdict</p>
          <div className="flex flex-col gap-2">
            {[
              { v: 'proceed',  label: 'Approve',  icon: '✅', active: 'bg-emerald-500 text-white border-emerald-500' },
              { v: 'pending',  label: 'Pending',   icon: '⏳', active: 'bg-amber-500 text-white border-amber-500' },
              { v: 'rejected', label: 'Reject',    icon: '❌', active: 'bg-red-500 text-white border-red-500' },
            ].map(opt => (
              <button key={opt.v} type="button" onClick={() => set('verdict', opt.v)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${form.verdict === opt.v ? opt.active : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-between">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 self-start">Quality Score</p>
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#e5e7eb" strokeWidth="12"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke={scoreColor} strokeWidth="12"
                strokeDasharray={`${circumference * form.score / 100} ${circumference}`}
                strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.3s ease' }}/>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black leading-none" style={{ color: scoreColor }}>{form.score}</span>
              <span className="text-[9px] text-gray-400">/100</span>
            </div>
          </div>
          <input type="range" min="0" max="100" value={form.score}
            onChange={e => set('score', Number(e.target.value))}
            className="w-full mt-2" style={{ accentColor: scoreColor }} />
        </div>
      </div>

      {/* Risk level */}
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Risk Level</p>
        <div className="flex gap-2">
          {[
            { r: 'low',    icon: '🟢', cls: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
            { r: 'medium', icon: '🟡', cls: 'bg-amber-100 text-amber-700 border-amber-300' },
            { r: 'high',   icon: '🔴', cls: 'bg-red-100 text-red-700 border-red-300' },
          ].map(({ r, icon, cls }) => (
            <button key={r} type="button" onClick={() => set('risk_level', r)}
              className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold capitalize transition-all ${form.risk_level === r ? cls : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'}`}>
              {icon} {r}
            </button>
          ))}
        </div>
      </div>

      {/* Due diligence checklist */}
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Due Diligence Checklist</p>
        <div className="grid grid-cols-2 gap-1.5">
          {CHECKLIST.map(item => (
            <label key={item}
              className={`flex items-start gap-2 p-2.5 rounded-xl border cursor-pointer transition-all text-xs ${form.checklist[item] ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-200'}`}>
              <input type="checkbox" className="mt-0.5 flex-shrink-0"
                style={{ accentColor: '#10b981' }}
                checked={!!form.checklist[item]}
                onChange={e => set('checklist', { ...form.checklist, [item]: e.target.checked })} />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* Executive summary */}
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Executive Summary</p>
        <textarea rows={3} value={form.executive_summary}
          onChange={e => set('executive_summary', e.target.value)}
          placeholder="Overall assessment of this pitch..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:border-brand-400 transition-colors" />
      </div>

      {/* Strengths + Concerns */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { field: 'strengths', label: 'Strengths', icon: '💪', accent: '#10b981', bg: 'bg-emerald-50' },
          { field: 'concerns',  label: 'Concerns',  icon: '⚠️', accent: '#ef4444', bg: 'bg-red-50' },
        ].map(({ field, label, icon, accent, bg }) => (
          <div key={field} className={`${bg} rounded-2xl p-4`}>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{icon} {label}</p>
            <div className="space-y-2">
              {form[field].map((val, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <input value={val} onChange={e => listChange(field, i, e.target.value)}
                    placeholder={`Add ${label.toLowerCase()}...`}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none" />
                  {form[field].length > 1 && (
                    <button type="button" onClick={() => listRemove(field, i)} className="text-gray-300 hover:text-red-400 font-bold text-base">×</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => listAdd(field)}
                className="text-xs font-semibold" style={{ color: accent }}>+ Add</button>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Recommendations for Founder</p>
        <textarea rows={2} value={form.recommendations}
          onChange={e => set('recommendations', e.target.value)}
          placeholder="What should the founder do next..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:border-brand-400 transition-colors" />
      </div>

      <button type="submit" disabled={submitting}
        className="w-full py-3.5 rounded-xl font-black text-sm text-white transition-all disabled:opacity-50 active:scale-[0.99]"
        style={{
          background: form.verdict === 'proceed' ? '#10b981' : form.verdict === 'rejected' ? '#ef4444' : '#1e3a5f',
          boxShadow: `0 8px 24px ${form.verdict === 'proceed' ? '#10b98150' : form.verdict === 'rejected' ? '#ef444450' : '#1e3a5f50'}`,
        }}>
        {submitting ? 'Submitting...' : `Submit Report — ${form.verdict === 'proceed' ? '✅ Approve Pitch' : form.verdict === 'rejected' ? '❌ Reject Pitch' : '⏳ Save as Pending'}`}
      </button>
    </form>
  )
}
