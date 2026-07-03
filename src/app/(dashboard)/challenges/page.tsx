'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import {
  Zap,
  Flame,
  Star,
  Trophy,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calendar,
  Sun,
  Moon,
  Award,
} from 'lucide-react'

interface Challenge {
  id: string
  type: 'daily' | 'weekly' | 'monthly'
  title: string
  description: string
  xp: number
  coins: number
  progress: number
  target: number
  completed: boolean
  icon: React.ReactNode
}

const challenges: Challenge[] = [
  {
    id: 'd1',
    type: 'daily',
    title: 'Complete 3 Lessons',
    description: 'Finish 3 lessons today to earn bonus XP',
    xp: 100,
    coins: 20,
    progress: 2,
    target: 3,
    completed: false,
    icon: <BookIcon />,
  },
  {
    id: 'd2',
    type: 'daily',
    title: 'Review 10 Words',
    description: 'Review 10 vocabulary words with spaced repetition',
    xp: 75,
    coins: 15,
    progress: 10,
    target: 10,
    completed: true,
    icon: <BrainIcon />,
  },
  {
    id: 'd3',
    type: 'daily',
    title: 'Practice Speaking',
    description: 'Complete 5 speaking exercises',
    xp: 50,
    coins: 10,
    progress: 3,
    target: 5,
    completed: false,
    icon: <MicIcon />,
  },
  {
    id: 'w1',
    type: 'weekly',
    title: 'Weekly Streak',
    description: 'Study 7 days this week',
    xp: 500,
    coins: 100,
    progress: 4,
    target: 7,
    completed: false,
    icon: <FlameIcon />,
  },
  {
    id: 'w2',
    type: 'weekly',
    title: 'Vocabulary Master',
    description: 'Learn 30 new words this week',
    xp: 300,
    coins: 60,
    progress: 18,
    target: 30,
    completed: false,
    icon: <StarIcon />,
  },
  {
    id: 'm1',
    type: 'monthly',
    title: 'Monthly Marathon',
    description: 'Study for 20 hours this month',
    xp: 2000,
    coins: 500,
    progress: 8,
    target: 20,
    completed: false,
    icon: <TrophyIcon />,
  },
]

function BookIcon() { return <Zap className="h-5 w-5" /> }
function BrainIcon() { return <Star className="h-5 w-5" /> }
function MicIcon() { return <Sparkles className="h-5 w-5" /> }
function FlameIcon() { return <Flame className="h-5 w-5" /> }
function StarIcon() { return <Star className="h-5 w-5" /> }
function TrophyIcon() { return <Trophy className="h-5 w-5" /> }

const sections = ['daily', 'weekly', 'monthly'] as const

export default function ChallengesPage() {
  const [activeSection, setActiveSection] = useState<string>('daily')

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold">Challenges</h1>
          <p className="text-muted-foreground mt-1">Complete challenges to earn bonus XP and coins</p>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2">
          {sections.map((section) => {
            const sectionChallenges = challenges.filter((c) => c.type === section)
            const completed = sectionChallenges.filter((c) => c.completed).length
            return (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all capitalize',
                  activeSection === section
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface-50 dark:bg-surface-800 text-foreground/70 hover:text-foreground'
                )}
              >
                {section === 'daily' && <Sun className="h-4 w-4" />}
                {section === 'weekly' && <Calendar className="h-4 w-4" />}
                {section === 'monthly' && <Moon className="h-4 w-4" />}
                {section}
                <Badge variant={activeSection === section ? 'primary' : 'outline'} size="sm">
                  {completed}/{sectionChallenges.length}
                </Badge>
              </button>
            )
          })}
        </div>

        {/* Challenges */}
        <div className="space-y-4">
          {challenges
            .filter((c) => c.type === activeSection)
            .map((challenge, i) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={cn(challenge.completed && 'border-accent/30')}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center',
                        challenge.completed
                          ? 'bg-accent/10 text-accent'
                          : 'bg-primary/10 text-primary'
                      )}>
                        {challenge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{challenge.title}</h3>
                            <p className="text-sm text-muted-foreground">{challenge.description}</p>
                          </div>
                          {challenge.completed && (
                            <CheckCircle2 className="h-5 w-5 text-accent" />
                          )}
                        </div>
                        <Progress
                          value={(challenge.progress / challenge.target) * 100}
                          size="sm"
                          showLabel
                          label={`${challenge.progress}/${challenge.target}`}
                        />
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-xs font-medium text-primary">
                            <Trophy className="h-3 w-3 inline mr-1" />
                            +{challenge.xp} XP
                          </span>
                          <span className="text-xs font-medium text-warning">
                            <Award className="h-3 w-3 inline mr-1" />
                            +{challenge.coins} Coins
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
      </motion.div>
    </AppShell>
  )
}
