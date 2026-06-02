import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pitches" element={<Pitches />} />
                <Route path="/pitches/:id" element={<PitchDetail />} />
                <Route path="/submit-pitch" element={<SubmitPitch />} />
                <Route path="/investors" element={<InvestorDirectory />} />
                <Route path="/education" element={<Education />} />
                <Route path="/education/:id" element={<CourseDetail />} />
                <Route path="/community" element={<Community />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/spvs" element={<SPVList />} />
                <Route path="/spvs/:id" element={<SPVDetail />} />
                <Route path="/lead-spv" element={<LeadSPV />} />
                <Route path="/government-schemes" element={<GovernmentSchemes />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="bg-brand-800 text-white py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-brand-200 text-sm">
                &copy; {new Date().getFullYear()} LaunchingLaps. Connecting global entrepreneurs with US investors.
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
