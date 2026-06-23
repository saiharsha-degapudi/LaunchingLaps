import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import IdeaAuditInline from '../components/IdeaAuditInline'
import BudgetPlannerInline from '../components/BudgetPlannerInline'

const INDUSTRIES = [
  'Technology',
  'FinTech',
  'HealthTech',
  'EdTech',
  'AgriTech',
  'CleanTech',
  'E-commerce',
  'SaaS',
  'Real Estate',
  'Consumer Goods',
  'Media & Entertainment',
  'Logistics',
  'Other',
]

export default function SubmitPitch() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [showAudit, setShowAudit] = useState(false)
  const [showBudget, setShowBudget] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    industry: '',
    funding_goal: '',
    stage: 'idea',
    deck_url: '',
    video_url: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Redirect non-entrepreneurs
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
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.industry) {
      setError('Please select an industry.')
      return
    }
    const goal = parseFloat(form.funding_goal)
    if (!goal || goal <= 0) {
      setError('Funding goal must be a positive number.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const payload = {
        title: form.title,
        description: form.description,
        industry: form.industry,
        funding_goal: goal,
        stage: form.stage,
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
          <p className="text-gray-500 text-sm">Redirecting to your pitch…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="section-title text-3xl">Submit Your Pitch</h1>
        <p className="text-gray-500 text-sm mt-1">
          Fill in the details below to present your startup to US investors.
        </p>
      </div>

      {/* Optional pre-submission tools */}
      <div className="flex flex-col gap-3 mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">LaunchingLaps Audit Tools — Optional but recommended</p>

        {/* Idea Audit */}
        <div className="border border-indigo-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowAudit(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🎯</span>
              <div className="text-left">
                <div className="font-semibold text-indigo-800 text-sm">Idea Audit Score</div>
                <div className="text-xs text-indigo-500">Score your idea across 10 dimensions before submitting</div>
              </div>
            </div>
            <span className="text-indigo-400 text-lg">{showAudit ? '▲' : '▼'}</span>
          </button>
          {showAudit && <div className="p-4 bg-white"><IdeaAuditInline /></div>}
        </div>

        {/* Budget Planner */}
        <div className="border border-emerald-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowBudget(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📊</span>
              <div className="text-left">
                <div className="font-semibold text-emerald-800 text-sm">Budget Planner</div>
                <div className="text-xs text-emerald-500">Calculate burn rate & runway to justify your funding goal</div>
              </div>
            </div>
            <span className="text-emerald-400 text-lg">{showBudget ? '▲' : '▼'}</span>
          </button>
          {showBudget && <div className="p-4 bg-white"><BudgetPlannerInline /></div>}
        </div>
      </div>

      <div className="card shadow-sm">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="title" className="label">Pitch Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. AI-powered supply chain for emerging markets"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="description" className="label">Description *</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              required
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your startup, the problem you're solving, your solution, and traction so far…"
              className="input resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="industry" className="label">Industry *</label>
              <select
                id="industry"
                name="industry"
                required
                value={form.industry}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select industry…</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="stage" className="label">Stage *</label>
              <select
                id="stage"
                name="stage"
                required
                value={form.stage}
                onChange={handleChange}
                className="input"
              >
                <option value="idea">Idea</option>
                <option value="seed">Seed</option>
                <option value="growth">Growth</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="funding_goal" className="label">Funding Goal (USD) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">$</span>
              <input
                id="funding_goal"
                name="funding_goal"
                type="number"
                min="1000"
                step="1000"
                required
                value={form.funding_goal}
                onChange={handleChange}
                placeholder="250000"
                className="input pl-7"
              />
            </div>
          </div>

          <div>
            <label htmlFor="deck_url" className="label">
              Pitch Deck URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="deck_url"
              name="deck_url"
              type="url"
              value={form.deck_url}
              onChange={handleChange}
              placeholder="https://drive.google.com/…"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="video_url" className="label">
              Video Pitch URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="video_url"
              name="video_url"
              type="url"
              value={form.video_url}
              onChange={handleChange}
              placeholder="https://youtube.com/…"
              className="input"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-gold">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting…
                </>
              ) : (
                'Submit Pitch'
              )}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
