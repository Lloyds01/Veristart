import { Briefcase } from 'lucide-react'
import StatCard from '../../components/common/StatCard'
import { TrendingUp } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

const PORTFOLIO = [
  { name: 'AgriTech Nigeria', invested: 5000000, current: 8500000, stage: 'GROWTH', date: 'Mar 2024' },
  { name: 'PayStack Clone', invested: 25000000, current: 45000000, stage: 'SCALE', date: 'Jan 2024' },
]

export default function Portfolio() {
  const totalInvested = PORTFOLIO.reduce((s, p) => s + p.invested, 0)
  const totalCurrent = PORTFOLIO.reduce((s, p) => s + p.current, 0)
  const roi = (((totalCurrent - totalInvested) / totalInvested) * 100).toFixed(1)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Portfolio</h1>
        <p className="text-slate-400 text-sm mt-1">Track your startup investments</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Invested" value={formatCurrency(totalInvested)} icon={TrendingUp} />
        <StatCard label="Current Value" value={formatCurrency(totalCurrent)} icon={TrendingUp} trend="up" trendValue={`+${roi}% ROI`} />
        <StatCard label="Portfolio Companies" value={PORTFOLIO.length} icon={Briefcase} />
      </div>

      <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-navy-700">
              {['Company', 'Invested', 'Current Value', 'ROI', 'Stage', 'Date'].map(h => (
                <th key={h} className="text-left text-xs text-slate-500 font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PORTFOLIO.map(({ name, invested, current, stage, date }) => {
              const r = (((current - invested) / invested) * 100).toFixed(1)
              return (
                <tr key={name} className="border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors">
                  <td className="px-5 py-3.5 text-white text-sm font-medium">{name}</td>
                  <td className="px-5 py-3.5 font-mono text-sm text-slate-300">{formatCurrency(invested)}</td>
                  <td className="px-5 py-3.5 font-mono text-sm text-gold-400">{formatCurrency(current)}</td>
                  <td className="px-5 py-3.5 font-mono text-sm text-emerald-400">+{r}%</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{stage}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{date}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
