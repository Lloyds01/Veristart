import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, Globe, MapPin, BadgeCheck, Save, Loader2 } from 'lucide-react'
import GoldButton from '../../components/common/GoldButton'
import { formatCurrency } from '../../utils/formatCurrency'
import { getProfile, updateProfile } from '../../api/startup'

const STAGES = ['IDEA', 'MVP', 'TRACTION', 'GROWTH', 'SCALE']
const INDUSTRIES = ['Fintech', 'AgriTech', 'HealthTech', 'EdTech', 'Logistics', 'E-commerce', 'CleanTech', 'SaaS', 'Media', 'Other']

const stageColors = {
  IDEA: 'border-slate-500 text-slate-300',
  MVP: 'border-blue-500 text-blue-300',
  TRACTION: 'border-purple-500 text-purple-300',
  GROWTH: 'border-emerald-500 text-emerald-400',
  SCALE: 'border-gold-500 text-gold-400',
}

const inputClass = 'w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors'
const textareaClass = `${inputClass} resize-none`

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm text-slate-300 mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [apiError, setApiError] = useState('')
  const [fields, setFields] = useState({
    business_name: '', industry: '', stage: 'IDEA',
    founded_date: '', headquarters: '', website: '',
    description: '', problem_solved: '', target_market: '', business_model: '',
  })

  useEffect(() => {
    getProfile()
      .then(({ data }) => {
        setFields({
          business_name: data.business_name || '',
          industry: data.industry || '',
          stage: data.stage || 'IDEA',
          founded_date: data.founded_date || '',
          headquarters: data.headquarters || '',
          website: data.website || '',
          description: data.description || '',
          problem_solved: data.problem_solved || '',
          target_market: data.target_market || '',
          business_model: data.business_model || '',
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (key) => (e) => setFields(prev => ({ ...prev, [key]: e.target.value }))
  const setStage = (stage) => setFields(prev => ({ ...prev, stage }))

  const handleSave = async () => {
    setSaving(true)
    setApiError('')
    try {
      await updateProfile(fields)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      const errData = err?.response?.data
      setApiError(errData && typeof errData === 'object'
        ? Object.values(errData).flat().join(' ')
        : 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-gold-500" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Startup Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Build your verified startup identity for investors</p>
      </div>

      {apiError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {apiError}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Business Info */}
          <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <Building2 size={18} className="text-gold-500" /> Business Information
            </h2>
            <div className="space-y-4">
              <Field label="Business Name">
                <input value={fields.business_name} onChange={set('business_name')}
                  placeholder="e.g. AgriTech Nigeria Ltd" className={inputClass} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Industry">
                  <select value={fields.industry} onChange={set('industry')}
                    className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors">
                    <option value="">Select industry</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </Field>
                <Field label="Founded Date">
                  <input value={fields.founded_date} onChange={set('founded_date')}
                    type="date" className={inputClass} />
                </Field>
              </div>

              <Field label="Stage">
                <div className="grid grid-cols-5 gap-2 mt-1">
                  {STAGES.map(s => (
                    <button key={s} type="button" onClick={() => setStage(s)}
                      className={`py-2 rounded-lg border text-xs font-medium transition-all ${fields.stage === s ? `${stageColors[s]} bg-navy-700` : 'border-navy-600 text-slate-500 hover:border-navy-500'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Headquarters">
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input value={fields.headquarters} onChange={set('headquarters')}
                      placeholder="Lagos, Nigeria" className={`${inputClass} pl-9`} />
                  </div>
                </Field>
                <Field label="Website">
                  <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input value={fields.website} onChange={set('website')}
                      placeholder="https://yourstartup.com" className={`${inputClass} pl-9`} />
                  </div>
                </Field>
              </div>

              <Field label={`Description (${fields.description.length}/500)`}>
                <textarea value={fields.description} onChange={set('description')}
                  rows={3} maxLength={500} placeholder="What does your startup do?"
                  className={textareaClass} />
              </Field>

              <Field label="Problem Solved">
                <textarea value={fields.problem_solved} onChange={set('problem_solved')}
                  rows={2} placeholder="What specific problem are you solving?"
                  className={textareaClass} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Target Market">
                  <textarea value={fields.target_market} onChange={set('target_market')}
                    rows={2} placeholder="Who are your customers?" className={textareaClass} />
                </Field>
                <Field label="Business Model">
                  <textarea value={fields.business_model} onChange={set('business_model')}
                    rows={2} placeholder="How do you make money?" className={textareaClass} />
                </Field>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <GoldButton type="button" loading={saving} size="lg" icon={<Save size={16} />} onClick={handleSave}>
              {saved ? '✓ Saved!' : 'Save Profile'}
            </GoldButton>
            {saved && <span className="text-emerald-400 text-sm">Changes saved successfully</span>}
          </div>
        </div>

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
                  <h3 className="font-bold text-white text-lg">{fields.business_name || 'Your Startup Name'}</h3>
                  <p className="text-slate-400 text-sm">{fields.industry || 'Industry'}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${stageColors[fields.stage]}`}>
                  {fields.stage}
                </span>
              </div>

              {fields.description && (
                <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">{fields.description}</p>
              )}

              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Founded', value: fields.founded_date || '—' },
                  { label: 'Location', value: fields.headquarters || '—' },
                  { label: 'Target Market', value: fields.target_market ? fields.target_market.slice(0, 20) + '...' : '—' },
                  { label: 'Business Model', value: fields.business_model ? fields.business_model.slice(0, 20) + '...' : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-navy-900 rounded-lg p-3">
                    <p className="text-slate-500 text-xs">{label}</p>
                    <p className="font-mono text-xs text-white font-medium mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {fields.headquarters && (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <MapPin size={12} /> {fields.headquarters}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
