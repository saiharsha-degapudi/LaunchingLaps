import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import PitchReadiness from '../components/PitchReadiness'
import { useScrollReveal } from '../utils/design'

const STAGES = [
  { value: 'validation', label: 'Validation', desc: 'Problem research, no product yet' },
  { value: 'idea',       label: 'Idea',       desc: 'Concept defined, pre-MVP' },
  { value: 'pre_seed',   label: 'Pre-Seed',   desc: 'MVP in development, pre-launch' },
  { value: 'seed',       label: 'Seed',       desc: 'MVP live, early customers' },
  { value: 'series_a',   label: 'Series A',   desc: 'Revenue traction, scaling GTM' },
  { value: 'growth',     label: 'Growth',     desc: 'Established, high-growth phase' },
]

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
    descriptionTemplate: `Problem: [Environmental challenge — emissions, waste, energy access]\n\nSolution: [Your clean technology — solar, EV, carbon capture, recycling, etc.]\n\nTraction: [Units deployed, carbon offset, revenue, partnerships]\n\nAsk: $1.5M for [pilot scaling / manufacturing / regulatory approvals]\n\nImpact: [CO2 reduced per year, energy generated, communities served]`,
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
  useScrollReveal()

  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [form, setForm] = useState({
    title: '', industry: '', description: '',
    funding_goal: '', stage: 'idea', deck_url: '', video_url: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loadingPitch, setLoadingPitch] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    api.get(`/pitches/${id}`).then(({ data }) => {
      setForm({
        title: data.title || '',
        industry: data.industry || '',
        description: data.description || '',
        funding_goal: data.funding_goal != null ? String(data.funding_goal) : '',
        stage: data.stage || 'idea',
        deck_url: data.deck_url || '',
        video_url: data.video_url || '',
      })
    }).catch(() => {
      setError('Could not load pitch. It may not exist or you may not have access.')
    }).finally(() => setLoadingPitch(false))
  }, [id, isEdit])

  if (loadingPitch) {
    return (
      <div className="bg-zinc-50 min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user?.role !== 'entrepreneur') {
    return (
      <div className="bg-zinc-50 min-h-screen flex items-center justify-center px-6">
        <div className="bg-white border border-zinc-200 rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-zinc-900 font-semibold text-base mb-2">Access Restricted</p>
          <p className="text-zinc-500 text-sm">Only entrepreneurs can submit pitches.</p>
        </div>
      </div>
    )
  }

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'industry' && value && INDUSTRY_DEFAULTS[value]) {
      const defaults = INDUSTRY_DEFAULTS[value]
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
      const { data } = isEdit
        ? await api.put(`/pitches/${id}`, payload)
        : await api.post('/pitches/', payload)
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
      <div className="bg-zinc-50 min-h-screen flex items-center justify-center px-6">
        <div className="bg-white border border-zinc-200 rounded-xl p-10 max-w-md w-full text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">{isEdit ? 'Pitch Updated' : 'Pitch Submitted'}</h2>
            <p className="text-sm text-zinc-500 mt-1">{isEdit ? 'Your pitch details have been saved.' : 'Our audit team will review your pitch within 24–48 hours.'}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
            Under Review
          </span>
          <p className="text-xs text-zinc-400">Redirecting you to your pitch...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Page header */}
        <div className="mb-8 reveal">
          <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md mb-3">
            Entrepreneur Portal
          </span>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{isEdit ? 'Edit Your Pitch' : 'Submit Your Pitch'}</h1>
          <p className="text-sm text-zinc-500 mt-1.5">{isEdit ? 'Update your pitch details. Changes are saved immediately.' : 'Tell us about your startup. Our audit team reviews within 24–48 hours.'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT — Single-page form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">

                {error && (
                  <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-xs font-medium text-zinc-500 mb-1.5">
                      Pitch Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="title" name="title" type="text" required
                      value={form.title} onChange={handleChange}
                      placeholder="e.g. AI-powered supply chain for emerging markets"
                      className="input"
                    />
                  </div>

                  {/* Industry — BEFORE description */}
                  <div>
                    <label htmlFor="industry" className="block text-xs font-medium text-zinc-500 mb-1.5">
                      Industry <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="industry" name="industry" required
                      value={form.industry} onChange={handleChange}
                      className="input"
                    >
                      <option value="">Select an industry…</option>
                      {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                    {form.industry && INDUSTRY_DEFAULTS[form.industry] && (
                      <p className="text-xs text-blue-600 mt-1.5 font-medium">
                        💡 {INDUSTRY_DEFAULTS[form.industry].hint}
                      </p>
                    )}
                  </div>

                  {/* Description — auto-filled by industry */}
                  <div>
                    <label htmlFor="description" className="block text-xs font-medium text-zinc-500 mb-1.5">
                      Description <span className="text-red-400">*</span>
                      {!form.industry && <span className="text-zinc-400 font-normal ml-1">(select an industry above to pre-fill a template)</span>}
                    </label>
                    <textarea
                      id="description" name="description" rows={9} required
                      value={form.description} onChange={handleChange}
                      placeholder="Describe the problem you're solving, your solution, and any traction so far..."
                      className="input resize-none font-mono text-xs"
                    />
                  </div>

                  {/* Stage + Funding Goal */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="stage" className="block text-xs font-medium text-zinc-500 mb-1.5">
                        Stage <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="stage" name="stage" required
                        value={form.stage} onChange={handleChange}
                        className="input"
                      >
                        {STAGES.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="funding_goal" className="block text-xs font-medium text-zinc-500 mb-1.5">
                        Funding Goal (USD) <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">$</span>
                        <input
                          id="funding_goal" name="funding_goal" type="number" min="1000" step="1000"
                          required value={form.funding_goal} onChange={handleChange}
                          placeholder="250000"
                          className="input pl-7"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stage cards */}
                  <div className="grid grid-cols-3 gap-2">
                    {STAGES.map(s => (
                      <button
                        key={s.value} type="button"
                        onClick={() => setForm(prev => ({ ...prev, stage: s.value }))}
                        className={`text-left p-3 rounded-lg border transition-all ${
                          form.stage === s.value ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 bg-white hover:border-zinc-300'
                        }`}
                      >
                        <p className={`text-xs font-semibold ${form.stage === s.value ? 'text-blue-600' : 'text-zinc-700'}`}>{s.label}</p>
                        <p className="text-xs text-zinc-400 mt-0.5 leading-snug">{s.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Optional media */}
                  <div className="border-t border-zinc-100 pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Optional Media</span>
                      <span className="h-px flex-1 bg-zinc-100" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="deck_url" className="block text-xs font-medium text-zinc-500 mb-1.5">
                          Pitch Deck URL
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </span>
                          <input
                            id="deck_url" name="deck_url" type="url"
                            value={form.deck_url} onChange={handleChange}
                            placeholder="https://drive.google.com/..."
                            className="input pl-9"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="video_url" className="block text-xs font-medium text-zinc-500 mb-1.5">
                          Video Pitch URL
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M4 8a2 2 0 012-2h9a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
                            </svg>
                          </span>
                          <input
                            id="video_url" name="video_url" type="url"
                            value={form.video_url} onChange={handleChange}
                            placeholder="https://youtube.com/..."
                            className="input pl-9"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2 border-t border-zinc-100">
                    <button
                      type="submit" disabled={loading}
                      className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          {isEdit ? 'Save Changes' : 'Submit Pitch'}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </>
                      )}
                    </button>
                    <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
            </div>
          </div>

          {/* RIGHT — Pitch Readiness panel */}
          <div className="reveal bg-white border border-zinc-200 rounded-xl p-5 sticky top-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold text-zinc-900">Pitch Readiness</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                By LaunchingLaps
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-5">
              Answer a few quick questions to check how ready your pitch is before submitting.
            </p>
            <PitchReadiness industry={form.industry} />
          </div>

        </div>
      </div>
    </div>
  )
}
