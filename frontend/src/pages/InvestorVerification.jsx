import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const STEPS = [
  { id: 1, title: 'Personal Details', subtitle: 'Basic identity information' },
  { id: 2, title: 'Country & Tax', subtitle: 'Residency and tax information' },
  { id: 3, title: 'Investor Type', subtitle: 'Accreditation status' },
  { id: 4, title: 'Experience & Risk', subtitle: 'Investment background' },
  { id: 5, title: 'Risk Acknowledgment', subtitle: 'Compliance confirmation' },
]

const INVESTOR_TYPES = [
  { value: 'accredited_individual', label: 'Accredited Individual', desc: 'Net worth > ₹5 Cr or annual income > ₹50L' },
  { value: 'institutional', label: 'Institutional Investor', desc: 'Fund, bank, insurance company, or similar' },
  { value: 'family_office', label: 'Family Office', desc: 'Managing assets for a high-net-worth family' },
  { value: 'sophisticated', label: 'Sophisticated Investor', desc: 'Demonstrated knowledge and experience in finance' },
  { value: 'retail', label: 'Retail Investor', desc: 'Individual investor (limited deal access)' },
]

const EXPERIENCE_LEVELS = [
  { value: 'none', label: 'No experience' },
  { value: 'beginner', label: '1–2 investments' },
  { value: 'intermediate', label: '3–10 investments' },
  { value: 'experienced', label: '10+ investments' },
  { value: 'professional', label: 'Professional / full-time investor' },
]

export default function InvestorVerification() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    pan_number: '',
    date_of_birth: '',
    phone: '',
    country_of_residence: 'India',
    tax_residency: 'India',
    tax_id: '',
    investor_type: '',
    source_of_funds: '',
    net_worth_range: '',
    annual_income_range: '',
    investment_experience: '',
    preferred_sectors: [],
    preferred_stages: [],
    min_ticket_size: '',
    max_ticket_size: '',
    risk_tolerance: '',
    ack_no_guarantees: false,
    ack_own_assessment: false,
    ack_jurisdiction: false,
    ack_data_consent: false,
  })

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function toggleArray(field, value) {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter(v => v !== value)
        : [...f[field], value],
    }))
  }

  function canProceed() {
    if (step === 1) return form.full_name && form.pan_number && form.date_of_birth && form.phone
    if (step === 2) return form.country_of_residence && form.tax_residency
    if (step === 3) return form.investor_type && form.source_of_funds
    if (step === 4) return form.investment_experience && form.risk_tolerance
    if (step === 5) return form.ack_no_guarantees && form.ack_own_assessment && form.ack_jurisdiction && form.ack_data_consent
    return true
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    try {
      await api.post('/investors/verification/', form)
      navigate('/dashboard')
    } catch (e) {
      setError(e.response?.data?.detail || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const pct = Math.round((step / STEPS.length) * 100)

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Investor Verification</p>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1">Complete your verification</h1>
          <p className="text-sm text-zinc-500">Required to access approved deals and investment opportunities.</p>
        </div>

        {/* Step progress */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500">Step {step} of {STEPS.length}</span>
            <span className="text-xs font-medium text-zinc-900">{pct}% complete</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex gap-2">
            {STEPS.map(s => (
              <div key={s.id} className="flex-1">
                <div className={`h-1 rounded-full transition-colors duration-300 ${
                  s.id < step ? 'bg-blue-600' : s.id === step ? 'bg-blue-400' : 'bg-zinc-100'
                }`} />
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm font-medium text-zinc-900">{STEPS[step - 1].title}</p>
          <p className="text-xs text-zinc-500">{STEPS[step - 1].subtitle}</p>
        </div>

        {/* Step content */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6">

          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="label">Full Legal Name</label>
                <input className="input" value={form.full_name}
                  onChange={e => set('full_name', e.target.value)}
                  placeholder="As on government ID" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">PAN Number</label>
                  <input className="input" value={form.pan_number}
                    onChange={e => set('pan_number', e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F" maxLength={10} />
                </div>
                <div>
                  <label className="label">Date of Birth</label>
                  <input className="input" type="date" value={form.date_of_birth}
                    onChange={e => set('date_of_birth', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input className="input" value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="+91 98765 43210" />
              </div>
            </div>
          )}

          {/* STEP 2: Country & Tax */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="label">Country of Residence</label>
                <select className="input" value={form.country_of_residence}
                  onChange={e => set('country_of_residence', e.target.value)}>
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Singapore</option>
                  <option>UAE</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="label">Tax Residency</label>
                <select className="input" value={form.tax_residency}
                  onChange={e => set('tax_residency', e.target.value)}>
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Singapore</option>
                  <option>UAE</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="label">Tax ID / Aadhaar (optional)</label>
                <input className="input" value={form.tax_id}
                  onChange={e => set('tax_id', e.target.value)}
                  placeholder="For compliance records" />
              </div>
            </div>
          )}

          {/* STEP 3: Investor Type */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="label mb-3">Investor Type</label>
                <div className="space-y-2">
                  {INVESTOR_TYPES.map(t => (
                    <label key={t.value}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                        form.investor_type === t.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}>
                      <input type="radio" name="investor_type" value={t.value}
                        checked={form.investor_type === t.value}
                        onChange={e => set('investor_type', e.target.value)}
                        className="mt-0.5 accent-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{t.label}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{t.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Source of Funds</label>
                <select className="input" value={form.source_of_funds}
                  onChange={e => set('source_of_funds', e.target.value)}>
                  <option value="">Select source</option>
                  <option>Employment / Salary</option>
                  <option>Business Income</option>
                  <option>Investment Returns</option>
                  <option>Inheritance / Gift</option>
                  <option>Sale of Assets</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Net Worth Range</label>
                  <select className="input" value={form.net_worth_range}
                    onChange={e => set('net_worth_range', e.target.value)}>
                    <option value="">Select range</option>
                    <option>Below ₹1 Cr</option>
                    <option>₹1–5 Cr</option>
                    <option>₹5–25 Cr</option>
                    <option>₹25–100 Cr</option>
                    <option>Above ₹100 Cr</option>
                  </select>
                </div>
                <div>
                  <label className="label">Annual Income Range</label>
                  <select className="input" value={form.annual_income_range}
                    onChange={e => set('annual_income_range', e.target.value)}>
                    <option value="">Select range</option>
                    <option>Below ₹25L</option>
                    <option>₹25–50L</option>
                    <option>₹50L–1 Cr</option>
                    <option>₹1–5 Cr</option>
                    <option>Above ₹5 Cr</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Experience & Preferences */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <label className="label">Investment Experience</label>
                <div className="space-y-2 mt-1">
                  {EXPERIENCE_LEVELS.map(e => (
                    <label key={e.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        form.investment_experience === e.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}>
                      <input type="radio" name="experience" value={e.value}
                        checked={form.investment_experience === e.value}
                        onChange={ev => set('investment_experience', ev.target.value)}
                        className="accent-blue-600" />
                      <span className="text-sm text-zinc-900">{e.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Preferred Sectors (select all that apply)</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['Technology', 'FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'CleanTech', 'SaaS', 'Logistics', 'Consumer', 'Other'].map(s => (
                    <button key={s} type="button"
                      onClick={() => toggleArray('preferred_sectors', s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        form.preferred_sectors.includes(s)
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Preferred Stages</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['Idea', 'Pre-Seed', 'Seed', 'Series A', 'Growth', 'Any'].map(s => (
                    <button key={s} type="button"
                      onClick={() => toggleArray('preferred_stages', s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        form.preferred_stages.includes(s)
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Min Ticket Size</label>
                  <select className="input" value={form.min_ticket_size}
                    onChange={e => set('min_ticket_size', e.target.value)}>
                    <option value="">Select</option>
                    <option>₹5L</option><option>₹10L</option><option>₹25L</option>
                    <option>₹50L</option><option>₹1 Cr+</option>
                  </select>
                </div>
                <div>
                  <label className="label">Risk Tolerance</label>
                  <select className="input" value={form.risk_tolerance}
                    onChange={e => set('risk_tolerance', e.target.value)}>
                    <option value="">Select</option>
                    <option>Low — capital preservation</option>
                    <option>Medium — balanced growth</option>
                    <option>High — growth-oriented</option>
                    <option>Very High — venture risk</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Risk Acknowledgment */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-2">
                <p className="text-xs font-semibold text-amber-800 mb-1">Important Disclosure</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Startup investments are high-risk, illiquid, and speculative. You may lose your entire investment.
                  Audit approval does not guarantee business success or investment returns.
                  Past performance is not indicative of future results.
                </p>
              </div>
              {[
                { key: 'ack_no_guarantees', text: 'I understand that there are no guaranteed returns and that I may lose all capital invested in startups.' },
                { key: 'ack_own_assessment', text: 'I confirm that I will conduct my own due diligence and assessment before making any investment decision.' },
                { key: 'ack_jurisdiction', text: 'I confirm that I am legally eligible to invest in private companies in my jurisdiction and that I meet the investor eligibility requirements.' },
                { key: 'ack_data_consent', text: 'I consent to my KYC data being securely stored and used for compliance and eligibility verification purposes.' },
              ].map(({ key, text }) => (
                <label key={key}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    form[key] ? 'border-blue-300 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300'
                  }`}>
                  <input type="checkbox" checked={form[key]}
                    onChange={e => set(key, e.target.checked)}
                    className="mt-0.5 accent-blue-600 w-4 h-4 flex-shrink-0" />
                  <p className="text-sm text-zinc-700 leading-relaxed">{text}</p>
                </label>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/dashboard')}
            className="btn-secondary">
            {step === 1 ? 'Back to Dashboard' : 'Previous'}
          </button>

          {step < STEPS.length ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="btn-primary">
              Continue
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || submitting}
              className="btn-accent">
              {submitting ? 'Submitting...' : 'Submit Verification'}
            </button>
          )}
        </div>

        <p className="text-center text-xs text-zinc-400 mt-4">
          Your information is encrypted and used only for compliance verification.
        </p>
      </div>
    </div>
  )
}
