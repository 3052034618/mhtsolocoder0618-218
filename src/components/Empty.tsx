import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export default function Empty({ icon, title, description, action }: EmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12')}>
      <div className="mb-4 text-slate-400">{icon}</div>
      <p className="text-lg font-medium text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
