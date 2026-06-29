import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useRef, useEffect } from 'react'

function MoreDropdown({ links, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div ref={ref} className="absolute left-0 top-full mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-1 z-50">
      {links.map(({ to, label }) => (
        <Link key={to} to={to} onClick={onClose}
          className="block px-4 py-2.5 text-sm text-gray-600 hover:text-brand-800 hover:bg-brand-50 transition-colors">
          {label}
        </Link>
      ))}
    </div>
  )
}

export default function Navbar() {
  const { user, login, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  const [demoLoading, setDemoLoading] = useState(null)

  function handleLogout() { logout(); navigate('/') }

  async function loginAsDemo(role) {
    const creds = role === 'entrepreneur'
      ? { email: 'maya@ecodeliver.com', password: 'password123' }
      : { email: 'sarah@greencap.vc', password: 'password123' }
    setDemoLoading(role)
    try {
      await login(creds.email, creds.password)
      window.location.href = '/dashboard'
    } catch {
      window.location.href = '/login' + (role === 'investor' ? '?type=investor' : '')
    } finally {
      setDemoLoading(null)
    }
  }

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-gold-400 font-semibold border-b-2 border-gold-400 pb-0.5'
      : 'text-brand-100 hover:text-white transition-colors'

  const primaryLinks = user?.role === 'entrepreneur'
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/pitches',   label: 'Pitches' },
        { to: '/spvs',      label: 'Syndicates' },
        { to: '/investors', label: 'Investors' },
      ]
    : user?.role === 'investor'
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/pitches',   label: 'Deal Flow' },
        { to: '/spvs',      label: 'Syndicates' },
        { to: '/investors', label: 'Network' },
      ]
    : []

  const moreLinks = user?.role === 'entrepreneur'
    ? [
        { to: '/data-room',           label: '📁 Data Room' },
        { to: '/founder-updates',     label: '📢 Investor Updates' },
        { to: '/investor-interest',   label: '👥 Investor Activity' },
        { to: '/audit-feedback',      label: '🔍 Audit Feedback' },
        { to: '/company-profile',     label: '🏢 Company Profile' },
        { to: '/education',           label: '📚 Learn' },
        { to: '/community',           label: '💬 Community' },
        { to: '/messages',            label: '✉️ Messages' },
        { to: '/government-schemes',  label: '🏛️ Govt Schemes' },
        { to: '/settings',            label: '⚙️ Settings' },
      ]
    : user?.role === 'investor'
    ? [
        { to: '/watchlist',             label: '🔖 Watchlist' },
        { to: '/portfolio',             label: '📊 Portfolio' },
        { to: '/investor-verification', label: '✅ Verification' },
        { to: '/lead-spv',              label: '🤝 Create Syndicate' },
        { to: '/education',             label: '📚 Learn' },
        { to: '/community',             label: '💬 Community' },
        { to: '/messages',              label: '✉️ Messages' },
        { to: '/settings',              label: '⚙️ Settings' },
      ]
    : []

  return (
    <nav className="bg-brand-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-gold-400 text-2xl font-black tracking-tight">
              Launching<span className="text-white">Laps</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm flex-1 ml-8">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <NavLink to="/admin" className={linkClass}>Admin</NavLink>
                )}
                {user?.role === 'audit' && (
                  <NavLink to="/audit" className={linkClass}>Audit Dashboard</NavLink>
                )}
                {(user?.role === 'entrepreneur' || user?.role === 'investor') && (
                  <>
                    {primaryLinks.map(({ to, label }) => (
                      <NavLink key={to} to={to} className={linkClass}>{label}</NavLink>
                    ))}

                    {moreLinks.length > 0 && (
                      <div className="relative">
                        <button
                          onClick={() => setMoreOpen(v => !v)}
                          className={`flex items-center gap-1 transition-colors ${
                            moreOpen ? 'text-white' : 'text-brand-100 hover:text-white'
                          }`}
                        >
                          More
                          <svg className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {moreOpen && <MoreDropdown links={moreLinks} onClose={() => setMoreOpen(false)} />}
                      </div>
                    )}
                  </>
                )}
              </>
            ) : null}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4 border-l border-brand-700 pl-6 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <span className="text-brand-200 text-xs">
                  {user?.full_name} &middot; <span className="capitalize text-gold-400">{user?.role}</span>
                </span>
                <button onClick={handleLogout}
                  className="bg-brand-700 hover:bg-brand-600 text-white text-xs px-3 py-1.5 rounded-lg transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-sm text-brand-200 hover:text-white transition-colors">
                  Sign In
                </Link>
                <button
                  onClick={() => loginAsDemo('entrepreneur')}
                  disabled={!!demoLoading}
                  className="text-sm font-bold px-4 py-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                  {demoLoading === 'entrepreneur' ? '...' : '🚀 Entrepreneur'}
                </button>
                <button
                  onClick={() => loginAsDemo('investor')}
                  disabled={!!demoLoading}
                  className="text-sm font-bold px-4 py-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
                  style={{ background: '#f59e0b', color: '#000' }}>
                  {demoLoading === 'investor' ? '...' : '💼 Investor'}
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white flex-shrink-0"
            onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-900 border-t border-brand-700 px-4 pb-4 flex flex-col gap-3 text-sm">
          {isAuthenticated ? (
            <>
              {[...primaryLinks, ...moreLinks].map(({ to, label }) => (
                <NavLink key={to} to={to} className={linkClass} onClick={() => setMobileOpen(false)}>{label}</NavLink>
              ))}
              <button onClick={handleLogout} className="text-left text-red-400 hover:text-red-300">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => { loginAsDemo('entrepreneur'); setMobileOpen(false) }}
                disabled={!!demoLoading}
                className="text-left text-sm font-bold text-white disabled:opacity-50">
                {demoLoading === 'entrepreneur' ? 'Signing in...' : '🚀 Entrepreneur'}
              </button>
              <button onClick={() => { loginAsDemo('investor'); setMobileOpen(false) }}
                disabled={!!demoLoading}
                className="text-left text-sm font-bold text-gold-400 disabled:opacity-50">
                {demoLoading === 'investor' ? 'Signing in...' : '💼 Investor'}
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
