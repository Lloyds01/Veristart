import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, X, Check, ChevronDown, Sparkles, Filter } from 'lucide-react'
import GoldButton from '../../components/common/GoldButton'
import { formatCurrency } from '../../utils/formatCurrency'

const PROVIDERS = [
  { id: 1, name: 'Tony Elumelu Foundation', type: 'GRANT', desc: 'Empowering African entrepreneurs with $5,000 seed capital and mentorship.', min: 2500000, max: 25000000, requirements: ['African founder', 'Early stage', 'Social impact'], logo: 'TEF', saved: false },
  { id: 2, name: 'Lagos Angel Network', type: 'INVESTMENT', desc: 'Nigeria\'s premier angel investor network backing early-stage tech startups.', min: 5000000, max: 50000000, requirements: ['Tech startup', 'MVP ready', 'Lagos-based'], logo: 'LAN', saved: true },
  { id: 3, name: 'Ventures Platform', type: 'INVESTMENT', desc: 'Pan-African VC fund investing in seed and pre-Series A startups.', min: 25000000, max: 250000000, requirements: ['Scalable model', 'Strong team', 'Pan-African'], logo: 'VP', saved: false },
  { id: 4, name: 'BOI SME Loan', type: 'LOAN', desc: 'Bank of Industry low-interest loans for Nigerian SMEs and startups.', min: 1000000, max: 100000000, rate: '9% p.a.', requirements: ['Registered business', 'Collateral', '2yr history'], logo: 'BOI', saved: false },
  { id: 5, name: 'Microtraction', type: 'INVESTMENT', desc: 'Pre-seed fund for African founders building for the next billion users.', min: 3000000, max: 15000000, requirements: ['Pre-seed stage', 'African market', 'Tech-enabled'], logo: 'MT', saved: false },
  { id: 6, name: 'NIRSAL MFB', type: 'LOAN', desc: 'Agricultural and SME financing with government-backed guarantees.', min: 500000, max: 50000000, rate: '5% p.a.', requirements: ['Agri/SME focus', 'BVN verified', 'Business plan'], logo: 'NMF', saved: false },
]

const TYPE_COLORS = {
  LOAN: 'bg-blue-900/50 text-blue-300 border-blue-700/50',
  INVESTMENT: 'bg-purple-900/50 text-purple-300 border-purple-700/50',
  GRANT: 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50',
}

function ProviderCard({ provider, onApply, onToggleSave }) {
  const { name, type, desc, min, max, rate, requirements, logo, saved } = provider
  return (
    <div className="bg-navy-800 rounded-xl border border-navy-700 p-5 card-hover flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 font-bold text-xs">
            {logo}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${TYPE_COLORS[type]}`}>{type}</span>
          </div>
        </div>
        <button onClick={() => onToggleSave(provider.id)}
          className={`p-1.5 rounded-lg transition-all ${saved ? 'text-gold-500 bg-gold-500/10' : 'text-slate-500 hover:text-gold-400 hover:bg-navy-700'}`}>
          <Heart size={15} className={saved ? 'fill-current' : ''} />
        </button>
      </div>

      <p className="text-slate-400 text-xs leading-relaxed mb-3 flex-1">{desc}</p>

      <div className="mb-3">
        <p className="text-slate-500 text-xs mb-1">Funding Range</p>
        <p className="font-mono text-gold-400 font-semibold text-sm">{formatCurrency(min)} — {formatCurrency(max)}</p>
        {rate && <p className="text-slate-500 text-xs mt-0.5">Interest: {rate}</p>}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {requirements.map(r => (
          <span key={r} className="text-xs px-2 py-0.5 bg-navy-700 text-slate-400 rounded-full">{r}</span>
        ))}
      </div>

      <GoldButton size="sm" className="w-full" onClick={() => onApply(provider)}>
        Apply Now →
      </GoldButton>
    </div>
  )
}

function ApplicationModal({ provider, onClose }) {
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSubmitted(true)
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
              {/* Provider Summary */}
              <div className="flex items-center justify-between p-3 bg-navy-900 rounded-lg">
                <span className="text-slate-400 text-sm">Available Range</span>
                <span className="font-mono text-gold-400 font-semibold text-sm">
                  {formatCurrency(provider.min)} — {formatCurrency(provider.max)}
                </span>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">Amount Requested (₦) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">₦</span>
                  <input value={amount} onChange={e => setAmount(e.target.value)} type="number"
                    min={provider.min} max={provider.max} placeholder={`${provider.min.toLocaleString()}`}
                    className="w-full bg-navy-900 border border-navy-700 rounded-lg pl-8 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">Why are you a good fit?</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                  placeholder="Describe why your startup is a strong candidate for this funding..."
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none" />
              </div>

              <div className="p-3 bg-navy-900 rounded-lg">
                <p className="text-slate-400 text-xs font-medium mb-2">Auto-attached documents:</p>
                {['Startup Profile', 'Latest Pitch Deck', 'Financial Summary'].map(doc => (
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
            <h2 className="text-xl font-bold text-white mb-2">Application Submitted! 🎉</h2>
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
  const [providers, setProviders] = useState(PROVIDERS)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [applying, setApplying] = useState(null)
  const [tab, setTab] = useState('browse')

  const filtered = providers.filter(p => {
    const matchType = filter === 'ALL' || p.type === filter
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const toggleSave = (id) => setProviders(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p))

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Funding Marketplace</h1>
        <p className="text-slate-400 text-sm mt-1">Browse 200+ vetted funding providers across Africa</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[['200+', 'Funding Providers'], ['₦500B+', 'Available Capital'], [String(providers.filter(p => p.saved).length), 'Saved Providers']].map(([v, l]) => (
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
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search providers..."
                className="w-full bg-navy-800 border border-navy-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <div className="flex gap-2">
              {['ALL', 'LOAN', 'INVESTMENT', 'GRANT'].map(t => (
                <button key={t} onClick={() => setFilter(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === t ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30' : 'bg-navy-800 border border-navy-700 text-slate-400 hover:text-white'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => (
              <ProviderCard key={p.id} provider={p} onApply={setApplying} onToggleSave={toggleSave} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-navy-800 rounded-xl border border-navy-700">
              <Filter size={40} className="text-slate-600 mx-auto mb-3" />
              <p className="text-white font-medium mb-1">No providers found</p>
              <p className="text-slate-400 text-sm">Try adjusting your filters</p>
            </div>
          )}
        </>
      )}

      {tab === 'applications' && (
        <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-700">
                {['Provider', 'Amount', 'Status', 'Date Applied'].map(h => (
                  <th key={h} className="text-left text-xs text-slate-500 font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { provider: 'Lagos Angel Network', amount: 5000000, status: 'REVIEWING', date: 'Nov 10, 2024' },
                { provider: 'Tony Elumelu Foundation', amount: 10000000, status: 'APPROVED', date: 'Nov 5, 2024' },
              ].map(({ provider, amount, status, date }, i) => (
                <tr key={i} className="border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors">
                  <td className="px-5 py-3.5 text-white text-sm font-medium">{provider}</td>
                  <td className="px-5 py-3.5 font-mono text-sm text-gold-400">{formatCurrency(amount)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status === 'APPROVED' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-blue-900/50 text-blue-300'}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {applying && <ApplicationModal provider={applying} onClose={() => setApplying(null)} />}
      </AnimatePresence>
    </div>
  )
}
