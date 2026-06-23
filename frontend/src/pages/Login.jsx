import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'

const LAP_VEHICLES = [
  { emoji: '🚲', label: 'Bicycle',   dur: '5s'   },
  { emoji: '🚗', label: 'Car',       dur: '3.5s' },
  { emoji: '🚄', label: 'Train',     dur: '2.5s' },
  { emoji: '✈️', label: 'Aeroplane', dur: '1.8s' },
  { emoji: '🚀', label: 'Rocket',    dur: '1s'   },
]

const MAP_CITIES = [
  { name: 'NewYork',    x: 72,  y: 38, delay: '0s'   },
  { name: 'London',     x: 122, y: 24, delay: '0.5s'  },
  { name: 'Dubai',      x: 158, y: 46, delay: '1s'    },
  { name: 'Mumbai',     x: 170, y: 50, delay: '1.5s'  },
  { name: 'SaoPaulo',   x: 86,  y: 80, delay: '2s'    },
  { name: 'Tokyo',      x: 218, y: 36, delay: '2.5s'  },
  { name: 'Sydney',     x: 216, y: 84, delay: '3s'    },
  { name: 'Nairobi',    x: 148, y: 65, delay: '3.5s'  },
  { name: 'Singapore',  x: 198, y: 66, delay: '4s'    },
  { name: 'Berlin',     x: 132, y: 20, delay: '4.5s'  },
]
const HUB = { x: 130, y: 50 }

function GlobalMap({ color }) {
  return (
    <svg viewBox="0 0 260 108" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <defs>
        {/* Hidden paths for animateMotion */}
        {MAP_CITIES.map(c => {
          const mx = (HUB.x + c.x) / 2
          const my = Math.min(HUB.y, c.y) - 18
          return <path key={c.name} id={`mp-${c.name}`} d={`M ${HUB.x},${HUB.y} Q ${mx},${my} ${c.x},${c.y}`} />
        })}
      </defs>

      {/* Background */}
      <rect width="260" height="108" rx="6" fill="rgba(0,0,0,0.35)" />

      {/* Latitude/longitude grid */}
      {[0,1,2,3,4,5].map(i => (
        <line key={`h${i}`} x1="0" y1={i*21} x2="260" y2={i*21} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
      ))}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
        <line key={`v${i}`} x1={i*22} y1="0" x2={i*22} y2="108" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
      ))}

      {/* Continent silhouettes */}
      {/* North America */}
      <polygon points="28,14 96,14 93,27 86,38 89,50 79,58 69,58 61,52 49,54 39,47 28,37" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4"/>
      {/* South America */}
      <polygon points="68,58 94,58 99,68 101,80 97,95 86,100 76,95 70,82 65,70" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4"/>
      {/* Europe */}
      <polygon points="116,14 150,14 153,24 146,32 138,34 127,31 119,24" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4"/>
      {/* Africa */}
      <polygon points="120,38 154,38 160,50 162,65 157,80 150,90 136,90 122,80 118,65 118,50" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4"/>
      {/* Asia */}
      <polygon points="148,11 232,11 240,24 232,37 222,44 212,47 202,68 194,70 186,60 176,54 168,49 158,47 148,34 142,24" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4"/>
      {/* Australia */}
      <polygon points="198,72 228,72 234,82 226,92 210,94 198,88 195,78" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4"/>

      {/* Connection lines hub → cities */}
      {MAP_CITIES.map(c => {
        const mx = (HUB.x + c.x) / 2
        const my = Math.min(HUB.y, c.y) - 18
        return (
          <g key={c.name}>
            <path d={`M ${HUB.x},${HUB.y} Q ${mx},${my} ${c.x},${c.y}`}
              fill="none" stroke={color} strokeWidth="0.7"
              strokeDasharray="3 4" opacity="0.22" />
            {/* Traveling dot */}
            <circle r="1.8" fill={color} opacity="0.8">
              <animateMotion dur="2.5s" repeatCount="indefinite" begin={c.delay}>
                <mpath href={`#mp-${c.name}`} />
              </animateMotion>
            </circle>
          </g>
        )
      })}

      {/* Hub: LaunchingLaps */}
      <circle cx={HUB.x} cy={HUB.y} r="5" fill={color} opacity="0.95"/>
      <circle cx={HUB.x} cy={HUB.y} r="5" fill={color} opacity="0">
        <animate attributeName="r" values="5;13;5" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.45;0;0.45" dur="2s" repeatCount="indefinite"/>
      </circle>
      <text x={HUB.x} y={HUB.y+1.8} textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize="4.5" fontWeight="900">LL</text>

      {/* City dots */}
      {MAP_CITIES.map(c => (
        <g key={c.name}>
          <circle cx={c.x} cy={c.y} r="2.2" fill={color} opacity="0.7"/>
          <circle cx={c.x} cy={c.y} r="2.2" fill={color} opacity="0">
            <animate attributeName="r" values="2.2;6;2.2" dur="3s" repeatCount="indefinite" begin={c.delay}/>
            <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" begin={c.delay}/>
          </circle>
        </g>
      ))}

      {/* Footer label */}
      <text x="130" y="105" textAnchor="middle" fill="white" fontSize="5"
        opacity="0.2" fontWeight="700" letterSpacing="3">GLOBAL NETWORK · 60+ COUNTRIES</text>
    </svg>
  )
}

function LapVehicleCycler({ color = '#f59e0b' }) {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const pathId = `road-${color.replace(/[^a-z0-9]/gi, '')}`

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % LAP_VEHICLES.length)
        setVisible(true)
      }, 350)
    }, 2800)
    return () => clearInterval(t)
  }, [])

  const v = LAP_VEHICLES[idx]

  return (
    <div className="w-full">
      <svg viewBox="0 0 260 30" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <defs>
          <path id={pathId} d="M 8,15 L 250,15" />
        </defs>

        {/* Road surface */}
        <rect x="0" y="4" width="260" height="22" rx="3" fill="rgba(255,255,255,0.06)" />
        <rect x="0" y="4" width="260" height="22" rx="3"
          stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
        <line x1="0" y1="5" x2="260" y2="5" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7"/>
        <line x1="0" y1="25" x2="260" y2="25" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7"/>
        <line x1="0" y1="15" x2="260" y2="15"
          stroke={color} strokeWidth="0.8" strokeDasharray="13 9" opacity="0.28" />

        {/* Checkered finish flag — right */}
        {[0,1,2,3].map(r => [0,1].map(c => (
          <rect key={`f${r}${c}`} x={248+c*6} y={4+r*5.5}
            width="6" height="5.5"
            fill={(r+c)%2===0 ? 'white' : '#111'} opacity="0.4"/>
        )))}

        {/* Glow trail */}
        <circle r="3.5" fill={color} opacity="0.1">
          <animateMotion dur={v.dur} repeatCount="indefinite" begin="0.18s">
            <mpath href={`#${pathId}`}/>
          </animateMotion>
        </circle>

        {/* Vehicle — flipped to face right */}
        <g style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.35s' }}>
          <animateMotion dur={v.dur} repeatCount="indefinite">
            <mpath href={`#${pathId}`}/>
          </animateMotion>
          <text fontSize="15" textAnchor="middle" dominantBaseline="middle"
            transform="scale(-1,1)">
            {v.emoji}
          </text>
        </g>
      </svg>
    </div>
  )
}

const ENTREPRENEUR_PANEL = {
  bg: 'from-[#0d1b3e] to-[#1a2f5e]',
  accent: 'text-gold-400',
  badge: 'bg-white/10 border-white/20 text-white',
  badgeDot: 'bg-green-400',
  badgeText: 'Live Platform · Open to All',
  headline: <>Turn Your Idea Into a<br />Funded <span className="text-gold-400">Startup</span></>,
  sub: 'Submit your pitch, get discovered by global investors, and close your funding round — all from one platform. LaunchingLaps gives every entrepreneur a fair shot.',
  features: [
    { icon: '🎯', text: 'AI-powered pitch readiness scoring' },
    { icon: '🔍', text: 'Independent audit team review' },
    { icon: '💰', text: 'Direct investor matching & SPV tools' },
  ],
  carColor: '#f59e0b',
  lapLabel: 'WIN YOUR FUNDING LAP',
  lapSub: 'Every great startup begins with one pitch',
}

const INVESTOR_PANEL = {
  bg: 'from-[#1a0a00] to-[#2d1500]',
  accent: 'text-orange-400',
  badge: 'bg-white/10 border-white/20 text-white',
  badgeDot: 'bg-orange-400',
  badgeText: 'Exclusive Deal Flow · 340+ Investors',
  headline: <>Lead Syndicates.<br />Earn <span className="text-orange-400">Carried Interest.</span></>,
  sub: 'Access curated deal flow, form syndicates, and invest from $5K. Build a global portfolio with the best founders across 60+ countries.',
  features: [
    { icon: '📊', text: 'Curated, audit-verified deal flow' },
    { icon: '🤝', text: 'Form syndicates — one cap table entry' },
    { icon: '💹', text: 'Earn 20% carry on syndicate returns' },
  ],
  carColor: '#ff6600',
  lapLabel: 'WIN YOUR INVESTMENT LAP',
  lapSub: 'Back the next big thing before anyone else',
}

const STATS = [
  { value: '2,400+', label: 'Startups Registered' },
  { value: '$48M+', label: 'Funding Facilitated' },
  { value: '340+', label: 'Active Investors' },
  { value: '18', label: 'Industries Covered' },
]

const DEMO_ACCOUNTS = [
  {
    role: 'Entrepreneur',
    name: 'Maya Chen',
    email: 'maya@ecodeliver.com',
    password: 'password123',
    icon: '🚀',
    desc: 'EcoDeliver · Green Tech Founder',
    accent: 'from-brand-800 to-brand-700',
    badge: 'bg-blue-100 text-blue-800',
  },
  {
    role: 'Investor',
    name: 'Sarah Williams',
    email: 'sarah@greencap.vc',
    password: 'password123',
    icon: '💼',
    desc: 'GreenCap Ventures · Partner',
    accent: 'from-amber-600 to-yellow-500',
    badge: 'bg-amber-100 text-amber-800',
  },
  {
    role: 'Audit',
    name: 'Audit Team',
    email: 'audit@launchinglaps.com',
    password: 'audit123',
    icon: '🔍',
    desc: 'LaunchingLaps · Internal Audit',
    accent: 'from-gray-700 to-gray-600',
    badge: 'bg-gray-100 text-gray-700',
  },
]

export default function Login() {
  const { login, googleLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'
  const searchParams = new URLSearchParams(location.search)
  const loginType = searchParams.get('type') // 'entrepreneur' | 'investor' | null
  const panel = loginType === 'investor' ? INVESTOR_PANEL : ENTREPRENEUR_PANEL

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.response?.data?.detail || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function loginAsDemo(account) {
    setLoading(true)
    setError('')
    setForm({ email: account.email, password: account.password })
    try {
      const loggedUser = await login(account.email, account.password)
      navigate(loggedUser?.role === 'audit' ? '/audit' : '/dashboard', { replace: true })
    } catch {
      setError('Demo login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Left themed panel */}
      <div className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br ${panel.bg} flex-col justify-between p-8 relative overflow-hidden`}>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="lgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lgrid)" />
          </svg>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5" />

        {/* Logo row */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center shadow">
              <span className="text-white font-black text-sm">L</span>
            </div>
            <span className="text-white font-black text-xl tracking-tight">
              Launching<span className="text-gold-400">Laps</span>
            </span>
          </div>
          <div className={`inline-flex items-center gap-1.5 border rounded-full px-3 py-1 ${panel.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${panel.badgeDot}`} />
            <span className="text-[10px] font-semibold tracking-wide">{panel.badgeText}</span>
          </div>
        </div>

        {/* Lap track */}
        <div className="relative z-10 mt-3">
          <p className="text-white/25 text-[8px] font-black tracking-[0.2em] uppercase mb-1">🏁 {panel.lapLabel}</p>
          <LapVehicleCycler color={panel.carColor} />
        </div>

        {/* Headline + sub */}
        <div className="relative z-10 mt-3">
          <h1 className="text-2xl font-black text-white leading-tight mb-1">{panel.headline}</h1>
          <p className="text-white/50 text-xs leading-relaxed">{panel.sub}</p>
        </div>

        {/* Features — compact horizontal */}
        <div className="relative z-10 mt-3 flex flex-col gap-1.5">
          {panel.features.map(f => (
            <div key={f.text} className="flex items-center gap-2">
              <span className="text-xs">{f.icon}</span>
              <span className="text-white/60 text-xs">{f.text}</span>
            </div>
          ))}
        </div>

        {/* Global map — takes remaining space */}
        <div className="relative z-10 mt-3 flex-1 min-h-0">
          <GlobalMap color={panel.carColor} />
        </div>

        {/* Stats row */}
        <div className="relative z-10 mt-3 grid grid-cols-4 gap-2">
          {STATS.map(s => (
            <div key={s.label} className="bg-white/8 border border-white/10 rounded-lg px-2 py-2 text-center">
              <div className={`font-black text-sm ${panel.accent}`}>{s.value}</div>
              <div className="text-white/40 text-[9px] mt-0.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-6 bg-white overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-brand-800 flex items-center justify-center">
              <span className="text-white font-black text-xs">L</span>
            </div>
            <span className="text-brand-800 font-black text-lg">
              Launching<span className="text-gold-500">Laps</span>
            </span>
          </div>
          <div className="mb-4">
            <h2 className="text-2xl font-black text-gray-900">Sign in</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              New here?{' '}
              <Link to="/register" className="text-brand-700 font-semibold hover:underline">
                Create a free account →
              </Link>
            </p>
          </div>
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          <div className="flex justify-center mb-3">
            <GoogleLogin
              onSuccess={async ({ credential }) => {
                setLoading(true); setError('')
                try { await googleLogin(credential); navigate(from, { replace: true }) }
                catch { setError('Google sign-in failed. Please try again.') }
                finally { setLoading(false) }
              }}
              onError={() => setError('Google sign-in failed. Please try again.')}
              shape="rectangular" size="large" width="400" text="continue_with"
            />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 mb-3">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" required value={form.email}
                onChange={handleChange} placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:bg-white transition-all" />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password" required value={form.password}
                  onChange={handleChange} placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:bg-white transition-all" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 px-6 bg-brand-800 hover:bg-brand-700 text-white font-bold rounded-lg
                transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading
                ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Signing in…</>
                : <>Sign In <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
              }
            </button>
          </form>
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Try a demo</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button key={acc.email} onClick={() => loginAsDemo(acc)} disabled={loading}
                  className="group flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 border-gray-100
                    hover:border-brand-200 hover:bg-brand-50 transition-all disabled:opacity-50 text-center">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${acc.accent} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <span className="text-sm">{acc.icon}</span>
                  </div>
                  <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${acc.badge}`}>{acc.role}</div>
                </button>
              ))}
            </div>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-3 leading-relaxed">
            By signing in you agree to our{' '}
            <span className="text-brand-600 hover:underline cursor-pointer">Terms</span>
            {' '}&{' '}
            <span className="text-brand-600 hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}
