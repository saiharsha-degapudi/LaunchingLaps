import { useState, useEffect } from 'react'
import api from '../api/axios'

function safeParseJSON(str, fallback) {
  try { return JSON.parse(str) } catch { return fallback }
}

function ScoreRing({ score }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  const label = score >= 75 ? 'Strong' : score >= 50 ? 'Moderate' : 'Weak'
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#f0f0f0" strokeWidth="10" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circ * score / 100 + ' ' + circ}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black" style={{ color }}>{score}</span>
          <span className="text-[9px] text-gray-400">/100</span>
        </div>
      </div>
      <p className="text-xs font-black mt-1" style={{ color }}>{label}</p>
    </div>
  )
}

export default function InvestorAuditReport({ pitchId }) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pitchId) return
    api.get('/pitches/' + pitchId + '/audit-report')
      .then(r => setReport(r.data))
      .catch(() => setReport(null))
      .finally(() => setLoading(false))
  }, [pitchId])

  if (loading) return (
    <div className="rounded-2xl p-6 animate-pulse" style={{ background: '#fff', border: '1px solid #f0f0f0' }}>
      <div className="h-4 bg-zinc-100 rounded w-48 mb-3" />
      <div className="h-3 bg-zinc-100 rounded w-64" />
    </div>
  )
  if (!report) return null

  const strengths = safeParseJSON(report.strengths, [])
  const concerns = safeParseJSON(report.concerns, [])
  const findings = safeParseJSON(report.findings, {})
  const categories = findings.categories || {}
  const riskReason = findings.risk_reason || ''

  const riskConfig = {
    low:    { label: 'Low Risk',    bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', icon: '🟢' },
    medium: { label: 'Medium Risk', bg: '#fefce8', text: '#854d0e', border: '#fef08a', icon: '🟡' },
    high:   { label: 'High Risk',   bg: '#fef2f2', text: '#991b1b', border: '#fecaca', icon: '🔴' },
  }
  const risk = riskConfig[report.risk_level] || riskConfig.medium

  const verdictConfig = {
    approved:               { label: 'Approved',              bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    approved_with_warnings: { label: 'Approved with Warnings',bg: '#fefce8', text: '#854d0e', border: '#fef08a' },
    rejected:               { label: 'Rejected',              bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
    proceed:                { label: 'Approved',              bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    changes_required:       { label: 'Changes Required',      bg: '#fff7ed', text: '#9a3412', border: '#fdba74' },
  }
  const verdict = verdictConfig[report.verdict] || verdictConfig.approved

  const auditDate = report.audited_at
    ? new Date(report.audited_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'N/A'

  const allItems = Object.values(categories).flatMap(cat => Object.entries(cat.scores || {}))
  const passCount = allItems.filter(([, v]) => v === 'pass').length
  const failCount = allItems.filter(([, v]) => v === 'fail').length
  const totalChecked = allItems.filter(([, v]) => v !== '' && v !== undefined).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #f0f0f0' }}>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: '#060e1f', color: '#f59e0b' }}>
                ✓ AUDIT VERIFIED
              </span>
              <span className="text-xs font-black px-2.5 py-1 rounded-full"
                style={{ background: verdict.bg, color: verdict.text, border: '1px solid ' + verdict.border }}>
                {verdict.label}
              </span>
            </div>
            <h3 className="text-lg font-black text-gray-900">Audit Verification Report</h3>
            <p className="text-sm text-gray-400 mt-1">
              Reviewed by LaunchingLaps Audit Team · {auditDate}
            </p>
          </div>
          <ScoreRing score={Math.round(report.score || 0)} />
        </div>

        {/* Risk Level */}
        <div className="rounded-xl p-4 mb-4" style={{ background: risk.bg, border: '1px solid ' + risk.border }}>
          <div className="flex items-center gap-2 mb-1">
            <span>{risk.icon}</span>
            <span className="text-sm font-black" style={{ color: risk.text }}>{risk.label}</span>
          </div>
          {riskReason && (
            <p className="text-xs leading-relaxed" style={{ color: risk.text }}>{riskReason}</p>
          )}
        </div>

        {/* Executive Summary */}
        {report.executive_summary && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Executive Summary</p>
            <p className="text-sm text-gray-700 leading-relaxed">{report.executive_summary}</p>
          </div>
        )}

        {/* PDF Report Download */}
        {report.pdf_url && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Full Audit Report</p>
            <a
              href={`${import.meta.env.VITE_API_URL || 'http://localhost:8001'}${report.pdf_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
              style={{ background: '#060e1f', color: '#f59e0b' }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Full Audit Report PDF
            </a>
          </div>
        )}
      </div>

      {/* Strengths + Concerns */}
      {(strengths.length > 0 || concerns.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {strengths.length > 0 && (
            <div className="rounded-2xl p-5" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-3">Strengths</p>
              <ul className="space-y-2">
                {strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                    <span className="flex-shrink-0 mt-0.5">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {concerns.length > 0 && (
            <div className="rounded-2xl p-5" style={{ background: '#fefce8', border: '1px solid #fef08a' }}>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-3">Concerns</p>
              <ul className="space-y-2">
                {concerns.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                    <span className="flex-shrink-0 mt-0.5">⚠</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Verification Stats */}
      {totalChecked > 0 && (
        <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #f0f0f0' }}>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Due Diligence Coverage</p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-black text-emerald-600">{passCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">Items Verified</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-red-500">{failCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">Items Flagged</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-gray-900">{totalChecked}</p>
              <p className="text-xs text-gray-400 mt-0.5">Total Reviewed</p>
            </div>
          </div>

          {/* Category pass counts */}
          <div className="space-y-2">
            {[
              { key: 'founder', label: 'Founder Verification', emoji: '👤' },
              { key: 'company', label: 'Company & Legal', emoji: '🏢' },
              { key: 'legal', label: 'Legal Review', emoji: '⚖️' },
              { key: 'financials', label: 'Financial Review', emoji: '💰' },
              { key: 'traction', label: 'Product & Traction', emoji: '🚀' },
              { key: 'market', label: 'Market Review', emoji: '🌍' },
              { key: 'valuation', label: 'Valuation Review', emoji: '💎' },
              { key: 'use_of_funds', label: 'Use of Funds', emoji: '📋' },
              { key: 'risk', label: 'Risk Review', emoji: '⚠️' },
            ].map(cat => {
              const catData = categories[cat.key]
              if (!catData || !catData.scores) return null
              const catItems = Object.entries(catData.scores).filter(([, v]) => v !== '')
              const catPass = catItems.filter(([, v]) => v === 'pass').length
              const catTotal = catItems.length
              if (catTotal === 0) return null
              const pct = Math.round(catPass / catTotal * 100)
              const barColor = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444'
              return (
                <div key={cat.key} className="flex items-center gap-3">
                  <span className="text-sm w-5 flex-shrink-0">{cat.emoji}</span>
                  <p className="text-xs text-gray-600 w-40 flex-shrink-0">{cat.label}</p>
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: pct + '%', background: barColor }} />
                  </div>
                  <span className="text-xs font-black w-16 text-right flex-shrink-0" style={{ color: barColor }}>
                    {catPass}/{catTotal}
                  </span>
                </div>
              )
            }).filter(Boolean)}
          </div>
        </div>
      )}

      {/* Category notes visible to investors */}
      {categories.financials?.notes && (
        <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #f0f0f0' }}>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Financial Notes</p>
          <p className="text-sm text-gray-700 leading-relaxed">{categories.financials.notes}</p>
        </div>
      )}

      {categories.legal?.notes && (
        <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #f0f0f0' }}>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Legal Notes</p>
          <p className="text-sm text-gray-700 leading-relaxed">{categories.legal.notes}</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-2xl p-5" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Important Disclaimer</p>
        <p className="text-xs text-amber-800 leading-relaxed">
          Audit approval does not guarantee investment success or returns. This report reflects the findings of the LaunchingLaps audit team based on information provided by the company at the time of review. Investors should conduct their own independent due diligence before making any investment decision. Past performance and audit scores are not indicative of future results.
        </p>
      </div>
    </div>
  )
}
