import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, FileText, Mic, AlignLeft, Download, RefreshCw, Share2, Copy, Edit2, Sparkles, Clock } from 'lucide-react'
import GoldButton from '../../components/common/GoldButton'

const PITCH_TYPES = [
  { id: 'full', icon: FileText, label: 'Full Pitch Deck', desc: 'Complete investor presentation', popular: true, time: '~45 seconds' },
  { id: 'elevator', icon: Mic, label: 'Elevator Pitch', desc: '60-second spoken script', popular: false, time: '~20 seconds' },
  { id: 'executive', icon: AlignLeft, label: 'Executive Summary', desc: '1-page PDF overview', popular: false, time: '~30 seconds' },
]

const REQUIREMENTS = [
  { label: 'Business Profile Complete', met: true },
  { label: 'Team Members Added', met: true },
  { label: 'Financial Data Uploaded', met: false },
]

const GENERATION_STAGES = [
  'Reading your profile...',
  'Analysing financials...',
  'Building team narrative...',
  'Crafting your story...',
  'Finalising pitch...',
]

const QUOTES = [
  '"The secret of getting ahead is getting started." — Mark Twain',
  '"African entrepreneurs are solving African problems." — Tony Elumelu',
  '"Your startup story is your most powerful asset."',
  '"Investors don\'t fund ideas. They fund people with conviction."',
]

const PITCH_SECTIONS = {
  Problem: 'African SMEs lose ₦2.3 trillion annually due to lack of access to verified financial data and investor-ready documentation. 78% of fundable startups fail to raise capital not because of poor business models, but because they cannot communicate their value effectively.',
  Solution: 'Veristart provides a comprehensive platform that helps African startups build verified financial profiles, generate AI-powered pitch documents, and connect directly with funding providers — reducing the time from "ready to pitch" to "funded" from months to days.',
  Market: 'The African startup ecosystem represents a $150B+ opportunity. With 54 countries, 1.4B people, and a rapidly growing middle class, the demand for startup financing solutions is accelerating at 34% CAGR.',
  'Business Model': 'SaaS subscription model with three tiers: Free (₦0/mo), Growth (₦15,000/mo), and Scale (₦35,000/mo). Additional revenue from transaction fees on successful funding matches (2.5% of funded amount).',
  Traction: '1,200+ verified startups on platform. ₦2.4B+ in funding connected. 94% pitch success rate. Growing at 28% month-over-month. Partnerships with 15 major African funding institutions.',
  Financials: 'Monthly Revenue: ₦4.5M (+28% MoM). Monthly Expenses: ₦2.1M. Net Profit: ₦2.4M. Runway: 14 months. Seeking ₦50M Series A to expand to 5 new African markets.',
  Team: 'Segun Oloyede (CEO) — 8 years fintech experience, ex-Flutterwave. Amaka Obi (CTO) — Built products for 500K+ users. Combined team of 12 across engineering, product, and growth.',
  Ask: 'Raising ₦50M Series A at ₦500M valuation. Funds will be deployed: 40% product development, 35% market expansion, 25% team growth. Target close: Q1 2025.',
}

const PREVIOUS_PITCHES = [
  { id: 1, type: 'Full Pitch Deck', date: 'Nov 10, 2024', views: 12 },
  { id: 2, type: 'Executive Summary', date: 'Oct 28, 2024', views: 5 },
]

export default function PitchGenerator() {
  const [state, setState] = useState('pre') // pre | generating | generated
  const [selectedType, setSelectedType] = useState('full')
  const [genStage, setGenStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('Problem')
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [copied, setCopied] = useState(false)

  const canGenerate = REQUIREMENTS.every(r => r.met)

  useEffect(() => {
    if (state !== 'generating') return
    let stage = 0
    let prog = 0
    const interval = setInterval(() => {
      prog += 2
      setProgress(prog)
      if (prog % 20 === 0 && stage < GENERATION_STAGES.length - 1) {
        stage++
        setGenStage(stage)
        setQuoteIdx(q => (q + 1) % QUOTES.length)
      }
      if (prog >= 100) {
        clearInterval(interval)
        setTimeout(() => setState('generated'), 500)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [state])

  const handleCopy = () => {
    navigator.clipboard.writeText(PITCH_SECTIONS[activeSection])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Pitch Generator</h1>
        <p className="text-slate-400 text-sm mt-1">AI-powered investor pitch documents in seconds</p>
      </div>

      <AnimatePresence mode="wait">
        {/* PRE-GENERATION STATE */}
        {state === 'pre' && (
          <motion.div key="pre" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Requirements */}
              <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
                <h2 className="font-semibold text-white mb-4">Requirements Checklist</h2>
                <div className="space-y-3">
                  {REQUIREMENTS.map(({ label, met }) => (
                    <div key={label} className={`flex items-center gap-3 p-3 rounded-lg ${met ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                      {met ? <Check size={16} className="text-emerald-400 flex-shrink-0" /> : <X size={16} className="text-red-400 flex-shrink-0" />}
                      <span className={`text-sm ${met ? 'text-emerald-300' : 'text-red-300'}`}>{label}</span>
                    </div>
                  ))}
                </div>
                {!canGenerate && (
                  <p className="text-slate-500 text-xs mt-4">Complete all requirements to generate your pitch</p>
                )}
              </div>

              {/* Pitch Type Selector */}
              <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
                <h2 className="font-semibold text-white mb-4">Select Pitch Type</h2>
                <div className="space-y-3">
                  {PITCH_TYPES.map(({ id, icon: Icon, label, desc, popular, time }) => (
                    <button key={id} onClick={() => setSelectedType(id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${selectedType === id ? 'border-gold-500 bg-gold-500/10' : 'border-navy-700 hover:border-navy-600'}`}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedType === id ? 'bg-gold-500/20' : 'bg-navy-700'}`}>
                        <Icon size={18} className={selectedType === id ? 'text-gold-500' : 'text-slate-400'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium text-sm ${selectedType === id ? 'text-white' : 'text-slate-300'}`}>{label}</span>
                          {popular && <span className="text-xs px-2 py-0.5 bg-gold-500/20 text-gold-400 rounded-full font-medium">Popular</span>}
                        </div>
                        <p className="text-slate-500 text-xs">{desc}</p>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 text-xs flex-shrink-0">
                        <Clock size={11} /> {time}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <GoldButton size="xl" icon={<Sparkles size={18} />}
                disabled={!canGenerate}
                onClick={() => { setState('generating'); setGenStage(0); setProgress(0) }}>
                Generate My Pitch
              </GoldButton>
              {!canGenerate && <p className="text-slate-500 text-sm mt-3">Complete all requirements above to unlock pitch generation</p>}
            </div>

            {/* Previous Pitches */}
            {PREVIOUS_PITCHES.length > 0 && (
              <div className="mt-10">
                <h2 className="font-semibold text-white mb-4">Previous Pitches</h2>
                <div className="space-y-3">
                  {PREVIOUS_PITCHES.map(({ id, type, date, views }) => (
                    <div key={id} className="flex items-center justify-between p-4 bg-navy-800 rounded-xl border border-navy-700 hover:border-gold-500/20 transition-all">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-gold-500" />
                        <div>
                          <p className="text-white text-sm font-medium">{type}</p>
                          <p className="text-slate-500 text-xs">{date} · {views} investor views</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <GoldButton variant="secondary" size="sm" icon={<Download size={13} />}>Download</GoldButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* GENERATING STATE */}
        {state === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20">
            <div className="relative w-24 h-24 mb-8">
              <svg className="absolute inset-0 -rotate-90" width="96" height="96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="#1E2F4D" strokeWidth="6" />
                <circle cx="48" cy="48" r="40" fill="none" stroke="#C9A84C" strokeWidth="6"
                  strokeDasharray={251} strokeDashoffset={251 - (progress / 100) * 251}
                  strokeLinecap="round" className="transition-all duration-100" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-gold-400 font-bold text-lg">{progress}%</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">{GENERATION_STAGES[genStage]}</h2>
            <p className="text-slate-400 text-sm mb-8">Building your investor pitch...</p>

            <div className="w-full max-w-md bg-navy-800 rounded-full h-2 mb-8">
              <motion.div className="bg-gold-gradient h-2 rounded-full" style={{ width: `${progress}%` }} />
            </div>

            <div className="max-w-sm text-center">
              <AnimatePresence mode="wait">
                <motion.p key={quoteIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="text-slate-400 text-sm italic">
                  {QUOTES[quoteIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* GENERATED STATE */}
        {state === 'generated' && (
          <motion.div key="generated" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Success Banner */}
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8 mb-6">
              <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center mx-auto mb-4">
                <Sparkles size={28} className="text-navy-950" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Your Pitch is Ready! 🎉</h2>
              <p className="text-slate-400 text-sm">AI-generated pitch deck based on your profile and financials</p>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <GoldButton icon={<Download size={15} />}>Download PDF</GoldButton>
              <GoldButton variant="secondary" icon={<RefreshCw size={15} />}>Regenerate Section</GoldButton>
              <GoldButton variant="secondary" icon={<Share2 size={15} />}>Share Link</GoldButton>
              <GoldButton variant="secondary" icon={copied ? <Check size={15} /> : <Copy size={15} />} onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy Text'}
              </GoldButton>
            </div>

            {/* Section Tabs */}
            <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
              <div className="flex overflow-x-auto border-b border-navy-700 scrollbar-hide">
                {Object.keys(PITCH_SECTIONS).map(section => (
                  <button key={section} onClick={() => setActiveSection(section)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${activeSection === section ? 'border-gold-500 text-gold-400 bg-gold-500/5' : 'border-transparent text-slate-400 hover:text-white'}`}>
                    {section}
                  </button>
                ))}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">{activeSection}</h3>
                  <button className="flex items-center gap-1.5 text-slate-400 hover:text-gold-400 text-xs transition-colors">
                    <Edit2 size={13} /> Edit
                  </button>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p key={activeSection} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className="text-slate-300 text-sm leading-relaxed">
                    {PITCH_SECTIONS[activeSection]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button onClick={() => setState('pre')} className="text-slate-400 hover:text-gold-400 text-sm transition-colors">
                ← Generate a new pitch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
