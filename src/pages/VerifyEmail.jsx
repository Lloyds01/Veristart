import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, RefreshCw } from 'lucide-react'
import { verifyOTP, resendOTP } from '../api/auth'
import GoldButton from '../components/common/GoldButton'

export default function VerifyEmail() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputs = useRef([])
  const navigate = useNavigate()
  const { state } = useLocation()
  const email = state?.email || 'your email'

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[i] = val.slice(-1)
    setOtp(next)
    if (val && i < 5) inputs.current[i + 1]?.focus()
    if (next.every(d => d !== '')) handleVerify(next.join(''))
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  const handleVerify = async (code) => {
    setLoading(true)
    setError('')
    try {
      await verifyOTP({ email, otp: code })
      navigate('/login', { state: { verified: true } })
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.detail || 'Invalid code. Please try again.'
      setError(msg)
      setOtp(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await resendOTP({ email })
      setCountdown(60)
      setCanResend(false)
    } catch { /* ignore */ }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-navy-800 rounded-2xl border border-navy-700 p-8 text-center">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <img src="/veristart-logo.svg" alt="Veristart" className="w-8 h-8" />
          <span className="font-bold text-white">Veri<span className="text-gold-500">start</span></span>
        </Link>

        <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto mb-6">
          <Mail size={28} className="text-gold-500" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-slate-400 text-sm mb-8">
          We sent a 6-digit code to <span className="text-gold-400 font-medium">{email}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-center mb-8">
          {otp.map((digit, i) => (
            <input key={i} ref={el => inputs.current[i] = el}
              value={digit} onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              maxLength={1} inputMode="numeric"
              className="w-12 h-14 text-center text-xl font-mono font-bold bg-navy-900 border-2 border-navy-700 rounded-xl text-white focus:outline-none focus:border-gold-500 transition-colors" />
          ))}
        </div>

        <GoldButton loading={loading} className="w-full mb-4" size="lg"
          onClick={() => handleVerify(otp.join(''))} disabled={otp.some(d => !d)}>
          Verify Email
        </GoldButton>

        <div className="flex items-center justify-center gap-2 text-sm">
          {canResend ? (
            <button onClick={handleResend} className="text-gold-500 hover:text-gold-400 flex items-center gap-1.5 transition-colors">
              <RefreshCw size={14} /> Resend code
            </button>
          ) : (
            <span className="text-slate-500">Resend code in <span className="text-gold-400 font-mono">{countdown}s</span></span>
          )}
        </div>

        <p className="text-slate-500 text-xs mt-6">
          Wrong email?{' '}
          <Link to="/signup" className="text-gold-500 hover:text-gold-400">Go back</Link>
        </p>
      </motion.div>
    </div>
  )
}
