import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import MilestoneTracker from '../components/MilestoneTracker'

const STAGE_COLORS = {
  idea: 'bg-purple-100 text-purple-700',
  seed: 'bg-green-100 text-green-700',
  growth: 'bg-blue-100 text-blue-700',
}

export default function PitchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [pitch, setPitch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [interestNote, setInterestNote] = useState('')
  const [interestLoading, setInterestLoading] = useState(false)
  const [interestSuccess, setInterestSuccess] = useState(false)
  const [interestError, setInterestError] = useState('')
  const [showInterestForm, setShowInterestForm] = useState(false)

  useEffect(() => {
    async function fetchPitch() {
      setLoading(true)
      try {
        const { data } = await api.get(`/pitches/${id}`)
        setPitch(data)
      } catch (err) {
        if (err?.response?.status === 404) {
          setError('Pitch not found.')
        } else {
          setError('Failed to load pitch.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchPitch()
  }, [id])

  async function handleExpressInterest(e) {
    e.preventDefault()
    setInterestLoading(true)
    setInterestError('')
    try {
      await api.post(`/pitches/${id}/interest`, {
        pitch_id: Number(id),
        note: interestNote || undefined,
      })
      setInterestSuccess(true)
      setShowInterestForm(false)
    } catch (err) {
      setInterestError(err?.response?.data?.detail || 'Failed to express interest. Please try again.')
    } finally {
      setInterestLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <svg className="animate-spin w-10 h-10 text-brand-800" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card">
          <p className="text-red-600 font-medium text-lg mb-4">{error}</p>
          <button onClick={() => navigate('/pitches')} className="btn-primary">
            Back to Pitches
          </button>
        </div>
      </div>
    )
  }

  const stageColor = STAGE_COLORS[pitch.stage] || 'bg-gray-100 text-gray-700'
  const isOwner = user?.id === pitch.owner_id
  const isInvestor = user?.role === 'investor'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/pitches" className="hover:text-brand-800 transition-colors">Pitches</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate max-w-xs">{pitch.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <h1 className="text-2xl font-black text-brand-800 leading-tight">{pitch.title}</h1>
              <span className={`badge ${stageColor} capitalize text-sm`}>{pitch.stage}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="badge bg-gray-100 text-gray-600">{pitch.industry}</span>
              <span className="badge bg-gold-100 text-gold-700 font-semibold">
                ${Number(pitch.funding_goal).toLocaleString()} funding goal
              </span>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {pitch.description}
            </div>
          </div>

          {/* Media links */}
          {(pitch.deck_url || pitch.video_url) && (
            <div className="card flex flex-wrap gap-4">
              {pitch.deck_url && (
                <a
                  href={pitch.deck_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  View Pitch Deck
                </a>
              )}
              {pitch.video_url && (
                <a
                  href={pitch.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Video Pitch
                </a>
              )}
            </div>
          )}

          {/* Milestone Tracker — owner only */}
          {isOwner && <MilestoneTracker />}

          {/* Investor interest form */}
          {isInvestor && (
            <div className="card border-2 border-gold-200">
              <h2 className="font-bold text-brand-800 text-lg mb-3">Express Investment Interest</h2>

              {interestSuccess ? (
                <div className="flex items-center gap-3 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm font-medium">Interest expressed! The entrepreneur will be notified.</p>
                </div>
              ) : (
                <>
                  {!showInterestForm ? (
                    <div>
                      <p className="text-gray-600 text-sm mb-4">
                        Let the entrepreneur know you're interested in their pitch.
                      </p>
                      <button onClick={() => setShowInterestForm(true)} className="btn-gold">
                        Express Interest
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleExpressInterest} className="flex flex-col gap-4">
                      {interestError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                          {interestError}
                        </div>
                      )}
                      <div>
                        <label className="label">Personal note (optional)</label>
                        <textarea
                          rows={3}
                          value={interestNote}
                          onChange={(e) => setInterestNote(e.target.value)}
                          placeholder="Share your thoughts or questions for the entrepreneur…"
                          className="input resize-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" disabled={interestLoading} className="btn-gold">
                          {interestLoading ? 'Sending…' : 'Send Interest'}
                        </button>
                        <button type="button" onClick={() => setShowInterestForm(false)} className="btn-secondary">
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Founder card */}
          <div className="card">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Founder</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {pitch.owner?.full_name?.[0] || 'E'}
              </div>
              <div>
                <p className="font-bold text-brand-800 text-sm">{pitch.owner?.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">{pitch.owner?.role}</p>
              </div>
            </div>
            {pitch.owner?.bio && (
              <p className="text-gray-600 text-xs mt-3 leading-relaxed line-clamp-4">{pitch.owner.bio}</p>
            )}
          </div>

          {/* Pitch info card */}
          <div className="card flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pitch Details</h3>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Stage</span>
                <span className="font-semibold capitalize text-brand-800">{pitch.stage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Industry</span>
                <span className="font-semibold text-brand-800">{pitch.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Funding Goal</span>
                <span className="font-semibold text-gold-600">${Number(pitch.funding_goal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Posted</span>
                <span className="font-semibold text-brand-800">
                  {new Date(pitch.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="card border border-dashed border-gray-300">
              <p className="text-xs text-gray-500 mb-3 font-medium">Quick Links</p>
              <div className="flex flex-col gap-2">
                <Link to="/idea-audit" className="text-xs text-indigo-600 hover:underline font-medium">🎯 Run Idea Audit</Link>
                <Link to="/budget-planner" className="text-xs text-indigo-600 hover:underline font-medium">📊 Budget Planner</Link>
                <Link to="/roi-calculator" className="text-xs text-indigo-600 hover:underline font-medium">💰 ROI Calculator</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
