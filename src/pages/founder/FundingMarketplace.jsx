import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, X, Check, Sparkles, Filter, Loader2, AlertCircle } from 'lucide-react'
import GoldButton from '../../components/common/GoldButton'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import { listProviders, applyForFunding, getApplications } from '../../api/funding'
import { useToast } from '../../context/ToastContext'

const TYPE_COLORS = {
  LOAN: 'bg-blue-900/50 text-blue-300 border-blue-700/50',
  INVESTMENT: 'bg-purple-900/50 text-purple-300 border-purple-700/50',
  GRANT: 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50',
}

const STATUS_STYLES = {
  APPROVED: 'bg-emerald-900/50 text-emerald-400',
  REVIEWING: 'bg-blue-900/50 text-blue-300',
  PENDING: 'bg-slate-700/50 text-slate-300',
  REJECTED: 'bg-red-900/50 text-red-400',
}

function ProviderCard({ provider, onApply, onToggleSave }) {
  const { name, type, description, min_amount, max_amount, interest_rate, requirements, logo, saved } = provider
  return (
    <div className="bg-navy-800 rounded-xl border border-navy-700 p-5 card-hover flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 font-bold text-xs">
            {logo || name?.slice(0, 3).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${TYPE_COLORS[type] || TYPE_COLORS.INVESTMENT}`}>{type}</span>
          </div>
        </div>
        <button onClick={() => onToggleSave(provider.id)}
          className={`p-1.5 rounded-lg transition-all ${saved ? 'text-gold-500 bg-gold-500/10' : 'text-slate-500 hover:text-gold-400 hover:bg-navy-700'}`}>
          <Heart size={15} className={saved ? 'fill-current' : ''} />
        </button>
      </div>

      <p className="text-slate-400 text-xs leading-relaxed mb-3 flex-1">{description}</p>

      <div className="mb-3">
        <p className="text-slate-500 text-xs mb-1">Funding Range</p>
        <p className="font-mono text-gold-400 font-semibold text-sm">{formatCurrency(min_amount)} — {formatCurrency(max_amount)}</p>
        {interest_rate && <p className="text-slate-500 text-xs mt-0.5">Interest: {interest_rate}</p>}
      </div>

      {requirements?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {requirements.map((r) => (
            <span key={r} className="text-xs px-2 py-0.5 bg-navy-700 text-slate-400 rounded-full">{r}</span>
          ))}
        </div>
      )}

      <GoldButton size="sm" className="w-full" onClick={() => onApply(provider)}>
        Apply Now →
      </GoldButton>
    </div>
  )
}

function ApplicationModal({ provider, onClose, onSuccess }) {
  const { toast } = useToast()
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    const parsed = parseFloat(amount)
    if (!parsed || parsed < (provider.min_amount ?? 0)) {
      setError(`Minimum amount is ${formatCurrency(provider.min_amount ?? 0)}`)
      return
    }
    if (provider.max_amount && parsed > provider.max_amount) {
      setError(`Maximum amount is ${formatCurrency(provider.max_amount)}`)
      return
    }
    setError('')
    setLoading(true)
    try {
      await applyForFunding(provider.id, { amount_requested: parsed, notes })
      setSubmitted(true)
      toast({ type: 'success', message: `Application submitted to ${provider.name}.` })
      onSuccess?.()
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || 'Failed to submit application.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-navy-800 rounded-2xl border border-navy-700 z-50 overflow-hidden shadow-navy-lg">
        {!submitted ? (
          <>
            <div className="flex items-center justify-between p-5 border-b border-navy-700">
              <div>
                <h2 className="font-semibold text-white">Apply for Funding</h2>
                <p className="text-slate-400 text-xs mt-0.5">{provider.name}</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>

            <div className="p-5 space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-navy-900 rounded-lg">
                <span className="text-slate-400 text-sm">Available Range</span>
                <span className="font-mono text-gold-400 font-semibold text-sm">
                  {formatCurrency(provider.min_amount)} — {formatCurrency(provider.max_amount)}
                </span>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">Amount Requested (₦) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">₦</span>
                  <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number"
                    min={provider.min_amount} max={provider.max_amount}
                    placeholder={String(provider.min_amount ?? 0)}
                    className="w-full bg-navy-900 border border-navy-700 rounded-lg pl-8 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">Why are you a good fit?</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                  placeholder="Describe why your startup is a strong candidate for this funding..."
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none" />
              </div>

              <div className="p-3 bg-navy-900 rounded-lg">
                <p className="text-slate-400 text-xs font-medium mb-2">Auto-attached documents:</p>
                {['Startup Profile', 'Latest Pitch Deck', 'Financial Summary'].map((doc) => (
                  <div key={doc} className="flex items-center gap-2 text-xs text-slate-300 py-1">
                    <Check size={12} className="text-emerald-400" /> {doc}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 border-t border-navy-700 flex gap-3">
              <GoldButton variant="secondary" className="flex-1" onClick={onClose}>Cancel</GoldButton>
              <GoldButton className="flex-1" loading={loading} disabled={!amount} onClick={handleSubmit}>
                Submit Application
              </GoldButton>
            </div>
          </>
        ) : (
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Application Submitted!</h2>
            <p className="text-slate-400 text-sm mb-6">
              Your application to <span className="text-gold-400">{provider.name}</span> has been submitted. You'll receive updates via email.
            </p>
            <GoldButton onClick={onClose} className="w-full">Done</GoldButton>
          </div>
        )}
      </motion.div>
    </>
  )
}

export default function FundingMarketplace() {
  const { toast } = useToast()
  const [providers, setProviders] = useState([])
  const [applications, setApplications] = useState([])
  const [providersLoading, setProvidersLoading] = useState(true)
  const [appsLoading, setAppsLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [applying, setApplying] = useState(null)
  const [tab, setTab] = useState('browse')

  const fetchProviders = useCallback(async () => {
    setProvidersLoading(true)
    try {
      const { data } = await listProviders()
      const list = Array.isArray(data) ? data : (data?.results ?? [])
      setProviders(list.map((p) => ({ ...p, saved: false })))
    } catch {
      toast({ type: 'error', message: 'Could not load funding providers.' })
    } finally {
      setProvidersLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchApplications = useCallback(async () => {
    setAppsLoading(true)
    try {
      const { data } = await getApplications()
      const list = Array.isArray(data) ? data : (data?.results ?? [])
      setApplications(list)
    } catch {
      toast({ type: 'error', message: 'Could not load applications.' })
    } finally {
      setAppsLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchProviders(); fetchApplications() }, [fetchProviders, fetchApplications])

  const toggleSave = (id) => setProviders((prev) => prev.map((p) => p.id === id ? { ...p, saved: !p.saved } : p))

  const filtered = providers.filter((p) => {
    const matchType = filter === 'ALL' || p.type === filter
    const matchSearch = (p.name ?? '').toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Funding Marketplace</h1>
        <p className="text-slate-400 text-sm mt-1">Browse vetted funding providers across Africa</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          [providersLoading ? '—' : `${providers.length}+`, 'Funding Providers'],
          ['₦500B+', 'Available Capital'],
          [String(providers.filter((p) => p.saved).length), 'Saved Providers'],
        ].map(([v, l]) => (
          <div key={l} className="bg-navy-800 rounded-xl border border-navy-700 p-4 text-center">
            <p className="font-mono text-xl font-bold text-gold-400">{v}</p>
            <p className="text-slate-400 text-xs mt-0.5">{l}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-navy-800 rounded-xl border border-navy-700 mb-6 w-fit">
        {[['browse', 'Browse Providers'], ['applications', 'My Applications']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-gold-500/10 text-gold-400' : 'text-slate-400 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'browse' && (
        <>
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search providers..."
                className="w-full bg-navy-800 border border-navy-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <div className="flex gap-2">
              {['ALL', 'LOAN', 'INVESTMENT', 'GRANT'].map((t) => (
                <button key={t} onClick={() => setFilter(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === t ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30' : 'bg-navy-800 border border-navy-700 text-slate-400 hover:text-white'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {providersLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-navy-800 rounded-xl border border-navy-700 p-5 animate-pulse h-56" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-navy-800 rounded-xl border border-navy-700">
              <Filter size={40} className="text-slate-600 mx-auto mb-3" />
              <p className="text-white font-medium mb-1">No providers found</p>
              <p className="text-slate-400 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <ProviderCard key={p.id} provider={p} onApply={setApplying} onToggleSave={toggleSave} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'applications' && (
        appsLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 size={28} className="animate-spin text-gold-500" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-navy-800 rounded-xl border border-navy-700">
            <p className="text-white font-medium mb-1">No applications yet</p>
            <p className="text-slate-400 text-sm">Apply to a funding provider to see your applications here</p>
          </div>
        ) : (
          <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-700">
                  {['Provider', 'Amount', 'Status', 'Date Applied'].map((h) => (
                    <th key={h} className="text-left text-xs text-slate-500 font-medium px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a.id} className="border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors">
                    <td className="px-5 py-3.5 text-white text-sm font-medium">{a.provider_name ?? a.provider ?? '—'}</td>
                    <td className="px-5 py-3.5 font-mono text-sm text-gold-400">{formatCurrency(a.amount_requested ?? a.amount ?? 0)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[a.status] ?? STATUS_STYLES.PENDING}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{a.applied_at ? formatDate(a.applied_at) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      <AnimatePresence>
        {applying && (
          <ApplicationModal
            provider={applying}
            onClose={() => setApplying(null)}
            onSuccess={fetchApplications}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
