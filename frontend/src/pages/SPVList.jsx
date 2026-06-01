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
  const [myPitchIds, setMyPitchIds] = useState(null) // null = not loaded yet
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // For entrepreneurs, fetch their pitches to filter SPVs
  useEffect(() => {
    if (!isEntrepreneur) {
      setMyPitchIds(false) // not needed
      return
    }
    api.get('/pitches/')
      .then(r => setMyPitchIds(r.data.map(p => p.id)))
      .catch(() => setMyPitchIds([]))
  }, [isEntrepreneur])

  // Fetch SPVs when tab changes
  useEffect(() => {
    setLoading(true)
    setError('')
    const url = activeTab ? `/spvs/?status=${activeTab}` : '/spvs/'
    api.get(url)
      .then(r => setSpvs(r.data))
      .catch(() => setError('Failed to load SPVs. Please try again.'))
      .finally(() => setLoading(false))
  }, [activeTab])

  // For entrepreneurs, filter to only SPVs on their pitches
  const visibleSpvs = isEntrepreneur && Array.isArray(myPitchIds)
    ? spvs.filter(s => myPitchIds.includes(s.pitch_id))
    : spvs

  const stillLoading = loading || (isEntrepreneur && myPitchIds === null)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-brand-800">
            {isEntrepreneur ? 'SPVs Funding Your Pitch' : 'Active SPV Opportunities'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEntrepreneur
              ? 'Investors can pool capital through an SPV to back your startup.'
              : 'Join or lead an SPV to invest in high-potential startups.'}
          </p>
        </div>
        {isInvestor && (
          <Link
            to="/lead-spv"
            className="flex-shrink-0 bg-gold-500 hover:bg-gold-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            + Lead New SPV
          </Link>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-brand-800 text-white shadow'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {stillLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 font-semibold">{error}</p>
          <button
            onClick={() => setActiveTab(activeTab)}
            className="mt-4 text-brand-700 underline text-sm"
          >
            Retry
          </button>
        </div>
      ) : visibleSpvs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-5xl mb-4">🏦</div>
          <h3 className="text-xl font-black text-brand-800 mb-2">No SPVs found</h3>
          {isEntrepreneur ? (
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Investors can form an SPV to fund your startup. Submit a pitch to get started.
            </p>
          ) : (
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              No SPVs match the current filter. Try another tab or lead a new SPV.
            </p>
          )}
          {isInvestor && (
            <Link
              to="/lead-spv"
              className="inline-block mt-6 bg-gold-500 hover:bg-gold-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              + Lead the First SPV
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleSpvs.map(spv => (
            <SPVCard key={spv.id} spv={spv} />
          ))}
        </div>
      )}
    </div>
  )
}
