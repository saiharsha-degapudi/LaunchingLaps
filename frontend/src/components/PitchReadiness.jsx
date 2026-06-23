import { useState } from 'react'

const QUESTIONS = [
  {
    key: 'stage',
    label: 'What stage is your startup?',
    options: [
      { label: 'Just an idea', score: 3, icon: '💡' },
      { label: 'MVP built', score: 6, icon: '🛠️' },
      { label: 'Have customers', score: 9, icon: '🚀' },
    ],
  },
  {
    key: 'team',
    label: 'What is your team like?',
    options: [
      { label: 'Solo founder', score: 3, icon: '🙋' },
      { label: 'Small team (2–3)', score: 6, icon: '👥' },
      { label: 'Full team', score: 9, icon: '🏢' },
    ],
  },
  {
    key: 'market',
    label: 'How big is your market?',
    options: [
      { label: 'Local / niche', score: 3, icon: '📍' },
      { label: 'National', score: 6, icon: '🗺️' },
      { label: 'Global', score: 9, icon: '🌍' },
    ],
  },
  {
    key: 'revenue',
    label: 'Do you have any revenue?',
    options: [
      { label: 'No revenue yet', score: 3, icon: '📋' },
      { label: 'Beta / waitlist', score: 6, icon: '⏳' },
      { label: 'Paying customers', score: 9, icon: '💰' },
    ],
  },
]

function getStatus(score) {
  if (score >= 30) return { label: 'Investment Ready', color: 'text-green-600', bg: 'bg-green-50', bar: 'bg-green-500' }
  if (score >= 20) return { label: 'Promising', color: 'text-yellow-600', bg: 'bg-yellow-50', bar: 'bg-yellow-400' }
  return { label: 'Early Stage', color: 'text-orange-500', bg: 'bg-orange-50', bar: 'bg-orange-400' }
}

export default function PitchReadiness({ monthlyCost, setMonthlyCost, fundingGoal }) {
  const [answers, setAnswers] = useState({})

  const answered = Object.keys(answers).length
  const score = Object.values(answers).reduce((a, b) => a + b, 0)
  const maxScore = QUESTIONS.length * 9
  const pct = Math.round((score / maxScore) * 100)
  const status = answered === QUESTIONS.length ? getStatus(score) : null

  const monthly = parseFloat(monthlyCost) || 0
  const goal = parseFloat(fundingGoal) || 0
  const runway = monthly > 0 && goal > 0 ? Math.floor(goal / monthly) : null
  const suggested = monthly > 0 ? Math.ceil(monthly * 18 / 1000) * 1000 : null

  return (
    <div className="flex flex-col gap-5">

      {/* Idea Readiness */}
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-3">🎯 Idea Readiness Check</h3>
        <div className="flex flex-col gap-3">
          {QUESTIONS.map(q => (
            <div key={q.key}>
              <p className="text-xs text-gray-500 mb-1.5 font-medium">{q.label}</p>
              <div className="flex gap-2">
                {q.options.map(opt => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setAnswers(a => ({ ...a, [q.key]: opt.score }))}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg border text-xs font-medium transition-all
                      ${answers[q.key] === opt.score
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 text-gray-500 hover:border-indigo-300 hover:bg-indigo-50'}`}
                  >
                    <span className="text-base">{opt.icon}</span>
                    <span className="leading-tight text-center">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {status && (
          <div className={`mt-3 rounded-xl p-3 ${status.bg}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-bold ${status.color}`}>{status.label}</span>
              <span className={`text-xs font-black ${status.color}`}>{pct}%</span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${status.bar}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100" />

      {/* Budget */}
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-3">📊 Budget Overview</h3>
        <div className="flex flex-col gap-2">
          <div>
            <label className="text-xs text-gray-500 font-medium">Monthly costs (salaries, rent, ops)</label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                placeholder="e.g. 20000"
                value={monthlyCost}
                onChange={e => setMonthlyCost(e.target.value)}
                className="input pl-7 text-sm"
              />
            </div>
          </div>

          {monthly > 0 && goal > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-blue-50 rounded-lg p-2.5 text-center">
                <div className="text-xs text-gray-400">Runway</div>
                <div className={`font-black text-sm ${runway < 12 ? 'text-red-500' : 'text-blue-700'}`}>
                  {runway} months
                </div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-2.5 text-center">
                <div className="text-xs text-gray-400">Suggested raise</div>
                <div className="font-black text-sm text-indigo-700">
                  ${(suggested / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          )}

          {monthly > 0 && goal === 0 && (
            <p className="text-xs text-gray-400 italic">Enter a funding goal above to see runway</p>
          )}
        </div>
      </div>

    </div>
  )
}
