import { useState, useEffect } from 'react'

const DEFAULT_QUESTIONS = [
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

const INDUSTRY_QUESTIONS = {
  Technology: [
    { key: 'stage', label: 'Where is your product?', options: [{ label: 'Concept only', score: 3, icon: '💡' }, { label: 'MVP / demo', score: 6, icon: '🛠️' }, { label: 'Live & growing', score: 9, icon: '🚀' }] },
    { key: 'team', label: 'Technical team strength?', options: [{ label: 'No tech cofounder', score: 3, icon: '🙋' }, { label: '1–2 engineers', score: 6, icon: '👨‍💻' }, { label: 'Full tech team', score: 9, icon: '🏗️' }] },
    { key: 'traction', label: 'User traction?', options: [{ label: 'No users yet', score: 3, icon: '📋' }, { label: 'Beta testers', score: 6, icon: '🧪' }, { label: 'Active users / MRR', score: 9, icon: '📈' }] },
    { key: 'market', label: 'Target market size?', options: [{ label: 'Niche / vertical', score: 3, icon: '📍' }, { label: 'National', score: 6, icon: '🗺️' }, { label: 'Global / horizontal', score: 9, icon: '🌍' }] },
  ],
  FinTech: [
    { key: 'stage', label: 'Product status?', options: [{ label: 'Concept / design', score: 3, icon: '💡' }, { label: 'Beta / sandbox', score: 6, icon: '🛠️' }, { label: 'Live & processing', score: 9, icon: '💳' }] },
    { key: 'compliance', label: 'Regulatory status?', options: [{ label: 'Not started', score: 3, icon: '📋' }, { label: 'In progress', score: 6, icon: '⚖️' }, { label: 'Licensed / compliant', score: 9, icon: '✅' }] },
    { key: 'volume', label: 'Transaction volume?', options: [{ label: 'No volume yet', score: 3, icon: '🔇' }, { label: 'Pilot transactions', score: 6, icon: '🧪' }, { label: '$X MRR / month', score: 9, icon: '💰' }] },
    { key: 'team', label: 'Finance + tech expertise?', options: [{ label: 'General background', score: 3, icon: '🙋' }, { label: 'Finance or tech', score: 6, icon: '👥' }, { label: 'Both finance + tech', score: 9, icon: '🏦' }] },
  ],
  HealthTech: [
    { key: 'clinical', label: 'Clinical validation?', options: [{ label: 'None yet', score: 3, icon: '📋' }, { label: 'Pilot underway', score: 6, icon: '🏥' }, { label: 'Published results', score: 9, icon: '📊' }] },
    { key: 'regulatory', label: 'Regulatory status?', options: [{ label: 'Not started', score: 3, icon: '📋' }, { label: 'Filing in progress', score: 6, icon: '⚖️' }, { label: 'FDA/CE cleared', score: 9, icon: '✅' }] },
    { key: 'patients', label: 'Patient / user base?', options: [{ label: 'No users yet', score: 3, icon: '🔇' }, { label: 'Pilot patients', score: 6, icon: '🧑‍⚕️' }, { label: 'Paying / insured', score: 9, icon: '💰' }] },
    { key: 'team', label: 'Medical expertise?', options: [{ label: 'No medical background', score: 3, icon: '🙋' }, { label: 'Medical advisor', score: 6, icon: '👥' }, { label: 'MD / clinician founder', score: 9, icon: '👨‍⚕️' }] },
  ],
  EdTech: [
    { key: 'content', label: 'Content readiness?', options: [{ label: 'Curriculum planned', score: 3, icon: '📋' }, { label: 'Courses in beta', score: 6, icon: '📚' }, { label: 'Full curriculum live', score: 9, icon: '🎓' }] },
    { key: 'students', label: 'Student adoption?', options: [{ label: 'No students yet', score: 3, icon: '🔇' }, { label: 'Pilot cohort', score: 6, icon: '🧑‍🎓' }, { label: 'Enrolled & paying', score: 9, icon: '💰' }] },
    { key: 'outcomes', label: 'Learning outcomes?', options: [{ label: 'Not measured', score: 3, icon: '📋' }, { label: 'Tracking progress', score: 6, icon: '📈' }, { label: 'Proven improvement', score: 9, icon: '🏆' }] },
    { key: 'market', label: 'Market reach?', options: [{ label: 'Single school / city', score: 3, icon: '📍' }, { label: 'Regional / national', score: 6, icon: '🗺️' }, { label: 'Global / underserved', score: 9, icon: '🌍' }] },
  ],
  AgriTech: [
    { key: 'stage', label: 'Technology readiness?', options: [{ label: 'Concept / R&D', score: 3, icon: '💡' }, { label: 'Field trials', score: 6, icon: '🌱' }, { label: 'Deployed at scale', score: 9, icon: '🚜' }] },
    { key: 'farmers', label: 'Farmer adoption?', options: [{ label: 'No farmers yet', score: 3, icon: '🔇' }, { label: 'Pilot group', score: 6, icon: '👨‍🌾' }, { label: 'Thousands onboarded', score: 9, icon: '🌾' }] },
    { key: 'impact', label: 'Measured impact?', options: [{ label: 'Not yet measured', score: 3, icon: '📋' }, { label: 'Early data', score: 6, icon: '📊' }, { label: 'Proven yield / savings', score: 9, icon: '🏆' }] },
    { key: 'partner', label: 'Institutional backing?', options: [{ label: 'None', score: 3, icon: '🙋' }, { label: 'NGO / co-op pilot', score: 6, icon: '🤝' }, { label: 'Govt / bank partner', score: 9, icon: '🏛️' }] },
  ],
  CleanTech: [
    { key: 'stage', label: 'Technology stage?', options: [{ label: 'R&D / concept', score: 3, icon: '🔬' }, { label: 'Prototype / pilot', score: 6, icon: '⚡' }, { label: 'Commercial scale', score: 9, icon: '🏭' }] },
    { key: 'impact', label: 'Measurable impact?', options: [{ label: 'Projected only', score: 3, icon: '📋' }, { label: 'Early measurements', score: 6, icon: '📊' }, { label: 'Verified CO₂ savings', score: 9, icon: '🌿' }] },
    { key: 'revenue', label: 'Revenue / contracts?', options: [{ label: 'None yet', score: 3, icon: '🔇' }, { label: 'LOI / pilot revenue', score: 6, icon: '🤝' }, { label: 'Signed contracts', score: 9, icon: '💰' }] },
    { key: 'grants', label: 'Non-dilutive funding?', options: [{ label: 'None applied', score: 3, icon: '📋' }, { label: 'Applied / pending', score: 6, icon: '⏳' }, { label: 'Grants secured', score: 9, icon: '🏆' }] },
  ],
  SaaS: [
    { key: 'stage', label: 'Product status?', options: [{ label: 'Wireframes / design', score: 3, icon: '🎨' }, { label: 'Beta / freemium', score: 6, icon: '🛠️' }, { label: 'Paying customers', score: 9, icon: '💻' }] },
    { key: 'arr', label: 'ARR / MRR?', options: [{ label: 'No revenue', score: 3, icon: '🔇' }, { label: '<$10K MRR', score: 6, icon: '📈' }, { label: '>$10K MRR', score: 9, icon: '💰' }] },
    { key: 'churn', label: 'Retention / NRR?', options: [{ label: 'Not tracked', score: 3, icon: '📋' }, { label: 'Measuring now', score: 6, icon: '📊' }, { label: 'NRR >100%', score: 9, icon: '🏆' }] },
    { key: 'market', label: 'Target segment?', options: [{ label: 'Still finding fit', score: 3, icon: '🔍' }, { label: 'Clear ICP defined', score: 6, icon: '🎯' }, { label: 'Repeatable sales', score: 9, icon: '🚀' }] },
  ],
  'E-commerce': [
    { key: 'product', label: 'Product availability?', options: [{ label: 'Sourcing / designing', score: 3, icon: '🎨' }, { label: 'Sample / prototype', score: 6, icon: '📦' }, { label: 'In stock & selling', score: 9, icon: '🛒' }] },
    { key: 'gmv', label: 'Monthly GMV?', options: [{ label: 'No sales yet', score: 3, icon: '🔇' }, { label: 'Early orders', score: 6, icon: '🧪' }, { label: 'Consistent GMV', score: 9, icon: '💰' }] },
    { key: 'cac', label: 'Unit economics?', options: [{ label: 'Not calculated', score: 3, icon: '📋' }, { label: 'Estimated', score: 6, icon: '📊' }, { label: 'LTV > 3× CAC', score: 9, icon: '🏆' }] },
    { key: 'channel', label: 'Sales channels?', options: [{ label: 'DTC website only', score: 3, icon: '💻' }, { label: '+ marketplace', score: 6, icon: '🗺️' }, { label: '+ retail / wholesale', score: 9, icon: '🏪' }] },
  ],
  'Real Estate': [
    { key: 'stage', label: 'Project / platform stage?', options: [{ label: 'Concept / planning', score: 3, icon: '📋' }, { label: 'Pilot / first deal', score: 6, icon: '🏗️' }, { label: 'Active portfolio', score: 9, icon: '🏢' }] },
    { key: 'legal', label: 'Legal & structure?', options: [{ label: 'Not yet set up', score: 3, icon: '📋' }, { label: 'Structure in progress', score: 6, icon: '⚖️' }, { label: 'Entity + contracts ready', score: 9, icon: '✅' }] },
    { key: 'returns', label: 'Track record?', options: [{ label: 'None yet', score: 3, icon: '🔇' }, { label: 'One deal closed', score: 6, icon: '🤝' }, { label: 'Multiple exits / yield', score: 9, icon: '💰' }] },
    { key: 'market', label: 'Market knowledge?', options: [{ label: 'New to market', score: 3, icon: '🙋' }, { label: 'Some local deals', score: 6, icon: '🏘️' }, { label: 'Deep market expertise', score: 9, icon: '🏆' }] },
  ],
  Logistics: [
    { key: 'ops', label: 'Operations live?', options: [{ label: 'Planning phase', score: 3, icon: '📋' }, { label: 'Pilot routes / clients', score: 6, icon: '🚚' }, { label: 'Full operations', score: 9, icon: '🏭' }] },
    { key: 'clients', label: 'Client base?', options: [{ label: 'No clients', score: 3, icon: '🔇' }, { label: '1–2 pilot clients', score: 6, icon: '🤝' }, { label: 'Signed contracts', score: 9, icon: '📄' }] },
    { key: 'tech', label: 'Tech / differentiation?', options: [{ label: 'Manual processes', score: 3, icon: '🙋' }, { label: 'Basic software', score: 6, icon: '💻' }, { label: 'Proprietary platform', score: 9, icon: '🚀' }] },
    { key: 'margin', label: 'Unit economics?', options: [{ label: 'Not yet measured', score: 3, icon: '📋' }, { label: 'Tracking now', score: 6, icon: '📊' }, { label: 'Positive margin', score: 9, icon: '💰' }] },
  ],
  'Consumer Goods': [
    { key: 'product', label: 'Product ready?', options: [{ label: 'R&D / prototype', score: 3, icon: '🔬' }, { label: 'Small batch made', score: 6, icon: '📦' }, { label: 'In production & selling', score: 9, icon: '🛒' }] },
    { key: 'sales', label: 'Sales traction?', options: [{ label: 'No sales', score: 3, icon: '🔇' }, { label: 'DTC early orders', score: 6, icon: '🧪' }, { label: 'Retail shelves / repeat', score: 9, icon: '🏪' }] },
    { key: 'brand', label: 'Brand strength?', options: [{ label: 'No brand yet', score: 3, icon: '📋' }, { label: 'Social presence', score: 6, icon: '📱' }, { label: 'Loyal community', score: 9, icon: '❤️' }] },
    { key: 'margin', label: 'Gross margin?', options: [{ label: 'Not calculated', score: 3, icon: '📋' }, { label: '<40%', score: 6, icon: '📊' }, { label: '>50%', score: 9, icon: '💰' }] },
  ],
  'Media & Entertainment': [
    { key: 'content', label: 'Content library?', options: [{ label: 'In production', score: 3, icon: '🎬' }, { label: 'Some published', score: 6, icon: '📺' }, { label: 'Catalog + audience', score: 9, icon: '🎥' }] },
    { key: 'audience', label: 'Audience size?', options: [{ label: 'No audience yet', score: 3, icon: '🔇' }, { label: '<10K followers', score: 6, icon: '📱' }, { label: '>50K engaged fans', score: 9, icon: '🌟' }] },
    { key: 'monetize', label: 'Monetization?', options: [{ label: 'None yet', score: 3, icon: '📋' }, { label: 'Ads or early subs', score: 6, icon: '💸' }, { label: 'Multiple streams', score: 9, icon: '💰' }] },
    { key: 'ip', label: 'IP / differentiation?', options: [{ label: 'Generic content', score: 3, icon: '📄' }, { label: 'Niche format', score: 6, icon: '🎯' }, { label: 'Owned IP / franchise', score: 9, icon: '🏆' }] },
  ],
}

function getStatus(score) {
  if (score >= 30) return { label: 'Investment Ready', color: 'text-green-600', bg: 'bg-green-50', bar: 'bg-green-500' }
  if (score >= 20) return { label: 'Promising', color: 'text-yellow-600', bg: 'bg-yellow-50', bar: 'bg-yellow-400' }
  return { label: 'Early Stage', color: 'text-orange-500', bg: 'bg-orange-50', bar: 'bg-orange-400' }
}

export default function PitchReadiness({ industry }) {
  const questions = (industry && INDUSTRY_QUESTIONS[industry]) || DEFAULT_QUESTIONS
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    setAnswers({})
  }, [industry])

  const answered = Object.keys(answers).length
  const score = Object.values(answers).reduce((a, b) => a + b, 0)
  const maxScore = questions.length * 9
  const pct = Math.round((score / maxScore) * 100)
  const status = answered === questions.length ? getStatus(score) : null

  return (
    <div className="flex flex-col gap-5">

      {/* Idea Readiness */}
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-3">🎯 Idea Readiness Check</h3>
        {industry && INDUSTRY_QUESTIONS[industry] && (
          <p className="text-xs text-indigo-500 font-medium mb-1">Tailored for {industry}</p>
        )}
        <div className="flex flex-col gap-3">
          {questions.map(q => (
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


    </div>
  )
}
