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
      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium px-2 py-0.5 rounded-md">
        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
        Forming
      </span>
    )
  }
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-medium px-2 py-0.5 rounded-md">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-500 border border-zinc-200 text-xs font-medium px-2 py-0.5 rounded-md">
      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
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

  const [amount, setAmount] = useState('')
  const [commitMsg, setCommitMsg] = useState('')
  const [commitError, setCommitError] = useState('')

  const isInvestor = user?.role === 'investor'
  const isEntrepreneur = user?.role === 'entrepreneur'
  const isLead = spv && user && spv.lead_investor_id === user.id
  const canCommit = isInvestor && !isLead && spv?.status === 'forming'
  const myCommitment = commitments.find(c => c.investor_id === user?.id)
  const canSeeCommitments = isLead || !!myCommitment

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

  const deadline = spv?.deadline
    ? new Date(spv.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  if (loadingSpv) {
    return (
      <div className="bg-zinc-50 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !spv) {
    return (
      <div className="bg-zinc-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-600">{error || 'Syndicate not found.'}</p>
          <Link to="/spvs" className="mt-3 inline-block text-sm text-zinc-600 underline">Back to Syndicates</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back */}
        <Link to="/spvs" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Syndicates
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Title block */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <StatusBadge status={spv.status} />
                {spv.pitch_industry && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600">
                    {spv.pitch_industry}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">{spv.title}</h1>
            </div>

            {/* Associated pitch */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-medium text-zinc-500 mb-3">Associated Pitch</p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{spv.pitch_title}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {spv.pitch_industry && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600">{spv.pitch_industry}</span>
                    )}
                    {spv.pitch_stage && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600 capitalize">{spv.pitch_stage}</span>
                    )}
                  </div>
                </div>
                <Link
                  to={`/pitches/${spv.pitch_id}`}
                  className="flex-shrink-0 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  View Pitch →
                </Link>
              </div>
            </div>

            {/* Investment thesis */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-medium text-zinc-500 mb-3">Investment Thesis</p>
              <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
                {spv.description || 'No investment thesis provided.'}
              </p>
            </div>

            {/* Financial Projections */}
            {spv.target_amount > 0 && (() => {
              const T = spv.target_amount
              const carry = spv.carry_pct / 100
              const mgmtFeeAmt = (spv.committed_amount || 0) * (spv.mgmt_fee_pct || 0) / 100
              const scenarios = [3, 5, 10].map(n => {
                const profit = (n - 1) * T
                const leadCarry = profit * carry
                const lpNet = profit * (1 - carry) + T
                const lpMultiple = lpNet / T
                return { n, profit, leadCarry, lpNet, lpMultiple }
              })
              return (
                <div className="bg-white border border-zinc-200 rounded-xl p-5">
                  <p className="text-xs font-medium text-zinc-500 mb-4">Investment Details &amp; Projections</p>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-zinc-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-zinc-400 mb-1">Target Raise</p>
                      <p className="text-sm font-semibold text-zinc-900">{fmt(T)}</p>
                    </div>
                    <div className="bg-zinc-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-zinc-400 mb-1">Filled So Far</p>
                      <p className="text-sm font-semibold text-zinc-900">
                        {fmt(spv.committed_amount)}
                        <span className="text-xs font-normal text-zinc-400 ml-1">({(spv.pct_funded ?? 0).toFixed(0)}%)</span>
                      </p>
                    </div>
                    <div className="bg-zinc-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-zinc-400 mb-1">Mgmt Fee/yr</p>
                      <p className="text-sm font-semibold text-zinc-900">{mgmtFeeAmt > 0 ? fmt(mgmtFeeAmt) : '—'}</p>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-zinc-500 mb-3">
                    Exit Scenarios <span className="font-normal text-zinc-400">(on {fmt(T)} deployed capital)</span>
                  </p>
                  <div className="overflow-x-auto rounded-lg border border-zinc-100">
                    <table className="w-full text-xs">
                      <thead className="bg-zinc-50">
                        <tr>
                          <th className="text-left px-3 py-2.5 text-zinc-400 font-medium">Metric</th>
                          <th className="text-right px-3 py-2.5 text-zinc-600 font-medium">3× Exit</th>
                          <th className="text-right px-3 py-2.5 text-zinc-600 font-medium">5× Exit</th>
                          <th className="text-right px-3 py-2.5 text-zinc-600 font-medium">10× Exit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50">
                        <tr>
                          <td className="px-3 py-2.5 text-zinc-500">Total Portfolio Value</td>
                          {scenarios.map(({ n }) => (
                            <td key={n} className="px-3 py-2.5 text-right font-medium text-zinc-800">{fmt(n * T)}</td>
                          ))}
                        </tr>
                        <tr className="bg-zinc-50/50">
                          <td className="px-3 py-2.5 text-zinc-500">Total Profit</td>
                          {scenarios.map(({ n, profit }) => (
                            <td key={n} className="px-3 py-2.5 text-right font-medium text-green-700">{fmt(profit)}</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-3 py-2.5 text-zinc-500">Lead Carry ({spv.carry_pct}%)</td>
                          {scenarios.map(({ n, leadCarry }) => (
                            <td key={n} className="px-3 py-2.5 text-right font-medium text-zinc-700">{fmt(leadCarry)}</td>
                          ))}
                        </tr>
                        <tr className="bg-zinc-50/50">
                          <td className="px-3 py-2.5 text-zinc-500">LP Net Return Pool</td>
                          {scenarios.map(({ n, lpNet }) => (
                            <td key={n} className="px-3 py-2.5 text-right font-medium text-blue-700">{fmt(lpNet)}</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-3 py-2.5 text-zinc-500">Per $1 Invested (LP)</td>
                          {scenarios.map(({ n, lpMultiple }) => (
                            <td key={n} className="px-3 py-2.5 text-right font-semibold text-zinc-900">{lpMultiple.toFixed(2)}×</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {myCommitment && myCommitment.amount > 0 && (
                    <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <p className="text-xs font-medium text-blue-700 mb-3">
                        Your {fmt(myCommitment.amount)} Commitment — Projected Returns
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {scenarios.map(({ n, lpMultiple }) => {
                          const myReturn = myCommitment.amount * lpMultiple
                          const myProfit = myReturn - myCommitment.amount
                          return (
                            <div key={n} className="text-center bg-white rounded-lg p-2.5">
                              <p className="text-xs text-zinc-400">{n}× Exit</p>
                              <p className="text-sm font-semibold text-zinc-900 mt-0.5">{fmt(myReturn)}</p>
                              <p className="text-xs text-green-600">+{fmt(myProfit)}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
                    * Projections are illustrative estimates. Actual returns depend on portfolio company performance, market conditions, and exit timing.
                  </p>
                </div>
              )
            })()}

            {/* Commitments list */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-medium text-zinc-500 mb-3">
                Commitments ({spv.backer_count ?? commitments.length})
              </p>
              {canSeeCommitments ? (
                commitments.length === 0 ? (
                  <p className="text-sm text-zinc-400">No commitments yet.</p>
                ) : (
                  <div className="divide-y divide-zinc-50">
                    {commitments.map((c, i) => (
                      <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-medium">
                            {c.investor_name?.charAt(0) ?? '?'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-800">{c.investor_name}</p>
                            {c.committed_at && (
                              <p className="text-xs text-zinc-400">
                                {new Date(c.committed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-zinc-900">{fmt(c.amount)}</p>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <p className="text-sm text-zinc-400">
                  Commitment details are visible to the lead investor and backers only.
                  {isInvestor && spv.status === 'forming' && ' Commit to this syndicate to see the full list.'}
                </p>
              )}
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="flex flex-col gap-4">

            {/* SPV Terms */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-medium text-zinc-500 mb-4">Syndicate Terms</p>

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
                    <dt className="text-zinc-400">{label}</dt>
                    <dd className="font-medium text-zinc-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Lead Investor */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-medium text-zinc-500 mb-4">Lead Investor</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {spv.lead_investor_name?.charAt(0) ?? '?'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{spv.lead_investor_name}</p>
                  {spv.lead_investor_firm && (
                    <p className="text-xs text-zinc-400">{spv.lead_investor_firm}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Lead notice */}
            {isLead && (
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-zinc-900 mb-1">You are leading this Syndicate</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  As the lead investor you earn {spv.carry_pct}% carry on returns. Share this syndicate link with co-investors to fill your round.
                </p>
              </div>
            )}

            {/* Commit form */}
            {canCommit && (
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-xs font-medium text-zinc-500 mb-4">
                  {myCommitment ? 'Your Commitment' : 'Commit to this Syndicate'}
                </p>

                {myCommitment ? (
                  <div>
                    <p className="text-sm text-zinc-600 mb-1">
                      You have committed <span className="font-semibold text-zinc-900">{fmt(myCommitment.amount)}</span>.
                    </p>
                    {spv.status === 'forming' && (
                      <button
                        onClick={handleWithdraw}
                        disabled={loadingCommit}
                        className="mt-3 w-full border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {loadingCommit ? 'Withdrawing…' : 'Withdraw Commitment'}
                      </button>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleCommit} className="flex flex-col gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                        Amount (USD) — min {fmt(spv.min_check)}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                        <input
                          type="number"
                          value={amount}
                          onChange={e => setAmount(e.target.value)}
                          min={spv.min_check}
                          step="1000"
                          placeholder={String(spv.min_check)}
                          className="w-full pl-7 pr-3 border border-zinc-200 rounded-lg py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
                          required
                        />
                      </div>
                    </div>
                    {commitError && <p className="text-red-500 text-xs">{commitError}</p>}
                    {commitMsg && <p className="text-green-600 text-xs font-medium">{commitMsg}</p>}
                    <button
                      type="submit"
                      disabled={loadingCommit}
                      className="w-full bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loadingCommit ? 'Submitting…' : 'Commit →'}
                    </button>
                  </form>
                )}

                {commitMsg && !myCommitment && (
                  <p className="text-green-600 text-xs font-medium mt-2">{commitMsg}</p>
                )}
              </div>
            )}

            {/* Entrepreneur progress */}
            {isEntrepreneur && (
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-xs font-medium text-zinc-500 mb-3">Funding Progress</p>
                <FundingMeter
                  committed={spv.committed_amount}
                  target={spv.target_amount}
                  pctFunded={spv.pct_funded}
                />
                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700 leading-relaxed">
                  Share this syndicate page with potential investors to accelerate your funding round.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
