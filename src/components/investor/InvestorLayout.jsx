import { useState } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Bookmark, Briefcase, Settings, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/investor/dashboard', icon: LayoutDashboard, label: 'Deal Flow', end: true },
  { to: '/investor/saved', icon: Bookmark, label: 'Saved Startups' },
  { to: '/investor/portfolio', icon: Briefcase, label: 'Portfolio' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

function SidebarContent({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-navy-700">
        <div className="flex items-center gap-2">
          <img src="/veristart-logo.svg" alt="Veristart" className="w-7 h-7" />
          <span className="font-bold text-white">Veri<span className="text-gold-500">start</span></span>
        </div>
        {onClose && <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden"><X size={18} /></button>}
      </div>
      <div className="p-4 border-b border-navy-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.full_name?.[0] || 'I'}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{user?.full_name || 'Investor'}</p>
            <p className="text-blue-400 text-xs">Investor Account</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? 'bg-gold-500/10 text-gold-400 border-l-2 border-gold-500 pl-2.5' : 'text-slate-400 hover:text-white hover:bg-navy-700'}`}>
            <Icon size={17} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3">
        <button onClick={async () => { await logout(); navigate('/') }}
          className="flex items-center gap-2 w-full px-3 py-2 text-slate-400 hover:text-red-400 text-sm rounded-lg hover:bg-red-500/5 transition-all">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  )
}

export default function InvestorLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="flex h-screen bg-navy-950 overflow-hidden">
      <aside className="hidden lg:flex w-60 flex-col bg-navy-900 border-r border-navy-800 flex-shrink-0">
        <SidebarContent />
      </aside>
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-navy-900 border-b border-navy-800">
          <button onClick={() => setMobileOpen(true)} className="text-white p-1"><Menu size={22} /></button>
          <span className="font-bold text-white">Veri<span className="text-gold-500">start</span></span>
          <div className="w-8" />
        </div>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  )
}
