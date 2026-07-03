'use client'

import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import {
  Award,
  Trophy,
  Star,
  Flame,
  Zap,
  BookOpen,
  Mic,
  Brain,
  Clock,
  Target,
  Lock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

const achievements = [
  {
    key: 'first-lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: BookOpen,
    rarity: 'common',
    progress: 100,
    unlocked: true,
    xp: 50,
    color: 'from-emerald-400 to-teal-500',
  },
  {
    key: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: Flame,
    rarity: 'common',
    progress: 100,
    unlocked: true,
    xp: 100,
    color: 'from-orange-400 to-red-500',
  },
  {
    key: 'vocab-master',
    title: 'Vocab Master',
    description: 'Learn 100 vocabulary words',
    icon: BookOpen,
    rarity: 'rare',
    progress: 65,
    unlocked: false,
    xp: 200,
    color: 'from-blue-400 to-indigo-500',
  },
  {
    key: 'grammar-guru',
    title: 'Grammar Guru',
    description: 'Complete all A1 grammar topics',
    icon: Brain,
    rarity: 'rare',
    progress: 40,
    unlocked: false,
    xp: 300,
    color: 'from-violet-400 to-purple-500',
  },
  {
    key: 'speaking-star',
    title: 'Speaking Star',
    description: 'Complete 50 speaking exercises',
    icon: Mic,
    rarity: 'epic',
    progress: 12,
    unlocked: false,
    xp: 500,
    color: 'from-pink-400 to-rose-500',
  },
  {
    key: 'speed-learner',
    title: 'Speed Learner',
    description: 'Complete 10 lessons in one day',
    icon: Zap,
    rarity: 'epic',
    progress: 0,
    unlocked: false,
    xp: 750,
    color: 'from-yellow-400 to-amber-500',
  },
  {
    key: 'marathon',
    title: 'Marathon',
    description: 'Study for 100 hours total',
    icon: Clock,
    rarity: 'legendary',
    progress: 8,
    unlocked: false,
    xp: 1000,
    color: 'from-cyan-400 to-blue-500',
  },
  {
    key: 'level-b2',
    title: 'German Master',
    description: 'Reach B2 level',
    icon: Trophy,
    rarity: 'legendary',
    progress: 0,
    unlocked: false,
    xp: 5000,
    color: 'from-primary to-secondary',
  },
]

const rarityColors: Record<string, string> = {
  common: 'text-surface-500 bg-surface-100 dark:bg-surface-800',
  rare: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  epic: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
  legendary: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
}

export default function AchievementsPage() {
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="text-muted-foreground mt-1">{unlockedCount}/{achievements.length} unlocked</p>
          <Progress value={(unlockedCount / achievements.length) * 100} size="sm" className="mt-2" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, i) => {
            const Icon = achievement.icon
            return (
              <motion.div
                key={achievement.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={cn('relative overflow-hidden', !achievement.unlocked && 'opacity-75')}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn(
                        'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center',
                        achievement.color
                      )}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className={cn(
                        'text-[10px] font-semibold uppercase px-2 py-1 rounded-full',
                        rarityColors[achievement.rarity]
                      )}>
                        {achievement.rarity}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{achievement.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">+{achievement.xp} XP</span>
                      {achievement.unlocked ? (
                        <span className="text-accent flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Unlocked
                        </span>
                      ) : (
                        <span className="text-muted-foreground">{achievement.progress}%</span>
                      )}
                    </div>
                    {!achievement.unlocked && (
                      <Progress value={achievement.progress} size="sm" className="mt-2" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </AppShell>
  )
}
