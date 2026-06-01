export default function FundingMeter({ committed, target, pctFunded, color = 'blue' }) {
  const pct = pctFunded ?? (target > 0 ? Math.round((committed / target) * 100) : 0)
  const capped = Math.min(pct, 100)

  // Color-code by funding progress
  let barColor, textColor
  if (pct >= 75) {
    barColor = 'bg-green-500'
    textColor = 'text-green-600'
  } else if (pct >= 50) {
    barColor = 'bg-gold-500'
    textColor = 'text-gold-600'
  } else {
    barColor = color === 'blue' ? 'bg-brand-600' : 'bg-brand-600'
    textColor = 'text-brand-600'
  }

  function fmt(n) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
    return `$${n}`
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-500 font-medium">
          {fmt(committed)} of {fmt(target)} committed
        </span>
        <span className={`text-xs font-bold ${textColor}`}>{pct}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${capped}%` }}
        />
      </div>
    </div>
  )
}
