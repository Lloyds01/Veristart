import { useState, useEffect, useRef, useCallback } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { FileSpreadsheet, TrendingUp, TrendingDown, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import GoldButton from '../../components/common/GoldButton'
import StatCard from '../../components/common/StatCard'
import { formatCurrency } from '../../utils/formatCurrency'
import { useStartup } from '../../context/StartupContext'
import { uploadData, getSummary, regenerateSummary } from '../../api/financial'
import { useToast } from '../../context/ToastContext'

const EXPENSE_COLORS = ['#C9A84C', '#E8C87A', '#3B82F6', '#10B981', '#475569']

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
  const { toast } = useToast()
  const { startupId } = useStartup()
  const fileInputRef = useRef(null)

  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const fetchSummary = useCallback(async () => {
    if (!startupId) return
    setSummaryLoading(true)
    try {
      const { data } = await getSummary(startupId)
      setSummary(data)
    } catch (err) {
      if (err?.response?.status !== 404) {
        toast({ type: 'error', message: 'Could not load financial summary.' })
      }
      // 404 means no financials uploaded yet — that's fine
    } finally {
      setSummaryLoading(false)
    }
  }, [startupId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchSummary() }, [fetchSummary])

  const handleFile = async (file) => {
    if (!file) return
    const allowed = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/pdf']
    if (!allowed.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls|pdf)$/i)) {
      setUploadError('Please upload an Excel, CSV, or PDF file.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File must be under 10MB.')
      return
    }
    if (!startupId) {
      toast({ type: 'error', message: 'Complete your startup profile before uploading financials.' })
      return
    }
    setUploadError('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await uploadData(startupId, formData)
      toast({ type: 'success', message: 'Financial data uploaded and analysed.' })
      await fetchSummary()
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || 'Upload failed. Please try again.'
      setUploadError(msg)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    await handleFile(file)
  }

  const handleRegenerate = async () => {
    if (!startupId) return
    setRegenerating(true)
    try {
      const { data } = await regenerateSummary(startupId)
      setSummary(data)
      toast({ type: 'success', message: 'Financial analysis regenerated.' })
    } catch {
      toast({ type: 'error', message: 'Could not regenerate analysis.' })
    } finally {
      setRegenerating(false)
    }
  }

  // Normalise whatever shape the backend returns
  const revenueData = summary?.revenue_trend ?? summary?.monthly_data ?? []
  const expenseData = summary?.expense_breakdown ?? []
  const stats = {
    monthly_revenue: summary?.monthly_revenue ?? summary?.latest_revenue ?? 0,
    monthly_expenses: summary?.monthly_expenses ?? summary?.latest_expenses ?? 0,
    net_profit: summary?.net_profit ?? 0,
    runway_months: summary?.runway_months ?? summary?.runway ?? null,
  }

  if (summaryLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-gold-500" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Financial Data</h1>
          <p className="text-slate-400 text-sm mt-1">Upload and analyse your startup's financial performance</p>
        </div>
        {summary && (
          <GoldButton variant="secondary" size="sm" loading={regenerating} icon={<RefreshCw size={14} />} onClick={handleRegenerate}>
            Regenerate Analysis
          </GoldButton>
        )}
      </div>

      {/* Upload Zone */}
      {!summary ? (
        <>
          {uploadError && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              <AlertCircle size={14} /> {uploadError}
            </div>
          )}
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv,.pdf" className="hidden"
            onChange={(e) => handleFile(e.target.files[0])} />
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-16 text-center transition-all duration-200 cursor-pointer mb-6 ${dragging ? 'border-gold-500 bg-gold-500/5' : 'border-navy-700 hover:border-gold-500/50 bg-navy-800'}`}>
            {uploading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 size={48} className="text-gold-500 animate-spin" />
                <p className="text-white font-semibold">Uploading & analysing...</p>
              </div>
            ) : (
              <>
                <FileSpreadsheet size={48} className="text-slate-600 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Upload Financial Data</h3>
                <p className="text-slate-400 text-sm mb-4">Drag & drop your Excel or CSV file, or click to browse</p>
                <p className="text-slate-600 text-xs">Supported: .xlsx, .csv, .pdf — Max 10MB</p>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Upload Success Banner */}
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mb-6">
            <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-emerald-300 text-sm font-medium">Financial data uploaded and analysed</p>
              <p className="text-emerald-500 text-xs">
                {summary.updated_at ? `Last updated: ${new Date(summary.updated_at).toLocaleDateString()}` : 'Data available'}
                {summary.period && ` · ${summary.period}`}
              </p>
            </div>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv,.pdf" className="hidden"
              onChange={(e) => handleFile(e.target.files[0])} />
            <button onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-white text-xs transition-colors">
              Replace file
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Monthly Revenue" value={formatCurrency(stats.monthly_revenue)} icon={TrendingUp}
              trend="up" trendValue={summary.revenue_growth ? `+${summary.revenue_growth}% MoM` : undefined} />
            <StatCard label="Monthly Expenses" value={formatCurrency(stats.monthly_expenses)} icon={TrendingDown} />
            <StatCard label="Net Profit" value={formatCurrency(stats.net_profit)} icon={TrendingUp} />
            <StatCard label="Runway" value={stats.runway_months ? `${stats.runway_months} months` : '—'} icon={TrendingUp} />
          </div>

          {/* Charts */}
          {revenueData.length > 0 && (
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-navy-800 rounded-xl border border-navy-700 p-5">
                <h3 className="font-semibold text-white mb-4">Revenue vs Expenses Trend</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2F4D" />
                    <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false}
                      tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2.5} dot={{ fill: '#C9A84C', r: 4 }} name="Revenue" />
                    {revenueData[0]?.expenses !== undefined && (
                      <Line type="monotone" dataKey="expenses" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 3 }} strokeDasharray="4 4" name="Expenses" />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {expenseData.length > 0 && (
                <div className="bg-navy-800 rounded-xl border border-navy-700 p-5">
                  <h3 className="font-semibold text-white mb-4">Expense Breakdown</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={expenseData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                        {expenseData.map((_, i) => <Cell key={i} fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#152035', border: '1px solid #1E2F4D', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {expenseData.map(({ name, value }, i) => (
                      <div key={name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: EXPENSE_COLORS[i % EXPENSE_COLORS.length] }} />
                          <span className="text-slate-400">{name}</span>
                        </div>
                        <span className="font-mono text-white">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Monthly Profit Bar Chart */}
          {revenueData.some((d) => d.expenses !== undefined) && (
            <div className="bg-navy-800 rounded-xl border border-navy-700 p-5">
              <h3 className="font-semibold text-white mb-4">Monthly Net Profit</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={revenueData.map((d) => ({ ...d, profit: (d.revenue ?? 0) - (d.expenses ?? 0) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2F4D" />
                  <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="profit" fill="#C9A84C" radius={[4, 4, 0, 0]} name="Net Profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  )
}
