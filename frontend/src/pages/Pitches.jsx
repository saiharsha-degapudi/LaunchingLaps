import { useEffect, useState } from 'react'
import api from '../api/axios'
import PitchCard from '../components/PitchCard'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const INDUSTRIES = [
  'All',
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

const STAGES = ['All', 'idea', 'seed', 'growth']

export default function Pitches() {
  const { user } = useAuth()
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

  const filtered = pitches.filter((p) =>
    search === '' ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title text-3xl">Active Pitches</h1>
          <p className="text-gray-500 text-sm mt-1">Discover startups seeking investment</p>
        </div>
        {user?.role === 'entrepreneur' && (
          <Link to="/submit-pitch" className="btn-gold flex-shrink-0">
            + Submit Pitch
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card mb-8 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pitches…"
          className="input flex-1"
        />
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="input sm:w-48"
        >
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>{ind === 'All' ? 'All Industries' : ind}</option>
          ))}
        </select>
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="input sm:w-40"
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>{s === 'All' ? 'All Stages' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <svg className="animate-spin w-10 h-10 text-brand-800" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
      ) : error ? (
        <div className="card text-center py-12">
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-4">
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 font-medium">No pitches found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-4">{filtered.length} pitch{filtered.length !== 1 ? 'es' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pitch) => (
              <PitchCard key={pitch.id} pitch={pitch} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
