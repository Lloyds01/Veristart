import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Check, Building2, Phone, Globe, ChevronRight, Percent, Clock, Wallet } from 'lucide-react'
import GoldButton from '../../components/common/GoldButton'
import { formatCurrency } from '../../utils/formatCurrency'

const CREDITORS = [
  {
    id: 1,
    name: 'Bank of Industry (BOI)',
    type: 'Government Bank',
    logo: 'BOI',
    description: 'Nigeria\'s foremost development finance institution providing long-term financing for industrial, agricultural and service sector enterprises.',
    min_amount: 500000,
    max_amount: 500000000,
    interest_rate: '9% p.a.',
    tenure: 'Up to 10 years',
    requirements: ['CAC Registration', 'Business Plan', 'Collateral', '2yr financials'],
    phone: '0700-CALL-BOI',
    website: 'https://boi.ng',
    color: 'bg-green-900/30 border-green-700/50',
    badge: 'bg-green-500/20 text-green-400',
  },
  {
    id: 2,
    name: 'NIRSAL Microfinance Bank',
    type: 'Microfinance Bank',
    logo: 'NMF',
    description: 'Provides accessible financial services to MSMEs, farmers and entrepreneurs across Nigeria with government-backed guarantees.',
    min_amount: 100000,
    max_amount: 50000000,
    interest_rate: '5% p.a.',
    tenure: 'Up to 5 years',
    requirements: ['BVN Verified', 'Business Plan', 'Guarantor', 'Bank Statement'],
    phone: '0800-NIRSAL-1',
    website: 'https://nirsal.com',
    color: 'bg-blue-900/30 border-blue-700/50',
    badge: 'bg-blue-500/20 text-blue-400',
  },
  {
    id: 3,
    name: 'Tony Elumelu Foundation',
    type: 'Grant / Seed Capital',
    logo: 'TEF',
    description: 'Empowering African entrepreneurs with $5,000 non-refundable seed capital, mentorship and training through the TEF Entrepreneurship Programme.',
    min_amount: 2500000,
    max_amount: 2500000,
    interest_rate: '0% (Grant)',
    tenure: 'Non-refundable',
    requirements: ['African Founder', 'Early Stage', 'Social Impact', 'Online Application'],
    phone: '+234 1 277 9920',
    website: 'https://tefconnect.com',
    color: 'bg-gold-500/10 border-gold-500/30',
    badge: 'bg-gold-500/20 text-gold-400',
  },
  {
    id: 4,
    name: 'Sterling Bank SME Loan',
    type: 'Commercial Bank',
    logo: 'STB',
    description: 'Sterling Bank\'s dedicated SME lending products designed for growing Nigerian businesses with flexible repayment options.',
    min_amount: 1000000,
    max_amount: 100000000,
    interest_rate: '18% p.a.',
    tenure: 'Up to 3 years',
    requirements: ['Sterling Account', '6mo Bank Statement', 'Business Registration', 'Collateral'],
    phone: '0700-STERLING',
    website: 'https://sterlingbank.com',
    color: 'bg-purple-900/30 border-purple-700/50',
    badge: 'bg-purple-500/20 text-purple-400',
  },
  {
    id: 5,
    name: 'LAPO Microfinance Bank',
    type: 'Microfinance Bank',
    logo: 'LAPO',
    description: 'One of Nigeria\'s largest microfinance banks providing credit, savings and insurance services to low-income entrepreneurs and SMEs.',
    min_amount: 50000,
    max_amount: 5000000,
    interest_rate: '3.5% monthly',
    tenure: 'Up to 12 months',
    requirements: ['Group Guarantee', 'BVN', 'Utility Bill', 'Passport Photo'],
    phone: '0800-LAPO-MFB',
    website: 'https://lapo.com.ng',
    color: 'bg-emerald-900/30 border-emerald-700/50',
    badge: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    id: 6,
    name: 'Carbon (Paylater)',
    type: 'Fintech Lender',
    logo: 'CBN',
    description: 'Digital lending platform offering instant business loans to Nigerian SMEs with no collateral required. Apply and get funded in minutes.',
    min_amount: 100000,
    max_amount: 10000000,
    interest_rate: '4.5% monthly',
    tenure: 'Up to 6 months',
    requirements: ['BVN', 'Bank Statement', 'Business Registration', 'No Collateral'],
    phone: 'App-based',
    website: 'https://getcarbon.co',
    color: 'bg-slate-800/50 border-slate-700/50',
    badge: 'bg-slate-500/20 text-slate-400',
  },
  {
    id: 7,
    name: 'Stanbic IBTC SME Loan',
    type: 'Commercial Bank',
    logo: 'SIB',
    description: 'Stanbic IBTC\'s business lending solutions tailored for SMEs looking to expand operations, purchase equipment or manage cash flow.',
    min_amount: 5000000,
    max_amount: 200000000,
    interest_rate: '20% p.a.',
    tenure: 'Up to 5 years',
    requirements: ['Stanbic Account', '12mo Statement', 'Audited Accounts', 'Collateral'],
    phone: '0700-STANBIC',
    website: 'https://stanbicibtc.com',
    color: 'bg-blue-900/30 border-blue-700/50',
    badge: 'bg-blue-500/20 text-blue-400',
  },
  {
    id: 8,
    name: 'Aella Credit',
    type: 'Fintech Lender',
    logo: 'AEL',
    description: 'Fast, collateral-free business loans for Nigerian entrepreneurs. Powered by AI credit scoring for instant decisions.',
    min_amount: 200000,
    max_amount: 20000000,
    interest_rate: '4% monthly',
    tenure: 'Up to 12 months',
    requirements: ['BVN', 'Bank Statement', 'Business Plan', 'No Collateral'],
    phone: 'App-based',
    website: 'https://aellacredit.com',
    color: 'bg-orange-900/30 border-orange-700/50',
    badge: 'bg-orange-500/20 text-orange-400',
  },
]

function ApplicationModal({ creditor, onClose }) {
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
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-navy-800 rounded-2xl border border-navy-700 z-50 overflow-hidden shadow-navy-lg">
        {!submitted ? (
          <>
            <div className="flex items-center justify-between p-5 border-b border-navy-700">
              <div>
                <h2 className="font-semibold text-white">Apply for Loan</h2>
                <p className="text-slate-400 text-xs mt-0.5">{creditor.name}</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3 bg-navy-900 rounded-lg">
                <span className="text-slate-400 text-sm">Available Range</span>
                <span className="font-mono text-gold-400 font-semibold text-sm">
                  {formatCurrency(creditor.min_amount)} — {formatCurrency(creditor.max_amount)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-navy-900 rounded-lg">
                <span className="text-slate-400 text-sm">Interest Rate</span>
                <span className="font-mono text-white text-sm">{creditor.interest_rate}</span>
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">Amount Requested (₦) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">₦</span>
                  <input value={amount} onChange={e => setAmount(e.target.value)} type="number"
                    placeholder={creditor.min_amount.toString()}
                    className="w-full bg-navy-900 border border-navy-700 rounded-lg pl-8 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">Why do you need this loan?</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                  placeholder="Describe how you'll use the funds..."
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
              <Check size={28} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Application Submitted! 🎉</h2>
            <p className="text-slate-400 text-sm mb-6">
              Your application to <span className="text-gold-400">{creditor.name}</span> has been submitted successfully.
            </p>
            <GoldButton onClick={onClose} className="w-full">Done</GoldButton>
          </div>
        )}
      </motion.div>
    </>
  )
}

export default function Creditors() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [applying, setApplying] = useState(null)

  const types = ['ALL', 'Government Bank', 'Microfinance Bank', 'Commercial Bank', 'Fintech Lender', 'Grant / Seed Capital']

  const filtered = CREDITORS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'ALL' || c.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Creditors & Loan Providers</h1>
        <p className="text-slate-400 text-sm mt-1">Connect with verified loan providers and credit institutions across Nigeria</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: Building2, label: 'Loan Providers', value: CREDITORS.length },
          { icon: Wallet, label: 'Total Available', value: '₦876B+' },
          { icon: Percent, label: 'Lowest Rate', value: '0% (Grants)' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-navy-800 rounded-xl border border-navy-700 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
              <Icon size={18} className="text-gold-500" />
            </div>
            <div>
              <p className="font-mono text-lg font-bold text-gold-400">{value}</p>
              <p className="text-slate-400 text-xs">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search loan providers..."
            className="w-full bg-navy-800 border border-navy-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors" />
        </div>
        <div className="flex flex-wrap gap-2">
          {['ALL', 'Government Bank', 'Microfinance Bank', 'Commercial Bank', 'Fintech Lender', 'Grant / Seed Capital'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${typeFilter === t ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30' : 'bg-navy-800 border border-navy-700 text-slate-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
        {filtered.map((creditor, i) => (
          <motion.div key={creditor.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-xl p-5 border card-hover flex flex-col ${creditor.color}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center text-gold-500 font-bold text-sm flex-shrink-0">
                  {creditor.logo}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{creditor.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${creditor.badge}`}>
                    {creditor.type}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed mb-4 flex-1">{creditor.description}</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-navy-900/60 rounded-lg p-2 text-center">
                <p className="text-slate-500 text-xs mb-0.5">Min</p>
                <p className="font-mono text-xs text-gold-400 font-medium">{formatCurrency(creditor.min_amount)}</p>
              </div>
              <div className="bg-navy-900/60 rounded-lg p-2 text-center">
                <p className="text-slate-500 text-xs mb-0.5">Rate</p>
                <p className="font-mono text-xs text-white font-medium">{creditor.interest_rate}</p>
              </div>
              <div className="bg-navy-900/60 rounded-lg p-2 text-center">
                <p className="text-slate-500 text-xs mb-0.5">Tenure</p>
                <p className="font-mono text-xs text-white font-medium truncate">{creditor.tenure.replace('Up to ', '')}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {creditor.requirements.map(r => (
                <span key={r} className="text-xs px-2 py-0.5 bg-navy-900/60 text-slate-400 rounded-full">{r}</span>
              ))}
            </div>

            <div className="flex gap-2">
              <GoldButton size="sm" className="flex-1" onClick={() => setApplying(creditor)}>
                Apply Now →
              </GoldButton>
              <a href={creditor.website} target="_blank" rel="noreferrer"
                className="flex items-center justify-center px-3 py-2 bg-navy-900/60 border border-navy-700 rounded-lg text-slate-400 hover:text-gold-400 transition-colors">
                <Globe size={14} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-navy-800 rounded-xl border border-navy-700">
          <Building2 size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-white font-medium mb-1">No providers found</p>
          <p className="text-slate-400 text-sm">Try adjusting your filters</p>
        </div>
      )}

      <AnimatePresence>
        {applying && <ApplicationModal creditor={applying} onClose={() => setApplying(null)} />}
      </AnimatePresence>
    </div>
  )
}
