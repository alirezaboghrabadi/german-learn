/**
 * SM-2 Spaced Repetition Algorithm
 * Based on the SuperMemo SM-2 algorithm by Piotr Wozniak
 *
 * Quality scale (q):
 * 0 - Complete blackout
 * 1 - Incorrect; correct answer remembered upon seeing it
 * 2 - Incorrect; correct answer seemed easy to recall
 * 3 - Correct with serious difficulty
 * 4 - Correct after hesitation
 * 5 - Perfect response
 */

export interface SM2Result {
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: Date
  status: 'learning' | 'reviewing' | 'mastered'
}

export function calculateSM2(
  quality: number,
  currentEaseFactor: number = 2.5,
  currentInterval: number = 0,
  currentRepetitions: number = 0
): SM2Result {
  // Clamp quality to 0-5
  const q = Math.max(0, Math.min(5, Math.round(quality)))

  let easeFactor = currentEaseFactor
  let interval = currentInterval
  let repetitions = currentRepetitions

  // Update ease factor based on quality
  easeFactor = currentEaseFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))

  // Ensure ease factor doesn't go below 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3
  }

  let status: SM2Result['status'] = 'learning'

  if (q < 3) {
    // Failed recall - reset repetitions
    repetitions = 0
    interval = 1
    status = 'learning'
  } else {
    // Successful recall
    repetitions += 1

    if (repetitions === 1) {
      interval = 1
      status = 'learning'
    } else if (repetitions === 2) {
      interval = 6
      status = 'reviewing'
    } else {
      interval = Math.round(currentInterval * easeFactor)
      status = repetitions >= 5 ? 'mastered' : 'reviewing'
    }
  }

  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + interval)

  return {
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    repetitions,
    nextReviewDate,
    status,
  }
}

/**
 * Calculate the optimal number of review items for a session
 * based on user's available time and average review time
 */
export function calculateOptimalReviews(
  availableMinutes: number,
  averageReviewTimeSeconds: number = 15
): number {
  const maxReviews = Math.floor((availableMinutes * 60) / averageReviewTimeSeconds)
  return Math.min(maxReviews, 50) // Cap at 50 reviews per session
}

/**
 * Prioritize review items based on urgency and difficulty
 */
export function prioritizeReviews(
  items: Array<{
    id: string
    next_review_date: string
    ease_factor: number
    repetitions: number
    status: string
  }>
): Array<typeof items[0]> {
  const now = new Date()

  return [...items].sort((a, b) => {
    const aDate = new Date(a.next_review_date)
    const bDate = new Date(b.next_review_date)

    // Overdue items first
    const aOverdue = aDate < now
    const bOverdue = bDate < now

    if (aOverdue && !bOverdue) return -1
    if (!aOverdue && bOverdue) return 1

    // Then by how overdue they are
    if (aOverdue && bOverdue) {
      return aDate.getTime() - bDate.getTime()
    }

    // Then by ease factor (hard items first)
    if (a.ease_factor !== b.ease_factor) {
      return a.ease_factor - b.ease_factor
    }

    // Then by status
    const statusOrder = { learning: 0, reviewing: 1, mastered: 2 }
    return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder]
  })
}

/**
 * Calculate retention rate based on review history
 */
export function calculateRetentionRate(
  totalReviews: number,
  totalCorrect: number
): number {
  if (totalReviews === 0) return 0
  return Math.round((totalCorrect / totalReviews) * 100)
}

/**
 * Predict memory strength based on repetitions and ease factor
 */
export function predictMemoryStrength(
  repetitions: number,
  easeFactor: number,
  interval: number
): number {
  if (repetitions === 0) return 0

  // Memory strength formula based on SM-2 parameters
  const baseStrength = Math.min(repetitions / 5, 1) * 100
  const intervalFactor = Math.min(interval / 365, 1)
  const easeFactorStrength = Math.min((easeFactor - 1.3) / 2.2, 1)

  return Math.round((baseStrength * 0.4 + intervalFactor * 0.3 + easeFactorStrength * 0.3))
}
