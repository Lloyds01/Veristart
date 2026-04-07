import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Rocket, BarChart3, Building2, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import GoldButton from '../components/common/GoldButton'

const validate = (fields, role) => {
  const errs = {}
  if (!fields.first_name || fields.first_name.length < 2) errs.first_name = 'First name is required'
  if (!fields.last_name || fields.last_name.length < 2) errs.last_name = 'Last name is required'
  if (role === 'FOUNDER' && (!fields.bussiness_name || fields.bussiness_name.length < 2)) errs.bussiness_name = 'Business name is required'
  if (!fields.email || !/\S+@\S+\.\S+/.test(fields.email)) errs.email = 'Valid email is required'
  if (!fields.phone_number || fields.phone_number.length < 7) errs.phone_number = 'Phone number is required'
  if (!fields.password || fields.password.length < 8) errs.password = 'Password must be at least 8 characters'
  else if (!/[A-Z]/.test(fields.password)) errs.password = 'Must have at least one uppercase letter'
  else if (!/[!@#$%^&*(),.?":{}|<>]/.test(fields.password)) errs.password = 'Must have at least one special character'
  if (fields.password !== fields.confirm_password) errs.confirm_password = "Passwords don't match"
  if (!fields.terms) errs.terms = 'You must accept the terms'
  return errs
}

const inputClass = 'w-full bg-navy-800 border border-navy-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors'

export default function Signup() {
  const [role, setRole] = useState('FOUNDER')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState('')
  const [errors, setErrors] = useState({})
  const [fields, setFields] = useState({
    first_name: '', last_name: '', bussiness_name: '',
    email: '', phone_number: '', password: '', confirm_password: '', terms: false,
  })
  const { signup } = useAuth()
  const navigate = useNavigate()

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFields(prev => ({ ...prev, [key]: val }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const handleRoleChange = (newRole) => {
    setRole(newRole)
    setErrors({})
    setApiError('')
  }

  const handleSubmit = async () => {
    const errs = validate(fields, role)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setApiError('')
    try {
      const payload = {
        first_name: fields.first_name,
        last_name: fields.last_name,
        email: fields.email,
        phone_number: fields.phone_number,
        password: fields.password,
        confirm_password: fields.confirm_password,
        user_type: role,
        bussiness_name: role === 'FOUNDER' ? fields.bussiness_name : '',
      }
      await signup(payload)
      setSuccess(true)
    } catch (err) {
      const status = err?.response?.status
      const errData = err?.response?.data
      if (status === 400 && errData && typeof errData === 'object') {
        setApiError(Object.values(errData).flat().join(' '))
      } else if (!err?.response) {
        setApiError('Network error. Please check your connection.')
      } else {
        setApiError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const LeftPanel = () => (
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
              Join 1,200+ African founders building their{' '}
              <span className="gold-text">verified startup identity.</span>
            </p>
            <div className="space-y-3 mt-8">
              {['Build a verified startup profile in minutes', 'Generate AI-powered investor pitches', 'Connect with 200+ funding providers'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-gold-500" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (success) {
    return (
      <div className="min-h-screen flex">
        <LeftPanel />
        <div className="flex-1 flex items-center justify-center p-6 bg-navy-950">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Account Created! 🎉</h1>
            <p className="text-slate-400 text-sm mb-2">
              Welcome to Veristart, <span className="text-gold-400 font-medium">{fields.first_name}</span>!
            </p>
            <p className="text-slate-500 text-sm mb-8">
              Your account has been successfully created. Sign in to start building your startup profile.
            </p>
            <GoldButton className="w-full" size="lg" onClick={() => navigate('/login')}>
              Go to Sign In →
            </GoldButton>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <LeftPanel />

      <div className="flex-1 flex items-center justify-center p-6 bg-navy-950 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md py-8">

          <div className="mb-6">
            <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
              <img src="/veristart-logo.svg" alt="Veristart" className="w-7 h-7" />
              <span className="font-bold text-white">Veri<span className="text-gold-500">start</span></span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-slate-400 text-sm">Start your journey to getting funded</p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { value: 'FOUNDER', label: "I'm a Founder", icon: Rocket, desc: 'Build & get funded' },
              { value: 'INVESTOR', label: "I'm an Investor", icon: BarChart3, desc: 'Discover startups' },
            ].map(({ value, label, icon: Icon, desc }) => (
              <button key={value} type="button" onClick={() => handleRoleChange(value)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${role === value ? 'border-gold-500 bg-gold-500/10' : 'border-navy-700 bg-navy-800 hover:border-navy-600'}`}>
                <Icon size={20} className={role === value ? 'text-gold-500' : 'text-slate-400'} />
                <p className={`font-medium text-sm mt-2 ${role === value ? 'text-white' : 'text-slate-300'}`}>{label}</p>
                <p className="text-slate-500 text-xs">{desc}</p>
              </button>
            ))}
          </div>

          {apiError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {apiError}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">First Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={fields.first_name} onChange={set('first_name')} placeholder="Segun"
                    className={`${inputClass} ${errors.first_name ? 'border-red-500' : ''}`} />
                </div>
                {errors.first_name && <p className="text-red-400 text-xs mt-1">{errors.first_name}</p>}
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">Last Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={fields.last_name} onChange={set('last_name')} placeholder="Oloyede"
                    className={`${inputClass} ${errors.last_name ? 'border-red-500' : ''}`} />
                </div>
                {errors.last_name && <p className="text-red-400 text-xs mt-1">{errors.last_name}</p>}
              </div>
            </div>

            {role === 'FOUNDER' && (
              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">Business Name</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={fields.bussiness_name} onChange={set('bussiness_name')} placeholder="AgriTech Nigeria Ltd"
                    className={`${inputClass} ${errors.bussiness_name ? 'border-red-500' : ''}`} />
                </div>
                {errors.bussiness_name && <p className="text-red-400 text-xs mt-1">{errors.bussiness_name}</p>}
              </div>
            )}

            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={fields.email} onChange={set('email')} placeholder="you@startup.com"
                  className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`} />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">📞</span>
                <input value={fields.phone_number} onChange={set('phone_number')} placeholder="08012345678"
                  className={`${inputClass} ${errors.phone_number ? 'border-red-500' : ''}`} />
              </div>
              {errors.phone_number && <p className="text-red-400 text-xs mt-1">{errors.phone_number}</p>}
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={fields.password} onChange={set('password')}
                  type="text"
                  style={{ WebkitTextSecurity: showPass ? 'none' : 'disc' }}
                  placeholder="Min. 8 chars, 1 uppercase, 1 special"
                  className={`w-full bg-navy-800 border border-navy-700 rounded-lg pl-10 pr-10 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors ${errors.password ? 'border-red-500' : ''}`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={fields.confirm_password} onChange={set('confirm_password')}
                  type="text"
                  style={{ WebkitTextSecurity: showConfirm ? 'none' : 'disc' }}
                  placeholder="Repeat password"
                  className={`w-full bg-navy-800 border border-navy-700 rounded-lg pl-10 pr-10 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors ${errors.confirm_password ? 'border-red-500' : ''}`} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirm_password && <p className="text-red-400 text-xs mt-1">{errors.confirm_password}</p>}
            </div>

            <div>
              <div className="flex items-start gap-3">
                <input type="checkbox" id="terms" checked={fields.terms} onChange={set('terms')}
                  className="mt-0.5 w-4 h-4 rounded border-navy-600 bg-navy-800 accent-gold-500 cursor-pointer" />
                <label htmlFor="terms" className="text-slate-400 text-xs leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <a href="/terms" className="text-gold-500 hover:text-gold-400">Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-gold-500 hover:text-gold-400">Privacy Policy</a>
                </label>
              </div>
              {errors.terms && <p className="text-red-400 text-xs mt-1">{errors.terms}</p>}
            </div>

            <GoldButton type="button" loading={loading} className="w-full" size="lg" onClick={handleSubmit}>
              Create Account
            </GoldButton>
          </div>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-navy-700" /></div>
            <div className="relative flex justify-center"><span className="bg-navy-950 px-3 text-slate-500 text-xs">or continue with</span></div>
          </div>

          <button type="button" className="w-full flex items-center justify-center gap-3 py-3 bg-navy-800 border border-navy-700 rounded-lg text-white text-sm hover:bg-navy-700 transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-slate-400 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-500 hover:text-gold-400 font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
