import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const UPDATE_TYPES = ['Monthly Update', 'Quarterly Update', 'Milestone', 'Product Update', 'Financial Update', 'Risk / Problem']

function UpdateCard({ update }) {
  const date = new Date(update.created_at || Date.now())
  const label = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="badge-blue text-[11px]">{update.update_type || 'Update'}</span>
          <span className="text-xs text-zinc-400">{label}</span>
        </div>
      </div>
      <h3 className="font-semibold text-zinc-900 text-sm mb-2">{update.title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed mb-4">{update.content}</p>

      {/* KPIs */}
      {(update.revenue || update.kpi_name) && (
        <div className="grid grid-cols-2 gap-3">
          {update.revenue && (
            <div className="bg-zinc-50 rounded-lg p-3">
              <p className="text-[10px] text-zinc-400 uppercase tracking-wide mb-0.5">Revenue</p>
              <p className="text-sm font-semibold text-zinc-900">
                ₹{Number(update.revenue).toLocaleString('en-IN')}
              </p>
            </div>
          )}
          {update.kpi_name && (
            <div className="bg-zinc-50 rounded-lg p-3">
              <p className="text-[10px] text-zinc-400 uppercase tracking-wide mb-0.5">{update.kpi_name}</p>
              <p className="text-sm font-semibold text-zinc-900">{update.kpi_value}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function NewUpdateForm({ pitchId, onSuccess }) {
  const [form, setForm] = useState({
    update_type: 'Monthly Update',
    title: '',
    content: '',
    revenue: '',
    kpi_name: '',
    kpi_value: '',
    use_of_funds: '',
    milestones: '',
    risks: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title || !form.content) { setError('Title and update content are required.'); return }
    setSubmitting(true)
    setError('')
    try {
      const payload = { ...form, pitch_id: pitchId }
      const res = await api.post('/founder-updates/', payload)
      onSuccess(res.data)
      setForm({ update_type: 'Monthly Update', title: '', content: '', revenue: '', kpi_name: '', kpi_value: '', use_of_funds: '', milestones: '', risks: '' })
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to post update.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-xl p-6 mb-6">
      <h2 className="text-base font-semibold text-zinc-900 mb-4">Post a New Update</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Update Type</label>
            <select className="input" value={form.update_type} onChange={e => set('update_type', e.target.value)}>
              {UPDATE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Q2 2025 Update" />
          </div>
        </div>

        <div>
          <label className="label">Update Content</label>
          <textarea className="input min-h-[120px] resize-none" value={form.content}
            onChange={e => set('content', e.target.value)}
            placeholder="Share progress, highlights, and what you are working on..." />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Revenue (INR, optional)</label>
            <input className="input" type="number" value={form.revenue}
              onChange={e => set('revenue', e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className="label">Key Metric</label>
            <input className="input" value={form.kpi_name}
              onChange={e => set('kpi_name', e.target.value)} placeholder="e.g. Active Users" />
          </div>
          <div>
            <label className="label">Metric Value</label>
            <input className="input" value={form.kpi_value}
              onChange={e => set('kpi_value', e.target.value)} placeholder="e.g. 1,200" />
          </div>
        </div>

        <div>
          <label className="label">Use of Funds (optional)</label>
          <input className="input" value={form.use_of_funds}
            onChange={e => set('use_of_funds', e.target.value)}
            placeholder="How are you deploying the capital raised?" />
        </div>

        <div>
          <label className="label">Milestones Achieved (optional)</label>
          <textarea className="input resize-none" rows={2} value={form.milestones}
            onChange={e => set('milestones', e.target.value)}
            placeholder="Key milestones since last update..." />
        </div>

        <div>
          <label className="label">Risks or Problems (optional)</label>
          <textarea className="input resize-none" rows={2} value={form.risks}
            onChange={e => set('risks', e.target.value)}
            placeholder="Be transparent with investors about challenges..." />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Posting...' : 'Post Update'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default function FounderUpdates() {
  const { user } = useAuth()
  const [updates, setUpdates] = useState([])
  const [pitchId, setPitchId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const pitchRes = await api.get('/pitches/my/')
        const myPitch = Array.isArray(pitchRes.data) ? pitchRes.data[0] : pitchRes.data
        if (myPitch?.id) {
          setPitchId(myPitch.id)
          const updRes = await api.get(`/founder-updates/?pitch_id=${myPitch.id}`)
          setUpdates(Array.isArray(updRes.data) ? updRes.data : [])
        }
      } catch {
        setUpdates([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function handleNewUpdate(update) {
    setUpdates(prev => [update, ...prev])
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="mb-8">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Founder</p>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Investor Updates</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Keep your investors informed with regular progress updates. Transparent founders build stronger investor relationships.
          </p>
        </div>

        {/* Best practices reminder */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
          <p className="text-xs font-semibold text-blue-800 mb-1">Best Practice</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Send monthly or quarterly updates. Share revenue numbers, key metrics, milestones, use of funds, and challenges honestly. Investors who feel informed are more likely to support follow-on rounds.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {pitchId ? (
              <NewUpdateForm pitchId={pitchId} onSuccess={handleNewUpdate} />
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
                <p className="text-sm font-medium text-amber-800">No pitch found.</p>
                <p className="text-xs text-amber-700 mt-1">Submit a pitch first before posting investor updates.</p>
              </div>
            )}

            {updates.length > 0 ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-sm font-semibold text-zinc-900">Previous Updates</h2>
                  <div className="flex-1 h-px bg-zinc-100" />
                  <span className="text-xs text-zinc-400">{updates.length} posted</span>
                </div>
                <div className="space-y-4">
                  {updates.map((u, i) => <UpdateCard key={u.id ?? i} update={u} />)}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-zinc-500">No updates posted yet.</p>
                <p className="text-xs text-zinc-400 mt-1">Your first update will appear here after posting.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
