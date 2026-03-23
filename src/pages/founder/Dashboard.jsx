import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart3, FileText, Eye, Wallet, X, ArrowRight,
  CheckCircle2, Clock, XCircle, AlertCircle, TrendingUp
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/common/StatCard'
import OnboardingProgress from '../../components/common/OnboardingProgress'
import GoldButton from '../../components/common/GoldButton'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate, timeAgo } from '../../utils/formatDate'

const SAMPLE_APPLICATIONS = [
  { id: 1, provider: 'Lagos Angel Network', amount: 5000000, status: 'REVIEWING', date: '2024-11-10' },
  { id: 2, provider: 'Tony Elumelu Foundation', amount: 10000000, status: 'APPROVED', date: '2024-11-05' },
  { id: 3, provider: 'Ventures Platform', amount: 25000000, status: 'PENDING', date: '2024-11-15' },
  { id: 4, provider: 'Microtraction', amount: 3000000, status: 'REJECTED', date: '2024-10-28' },
]

const ACTIVITY = [
  { icon: FileText, text: 'Pitch deck generated successfully', time: '2 hours ago', color: 'text-gold-400' },
  { icon: Eye, text: 'Investor viewed your profile', time: '5 hours ago', color: 'text-blue-400' },
  { icon: CheckCircle2, text: 'Tony Elumelu application approved', time: '1 day ago', color: 'text-emerald-400' },
  { icon: TrendingUp, text: 'Financial data updated', time: '2 days ago', color: 'text-purple-400' },
  { icon: Eye, text: '3 new investors viewed your profile', time: '3 days ago', color: 'text-blue-400' },
]

const statusConfig = {
  PENDING: { label: 'Pending', icon: Clock, class: 'bg-slate-700/50 text-slate-300' },
  REVIEWING: { label: 'Reviewing', icon: AlertCircle, class: 'bg-blue-900/50 text-blue-300' },
  APPROVED: { label: 'Approved', icon: CheckCircle2, class: 'bg-emerald-900/50 text-emerald-400' },
  REJECTED: { label: 'Rejected', icon: XCircle, class: 'bg-red-900/50 text-red-400' },
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showOnboarding, setShowOnboarding] = useState(true)
  const onboardingStep = 2

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Onboarding Banner */}
      {showOnboarding && (
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
        <p className="text-slate-400 text-sm mt-1">{new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Profile Completeness" value="65%" icon={BarChart3} trend="up" trendValue="+15% this week" />
        <StatCard label="Pitches Generated" value="3" icon={FileText} trend="up" trendValue="+1 this week" />
        <StatCard label="Funding Applications" value="4" icon={Wallet} trend="up" trendValue="+2 this month" />
        <StatCard label="Profile Views" value="28" icon={Eye} trend="up" trendValue="+8 this week" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-navy-700">
                    {['Provider', 'Amount', 'Status', 'Date'].map(h => (
                      <th key={h} className="text-left text-xs text-slate-500 font-medium px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_APPLICATIONS.map(({ id, provider, amount, status, date }) => {
                    const cfg = statusConfig[status]
                    const Icon = cfg.icon
                    return (
                      <tr key={id} className="border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors">
                        <td className="px-5 py-3.5 text-white text-sm font-medium">{provider}</td>
                        <td className="px-5 py-3.5 font-mono text-sm text-gold-400">{formatCurrency(amount)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.class}`}>
                            <Icon size={11} /> {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs">{formatDate(date)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-navy-800 rounded-xl border border-navy-700 p-5">
          <h2 className="font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {ACTIVITY.map(({ icon: Icon, text, time, color }, i) => (
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
        </div>
      </div>
    </div>
  )
}
