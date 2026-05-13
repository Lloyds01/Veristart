import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, FileText, Mic, AlignLeft, Download, RefreshCw, Share2, Copy, Edit2, Sparkles, Clock, Loader2 } from 'lucide-react'
import GoldButton from '../../components/common/GoldButton'
import { useStartup } from '../../context/StartupContext'
import { generatePitch, listPitches, downloadPitch } from '../../api/pitch'
import { listMembers } from '../../api/team'
import { getSummary } from '../../api/financial'
import { useToast } from '../../context/ToastContext'

const PITCH_TYPES = [
  { id: 'full', icon: FileText, label: 'Full Pitch Deck', desc: 'Complete investor presentation', popular: true, time: '~45 seconds' },
  { id: 'elevator', icon: Mic, label: 'Elevator Pitch', desc: '60-second spoken script', popular: false, time: '~20 seconds' },
  { id: 'executive', icon: AlignLeft, label: 'Executive Summary', desc: '1-page PDF overview', popular: false, time: '~30 seconds' },
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

const SECTION_ORDER = ['Problem', 'Solution', 'Market', 'Business Model', 'Traction', 'Financials', 'Team', 'Ask']

export default function PitchGenerator() {
  const { toast } = useToast()
  const { startup, startupId } = useStartup()

  const [state, setState] = useState('pre') // pre | generating | generated
  const [selectedType, setSelectedType] = useState('full')
  const [genStage, setGenStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [activeSection, setActiveSection] = useState(SECTION_ORDER[0])
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [copied, setCopied] = useState(false)

  const [previousPitches, setPreviousPitches] = useState([])
  const [pitchesLoading, setPitchesLoading] = useState(true)
  const [requirements, setRequirements] = useState([
    { label: 'Business Profile Complete', met: false },
    { label: 'Team Members Added', met: false },
    { label: 'Financial Data Uploaded', met: false },
  ])
  const [currentPitch, setCurrentPitch] = useState(null) // { id, sections: { Problem: '...', ... } }
  const [currentPitchId, setCurrentPitchId] = useState(null)

  // Refs used to coordinate animation with API response
  const apiDoneRef = useRef(false)
  const animDoneRef = useRef(false)
  const pitchDataRef = useRef(null)

  // Check requirements from real data
  const checkRequirements = useCallback(async () => {
    if (!startupId) return
    const [membersRes, financialsRes] = await Promise.allSettled([
      listMembers(),
      getSummary(startupId),
    ])
    const hasProfile = !!(startup?.business_name && startup?.description)
    const hasTeam = membersRes.status === 'fulfilled' &&
      (Array.isArray(membersRes.value.data) ? membersRes.value.data.length > 0 : false)
    const hasFinancials = financialsRes.status === 'fulfilled'
    setRequirements([
      { label: 'Business Profile Complete', met: hasProfile },
      { label: 'Team Members Added', met: hasTeam },
      { label: 'Financial Data Uploaded', met: hasFinancials },
    ])
  }, [startup, startupId])

  const fetchPreviousPitches = useCallback(async () => {
    if (!startupId) return
    setPitchesLoading(true)
    try {
      const { data } = await listPitches(startupId)
      const list = Array.isArray(data) ? data : (data?.results ?? [])
      setPreviousPitches(list)
    } catch {
      // Silently ignore — not critical
    } finally {
      setPitchesLoading(false)
    }
  }, [startupId])

  useEffect(() => {
    checkRequirements()
    fetchPreviousPitches()
  }, [checkRequirements, fetchPreviousPitches])

  const canGenerate = requirements.every((r) => r.met)

  // Animation loop while generating — ticks until both API AND animation are done
  useEffect(() => {
    if (state !== 'generating') return
    apiDoneRef.current = false
    animDoneRef.current = false

    let stage = 0
    let prog = 0

    const interval = setInterval(() => {
      // Slow down progress near 95% until API responds
      const isNearEnd = prog >= 90
      if (isNearEnd && !apiDoneRef.current) return

      prog = Math.min(prog + (isNearEnd ? 0.5 : 2), 100)
      setProgress(Math.round(prog))

      if (prog % 20 === 0 && stage < GENERATION_STAGES.length - 1) {
        stage++
        setGenStage(stage)
        setQuoteIdx((q) => (q + 1) % QUOTES.length)
      }

      if (prog >= 100) {
        clearInterval(interval)
        animDoneRef.current = true
        if (apiDoneRef.current) {
          setCurrentPitch(pitchDataRef.current)
          setTimeout(() => setState('generated'), 400)
        }
      }
    }, 80)

    return () => clearInterval(interval)
  }, [state])

  const handleGenerate = async () => {
    if (!startupId) {
      toast({ type: 'error', message: 'Complete your startup profile first.' })
      return
    }
    setState('generating')
    setGenStage(0)
    setProgress(0)
    apiDoneRef.current = false
    animDoneRef.current = false
    pitchDataRef.current = null

    try {
      const { data } = await generatePitch(startupId, { pitch_type: selectedType })
      setCurrentPitchId(data.id ?? data.pitch_id)

      // Normalise sections — backend may return { sections: {...} } or flat object
      const rawSections = data.sections ?? data.content ?? data
      const sections = {}
      SECTION_ORDER.forEach((key) => {
        const val = rawSections[key] ?? rawSections[key.toLowerCase().replace(' ', '_')]
        if (val) sections[key] = val
      })
      if (Object.keys(sections).length === 0 && typeof rawSections === 'object') {
        Object.assign(sections, rawSections)
      }

      pitchDataRef.current = { id: data.id, sections }
      apiDoneRef.current = true
      setActiveSection(Object.keys(sections)[0] || SECTION_ORDER[0])
      await fetchPreviousPitches()

      if (animDoneRef.current) {
        setCurrentPitch(pitchDataRef.current)
        setState('generated')
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Pitch generation failed. Please try again.'
      toast({ type: 'error', message: msg })
      setState('pre')
    }
  }

  const handleCopy = () => {
    const text = currentPitch?.sections?.[activeSection] ?? ''
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async (pitchId) => {
    if (!startupId) return
    const id = pitchId ?? currentPitchId
    if (!id) { toast({ type: 'error', message: 'No pitch available to download.' }); return }
    try {
      const { data } = await downloadPitch(startupId, id)
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `pitch-${id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast({ type: 'error', message: 'Download failed. The PDF may still be processing.' })
    }
  }

  const sections = currentPitch?.sections ?? {}
  const sectionKeys = Object.keys(sections).length > 0 ? Object.keys(sections) : SECTION_ORDER

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Pitch Generator</h1>
        <p className="text-slate-400 text-sm mt-1">AI-powered investor pitch documents in seconds</p>
      </div>

      <AnimatePresence mode="wait">
        {/* PRE-GENERATION */}
        {state === 'pre' && (
          <motion.div key="pre" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Requirements */}
              <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
                <h2 className="font-semibold text-white mb-4">Requirements Checklist</h2>
                <div className="space-y-3">
                  {requirements.map(({ label, met }) => (
                    <div key={label} className={`flex items-center gap-3 p-3 rounded-lg ${met ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                      {met ? <Check size={16} className="text-emerald-400 flex-shrink-0" /> : <X size={16} className="text-red-400 flex-shrink-0" />}
                      <span className={`text-sm ${met ? 'text-emerald-300' : 'text-red-300'}`}>{label}</span>
                    </div>
                  ))}
                </div>
                {!canGenerate && (
                  <p className="text-slate-500 text-xs mt-4">Complete all requirements to unlock pitch generation</p>
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
              <GoldButton size="xl" icon={<Sparkles size={18} />} disabled={!canGenerate} onClick={handleGenerate}>
                Generate My Pitch
              </GoldButton>
              {!canGenerate && (
                <p className="text-slate-500 text-sm mt-3">Complete all requirements above to unlock pitch generation</p>
              )}
            </div>

            {/* Previous Pitches */}
            {!pitchesLoading && previousPitches.length > 0 && (
              <div className="mt-10">
                <h2 className="font-semibold text-white mb-4">Previous Pitches</h2>
                <div className="space-y-3">
                  {previousPitches.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-navy-800 rounded-xl border border-navy-700 hover:border-gold-500/20 transition-all">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-gold-500" />
                        <div>
                          <p className="text-white text-sm font-medium">{p.pitch_type ?? p.type ?? 'Pitch Deck'}</p>
                          <p className="text-slate-500 text-xs">
                            {p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}
                            {p.view_count != null ? ` · ${p.view_count} investor views` : ''}
                          </p>
                        </div>
                      </div>
                      <GoldButton variant="secondary" size="sm" icon={<Download size={13} />} onClick={() => handleDownload(p.id)}>
                        Download
                      </GoldButton>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pitchesLoading && (
              <div className="mt-10 flex items-center justify-center h-16">
                <Loader2 size={20} className="animate-spin text-gold-500" />
              </div>
            )}
          </motion.div>
        )}

        {/* GENERATING */}
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

        {/* GENERATED */}
        {state === 'generated' && (
          <motion.div key="generated" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8 mb-6">
              <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center mx-auto mb-4">
                <Sparkles size={28} className="text-navy-950" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Your Pitch is Ready!</h2>
              <p className="text-slate-400 text-sm">AI-generated pitch based on your profile and financials</p>
            </motion.div>

            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <GoldButton icon={<Download size={15} />} onClick={() => handleDownload(currentPitchId)}>
                Download PDF
              </GoldButton>
              <GoldButton variant="secondary" icon={<RefreshCw size={15} />} onClick={() => setState('pre')}>
                Generate New
              </GoldButton>
              <GoldButton variant="secondary" icon={<Share2 size={15} />}>Share Link</GoldButton>
              <GoldButton variant="secondary" icon={copied ? <Check size={15} /> : <Copy size={15} />} onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy Section'}
              </GoldButton>
            </div>

            {Object.keys(sections).length > 0 && (
              <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
                <div className="flex overflow-x-auto border-b border-navy-700 scrollbar-hide">
                  {sectionKeys.map((section) => (
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
                      {sections[activeSection] ?? 'No content for this section.'}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            )}

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
