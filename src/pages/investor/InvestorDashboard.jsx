import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, TrendingUp, Users, Calendar, BadgeCheck, Download, Heart, Loader2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import StartupCard from '../../components/common/StartupCard'
import GoldButton from '../../components/common/GoldButton'
import StatCard from '../../components/common/StatCard'
import { formatCurrency } from '../../utils/formatCurrency'
import { listStartups } from '../../api/startup'
import {
  getInvestorStats,
  listSavedStartups,
  saveStartup,
  unsaveStartup,
  expressInterest,
  getStartupFinancials,
  downloadStartupPitch,
} from '../../api/investor'
import { useToast } from '../../context/ToastContext'

// Normalise whatever shape the backend returns into what the UI needs
const normalizeStartup = (s) => ({
  id: s.id,
  name: s.business_name || s.name || 'Unnamed',
  industry: s.industry_name || (typeof s.industry === 'string' ? s.industry : s.industry?.name) || '—',
  stage: s.stage || 'IDEA',
  health_score: s.health_score ?? 0,
  monthly_revenue: s.latest_monthly_revenue ?? s.monthly_revenue ?? 0,
  team_size: s.team_count ?? s.team_size ?? 0,
  founded_year: s.founded_date ? new Date(s.founded_date).getFullYear() : (s.founded_year ?? null),
  is_verified: s.is_verified ?? false,
  location: s.headquarters || s.location || '',
  description: s.description || '',
})

const EXPENSE_FALLBACK = [
  { name: 'Salaries', value: 45, color: '#C9A84C' },
  { name: 'Marketing', value: 20, color: '#E8C87A' },
  { name: 'Operations', value: 18, color: '#3B82F6' },
  { name: 'Tech', value: 12, color: '#10B981' },
  { name: 'Other', value: 5, color: '#475569' },
]

function StartupDetailModal({ startup, isSaved, savedId, onClose, onToggleSave }) {
  const [financials, setFinancials] = useState(null)
  const [loadingFin, setLoadingFin] = useState(true)
  const [savingState, setSavingState] = useState(false)
  const [interestSent, setInterestSent] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    getStartupFinancials(startup.id)
      .then(({ data }) => setFinancials(data))
      .catch(() => {})
      .finally(() => setLoadingFin(false))
  }, [startup.id])

  const handleSave = async () => {
    setSavingState(true)
    await onToggleSave(startup.id, savedId)
    setSavingState(false)
  }

  const handleInterest = async () => {
    try {
      await expressInterest(startup.id, {})
      setInterestSent(true)
      toast({ type: 'success', message: `Interest expressed in ${startup.name}.` })
    } catch {
      toast({ type: 'error', message: 'Could not send interest. Please try again.' })
    }
  }

  const handleDownload = async () => {
    try {
      const { data } = await downloadStartupPitch(startup.id)
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `${startup.name}-pitch.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast({ type: 'error', message: 'Pitch deck not available for this startup.' })
    }
  }

  const revenueData = financials?.revenue_trend || []
  const expenseData = financials?.expense_breakdown || EXPENSE_FALLBACK

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
        className="fixed inset-4 md:inset-8 bg-navy-900 rounded-2xl border border-navy-700 z-50 overflow-y-auto shadow-navy-lg">

        <div className="sticky top-0 bg-navy-900/95 backdrop-blur-sm border-b border-navy-700 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-navy-950 font-bold">
              {startup.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white">{startup.name}</h2>
                {startup.is_verified && <BadgeCheck size={16} className="text-gold-500" />}
              </div>
              <p className="text-slate-400 text-xs">{startup.industry} · {startup.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSave} disabled={savingState}
              className={`p-2 rounded-lg transition-all ${isSaved ? 'text-gold-500 bg-gold-500/10' : 'text-slate-400 hover:text-gold-400 hover:bg-navy-700'}`}>
              {savingState ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} className={isSaved ? 'fill-current' : ''} />}
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-2 hover:bg-navy-700 rounded-lg transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-slate-300 leading-relaxed">{startup.description || 'No description available.'}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Monthly Revenue" value={formatCurrency(startup.monthly_revenue)} icon={TrendingUp} />
            <StatCard label="Team Size" value={startup.team_size || '—'} icon={Users} />
            <StatCard label="Founded" value={startup.founded_year || '—'} icon={Calendar} />
            <StatCard label="Health Score" value={`${startup.health_score}/100`} icon={TrendingUp} />
          </div>

          {loadingFin ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 size={28} className="animate-spin text-gold-500" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-navy-800 rounded-xl border border-navy-700 p-5">
                <h3 className="font-semibold text-white mb-4">Revenue Trend</h3>
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E2F4D" />
                      <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false}
                        tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`} />
                      <Tooltip contentStyle={{ background: '#152035', border: '1px solid #1E2F4D', borderRadius: '8px' }}
                        formatter={(v) => [formatCurrency(v), 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2.5} dot={{ fill: '#C9A84C', r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-40 text-slate-500 text-sm">No financial data available</div>
                )}
              </div>

              <div className="bg-navy-800 rounded-xl border border-navy-700 p-5">
                <h3 className="font-semibold text-white mb-4">Expense Breakdown</h3>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={expenseData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                      {expenseData.map(({ color }, i) => <Cell key={i} fill={color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#152035', border: '1px solid #1E2F4D', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-1 mt-2">
                  {expenseData.map(({ name, value, color }) => (
                    <div key={name} className="flex items-center gap-1.5 text-xs">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                      <span className="text-slate-400">{name}: {value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <GoldButton size="lg" onClick={handleInterest} disabled={interestSent}>
              {interestSent ? '✓ Interest Sent' : 'Express Interest'}
            </GoldButton>
            <GoldButton variant="secondary" size="lg" icon={<Heart size={16} className={isSaved ? 'fill-current' : ''} />} onClick={handleSave}>
              {isSaved ? 'Saved' : 'Save Startup'}
            </GoldButton>
            <GoldButton variant="secondary" size="lg" icon={<Download size={16} />} onClick={handleDownload}>
              Download Pitch
            </GoldButton>
          </div>
        </div>
      </motion.div>
    </>
  )
}

const STAGES = ['All', 'IDEA', 'MVP', 'TRACTION', 'GROWTH', 'SCALE']

export default function InvestorDashboard() {
  const { toast } = useToast()
  const [startups, setStartups] = useState([])
  const [stats, setStats] = useState({ total: 0, verified: 0, saved: 0 })
  const [savedMap, setSavedMap] = useState({}) // { [startupId]: savedRecordId }
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [industryFilter, setIndustryFilter] = useState('All')
  const [stageFilter, setStageFilter] = useState('All')
  const [sort, setSort] = useState('health')
  const [selected, setSelected] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [startupsRes, savedRes, statsRes] = await Promise.allSettled([
        listStartups(),
        listSavedStartups(),
        getInvestorStats(),
      ])

      const rawStartups = startupsRes.status === 'fulfilled'
        ? (Array.isArray(startupsRes.value.data) ? startupsRes.value.data : startupsRes.value.data?.results ?? [])
        : []
      setStartups(rawStartups.map(normalizeStartup))

      if (savedRes.status === 'fulfilled') {
        const savedList = Array.isArray(savedRes.value.data) ? savedRes.value.data : []
        const map = {}
        savedList.forEach((s) => { map[s.startup_id ?? s.startup?.id] = s.id })
        setSavedMap(map)
      }

      if (statsRes.status === 'fulfilled') {
        const d = statsRes.value.data
        setStats({
          total: d.total_startups ?? rawStartups.length,
          verified: d.verified_startups ?? rawStartups.filter((s) => s.is_verified).length,
          saved: d.saved_count ?? Object.keys(savedMap).length,
        })
      }
    } catch {
      toast({ type: 'error', message: 'Failed to load deal flow.' })
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleToggleSave = async (startupId, savedId) => {
    if (savedId) {
      try {
        await unsaveStartup(savedId)
        setSavedMap((prev) => { const n = { ...prev }; delete n[startupId]; return n })
        setStats((s) => ({ ...s, saved: Math.max(0, s.saved - 1) }))
      } catch {
        toast({ type: 'error', message: 'Could not remove startup from saved list.' })
      }
    } else {
      try {
        const { data } = await saveStartup(startupId)
        setSavedMap((prev) => ({ ...prev, [startupId]: data.id }))
        setStats((s) => ({ ...s, saved: s.saved + 1 }))
      } catch {
        toast({ type: 'error', message: 'Could not save startup.' })
      }
    }
  }

  const industries = ['All', ...new Set(startups.map((s) => s.industry).filter(Boolean))]

  const filtered = startups
    .filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.industry.toLowerCase().includes(search.toLowerCase())
      const matchIndustry = industryFilter === 'All' || s.industry === industryFilter
      const matchStage = stageFilter === 'All' || s.stage === stageFilter
      return matchSearch && matchIndustry && matchStage
    })
    .sort((a, b) => {
      if (sort === 'health') return b.health_score - a.health_score
      if (sort === 'revenue') return b.monthly_revenue - a.monthly_revenue
      return b.id - a.id
    })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Deal Flow</h1>
        <p className="text-slate-400 text-sm mt-1">Discover and evaluate verified African startups</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Startups Available" value={loading ? '—' : stats.total.toLocaleString()} icon={TrendingUp} loading={loading} />
        <StatCard label="Verified Startups" value={loading ? '—' : stats.verified.toLocaleString()} icon={BadgeCheck} loading={loading} />
        <StatCard label="Saved Startups" value={loading ? '—' : Object.keys(savedMap).length} icon={Heart} loading={loading} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search startups..."
            className="w-full bg-navy-800 border border-navy-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
        </div>
        <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}
          className="bg-navy-800 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors">
          {industries.map((i) => <option key={i}>{i}</option>)}
        </select>
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}
          className="bg-navy-800 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors">
          {STAGES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="bg-navy-800 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors">
          <option value="health">Best Health Score</option>
          <option value="revenue">Highest Revenue</option>
          <option value="recent">Most Recent</option>
        </select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-navy-800 rounded-xl border border-navy-700 p-6 animate-pulse h-52" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((s) => (
              <StartupCard key={s.id} startup={s} onClick={() => setSelected(s)} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-navy-800 rounded-xl border border-navy-700">
              <SlidersHorizontal size={40} className="text-slate-600 mx-auto mb-3" />
              <p className="text-white font-medium mb-1">No startups found</p>
              <p className="text-slate-400 text-sm">Try adjusting your filters</p>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {selected && (
          <StartupDetailModal
            startup={selected}
            isSaved={!!savedMap[selected.id]}
            savedId={savedMap[selected.id]}
            onClose={() => setSelected(null)}
            onToggleSave={handleToggleSave}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
