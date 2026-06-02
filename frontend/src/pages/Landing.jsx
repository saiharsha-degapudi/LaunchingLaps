import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import ScrollingBanner from '../components/ScrollingBanner'

const TICKER_ITEMS = [
  '🚀 500+ Founders already funded globally',
  '💼 200+ Verified Investors worldwide',
  '📚 50+ Business Courses',
  '🌍 Entrepreneurs from 60+ countries',
  '🔥 New pitches added every day',
  '🎓 Free business education for all members',
  '⚡ Fast-track your funding journey',
  '🤝 Trusted by investors in 30+ countries',
]

const HOW_IT_WORKS_ENTREPRENEUR = [
  { step: '01', title: 'Create Your Profile', desc: 'Sign up as an entrepreneur and tell us about your startup — industry, stage, and vision.' },
  { step: '02', title: 'Submit Your Pitch', desc: 'Upload your pitch with funding goals, deck link, and business overview.' },
  { step: '03', title: 'Get Discovered', desc: 'US investors browse and filter pitches. Get notified when someone expresses interest.' },
  { step: '04', title: 'Close the Deal', desc: 'Connect directly, negotiate terms, and close your deal with global investor backing.' },
]

const HOW_IT_WORKS_INVESTOR = [
  { step: '01', title: 'Join as Investor', desc: 'Set up your investor profile with your focus industries, stage preferences, and ticket size.' },
  { step: '02', title: 'Browse Deal Flow', desc: 'Filter pitches by industry, funding stage, and amount. See only what matches your thesis.' },
  { step: '03', title: 'Express Interest', desc: 'Shortlist startups and send an interest signal. Connect with founders directly.' },
  { step: '04', title: 'Build Your Portfolio', desc: 'Track your deals, communicate with founders, and grow a diversified global portfolio.' },
]

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Founder, MediReach',
    avatar: '👩‍💼',
    quote: 'LaunchingLaps helped me connect with 3 global investors in my first week. The platform is incredibly easy to use and the education courses gave me the confidence to pitch professionally.',
  },
  {
    name: 'James Okafor',
    role: 'Angel Investor, NY',
    avatar: '👨‍💰',
    quote: 'The deal flow quality here is exceptional. I find well-prepared entrepreneurs with clear pitches — far better than traditional networks. Invested in two startups within a month.',
  },
  {
    name: 'Carlos Rivera',
    role: 'Founder, GreenLogix',
    avatar: '🧑‍🚀',
    quote: 'The business courses alone are worth it. Learning how US investors think changed how I structured my pitch. Closed a $250k seed round through a connection made here.',
  },
]

const SECTORS = ['🤖 Artificial Intelligence', '🌿 Green Tech', '🏥 HealthTech', '💰 FinTech', '🛒 E-Commerce', '🏗️ PropTech', '📱 SaaS', '🎓 EdTech']

function TestimonialCard({ t }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col gap-4">
      <p className="text-gray-600 text-sm leading-relaxed italic">"{t.quote}"</p>
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-gold-500 flex items-center justify-center text-lg">{t.avatar}</div>
        <div>
          <p className="font-bold text-brand-800 text-sm">{t.name}</p>
          <p className="text-gray-400 text-xs">{t.role}</p>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const [activeTab, setActiveTab] = useState('entrepreneur')

  return (
    <div className="flex flex-col">

      {/* Live activity ticker */}
      <ScrollingBanner items={TICKER_ITEMS} bgColor="bg-brand-900" textColor="text-gold-300" speed={30} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-blue-900 text-white py-28 px-4">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500 opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 opacity-10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-gold-300 text-xs font-bold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Live Platform · 60+ Countries
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
            Where Ambitious Ideas{' '}
            <span className="bg-gradient-to-r from-gold-400 to-yellow-300 bg-clip-text text-transparent">
              Meet Global Capital
            </span>
          </h1>

          <p className="text-blue-200 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            LaunchingLaps connects entrepreneurs worldwide with global investors through structured investment syndicates — raise smarter, invest together, grow faster.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Link to="/register" className="bg-gradient-to-r from-gold-500 to-yellow-400 hover:from-gold-600 hover:to-yellow-500 text-white font-black text-base px-10 py-4 rounded-xl transition-all shadow-lg shadow-gold-500/30 hover:scale-105">
              🚀 Raise Funding
            </Link>
            <Link to="/register" state={{ defaultRole: 'investor' }}
              className="bg-white/10 backdrop-blur border-2 border-white/30 hover:bg-white/20 text-white font-black text-base px-10 py-4 rounded-xl transition-all hover:scale-105">
              💼 Invest in Startups
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[['500+', 'Founders'], ['200+', 'Global Investors'], ['$12M+', 'Deployed']].map(([v, l]) => (
              <div key={l} className="bg-white/10 backdrop-blur rounded-2xl py-4 border border-white/10">
                <p className="text-2xl sm:text-3xl font-black text-gold-400">{v}</p>
                <p className="text-blue-300 text-xs sm:text-sm mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scrolling sectors */}
      <ScrollingBanner items={SECTORS} bgColor="bg-gradient-to-r from-brand-700 to-brand-800" textColor="text-white" speed={25} />

      {/* How it works */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-brand-800 mb-3">How It Works</h2>
            <p className="text-gray-500 text-lg">A simple 4-step journey — whether you're raising or investing.</p>
          </div>

          {/* Tab toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl p-1.5 shadow-md border border-gray-100 inline-flex gap-2">
              <button onClick={() => setActiveTab('entrepreneur')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'entrepreneur' ? 'bg-brand-800 text-white shadow' : 'text-gray-500 hover:text-brand-800'}`}>
                🚀 Entrepreneur
              </button>
              <button onClick={() => setActiveTab('investor')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'investor' ? 'bg-gold-500 text-white shadow' : 'text-gray-500 hover:text-gold-600'}`}>
                💼 Investor
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeTab === 'entrepreneur' ? HOW_IT_WORKS_ENTREPRENEUR : HOW_IT_WORKS_INVESTOR).map((item) => (
              <div key={item.step} className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`text-4xl font-black mb-4 ${activeTab === 'entrepreneur' ? 'text-brand-100' : 'text-gold-100'}`}>{item.step}</div>
                <h3 className="font-bold text-brand-800 text-base mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${activeTab === 'entrepreneur' ? 'bg-brand-800' : 'bg-gold-500'}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gradient-to-br from-brand-800 to-brand-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Real People, Real Results</h2>
            <p className="text-blue-300 text-lg">Join thousands already building their future on LaunchingLaps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => <TestimonialCard key={t.name} t={t} />)}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-brand-800 mb-3">Everything in One Platform</h2>
            <p className="text-gray-500 text-lg">No more jumping between tools. LaunchingLaps does it all.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: '🏦', title: 'Investment Syndicates', desc: 'Pool capital from multiple investors into a single legal entity. Founders get one clean cap table entry — simple, fast, professional.', color: 'from-blue-500 to-brand-700' },
              { emoji: '🎯', title: 'Lead a Syndicate', desc: 'Experienced investors lead syndicates, earn carried interest, and build a portfolio with smaller individual checks.', color: 'from-gold-400 to-orange-500' },
              { emoji: '✅', title: 'Clean Cap Table', desc: 'Founders keep equity management simple. One syndicate = one investor on your cap table, no matter how many backers.', color: 'from-green-400 to-teal-500' },
              { emoji: '💬', title: 'Community Forum', desc: 'Ask questions, share wins, and learn from a global community of entrepreneurs.', color: 'from-purple-400 to-pink-500' },
              { emoji: '📨', title: 'Direct Messaging', desc: 'Secure, private conversations between founders and investors — right on the platform.', color: 'from-red-400 to-rose-500' },
              { emoji: '📊', title: 'Deal Dashboard', desc: 'Track expressions of interest, manage follow-ups, and close deals faster.', color: 'from-brand-500 to-cyan-500' },
            ].map((f) => (
              <div key={f.title} className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4 shadow-md`}>
                  {f.emoji}
                </div>
                <h3 className="font-bold text-brand-800 text-base mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-gold-500 via-yellow-400 to-gold-500 py-20 px-4">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-black text-white mb-4 drop-shadow">Your next chapter starts here.</h2>
          <p className="text-yellow-100 text-lg mb-8">
            Join LaunchingLaps free — submit your pitch to global investors or discover your next investment opportunity in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-brand-800 hover:bg-brand-700 text-white font-black px-10 py-4 rounded-xl transition shadow-xl hover:scale-105">
              🚀 Start as Entrepreneur
            </Link>
            <Link to="/register" state={{ defaultRole: 'investor' }} className="bg-white hover:bg-gray-50 text-brand-800 font-black px-10 py-4 rounded-xl transition shadow-xl hover:scale-105">
              💼 Start as Investor
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
