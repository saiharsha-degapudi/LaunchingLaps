import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useRef, useEffect } from 'react'

function MoreDropdown({ links, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 z-50 overflow-hidden">
      {links.map(({ to, label }) => (
        <Link key={to} to={to} onClick={onClose}
          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-800 transition-colors">
          {label}
        </Link>
      ))}
    </div>
  )
}

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  function handleLogout() { logout(); navigate('/') }

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-gold-400 font-semibold border-b-2 border-gold-400 pb-0.5 whitespace-nowrap'
      : 'text-brand-100 hover:text-white transition-colors whitespace-nowrap'

  const primaryLinks = user?.role === 'entrepreneur'
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/pitches', label: 'Pitches' },
        { to: '/spvs', label: 'Syndicates' },
        { to: '/investors', label: 'Investors' },
      ]
    : user?.role === 'investor'
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/pitches', label: 'Deal Flow' },
        { to: '/spvs', label: 'Syndicates' },
        { to: '/investors', label: 'Network' },
      ]
    : []

  const moreLinks = user?.role === 'entrepreneur'
    ? [
        { to: '/education', label: 'Learn' },
        { to: '/community', label: 'Community' },
        { to: '/messages', label: 'Messages' },
        { to: '/government-schemes', label: 'Govt Schemes' },
      ]
    : user?.role === 'investor'
    ? [
        { to: '/lead-spv', label: 'Create Syndicate' },
        { to: '/education', label: 'Learn' },
        { to: '/community', label: 'Community' },
        { to: '/messages', label: 'Messages' },
        { to: '/government-schemes', label: 'Govt Schemes' },
      ]
    : []

  const allMobileLinks = [...primaryLinks, ...moreLinks]

  return (
    <nav className="bg-brand-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-gold-400 text-xl font-black tracking-tight">
              Launching<span className="text-white">Laps</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 flex-1 text-sm">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <NavLink to="/admin" className={linkClass}>Admin Dashboard</NavLink>
                ) : user?.role === 'audit' ? (
                  <NavLink to="/audit" className={linkClass}>Audit Dashboard</NavLink>
                ) : (
                  <>
                    {/* Primary links */}
                    <div className="flex items-center gap-1">
                      {primaryLinks.map(({ to, label }) => (
                        <NavLink key={to} to={to} className={({ isActive }) =>
                          `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                            isActive
                              ? 'bg-white/10 text-white'
                              : 'text-brand-100 hover:bg-white/8 hover:text-white'
                          }`
                        }>{label}</NavLink>
                      ))}
                    </div>

                    {/* More dropdown */}
                    {moreLinks.length > 0 && (
                      <div className="relative ml-1">
                        <button
                          onClick={() => setMoreOpen(v => !v)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                            moreOpen ? 'bg-white/10 text-white' : 'text-brand-100 hover:bg-white/8 hover:text-white'
                          }`}
                        >
                          More
                          <svg className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
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

          {/* Right: user info + CTA */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white font-black text-sm">
                    {user?.full_name?.[0] || '?'}
                  </div>
                  <div className="text-right">
                    <p className="text-white text-xs font-semibold leading-none">{user?.full_name?.split(' ')[0]}</p>
                    <p className="text-gold-400 text-[10px] capitalize leading-none mt-0.5">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/15 transition-colors whitespace-nowrap"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login?type=entrepreneur"
                  className="flex items-center gap-1.5 text-sm font-semibold text-brand-100 hover:text-white transition-colors">
                  🚀 Entrepreneur
                </Link>
                <Link to="/login?type=investor"
                  className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-white font-semibold px-4 py-2 rounded-lg transition text-sm">
                  💼 Investor
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white flex-shrink-0" onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">
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
        <div className="md:hidden bg-brand-900 border-t border-brand-700 px-4 py-3 flex flex-col gap-1 text-sm">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' ? (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-brand-100 hover:text-white font-medium">Admin Dashboard</Link>
              ) : user?.role === 'audit' ? (
                <Link to="/audit" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-brand-100 hover:text-white font-medium">Audit Dashboard</Link>
              ) : (
                allMobileLinks.map(({ to, label }) => (
                  <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 text-brand-100 hover:text-white hover:bg-white/8 rounded-lg font-medium transition-colors">
                    {label}
                  </Link>
                ))
              )}
              <div className="border-t border-brand-700 mt-2 pt-2 flex items-center justify-between px-3">
                <div>
                  <p className="text-white text-xs font-semibold">{user?.full_name}</p>
                  <p className="text-gold-400 text-[10px] capitalize">{user?.role}</p>
                </div>
                <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 font-semibold">Log out</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login?type=entrepreneur" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-brand-100">🚀 Entrepreneur</Link>
              <Link to="/login?type=investor" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-gold-400 font-semibold">💼 Investor</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
