import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState, useRef } from 'react'
import api from '../api/axios'
import DealFlowPipeline from '../components/DealFlowPipeline'
import SPVCard from '../components/SPVCard'

const ENTREPRENEUR_ADS = [
  '🚀 New: Get your pitch reviewed by an investor mentor — Book now',
  '📚 Free Course: "How to Register Your Business for Global Investors" — Enroll today',
  '💡 Tip: Pitches with video introductions get 3× more investor views',
  '🎯 Funding Alert: 12 new investors added this week matching your sector',
  '🏆 Success Story: EcoDeliver raised $500K through a LaunchingLaps syndicate',
  '📝 Template: Download our winning pitch deck template — Free for members',
  '🌍 Webinar: "Pitching to Global Investors 101" — This Friday, Free to join',
]

const INVESTOR_ADS = [
  '💼 Deal Flow: 8 new high-quality pitches added this week — Review now',
  '📊 Market Insight: AI startup valuations up 34% YoY — See opportunities',
  '🔔 Alert: 3 startups in your focus sector just updated their pitches',
  '📰 Weekly Digest: Top 5 pitches curated for your investment thesis',
  '🌿 Hot Sector: Green Tech deals getting 2x faster closes in 2026',
  '🤝 Event: Exclusive Investor Roundtable — June 20, Virtual · Free',
  '💰 Portfolio Tip: Diversify across 3+ sectors to reduce risk exposure',
]

const ENTREPRENEUR_TIPS = [
  { emoji: '📋', title: 'Perfect Your Pitch', desc: 'Investors spend on average 3 minutes on a pitch. Lead with your problem statement and traction metrics. Be specific.', tag: 'Pitch Tips' },
  { emoji: '💵', title: 'Know Your Numbers', desc: 'Always have your CAC, LTV, MRR, and burn rate ready. Investors globally will ask, so know them cold.', tag: 'Finance 101' },
  { emoji: '🤝', title: 'Warm Introductions Win', desc: 'A warm intro from a mutual connection increases your reply rate from investors by over 400% vs cold outreach.', tag: 'Networking' },
  { emoji: '🌍', title: 'Structure Your Business', desc: 'Global investors look for clear legal structures. A Delaware C-Corp or equivalent clean entity inspires investor confidence.', tag: 'Legal Tip' },
]

const INVESTOR_INSIGHTS = [
  { emoji: '📈', title: 'AI Sector Surging', desc: 'AI startups on the platform are seeing 2x more revenue growth than other sectors. 24 pitches currently open.', tag: 'Market Trend' },
  { emoji: '🌍', title: 'Global Deal Flow', desc: "This week's top pitches come from India, Nigeria, Brazil, and the Philippines — all seeking global capital.", tag: 'Deal Flow' },
  { emoji: '⚡', title: 'Fast-Close Tip', desc: 'Investors who respond within 48 hours of pitch submission close deals 3x faster than the platform average.', tag: 'Strategy' },
  { emoji: '🔎', title: 'Due Diligence Guide', desc: 'Our new 50-point evaluation framework helps you assess traction, team, and market size in under 30 minutes.', tag: 'Resource' },
]

const ENTREPRENEUR_QUICK_LINKS = [
  { to: '/submit-pitch', emoji: '➕', label: 'Submit a Pitch', desc: 'Create and publish your investor pitch' },
  { to: '/pitches', emoji: '📋', label: 'My Pitches', desc: 'Manage pitches & track interest' },
  { to: '/education', emoji: '🎓', label: 'Education', desc: '6 expert courses — free to access' },
  { to: '/community', emoji: '💬', label: 'Community', desc: 'Connect with fellow entrepreneurs' },
  { to: '/messages', emoji: '📨', label: 'Messages', desc: 'Replies from interested investors' },
  { to: '/investors', emoji: '🔍', label: 'Find Investors', desc: 'Browse investor profiles' },
  { to: '/government-schemes', emoji: '🏛️', label: 'Govt Schemes', desc: 'Explore government funding' },
]

const INVESTOR_QUICK_LINKS = [
  { to: '/pitches', emoji: '🔍', label: 'Browse Pitches', desc: '6 active pitches from global founders' },
  { to: '/investors', emoji: '👥', label: 'Investor Network', desc: 'Co-invest with fellow investors' },
  { to: '/education', emoji: '🎓', label: 'Courses', desc: '6 courses incl. Due Diligence & Series A' },
  { to: '/messages', emoji: '📨', label: 'Messages', desc: 'Your founder conversations' },
  { to: '/community', emoji: '💬', label: 'Community', desc: '10+ posts on deals, legal & strategy' },
]

const DEAL_RANGES = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under $500K', min: 0, max: 500000 },
  { label: '$500K–$1M', min: 500000, max: 1000001 },
  { label: '$1M–$2M', min: 1000001, max: 2000001 },
  { label: '$2M+', min: 2000001, max: Infinity },
]
const DEAL_INDUSTRIES = ['All', 'FinTech', 'HealthTech', 'AgriTech', 'EdTech', 'Cybersecurity', 'Green Energy', 'SaaS']

const LIVE_ACTIVITY = [
  { icon: '🤝', text: 'MedAI matched with Impact Horizon Fund', time: '2m' },
  { icon: '💰', text: 'EcoDeliver closed $1.2M seed round', time: '18m' },
  { icon: '📋', text: 'FarmConnect pitch approved by audit team', time: '41m' },
  { icon: '🚀', text: 'SwiftRoute received 3 term sheets', time: '1h' },
  { icon: '👤', text: 'TechBridge Capital joined the platform', time: '2h' },
  { icon: '📊', text: '14 new pitches submitted today', time: '3h' },
  { icon: '🏆', text: 'NovaPay selected for Fast Track program', time: '4h' },
]

// Vertical Auto-Scroll Hook
function useVerticalScroll(items) {
  const ref = useRef(null)
  const pos = useRef(0)
  const raf = useRef(null)
  const paused = useRef(false)

  const startScroll = () => {
    const el = ref.current
    if (!el) return
    const step = () => {
      if (!paused.current) {
        pos.current += 0.5
        if (pos.current >= el.scrollHeight / 2) pos.current = 0
        el.scrollTop = pos.current
      }
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }

  useEffect(() => {
    startScroll()
    return () => cancelAnimationFrame(raf.current)
  }, [items.length])

  return {
    ref,
    onMouseEnter: () => { paused.current = true },
    onMouseLeave: () => { paused.current = false },
  }
}

// Shared UI Components
function QuickLinkCard({ to, emoji, label, desc }) {
  return (
    <Link
      to={to}
      className="group bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col gap-3"
    >
      <span className="text-xl">{emoji}</span>
      <div>
        <p className="text-sm font-semibold text-zinc-900">{label}</p>
        <p className="text-xs text-zinc-400 mt-0.5 leading-snug">{desc}</p>
      </div>
    </Link>
  )
}

function InsightCard({ item }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col gap-3 hover:border-zinc-300 transition-colors">
      <div className="flex items-start justify-between">
        <span className="text-xl">{item.emoji}</span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600">
          {item.tag}
        </span>
      </div>
      <div>
        <h3 className="text-base font-semibold text-zinc-900 mb-1">{item.title}</h3>
        <p className="text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
      </div>
    </div>
  )
}

function InvestorScrollCard({ inv }) {
  const industries = inv.industry_focus?.split(',').slice(0, 3).map(s => s.trim()) || []
  const stages = inv.preferred_stages?.split(',').map(s => s.trim()) || []
  const maxStr = inv.investment_max >= 1_000_000
    ? `$${(inv.investment_max / 1_000_000).toFixed(1)}M`
    : `$${(inv.investment_max / 1_000).toFixed(0)}K`
  const minStr = `$${(inv.investment_min / 1_000).toFixed(0)}K`

  return (
    <div className="w-72 flex-shrink-0 bg-white border border-zinc-200 rounded-xl overflow-hidden hover:border-zinc-300 hover:shadow-sm transition-all">
      <div className="bg-zinc-900 p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {inv.user?.full_name?.[0] || 'I'}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white text-sm truncate">{inv.user?.full_name}</p>
            <p className="text-zinc-400 text-xs truncate">{inv.firm_name}</p>
            {inv.location && <p className="text-zinc-500 text-xs mt-0.5 truncate">{inv.location}</p>}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 mb-3">
          <p className="text-xs text-zinc-400 font-medium mb-0.5">Investment Range</p>
          <p className="font-semibold text-zinc-900 text-sm">{minStr} – {maxStr}</p>
        </div>
        {inv.user?.bio && <p className="text-zinc-600 text-xs leading-relaxed mb-3 line-clamp-2">{inv.user.bio}</p>}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {industries.map(ind => (
            <span key={ind} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600">{ind}</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {stages.map(s => (
            <span key={s} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-600 capitalize">{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function InvestorScrollSection() {
  const [investors, setInvestors] = useState([])
  useEffect(() => { api.get('/investors/').then(r => setInvestors(r.data)).catch(() => {}) }, [])
  if (!investors.length) return null

  let items = [...investors]
  while (items.length < 5) items = [...items, ...investors]
  items = [...items, ...items]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Active Investors on Platform</h2>
          <p className="text-xs text-zinc-400 mt-0.5">{investors.length} verified investors actively looking for deals</p>
        </div>
        <Link to="/investors" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
          Connect with Investors →
        </Link>
      </div>
      <div
        className="group relative overflow-hidden"
        style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}
      >
        <div
          className="flex gap-4 group-hover:[animation-play-state:paused]"
          style={{ width: 'max-content', animation: `scroll-left ${investors.length * 7}s linear infinite` }}
        >
          {items.map((inv, i) => <InvestorScrollCard key={i} inv={inv} />)}
        </div>
      </div>
    </div>
  )
}

function PitchScrollCard({ pitch }) {
  const STAGE_COLORS = {
    idea: 'bg-purple-100 text-purple-700',
    seed: 'bg-green-100 text-green-700',
    growth: 'bg-blue-100 text-blue-700',
  }
  const stageColor = STAGE_COLORS[pitch.stage] || 'bg-zinc-100 text-zinc-700'
  const goalStr = pitch.funding_goal >= 1_000_000
    ? `$${(pitch.funding_goal / 1_000_000).toFixed(1)}M`
    : `$${(pitch.funding_goal / 1_000).toFixed(0)}K`

  return (
    <Link
      to={`/pitches/${pitch.id}`}
      className="w-80 flex-shrink-0 bg-white border border-zinc-200 rounded-xl overflow-hidden hover:border-zinc-300 hover:shadow-sm transition-all block"
    >
      <div className="bg-zinc-900 p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="font-semibold text-white text-sm leading-tight line-clamp-2">
            {pitch.title.includes('—') ? pitch.title.split('—')[0].trim() : pitch.title}
          </p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md capitalize whitespace-nowrap flex-shrink-0 ${stageColor}`}>
            {pitch.stage}
          </span>
        </div>
        <p className="text-2xl font-bold text-white">{goalStr}</p>
        <p className="text-zinc-500 text-xs mt-0.5">funding goal</p>
      </div>
      <div className="p-4">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600">{pitch.industry}</span>
        <p className="text-sm text-zinc-600 leading-relaxed mt-3 line-clamp-3">{pitch.description}</p>
        <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {pitch.owner?.full_name?.[0] || 'F'}
            </div>
            <span className="text-xs text-zinc-500 truncate max-w-[120px]">{pitch.owner?.full_name}</span>
          </div>
          <span className="text-xs text-blue-600 font-medium flex-shrink-0">View Pitch →</span>
        </div>
      </div>
    </Link>
  )
}

function DealFlowSection() {
  const [pitches, setPitches] = useState([])
  const [rangeFilter, setRangeFilter] = useState('All')
  const [industryFilter, setIndustryFilter] = useState('All')

  useEffect(() => { api.get('/pitches/').then(r => setPitches(r.data)).catch(() => {}) }, [])

  const selectedRange = DEAL_RANGES.find(r => r.label === rangeFilter) || DEAL_RANGES[0]
  const filtered = pitches.filter(p => {
    const matchRange = p.funding_goal >= selectedRange.min && p.funding_goal <= selectedRange.max
    const matchIndustry = industryFilter === 'All' || p.industry.toLowerCase().includes(industryFilter.toLowerCase())
    return matchRange && matchIndustry
  })

  const needsLoop = filtered.length >= 3
  let items = needsLoop ? [...filtered, ...filtered] : [...filtered]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Live Deal Flow</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            <span className="font-medium text-zinc-600">{filtered.length}</span> pitch{filtered.length !== 1 ? 'es' : ''} match your filters
          </p>
        </div>
        <Link to="/pitches" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
          View All Pitches →
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 mb-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-zinc-500 min-w-[110px]">Investment Range</span>
          <div className="flex flex-wrap gap-1.5">
            {DEAL_RANGES.map(r => (
              <button
                key={r.label}
                onClick={() => setRangeFilter(r.label)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
                  rangeFilter === r.label
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-zinc-500 min-w-[110px]">Industry</span>
          <div className="flex flex-wrap gap-1.5">
            {DEAL_INDUSTRIES.map(ind => (
              <button
                key={ind}
                onClick={() => setIndustryFilter(ind)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
                  industryFilter === ind
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center">
          <p className="text-sm text-zinc-500 font-medium">No pitches match your current filters.</p>
        </div>
      ) : (
        <div
          className="group relative overflow-hidden"
          style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' }}
        >
          <div
            className="flex gap-4 group-hover:[animation-play-state:paused]"
            style={{ width: 'max-content', animation: needsLoop ? `scroll-left ${filtered.length * 9}s linear infinite` : 'none' }}
          >
            {items.map((pitch, i) => <PitchScrollCard key={i} pitch={pitch} />)}
          </div>
        </div>
      )}
    </div>
  )
}

// Main Dashboard
export default function Dashboard() {
  const { user } = useAuth()
  const isEntrepreneur = user?.role === 'entrepreneur'

  const [spvs, setSpvs] = useState([])
  const [myPitchIds, setMyPitchIds] = useState([])

  useEffect(() => {
    if (!isEntrepreneur) return
    api.get('/pitches/')
      .then(r => setMyPitchIds(r.data.filter(p => p.owner_id === user?.id).map(p => p.id)))
      .catch(() => {})
  }, [isEntrepreneur, user?.id])

  useEffect(() => {
    if (isEntrepreneur) {
      api.get('/spvs/').then(r => setSpvs(r.data)).catch(() => {})
    } else {
      api.get('/spvs/?status=forming').then(r => setSpvs(r.data)).catch(() => {})
    }
  }, [isEntrepreneur])

  const mainContent = isEntrepreneur ? (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
              Welcome back, {user?.full_name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-zinc-600 mt-0.5">Here's what's happening with your pitches today.</p>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600">
            Entrepreneur
          </span>
        </div>
        <Link
          to="/submit-pitch"
          className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Submit New Pitch
        </Link>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-zinc-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {ENTREPRENEUR_QUICK_LINKS.map((l) => <QuickLinkCard key={l.to} {...l} />)}
        </div>
      </div>

      {/* Deal Flow Pipeline */}
      <div>
        <DealFlowPipeline />
      </div>

      {/* Syndicate Activity */}
      {(() => {
        const mySpvs = spvs.filter(s => myPitchIds.includes(s.pitch_id)).slice(0, 3)
        return (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-zinc-900">Syndicate Activity on Your Pitches</h2>
              <Link to="/spvs" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                View all →
              </Link>
            </div>
            {mySpvs.length === 0 ? (
              <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center">
                <p className="text-base font-semibold text-zinc-900 mb-1">No syndicates yet</p>
                <p className="text-sm text-zinc-600 max-w-md mx-auto">Investors can form a syndicate to fund your startup. Submit a pitch to get started.</p>
                <Link
                  to="/submit-pitch"
                  className="inline-block mt-4 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Submit a Pitch →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mySpvs.map(s => <SPVCard key={s.id} spv={s} />)}
              </div>
            )}
          </div>
        )
      })()}

      {/* Tips & Resources */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-zinc-900">Tips & Resources for You</h2>
          <Link to="/education" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
            View all courses →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ENTREPRENEUR_TIPS.map((item) => <InsightCard key={item.title} item={item} />)}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-zinc-900 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-white font-semibold text-base">Ready to find your investor?</p>
          <p className="text-zinc-400 text-sm mt-0.5">Browse verified global investors actively looking for startups in your sector.</p>
        </div>
        <Link
          to="/investors"
          className="flex-shrink-0 bg-white hover:bg-zinc-100 text-zinc-900 text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Browse Investors →
        </Link>
      </div>

    </div>
  ) : (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
              Welcome back, {user?.full_name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-zinc-600 mt-0.5">You have fresh deal flow waiting. Discover your next investment today.</p>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600">
            Investor
          </span>
        </div>
        <Link
          to="/pitches"
          className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          View New Pitches →
        </Link>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-zinc-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {INVESTOR_QUICK_LINKS.map((l) => <QuickLinkCard key={l.to} {...l} />)}
        </div>
      </div>

      {/* Deal Flow Pipeline */}
      <div>
        <DealFlowPipeline />
      </div>

      {/* Syndicates */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-zinc-900">Syndicates Forming Now</h2>
          <Link to="/spvs" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
            View All Syndicates →
          </Link>
        </div>
        {spvs.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center">
            <p className="text-base font-semibold text-zinc-900 mb-1">No syndicates forming right now</p>
            <p className="text-sm text-zinc-600 mb-4">Be the first to lead a syndicate and start earning carry.</p>
            <Link
              to="/lead-spv"
              className="inline-block bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Create Syndicate
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {spvs.slice(0, 4).map(s => <SPVCard key={s.id} spv={s} />)}
            </div>
            <Link
              to="/lead-spv"
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Create Syndicate
            </Link>
          </>
        )}
      </div>

      {/* Market Insights */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-zinc-900">Market Insights & Deal Flow</h2>
          <Link to="/pitches" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Browse all pitches →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INVESTOR_INSIGHTS.map((item) => <InsightCard key={item.title} item={item} />)}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-zinc-900 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-white font-semibold text-base">Don't miss this week's top pitches</p>
          <p className="text-zinc-400 text-sm mt-0.5">6 active startups across 5 countries — reviewed and quality-checked.</p>
        </div>
        <Link
          to="/pitches"
          className="flex-shrink-0 bg-white hover:bg-zinc-100 text-zinc-900 text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          View Deal Flow →
        </Link>
      </div>

    </div>
  )

  return (
    <>
      <main className="bg-zinc-50 min-h-[calc(100vh-64px)]">
        {mainContent}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </>
  )
}
