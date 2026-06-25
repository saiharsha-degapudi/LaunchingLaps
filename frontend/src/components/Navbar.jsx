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
    <div ref={ref} className="absolute left-0 top-full mt-1 w-44 bg-white border border-zinc-200 rounded-lg shadow-lg shadow-zinc-100 py-1 z-50">
      {links.map(({ to, label }) => (
        <Link key={to} to={to} onClick={onClose}
          className="block px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors">
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
        { to: '/education',           label: 'Learn' },
        { to: '/community',           label: 'Community' },
        { to: '/messages',            label: 'Messages' },
        { to: '/government-schemes',  label: 'Govt Schemes' },
      ]
    : user?.role === 'investor'
    ? [
        { to: '/lead-spv',            label: 'Create Syndicate' },
        { to: '/education',           label: 'Learn' },
        { to: '/community',           label: 'Community' },
        { to: '/messages',            label: 'Messages' },
        { to: '/government-schemes',  label: 'Govt Schemes' },
      ]
    : []

  const navLink = ({ isActive }) =>
    `px-3 py-1.5 rounded-md text-sm transition-colors ${
      isActive
        ? 'text-zinc-900 font-medium bg-zinc-100'
        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
    }`

  return (
    <nav className="bg-white border-b border-zinc-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-14 gap-6">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 select-none">
            <span className="text-zinc-900 text-[15px] font-semibold tracking-tight">
              Launching<span className="text-blue-600">Laps</span>
            </span>
          </Link>

          {/* Desktop primary links */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {isAuthenticated && (
              <>
                {user?.role === 'admin' && (
                  <NavLink to="/admin" className={navLink}>Admin</NavLink>
                )}
                {user?.role === 'audit' && (
                  <NavLink to="/audit" className={navLink}>Audit Dashboard</NavLink>
                )}
                {(user?.role === 'entrepreneur' || user?.role === 'investor') && (
                  <>
                    {primaryLinks.map(({ to, label }) => (
                      <NavLink key={to} to={to} className={navLink}>{label}</NavLink>
                    ))}

                    {moreLinks.length > 0 && (
                      <div className="relative ml-0.5">
                        <button
                          onClick={() => setMoreOpen(v => !v)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                            moreOpen ? 'text-zinc-900 bg-zinc-100' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                          }`}
                        >
                          More
                          <svg className={`w-3 h-3 transition-transform ${moreOpen ? 'rotate-180' : ''}`}
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
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0">
                    {user?.full_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="leading-none">
                    <p className="text-zinc-900 text-[13px] font-medium">{user?.full_name?.split(' ')[0]}</p>
                    <p className="text-zinc-400 text-[11px] capitalize mt-0.5">{user?.role}</p>
                  </div>
                </div>
                <button onClick={handleLogout}
                  className="text-xs text-zinc-500 hover:text-zinc-900 font-medium px-3 py-1.5 rounded-md border border-zinc-200 hover:bg-zinc-50 transition-colors">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login?type=entrepreneur"
                  className="text-sm text-zinc-600 hover:text-zinc-900 font-medium transition-colors">
                  Sign in
                </Link>
                <Link to="/login?type=investor"
                  className="bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-zinc-500 hover:text-zinc-900 flex-shrink-0 transition-colors"
            onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white px-6 py-4 flex flex-col gap-0.5">
          {isAuthenticated ? (
            <>
              {[...primaryLinks, ...moreLinks].map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-md transition-colors">
                  {label}
                </Link>
              ))}
              <div className="border-t border-zinc-100 mt-3 pt-3 flex items-center justify-between">
                <div>
                  <p className="text-zinc-900 text-sm font-medium">{user?.full_name}</p>
                  <p className="text-zinc-400 text-xs capitalize">{user?.role}</p>
                </div>
                <button onClick={handleLogout}
                  className="text-sm text-zinc-500 hover:text-zinc-900 font-medium transition-colors">
                  Log out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login?type=entrepreneur" onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 rounded-md transition-colors">
                Sign in as Entrepreneur
              </Link>
              <Link to="/login?type=investor" onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 rounded-md transition-colors">
                Sign in as Investor
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
