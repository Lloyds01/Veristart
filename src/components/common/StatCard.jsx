import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ label, value, icon: Icon, trend, trendValue, loading }) {
  if (loading) {
    return (
      <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 animate-pulse">
        <div className="h-4 bg-navy-700 rounded w-24 mb-4" />
        <div className="h-8 bg-navy-700 rounded w-32 mb-2" />
        <div className="h-3 bg-navy-700 rounded w-16" />
      </div>
    )
  }

  return (
    <div className="bg-navy-800 rounded-xl p-6 border-l-2 border-l-gold-500 border border-navy-700 card-hover relative overflow-hidden">
      {Icon && (
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
          <Icon size={18} className="text-gold-500" />
        </div>
      )}
      <p className="text-grey-400 text-sm text-slate-400 mb-1">{label}</p>
      <p className="font-mono text-2xl font-semibold text-white mt-1">{value}</p>
      {trendValue !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-red-400'}`}>
          {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  )
}
