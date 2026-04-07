import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { resetPassword } from '../api/auth'
import GoldButton from '../components/common/GoldButton'

const schema = z.object({
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, { message: "Passwords don't match", path: ['confirm_password'] })

export default function ResetPassword() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [showPass, setShowPass] = useState(false)
  const [apiError, setApiError] = useState('')
  const [step, setStep] = useState('otp') // otp | password
  const inputs = useRef([])
  const navigate = useNavigate()
  const { state } = useLocation()
  const email = state?.email || ''

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[i] = val.slice(-1)
    setOtp(next)
    if (val && i < 5) inputs.current[i + 1]?.focus()
    if (next.every(d => d !== '')) setStep('password')
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  const onSubmit = async (data) => {
    setApiError('')
    try {
      await resetPassword({
        recipient: email,
        otp: otp.join(''),
        new_password: data.new_password,
      })
      navigate('/login', { state: { passwordReset: true } })
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.detail || 'Something went wrong. Please try again.'
      setApiError(msg)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-navy-800 rounded-2xl border border-navy-700 p-8">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <img src="/veristart-logo.svg" alt="Veristart" className="w-8 h-8" />
          <span className="font-bold text-white">Veri<span className="text-gold-500">start</span></span>
        </Link>

        <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto mb-6">
          <Lock size={24} className="text-gold-500" />
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2">Reset your password</h1>
        <p className="text-slate-400 text-sm text-center mb-8">
          {step === 'otp'
            ? <>Enter the 6-digit code sent to <span className="text-gold-400">{email}</span></>
            : 'Now set your new password'}
        </p>

        {apiError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {apiError}
          </div>
        )}

        {/* Step 1 — OTP */}
        {step === 'otp' && (
          <div className="flex gap-3 justify-center mb-6">
            {otp.map((digit, i) => (
              <input key={i} ref={el => inputs.current[i] = el}
                value={digit} onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                maxLength={1} inputMode="numeric"
                className="w-12 h-14 text-center text-xl font-mono font-bold bg-navy-900 border-2 border-navy-700 rounded-xl text-white focus:outline-none focus:border-gold-500 transition-colors" />
            ))}
          </div>
        )}

        {/* Step 2 — New Password */}
        {step === 'password' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input {...register('new_password')} type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters"
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg pl-10 pr-10 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.new_password && <p className="text-red-400 text-xs mt-1">{errors.new_password.message}</p>}
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Confirm New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input {...register('confirm_password')} type="password" placeholder="Repeat password"
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
              </div>
              {errors.confirm_password && <p className="text-red-400 text-xs mt-1">{errors.confirm_password.message}</p>}
            </div>

            <GoldButton type="submit" loading={isSubmitting} className="w-full" size="lg">
              Reset Password
            </GoldButton>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-slate-400 text-sm hover:text-gold-400 transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
