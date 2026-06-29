import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import {
  House, Briefcase, Bank, Users, Folder, Bell, Eye, ShieldCheck,
  Buildings, BookOpen, ChatCircle, Envelope, Globe, Gear, SignOut,
  ChartBar, CurrencyDollar, List, X, PresentationChart,
} from '@phosphor-icons/react'

const BG    = '#0d0f1c'
const LINE  = 'rgba(255,255,255,0.07)'
const AMBER = '#f59e0b'
const INDIGO = '#818cf8' // indigo-400

function NavItem({ to, icon: Icon, label, end: endProp }) {
  return (
    <NavLink to={to} end={endProp}>
      {({ isActive }) => (
        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
          isActive
            ? 'text-indigo-300 bg-indigo-500/12'
            : 'text-white/40 hover:text-white/80 hover:bg-white/6'
        }`}>
          <Icon
            size={15}
            weight={isActive ? 'fill' : 'regular'}
            className="flex-shrink-0"
            style={{ color: isActive ? INDIGO : undefined }}
          />
          <span className="truncate leading-none">{label}</span>
        </div>
      )}
    </NavLink>
  )
}

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      {title && (
        <p className="text-[9px] font-black uppercase tracking-[0.18em] px-3 pt-4 pb-1"
          style={{ color: 'rgba(255,255,255,0.18)' }}>
          {title}
        </p>
      )}
      {children}
    </div>
  )
}

function SidebarContent({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isE = user?.role === 'entrepreneur'
  const isI = user?.role === 'investor'
  const isA = user?.role === 'audit'
  const isAdmin = user?.role === 'admin'

  function handleLogout() { logout(); navigate('/') }

  return (
    <div className="flex flex-col h-full" style={{ background: BG }}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-[60px] flex-shrink-0"
        style={{ borderBottom: `1px solid ${LINE}` }}>
        <Link to="/" className="text-[15px] font-black tracking-tight">
          <span style={{ color: AMBER }}>Launching</span>
          <span className="text-white">Laps</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors">
            <X size={17} />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5" style={{ scrollbarWidth: 'none' }}>

        {isAdmin && (
          <Section>
            <NavItem to="/admin"     icon={Gear}          label="Admin"           end />
          </Section>
        )}

        {isA && (
          <Section>
            <NavItem to="/audit"     icon={ShieldCheck}   label="Audit Dashboard" end />
          </Section>
        )}

        {(isE || isI) && (
          <>
            <Section>
              <NavItem to="/dashboard"  icon={House}                              label="Dashboard"    end />
              {isE && <>
                <NavItem to="/company-profile"    icon={Buildings}    label="Company Profile" />
                <NavItem to="/data-room"          icon={Folder}       label="Data Room" />
              </>}
              <NavItem to="/pitches"    icon={isI ? PresentationChart : Briefcase} label={isI ? 'Deal Flow' : 'Pitches'} />
              <NavItem to="/spvs"       icon={Bank}                               label="Syndicates" />
              <NavItem to="/investors"  icon={Users}                              label={isI ? 'Network' : 'Investors'} />
            </Section>

            <Section title="Tools">
              {isE && <>
                <NavItem to="/founder-updates"    icon={Bell}         label="Investor Updates" />
                <NavItem to="/investor-interest"  icon={Eye}          label="Investor Activity" />
                <NavItem to="/audit-feedback"     icon={ShieldCheck}  label="Audit Feedback" />
                <NavItem to="/government-schemes" icon={Globe}        label="Govt Schemes" />
              </>}
              {isI && <>
                <NavItem to="/watchlist"             icon={Eye}            label="Watchlist" />
                <NavItem to="/portfolio"             icon={ChartBar}       label="Portfolio" />
                <NavItem to="/investor-verification" icon={ShieldCheck}    label="Verification" />
                <NavItem to="/lead-spv"              icon={CurrencyDollar} label="Create Syndicate" />
              </>}
            </Section>

            <Section title="Connect">
              <NavItem to="/education"  icon={BookOpen}   label="Learn" />
              <NavItem to="/community"  icon={ChatCircle} label="Community" />
              <NavItem to="/messages"   icon={Envelope}   label="Messages" />
            </Section>
          </>
        )}

        <Section title="Account">
          <NavItem to="/settings" icon={Gear} label="Settings" />
        </Section>
      </div>

      {/* User footer */}
      <div className="flex-shrink-0 px-2 py-3" style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg mb-1"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
            style={{ background: AMBER, color: '#000' }}>
            {user?.full_name?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold leading-tight truncate" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {user?.full_name}
            </p>
            <p className="text-[10px] capitalize leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>
              {user?.role}
            </p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[12px] font-medium transition-colors"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)';  e.currentTarget.style.background = 'transparent' }}>
          <SignOut size={13} />
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 z-40 w-[240px]"
        style={{ borderRight: `1px solid ${LINE}` }}>
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-[52px]"
        style={{ background: BG, borderBottom: `1px solid ${LINE}` }}>
        <Link to="/" className="text-[14px] font-black tracking-tight">
          <span style={{ color: AMBER }}>Launching</span>
          <span className="text-white">Laps</span>
        </Link>
        <button onClick={() => setMobileOpen(true)}
          className="text-white/50 hover:text-white/80 transition-colors">
          <List size={20} />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[260px] h-full flex flex-col">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
