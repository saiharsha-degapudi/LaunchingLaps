import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

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

                {/* Tools dropdown */}
                <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
                  <button className="text-brand-100 hover:text-white transition-colors flex items-center gap-1">
                    Tools
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {toolsOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 w-56 z-50">
                      {user?.role === 'entrepreneur' && (
                        <>
                          <Link to="/idea-audit" onClick={() => setToolsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                            <span className="text-lg">🎯</span>
                            <div>
                              <div className="font-semibold">Idea Audit</div>
                              <div className="text-xs text-gray-400">Score your startup idea</div>
                            </div>
                          </Link>
                          <Link to="/budget-planner" onClick={() => setToolsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                            <span className="text-lg">📊</span>
                            <div>
                              <div className="font-semibold">Budget Planner</div>
                              <div className="text-xs text-gray-400">Plan runway & burn rate</div>
                            </div>
                          </Link>
                        </>
                      )}
                      {user?.role === 'investor' && (
                        <Link to="/roi-calculator" onClick={() => setToolsOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                          <span className="text-lg">💰</span>
                          <div>
                            <div className="font-semibold">ROI Calculator</div>
                            <div className="text-xs text-gray-400">Model your returns</div>
                          </div>
                        </Link>
                      )}
                      {/* Both roles */}
                      {user?.role === 'entrepreneur' && (
                        <Link to="/roi-calculator" onClick={() => setToolsOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                          <span className="text-lg">💰</span>
                          <div>
                            <div className="font-semibold">ROI Calculator</div>
                            <div className="text-xs text-gray-400">Investor return model</div>
                          </div>
                        </Link>
                      )}
                    </div>
                  )}
                </div>

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
                <Link to="/login" className="text-brand-100 hover:text-white transition-colors">Sign In</Link>
                <Link to="/register" className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-4 py-2 rounded-lg transition">
                  Get Started
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
              {user?.role === 'entrepreneur' && (
                <>
                  <NavLink to="/idea-audit" className={linkClass} onClick={() => setMobileOpen(false)}>🎯 Idea Audit</NavLink>
                  <NavLink to="/budget-planner" className={linkClass} onClick={() => setMobileOpen(false)}>📊 Budget Planner</NavLink>
                </>
              )}
              <NavLink to="/roi-calculator" className={linkClass} onClick={() => setMobileOpen(false)}>💰 ROI Calculator</NavLink>
              <button onClick={handleLogout} className="text-left text-red-400 hover:text-red-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-brand-100" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link to="/register" className="text-gold-400 font-semibold" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
