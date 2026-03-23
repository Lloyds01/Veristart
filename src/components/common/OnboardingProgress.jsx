import { Check } from 'lucide-react'

const STEPS = [
  'Business Info',
  'Team Members',
  'Financials',
  'Generate Pitch',
  'Apply for Funding',
]

export default function OnboardingProgress({ currentStep = 0 }) {
  return (
    <div className="flex items-center w-full">
      {STEPS.map((label, i) => {
        const done = i < currentStep
        const active = i === currentStep
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${done ? 'bg-gold-500 text-navy-950' : active ? 'border-2 border-gold-500 text-gold-500 animate-pulse-gold' : 'border-2 border-navy-600 text-slate-500'}
              `}>
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-xs whitespace-nowrap hidden sm:block ${done || active ? 'text-gold-400' : 'text-slate-500'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all duration-300 ${done ? 'bg-gold-500' : 'bg-navy-700'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
