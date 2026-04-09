import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { BadgeCheck, Wallet, Globe, CheckCircle2 } from 'lucide-react'
import CountUp from 'react-countup'
import GoldButton from '../components/common/GoldButton'
import { joinWaitlist } from '../api/auth'

const STATS = [
  { value: 500, suffix: '+', label: 'Founders on Waitlist' },
  { value: 4.1, suffix: 'B', prefix: '₦', label: 'African Startup Funding in 2025', decimals: 1 },
  { value: 3, suffix: 'M+', label: 'Nigerian SMEs Need This' },
  { value: 48, suffix: 'hrs', label: 'Average Time to Pitch Ready' },
]

const TIERS = [
  {
    num: '01',
    icon: BadgeCheck,
    label: 'Your Digital Startup Passport',
    body: 'Every startup that joins Veristart receives a Verified Digital Profile — a living, AI-powered business identity that proves your traction, your team and your financials to any investor in the world. Not a pitch deck. Not a PDF. A verified passport for your startup.',
  },
  {
    num: '02',
    icon: Wallet,
    label: 'Direct Access to Creditors & Capital',
    body: 'Early members get first access to our funding marketplace — connecting directly with vetted loan providers, angel investors and grant programs actively deploying capital into African startups. No cold emails. No gatekeepers. Just verified startups meeting verified money.',
  },
  {
    num: '03',
    icon: Globe,
    label: 'Join the Founding Community',
    body: 'We are looking for professionals, operators and builders who believe Africa\'s startup ecosystem deserves world-class infrastructure. If you want to be part of the platform that changes how African startups get funded — this is your seat at the table.',
  },
]

function StatCounter({ value, suffix, prefix = '', label, decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="text-center px-6 py-6">
      <div className="font-mono text-3xl md:text-4xl font-bold text-gold-400 mb-1">
        {inView
          ? <CountUp start={0} end={value} duration={2.5} decimals={decimals} prefix={prefix} suffix={suffix} />
          : `${prefix}0${suffix}`}
      </div>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  )
}

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: i % 3 === 0 ? '#C9A84C' : i % 3 === 1 ? '#E8C87A' : '#ffffff',
    size: Math.random() * 8 + 4,
  }))
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map(({ id, x, delay, color, size }) => (
        <motion.div key={id}
          initial={{ y: -20, x: `${x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '100vh', opacity: 0, rotate: 360 }}
          transition={{ duration: 2.5, delay, ease: 'easeIn' }}
          style={{ position: 'absolute', top: 0, width: size, height: size, borderRadius: 2, background: color }} />
      ))}
    </div>
  )
}

export default function Waitlist() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!email || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required'
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      await joinWaitlist({ name, email, ...(phone ? { phone_number: phone } : {}) })
      setSuccess(true)
    } catch (err) {
      const errData = err?.response?.data
      if (errData && typeof errData === 'object') {
        setErrors({ api: Object.values(errData).flat().join(' ') })
      } else {
        setErrors({ api: 'Something went wrong. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.origin + '/waitlist' : 'https://veristart.com/waitlist'
  const shareText = "I just joined the Veristart waitlist — the platform changing how African startups get verified and funded. Join me:"
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col relative overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-950/60 to-navy-950 pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2">
          <img src="/veristart-logo.svg" alt="Veristart" className="w-8 h-8" />
          <span className="font-bold text-lg text-white">Veri<span className="text-gold-500">start</span></span>
        </Link>
        <Link to="/login" className="text-slate-400 text-sm hover:text-gold-400 transition-colors">
          Already have an account? <span className="text-gold-500 font-medium">Sign In</span>
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-0 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-sm font-medium mb-8">
            🌍 Built for African Startups
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl">
          Africa's Startups Deserve Better Than{' '}
          <span className="gold-text">a PDF and a Prayer.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Veristart is the platform where African founders get verified, get pitch-ready and get funded — faster than ever before.
        </motion.p>

        {/* Form / Success */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-xl relative">

          {success ? (
            <div className="relative">
              <Confetti />
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-navy-800 rounded-2xl border border-navy-700 p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">You're on the list! 🎉</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Welcome to the Veristart founding community.<br />
                  We'll be in touch with your early access details very soon.
                </p>
                <div className="flex gap-3 justify-center">
                  <a href={whatsappUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] rounded-lg text-sm font-medium hover:bg-[#25D366]/20 transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Share on WhatsApp
                  </a>
                  <a href={twitterUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-black/30 border border-white/10 text-white rounded-lg text-sm font-medium hover:bg-black/50 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Share on X
                  </a>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="bg-navy-800/80 backdrop-blur-sm rounded-2xl border border-navy-700 p-6">
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <div className="flex-1">
                  <input value={name} onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
                    placeholder="Your name"
                    className={`w-full bg-navy-900 border rounded-lg px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors ${errors.name ? 'border-red-500' : 'border-navy-700'}`} />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="flex-1">
                  <input value={email} onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                    placeholder="your@email.com"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className={`w-full bg-navy-900 border rounded-lg px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors ${errors.email ? 'border-red-500' : 'border-navy-700'}`} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
              <div className="mb-3">
                <input value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number (optional)"
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
              </div>
              {errors.api && <p className="text-red-400 text-xs mb-3">{errors.api}</p>}
              <GoldButton type="button" loading={loading} className="w-full" size="lg" onClick={handleSubmit}>
                Claim My Early Access →
              </GoldButton>
              <p className="text-slate-500 text-xs text-center mt-4 leading-relaxed">
                Join 500+ founders, investors and operators already on the waitlist.<br />
                No credit card. No commitment. Just early access.
              </p>
            </div>
          )}
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 mt-16 bg-navy-900 border-y border-navy-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-navy-800">
          {STATS.map((s) => <StatCounter key={s.label} {...s} />)}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <h2 className="text-3xl font-bold text-white text-center mb-12">What Early Access Gets You</h2>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {TIERS.map(({ num, icon: Icon, label, body }, i) => (
              <FadeUp key={num} delay={i * 0.1}>
                <div className="bg-navy-800 rounded-xl p-6 border-l-4 border-l-gold-500 border border-navy-700 relative overflow-hidden group hover:border-gold-500/30 hover:shadow-gold-sm transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <span className="font-mono text-4xl font-bold text-gold-500/20 leading-none">{num}</span>
                    <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-gold-500" />
                    </div>
                  </div>
                  <h3 className="font-bold text-white mb-3">{label}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-navy-800 py-6 px-4 text-center">
        <p className="text-slate-600 text-sm">
          Veristart © {new Date().getFullYear()} — Verify your startup. Attract the right capital.{' '}
          <span className="mx-2">·</span>
          <a href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <span className="mx-2">·</span>
          <a href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
        </p>
      </footer>
    </div>
  )
}
