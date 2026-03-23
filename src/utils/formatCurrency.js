export const formatCurrency = (amount, currency = '₦') => {
  if (amount === null || amount === undefined) return `${currency}0`
  if (amount >= 1_000_000_000) return `${currency}${(amount / 1_000_000_000).toFixed(1)}B`
  if (amount >= 1_000_000) return `${currency}${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `${currency}${(amount / 1_000).toFixed(1)}K`
  return `${currency}${amount.toLocaleString()}`
}

export const cn = (...classes) => classes.filter(Boolean).join(' ')
