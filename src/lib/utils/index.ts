import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CEFRLevel } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function formatXP(xp: number): string {
  if (xp < 1000) return xp.toString()
  return `${(xp / 1000).toFixed(1)}k`
}

export function getLevelColor(level: CEFRLevel): string {
  const colors: Record<CEFRLevel, string> = {
    A0: '#F59E0B',
    A1: '#10B981',
    A2: '#3B82F6',
    B1: '#7C3AED',
    B2: '#EC4899',
  }
  return colors[level]
}

export function getLevelLabel(level: CEFRLevel): string {
  const labels: Record<CEFRLevel, string> = {
    A0: 'Beginner',
    A1: 'Elementary',
    A2: 'Pre-Intermediate',
    B1: 'Intermediate',
    B2: 'Upper Intermediate',
  }
  return labels[level]
}

export function getLevelProgress(currentLevel: CEFRLevel): number {
  const levels: CEFRLevel[] = ['A0', 'A1', 'A2', 'B1', 'B2']
  const index = levels.indexOf(currentLevel)
  return ((index + 1) / levels.length) * 100
}

export function getNextLevel(currentLevel: CEFRLevel): CEFRLevel | null {
  const levels: CEFRLevel[] = ['A0', 'A1', 'A2', 'B1', 'B2']
  const index = levels.indexOf(currentLevel)
  return index < levels.length - 1 ? levels[index + 1] : null
}

export function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 15)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const groupKey = String(item[key])
      if (!acc[groupKey]) acc[groupKey] = []
      acc[groupKey].push(item)
      return acc
    },
    {} as Record<string, T[]>
  )
}

export function getStreakEmoji(days: number): string {
  if (days === 0) return '🔥'
  if (days < 7) return '🔥'
  if (days < 30) return '⭐'
  if (days < 100) return '🌟'
  return '💫'
}

export function getGradientForLevel(level: CEFRLevel): string {
  const gradients: Record<CEFRLevel, string> = {
    A0: 'from-amber-400 to-orange-500',
    A1: 'from-emerald-400 to-teal-500',
    A2: 'from-blue-400 to-indigo-500',
    B1: 'from-violet-400 to-purple-500',
    B2: 'from-pink-400 to-rose-500',
  }
  return gradients[level]
}

export function getNextReview(reviewItems: { next_review: string }[]): string | null {
  const now = new Date()
  const upcoming = reviewItems
    .map((item) => new Date(item.next_review))
    .filter((date) => date > now)
    .sort((a, b) => a.getTime() - b.getTime())

  return upcoming.length > 0 ? upcoming[0].toISOString() : null
}
