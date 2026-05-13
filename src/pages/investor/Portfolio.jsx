import { useState, useEffect, useCallback } from 'react'
import { Briefcase, Loader2, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../../components/common/StatCard'
import GoldButton from '../../components/common/GoldButton'
import { formatCurrency } from '../../utils/formatCurrency'
import { getPortfolio } from '../../api/investor'
import { useToast } from '../../context/ToastContext'

export default function Portfolio() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPortfolio = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getPortfolio()
      const list = Array.isArray(data) ? data : (data?.results ?? [])
      setPortfolio(list)
    } catch {
      toast({ type: 'error', message: 'Could not load portfolio data.' })
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchPortfolio() }, [fetchPortfolio])

  const totalInvested = portfolio.reduce((sum, p) => sum + (p.amount_invested ?? p.invested ?? 0), 0)
  const totalCurrent = portfolio.reduce((sum, p) => sum + (p.current_value ?? p.current ?? 0), 0)
  const roi = totalInvested > 0
    ? (((totalCurrent - totalInvested) / totalInvested) * 100).toFixed(1)
    : '0.0'

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-gold-500" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Portfolio</h1>
        <p className="text-slate-400 text-sm mt-1">Track your startup investments</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Invested" value={formatCurrency(totalInvested)} icon={TrendingUp} />
        <StatCard label="Current Value" value={formatCurrency(totalCurrent)} icon={TrendingUp}
          trend={totalCurrent >= totalInvested ? 'up' : 'down'}
          trendValue={`${totalCurrent >= totalInvested ? '+' : ''}${roi}% ROI`} />
        <StatCard label="Portfolio Companies" value={portfolio.length} icon={Briefcase} />
      </div>

      {portfolio.length === 0 ? (
        <div className="text-center py-20 bg-navy-800 rounded-xl border border-navy-700">
          <Briefcase size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No investments yet</h3>
          <p className="text-slate-400 text-sm mb-6">Express interest in startups from deal flow to start building your portfolio</p>
          <GoldButton onClick={() => navigate('/investor/dashboard')}>Browse Deal Flow</GoldButton>
        </div>
      ) : (
        <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-700">
                {['Company', 'Invested', 'Current Value', 'ROI', 'Stage', 'Date'].map((h) => (
                  <th key={h} className="text-left text-xs text-slate-500 font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {portfolio.map((p) => {
                const invested = p.amount_invested ?? p.invested ?? 0
                const current = p.current_value ?? p.current ?? 0
                const r = invested > 0 ? (((current - invested) / invested) * 100).toFixed(1) : '0.0'
                const isPositive = current >= invested
                const name = p.startup_name ?? p.name ?? 'Unknown'
                const stage = p.stage ?? '—'
                const date = p.investment_date ?? p.date ?? '—'

                return (
                  <tr key={p.id ?? name} className="border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors">
                    <td className="px-5 py-3.5 text-white text-sm font-medium">{name}</td>
                    <td className="px-5 py-3.5 font-mono text-sm text-slate-300">{formatCurrency(invested)}</td>
                    <td className="px-5 py-3.5 font-mono text-sm text-gold-400">{formatCurrency(current)}</td>
                    <td className={`px-5 py-3.5 font-mono text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isPositive ? '+' : ''}{r}%
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{stage}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
