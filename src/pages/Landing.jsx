import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  Play, ChevronDown, Rocket, Users, BarChart3, Zap,
  Shield, TrendingUp, Globe, Star, Check, ArrowRight, FileText, DollarSign, Activity
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import CountUp from 'react-countup'
import GoldButton from '../components/common/GoldButton'
import StartupCard from '../components/common/StartupCard'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const SAMPLE_STARTUPS = [
  { id: 1, name: 'AgriTech Nigeria', industry: 'Agriculture', stage: 'GROWTH', health_score: 87, monthly_revenue: 4500000, team_size: 12, founded_year: 2021, is_verified: true },
  { id: 2, name: 'PayStack Clone', industry: 'Fintech', stage: 'SCALE', health_score: 94, monthly_revenue: 18000000, team_size: 45, founded_year: 2020, is_verified: true },
  { id: 3, name: 'HealthBridge', industry: 'HealthTech', stage: 'TRACTION', health_score: 72, monthly_revenue: 1200000, team_size: 8, founded_year: 2022, is_verified: false },
  { id: 4, name: 'EduReach Africa', industry: 'EdTech', stage: 'MVP', health_score: 61, monthly_revenue: 350000, team_size: 5, founded_year: 2023, is_verified: true },
  { id: 5, name: 'LogiFlow', industry: 'Logistics', stage: 'GROWTH', health_score: 79, monthly_revenue: 6800000, team_size: 22, founded_year: 2021, is_verified: true },
  { id: 6, name: 'SolarGrid', industry: 'CleanTech', stage: 'TRACTION', health_score: 68, monthly_revenue: 900000, team_size: 9, founded_year: 2022, is_verified: false },
]

const STATS = [
  { value: 2.4, suffix: 'B+', prefix: '₦', label: 'Funding Connected' },
  { value: 1200, suffix: '+', prefix: '', label: 'Startups Verified' },
  { value: 94, suffix: '%', prefix: '', label: 'Pitch Success Rate' },
  { value: 48, suffix: 'hrs', prefix: '', label: 'Avg. Time to Pitch Ready' },
]

const STEPS = [
  { icon: Users, title: 'Build Profile', desc: 'Create your verified startup identity with business details, team, and metrics.' },
  { icon: Users, title: 'Add Your Team', desc: 'Showcase the people behind your startup with roles, bios, and LinkedIn profiles.' },
  { icon: BarChart3, title: 'Upload Financials', desc: 'Upload your financial data for AI-powered analysis and health scoring.' },
  { icon: Rocket, title: 'Generate Pitch & Get Funded', desc: 'AI crafts your investor pitch. Apply to funding providers in one click.' },
]

const FEATURES = [
  {
    icon: Zap,
    title: 'AI-Powered Pitch Generation',
    desc: 'Our AI reads your profile, financials, and team data to craft a compelling, investor-ready pitch deck in under 60 seconds.',
    bullets: ['Full pitch deck, elevator pitch, or executive summary', 'Tailored to your industry and stage', 'Edit any section with one click'],
    mockupKey: 'pitch',
  },
  {
    icon: Shield,
    title: 'Verified Financial Intelligence',
    desc: 'Upload your financial data and get an instant health score, trend analysis, and actionable insights that investors trust.',
    bullets: ['Revenue trend analysis', 'Burn rate and runway calculation', 'Benchmarked against industry peers'],
    mockupKey: 'financial',
  },
  {
    icon: Globe,
    title: 'Funding Marketplace Access',
    desc: 'Browse 200+ vetted funding providers — loans, grants, and equity investors — all filtered for African startups.',
    bullets: ['Loans, grants, and equity options', 'One-click application with auto-attached profile', 'Real-time application status tracking'],
    mockupKey: 'funding',
  },
]

const TESTIMONIALS = [
  { quote: 'Veristart helped us raise ₦50M in Series A. The pitch deck it generated was better than what our consultant produced.', name: 'Adaeze Okonkwo', company: 'HealthBridge Nigeria', rating: 5 },
  { quote: 'As an investor, I use Veristart daily to discover verified startups. The financial data quality is unmatched.', name: 'Emeka Eze', company: 'Lagos Ventures', rating: 5 },
  { quote: 'We went from zero to pitch-ready in 2 days. The platform understood our business better than we expected.', name: 'Fatima Al-Hassan', company: 'AgriConnect', rating: 5 },
]

const REVENUE_DATA = [
  { month: 'Jul', revenue: 1.2 }, { month: 'Aug', revenue: 1.8 },
  { month: 'Sep', revenue: 2.4 }, { month: 'Oct', revenue: 3.1 },
  { month: 'Nov', revenue: 3.8 }, { month: 'Dec', revenue: 4.5 },
]

const RUNWAY_DATA = [
  { month: 'Jan', burn: 1.8 }, { month: 'Feb', burn: 1.6 },
  { month: 'Mar', burn: 2.1 }, { month: 'Apr', burn: 1.9 },
  { month: 'May', burn: 1.7 }, { month: 'Jun', burn: 2.0 },
]

function PitchMockup() {
  const sections = ['Problem', 'Solution', 'Market', 'Traction', 'Team', 'Ask']
  const [active, setActive] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % sections.length), 1800)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="bg-navy-900 rounded-xl p-5 border border-navy-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-gold-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        <span className="text-slate-500 text-xs ml-1 font-mono">pitch_deck.ai</span>
      </div>
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {sections.map((s, i) => (
          <span key={s} className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-300 ${
            i === active ? 'bg-gold-500 text-navy-950' : 'bg-navy-800 text-slate-500'
          }`}>{s}</span>
        ))}
      </div>
      <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="space-y-2">
        <div className="h-3 bg-navy-700 rounded-full w-3/4" />
        <div className="h-3 bg-navy-700 rounded-full w-full" />
        <div className="h-3 bg-navy-700 rounded-full w-5/6" />
        <div className="h-3 bg-navy-700 rounded-full w-2/3" />
      </motion.div>
      <div className="mt-4 flex items-center gap-2 p-3 bg-gold-500/10 border border-gold-500/20 rounded-lg">
        <Zap size={14} className="text-gold-500" />
        <span className="text-gold-400 text-xs font-medium">AI generating {sections[active]} section...</span>
      </div>
      <div className="mt-3 flex gap-2">
        {['Download PDF', 'Share Link'].map(label => (
          <div key={label} className="flex-1 py-2 bg-navy-800 rounded-lg text-center text-xs text-slate-400 border border-navy-700">{label}</div>
        ))}
      </div>
    </div>
  )
}

function FinancialMockup() {
  return (
    <div className="bg-navy-900 rounded-xl p-5 border border-navy-700">
      <div className="flex items-center justify-between mb-4">
        <span className="text-white text-sm font-semibold">Financial Health</span>
        <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-medium">Verified ✓</span>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="-rotate-90" width="64" height="64">
            <circle cx="32" cy="32" r="26" fill="none" stroke="#1E2F4D" strokeWidth="6" />
            <motion.circle cx="32" cy="32" r="26" fill="none" stroke="#C9A84C" strokeWidth="6"
              strokeDasharray={163} initial={{ strokeDashoffset: 163 }} animate={{ strokeDashoffset: 163 * 0.13 }}
              transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs font-bold text-gold-400">87</span>
          </div>
        </div>
        <div className="flex-1">
          {[['Revenue', '₦4.5M/mo', '+28%', 'text-emerald-400'], ['Burn Rate', '₦2.1M/mo', '-5%', 'text-emerald-400'], ['Runway', '14 months', '+2mo', 'text-emerald-400']].map(([l, v, t, c]) => (
            <div key={l} className="flex items-center justify-between py-1">
              <span className="text-slate-500 text-xs">{l}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-white">{v}</span>
                <span className={`text-xs ${c}`}>{t}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={REVENUE_DATA}>
          <Line type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[['Trend', '↑ Strong'], ['Peers', 'Top 20%'], ['Score', '87/100']].map(([l, v]) => (
          <div key={l} className="bg-navy-800 rounded-lg p-2 text-center">
            <p className="text-slate-500 text-xs">{l}</p>
            <p className="text-gold-400 text-xs font-medium mt-0.5">{v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function FundingMockup() {
  const providers = [
    { name: 'Lagos Angel Network', type: 'INVESTMENT', amount: '₦5M–₦50M', color: 'text-purple-400 bg-purple-900/40' },
    { name: 'BOI SME Loan', type: 'LOAN', amount: '₦1M–₦100M', color: 'text-blue-400 bg-blue-900/40' },
    { name: 'TEF Grant', type: 'GRANT', amount: '₦2.5M', color: 'text-emerald-400 bg-emerald-900/40' },
  ]
  const [applied, setApplied] = useState(null)
  return (
    <div className="bg-navy-900 rounded-xl p-5 border border-navy-700">
      <div className="flex items-center justify-between mb-4">
        <span className="text-white text-sm font-semibold">Funding Marketplace</span>
        <span className="font-mono text-gold-400 text-xs">200+ providers</span>
      </div>
      <div className="space-y-2.5">
        {providers.map((p) => (
          <motion.div key={p.name} layout
            className="flex items-center justify-between p-3 bg-navy-800 rounded-lg border border-navy-700 hover:border-gold-500/30 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center">
                <DollarSign size={14} className="text-gold-500" />
              </div>
              <div>
                <p className="text-white text-xs font-medium">{p.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${p.color}`}>{p.type}</span>
                  <span className="font-mono text-xs text-slate-400">{p.amount}</span>
                </div>
              </div>
            </div>
            {applied === p.name ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1"><Check size={11} /> Applied</span>
            ) : (
              <button onClick={() => setApplied(p.name)}
                className="text-xs px-2.5 py-1 bg-gold-500/10 text-gold-400 border border-gold-500/30 rounded-lg hover:bg-gold-500/20 transition-all">
                Apply
              </button>
            )}
          </motion.div>
        ))}
      </div>
      <div className="mt-3 p-2.5 bg-navy-800 rounded-lg flex items-center gap-2">
        <Activity size={13} className="text-gold-500" />
        <span className="text-slate-400 text-xs">3 applications tracked in real-time</span>
      </div>
    </div>
  )
}

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}

function StatCounter({ value, suffix, prefix, label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="text-center px-8 py-6">
      <div className="font-mono text-3xl md:text-4xl font-bold text-gold-400 mb-1">
        {inView ? (
          <CountUp start={0} end={value} duration={2.5} decimals={value % 1 !== 0 ? 1 : 0} prefix={prefix} suffix={suffix} />
        ) : `${prefix}0${suffix}`}
      </div>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-950/50 to-navy-950" />

        <div className="container-max px-4 md:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-sm font-medium mb-6">
                  🌍 Built for African Startups
                </span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Your <span className="gold-text">Startup's</span><br />
                Verified <span className="gold-text">Financial</span><br />
                Identity
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
                Build a verified startup profile, generate AI-powered investor pitches, and connect with funding partners — all in one place.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-10">
                <GoldButton size="lg" onClick={() => navigate('/signup')} icon={<ArrowRight size={18} />}>
                  Build Your Profile
                </GoldButton>
                <GoldButton variant="ghost" size="lg" icon={<Play size={16} className="fill-current" />}>
                  Watch How It Works
                </GoldButton>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['A', 'B', 'C', 'D', 'E'].map((l, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 border-2 border-navy-950 flex items-center justify-center text-navy-950 text-xs font-bold">
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-gold-500 text-gold-500" />)}
                  </div>
                  <p className="text-slate-400 text-xs">Trusted by 500+ African startups</p>
                </div>
              </motion.div>
            </div>

            {/* Hero mockup */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gold-500/20 rounded-2xl blur-3xl scale-90" />
              <div className="relative bg-navy-800 rounded-2xl border border-navy-700 p-6 shadow-navy-lg animate-float">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-gold-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-500 text-xs ml-2">Veristart Dashboard</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-navy-900 rounded-lg">
                    <div>
                      <p className="text-xs text-slate-400">Health Score</p>
                      <p className="font-mono text-xl font-bold text-gold-400">87/100</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-gold-500 flex items-center justify-center">
                      <TrendingUp size={16} className="text-gold-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[['Revenue', '₦4.5M/mo'], ['Investors', '12 views']].map(([l, v]) => (
                      <div key={l} className="p-3 bg-navy-900 rounded-lg">
                        <p className="text-xs text-slate-400">{l}</p>
                        <p className="font-mono text-sm font-semibold text-white mt-0.5">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2">
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-emerald-400 text-xs font-medium">Pitch generated — ready to share</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold-500 animate-bounce">
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* STATS BAR */}
      <section className="bg-navy-900 border-y border-navy-800">
        <div className="container-max px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-navy-800">
            {STATS.map((s) => <StatCounter key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section-padding">
        <div className="container-max">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="text-gold-500 font-medium mb-2">Simple. Verified. Powerful.</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">From Profile to Funded in 4 Steps</h2>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-gold-500/30" />
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 card-hover text-center relative">
                  <div className="w-10 h-10 rounded-full bg-gold-500 text-navy-950 font-bold text-sm flex items-center justify-center mx-auto mb-4">
                    {i + 1}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-gold-500" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section-padding bg-navy-900/50">
        <div className="container-max">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="text-gold-500 font-medium mb-2">Everything you need</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Built for the African Startup Journey</h2>
            </div>
          </FadeUp>

          <div className="space-y-24">
            {FEATURES.map(({ icon: Icon, title, desc, bullets, mockupKey }, i) => (
              <FadeUp key={i}>
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                  <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-4">
                      <Icon size={24} className="text-gold-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">{desc}</p>
                    <ul className="space-y-3 mb-6">
                      {bullets.map((b) => (
                        <li key={b} className="flex items-center gap-3 text-slate-300 text-sm">
                          <Check size={16} className="text-gold-500 flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <a href="#" className="text-gold-400 text-sm font-medium hover:text-gold-300 transition-colors inline-flex items-center gap-1">
                      Learn more <ArrowRight size={14} />
                    </a>
                  </div>
                  <div className={`bg-navy-800 rounded-2xl p-6 border border-navy-700 shadow-navy-lg ${i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    {mockupKey === 'pitch' && <PitchMockup />}
                    {mockupKey === 'financial' && <FinancialMockup />}
                    {mockupKey === 'funding' && <FundingMockup />}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* STARTUP SHOWCASE */}
      <section className="section-padding">
        <div className="container-max">
          <FadeUp>
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-gold-500 font-medium mb-1">Success Stories</p>
                <h2 className="text-3xl font-bold text-white">Startups Growing with Veristart</h2>
              </div>
              <a href="#" className="text-gold-400 text-sm font-medium hover:text-gold-300 transition-colors hidden md:flex items-center gap-1">
                View All Startups <ArrowRight size={14} />
              </a>
            </div>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_STARTUPS.map((s, i) => (
              <FadeUp key={s.id} delay={i * 0.05}>
                <StartupCard startup={s} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-padding bg-navy-900">
        <div className="container-max">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="text-gold-500 font-medium mb-2">What founders say</p>
              <h2 className="text-3xl font-bold text-white">Trusted Across Africa</h2>
            </div>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ quote, name, company, rating }, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 card-hover relative">
                  <div className="text-6xl text-gold-500/10 font-serif absolute top-4 right-6 leading-none">"</div>
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(rating)].map((_, j) => <Star key={j} size={14} className="fill-gold-500 text-gold-500" />)}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">"{quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-navy-950 font-bold text-sm">
                      {name[0]}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{name}</p>
                      <p className="text-gold-500 text-xs">{company}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="section-padding">
        <div className="container-max">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="text-gold-500 font-medium mb-2">Transparent pricing</p>
              <h2 className="text-3xl font-bold text-white">Start Free, Scale as You Grow</h2>
            </div>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Free', price: '₦0', period: '/month', features: ['1 startup profile', 'Basic pitch generation', 'Browse funding marketplace'], popular: false },
              { name: 'Growth', price: '₦15,000', period: '/month', features: ['Unlimited pitches', 'AI financial analysis', 'Priority funding matching', 'Verified badge'], popular: true },
              { name: 'Scale', price: '₦35,000', period: '/month', features: ['Everything in Growth', 'Custom pitch templates', 'Dedicated support', 'API access'], popular: false },
            ].map(({ name, price, period, features, popular }) => (
              <FadeUp key={name}>
                <div className={`rounded-xl p-6 border relative ${popular ? 'bg-navy-800 border-gold-500/50 shadow-gold-sm' : 'bg-navy-800 border-navy-700'}`}>
                  {popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold-gradient text-navy-950 text-xs font-bold rounded-full">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-bold text-white mb-1">{name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="font-mono text-2xl font-bold text-gold-400">{price}</span>
                    <span className="text-slate-400 text-sm">{period}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-slate-300 text-sm">
                        <Check size={14} className="text-gold-500" /> {f}
                      </li>
                    ))}
                  </ul>
                  <GoldButton variant={popular ? 'primary' : 'secondary'} className="w-full" onClick={() => {}}>
                    {name === 'Free' ? 'Get Started Free' : `Start ${name}`}
                  </GoldButton>
                </div>
              </FadeUp>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/pricing" className="text-gold-400 text-sm font-medium hover:text-gold-300 transition-colors inline-flex items-center gap-1">
              See Full Pricing <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-4 bg-gold-gradient relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-10" />
        <div className="container-max text-center relative z-10">
          <FadeUp>
            <h2 className="text-4xl md:text-5xl font-bold text-navy-950 mb-4">Your Startup Deserves to Be Seen</h2>
            <p className="text-navy-800 text-lg mb-8">Join 1,200+ African founders already on Veristart</p>
            <GoldButton variant="ghost" size="xl"
              className="bg-navy-950 text-white hover:bg-navy-900 border-0"
              onClick={() => navigate('/signup')}>
              Start Building Free →
            </GoldButton>
            <p className="text-navy-700 text-sm mt-4">No credit card required</p>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  )
}
