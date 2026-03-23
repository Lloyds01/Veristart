import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import GoldButton from './GoldButton'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'For Investors', href: '/investor/dashboard' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy-950/95 backdrop-blur-md shadow-navy-lg border-b border-navy-800' : 'bg-transparent'}`}>
      <div className="container-max px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/veristart-logo.svg" alt="Veristart" className="w-8 h-8" />
            <span className="font-bold text-lg text-white group-hover:text-gold-400 transition-colors">
              Veri<span className="text-gold-500">start</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href}
                className="text-sm text-slate-400 hover:text-gold-400 transition-colors relative group">
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 group-hover:w-full transition-all duration-200" />
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <GoldButton variant="ghost" size="sm" onClick={() => navigate(user?.role === 'INVESTOR' ? '/investor/dashboard' : '/dashboard')}>
                  Dashboard
                </GoldButton>
                <GoldButton variant="secondary" size="sm" onClick={handleLogout}>Sign Out</GoldButton>
              </>
            ) : (
              <>
                <GoldButton variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign In</GoldButton>
                <GoldButton size="sm" onClick={() => navigate('/signup')}>Get Started</GoldButton>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden text-white p-2" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-navy-900 z-50 p-6 flex flex-col md:hidden">
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-white">Veri<span className="text-gold-500">start</span></span>
                <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white"><X size={22} /></button>
              </div>
              <nav className="flex flex-col gap-4 flex-1">
                {NAV_LINKS.map(({ label, href }) => (
                  <a key={label} href={href} onClick={() => setOpen(false)}
                    className="text-slate-300 hover:text-gold-400 transition-colors py-2 border-b border-navy-800">
                    {label}
                  </a>
                ))}
              </nav>
              <div className="flex flex-col gap-3 mt-6">
                {isAuthenticated ? (
                  <GoldButton onClick={handleLogout} variant="secondary" className="w-full">Sign Out</GoldButton>
                ) : (
                  <>
                    <GoldButton variant="secondary" className="w-full" onClick={() => { navigate('/login'); setOpen(false) }}>Sign In</GoldButton>
                    <GoldButton className="w-full" onClick={() => { navigate('/signup'); setOpen(false) }}>Get Started</GoldButton>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
