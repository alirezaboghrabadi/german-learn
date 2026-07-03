'use client'

import { useApp } from '@/contexts/AppContext'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  Flame,
  Trophy,
  Coins,
  BookOpen,
  Brain,
  Mic,
  Headphones,
  Target,
  ArrowRight,
  Calendar,
  TrendingUp,
  Zap,
  Clock,
  CheckCircle2,
  BookMarked,
  BarChart3,
  Star,
  Sparkles,
  GraduationCap,
  Award,
} from 'lucide-react'
import { getLevelColor, getLevelLabel, formatTime, formatXP, getStreakEmoji } from '@/lib/utils'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const { state } = useApp()

  const todayProgress = 65
  const todayGoal = state.dailyGoal
  const reviewCount = 12
  const levelProgress = 35

  return (
    <AppShell>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
      >
        {/* Top Row - Quick Stats */}
        <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card glass className="col-span-2 sm:col-span-2 lg:col-span-2">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl
                  bg-gradient-to-br
                  ${state.currentLevel === 'A0' && 'from-amber-400 to-orange-500'}
                  ${state.currentLevel === 'A1' && 'from-emerald-400 to-teal-500'}
                  ${state.currentLevel === 'A2' && 'from-blue-400 to-indigo-500'}
                  ${state.currentLevel === 'B1' && 'from-violet-400 to-purple-500'}
                  ${state.currentLevel === 'B2' && 'from-pink-400 to-rose-500'}
                `}>
                  {state.currentLevel}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                  <p className="text-lg font-bold">{getLevelLabel(state.currentLevel)}</p>
                  <Progress value={levelProgress} size="sm" className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardContent className="p-5 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center mb-2">
                <Flame className="h-5 w-5 text-warning" />
              </div>
              <p className="text-2xl font-bold">{state.streakDays}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardContent className="p-5 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold">{formatXP(state.xp)}</p>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardContent className="p-5 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                <Coins className="h-5 w-5 text-accent" />
              </div>
              <p className="text-2xl font-bold">{state.coins.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Coins</p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardContent className="p-5 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-2">
                <Brain className="h-5 w-5 text-secondary" />
              </div>
              <p className="text-2xl font-bold">{reviewCount}</p>
              <p className="text-xs text-muted-foreground">Due Reviews</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Progress */}
            <motion.div variants={item}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">Today&apos;s Progress</h2>
                      <p className="text-sm text-muted-foreground">
                        {Math.round(todayProgress)}% of daily goal completed
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">15m / {todayGoal}m</span>
                    </div>
                  </div>
                  <Progress value={todayProgress} size="lg" showLabel />
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {[
                      { icon: BookOpen, label: 'Lessons', value: '3 done', color: 'text-primary' },
                      { icon: CheckCircle2, label: 'Exercises', value: '12 done', color: 'text-accent' },
                      { icon: Zap, label: 'XP Today', value: '+120 XP', color: 'text-warning' },
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        <div>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                          <p className="text-sm font-semibold">{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={item}>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: BookOpen, label: 'Continue Learning', desc: 'Next: A1 Basics', href: '/learn', color: 'from-primary to-primary-dark' },
                  { icon: Brain, label: 'Daily Review', desc: `${reviewCount} items due`, href: '/review', color: 'from-secondary to-secondary-dark' },
                  { icon: Zap, label: 'Daily Challenge', desc: 'Complete 5 exercises', href: '/challenges', color: 'from-accent to-accent-dark' },
                  { icon: Sparkles, label: 'AI Tutor', desc: 'Practice conversation', href: '/ai-tutor', color: 'from-warning to-orange-500' },
                ].map((action, i) => (
                  <a key={i} href={action.href}>
                    <Card hover className="h-full">
                      <CardContent className="p-5">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-semibold mb-1">{action.label}</h3>
                        <p className="text-sm text-muted-foreground">{action.desc}</p>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Study Calendar */}
            <motion.div variants={item}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">This Week</h2>
                    <Button variant="ghost" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      View Calendar
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                      const active = i <= new Date().getDay() - 1
                      return (
                        <div key={day} className="flex-1 flex flex-col items-center gap-2">
                          <span className="text-xs text-muted-foreground">{day}</span>
                          <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-sm font-medium ${
                            active && i === new Date().getDay() - 1
                              ? 'gradient-primary text-white'
                              : active
                              ? 'bg-accent/20 text-accent'
                              : 'bg-surface-100 dark:bg-surface-800 text-muted-foreground'
                          }`}>
                            {['', '15', '16', '17', '18', '19', '20'][i]}
                          </div>
                          {active && <div className="w-1 h-1 rounded-full bg-accent" />}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Daily Motivation */}
            <motion.div variants={item}>
              <Card gradient>
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-8 w-8 text-warning mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Daily Motivation</h3>
                  <p className="text-sm text-muted-foreground italic">
                    &ldquo;Sprichst du Deutsch, öffnest du die Tür zu einer neuen Welt.&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Speaking German opens the door to a new world.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Progress Overview */}
            <motion.div variants={item}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Progress Overview</h2>
                  <div className="space-y-4">
                    {[
                      { icon: BookMarked, label: 'Vocabulary', progress: 45, color: 'bg-primary' },
                      { icon: GraduationCap, label: 'Grammar', progress: 30, color: 'bg-secondary' },
                      { icon: Headphones, label: 'Listening', progress: 25, color: 'bg-accent' },
                      { icon: Mic, label: 'Speaking', progress: 20, color: 'bg-warning' },
                    ].map((skill, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <skill.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{skill.label}</span>
                          </div>
                          <span className="text-xs font-medium">{skill.progress}%</span>
                        </div>
                        <Progress value={skill.progress} size="sm" barClassName={skill.color} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Lessons */}
            <motion.div variants={item}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recent Lessons</h2>
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: 'Basic Greetings', type: 'Vocabulary', xp: 20, completed: true },
                      { title: 'Verb Conjugation', type: 'Grammar', xp: 30, completed: true },
                      { title: 'Listening: Numbers', type: 'Listening', xp: 15, completed: false },
                    ].map((lesson, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                        <div className={`w-2 h-2 rounded-full ${lesson.completed ? 'bg-accent' : 'bg-warning'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">{lesson.type}</p>
                        </div>
                        <span className="text-xs font-medium text-primary">+{lesson.xp} XP</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weak Areas */}
            <motion.div variants={item}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Focus Areas</h2>
                  <div className="flex flex-wrap gap-2">
                    {['Articles (der/die/das)', 'Cases (Nominativ)', 'Verb Position', 'Perfect Tense'].map((area, i) => (
                      <Badge key={i} variant="warning" size="lg">
                        {area}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    <Target className="h-4 w-4 mr-1.5" />
                    Personalized Practice
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AppShell>
  )
}
