import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ChevronDown, Zap } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import GoldButton from '../components/common/GoldButton'

const PLANS = [
  {
    name: 'Free', price: { monthly: 0, annual: 0 }, cta: 'Get Started Free', variant: 'secondary',
    features: ['1 startup profile', '3 pitch generations/month', 'Basic financial upload', 'Browse funding marketplace', 'Community support'],
  },
  {
    name: 'Growth', price: { monthly: 15000, annual: 12000 }, cta: 'Start Growing', variant: 'primary', popular: true,
    features: ['Unlimited pitch generations', 'AI financial analysis', 'Verified badge', 'Priority funding matching', 'Investor profile views', 'Email support', 'Custom pitch templates'],
  },
  {
    name: 'Scale', price: { monthly: 35000, annual: 28000 }, cta: 'Go to Scale', variant: 'secondary',
    features: ['Everything in Growth', 'White-label pitch docs', 'API access', 'Dedicated account manager', 'Custom integrations', 'Priority support', 'Advanced analytics'],
  },
]

const COMPARISON = [
  { feature: 'Startup Profiles', free: '1', growth: 'Unlimited', scale: 'Unlimited' },
  { feature: 'Pitch Generations', free: '3/month', growth: 'Unlimited', scale: 'Unlimited' },
  { feature: 'AI Financial Analysis', free: false, growth: true, scale: true },
  { feature: 'Verified Badge', free: false, growth: true, scale: true },
  { feature: 'Funding Marketplace', free: true, growth: true, scale: true },
  { feature: 'Investor Profile Views', free: false, growth: true, scale: true },
  { feature: 'Custom Templates', free: false, growth: true, scale: true },
  { feature: 'API Access', free: false, growth: false, scale: true },
  { feature: 'White-label Docs', free: false, growth: false, scale: true },
  { feature: 'Dedicated Support', free: false, growth: false, scale: true },
]

const FAQS = [
  { q: 'Can I upgrade or downgrade my plan at any time?', a: 'Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the end of your billing cycle.' },
  { q: 'Is there a free trial for paid plans?', a: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start.' },
  { q: 'How does the AI pitch generation work?', a: 'Our AI reads your startup profile, team data, and financial information to craft a compelling, investor-ready pitch document tailored to your industry and stage.' },
  { q: 'What currencies do you accept?', a: 'We accept Nigerian Naira (₦), US Dollars ($), and Ghanaian Cedis (₵). Payments are processed securely via Paystack.' },
  { q: 'Can investors access my profile for free?', a: 'Investors have their own pricing tier. Founders control their profile visibility and can choose to make it public or invite-only.' },
  { q: 'What happens to my data if I cancel?', a: 'Your data is retained for 90 days after cancellation. You can export all your data at any time from your account settings.' },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-navy-700 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4">
        <span className="text-white font-medium text-sm">{q}</span>
        <ChevronDown size={18} className={`text-gold-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden">
            <p className="text-slate-400 text-sm leading-relaxed pb-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      <div className="pt-24 pb-20 px-4 md:px-8">
        <div className="container-max">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-gold-500 font-medium mb-2">Transparent pricing</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
            <p className="text-slate-400 max-w-lg mx-auto mb-8">Start free and scale as your startup grows. No hidden fees, no surprises.</p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-3 p-1 bg-navy-800 rounded-xl border border-navy-700">
              <button onClick={() => setAnnual(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!annual ? 'bg-gold-500/10 text-gold-400' : 'text-slate-400'}`}>
                Monthly
              </button>
              <button onClick={() => setAnnual(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${annual ? 'bg-gold-500/10 text-gold-400' : 'text-slate-400'}`}>
                Annual
                <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
            {PLANS.map(({ name, price, cta, variant, popular, features }) => (
              <motion.div key={name} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                className={`rounded-2xl p-7 border relative ${popular ? 'bg-navy-800 border-gold-500/50 shadow-gold-sm' : 'bg-navy-800 border-navy-700'}`}>
                {popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 bg-gold-gradient text-navy-950 text-xs font-bold rounded-full">
                    <Zap size={12} /> Most Popular
                  </div>
                )}
                <h3 className="font-bold text-white text-lg mb-1">{name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-mono text-3xl font-bold text-gold-400">
                    {price.monthly === 0 ? '₦0' : `₦${(annual ? price.annual : price.monthly).toLocaleString()}`}
                  </span>
                  <span className="text-slate-400 text-sm">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-slate-300 text-sm">
                      <Check size={15} className="text-gold-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <GoldButton variant={variant} className="w-full">{cta}</GoldButton>
              </motion.div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Full Feature Comparison</h2>
            <div className="bg-navy-800 rounded-2xl border border-navy-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-navy-700">
                    <th className="text-left px-6 py-4 text-slate-400 font-medium text-sm">Feature</th>
                    {['Free', 'Growth', 'Scale'].map(p => (
                      <th key={p} className="px-6 py-4 text-center">
                        <span className={`font-semibold text-sm ${p === 'Growth' ? 'text-gold-400' : 'text-white'}`}>{p}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map(({ feature, free, growth, scale }) => (
                    <tr key={feature} className="border-b border-navy-700/50 hover:bg-navy-700/20 transition-colors">
                      <td className="px-6 py-3.5 text-slate-300 text-sm">{feature}</td>
                      {[free, growth, scale].map((val, i) => (
                        <td key={i} className="px-6 py-3.5 text-center">
                          {typeof val === 'boolean' ? (
                            val ? <Check size={16} className="text-gold-500 mx-auto" /> : <X size={16} className="text-slate-600 mx-auto" />
                          ) : (
                            <span className="text-slate-300 text-sm font-mono">{val}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Investor Pricing */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <p className="text-gold-500 font-medium mb-2">For Investors & Funds</p>
              <h2 className="text-2xl font-bold text-white">Investor Access Plans</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {[
                { name: 'Angel Investor', price: '₦25,000/mo', features: ['Access to all verified startups', 'Advanced filtering & search', 'Direct messaging with founders', 'Portfolio tracking'] },
                { name: 'VC / Fund', price: 'Custom', features: ['Everything in Angel', 'Bulk data export', 'API access', 'Dedicated relationship manager', 'Custom deal flow pipeline'] },
              ].map(({ name, price, features }) => (
                <div key={name} className="bg-navy-800 rounded-xl border border-navy-700 p-6">
                  <h3 className="font-bold text-white mb-1">{name}</h3>
                  <p className="font-mono text-xl font-bold text-gold-400 mb-4">{price}</p>
                  <ul className="space-y-2 mb-6">
                    {features.map(f => <li key={f} className="flex items-center gap-2 text-slate-300 text-sm"><Check size={14} className="text-gold-500" /> {f}</li>)}
                  </ul>
                  <GoldButton variant="secondary" className="w-full">Contact Us</GoldButton>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
            <div className="bg-navy-800 rounded-2xl border border-navy-700 px-6">
              {FAQS.map(faq => <FAQItem key={faq.q} {...faq} />)}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
