import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import SPVCard from '../components/SPVCard'

const TABS = [
  { key: '', label: 'All' },
  { key: 'forming', label: 'Forming' },
  { key: 'active', label: 'Active' },
  { key: 'closed', label: 'Closed' },
]

export default function SPVList() {
  const { user } = useAuth()
  const isInvestor = user?.role === 'investor'
  const isEntrepreneur = user?.role === 'entrepreneur'

  const [activeTab, setActiveTab] = useState('')
  const [spvs, setSpvs] = useState([])
  const [myPitchIds, setMyPitchIds] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEntrepreneur) {
      setMyPitchIds(false)
      return
    }
    api.get('/pitches/')
      .then(r => setMyPitchIds(r.data.map(p => p.id)))
      .catch(() => setMyPitchIds([]))
  }, [isEntrepreneur])

  useEffect(() => {
    setLoading(true)
    setError('')
    const url = activeTab ? `/spvs/?status=${activeTab}` : '/spvs/'
    api.get(url)
      .then(r => setSpvs(r.data))
      .catch(() => setError('Failed to load syndicates. Please try again.'))
      .finally(() => setLoading(false))
  }, [activeTab])

  const visibleSpvs = isEntrepreneur && Array.isArray(myPitchIds)
    ? spvs.filter(s => myPitchIds.includes(s.pitch_id))
    : spvs

  const stillLoading = loading || (isEntrepreneur && myPitchIds === null)

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
              {isEntrepreneur ? 'Syndicates Funding Your Pitch' : 'Syndicate Opportunities'}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {isEntrepreneur
                ? 'Investors can pool capital through a syndicate to back your startup.'
                : 'Join or create a syndicate to invest in high-potential startups.'}
            </p>
          </div>
          {isInvestor && (
            <Link
              to="/lead-spv"
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Create Syndicate
            </Link>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-zinc-900 text-white'
                  : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {stillLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => setActiveTab(activeTab)}
              className="mt-4 text-sm text-zinc-600 underline"
            >
              Retry
            </button>
          </div>
        ) : visibleSpvs.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
            <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-zinc-900 mb-1">No syndicates found</h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
              {isEntrepreneur
                ? 'Investors can form a syndicate to fund your startup. Submit a pitch to get started.'
                : 'No syndicates match the current filter. Try another tab or create a new one.'}
            </p>
            {isInvestor && (
              <Link
                to="/lead-spv"
                className="inline-block mt-6 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                + Create the First Syndicate
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visibleSpvs.map(spv => (
              <SPVCard key={spv.id} spv={spv} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
