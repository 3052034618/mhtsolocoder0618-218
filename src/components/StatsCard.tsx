import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: number | string
  icon: ReactNode
  trend?: string
}

export default function StatsCard({ label, value, icon, trend }: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState<string>(
    typeof value === 'number' ? '0' : value
  )

  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplayValue(value)
      return
    }

    const duration = 800
    const steps = 30
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = step >= steps ? value : Math.round(increment * step)
      setDisplayValue(current.toLocaleString())
      if (step >= steps) clearInterval(timer)
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  const isPositiveTrend = trend?.startsWith('+')

  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
          {icon}
        </div>
        {trend && (
          <span
            className={cn(
              'text-xs font-medium',
              isPositiveTrend ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="font-['DM_Sans'] text-2xl font-bold text-slate-900">
          {displayValue}
        </p>
        <p className="mt-1 text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}
