import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Bell, Shield, TrendingUp, Save, CheckCircle2 } from 'lucide-react'
import GoldButton from '../../components/common/GoldButton'
import { useAuth } from '../../context/AuthContext'
import { changePassword } from '../../api/auth'
import { useToast } from '../../context/ToastContext'

const passwordSchema = z.object({
  old_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
})

const STAGES = ['IDEA', 'MVP', 'TRACTION', 'GROWTH', 'SCALE']
const SECTORS = ['Fintech', 'HealthTech', 'EdTech', 'AgriTech', 'Logistics', 'CleanTech', 'E-Commerce', 'SaaS', 'Deep Tech', 'Other']

const inputClass = 'w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors'

export default function InvestorSettings() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profileSaved, setProfileSaved] = useState(false)
  const [prefSaved, setPrefSaved] = useState(false)
  const [pwError, setPwError] = useState('')
  const [selectedSectors, setSelectedSectors] = useState([])
  const [selectedStages, setSelectedStages] = useState([])
  const [minTicket, setMinTicket] = useState('')
  const [maxTicket, setMaxTicket] = useState('')

  const profileForm = useForm({
    defaultValues: { full_name: user?.full_name || '', email: user?.email || '' },
  })

  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) })

  const toggleSector = (s) => setSelectedSectors((prev) =>
    prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
  )
  const toggleStage = (s) => setSelectedStages((prev) =>
    prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
  )

  const onProfileSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800))
    setProfileSaved(true)
    toast({ type: 'success', message: 'Profile settings saved.' })
    setTimeout(() => setProfileSaved(false), 3000)
  }

  const onPrefSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600))
    setPrefSaved(true)
    toast({ type: 'success', message: 'Investment preferences saved.' })
    setTimeout(() => setPrefSaved(false), 3000)
  }

  const onPasswordSubmit = async (data) => {
    setPwError('')
    try {
      await changePassword({ old_password: data.old_password, new_password: data.new_password })
      toast({ type: 'success', message: 'Password updated successfully.' })
      passwordForm.reset()
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.detail || 'Failed to update password.'
      setPwError(msg)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your investor account and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
            <User size={18} className="text-gold-500" /> Profile Settings
          </h2>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[['full_name', 'Full Name', 'Your name'], ['email', 'Email Address', 'you@example.com']].map(([name, label, placeholder]) => (
                <div key={name}>
                  <label className="text-sm text-slate-300 mb-1.5 block">{label}</label>
                  <input {...profileForm.register(name)} placeholder={placeholder} className={inputClass} />
                </div>
              ))}
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Firm / Organization (optional)</label>
              <input {...profileForm.register('firm')} placeholder="e.g. Lagos Angel Network" className={inputClass} />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Investment Bio</label>
              <textarea {...profileForm.register('bio')} rows={3}
                placeholder="Brief description of your investment focus..."
                className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none" />
            </div>
            <GoldButton type="submit" loading={profileForm.formState.isSubmitting} size="sm" icon={<Save size={14} />}>
              {profileSaved ? '✓ Saved' : 'Save Changes'}
            </GoldButton>
          </form>
        </div>

        {/* Investment Preferences */}
        <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
            <TrendingUp size={18} className="text-gold-500" /> Investment Preferences
          </h2>
          <div className="space-y-5">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Preferred Sectors</label>
              <div className="flex flex-wrap gap-2">
                {SECTORS.map((s) => (
                  <button key={s} type="button" onClick={() => toggleSector(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedSectors.includes(s) ? 'bg-gold-500/20 text-gold-400 border-gold-500/40' : 'bg-navy-900 text-slate-400 border-navy-700 hover:border-navy-600'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">Preferred Stages</label>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((s) => (
                  <button key={s} type="button" onClick={() => toggleStage(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedStages.includes(s) ? 'bg-gold-500/20 text-gold-400 border-gold-500/40' : 'bg-navy-900 text-slate-400 border-navy-700 hover:border-navy-600'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">Min Ticket Size (₦)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">₦</span>
                  <input value={minTicket} onChange={(e) => setMinTicket(e.target.value)} type="number" placeholder="1,000,000"
                    className={`${inputClass} pl-8`} />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">Max Ticket Size (₦)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">₦</span>
                  <input value={maxTicket} onChange={(e) => setMaxTicket(e.target.value)} type="number" placeholder="50,000,000"
                    className={`${inputClass} pl-8`} />
                </div>
              </div>
            </div>

            <GoldButton size="sm" loading={false} icon={<Save size={14} />} onClick={onPrefSubmit}>
              {prefSaved ? '✓ Saved' : 'Save Preferences'}
            </GoldButton>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Bell size={18} className="text-gold-500" /> Notifications
          </h2>
          <div className="space-y-4">
            {[
              ['New startups matching my criteria', true],
              ['Funding application updates', true],
              ['Pitch deck views', true],
              ['Weekly deal flow digest', false],
              ['Platform announcements', false],
            ].map(([label, defaultOn]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">{label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={defaultOn} className="sr-only peer" />
                  <div className="w-10 h-5 bg-navy-700 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Shield size={18} className="text-gold-500" /> Security
          </h2>
          {pwError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{pwError}</div>
          )}
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-3">
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Current Password</label>
              <input {...passwordForm.register('old_password')} type="password" placeholder="••••••••" className={inputClass} />
              {passwordForm.formState.errors.old_password && (
                <p className="text-red-400 text-xs mt-1">{passwordForm.formState.errors.old_password.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[['new_password', 'New Password'], ['confirm_password', 'Confirm Password']].map(([name, label]) => (
                <div key={name}>
                  <label className="text-sm text-slate-300 mb-1.5 block">{label}</label>
                  <input {...passwordForm.register(name)} type="password" placeholder="••••••••" className={inputClass} />
                  {passwordForm.formState.errors[name] && (
                    <p className="text-red-400 text-xs mt-1">{passwordForm.formState.errors[name].message}</p>
                  )}
                </div>
              ))}
            </div>
            <GoldButton type="submit" size="sm" loading={passwordForm.formState.isSubmitting}>
              Update Password
            </GoldButton>
          </form>
        </div>
      </div>
    </div>
  )
}
