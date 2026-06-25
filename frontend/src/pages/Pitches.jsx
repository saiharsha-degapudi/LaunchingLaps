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
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Pitches</h1>
            <p className="text-sm text-zinc-500 mt-1">
              {pitches.length} startup{pitches.length !== 1 ? 's' : ''} currently seeking funding
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search pitches or founders..."
            className="w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white flex-1"
          />
          <div className="flex gap-2 flex-wrap">
            {INDUSTRIES.map(ind => (
              <button
                key={ind}
                onClick={() => setIndustry(ind)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                  industry === ind
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {ind === 'All' ? 'All Industries' : ind}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {STAGES.map(s => (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                  stage === s
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {s === 'All' ? 'All Stages' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-5 text-center py-12">
            <p className="text-red-600 text-sm font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors mt-4">
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-5 text-center py-16">
            <p className="text-zinc-500 text-sm font-medium">No pitches match your filters</p>
            <p className="text-zinc-400 text-xs mt-1">Try broadening your search or clearing filters.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-zinc-400 mb-4">
              <span className="font-medium text-zinc-600">{filtered.length}</span> pitch{filtered.length !== 1 ? 'es' : ''} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(pitch => <PitchCard key={pitch.id} pitch={pitch} />)}
            </div>

            <div className="mt-10 flex items-center justify-between bg-white border border-zinc-200 rounded-xl p-5">
              <div>
                <p className="text-base font-semibold text-zinc-900">Ready to lead a syndicate?</p>
                <p className="text-sm text-zinc-500 mt-0.5">Pool capital from co-investors and earn carried interest on returns.</p>
              </div>
              <Link
                to="/lead-spv"
                className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                Create Syndicate
              </Link>
            </div>
          </>
        )}
      </div>
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

  const otherPitches = allPitches.filter(p => p.owner_id !== user?.id).slice(0, 3)

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Your Pitches</h1>
            <p className="text-sm text-zinc-500 mt-1">Track investor interest and manage your startup pitches.</p>
          </div>
          <Link
            to="/submit-pitch"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Submit Pitch
          </Link>
        </div>

        {/* My Pitches */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-5 text-center py-12">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        ) : pitches.length === 0 ? (
          <div className="bg-white border border-dashed border-zinc-300 rounded-xl p-10 text-center mb-8">
            <p className="text-base font-semibold text-zinc-900 mb-2">No pitches yet</p>
            <p className="text-sm text-zinc-500 max-w-md mx-auto mb-5">
              Submit your first pitch to start connecting with global investors. It takes less than 5 minutes.
            </p>
            <Link
              to="/submit-pitch"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Submit Your First Pitch
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base font-semibold text-zinc-900">Active Pitches</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600">{pitches.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {pitches.map(pitch => <EntrepreneurPitchCard key={pitch.id} pitch={pitch} />)}
            </div>
          </>
        )}

        {/* Other pitches for inspiration */}
        {otherPitches.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-zinc-900">See What Other Founders Are Raising</h2>
              <Link to="/investors" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Browse investors</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherPitches.map(pitch => <PitchCard key={pitch.id} pitch={pitch} />)}
            </div>
          </div>
        )}

        {/* CTA strip */}
        <div className="flex items-center justify-between bg-white border border-zinc-200 rounded-xl p-5">
          <div>
            <p className="text-base font-semibold text-zinc-900">Get your pitch in front of the right investors</p>
            <p className="text-sm text-zinc-500 mt-0.5">Browse verified global investors and find the perfect match for your startup.</p>
          </div>
          <Link
            to="/investors"
            className="flex-shrink-0 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Browse Investors
          </Link>
        </div>
      </div>
    </div>
  )
}

// Rich pitch card for entrepreneurs (shows their own pitch with management options)
function EntrepreneurPitchCard({ pitch }) {
  const STAGE_BADGES = {
    idea: 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700',
    seed: 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700',
    growth: 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700',
  }
  const stageBadge = STAGE_BADGES[pitch.stage] || 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600'

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col gap-3 hover:border-zinc-300 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-zinc-900 leading-snug">{pitch.title}</h3>
        <span className={`${stageBadge} capitalize whitespace-nowrap`}>{pitch.stage}</span>
      </div>

      <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">{pitch.description}</p>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600">{pitch.industry}</span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
          ${Number(pitch.funding_goal).toLocaleString()} goal
        </span>
      </div>

      <div className="flex items-center justify-between text-xs pt-1">
        <span className="flex items-center gap-1.5 text-emerald-600">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          Active
        </span>
        <span className="text-zinc-400">
          {new Date(pitch.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="flex gap-2 pt-1 border-t border-zinc-100">
        <Link
          to={`/pitches/${pitch.id}`}
          className="flex-1 text-center bg-zinc-900 hover:bg-zinc-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
        >
          View Pitch
        </Link>
        <Link
          to="/investors"
          className="flex-1 text-center border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium px-4 py-2 rounded-lg transition-colors"
        >
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
