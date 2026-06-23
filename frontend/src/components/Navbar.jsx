import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-gold-400 font-semibold border-b-2 border-gold-400 pb-0.5'
      : 'text-brand-100 hover:text-white transition-colors'

  return (
    <nav className="bg-brand-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-gold-400 text-2xl font-black tracking-tight">
              Launching<span className="text-white">Laps</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            {isAuthenticated ? (
              <>
                {user?.role === 'audit' ? (
                  <NavLink to="/audit" className={linkClass}>Audit Dashboard</NavLink>
                ) : (
                  <>
                    <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
                    <NavLink to="/pitches" className={linkClass}>Pitches</NavLink>
                    <NavLink to="/spvs" className={linkClass}>Syndicates</NavLink>
                    {user?.role === 'investor' && (
                      <NavLink to="/lead-spv" className={linkClass}>Create Syndicate</NavLink>
                    )}
                    <NavLink to="/investors" className={linkClass}>Investors</NavLink>
                    <NavLink to="/education" className={linkClass}>Learn</NavLink>
                    <NavLink to="/community" className={linkClass}>Community</NavLink>
                    <NavLink to="/messages" className={linkClass}>Messages</NavLink>
                    <NavLink to="/government-schemes" className={linkClass}>Govt Schemes</NavLink>
                  </>
                )}

                <div className="ml-4 flex items-center gap-3 border-l border-brand-700 pl-4">
                  <span className="text-brand-200 text-xs">
                    {user?.full_name} &middot; <span className="capitalize text-gold-400">{user?.role}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-brand-700 hover:bg-brand-600 text-white text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login?type=entrepreneur"
                  className="flex items-center gap-1.5 text-sm font-semibold text-brand-100 hover:text-gold-400 transition-colors"
                >
                  <span>🚀</span> Entrepreneur
                </Link>
                <Link
                  to="/login?type=investor"
                  className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-white font-semibold px-4 py-2 rounded-lg transition text-sm"
                >
                  <span>💼</span> Investor
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
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
              {user?.role === 'audit' ? (
                <NavLink to="/audit" className={linkClass} onClick={() => setMobileOpen(false)}>Audit Dashboard</NavLink>
              ) : (
                <>
                  <NavLink to="/dashboard" className={linkClass} onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
                  <NavLink to="/pitches" className={linkClass} onClick={() => setMobileOpen(false)}>Pitches</NavLink>
                  <NavLink to="/spvs" className={linkClass} onClick={() => setMobileOpen(false)}>Syndicates</NavLink>
                  {user?.role === 'investor' && (
                    <NavLink to="/lead-spv" className={linkClass} onClick={() => setMobileOpen(false)}>Create Syndicate</NavLink>
                  )}
                  <NavLink to="/investors" className={linkClass} onClick={() => setMobileOpen(false)}>Investors</NavLink>
                  <NavLink to="/education" className={linkClass} onClick={() => setMobileOpen(false)}>Learn</NavLink>
                  <NavLink to="/community" className={linkClass} onClick={() => setMobileOpen(false)}>Community</NavLink>
                  <NavLink to="/messages" className={linkClass} onClick={() => setMobileOpen(false)}>Messages</NavLink>
                  <NavLink to="/government-schemes" className={linkClass} onClick={() => setMobileOpen(false)}>Govt Schemes</NavLink>
                </>
              )}
              <button onClick={handleLogout} className="text-left text-red-400 hover:text-red-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login?type=entrepreneur" className="text-brand-100 flex items-center gap-1.5" onClick={() => setMobileOpen(false)}>🚀 Entrepreneur</Link>
              <Link to="/login?type=investor" className="text-gold-400 font-semibold flex items-center gap-1.5" onClick={() => setMobileOpen(false)}>💼 Investor</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
