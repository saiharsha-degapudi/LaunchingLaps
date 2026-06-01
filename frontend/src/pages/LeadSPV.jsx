import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function LeadSPV() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [pitches, setPitches] = useState([])
  const [loadingPitches, setLoadingPitches] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    pitch_id: '',
    title: '',
    description: '',
    target_amount: '',
    carry_pct: 20,
    mgmt_fee_pct: 2,
    min_check: 5000,
    deadline: '',
  })

  // Redirect non-investors away
  useEffect(() => {
    if (user && user.role !== 'investor') {
      navigate('/spvs', { replace: true })
    }
  }, [user, navigate])

  useEffect(() => {
    api.get('/pitches/')
      .then(r => setPitches(r.data))
      .catch(() => {})
      .finally(() => setLoadingPitches(false))
  }, [])

  function handlePitchChange(e) {
    const pitchId = e.target.value
    const selected = pitches.find(p => String(p.id) === String(pitchId))
    setForm(f => ({
      ...f,
      pitch_id: pitchId,
      title: selected ? `${selected.title} Syndicate I` : f.title,
    }))
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.pitch_id) { setError('Please select a pitch.'); return }
    if (!form.title.trim()) { setError('Syndicate title is required.'); return }
    if (!form.target_amount || parseFloat(form.target_amount) <= 0) { setError('Target amount must be greater than 0.'); return }

    const payload = {
      pitch_id: parseInt(form.pitch_id),
      title: form.title.trim(),
      description: form.description.trim(),
      target_amount: parseFloat(form.target_amount),
      carry_pct: parseFloat(form.carry_pct),
      mgmt_fee_pct: parseFloat(form.mgmt_fee_pct),
      min_check: parseFloat(form.min_check),
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    }

    setSubmitting(true)
    try {
      const res = await api.post('/spvs/', payload)
      navigate(`/spvs/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Failed to create syndicate. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-brand-800">Create a New Syndicate</h1>
        <p className="text-gray-500 text-sm mt-1">Pool co-investor capital and earn carried interest on returns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── FORM ── */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col gap-6">
            {/* Pitch selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Select Pitch <span className="text-red-400">*</span>
              </label>
              {loadingPitches ? (
                <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
              ) : (
                <select
                  name="pitch_id"
                  value={form.pitch_id}
                  onChange={handlePitchChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                  required
                >
                  <option value="">— Choose a pitch —</option>
                  {pitches.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} {p.stage ? `(${p.stage})` : ''}
                    </option>
                  ))}
                </select>
              )}
              {pitches.length === 0 && !loadingPitches && (
                <p className="text-xs text-gray-400 mt-1">No pitches available. Entrepreneurs must submit pitches first.</p>
              )}
            </div>

            {/* SPV Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Syndicate Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. EcoDeliver Syndicate I"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Investment Thesis</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe why you're excited about this investment and what value you bring as a lead..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              />
            </div>

            {/* Target Amount */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Target Amount (USD) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
                <input
                  type="number"
                  name="target_amount"
                  value={form.target_amount}
                  onChange={handleChange}
                  min="10000"
                  step="5000"
                  placeholder="500000"
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  required
                />
              </div>
            </div>

            {/* 3-column row: Carry / Mgmt Fee / Min Check */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Carry % (0–30)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="carry_pct"
                    value={form.carry_pct}
                    onChange={handleChange}
                    min="0"
                    max="30"
                    step="1"
                    className="w-full pr-8 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Mgmt Fee % (0–5)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="mgmt_fee_pct"
                    value={form.mgmt_fee_pct}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.5"
                    className="w-full pr-8 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Min Check (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">$</span>
                  <input
                    type="number"
                    name="min_check"
                    value={form.min_check}
                    onChange={handleChange}
                    min="1000"
                    step="1000"
                    className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Commitment Deadline</label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-800 hover:bg-brand-700 text-white font-black py-3.5 rounded-xl transition-colors disabled:opacity-50 text-sm tracking-wide"
            >
              {submitting ? 'Creating…' : 'Create Syndicate & Start Fundraising →'}
            </button>
          </form>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="flex flex-col gap-5">
          {/* What is an SPV */}
          <div className="bg-brand-800 text-white rounded-2xl p-6">
            <div className="text-3xl mb-3">🏦</div>
            <h3 className="font-black text-lg mb-3">What is a Syndicate?</h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              A syndicate is a group of investors who pool capital together to make a single investment.
              Each member commits capital, which flows through one legal vehicle into the startup.
              The founder gets one clean cap table entry instead of dozens.
            </p>
          </div>

          {/* Lead benefits */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-black text-brand-800 mb-4">Lead Investor Benefits</h3>
            <ul className="space-y-3">
              {[
                { icon: '💰', title: 'Earned Carry', desc: 'Receive a % of profits (typically 20%) when the investment exits.' },
                { icon: '🎯', title: 'Deal Flow Control', desc: 'You choose which startups to back and set the syndicate terms.' },
                { icon: '👥', title: 'Build Your Network', desc: 'Invite co-investors and grow your reputation as a deal lead.' },
                { icon: '📊', title: 'Track Record', desc: 'Build a verifiable investment history to attract future LPs.' },
              ].map(item => (
                <li key={item.title} className="flex gap-3">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-bold text-brand-800 text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Terms reminder */}
          <div className="bg-gold-50 border border-gold-200 rounded-2xl p-5">
            <h3 className="font-bold text-gold-800 text-sm mb-2">Standard Syndicate Terms</h3>
            <ul className="text-gold-700 text-xs space-y-1.5">
              <li>• Carry: 20% of profits (industry standard)</li>
              <li>• Management Fee: 2%/yr of committed capital</li>
              <li>• Min Check: $5,000–$25,000 typical</li>
              <li>• Investors join from any country</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
