import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import FundingMeter from '../components/FundingMeter'

function fmt(n) {
  if (!n && n !== 0) return '—'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function StatusBadge({ status }) {
  if (status === 'forming') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-gold-100 text-gold-700 border border-gold-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
        <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" />
        Forming
      </span>
    )
  }
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 border border-green-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 border border-gray-200 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
      Closed
    </span>
  )
}

export default function SPVDetail() {
  const { id } = useParams()
  const { user } = useAuth()

  const [spv, setSpv] = useState(null)
  const [commitments, setCommitments] = useState([])
  const [loadingSpv, setLoadingSpv] = useState(true)
  const [loadingCommit, setLoadingCommit] = useState(false)
  const [error, setError] = useState('')

  // Commit form
  const [amount, setAmount] = useState('')
  const [commitMsg, setCommitMsg] = useState('')
  const [commitError, setCommitError] = useState('')

  const isInvestor = user?.role === 'investor'
  const isEntrepreneur = user?.role === 'entrepreneur'
  const isLead = spv && user && spv.lead_investor_id === user.id
  const canCommit = isInvestor && !isLead && spv?.status === 'forming'

  // Check if current user already backed this SPV
  const myCommitment = commitments.find(c => c.investor_id === user?.id)

  useEffect(() => {
    setLoadingSpv(true)
    Promise.allSettled([
      api.get(`/spvs/${id}`),
      api.get(`/spvs/${id}/commitments`),
    ]).then(([spvRes, commitRes]) => {
      if (spvRes.status === 'fulfilled') setSpv(spvRes.value.data)
      else setError('Syndicate not found.')
      if (commitRes.status === 'fulfilled') setCommitments(commitRes.value.data)
    }).finally(() => setLoadingSpv(false))
  }, [id])

  async function handleCommit(e) {
    e.preventDefault()
    setCommitError('')
    setCommitMsg('')
    const parsedAmount = parseFloat(amount)
    if (!parsedAmount || parsedAmount < spv.min_check) {
      setCommitError(`Minimum commitment is ${fmt(spv.min_check)}.`)
      return
    }
    setLoadingCommit(true)
    try {
      await api.post(`/spvs/${id}/commit`, { amount: parsedAmount })
      const [spvRes, commitRes] = await Promise.all([
        api.get(`/spvs/${id}`),
        api.get(`/spvs/${id}/commitments`),
      ])
      setSpv(spvRes.data)
      setCommitments(commitRes.data)
      setAmount('')
      setCommitMsg('Commitment submitted successfully!')
    } catch (err) {
      setCommitError(err.response?.data?.detail ?? 'Failed to submit commitment.')
    } finally {
      setLoadingCommit(false)
    }
  }

  async function handleWithdraw() {
    if (!window.confirm('Are you sure you want to withdraw your commitment?')) return
    setLoadingCommit(true)
    try {
      await api.delete(`/spvs/${id}/commit`)
      const [spvRes, commitRes] = await Promise.all([
        api.get(`/spvs/${id}`),
        api.get(`/spvs/${id}/commitments`),
      ])
      setSpv(spvRes.data)
      setCommitments(commitRes.data)
      setCommitMsg('Commitment withdrawn.')
    } catch (err) {
      setCommitError(err.response?.data?.detail ?? 'Failed to withdraw commitment.')
    } finally {
      setLoadingCommit(false)
    }
  }

  // Who can see commitments list: lead investor or if you're a backer
  const canSeeCommitments = isLead || !!myCommitment

  const deadline = spv?.deadline
    ? new Date(spv.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  if (loadingSpv) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !spv) {
    return (
      <div className="text-center py-24">
        <p className="text-red-500 font-semibold text-lg">{error || 'Syndicate not found.'}</p>
        <Link to="/spvs" className="mt-4 inline-block text-brand-700 underline">Back to Syndicates</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link to="/spvs" className="inline-flex items-center gap-1.5 text-brand-700 text-sm font-semibold hover:underline mb-6">
        ← Back to Syndicates
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Title block */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge status={spv.status} />
              {spv.pitch_industry && (
                <span className="text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full font-medium">
                  {spv.pitch_industry}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black text-brand-800 leading-tight">{spv.title}</h1>
          </div>

          {/* Pitch info card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Associated Pitch</h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-brand-800">{spv.pitch_title}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {spv.pitch_industry && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{spv.pitch_industry}</span>
                  )}
                  {spv.pitch_stage && (
                    <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full capitalize">{spv.pitch_stage}</span>
                  )}
                </div>
              </div>
              <Link
                to={`/pitches/${spv.pitch_id}`}
                className="flex-shrink-0 text-sm font-semibold text-brand-700 border border-brand-200 hover:bg-brand-50 px-4 py-2 rounded-xl transition-colors"
              >
                View Pitch →
              </Link>
            </div>
          </div>

          {/* Investment thesis */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Investment Thesis</h2>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {spv.description || 'No investment thesis provided.'}
            </p>
          </div>

          {/* Commitments list */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Commitments ({spv.backer_count ?? commitments.length})
            </h2>
            {canSeeCommitments ? (
              commitments.length === 0 ? (
                <p className="text-gray-400 text-sm">No commitments yet.</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {commitments.map((c, i) => (
                    <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center text-white text-xs font-bold">
                          {c.investor_name?.charAt(0) ?? '?'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{c.investor_name}</p>
                          {c.committed_at && (
                            <p className="text-xs text-gray-400">
                              {new Date(c.committed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm font-bold text-brand-800">{fmt(c.amount)}</p>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <p className="text-gray-400 text-sm">
                Commitment details are visible to the lead investor and backers only.
                {isInvestor && spv.status === 'forming' && ' Commit to this syndicate to see the full list.'}
              </p>
            )}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="flex flex-col gap-5">

          {/* SPV Terms */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Syndicate Terms</h2>

            <div className="mb-4">
              <FundingMeter
                committed={spv.committed_amount}
                target={spv.target_amount}
                pctFunded={spv.pct_funded}
              />
            </div>

            <dl className="space-y-2.5 text-sm">
              {[
                ['Target', fmt(spv.target_amount)],
                ['Committed', fmt(spv.committed_amount)],
                ['Carry', `${spv.carry_pct}%`],
                ['Mgmt Fee', `${spv.mgmt_fee_pct}%/yr`],
                ['Min Check', fmt(spv.min_check)],
                ['Backers', `${spv.backer_count ?? 0} investor${spv.backer_count !== 1 ? 's' : ''}`],
                ...(deadline ? [['Deadline', deadline]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <dt className="text-gray-400 font-medium">{label}</dt>
                  <dd className="font-bold text-brand-800">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Lead Investor */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Lead Investor</h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-600 to-brand-900 flex items-center justify-center text-white text-lg font-black flex-shrink-0">
                {spv.lead_investor_name?.charAt(0) ?? '?'}
              </div>
              <div>
                <p className="font-bold text-brand-800">{spv.lead_investor_name}</p>
                {spv.lead_investor_firm && (
                  <p className="text-xs text-gray-400">{spv.lead_investor_firm}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action panel — depends on role */}
          {isLead && (
            <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-brand-700 text-lg">🏦</span>
                <h3 className="font-bold text-brand-800 text-sm">You are leading this Syndicate</h3>
              </div>
              <p className="text-brand-600 text-xs leading-relaxed">
                As the lead investor you earn {spv.carry_pct}% carry on returns. Share this syndicate link with co-investors to fill your round.
              </p>
            </div>
          )}

          {canCommit && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                {myCommitment ? 'Your Commitment' : 'Commit to this Syndicate'}
              </h2>

              {myCommitment ? (
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    You have committed <span className="font-bold text-brand-800">{fmt(myCommitment.amount)}</span>.
                  </p>
                  {spv.status === 'forming' && (
                    <button
                      onClick={handleWithdraw}
                      disabled={loadingCommit}
                      className="mt-3 w-full border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold py-2 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {loadingCommit ? 'Withdrawing…' : 'Withdraw Commitment'}
                    </button>
                  )}
                </div>
              ) : (
                <form onSubmit={handleCommit} className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                      Amount (USD) — min {fmt(spv.min_check)}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        min={spv.min_check}
                        step="1000"
                        placeholder={String(spv.min_check)}
                        className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                        required
                      />
                    </div>
                  </div>
                  {commitError && <p className="text-red-500 text-xs">{commitError}</p>}
                  {commitMsg && <p className="text-green-600 text-xs font-semibold">{commitMsg}</p>}
                  <button
                    type="submit"
                    disabled={loadingCommit}
                    className="w-full bg-brand-800 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm"
                  >
                    {loadingCommit ? 'Submitting…' : 'Commit →'}
                  </button>
                </form>
              )}

              {commitMsg && !myCommitment && (
                <p className="text-green-600 text-xs font-semibold mt-2">{commitMsg}</p>
              )}
            </div>
          )}

          {isEntrepreneur && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Funding Progress</h2>
              <FundingMeter
                committed={spv.committed_amount}
                target={spv.target_amount}
                pctFunded={spv.pct_funded}
              />
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 leading-relaxed">
                Share this syndicate page with potential investors to accelerate your funding round.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
