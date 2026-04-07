import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Bell, Shield, Trash2, Save, CheckCircle2 } from 'lucide-react'
import GoldButton from '../../components/common/GoldButton'
import { useAuth } from '../../context/AuthContext'
import { changePassword } from '../../api/auth'

const passwordSchema = z.object({
  old_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, { message: "Passwords don't match", path: ['confirm_password'] })

export default function Settings() {
  const { user } = useAuth()
  const [profileSaved, setProfileSaved] = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwError, setPwError] = useState('')

  const profileForm = useForm({
    defaultValues: { full_name: user?.full_name || '', email: user?.email || '' },
  })

  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) })

  const onProfileSubmit = async () => {
    await new Promise(r => setTimeout(r, 800))
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  const onPasswordSubmit = async (data) => {
    setPwError('')
    setPwSuccess(false)
    try {
      await changePassword({ old_password: data.old_password, new_password: data.new_password })
      setPwSuccess(true)
      passwordForm.reset()
      setTimeout(() => setPwSuccess(false), 4000)
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.detail || 'Failed to update password.'
      setPwError(msg)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2"><User size={18} className="text-gold-500" /> Profile Settings</h2>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[['full_name', 'Full Name', 'Segun Oloyede'], ['email', 'Email Address', 'segun@startup.com']].map(([name, label, placeholder]) => (
                <div key={name}>
                  <label className="text-sm text-slate-300 mb-1.5 block">{label}</label>
                  <input {...profileForm.register(name)} placeholder={placeholder}
                    className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <GoldButton type="submit" loading={profileForm.formState.isSubmitting} size="sm" icon={<Save size={14} />}>
                {profileSaved ? '✓ Saved' : 'Save Changes'}
              </GoldButton>
            </div>
          </form>
        </div>

        {/* Notifications */}
        <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2"><Bell size={18} className="text-gold-500" /> Notifications</h2>
          <div className="space-y-4">
            {[
              ['Investor profile views', true],
              ['Funding application updates', true],
              ['New pitch generated', true],
              ['Weekly performance report', false],
              ['Platform announcements', false],
            ].map(([label, defaultOn]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">{label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={defaultOn} className="sr-only peer" />
                  <div className="w-10 h-5 bg-navy-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2"><Shield size={18} className="text-gold-500" /> Security</h2>

          {pwSuccess && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 size={15} /> Password updated successfully.
            </div>
          )}
          {pwError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {pwError}
            </div>
          )}

          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-3">
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Current Password</label>
              <input {...passwordForm.register('old_password')} type="password" placeholder="••••••••"
                className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
              {passwordForm.formState.errors.old_password && (
                <p className="text-red-400 text-xs mt-1">{passwordForm.formState.errors.old_password.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[['new_password', 'New Password'], ['confirm_password', 'Confirm New Password']].map(([name, label]) => (
                <div key={name}>
                  <label className="text-sm text-slate-300 mb-1.5 block">{label}</label>
                  <input {...passwordForm.register(name)} type="password" placeholder="••••••••"
                    className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
                  {passwordForm.formState.errors[name] && (
                    <p className="text-red-400 text-xs mt-1">{passwordForm.formState.errors[name].message}</p>
                  )}
                </div>
              ))}
            </div>
            <GoldButton type="submit" size="sm" loading={passwordForm.formState.isSubmitting}>Update Password</GoldButton>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 rounded-xl border border-red-500/20 p-6">
          <h2 className="font-semibold text-red-400 mb-3 flex items-center gap-2"><Trash2 size={18} /> Danger Zone</h2>
          <p className="text-slate-400 text-sm mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
          <GoldButton variant="danger" size="sm">Delete Account</GoldButton>
        </div>
      </div>
    </div>
  )
}
