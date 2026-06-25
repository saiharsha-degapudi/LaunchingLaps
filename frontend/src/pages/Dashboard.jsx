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
  { to: '/submit-pitch', emoji: '➕', label: 'Submit a Pitch', desc: 'Create and publish your investor pitch', gradient: 'from-brand-700 to-brand-900' },
  { to: '/pitches', emoji: '📋', label: 'My Pitches', desc: 'Manage your pitches & track interest', gradient: 'from-blue-500 to-brand-700' },
  { to: '/education', emoji: '🎓', label: 'Education', desc: '6 expert courses — free to access', gradient: 'from-green-500 to-teal-600' },
  { to: '/community', emoji: '💬', label: 'Community', desc: 'Connect with fellow entrepreneurs', gradient: 'from-purple-500 to-pink-600' },
  { to: '/messages', emoji: '📨', label: 'Messages', desc: 'Replies from interested investors', gradient: 'from-gold-500 to-orange-500' },
  { to: '/investors', emoji: '🔍', label: 'Find Investors', desc: 'Browse investor profiles & message them', gradient: 'from-red-500 to-rose-600' },
  { to: '/government-schemes', emoji: '🏛️', label: 'Govt Schemes', desc: 'Explore government funding & policies', gradient: 'from-brand-700 to-brand-900' },
]

const INVESTOR_QUICK_LINKS = [
  { to: '/pitches', emoji: '🔍', label: 'Browse Pitches', desc: '6 active pitches from global founders', gradient: 'from-gold-500 to-orange-500' },
  { to: '/investors', emoji: '👥', label: 'Investor Network', desc: 'Co-invest with fellow investors', gradient: 'from-brand-700 to-brand-900' },
  { to: '/education', emoji: '🎓', label: 'Courses', desc: '6 courses incl. Due Diligence & Series A', gradient: 'from-green-500 to-teal-600' },
  { to: '/messages', emoji: '📨', label: 'Messages', desc: 'Your founder conversations', gradient: 'from-purple-500 to-pink-600' },
  { to: '/community', emoji: '💬', label: 'Community', desc: '10+ posts on deals, legal & strategy', gradient: 'from-blue-500 to-cyan-600' },
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
function QuickLinkCard({ to, emoji, label, desc, gradient }) {
  return (
    <Link to={to} className="group relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden flex flex-col gap-3">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl shadow-md`}>
        {emoji}
      </div>
      <div>
        <p className="font-bold text-brand-800 text-sm">{label}</p>
        <p className="text-gray-400 text-xs mt-0.5 leading-snug">{desc}</p>
      </div>
    </Link>
  )
}

function InsightCard({ item }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-2xl">{item.emoji}</span>
        <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">{item.tag}</span>
      </div>
      <div>
        <h3 className="font-bold text-brand-800 text-sm mb-1">{item.title}</h3>
        <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
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
    <div className="w-72 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
      <div className="bg-gradient-to-br from-brand-800 to-brand-900 p-5">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/15 border-2 border-white/20 flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
            {inv.user?.full_name?.[0] || 'I'}
          </div>
          <div className="min-w-0">
            <p className="font-black text-white text-sm truncate">{inv.user?.full_name}</p>
            <p className="text-blue-200 text-xs truncate">{inv.firm_name}</p>
            {inv.location && <p className="text-blue-300/80 text-xs mt-0.5 truncate">📍 {inv.location}</p>}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="bg-gold-50 border border-gold-200 rounded-xl p-3 mb-3">
          <p className="text-xs text-gray-400 font-medium mb-0.5">Invests</p>
          <p className="font-black text-brand-800 text-sm">{minStr} – {maxStr}</p>
        </div>
        {inv.user?.bio && <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{inv.user.bio}</p>}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {industries.map(ind => <span key={ind} className="text-xs bg-brand-100 text-brand-700 font-semibold px-2.5 py-0.5 rounded-full">{ind}</span>)}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {stages.map(s => <span key={s} className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-0.5 rounded-full capitalize">{s}</span>)}
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
    <div className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black text-brand-800">Active Investors on Platform</h2>
          <p className="text-gray-400 text-sm mt-0.5">{investors.length} verified investors actively looking for deals — hover to pause</p>
        </div>
        <Link to="/investors" className="text-brand-700 text-sm font-semibold hover:underline">Connect with Investors →</Link>
      </div>
      <div className="group relative overflow-hidden"
        style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
        <div className="flex gap-5 group-hover:[animation-play-state:paused]"
          style={{ width: 'max-content', animation: `scroll-left ${investors.length * 7}s linear infinite` }}>
          {items.map((inv, i) => <InvestorScrollCard key={i} inv={inv} />)}
        </div>
      </div>
    </div>
  )
}

function PitchScrollCard({ pitch }) {
  const STAGE_COLORS = { idea: 'bg-purple-100 text-purple-700', seed: 'bg-green-100 text-green-700', growth: 'bg-blue-100 text-blue-700' }
  const stageColor = STAGE_COLORS[pitch.stage] || 'bg-gray-100 text-gray-700'
  const goalStr = pitch.funding_goal >= 1_000_000
    ? `$${(pitch.funding_goal / 1_000_000).toFixed(1)}M`
    : `$${(pitch.funding_goal / 1_000).toFixed(0)}K`

  return (
    <Link to={`/pitches/${pitch.id}`}
      className="w-80 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all block">
      <div className="bg-gradient-to-br from-gray-900 to-brand-900 p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="font-black text-white text-base leading-tight line-clamp-2">
            {pitch.title.includes('—') ? pitch.title.split('—')[0].trim() : pitch.title}
          </p>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize whitespace-nowrap flex-shrink-0 ${stageColor}`}>{pitch.stage}</span>
        </div>
        <p className="text-3xl font-black text-gold-400">{goalStr}</p>
        <p className="text-gray-400 text-xs mt-0.5">funding goal</p>
      </div>
      <div className="p-4">
        <span className="text-xs bg-brand-100 text-brand-700 font-semibold px-2.5 py-1 rounded-full">{pitch.industry}</span>
        <p className="text-gray-600 text-xs leading-relaxed mt-3 line-clamp-3">{pitch.description}</p>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-800 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {pitch.owner?.full_name?.[0] || 'F'}
            </div>
            <span className="text-xs text-gray-500 font-medium truncate max-w-[120px]">{pitch.owner?.full_name}</span>
          </div>
          <span className="text-xs text-brand-700 font-bold flex-shrink-0">View Pitch →</span>
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
    <div className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black text-brand-800">Live Deal Flow</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            <span className="font-bold text-brand-700">{filtered.length}</span> pitch{filtered.length !== 1 ? 'es' : ''} match your filters — hover to pause
          </p>
        </div>
        <Link to="/pitches" className="text-gold-600 text-sm font-semibold hover:underline">View All Pitches →</Link>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider min-w-[110px]">Investment Range</span>
          <div className="flex flex-wrap gap-2">
            {DEAL_RANGES.map(r => (
              <button key={r.label} onClick={() => setRangeFilter(r.label)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${rangeFilter === r.label ? 'bg-brand-800 text-white border-brand-800 shadow' : 'border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-700'}`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider min-w-[110px]">Industry</span>
          <div className="flex flex-wrap gap-2">
            {DEAL_INDUSTRIES.map(ind => (
              <button key={ind} onClick={() => setIndustryFilter(ind)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${industryFilter === ind ? 'bg-gold-500 text-white border-gold-500 shadow' : 'border-gray-200 text-gray-600 hover:border-gold-400 hover:text-gold-700'}`}>
                {ind}
              </button>
            ))}
          </div>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 text-sm font-medium">No pitches match your current filters.</p>
        </div>
      ) : (
        <div className="group relative overflow-hidden"
          style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' }}>
          <div className="flex gap-5 group-hover:[animation-play-state:paused]"
            style={{ width: 'max-content', animation: needsLoop ? `scroll-left ${filtered.length * 9}s linear infinite` : 'none' }}>
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
    <div>
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome */}
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-blue-800 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gold-400 opacity-10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Entrepreneur Dashboard
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
                Welcome back, {user?.full_name?.split(' ')[0]}! 🚀
              </h1>
              <p className="text-blue-200 text-sm">You're on your way to connecting with global investors. Keep building!</p>
            </div>
            <Link to="/submit-pitch"
              className="flex-shrink-0 bg-gradient-to-r from-gold-500 to-yellow-400 hover:from-gold-600 hover:to-yellow-500 text-white font-black px-6 py-3 rounded-xl transition-all shadow-lg hover:scale-105 whitespace-nowrap">
              + Submit New Pitch
            </Link>
          </div>
        </div>

        <h2 className="text-xl font-black text-brand-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-10">
          {ENTREPRENEUR_QUICK_LINKS.map((l) => <QuickLinkCard key={l.to} {...l} />)}
        </div>

        <div className="mb-8">
          <DealFlowPipeline />
        </div>

        {(() => {
          const mySpvs = spvs.filter(s => myPitchIds.includes(s.pitch_id)).slice(0, 3)
          return (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-brand-800">Syndicate Activity on Your Pitches</h2>
                <Link to="/spvs" className="text-brand-700 text-sm font-semibold hover:underline">View all →</Link>
              </div>
              {mySpvs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                  <div className="text-4xl mb-3">🏦</div>
                  <p className="font-bold text-brand-800 mb-1">No syndicates yet</p>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">Investors can form a syndicate to fund your startup. Submit a pitch to get started.</p>
                  <Link to="/submit-pitch" className="inline-block mt-4 bg-brand-800 hover:bg-brand-700 text-white text-sm font-bold px-5 py-2 rounded-xl transition-colors">
                    Submit a Pitch →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {mySpvs.map(s => <SPVCard key={s.id} spv={s} />)}
                </div>
              )}
            </div>
          )
        })()}

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-brand-800">Tips & Resources for You</h2>
          <Link to="/education" className="text-brand-700 text-sm font-semibold hover:underline">View all courses →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {ENTREPRENEUR_TIPS.map((item) => <InsightCard key={item.title} item={item} />)}
        </div>

        <div className="bg-gradient-to-r from-gold-500 to-yellow-400 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <p className="text-white font-black text-lg">Ready to find your investor?</p>
            <p className="text-yellow-100 text-sm">Browse verified global investors actively looking for startups in your sector.</p>
          </div>
          <Link to="/investors" className="flex-shrink-0 bg-brand-800 hover:bg-brand-700 text-white font-black px-6 py-3 rounded-xl transition whitespace-nowrap shadow">
            Browse Investors →
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-brand-900 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gold-400 opacity-10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Investor Dashboard
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Welcome back, {user?.full_name?.split(' ')[0]}! 💼</h1>
              <p className="text-gray-300 text-sm">You have fresh deal flow waiting. Discover your next investment today.</p>
            </div>
            <Link to="/pitches"
              className="flex-shrink-0 bg-gradient-to-r from-gold-500 to-yellow-400 hover:from-gold-600 hover:to-yellow-500 text-white font-black px-6 py-3 rounded-xl transition-all shadow-lg hover:scale-105 whitespace-nowrap">
              View New Pitches →
            </Link>
          </div>
        </div>

        <h2 className="text-xl font-black text-brand-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {INVESTOR_QUICK_LINKS.map((l) => <QuickLinkCard key={l.to} {...l} />)}
        </div>

        <div className="mb-8">
          <DealFlowPipeline />
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-brand-800">Syndicates Forming Now — Join or Lead</h2>
            <Link to="/spvs" className="text-gold-600 text-sm font-semibold hover:underline">View All Syndicates →</Link>
          </div>
          {spvs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <div className="text-4xl mb-3">🏦</div>
              <p className="font-bold text-brand-800 mb-1">No syndicates forming right now</p>
              <p className="text-gray-500 text-sm mb-4">Be the first to lead a syndicate and start earning carry.</p>
              <Link to="/lead-spv" className="inline-block bg-gold-500 hover:bg-gold-600 text-white text-sm font-bold px-5 py-2 rounded-xl transition-colors">
                + Create Syndicate
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-4">
                {spvs.slice(0, 4).map(s => <SPVCard key={s.id} spv={s} />)}
              </div>
              <Link to="/lead-spv" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
                + Create Syndicate
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-brand-800">Market Insights & Deal Flow</h2>
          <Link to="/pitches" className="text-gold-600 text-sm font-semibold hover:underline">Browse all pitches →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {INVESTOR_INSIGHTS.map((item) => <InsightCard key={item.title} item={item} />)}
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-brand-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <p className="text-white font-black text-lg">Don't miss this week's top pitches</p>
            <p className="text-gray-400 text-sm">6 active startups across 5 countries — reviewed and quality-checked.</p>
          </div>
          <Link to="/pitches" className="flex-shrink-0 bg-gold-500 hover:bg-gold-600 text-white font-black px-6 py-3 rounded-xl transition whitespace-nowrap shadow">
            View Deal Flow →
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <main className="bg-gray-50 min-h-[calc(100vh-64px)]">
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
