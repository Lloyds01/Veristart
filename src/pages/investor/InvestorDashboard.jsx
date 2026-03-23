import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, TrendingUp, Users, Calendar, BadgeCheck, Download, Heart } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import StartupCard from '../../components/common/StartupCard'
import GoldButton from '../../components/common/GoldButton'
import StatCard from '../../components/common/StatCard'
import { formatCurrency } from '../../utils/formatCurrency'

const STARTUPS = [
  { id: 1, name: 'AgriTech Nigeria', industry: 'Agriculture', stage: 'GROWTH', health_score: 87, monthly_revenue: 4500000, team_size: 12, founded_year: 2021, is_verified: true, location: 'Lagos', description: 'AI-powered precision farming platform connecting smallholder farmers to markets.' },
  { id: 2, name: 'PayStack Clone', industry: 'Fintech', stage: 'SCALE', health_score: 94, monthly_revenue: 18000000, team_size: 45, founded_year: 2020, is_verified: true, location: 'Lagos', description: 'Next-generation payment infrastructure for African businesses.' },
  { id: 3, name: 'HealthBridge', industry: 'HealthTech', stage: 'TRACTION', health_score: 72, monthly_revenue: 1200000, team_size: 8, founded_year: 2022, is_verified: false, location: 'Abuja', description: 'Telemedicine platform connecting patients to verified doctors across Nigeria.' },
  { id: 4, name: 'EduReach Africa', industry: 'EdTech', stage: 'MVP', health_score: 61, monthly_revenue: 350000, team_size: 5, founded_year: 2023, is_verified: true, location: 'Kano', description: 'Offline-first learning platform for underserved communities.' },
  { id: 5, name: 'LogiFlow', industry: 'Logistics', stage: 'GROWTH', health_score: 79, monthly_revenue: 6800000, team_size: 22, founded_year: 2021, is_verified: true, location: 'Lagos', description: 'Last-mile delivery optimization for African e-commerce.' },
  { id: 6, name: 'SolarGrid', industry: 'CleanTech', stage: 'TRACTION', health_score: 68, monthly_revenue: 900000, team_size: 9, founded_year: 2022, is_verified: false, location: 'Port Harcourt', description: 'Distributed solar energy solutions for off-grid communities.' },
]

const REVENUE_DATA = [
  { month: 'Jun', revenue: 1200000 }, { month: 'Jul', revenue: 1800000 },
  { month: 'Aug', revenue: 2100000 }, { month: 'Sep', revenue: 2800000 },
  { month: 'Oct', revenue: 3500000 }, { month: 'Nov', revenue: 4500000 },
]

const EXPENSE_DATA = [
  { name: 'Salaries', value: 45, color: '#C9A84C' },
  { name: 'Marketing', value: 20, color: '#E8C87A' },
  { name: 'Operations', value: 18, color: '#3B82F6' },
  { name: 'Tech', value: 12, color: '#10B981' },
  { name: 'Other', value: 5, color: '#475569' },
]

function StartupDetailModal({ startup, onClose }) {
  const [saved, setSaved] = useState(false)
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
            <button onClick={() => setSaved(!saved)}
              className={`p-2 rounded-lg transition-all ${saved ? 'text-gold-500 bg-gold-500/10' : 'text-slate-400 hover:text-gold-400 hover:bg-navy-700'}`}>
              <Heart size={18} className={saved ? 'fill-current' : ''} />
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-2 hover:bg-navy-700 rounded-lg transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-slate-300 leading-relaxed">{startup.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Monthly Revenue" value={formatCurrency(startup.monthly_revenue)} icon={TrendingUp} trend="up" trendValue="+28% MoM" />
            <StatCard label="Team Size" value={startup.team_size} icon={Users} />
            <StatCard label="Founded" value={startup.founded_year} icon={Calendar} />
            <StatCard label="Health Score" value={`${startup.health_score}/100`} icon={TrendingUp} trend="up" trendValue="Top 15%" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-navy-800 rounded-xl border border-navy-700 p-5">
              <h3 className="font-semibold text-white mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2F4D" />
                  <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false}
                    tickFormatter={v => `₦${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip contentStyle={{ background: '#152035', border: '1px solid #1E2F4D', borderRadius: '8px' }}
                    formatter={v => [formatCurrency(v), 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2.5} dot={{ fill: '#C9A84C', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-navy-800 rounded-xl border border-navy-700 p-5">
              <h3 className="font-semibold text-white mb-4">Expense Breakdown</h3>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={EXPENSE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                    {EXPENSE_DATA.map(({ color }, i) => <Cell key={i} fill={color} />)}
                  </Pie>
                  <Tooltip formatter={v => `${v}%`} contentStyle={{ background: '#152035', border: '1px solid #1E2F4D', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {EXPENSE_DATA.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-slate-400">{name}: {value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <GoldButton size="lg">Express Interest</GoldButton>
            <GoldButton variant="secondary" size="lg" icon={<Heart size={16} />} onClick={() => setSaved(!saved)}>
              {saved ? 'Saved to Portfolio' : 'Save to Portfolio'}
            </GoldButton>
            <GoldButton variant="secondary" size="lg" icon={<Download size={16} />}>Download Pitch</GoldButton>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default function InvestorDashboard() {
  const [search, setSearch] = useState('')
  const [industryFilter, setIndustryFilter] = useState('All')
  const [stageFilter, setStageFilter] = useState('All')
  const [sort, setSort] = useState('health')
  const [selected, setSelected] = useState(null)

  const industries = ['All', ...new Set(STARTUPS.map(s => s.industry))]
  const stages = ['All', 'IDEA', 'MVP', 'TRACTION', 'GROWTH', 'SCALE']

  const filtered = STARTUPS
    .filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.industry.toLowerCase().includes(search.toLowerCase())
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
        <StatCard label="Startups Available" value="1,200+" icon={TrendingUp} />
        <StatCard label="Verified Startups" value="847" icon={BadgeCheck} />
        <StatCard label="Saved Startups" value="12" icon={Heart} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search startups..."
            className="w-full bg-navy-800 border border-navy-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
        </div>
        <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)}
          className="bg-navy-800 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors">
          {industries.map(i => <option key={i}>{i}</option>)}
        </select>
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}
          className="bg-navy-800 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors">
          {stages.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="bg-navy-800 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors">
          <option value="health">Best Health Score</option>
          <option value="revenue">Highest Revenue</option>
          <option value="recent">Most Recent</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(s => (
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

      <AnimatePresence>
        {selected && <StartupDetailModal startup={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
