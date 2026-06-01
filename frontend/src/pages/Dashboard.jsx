import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import api from '../api/axios'
import ScrollingBanner from '../components/ScrollingBanner'
import SPVCard from '../components/SPVCard'

// ── Entrepreneur-only ads & content ──────────────────────────────────────────
const ENTREPRENEUR_ADS = [
  '🚀 New: Get your pitch reviewed by an investor mentor — Book now',
  '📚 Free Course: "How to Register Your Business for Global Investors" — Enroll today',
  '💡 Tip: Pitches with video introductions get 3× more investor views',
  '🎯 Funding Alert: 12 new investors added this week matching your sector',
  '🏆 Success Story: EcoDeliver raised $500K through a LaunchingLaps syndicate',
  '📝 Template: Download our winning pitch deck template — Free for members',
  '⚡ Feature: Add a video intro to your pitch — Stand out instantly',
  '🌍 Webinar: "Pitching to Global Investors 101" — This Friday, Free to join',
]

const ENTREPRENEUR_TIPS = [
  { emoji: '📋', title: 'Perfect Your Pitch', desc: 'US investors spend on average 3 minutes on a pitch. Lead with your problem statement and traction metrics.', tag: 'Pitch Tips' },
  { emoji: '💵', title: 'Know Your Numbers', desc: 'Always have your CAC, LTV, MRR, and burn rate ready. Investors will ask, so be prepared.', tag: 'Finance 101' },
  { emoji: '🤝', title: 'Warm Introductions Win', desc: 'A warm intro from a mutual connection increases your reply rate from investors by over 400%.', tag: 'Networking' },
  { emoji: '🌐', title: 'Structure Your Business', desc: 'Investors globally look for clear legal structures. Consider setting up an entity in a jurisdiction that suits your investor base.', tag: 'Legal Tip' },
]

const ENTREPRENEUR_QUICK_LINKS = [
  { to: '/submit-pitch', emoji: '➕', label: 'Submit a Pitch', desc: 'Create and publish your investor pitch', gradient: 'from-brand-700 to-brand-900' },
  { to: '/pitches', emoji: '📋', label: 'My Pitches', desc: 'View interest and manage pitches', gradient: 'from-brand-500 to-brand-700' },
  { to: '/education', emoji: '🎓', label: 'Education', desc: 'Fundraising & US market courses', gradient: 'from-green-500 to-teal-600' },
  { to: '/community', emoji: '💬', label: 'Community', desc: 'Connect with fellow entrepreneurs', gradient: 'from-purple-500 to-pink-600' },
  { to: '/messages', emoji: '📨', label: 'Messages', desc: 'Replies from interested investors', gradient: 'from-gold-500 to-orange-500' },
  { to: '/investors', emoji: '🔍', label: 'Find Investors', desc: 'Browse investor profiles & focus areas', gradient: 'from-red-500 to-rose-600' },
]

// ── Investor-only ads & content ───────────────────────────────────────────────
const INVESTOR_ADS = [
  '💼 Deal Flow: 8 new high-quality pitches added this week — Review now',
  '📊 Market Insight: AI startup valuations up 34% YoY — See opportunities',
  '🔔 Alert: 3 startups in your focus sector just updated their pitches',
  '📰 Weekly Digest: Top 5 pitches curated for your investment thesis',
  '🌿 Hot Sector: Green Tech deals getting 2x faster closes in 2026',
  '🤝 Event: Exclusive Investor Roundtable — June 20, Virtual · Free',
  '📉 Due Diligence: Download our 50-point startup evaluation checklist',
  '💰 Portfolio Tip: Diversify across 3+ sectors to reduce risk exposure',
]

const INVESTOR_INSIGHTS = [
  { emoji: '📈', title: 'AI Sector Surging', desc: 'AI startups on the platform are seeing 2x more revenue growth than other sectors. 24 pitches currently open.', tag: 'Market Trend' },
  { emoji: '🌍', title: 'Global Deal Flow', desc: 'This week\'s top pitches come from India, Nigeria, Brazil, and the Philippines — all seeking US capital.', tag: 'Deal Flow' },
  { emoji: '⚡', title: 'Fast-Close Tip', desc: 'Investors who respond within 48 hours of pitch submission close deals 3x faster than the platform average.', tag: 'Strategy' },
  { emoji: '🔎', title: 'Due Diligence Guide', desc: 'Our new 50-point evaluation framework helps you assess traction, team, and market size in under 30 minutes.', tag: 'Resource' },
]

const INVESTOR_QUICK_LINKS = [
  { to: '/pitches', emoji: '🔍', label: 'Browse Pitches', desc: 'Discover startups seeking funding', gradient: 'from-gold-500 to-orange-500' },
  { to: '/investors', emoji: '👥', label: 'Investor Network', desc: 'Connect with co-investors', gradient: 'from-brand-700 to-brand-900' },
  { to: '/education', emoji: '🎓', label: 'Investor Courses', desc: 'Startup evaluation & due diligence', gradient: 'from-green-500 to-teal-600' },
  { to: '/messages', emoji: '📨', label: 'Messages', desc: 'Your founder conversations', gradient: 'from-purple-500 to-pink-600' },
  { to: '/community', emoji: '💬', label: 'Investor Forum', desc: 'Share insights with other investors', gradient: 'from-brand-500 to-brand-700' },
]

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

function StatCard({ label, value, emoji, gradient }) {
  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br ${gradient} text-white shadow-md`}>
      <div className="text-2xl mb-2">{emoji}</div>
      <p className="text-2xl font-black">{value ?? '—'}</p>
      <p className="text-white/70 text-xs font-medium uppercase tracking-wide mt-1">{label}</p>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const isEntrepreneur = user?.role === 'entrepreneur'

  const [stats, setStats] = useState({ pitches: null, investors: null, courses: null, posts: null })
  const [spvs, setSpvs] = useState([])
  const [myPitchIds, setMyPitchIds] = useState([])

  useEffect(() => {
    async function fetchStats() {
      try {
        const [pitchRes, investorRes, courseRes, postRes] = await Promise.allSettled([
          api.get('/pitches/'),
          api.get('/investors/'),
          api.get('/education/courses'),
          api.get('/community/posts'),
        ])
        setStats({
          pitches: pitchRes.status === 'fulfilled' ? pitchRes.value.data.length : 0,
          investors: investorRes.status === 'fulfilled' ? investorRes.value.data.length : 0,
          courses: courseRes.status === 'fulfilled' ? courseRes.value.data.length : 0,
          posts: postRes.status === 'fulfilled' ? postRes.value.data.length : 0,
        })
        if (isEntrepreneur && pitchRes.status === 'fulfilled') {
          setMyPitchIds(pitchRes.value.data.map(p => p.id))
        }
      } catch { /* silently fail */ }
    }
    fetchStats()
  }, [isEntrepreneur])

  useEffect(() => {
    if (isEntrepreneur) {
      api.get('/spvs/').then(r => setSpvs(r.data)).catch(() => {})
    } else {
      api.get('/spvs/?status=forming').then(r => setSpvs(r.data)).catch(() => {})
    }
  }, [isEntrepreneur])

  if (isEntrepreneur) {
    return (
      <div>
        {/* Entrepreneur scrolling ads */}
        <ScrollingBanner items={ENTREPRENEUR_ADS} bgColor="bg-gradient-to-r from-brand-800 to-brand-900" textColor="text-gold-400" speed={32} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Welcome banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 rounded-3xl p-8 mb-8 shadow-2xl">
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
                <p className="text-amber-100 text-sm">
                  You're on your way to connecting with global investors. Keep building!
                </p>
              </div>
              <Link to="/submit-pitch"
                className="flex-shrink-0 bg-gradient-to-r from-gold-500 to-yellow-400 hover:from-gold-600 hover:to-yellow-500 text-white font-black px-6 py-3 rounded-xl transition-all shadow-lg hover:scale-105 whitespace-nowrap">
                + Submit New Pitch
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard label="Active Pitches" value={stats.pitches} emoji="📋" gradient="from-brand-600 to-brand-800" />
            <StatCard label="Global Investors" value={stats.investors} emoji="💼" gradient="from-gold-400 to-orange-500" />
            <StatCard label="Courses Available" value={stats.courses} emoji="🎓" gradient="from-green-500 to-teal-600" />
            <StatCard label="Community Posts" value={stats.posts} emoji="💬" gradient="from-purple-500 to-pink-600" />
          </div>

          {/* Quick Links */}
          <h2 className="text-xl font-black text-brand-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {ENTREPRENEUR_QUICK_LINKS.map((l) => <QuickLinkCard key={l.to} {...l} />)}
          </div>

          {/* SPV Activity */}
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
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                      Investors can form a syndicate to fund your startup. Submit a pitch to get started.
                    </p>
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

          {/* Tips & Resources */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-brand-800">Tips & Resources for You</h2>
            <Link to="/education" className="text-brand-700 text-sm font-semibold hover:underline">View all courses →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {ENTREPRENEUR_TIPS.map((item) => <InsightCard key={item.title} item={item} />)}
          </div>

          {/* CTA strip */}
          <div className="bg-gradient-to-r from-gold-500 to-yellow-400 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <p className="text-white font-black text-lg">Ready to find your investor?</p>
              <p className="text-yellow-100 text-sm">Browse 200+ verified US investors looking for startups like yours.</p>
            </div>
            <Link to="/investors" className="flex-shrink-0 bg-brand-800 hover:bg-brand-700 text-white font-black px-6 py-3 rounded-xl transition whitespace-nowrap shadow">
              Browse Investors →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── INVESTOR VIEW ─────────────────────────────────────────────────────────
  return (
    <div>
      {/* Investor scrolling ads */}
      <ScrollingBanner items={INVESTOR_ADS} bgColor="bg-gradient-to-r from-gold-600 to-orange-500" textColor="text-white" speed={32} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-brand-900 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gold-400 opacity-10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Investor Dashboard
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
                Welcome back, {user?.full_name?.split(' ')[0]}! 💼
              </h1>
              <p className="text-gray-300 text-sm">
                You have fresh deal flow waiting. Discover your next investment today.
              </p>
            </div>
            <Link to="/pitches"
              className="flex-shrink-0 bg-gradient-to-r from-gold-500 to-yellow-400 hover:from-gold-600 hover:to-yellow-500 text-white font-black px-6 py-3 rounded-xl transition-all shadow-lg hover:scale-105 whitespace-nowrap">
              View New Pitches →
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Open Pitches" value={stats.pitches} emoji="📋" gradient="from-gold-500 to-orange-500" />
          <StatCard label="Fellow Investors" value={stats.investors} emoji="👥" gradient="from-gray-700 to-gray-900" />
          <StatCard label="Investor Courses" value={stats.courses} emoji="🎓" gradient="from-green-500 to-teal-600" />
          <StatCard label="Forum Activity" value={stats.posts} emoji="💬" gradient="from-purple-500 to-pink-600" />
        </div>

        {/* Quick Links */}
        <h2 className="text-xl font-black text-brand-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {INVESTOR_QUICK_LINKS.map((l) => <QuickLinkCard key={l.to} {...l} />)}
        </div>

        {/* SPVs Forming Now */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-brand-800">Syndicates Forming Now — Join or Lead</h2>
            <div className="flex items-center gap-4">
              <Link to="/spvs" className="text-gold-600 text-sm font-semibold hover:underline">View All Syndicates →</Link>
            </div>
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

        {/* Market Insights */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-brand-800">Market Insights & Deal Flow</h2>
          <Link to="/pitches" className="text-gold-600 text-sm font-semibold hover:underline">Browse all pitches →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {INVESTOR_INSIGHTS.map((item) => <InsightCard key={item.title} item={item} />)}
        </div>

        {/* CTA strip */}
        <div className="bg-gradient-to-r from-gray-900 to-brand-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <p className="text-white font-black text-lg">Don't miss this week's top pitches</p>
            <p className="text-gray-400 text-sm">8 new startups added in sectors you follow — reviewed and quality-checked.</p>
          </div>
          <Link to="/pitches" className="flex-shrink-0 bg-gold-500 hover:bg-gold-600 text-white font-black px-6 py-3 rounded-xl transition whitespace-nowrap shadow">
            View Deal Flow →
          </Link>
        </div>
      </div>
    </div>
  )
}
