import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-gold-gradient text-navy-950 font-semibold hover:shadow-gold-glow hover:scale-105 active:scale-95',
  secondary: 'border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-navy-950 active:scale-95',
  ghost: 'text-white hover:text-gold-400 hover:bg-navy-700 active:scale-95',
  danger: 'bg-red-500 text-white hover:bg-red-600 hover:scale-105 active:scale-95',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
  xl: 'px-10 py-4 text-lg',
}

export default function GoldButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
      {children}
    </button>
  )
}
