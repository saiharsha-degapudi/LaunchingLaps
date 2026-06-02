import { useEffect, useState } from 'react'
import api from '../api/axios'
import PitchCard from '../components/PitchCard'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const INDUSTRIES = [
  'All', 'Technology', 'FinTech', 'HealthTech', 'EdTech',
  'AgriTech', 'CleanTech', 'SaaS', 'Logistics', 'Cybersecurity', 'Other',
]
const STAGES = ['All', 'idea', 'seed', 'growth']

// ── Investor: browse all pitches ──────────────────────────────────────────────
function InvestorPitches() {
  const [pitches, setPitches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('All')
  const [stage, setStage] = useState('All')

  useEffect(() => {
    async function fetchPitches() {
      setLoading(true)
      setError('')
      try {
        const params = {}
        if (industry !== 'All') params.industry = industry
        if (stage !== 'All') params.stage = stage
        const { data } = await api.get('/pitches/', { params })
        setPitches(data)
      } catch {
        setError('Failed to load pitches. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchPitches()
  }, [industry, stage])

  const filtered = pitches.filter(p =>
    search === '' ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.owner?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-brand-900 rounded-2xl p-7 mb-8 text-white">
        <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-2">Deal Flow</p>
        <h1 className="text-3xl font-black mb-1">Active Investment Pitches</h1>
        <p className="text-gray-300 text-sm">
          {pitches.length} startups currently seeking funding — from idea stage to growth.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 flex flex-col sm:flex-row gap-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, industry, or founder..." className="input flex-1" />
        <select value={industry} onChange={e => setIndustry(e.target.value)} className="input sm:w-48">
          {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind === 'All' ? 'All Industries' : ind}</option>)}
        </select>
        <select value={stage} onChange={e => setStage(e.target.value)} className="input sm:w-40">
          {STAGES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Stages' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="card text-center py-12">
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-4">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 font-medium">No pitches match your filters</p>
          <p className="text-gray-400 text-sm mt-1">Try broadening your search or clearing filters.</p>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-4">
            <span className="font-semibold text-brand-800">{filtered.length}</span> pitch{filtered.length !== 1 ? 'es' : ''} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(pitch => <PitchCard key={pitch.id} pitch={pitch} />)}
          </div>

          {/* Investor action strip */}
          <div className="mt-10 bg-gradient-to-r from-gold-500 to-yellow-400 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <p className="text-white font-black text-lg">Ready to lead a syndicate?</p>
              <p className="text-yellow-100 text-sm">Pool capital from co-investors and earn carried interest on returns.</p>
            </div>
            <Link to="/lead-spv" className="flex-shrink-0 bg-brand-800 hover:bg-brand-700 text-white font-black px-6 py-3 rounded-xl transition whitespace-nowrap shadow">
              + Create Syndicate
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

// ── Entrepreneur: manage own pitches ─────────────────────────────────────────
function EntrepreneurPitches() {
  const { user } = useAuth()
  const [pitches, setPitches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [allPitches, setAllPitches] = useState([])

  useEffect(() => {
    async function fetchMyPitches() {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/pitches/')
        setAllPitches(data)
        // Filter to only logged-in entrepreneur's pitches
        const mine = data.filter(p => p.owner_id === user?.id)
        setPitches(mine)
      } catch {
        setError('Failed to load pitches.')
      } finally {
        setLoading(false)
      }
    }
    fetchMyPitches()
  }, [user?.id])

  // Other active pitches for inspiration
  const otherPitches = allPitches.filter(p => p.owner_id !== user?.id).slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-800 to-brand-900 rounded-2xl p-7 mb-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-2">Your Pitches</p>
          <h1 className="text-3xl font-black mb-1">Manage Your Pitches</h1>
          <p className="text-blue-200 text-sm">
            Track investor interest and manage your startup pitches on LaunchingLaps.
          </p>
        </div>
        <Link to="/submit-pitch"
          className="flex-shrink-0 bg-gradient-to-r from-gold-500 to-yellow-400 hover:from-gold-600 hover:to-yellow-500 text-white font-black px-6 py-3 rounded-xl transition-all shadow-lg hover:scale-105 whitespace-nowrap">
          + Submit New Pitch
        </Link>
      </div>

      {/* My Pitches */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="card text-center py-12">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      ) : pitches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-brand-200 p-10 text-center mb-10">
          <div className="text-5xl mb-4">🚀</div>
          <h3 className="text-xl font-black text-brand-800 mb-2">No pitches yet</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            Submit your first pitch to start connecting with global investors. It takes less than 5 minutes.
          </p>
          <Link to="/submit-pitch" className="inline-block bg-brand-800 hover:bg-brand-700 text-white font-black px-8 py-3 rounded-xl transition-all shadow-lg">
            Submit Your First Pitch →
          </Link>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-black text-brand-800 mb-4">
            Your Active Pitches <span className="text-gray-400 font-normal text-base">({pitches.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {pitches.map(pitch => <EntrepreneurPitchCard key={pitch.id} pitch={pitch} />)}
          </div>
        </>
      )}

      {/* Inspiration: See what others are raising */}
      {otherPitches.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-brand-800">See What Other Founders Are Raising</h2>
            <Link to="/investors" className="text-brand-700 text-sm font-semibold hover:underline">Browse investors →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherPitches.map(pitch => <PitchCard key={pitch.id} pitch={pitch} />)}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-gold-500 to-yellow-400 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div>
          <p className="text-white font-black text-lg">Get your pitch in front of the right investors</p>
          <p className="text-yellow-100 text-sm">Browse 4+ verified global investors and find the perfect match for your startup.</p>
        </div>
        <Link to="/investors" className="flex-shrink-0 bg-brand-800 hover:bg-brand-700 text-white font-black px-6 py-3 rounded-xl transition whitespace-nowrap shadow">
          Browse Investors →
        </Link>
      </div>
    </div>
  )
}

// Rich pitch card for entrepreneurs (shows their own pitch with management options)
function EntrepreneurPitchCard({ pitch }) {
  const STAGE_COLORS = {
    idea: 'bg-purple-100 text-purple-700',
    seed: 'bg-green-100 text-green-700',
    growth: 'bg-blue-100 text-blue-700',
  }
  const stageColor = STAGE_COLORS[pitch.stage] || 'bg-gray-100 text-gray-700'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-black text-brand-800 text-base leading-tight">{pitch.title}</h3>
        <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize whitespace-nowrap ${stageColor}`}>{pitch.stage}</span>
      </div>

      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{pitch.description}</p>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{pitch.industry}</span>
        <span className="bg-gold-100 text-gold-700 px-2.5 py-1 rounded-full font-bold">
          ${Number(pitch.funding_goal).toLocaleString()} goal
        </span>
      </div>

      {/* Status indicators */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-brand-700 font-semibold">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Active & Visible to Investors
        </span>
        <span className="text-gray-500">
          {new Date(pitch.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="flex gap-2 pt-1 border-t border-gray-100">
        <Link to={`/pitches/${pitch.id}`}
          className="flex-1 text-center bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
          View Pitch →
        </Link>
        <Link to="/investors"
          className="flex-1 text-center bg-gold-100 hover:bg-gold-200 text-gold-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors">
          Find Investors
        </Link>
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Pitches() {
  const { user } = useAuth()
  if (user?.role === 'entrepreneur') return <EntrepreneurPitches />
  return <InvestorPitches />
}
