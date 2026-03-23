import { BadgeCheck, Users, Calendar, TrendingUp } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import GoldButton from './GoldButton'

const stageColors = {
  IDEA: 'bg-slate-700 text-slate-300',
  MVP: 'bg-blue-900/60 text-blue-300',
  TRACTION: 'bg-purple-900/60 text-purple-300',
  GROWTH: 'bg-emerald-900/60 text-emerald-400',
  SCALE: 'bg-gold-500/20 text-gold-400',
}

function HealthRing({ score }) {
  const r = 20
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="56" height="56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#1E2F4D" strokeWidth="4" />
        <circle cx="28" cy="28" r={r} fill="none" stroke="#C9A84C" strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="font-mono text-xs font-bold text-gold-400">{score}</span>
    </div>
  )
}

export default function StartupCard({ startup, onClick }) {
  const { name, industry, stage, health_score, monthly_revenue, team_size, founded_year, is_verified } = startup

  return (
    <div
      onClick={onClick}
      className="group bg-navy-800 rounded-xl p-6 border border-navy-700 card-hover cursor-pointer relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white truncate">{name}</h3>
            {is_verified && <BadgeCheck size={16} className="text-gold-500 flex-shrink-0" />}
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-navy-700 text-slate-400">{industry}</span>
        </div>
        <HealthRing score={health_score || 0} />
      </div>

      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${stageColors[stage] || stageColors.IDEA}`}>
        {stage}
      </span>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-navy-700">
        <div>
          <p className="text-slate-500 text-xs mb-0.5">Revenue</p>
          <p className="font-mono text-xs text-white font-medium">{formatCurrency(monthly_revenue)}/mo</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-0.5">Team</p>
          <p className="font-mono text-xs text-white font-medium flex items-center gap-1"><Users size={10} />{team_size || '—'}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-0.5">Founded</p>
          <p className="font-mono text-xs text-white font-medium flex items-center gap-1"><Calendar size={10} />{founded_year || '—'}</p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-12 flex items-center justify-center bg-navy-700/95 translate-y-full group-hover:translate-y-0 transition-transform duration-200 rounded-b-xl">
        <span className="text-gold-400 text-sm font-medium">View Profile →</span>
      </div>
    </div>
  )
}
