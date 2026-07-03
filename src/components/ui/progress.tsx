'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { motion } from 'framer-motion'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  showLabel?: boolean
  label?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'accent' | 'gradient'
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, className, barClassName, showLabel, label, size = 'md', color = 'gradient' }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    const sizeClasses = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    }

    const colorClasses = {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      accent: 'bg-accent',
      gradient: 'bg-gradient-to-r from-primary to-secondary',
    }

    return (
      <div className={cn('w-full', className)} ref={ref}>
        <div className={cn('w-full bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden', sizeClasses[size])}>
          <motion.div
            className={cn('h-full rounded-full', colorClasses[color], barClassName)}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        {showLabel && (
          <div className="flex justify-between mt-1.5">
            {label && <span className="text-xs text-muted-foreground">{label}</span>}
            <span className="text-xs font-medium text-foreground">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    )
  }
)
Progress.displayName = 'Progress'

export { Progress }
