import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, Rocket, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import GoldButton from '../components/common/GoldButton'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
  terms: z.boolean().refine((v) => v, 'You must accept the terms'),
}).refine((d) => d.password === d.confirm_password, { message: "Passwords don't match", path: ['confirm_password'] })

export default function Signup() {
  const [role, setRole] = useState('FOUNDER')
  const [showPass, setShowPass] = useState(false)
  const [apiError, setApiError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setApiError('')
    try {
      await signup({ ...data, role })
      navigate('/verify-email', { state: { email: data.email } })
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    }
  }

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

      {/* Right Form Panel */}
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
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: 'FOUNDER', label: "I'm a Founder", icon: Rocket, desc: 'Build & get funded' },
              { value: 'INVESTOR', label: "I'm an Investor", icon: BarChart3, desc: 'Discover startups' },
            ].map(({ value, label, icon: Icon, desc }) => (
              <button key={value} type="button" onClick={() => setRole(value)}
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input {...register('full_name')} placeholder="Segun Oloyede"
                  className="w-full bg-navy-800 border border-navy-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
              </div>
              {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input {...register('email')} type="email" placeholder="you@startup.com"
                  className="w-full bg-navy-800 border border-navy-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters"
                  className="w-full bg-navy-800 border border-navy-700 rounded-lg pl-10 pr-10 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input {...register('confirm_password')} type="password" placeholder="Repeat password"
                  className="w-full bg-navy-800 border border-navy-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
              </div>
              {errors.confirm_password && <p className="text-red-400 text-xs mt-1">{errors.confirm_password.message}</p>}
            </div>

            <div className="flex items-start gap-3">
              <input {...register('terms')} type="checkbox" id="terms"
                className="mt-0.5 w-4 h-4 rounded border-navy-600 bg-navy-800 accent-gold-500" />
              <label htmlFor="terms" className="text-slate-400 text-xs leading-relaxed">
                I agree to the{' '}
                <a href="/terms" className="text-gold-500 hover:text-gold-400">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-gold-500 hover:text-gold-400">Privacy Policy</a>
              </label>
            </div>
            {errors.terms && <p className="text-red-400 text-xs">{errors.terms.message}</p>}

            <GoldButton type="submit" loading={isSubmitting} className="w-full" size="lg">
              Create Account
            </GoldButton>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-navy-700" /></div>
            <div className="relative flex justify-center"><span className="bg-navy-950 px-3 text-slate-500 text-xs">or continue with</span></div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-3 bg-navy-800 border border-navy-700 rounded-lg text-white text-sm hover:bg-navy-700 transition-colors">
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
