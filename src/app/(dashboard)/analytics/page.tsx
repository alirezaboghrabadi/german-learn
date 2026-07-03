'use client'

import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Clock,
  BookOpen,
  Brain,
  Target,
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity,
  PieChart,
  LineChart,
} from 'lucide-react'

const weeklyData = [
  { day: 'Mon', hours: 1.5, xp: 120 },
  { day: 'Tue', hours: 2, xp: 180 },
  { day: 'Wed', hours: 1, xp: 90 },
  { day: 'Thu', hours: 2.5, xp: 220 },
  { day: 'Fri', hours: 1.5, xp: 150 },
  { day: 'Sat', hours: 3, xp: 280 },
  { day: 'Sun', hours: 0.5, xp: 45 },
]

export default function AnalyticsPage() {
  const totalHours = weeklyData.reduce((acc, d) => acc + d.hours, 0)
  const totalXP = weeklyData.reduce((acc, d) => acc + d.xp, 0)
  const avgHours = totalHours / weeklyData.length
  const avgXP = Math.round(totalXP / weeklyData.length)

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your learning progress and performance</p>
        </div>

        {/* Overview Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Clock, label: 'Total Study Time', value: '24.5h', change: '+12%', positive: true },
            { icon: TrendingUp, label: 'Average Daily', value: `${avgHours.toFixed(1)}h`, change: '+8%', positive: true },
            { icon: BookOpen, label: 'Lessons Done', value: '143', change: '+23%', positive: true },
            { icon: Brain, label: 'Retention Rate', value: '78%', change: '-3%', positive: false },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                  <span className={cn('text-xs font-medium flex items-center', stat.positive ? 'text-accent' : 'text-destructive')}>
                    {stat.positive ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Chart */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">This Week</h2>
                <Badge variant="outline">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {totalHours.toFixed(1)}h total
                </Badge>
              </div>
              <div className="space-y-3">
                {weeklyData.map((day) => (
                  <div key={day.day} className="flex items-center gap-3">
                    <span className="w-8 text-xs font-medium text-muted-foreground">{day.day}</span>
                    <div className="flex-1 h-8 rounded-xl bg-surface-50 dark:bg-surface-800/50 overflow-hidden">
                      <div
                        className="h-full rounded-xl bg-gradient-to-r from-primary to-secondary transition-all"
                        style={{ width: `${(day.hours / 3) * 100}%` }}
                      />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{day.hours}h</p>
                      <p className="text-xs text-muted-foreground">{day.xp} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skill Breakdown */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-6">Skill Breakdown</h2>
              <div className="space-y-4">
                {[
                  { skill: 'Vocabulary', progress: 45, items: 450, icon: BookOpen, color: 'bg-primary' },
                  { skill: 'Grammar', progress: 32, items: 18, icon: Brain, color: 'bg-secondary' },
                  { skill: 'Listening', progress: 28, items: 24, icon: Activity, color: 'bg-accent' },
                  { skill: 'Speaking', progress: 22, items: 45, icon: TrendingUp, color: 'bg-warning' },
                  { skill: 'Reading', progress: 35, items: 12, icon: BookOpen, color: 'bg-info' },
                  { skill: 'Writing', progress: 18, items: 8, icon: BookOpen, color: 'bg-destructive' },
                ].map((skill, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <skill.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{skill.skill}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{skill.items} items</span>
                    </div>
                    <Progress value={skill.progress} size="sm" barClassName={skill.color} showLabel />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Report */}
        <Card gradient>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Monthly Report</h2>
                <p className="text-sm text-muted-foreground">June 2026</p>
              </div>
              <Badge variant="primary" size="lg">
                <BarChart3 className="h-4 w-4 mr-1" />
                View Full Report
              </Badge>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Study Hours', value: '42h', change: '+15% vs last month' },
                { label: 'Vocabulary Learned', value: '156 words', change: '+22% vs last month' },
                { label: 'Exercises Completed', value: '342', change: '+8% vs last month' },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/10 dark:bg-surface-900/30">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/70">{stat.label}</p>
                  <p className="text-xs text-accent mt-1">{stat.change}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AppShell>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
