import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Building2, Globe, MapPin, Calendar, BadgeCheck, Save } from 'lucide-react'
import GoldButton from '../../components/common/GoldButton'
import { formatCurrency } from '../../utils/formatCurrency'

const STAGES = ['IDEA', 'MVP', 'TRACTION', 'GROWTH', 'SCALE']
const INDUSTRIES = ['Fintech', 'AgriTech', 'HealthTech', 'EdTech', 'Logistics', 'E-commerce', 'CleanTech', 'SaaS', 'Media', 'Other']

const schema = z.object({
  name: z.string().min(2, 'Business name required'),
  industry: z.string().min(1, 'Select an industry'),
  stage: z.string().min(1, 'Select a stage'),
  founded_year: z.string().optional(),
  headquarters: z.string().optional(),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  description: z.string().max(500, 'Max 500 characters').optional(),
  problem_solved: z.string().max(300).optional(),
  target_market: z.string().max(300).optional(),
  business_model: z.string().max(300).optional(),
  monthly_revenue: z.string().optional(),
  total_customers: z.string().optional(),
  growth_rate: z.string().optional(),
  total_funding: z.string().optional(),
})

const stageColors = {
  IDEA: 'border-slate-500 text-slate-300',
  MVP: 'border-blue-500 text-blue-300',
  TRACTION: 'border-purple-500 text-purple-300',
  GROWTH: 'border-emerald-500 text-emerald-400',
  SCALE: 'border-gold-500 text-gold-400',
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-sm text-slate-300 mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

function Input({ className = '', ...props }) {
  return (
    <input className={`w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors ${className}`} {...props} />
  )
}

function Textarea({ className = '', ...props }) {
  return (
    <textarea className={`w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none ${className}`} {...props} />
  )
}

export default function Profile() {
  const [saved, setSaved] = useState(false)
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { stage: 'MVP', industry: 'Fintech' },
  })

  const watchedValues = watch()

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 1000))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Startup Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Build your verified startup identity for investors</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-6">
          {/* Section 1: Business Info */}
          <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <Building2 size={18} className="text-gold-500" /> Business Information
            </h2>
            <div className="space-y-4">
              <Field label="Business Name *" error={errors.name?.message}>
                <Input {...register('name')} placeholder="e.g. AgriTech Nigeria Ltd" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Industry *" error={errors.industry?.message}>
                  <select {...register('industry')}
                    className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors">
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </Field>
                <Field label="Founded Year" error={errors.founded_year?.message}>
                  <Input {...register('founded_year')} placeholder="2021" type="number" min="2000" max="2025" />
                </Field>
              </div>

              <Field label="Stage *">
                <div className="grid grid-cols-5 gap-2 mt-1">
                  {STAGES.map(s => (
                    <button key={s} type="button" onClick={() => setValue('stage', s)}
                      className={`py-2 rounded-lg border text-xs font-medium transition-all ${watchedValues.stage === s ? `${stageColors[s]} bg-navy-700` : 'border-navy-600 text-slate-500 hover:border-navy-500'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Headquarters" error={errors.headquarters?.message}>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <Input {...register('headquarters')} className="pl-9" placeholder="Lagos, Nigeria" />
                  </div>
                </Field>
                <Field label="Website" error={errors.website?.message}>
                  <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <Input {...register('website')} className="pl-9" placeholder="https://yourstartup.com" />
                  </div>
                </Field>
              </div>

              <Field label={`Description (${(watchedValues.description || '').length}/500)`} error={errors.description?.message}>
                <Textarea {...register('description')} rows={3} placeholder="What does your startup do? Be clear and compelling..." />
              </Field>

              <Field label="Problem Solved" error={errors.problem_solved?.message}>
                <Textarea {...register('problem_solved')} rows={2} placeholder="What specific problem are you solving?" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Target Market" error={errors.target_market?.message}>
                  <Textarea {...register('target_market')} rows={2} placeholder="Who are your customers?" />
                </Field>
                <Field label="Business Model" error={errors.business_model?.message}>
                  <Textarea {...register('business_model')} rows={2} placeholder="How do you make money?" />
                </Field>
              </div>
            </div>
          </div>

          {/* Section 2: Key Metrics */}
          <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <BadgeCheck size={18} className="text-gold-500" /> Key Metrics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Monthly Revenue (₦)" error={errors.monthly_revenue?.message}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">₦</span>
                  <Input {...register('monthly_revenue')} className="pl-7" placeholder="4,500,000" type="number" />
                </div>
              </Field>
              <Field label="Total Customers" error={errors.total_customers?.message}>
                <Input {...register('total_customers')} placeholder="1,200" type="number" />
              </Field>
              <Field label="Monthly Growth Rate (%)" error={errors.growth_rate?.message}>
                <div className="relative">
                  <Input {...register('growth_rate')} placeholder="12" type="number" className="pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                </div>
              </Field>
              <Field label="Total Funding Raised (₦)" error={errors.total_funding?.message}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">₦</span>
                  <Input {...register('total_funding')} className="pl-7" placeholder="0" type="number" />
                </div>
              </Field>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <GoldButton type="submit" loading={isSubmitting} size="lg" icon={<Save size={16} />}>
              {saved ? '✓ Saved!' : 'Save Profile'}
            </GoldButton>
            {saved && <span className="text-emerald-400 text-sm">Changes saved successfully</span>}
          </div>
        </form>

        {/* Live Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-400">Live Preview</h3>
              <span className="text-xs text-gold-500 bg-gold-500/10 px-2 py-0.5 rounded-full">Investor View</span>
            </div>
            <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white text-lg">{watchedValues.name || 'Your Startup Name'}</h3>
                  <p className="text-slate-400 text-sm">{watchedValues.industry || 'Industry'}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${stageColors[watchedValues.stage] || stageColors.MVP}`}>
                  {watchedValues.stage || 'MVP'}
                </span>
              </div>

              {watchedValues.description && (
                <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">{watchedValues.description}</p>
              )}

              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Revenue', value: watchedValues.monthly_revenue ? `${formatCurrency(Number(watchedValues.monthly_revenue))}/mo` : '—' },
                  { label: 'Customers', value: watchedValues.total_customers || '—' },
                  { label: 'Growth', value: watchedValues.growth_rate ? `${watchedValues.growth_rate}%/mo` : '—' },
                  { label: 'Founded', value: watchedValues.founded_year || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-navy-900 rounded-lg p-3">
                    <p className="text-slate-500 text-xs">{label}</p>
                    <p className="font-mono text-sm text-white font-medium mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {watchedValues.headquarters && (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <MapPin size={12} /> {watchedValues.headquarters}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
