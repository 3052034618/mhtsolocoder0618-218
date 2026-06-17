import { cn } from '@/lib/utils'

const statusColorMap: Record<string, string> = {
  pending: 'amber',
  approved: 'green',
  rejected: 'red',
  draft: 'gray',
  interview: 'blue',
  offered: 'purple',
  accepted: 'green',
  completed: 'green',
  offline: 'red',
  pending_review: 'orange',
  pending_student: 'amber',
  pending_company: 'blue',
  pending_school: 'purple',
  screened: 'blue',
  confirmed: 'green',
  cancelled: 'red',
}

const colorClasses: Record<string, string> = {
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  gray: 'bg-gray-50 text-gray-700 border-gray-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
}

interface StatusBadgeProps {
  status: string
  label: string
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const color = statusColorMap[status] ?? 'gray'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        colorClasses[color]
      )}
    >
      {label}
    </span>
  )
}
