import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Upload, FileSpreadsheet, TrendingUp, TrendingDown, RefreshCw, CheckCircle2 } from 'lucide-react'
import GoldButton from '../../components/common/GoldButton'
import StatCard from '../../components/common/StatCard'
import { formatCurrency } from '../../utils/formatCurrency'

const REVENUE_DATA = [
  { month: 'Jun', revenue: 1200000, expenses: 900000 },
  { month: 'Jul', revenue: 1800000, expenses: 1100000 },
  { month: 'Aug', revenue: 2100000, expenses: 1300000 },
  { month: 'Sep', revenue: 2800000, expenses: 1500000 },
  { month: 'Oct', revenue: 3500000, expenses: 1800000 },
  { month: 'Nov', revenue: 4500000, expenses: 2100000 },
]

const EXPENSE_DATA = [
  { name: 'Salaries', value: 45, color: '#C9A84C' },
  { name: 'Marketing', value: 20, color: '#E8C87A' },
  { name: 'Operations', value: 18, color: '#3B82F6' },
  { name: 'Tech', value: 12, color: '#10B981' },
  { name: 'Other', value: 5, color: '#475569' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-lg p-3 shadow-navy-lg">
      <p className="text-slate-400 text-xs mb-2">{label}</p>
      {payload.map(({ name, value, color }) => (
        <p key={name} className="font-mono text-sm font-medium" style={{ color }}>
          {name}: {formatCurrency(value)}
        </p>
      ))}
    </div>
  )
}

export default function Financials() {
  const [uploaded, setUploaded] = useState(true)
  const [dragging, setDragging] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  const handleRegenerate = async () => {
    setRegenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    setRegenerating(false)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Financial Data</h1>
          <p className="text-slate-400 text-sm mt-1">Upload and analyse your startup's financial performance</p>
        </div>
        {uploaded && (
          <GoldButton variant="secondary" size="sm" loading={regenerating} icon={<RefreshCw size={14} />} onClick={handleRegenerate}>
            Regenerate Analysis
          </GoldButton>
        )}
      </div>

      {/* Upload Zone */}
      {!uploaded ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); setUploaded(true) }}
          className={`border-2 border-dashed rounded-xl p-16 text-center transition-all duration-200 cursor-pointer mb-6 ${dragging ? 'border-gold-500 bg-gold-500/5' : 'border-navy-700 hover:border-gold-500/50 bg-navy-800'}`}
          onClick={() => setUploaded(true)}>
          <FileSpreadsheet size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">Upload Financial Data</h3>
          <p className="text-slate-400 text-sm mb-4">Drag & drop your Excel or CSV file, or click to browse</p>
          <p className="text-slate-600 text-xs">Supported: .xlsx, .csv, .pdf — Max 10MB</p>
        </div>
      ) : (
        <>
          {/* Upload Success Banner */}
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mb-6">
            <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-emerald-300 text-sm font-medium">Financial data uploaded and analysed</p>
              <p className="text-emerald-500 text-xs">Last updated: Nov 15, 2024 · Q3 2024 financials</p>
            </div>
            <button onClick={() => setUploaded(false)} className="text-slate-400 hover:text-white text-xs transition-colors">
              Replace file
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Monthly Revenue" value="₦4.5M" icon={TrendingUp} trend="up" trendValue="+28% MoM" />
            <StatCard label="Monthly Expenses" value="₦2.1M" icon={TrendingDown} trend="up" trendValue="+16% MoM" />
            <StatCard label="Net Profit" value="₦2.4M" icon={TrendingUp} trend="up" trendValue="+42% MoM" />
            <StatCard label="Runway" value="14 months" icon={TrendingUp} trend="up" trendValue="+2 months" />
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Revenue Trend */}
            <div className="lg:col-span-2 bg-navy-800 rounded-xl border border-navy-700 p-5">
              <h3 className="font-semibold text-white mb-4">Revenue vs Expenses Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2F4D" />
                  <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2.5} dot={{ fill: '#C9A84C', r: 4 }} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 3 }} strokeDasharray="4 4" name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Expense Breakdown */}
            <div className="bg-navy-800 rounded-xl border border-navy-700 p-5">
              <h3 className="font-semibold text-white mb-4">Expense Breakdown</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={EXPENSE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {EXPENSE_DATA.map(({ color }, i) => <Cell key={i} fill={color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#152035', border: '1px solid #1E2F4D', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {EXPENSE_DATA.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                      <span className="text-slate-400">{name}</span>
                    </div>
                    <span className="font-mono text-white">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Breakdown Bar Chart */}
          <div className="bg-navy-800 rounded-xl border border-navy-700 p-5">
            <h3 className="font-semibold text-white mb-4">Monthly Net Profit</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={REVENUE_DATA.map(d => ({ ...d, profit: d.revenue - d.expenses }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2F4D" />
                <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="profit" fill="#C9A84C" radius={[4, 4, 0, 0]} name="Net Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
