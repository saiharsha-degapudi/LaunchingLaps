import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import PitchReadiness from '../components/PitchReadiness'

const INDUSTRIES = [
  'Technology', 'FinTech', 'HealthTech', 'EdTech', 'AgriTech',
  'CleanTech', 'E-commerce', 'SaaS', 'Real Estate', 'Consumer Goods',
  'Media & Entertainment', 'Logistics', 'Other',
]

const INDUSTRY_DEFAULTS = {
  Technology: {
    stage: 'seed',
    funding_goal: '500000',
    descriptionTemplate: `Problem: [Describe the technical problem you're solving]\n\nSolution: [Explain your technology and how it works]\n\nTraction: [Users, MRR, key milestones]\n\nAsk: $500K to [expand engineering team / launch v2 / enter new markets]\n\nUnit Economics: CAC $X, LTV $X, payback period X months`,
    hint: 'Typical tech seed rounds: $250K–$2M',
  },
  FinTech: {
    stage: 'seed',
    funding_goal: '1000000',
    descriptionTemplate: `Problem: [Describe the financial pain point — fees, access, speed]\n\nSolution: [How your product solves it — payments, lending, insurance, etc.]\n\nTraction: [Volume processed, customers, MRR]\n\nAsk: $1M for [regulatory licensing / product expansion / growth]\n\nCompliance: [Licenses held or in progress — money transmitter, RBI, FCA, etc.]`,
    hint: 'FinTech rounds often $500K–$3M at seed due to regulatory costs',
  },
  HealthTech: {
    stage: 'seed',
    funding_goal: '750000',
    descriptionTemplate: `Problem: [Healthcare gap — access, cost, outcomes]\n\nSolution: [Your product — telehealth, diagnostics, care coordination, etc.]\n\nTraction: [Patients served, clinical outcomes, hospital partnerships]\n\nAsk: $750K for [clinical validation / FDA clearance / expansion]\n\nRegulatory: [HIPAA compliant, FDA pathway, CE mark status]`,
    hint: 'HealthTech: $500K–$5M at seed; regulatory milestones matter',
  },
  EdTech: {
    stage: 'idea',
    funding_goal: '300000',
    descriptionTemplate: `Problem: [Educational gap — access, quality, cost, outcomes]\n\nSolution: [Your learning platform / tool / curriculum]\n\nTraction: [Students enrolled, completion rates, NPS, institutional partners]\n\nAsk: $300K for [content creation / teacher onboarding / market expansion]\n\nImpact: [Measurable learning outcomes, demographics served]`,
    hint: 'EdTech pre-seed: $100K–$500K; impact metrics are key',
  },
  AgriTech: {
    stage: 'idea',
    funding_goal: '250000',
    descriptionTemplate: `Problem: [Agricultural challenge — yield, waste, access to markets or credit]\n\nSolution: [Your technology — sensors, AI, drones, marketplace, etc.]\n\nTraction: [Farmers onboarded, yield improvement data, geography]\n\nAsk: $250K for [hardware production / farmer acquisition / expansion to new regions]\n\nImpact: [Yield improvement %, water savings, income increase per farmer]`,
    hint: 'AgriTech pre-seed: $100K–$500K; impact data wins investors',
  },
  CleanTech: {
    stage: 'seed',
    funding_goal: '1500000',
    descriptionTemplate: `Problem: [Environmental challenge — emissions, waste, energy access]\n\nSolution: [Your clean technology — solar, EV, carbon capture, recycling, etc.]\n\nTraction: [Units deployed, carbon offset, revenue, partnerships]\n\nAsk: $1.5M for [pilot scaling / manufacturing / regulatory approvals]\n\nImpact: [CO₂ reduced per year, energy generated, communities served]`,
    hint: 'CleanTech seed: $500K–$5M; government grants often available',
  },
  'E-commerce': {
    stage: 'seed',
    funding_goal: '500000',
    descriptionTemplate: `Problem: [Gap in how products are discovered, bought, or delivered]\n\nSolution: [Your e-commerce model — D2C, marketplace, social commerce, etc.]\n\nTraction: [GMV, orders/month, repeat purchase rate, CAC, LTV]\n\nAsk: $500K for [inventory / marketing / logistics / tech]\n\nUnit Economics: AOV $X, gross margin X%, CAC $X, LTV $X`,
    hint: 'E-commerce seed: $250K–$2M; unit economics are critical',
  },
  SaaS: {
    stage: 'seed',
    funding_goal: '750000',
    descriptionTemplate: `Problem: [Business workflow that is broken, slow, or expensive]\n\nSolution: [Your software — what it automates or improves]\n\nTraction: [ARR, MRR, customer count, NPS, churn rate]\n\nAsk: $750K for [sales team / product development / enterprise features]\n\nUnit Economics: ACV $X, CAC $X, LTV $X, gross margin X%, NRR X%`,
    hint: 'SaaS seed: $500K–$3M; ARR and NRR are the key metrics',
  },
  'Real Estate': {
    stage: 'idea',
    funding_goal: '2000000',
    descriptionTemplate: `Problem: [Pain point in buying, selling, renting, or managing property]\n\nSolution: [PropTech platform / fund / marketplace / construction tech]\n\nTraction: [Transactions facilitated, AUM, platform users, revenue]\n\nAsk: $2M for [platform development / property acquisition / market expansion]\n\nMarket: [TAM, target geography, average deal size]`,
    hint: 'Real estate tech/funds: $1M–$10M; regulatory clarity matters',
  },
  'Consumer Goods': {
    stage: 'idea',
    funding_goal: '400000',
    descriptionTemplate: `Problem: [Consumer need not met by existing products]\n\nSolution: [Your product — what makes it different / better]\n\nTraction: [Units sold, DTC revenue, retail partnerships, NPS]\n\nAsk: $400K for [manufacturing scale-up / marketing / retail distribution]\n\nUnit Economics: COGS $X, gross margin X%, CAC $X, LTV $X, reorder rate X%`,
    hint: 'Consumer goods: $200K–$2M; repeat purchase rate is key',
  },
  'Media & Entertainment': {
    stage: 'idea',
    funding_goal: '500000',
    descriptionTemplate: `Problem: [Gap in how content is created, distributed, or monetized]\n\nSolution: [Your media product — streaming, creator tools, IP, events]\n\nTraction: [MAU, subscribers, revenue, content library size, creator count]\n\nAsk: $500K for [content production / platform development / creator acquisition]\n\nMonetization: [Subscriptions, ads, licensing, live events, merchandise]`,
    hint: 'Media/entertainment: $250K–$5M; audience metrics are key',
  },
  Logistics: {
    stage: 'seed',
    funding_goal: '1000000',
    descriptionTemplate: `Problem: [Supply chain or delivery pain — speed, cost, visibility, last-mile]\n\nSolution: [Your logistics tech or network — routing, warehousing, freight, etc.]\n\nTraction: [Shipments handled, clients, on-time rate, cost savings delivered]\n\nAsk: $1M for [fleet / warehouses / tech / market expansion]\n\nUnit Economics: Revenue per shipment $X, gross margin X%, CAC $X`,
    hint: 'Logistics seed: $500K–$5M; operational metrics win deals',
  },
  Other: {
    stage: 'idea',
    funding_goal: '300000',
    descriptionTemplate: `Problem: [What problem are you solving and for whom?]\n\nSolution: [How does your product or service solve it?]\n\nTraction: [Any early customers, revenue, pilots, or partnerships]\n\nAsk: $300K for [what will you use the funding for?]\n\nMarket: [How big is the opportunity?]`,
    hint: 'Describe your market and traction as clearly as possible',
  },
}

export default function SubmitPitch() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '', description: '', industry: '',
    funding_goal: '', stage: 'idea', deck_url: '', video_url: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (user?.role !== 'entrepreneur') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="card">
          <p className="text-brand-800 font-bold text-lg mb-2">Access Restricted</p>
          <p className="text-gray-500 text-sm">Only entrepreneurs can submit pitches.</p>
        </div>
      </div>
    )
  }

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'industry' && value && INDUSTRY_DEFAULTS[value]) {
      const defaults = INDUSTRY_DEFAULTS[value]
      // Check if current description is a template from a previous industry (not user-written)
      const isTemplate = Object.values(INDUSTRY_DEFAULTS).some(d => d.descriptionTemplate === form.description)
      setForm(prev => ({
        ...prev,
        industry: value,
        stage: defaults.stage,
        funding_goal: prev.funding_goal === '' || isTemplate ? defaults.funding_goal : prev.funding_goal,
        description: prev.description === '' || isTemplate ? defaults.descriptionTemplate : prev.description,
      }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.industry) { setError('Please select an industry.'); return }
    const goal = parseFloat(form.funding_goal)
    if (!goal || goal <= 0) { setError('Funding goal must be a positive number.'); return }

    setLoading(true)
    setError('')
    try {
      const payload = {
        title: form.title, description: form.description,
        industry: form.industry, funding_goal: goal, stage: form.stage,
      }
      if (form.deck_url) payload.deck_url = form.deck_url
      if (form.video_url) payload.video_url = form.video_url
      const { data } = await api.post('/pitches/', payload)
      setSuccess(true)
      setTimeout(() => navigate(`/pitches/${data.id}`), 1500)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to submit pitch. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="card flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-brand-800">Pitch Submitted!</h2>
          <p className="text-gray-500 text-sm mt-1">Our audit team will review your pitch within 24–48 hours.</p>
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 mt-1">
            <span className="text-yellow-500 text-lg">⏳</span>
            <span className="text-xs font-semibold text-yellow-700">Audit Status: Open — Under Review</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <h1 className="section-title text-3xl">Submit Your Pitch</h1>
        <p className="text-gray-500 text-sm mt-1">Tell us about your startup. Our audit team will review it within 24–48 hours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* LEFT — Pitch Form */}
        <div className="card shadow-sm">
          <h2 className="font-bold text-brand-800 text-base mb-5">Pitch Details</h2>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="title" className="label">Pitch Title *</label>
              <input id="title" name="title" type="text" required value={form.title}
                onChange={handleChange} placeholder="e.g. AI-powered supply chain for emerging markets"
                className="input" />
            </div>

            <div>
              <label htmlFor="description" className="label">Description *</label>
              <textarea id="description" name="description" rows={4} required value={form.description}
                onChange={handleChange}
                placeholder="Describe the problem you're solving, your solution, and any traction so far…"
                className="input resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="industry" className="label">Industry *</label>
                <select id="industry" name="industry" required value={form.industry}
                  onChange={handleChange} className="input">
                  <option value="">Select…</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
                {form.industry && INDUSTRY_DEFAULTS[form.industry] && (
                  <p className="text-xs text-indigo-600 mt-1 font-medium">
                    💡 {INDUSTRY_DEFAULTS[form.industry].hint}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="stage" className="label">Stage *</label>
                <select id="stage" name="stage" required value={form.stage}
                  onChange={handleChange} className="input">
                  <option value="idea">Idea</option>
                  <option value="seed">Seed</option>
                  <option value="growth">Growth</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="funding_goal" className="label">Funding Goal (USD) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input id="funding_goal" name="funding_goal" type="number" min="1000" step="1000"
                  required value={form.funding_goal} onChange={handleChange}
                  placeholder="250000" className="input pl-7" />
              </div>
            </div>

            <div>
              <label htmlFor="deck_url" className="label">
                Pitch Deck URL <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input id="deck_url" name="deck_url" type="url" value={form.deck_url}
                onChange={handleChange} placeholder="https://drive.google.com/…" className="input" />
            </div>

            <div>
              <label htmlFor="video_url" className="label">
                Video Pitch URL <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input id="video_url" name="video_url" type="url" value={form.video_url}
                onChange={handleChange} placeholder="https://youtube.com/…" className="input" />
            </div>

            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={loading} className="btn-gold">
                {loading ? (
                  <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg> Submitting…</>
                ) : 'Submit Pitch'}
              </button>
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>

        {/* RIGHT — Readiness Panel */}
        <div className="card shadow-sm sticky top-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-brand-800 text-base">Pitch Readiness</h2>
            <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">By LaunchingLaps</span>
          </div>
          <p className="text-xs text-gray-400 mb-5">Answer a few quick questions to check how ready your pitch is before submitting.</p>
          <PitchReadiness industry={form.industry} />
        </div>

      </div>
    </div>
  )
}
