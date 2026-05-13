import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart3, FileText, Eye, Wallet, X, ArrowRight,
  CheckCircle2, Clock, XCircle, AlertCircle, Loader2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useStartup } from '../../context/StartupContext'
import StatCard from '../../components/common/StatCard'
import OnboardingProgress from '../../components/common/OnboardingProgress'
import GoldButton from '../../components/common/GoldButton'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import { getApplications } from '../../api/funding'
import { listPitches } from '../../api/pitch'
import { listMembers } from '../../api/team'

const statusConfig = {
  PENDING: { label: 'Pending', icon: Clock, class: 'bg-slate-700/50 text-slate-300' },
  REVIEWING: { label: 'Reviewing', icon: AlertCircle, class: 'bg-blue-900/50 text-blue-300' },
  APPROVED: { label: 'Approved', icon: CheckCircle2, class: 'bg-emerald-900/50 text-emerald-400' },
  REJECTED: { label: 'Rejected', icon: XCircle, class: 'bg-red-900/50 text-red-400' },
}

const calcCompleteness = (startup, members) => {
  const checks = [
    startup?.business_name,
    startup?.industry,
    startup?.description,
    startup?.founded_date,
    startup?.headquarters,
    startup?.problem_solved,
    startup?.target_market,
    startup?.business_model,
    startup?.website,
    members?.length > 0,
  ]
  const filled = checks.filter(Boolean).length
  return Math.round((filled / checks.length) * 100)
}

const calcOnboardingStep = (startup, members, pitches) => {
  if (!startup?.business_name) return 0
  if (!members?.length) return 1
  if (!pitches?.length) return 2
  return 3
}

const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { user } = useAuth()
  const { startup, loading: startupLoading } = useStartup()
  const navigate = useNavigate()
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [applications, setApplications] = useState([])
  const [pitches, setPitches] = useState([])
  const [members, setMembers] = useState([])
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (startupLoading) return
    setStatsLoading(true)
    Promise.allSettled([
      getApplications(),
      startup?.id ? listPitches(startup.id) : Promise.resolve({ data: [] }),
      listMembers(),
    ]).then(([appsRes, pitchRes, teamRes]) => {
      if (appsRes.status === 'fulfilled') {
        const list = Array.isArray(appsRes.value.data) ? appsRes.value.data : (appsRes.value.data?.results ?? [])
        setApplications(list)
      }
      if (pitchRes.status === 'fulfilled') {
        const list = Array.isArray(pitchRes.value.data) ? pitchRes.value.data : (pitchRes.value.data?.results ?? [])
        setPitches(list)
      }
      if (teamRes.status === 'fulfilled') {
        setMembers(Array.isArray(teamRes.value.data) ? teamRes.value.data : [])
      }
    }).finally(() => setStatsLoading(false))
  }, [startup?.id, startupLoading])

  const completeness = calcCompleteness(startup, members)
  const onboardingStep = calcOnboardingStep(startup, members, pitches)
  const loading = startupLoading || statsLoading

  // Derive a lightweight activity feed from applications
  const activity = applications.slice(0, 5).map((a) => ({
    icon: statusConfig[a.status]?.icon ?? Clock,
    text: `${a.provider_name ?? 'Funding application'} — ${statusConfig[a.status]?.label ?? a.status}`,
    time: a.applied_at ? formatDate(a.applied_at) : '—',
    color: a.status === 'APPROVED' ? 'text-emerald-400' : a.status === 'REJECTED' ? 'text-red-400' : 'text-blue-400',
  }))

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Onboarding Banner */}
      {showOnboarding && onboardingStep < 4 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gold-gradient rounded-xl p-5 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-10" />
          <button onClick={() => setShowOnboarding(false)}
            className="absolute top-3 right-3 text-navy-800 hover:text-navy-950 transition-colors">
            <X size={18} />
          </button>
          <div className="relative z-10">
            <p className="text-navy-950 font-semibold mb-3">Complete your profile to attract investors</p>
            <OnboardingProgress currentStep={onboardingStep} />
            <div className="mt-4">
              <GoldButton variant="ghost" size="sm"
                className="bg-navy-950 text-white hover:bg-navy-900 border-0"
                onClick={() => navigate('/dashboard/profile')}>
                Continue Setup <ArrowRight size={14} />
              </GoldButton>
            </div>
          </div>
        </motion.div>
      )}

      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          {greeting()}, {user?.full_name?.split(' ')[0] || 'Founder'} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Profile Completeness" value={loading ? '—' : `${completeness}%`} icon={BarChart3} loading={loading} />
        <StatCard label="Pitches Generated" value={loading ? '—' : pitches.length} icon={FileText} loading={loading} />
        <StatCard label="Funding Applications" value={loading ? '—' : applications.length} icon={Wallet} loading={loading} />
        <StatCard label="Profile Views" value="—" icon={Eye} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-navy-800 rounded-xl p-5 border border-navy-700">
            <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <GoldButton size="sm" onClick={() => navigate('/dashboard/pitch')} icon={<FileText size={14} />}>
                Generate New Pitch
              </GoldButton>
              <GoldButton variant="secondary" size="sm" onClick={() => navigate('/dashboard/financials')} icon={<BarChart3 size={14} />}>
                Update Financials
              </GoldButton>
              <GoldButton variant="secondary" size="sm" onClick={() => navigate('/dashboard/funding')} icon={<Wallet size={14} />}>
                Browse Funding
              </GoldButton>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-navy-700">
              <h2 className="font-semibold text-white">Funding Applications</h2>
              <button onClick={() => navigate('/dashboard/funding')} className="text-gold-500 text-xs hover:text-gold-400 transition-colors">
                View all →
              </button>
            </div>

            {statsLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 size={24} className="animate-spin text-gold-500" />
              </div>
            ) : applications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No applications yet.{' '}
                <button onClick={() => navigate('/dashboard/funding')} className="text-gold-400 hover:underline">Browse funding →</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-navy-700">
                      {['Provider', 'Amount', 'Status', 'Date'].map((h) => (
                        <th key={h} className="text-left text-xs text-slate-500 font-medium px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {applications.slice(0, 5).map((a) => {
                      const cfg = statusConfig[a.status] || statusConfig.PENDING
                      const Icon = cfg.icon
                      return (
                        <tr key={a.id} className="border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors">
                          <td className="px-5 py-3.5 text-white text-sm font-medium">{a.provider_name ?? a.provider ?? '—'}</td>
                          <td className="px-5 py-3.5 font-mono text-sm text-gold-400">{formatCurrency(a.amount_requested ?? a.amount ?? 0)}</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.class}`}>
                              <Icon size={11} /> {cfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-400 text-xs">{a.applied_at ? formatDate(a.applied_at) : '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-navy-800 rounded-xl border border-navy-700 p-5">
          <h2 className="font-semibold text-white mb-4">Recent Activity</h2>
          {statsLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 size={24} className="animate-spin text-gold-500" />
            </div>
          ) : activity.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No recent activity yet.</p>
          ) : (
            <div className="space-y-4">
              {activity.map(({ icon: Icon, text, time, color }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon size={14} />
                  </div>
                  <div>
                    <p className="text-slate-300 text-xs leading-relaxed">{text}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
