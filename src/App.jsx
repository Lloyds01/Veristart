import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Pricing from './pages/Pricing'
import Waitlist from './pages/Waitlist'

// Dashboard
import DashboardLayout from './components/dashboard/DashboardLayout'
import Dashboard from './pages/founder/Dashboard'
import Profile from './pages/founder/Profile'
import Team from './pages/founder/Team'
import Financials from './pages/founder/Financials'
import PitchGenerator from './pages/founder/PitchGenerator'
import FundingMarketplace from './pages/founder/FundingMarketplace'
import Settings from './pages/founder/Settings'

// Investor
import InvestorLayout from './components/investor/InvestorLayout'
import InvestorDashboard from './pages/investor/InvestorDashboard'
import SavedStartups from './pages/investor/SavedStartups'
import Portfolio from './pages/investor/Portfolio'

const PageWrapper = ({ children }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
    {children}
  </motion.div>
)

function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-navy-950 flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to={user?.role === 'INVESTOR' ? '/investor/dashboard' : '/dashboard'} replace />
  return children
}

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/verify-email" element={<PageWrapper><VerifyEmail /></PageWrapper>} />
        <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
        <Route path="/reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />
        <Route path="/pricing" element={<PageWrapper><Pricing /></PageWrapper>} />
        <Route path="/waitlist" element={<PageWrapper><Waitlist /></PageWrapper>} />

        {/* Founder Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="team" element={<Team />} />
          <Route path="financials" element={<Financials />} />
          <Route path="pitch" element={<PitchGenerator />} />
          <Route path="funding" element={<FundingMarketplace />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Investor Dashboard */}
        <Route path="/investor" element={<ProtectedRoute><InvestorLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<InvestorDashboard />} />
          <Route path="saved" element={<SavedStartups />} />
          <Route path="portfolio" element={<Portfolio />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
