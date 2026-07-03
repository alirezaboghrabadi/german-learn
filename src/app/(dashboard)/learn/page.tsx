'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Star,
  ChevronRight,
  GraduationCap,
  Volume2,
  Mic,
  BookMarked,
  Pen,
  Brain,
  Headphones,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { CEFRLevel } from '@/types'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

interface LevelData {
  id: CEFRLevel
  label: string
  description: string
  color: string
  progress: number
  units: UnitData[]
}

interface UnitData {
  id: string
  number: number
  title: string
  lessons: LessonData[]
  completed: boolean
}

interface LessonData {
  id: string
  title: string
  type: string
  xp: number
  duration: string
  completed: boolean
  locked: boolean
}

const levels: LevelData[] = [
  {
    id: 'A0',
    label: 'Absolute Beginner',
    description: 'Start from zero - no prior knowledge needed',
    color: 'from-amber-400 to-orange-500',
    progress: 100,
    units: [
      {
        id: 'a0-u1', number: 1, title: 'Introduction to German', completed: true,
        lessons: [
          { id: 'a0-u1-l1', title: 'The German Alphabet', type: 'Vocabulary', xp: 15, duration: '10 min', completed: true, locked: false },
          { id: 'a0-u1-l2', title: 'Basic Pronunciation', type: 'Speaking', xp: 20, duration: '12 min', completed: true, locked: false },
          { id: 'a0-u1-l3', title: 'First Words', type: 'Vocabulary', xp: 15, duration: '10 min', completed: true, locked: false },
          { id: 'a0-u1-l4', title: 'Unit Quiz', type: 'Quiz', xp: 50, duration: '15 min', completed: true, locked: false },
        ],
      },
      {
        id: 'a0-u2', number: 2, title: 'Numbers & Colors', completed: true,
        lessons: [
          { id: 'a0-u2-l1', title: 'Numbers 1-20', type: 'Vocabulary', xp: 15, duration: '10 min', completed: true, locked: false },
          { id: 'a0-u2-l2', title: 'Colors', type: 'Vocabulary', xp: 15, duration: '10 min', completed: true, locked: false },
          { id: 'a0-u2-l3', title: 'Listening: Numbers', type: 'Listening', xp: 20, duration: '12 min', completed: false, locked: false },
          { id: 'a0-u2-l4', title: 'Unit Quiz', type: 'Quiz', xp: 50, duration: '15 min', completed: false, locked: false },
        ],
      },
    ],
  },
  {
    id: 'A1',
    label: 'Beginner',
    description: 'Master everyday situations',
    color: 'from-emerald-400 to-teal-500',
    progress: 45,
    units: [
      {
        id: 'a1-u1', number: 1, title: 'Basic Greetings', completed: false,
        lessons: [
          { id: 'a1-u1-l1', title: 'Hello & Goodbye', type: 'Vocabulary', xp: 15, duration: '10 min', completed: true, locked: false },
          { id: 'a1-u1-l2', title: 'Introducing Yourself', type: 'Speaking', xp: 20, duration: '12 min', completed: true, locked: false },
          { id: 'a1-u1-l3', title: 'Verbs: sein & haben', type: 'Grammar', xp: 25, duration: '15 min', completed: false, locked: false },
          { id: 'a1-u1-l4', title: 'Unit Quiz', type: 'Quiz', xp: 50, duration: '15 min', completed: false, locked: true },
        ],
      },
      {
        id: 'a1-u2', number: 2, title: 'Everyday Objects', completed: false,
        lessons: [
          { id: 'a1-u2-l1', title: 'Common Nouns', type: 'Vocabulary', xp: 15, duration: '10 min', completed: false, locked: true },
          { id: 'a1-u2-l2', title: 'Articles: der/die/das', type: 'Grammar', xp: 25, duration: '15 min', completed: false, locked: true },
        ],
      },
    ],
  },
  {
    id: 'A2',
    label: 'Elementary',
    description: 'Communicate in common situations',
    color: 'from-blue-400 to-indigo-500',
    progress: 10,
    units: [
      {
        id: 'a2-u1', number: 1, title: 'Travel & Directions', completed: false,
        lessons: [
          { id: 'a2-u1-l1', title: 'Asking for Directions', type: 'Vocabulary', xp: 20, duration: '12 min', completed: false, locked: false },
          { id: 'a2-u1-l2', title: 'Prepositions', type: 'Grammar', xp: 25, duration: '15 min', completed: false, locked: true },
        ],
      },
    ],
  },
  {
    id: 'B1',
    label: 'Intermediate',
    description: 'Independent communication',
    color: 'from-violet-400 to-purple-500',
    progress: 0,
    units: [],
  },
  {
    id: 'B2',
    label: 'Upper Intermediate',
    description: 'Complex texts & fluent communication',
    color: 'from-pink-400 to-rose-500',
    progress: 0,
    units: [],
  },
]

function getLessonIcon(type: string) {
  switch (type) {
    case 'Vocabulary': return BookOpen
    case 'Grammar': return GraduationCap
    case 'Speaking': return Mic
    case 'Listening': return Headphones
    case 'Reading': return BookMarked
    case 'Writing': return Pen
    case 'Quiz': return Brain
    default: return BookOpen
  }
}

function getLessonColor(type: string) {
  switch (type) {
    case 'Vocabulary': return 'bg-primary/10 text-primary'
    case 'Grammar': return 'bg-secondary/10 text-secondary'
    case 'Speaking': return 'bg-accent/10 text-accent'
    case 'Listening': return 'bg-info/10 text-info'
    case 'Reading': return 'bg-warning/10 text-warning'
    case 'Writing': return ''
    case 'Quiz': return 'bg-accent/10 text-accent'
    default: return 'bg-primary/10 text-primary'
  }
}

export default function LearnPage() {
  const [expandedLevel, setExpandedLevel] = useState<string>('A1')

  return (
    <AppShell>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
      >
        {/* Header */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold">Learning Path</h1>
              <p className="text-muted-foreground mt-1">Follow your personalized A0 to B2 roadmap</p>
            </div>
            <Badge variant="primary" size="lg">
              <Sparkles className="h-4 w-4 mr-1" />
              A0 → B2
            </Badge>
          </div>
        </motion.div>

        {/* Level Progress Overview */}
        <motion.div variants={item} className="grid grid-cols-5 gap-3">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => setExpandedLevel(level.id)}
              className={cn(
                'p-4 rounded-2xl border transition-all text-center',
                expandedLevel === level.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/30'
              )}
            >
              <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold', level.color)}>
                {level.id}
              </div>
              <Progress value={level.progress} size="sm" barClassName={`bg-gradient-to-r ${level.color}`} />
              <p className="text-xs text-muted-foreground mt-1">{level.progress}%</p>
            </button>
          ))}
        </motion.div>

        {/* Expanded Level Content */}
        {levels.filter((l) => l.id === expandedLevel).map((level) => (
          <motion.div key={level.id} variants={item} className="space-y-4">
            <div className={cn('p-6 rounded-2xl bg-gradient-to-br text-white', level.color)}>
              <h2 className="text-2xl font-bold mb-1">Level {level.id}: {level.label}</h2>
              <p className="text-white/80">{level.description}</p>
              <Progress value={level.progress} size="sm" barClassName="bg-white/60" className="mt-4" />
            </div>

            {level.units.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Level Locked</h3>
                  <p className="text-muted-foreground">Complete the previous level to unlock this one.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {level.units.map((unit) => (
                  <Card key={unit.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold',
                            `bg-gradient-to-br ${level.color}`
                          )}>
                            {unit.number}
                          </div>
                          <div>
                            <h3 className="font-semibold">Unit {unit.number}: {unit.title}</h3>
                            <p className="text-xs text-muted-foreground">
                              {unit.lessons.filter((l) => l.completed).length}/{unit.lessons.length} lessons
                            </p>
                          </div>
                        </div>
                        {unit.completed && (
                          <CheckCircle2 className="h-6 w-6 text-accent" />
                        )}
                      </div>

                      <div className="space-y-2">
                        {unit.lessons.map((lesson) => {
                          const Icon = getLessonIcon(lesson.type)
                          return (
                            <a
                              key={lesson.id}
                              href={`/learn/${lesson.id}`}
                              className={cn(
                                'flex items-center gap-3 p-3 rounded-xl transition-all',
                                lesson.completed
                                  ? 'bg-surface-50 dark:bg-surface-800/50'
                                  : lesson.locked
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'hover:bg-surface-50 dark:hover:bg-surface-800 cursor-pointer'
                              )}
                            >
                              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', getLessonColor(lesson.type))}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium truncate">{lesson.title}</span>
                                  {lesson.completed && <CheckCircle2 className="h-3.5 w-3.5 text-accent flex-shrink-0" />}
                                  {lesson.locked && <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{lesson.type}</span>
                                  <span>·</span>
                                  <span>{lesson.duration}</span>
                                  <span>·</span>
                                  <span className="text-primary">+{lesson.xp} XP</span>
                                </div>
                              </div>
                              {!lesson.locked && (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </a>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </AppShell>
  )
}
