import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { forgotPassword } from '../api/auth'
import GoldButton from '../components/common/GoldButton'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setApiError('')
    try {
      await forgotPassword(data)
      setSent(true)
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

        {!sent ? (
          <>
            <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto mb-6">
              <Mail size={24} className="text-gold-500" />
            </div>

            <h1 className="text-2xl font-bold text-white text-center mb-2">Forgot your password?</h1>
            <p className="text-slate-400 text-sm text-center mb-8">
              Enter your email and we'll send you a reset code.
            </p>

            {apiError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input {...register('email')} type="email" placeholder="you@startup.com"
                    className="w-full bg-navy-900 border border-navy-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <GoldButton type="submit" loading={isSubmitting} className="w-full" size="lg">
                Send Reset Code
              </GoldButton>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={24} className="text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-slate-400 text-sm mb-6">
              We sent a password reset code to{' '}
              <span className="text-gold-400 font-medium">{getValues('email')}</span>
            </p>
            <Link to="/reset-password" state={{ email: getValues('email') }}>
              <GoldButton className="w-full" size="lg">Enter Reset Code →</GoldButton>
            </Link>
          </div>
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
