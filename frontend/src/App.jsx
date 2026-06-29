import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SubmitPitch from './pages/SubmitPitch'
import Pitches from './pages/Pitches'
import PitchDetail from './pages/PitchDetail'
import InvestorDirectory from './pages/InvestorDirectory'
import Education from './pages/Education'
import CourseDetail from './pages/CourseDetail'
import Community from './pages/Community'
import Messages from './pages/Messages'
import SPVList from './pages/SPVList'
import SPVDetail from './pages/SPVDetail'
import LeadSPV from './pages/LeadSPV'
import GovernmentSchemes from './pages/GovernmentSchemes'
import BudgetPlanner from './pages/BudgetPlanner'
import IdeaAudit from './pages/IdeaAudit'
import ROICalculator from './pages/ROICalculator'
import AuditDashboard from './pages/AuditDashboard'
import AuditWorkspace from './pages/AuditWorkspace'
import AdminDashboard from './pages/AdminDashboard'
import InvestorVerification from './pages/InvestorVerification'
import DataRoom from './pages/DataRoom'
import Watchlist from './pages/Watchlist'
import Portfolio from './pages/Portfolio'
import FounderUpdates from './pages/FounderUpdates'
import InvestorInterest from './pages/InvestorInterest'
import AuditFeedback from './pages/AuditFeedback'
import Settings from './pages/Settings'
import CompanyProfile from './pages/CompanyProfile'

const PUBLIC_PATHS = ['/', '/login', '/register']

function AppShell() {
  const { pathname } = useLocation()
  const isPublic = PUBLIC_PATHS.includes(pathname)

  const allRoutes = (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<Landing />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected — rendered inside sidebar layout */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard"             element={<Dashboard />} />
        <Route path="/pitches"               element={<Pitches />} />
        <Route path="/pitches/:id"           element={<PitchDetail />} />
        <Route path="/submit-pitch"          element={<SubmitPitch />} />
        <Route path="/submit-pitch/:id"      element={<SubmitPitch />} />
        <Route path="/investors"             element={<InvestorDirectory />} />
        <Route path="/education"             element={<Education />} />
        <Route path="/education/:id"         element={<CourseDetail />} />
        <Route path="/community"             element={<Community />} />
        <Route path="/messages"              element={<Messages />} />
        <Route path="/spvs"                  element={<SPVList />} />
        <Route path="/spvs/:id"              element={<SPVDetail />} />
        <Route path="/lead-spv"              element={<LeadSPV />} />
        <Route path="/government-schemes"    element={<GovernmentSchemes />} />
        <Route path="/budget-planner"        element={<BudgetPlanner />} />
        <Route path="/idea-audit"            element={<IdeaAudit />} />
        <Route path="/roi-calculator"        element={<ROICalculator />} />
        <Route path="/audit"                 element={<AuditDashboard />} />
        <Route path="/audit/:pitchId"        element={<AuditWorkspace />} />
        <Route path="/admin"                 element={<AdminDashboard />} />
        <Route path="/investor-verification" element={<InvestorVerification />} />
        <Route path="/data-room"             element={<DataRoom />} />
        <Route path="/watchlist"             element={<Watchlist />} />
        <Route path="/portfolio"             element={<Portfolio />} />
        <Route path="/founder-updates"       element={<FounderUpdates />} />
        <Route path="/investor-interest"     element={<InvestorInterest />} />
        <Route path="/audit-feedback"        element={<AuditFeedback />} />
        <Route path="/settings"              element={<Settings />} />
        <Route path="/company-profile"       element={<CompanyProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )

  /* ── Public pages: full-width with top Navbar ── */
  if (isPublic) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{allRoutes}</main>
      </div>
    )
  }

  /* ── Authenticated pages: sidebar layout ── */
  return (
    <div className="flex min-h-screen" style={{ background: '#f1f4f8' }}>
      <Sidebar />
      {/* content — offset by sidebar width on desktop, push down mobile top bar */}
      <div className="flex-1 min-w-0 md:ml-[240px] pt-[52px] md:pt-0 min-h-screen overflow-y-auto">
        {allRoutes}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <AuthProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}
