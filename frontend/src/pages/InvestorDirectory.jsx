import { useEffect, useState } from 'react'
import api from '../api/axios'
import InvestorCard from '../components/InvestorCard'

export default function InvestorDirectory() {
  const [investors, setInvestors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchInvestors() {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/investors/')
        setInvestors(data)
      } catch {
        setError('Failed to load investors. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchInvestors()
  }, [])

  const filtered = investors.filter((inv) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      inv.user?.full_name?.toLowerCase().includes(q) ||
      inv.firm_name?.toLowerCase().includes(q) ||
      inv.industry_focus?.toLowerCase().includes(q) ||
      inv.location?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title text-3xl">Investor Directory</h1>
        <p className="text-gray-500 text-sm mt-1">
          Explore verified US investors and find the right match for your startup.
        </p>
      </div>

      {/* Search */}
      <div className="card mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, firm, industry, or location…"
          className="input"
        />
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-500 font-medium">No investors found</p>
          {search && <p className="text-gray-400 text-sm mt-1">Try a different search term.</p>}
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-4">{filtered.length} investor{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((investor) => (
              <InvestorCard key={investor.id} investor={investor} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
