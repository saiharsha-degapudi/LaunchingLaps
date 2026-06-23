import { useState } from 'react'

const DIMENSIONS = [
  { key: 'problem', label: 'Problem Clarity', type: 'slider', hint: 'How clearly defined is the problem?' },
  { key: 'market', label: 'Market Size', type: 'select', options: [['<$1M', 2], ['$1M–$10M', 4], ['$10M–$100M', 6], ['$100M–$1B', 8], ['>$1B', 10]] },
  { key: 'unique', label: 'Solution Uniqueness', type: 'slider', hint: 'How unique vs existing alternatives?' },
  { key: 'team', label: 'Team Strength', type: 'select', options: [['No team', 2], ['Solo founder', 4], ['2 founders', 6], ['Full team, no exp', 7], ['Full team + exp', 10]] },
  { key: 'revenue', label: 'Revenue Model', type: 'slider', hint: 'How clear is your revenue model?' },
  { key: 'traction', label: 'Traction', type: 'select', options: [['No traction', 2], ['Concept only', 3], ['MVP built', 5], ['Beta users', 7], ['Paying customers', 10]] },
  { key: 'moat', label: 'Competitive Moat', type: 'slider', hint: 'Do you have a defensible advantage?' },
  { key: 'plan', label: 'Execution Plan', type: 'slider', hint: 'How detailed is your 12-month plan?' },
  { key: 'funding', label: 'Funding Readiness', type: 'select', options: [['Not started', 2], ['Draft budget', 4], ['Full model', 7], ['Audited docs', 10]] },
  { key: 'scale', label: 'Scalability', type: 'slider', hint: 'Can this scale without linear cost?' },
]

const TIPS = {
  problem: 'Write a one-sentence problem statement. Who has this problem, and how often?',
  market: 'Research TAM/SAM/SOM. Cite a credible source (Statista, industry reports).',
  unique: 'List 3 competitors and explain clearly why you win against each.',
  team: 'Add co-founders or advisors with domain expertise before pitching.',
  revenue: 'Define your pricing model — subscription, transaction fee, licensing, etc.',
  traction: 'Get at least 10 paying customers or 100 active beta users before raising.',
  moat: 'Identify IP, network effects, data advantages, or switching costs.',
  plan: 'Break your next 12 months into quarterly milestones with clear KPIs.',
  funding: 'Build a 3-year financial model with monthly breakdown for year 1.',
  scale: 'Explain how unit economics improve as you grow.',
}

export default function IdeaAuditInline() {
  const [scores, setScores] = useState({})
  const [result, setResult] = useState(null)

  const allAnswered = DIMENSIONS.every(d => scores[d.key] !== undefined)
  const total = Object.values(scores).reduce((a, b) => a + Number(b), 0)

  function getColor(score) {
    if (score >= 90) return 'text-purple-600'
    if (score >= 76) return 'text-green-600'
    if (score >= 61) return 'text-yellow-600'
    if (score >= 41) return 'text-orange-500'
    return 'text-red-500'
  }

  function getLabel(score) {
    if (score >= 90) return 'Exceptional'
    if (score >= 76) return '✅ Investment Ready'
    if (score >= 61) return 'Promising'
    if (score >= 41) return 'Early Stage'
    return 'Not Ready'
  }

  function calculate() {
    const weakest = [...DIMENSIONS].sort((a, b) => Number(scores[a.key]) - Number(scores[b.key])).slice(0, 3)
    setResult({ total, weakest })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DIMENSIONS.map(d => (
          <div key={d.key} className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">{d.label}</label>
            {d.type === 'slider' ? (
              <div className="flex items-center gap-2">
                <input type="range" min="1" max="10" value={scores[d.key] || 5}
                  onChange={e => setScores(s => ({ ...s, [d.key]: e.target.value }))}
                  className="flex-1 accent-indigo-600" />
                <span className="text-xs font-bold text-indigo-700 w-4">{scores[d.key] || 5}</span>
              </div>
            ) : (
              <select className="input text-xs py-1.5" value={scores[d.key] || ''}
                onChange={e => setScores(s => ({ ...s, [d.key]: e.target.value }))}>
                <option value="">Select…</option>
                {d.options.map(([label, val]) => <option key={val} value={val}>{label}</option>)}
              </select>
            )}
          </div>
        ))}
      </div>

      <button onClick={calculate} disabled={!allAnswered}
        className="btn-primary self-start text-sm disabled:opacity-50">
        Calculate Score
      </button>

      {result && (
        <div className="bg-indigo-50 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-black ${getColor(result.total)}`}>{result.total}<span className="text-lg text-gray-400">/100</span></div>
            <div>
              <div className={`font-bold text-sm ${getColor(result.total)}`}>{getLabel(result.total)}</div>
              {result.total >= 76 && <div className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">LaunchingLaps Verified ✓</div>}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Top areas to improve:</p>
            {result.weakest.map((d, i) => (
              <div key={d.key} className="text-xs text-gray-700 bg-white rounded-lg px-3 py-2 border border-gray-100">
                <span className="font-bold text-indigo-700">{i + 1}. {d.label}:</span> {TIPS[d.key]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
