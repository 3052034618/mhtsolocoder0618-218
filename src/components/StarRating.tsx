import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const sizeClasses: Record<string, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
}

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md'
}

export default function StarRating({ value, onChange, size = 'md' }: StarRatingProps) {
  const interactive = typeof onChange === 'function'

  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const starIndex = i + 1
        const filled = starIndex <= value

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(starIndex)}
            className={cn(
              'transition-colors',
              interactive
                ? 'cursor-pointer hover:scale-110'
                : 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled
                  ? 'fill-amber-500 text-amber-500'
                  : 'fill-gray-300 text-gray-300'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
