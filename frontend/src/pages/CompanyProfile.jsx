import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { useScrollReveal, MeshGradient } from '../utils/design'

const STAGES = ['Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B', 'Growth']
const INDUSTRIES = ['Fintech', 'SaaS', 'Healthcare', 'Edtech', 'E-commerce', 'AgriTech', 'CleanTech', 'DeepTech', 'Consumer', 'B2B', 'Other']
const JURISDICTIONS = ['India', 'Singapore', 'UAE', 'USA', 'UK', 'Other']
const ENTITY_TYPES = ['Private Limited', 'LLP', 'OPC', 'Partnership', 'Sole Proprietorship', 'Public Limited']

function SaveBar({ saving, saved, onSave, error }) {
  return (
    <div className="flex items-center gap-3 pt-5 border-t border-zinc-100 mt-6">
      <button onClick={onSave} disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
      {saved && (
        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Saved
        </span>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-5">
      <h2 className="text-sm font-semibold text-zinc-900 pb-3 border-b border-zinc-100">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, sub, children, half }) {
  return (
    <div className={half ? '' : ''}>
      <label className="block text-xs font-medium text-zinc-700 mb-1">{label}</label>
      {sub && <p className="text-xs text-zinc-400 mb-1.5">{sub}</p>}
      {children}
    </div>
  )
}

export default function CompanyProfile() {
  useScrollReveal()
  const { user } = useAuth()

  const [form, setForm] = useState({
    company_name:       '',
    tagline:            '',
    entity_type:        'Private Limited',
    registration_number:'',
    incorporation_date: '',
    jurisdiction:       'India',
    registered_address: '',
    website:            '',
    stage:              'Seed',
    industry:           'SaaS',
    description:        '',
    problem:            '',
    solution:           '',
    target_market:      '',
    usp:                '',
  })

  const [founders, setFounders] = useState([
    { name: '', title: '', bio: '', linkedin: '', equity_pct: '' }
  ])

  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/company-profile/')
      .then(r => {
        if (r.data) {
          setForm(f => ({ ...f, ...r.data }))
          if (Array.isArray(r.data.founders) && r.data.founders.length > 0) {
            setFounders(r.data.founders)
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function setFounder(idx, k, v) {
    setFounders(prev => prev.map((f, i) => i === idx ? { ...f, [k]: v } : f))
  }

  function addFounder() {
    setFounders(prev => [...prev, { name: '', title: '', bio: '', linkedin: '', equity_pct: '' }])
  }

  function removeFounder(idx) {
    setFounders(prev => prev.filter((_, i) => i !== idx))
  }

  async function save() {
    setSaving(true); setSaved(false); setError('')
    try {
      await api.post('/company-profile/', { ...form, founders })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to save. Please try again.')
    } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="relative mb-8">
          <MeshGradient />
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Entrepreneur</p>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Company Profile</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Your company profile is shown to verified investors alongside your pitch. Keep it accurate and complete.
          </p>
        </div>

        <div className="space-y-5">

          {/* Registration */}
          <Section title="Legal Registration">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Company Name">
                <input className="input" value={form.company_name}
                  onChange={e => set('company_name', e.target.value)} placeholder="Acme Private Limited" />
              </Field>
              <Field label="Tagline">
                <input className="input" value={form.tagline}
                  onChange={e => set('tagline', e.target.value)} placeholder="One-line description" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Entity Type">
                <select className="input" value={form.entity_type} onChange={e => set('entity_type', e.target.value)}>
                  {ENTITY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Jurisdiction">
                <select className="input" value={form.jurisdiction} onChange={e => set('jurisdiction', e.target.value)}>
                  {JURISDICTIONS.map(j => <option key={j}>{j}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Registration / CIN Number">
                <input className="input" value={form.registration_number}
                  onChange={e => set('registration_number', e.target.value)} placeholder="U12345MH2022PTC000000" />
              </Field>
              <Field label="Incorporation Date">
                <input className="input" type="date" value={form.incorporation_date}
                  onChange={e => set('incorporation_date', e.target.value)} />
              </Field>
            </div>
            <Field label="Registered Address">
              <textarea className="input resize-none" rows={2} value={form.registered_address}
                onChange={e => set('registered_address', e.target.value)}
                placeholder="Full registered office address" />
            </Field>
            <Field label="Website">
              <input className="input" value={form.website}
                onChange={e => set('website', e.target.value)} placeholder="https://yourcompany.com" />
            </Field>
          </Section>

          {/* Business */}
          <Section title="Business Overview">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Stage">
                <select className="input" value={form.stage} onChange={e => set('stage', e.target.value)}>
                  {STAGES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Industry">
                <select className="input" value={form.industry} onChange={e => set('industry', e.target.value)}>
                  {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Company Description" sub="Shown publicly to investors — 2–4 sentences">
              <textarea className="input resize-none" rows={3} value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Brief description of what your company does..." />
            </Field>
            <Field label="Problem Statement">
              <textarea className="input resize-none" rows={2} value={form.problem}
                onChange={e => set('problem', e.target.value)}
                placeholder="What problem are you solving?" />
            </Field>
            <Field label="Solution">
              <textarea className="input resize-none" rows={2} value={form.solution}
                onChange={e => set('solution', e.target.value)}
                placeholder="How does your product/service solve it?" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Target Market">
                <input className="input" value={form.target_market}
                  onChange={e => set('target_market', e.target.value)} placeholder="e.g. SMBs in India" />
              </Field>
              <Field label="Unique Selling Point">
                <input className="input" value={form.usp}
                  onChange={e => set('usp', e.target.value)} placeholder="What makes you different?" />
              </Field>
            </div>
          </Section>

          {/* Founders */}
          <Section title="Founders & Team">
            <div className="space-y-6">
              {founders.map((f, idx) => (
                <div key={idx} className="relative border border-zinc-100 rounded-xl p-4 bg-zinc-50">
                  {founders.length > 1 && (
                    <button onClick={() => removeFounder(idx)}
                      className="absolute top-3 right-3 text-zinc-300 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    {idx === 0 ? 'Primary Founder' : `Co-Founder ${idx + 1}`}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <Field label="Full Name">
                      <input className="input" value={f.name}
                        onChange={e => setFounder(idx, 'name', e.target.value)} placeholder="Jane Doe" />
                    </Field>
                    <Field label="Title / Role">
                      <input className="input" value={f.title}
                        onChange={e => setFounder(idx, 'title', e.target.value)} placeholder="CEO & Co-Founder" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <Field label="LinkedIn URL">
                      <input className="input" value={f.linkedin}
                        onChange={e => setFounder(idx, 'linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
                    </Field>
                    <Field label="Equity %">
                      <input className="input" type="number" min="0" max="100" value={f.equity_pct}
                        onChange={e => setFounder(idx, 'equity_pct', e.target.value)} placeholder="50" />
                    </Field>
                  </div>
                  <Field label="Bio">
                    <textarea className="input resize-none" rows={2} value={f.bio}
                      onChange={e => setFounder(idx, 'bio', e.target.value)}
                      placeholder="Background, experience, why you're building this..." />
                  </Field>
                </div>
              ))}
            </div>
            <button onClick={addFounder}
              className="mt-2 flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Co-Founder
            </button>
          </Section>

          <SaveBar saving={saving} saved={saved} error={error} onSave={save} />
        </div>
      </div>
    </div>
  )
}
