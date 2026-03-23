import { useState } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Building2, Users, BarChart3, FileText,
  Wallet, Settings, LogOut, Menu, X, Zap, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/profile', icon: Building2, label: 'My Profile' },
  { to: '/dashboard/team', icon: Users, label: 'Team Members' },
  { to: '/dashboard/financials', icon: BarChart3, label: 'Financial Data' },
  { to: '/dashboard/pitch', icon: FileText, label: 'Pitch Documents' },
  { to: '/dashboard/funding', icon: Wallet, label: 'Funding Marketplace' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

function SidebarContent({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-navy-700">
        <div className="flex items-center gap-2">
          <img src="/veristart-logo.svg" alt="Veristart" className="w-7 h-7" />
          <span className="font-bold text-white">Veri<span className="text-gold-500">start</span></span>
        </div>
        {onClose && <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden"><X size={18} /></button>}
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-navy-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center text-navy-950 font-bold text-sm flex-shrink-0">
            {user?.full_name?.[0] || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.full_name || 'Founder'}</p>
            <p className="text-slate-500 text-xs truncate">{user?.startup_name || 'My Startup'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150
              ${isActive ? 'bg-gold-500/10 text-gold-400 border-l-2 border-gold-500 pl-2.5' : 'text-slate-400 hover:text-white hover:bg-navy-700'}
            `}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Upgrade CTA */}
      <div className="p-3">
        <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-gold-500" />
            <span className="text-gold-400 text-xs font-semibold">Free Plan</span>
          </div>
          <p className="text-slate-400 text-xs mb-3">Upgrade to unlock unlimited pitches and AI analysis</p>
          <button onClick={() => navigate('/pricing')}
            className="w-full py-2 bg-gold-gradient text-navy-950 text-xs font-bold rounded-lg hover:shadow-gold-sm transition-all">
            Upgrade Plan
          </button>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-slate-400 hover:text-red-400 text-sm rounded-lg hover:bg-red-500/5 transition-all">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-navy-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-navy-900 border-r border-navy-800 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-navy-900 z-50 lg:hidden border-r border-navy-800">
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-navy-900 border-b border-navy-800">
          <button onClick={() => setMobileOpen(true)} className="text-white p-1"><Menu size={22} /></button>
          <span className="font-bold text-white">Veri<span className="text-gold-500">start</span></span>
          <div className="w-8" />
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
