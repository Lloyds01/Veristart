import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import GoldButton from '../components/common/GoldButton'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [errors, setErrors] = useState({})
  const { login } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const justVerified = state?.verified
  const passwordReset = state?.passwordReset

  const validate = () => {
    const errs = {}
    if (!email || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required'
    if (!password || password.length < 6) errs.password = 'Password is required'
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setApiError('')
    try {
      const user = await login({ email, password })
      // user.role comes from user_type mapped in AuthContext
      navigate(user.role === 'INVESTOR' ? '/investor/dashboard' : '/dashboard')
    } catch (err) {
      const status = err?.response?.status
      const data = err?.response?.data

      if (status === 412) {
        // Account not verified — redirect to verify page
        navigate('/verify-email', { state: { email } })
        return
      }

      const msg = data?.message || data?.detail || 'Invalid credentials. Please try again.'
      setApiError(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full bg-navy-800 border border-navy-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors'

  return (
    <div className="min-h-screen flex">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-navy-900 flex-col p-10 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent" />
        <div className="relative z-10 flex flex-col h-full">
          <Link to="/" className="flex items-center gap-2">
            <img src="/veristart-logo.svg" alt="Veristart" className="w-8 h-8" />
            <span className="font-bold text-lg text-white">Veri<span className="text-gold-500">start</span></span>
          </Link>
          <div className="flex-1 flex items-center">
            <div>
              <p className="text-4xl font-bold text-white leading-tight mb-6">
                "The platform where African startups get{' '}
                <span className="gold-text">verified and funded.</span>"
              </p>
              <div className="space-y-4 mt-8">
                {[
                  { text: 'Raised ₦50M after generating pitch on Veristart', author: 'Adaeze O.' },
                  { text: 'Found our Series A investor through the marketplace', author: 'Emeka E.' },
                  { text: 'Pitch-ready in 48 hours. Incredible platform.', author: 'Fatima H.' },
                ].map(({ text, author }) => (
                  <div key={author} className="flex items-start gap-3 p-3 bg-navy-800/60 rounded-lg border border-navy-700">
                    <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center text-navy-950 text-xs font-bold flex-shrink-0">
                      {author[0]}
                    </div>
                    <div>
                      <p className="text-slate-300 text-xs leading-relaxed">"{text}"</p>
                      <p className="text-gold-500 text-xs mt-1">— {author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-navy-950">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <img src="/veristart-logo.svg" alt="Veristart" className="w-7 h-7" />
              <span className="font-bold text-white">Veri<span className="text-gold-500">start</span></span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-slate-400 text-sm">Sign in to your Veristart account</p>
          </div>

          {justVerified && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} /> Email verified successfully. You can now sign in.
            </div>
          )}

          {passwordReset && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} /> Password reset successfully. Sign in with your new password.
            </div>
          )}

          {apiError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={15} /> {apiError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                  placeholder="you@startup.com"
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`} />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-gold-500 text-xs hover:text-gold-400">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
                  type="text"
                  style={{ WebkitTextSecurity: showPass ? 'none' : 'disc' }}
                  placeholder="••••••••"
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className={`w-full bg-navy-800 border border-navy-700 rounded-lg pl-10 pr-10 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors ${errors.password ? 'border-red-500' : ''}`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <GoldButton type="button" loading={loading} className="w-full" size="lg" onClick={handleSubmit}>
              Sign In
            </GoldButton>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-navy-700" /></div>
            <div className="relative flex justify-center"><span className="bg-navy-950 px-3 text-slate-500 text-xs">or continue with</span></div>
          </div>

          <button type="button" className="w-full flex items-center justify-center gap-3 py-3 bg-navy-800 border border-navy-700 rounded-lg text-white text-sm hover:bg-navy-700 transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-gold-500 hover:text-gold-400 font-medium">Sign up free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
