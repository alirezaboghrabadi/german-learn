'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  GraduationCap,
  Clock,
  Target,
  Globe,
  Calendar,
  BookOpen,
} from 'lucide-react'

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to GermanLearn!',
    description: 'Let\'s personalize your learning journey to help you reach your goals.',
    icon: Sparkles,
  },
  {
    id: 'level',
    title: 'What\'s your current level?',
    description: 'Choose your starting point. Don\'t worry, you can always change this.',
    icon: GraduationCap,
  },
  {
    id: 'goal',
    title: 'What\'s your daily goal?',
    description: 'How much time can you dedicate to learning German each day?',
    icon: Clock,
  },
  {
    id: 'reason',
    title: 'Why are you learning German?',
    description: 'This helps us tailor your learning experience.',
    icon: Target,
  },
  {
    id: 'target',
    title: 'What\'s your target?',
    description: 'Set your ultimate goal and target date.',
    icon: Calendar,
  },
  {
    id: 'plan',
    title: 'Your Personalized Plan',
    description: 'Based on your answers, we\'ve created a custom learning roadmap.',
    icon: BookOpen,
  },
]

const levels = [
  { id: 'A0', label: 'Absolute Beginner', desc: 'No prior knowledge' },
  { id: 'A1', label: 'Beginner', desc: 'Know a few words' },
  { id: 'A2', label: 'Elementary', desc: 'Basic conversations' },
  { id: 'B1', label: 'Intermediate', desc: 'Can hold conversations' },
  { id: 'B2', label: 'Upper Intermediate', desc: 'Nearly fluent' },
]

const dailyGoals = [5, 10, 15, 30, 60]
const reasons = [
  { id: 'study', label: 'Study in Germany', icon: GraduationCap },
  { id: 'work', label: 'Work in Germany', icon: Target },
  { id: 'travel', label: 'Travel', icon: Globe },
  { id: 'personal', label: 'Personal Interest', icon: HeartIcon },
  { id: 'family', label: 'Family / Friends', icon: UsersIcon },
]
const targetLevels = ['A1', 'A2', 'B1', 'B2']

function HeartIcon() { return <Sparkles className="h-5 w-5" /> }
function UsersIcon() { return <Sparkles className="h-5 w-5" /> }

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({
    level: '',
    dailyGoal: 15,
    reason: '',
    targetLevel: 'B2',
    targetDate: '',
  })

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      router.push('/dashboard')
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const canProceed = () => {
    switch (step.id) {
      case 'level': return !!answers.level
      case 'goal': return !!answers.dailyGoal
      case 'reason': return !!answers.reason
      case 'target': return !!answers.targetLevel
      default: return true
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full max-w-lg">
        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i <= currentStep ? 'bg-primary w-8' : 'bg-surface-200 dark:bg-surface-700 w-4'
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-8">
                {/* Step Content */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{step.title}</h1>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {step.id === 'level' && (
                  <div className="space-y-3">
                    {levels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setAnswers((prev) => ({ ...prev, level: level.id }))}
                        className={cn(
                          'w-full flex items-center justify-between p-4 rounded-xl border transition-all',
                          answers.level === level.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm',
                            level.id === 'A0' && 'bg-amber-500',
                            level.id === 'A1' && 'bg-emerald-500',
                            level.id === 'A2' && 'bg-blue-500',
                            level.id === 'B1' && 'bg-violet-500',
                            level.id === 'B2' && 'bg-pink-500',
                          )}>
                            {level.id}
                          </div>
                          <div className="text-left">
                            <p className="font-medium">{level.label}</p>
                            <p className="text-xs text-muted-foreground">{level.desc}</p>
                          </div>
                        </div>
                        {answers.level === level.id && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {step.id === 'goal' && (
                  <div className="grid grid-cols-5 gap-3">
                    {dailyGoals.map((goal) => (
                      <button
                        key={goal}
                        onClick={() => setAnswers((prev) => ({ ...prev, dailyGoal: goal }))}
                        className={cn(
                          'p-4 rounded-xl border text-center transition-all',
                          answers.dailyGoal === goal
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30'
                        )}
                      >
                        <p className="text-2xl font-bold text-primary">{goal}</p>
                        <p className="text-xs text-muted-foreground">min</p>
                      </button>
                    ))}
                  </div>
                )}

                {step.id === 'reason' && (
                  <div className="grid grid-cols-1 gap-3">
                    {reasons.map((reason) => (
                      <button
                        key={reason.id}
                        onClick={() => setAnswers((prev) => ({ ...prev, reason: reason.id }))}
                        className={cn(
                          'w-full flex items-center justify-between p-4 rounded-xl border transition-all',
                          answers.reason === reason.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <reason.icon className="h-5 w-5 text-primary" />
                          <span className="font-medium">{reason.label}</span>
                        </div>
                        {answers.reason === reason.id && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {step.id === 'target' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Target Level</label>
                      <div className="grid grid-cols-4 gap-2">
                        {targetLevels.map((level) => (
                          <button
                            key={level}
                            onClick={() => setAnswers((prev) => ({ ...prev, targetLevel: level }))}
                            className={cn(
                              'p-4 rounded-xl border text-center transition-all',
                              answers.targetLevel === level
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/30'
                            )}
                          >
                            <p className="text-lg font-bold">{level}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Target Date (Optional)</label>
                      <input
                        type="date"
                        value={answers.targetDate}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, targetDate: e.target.value }))}
                        className="input-base"
                      />
                    </div>
                  </div>
                )}

                {step.id === 'plan' && (
                  <div className="space-y-4">
                    <Card glass>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          <span className="font-semibold">Your Roadmap</span>
                        </div>
                        <div className="space-y-3">
                          {[
                            { week: 'Week 1-4', focus: 'A0 Basics - Alphabet, Greetings, Numbers', hours: '7h' },
                            { week: 'Week 5-8', focus: 'A1 Foundation - Nouns, Verbs, Present Tense', hours: '10h' },
                            { week: 'Week 9-12', focus: 'A1 Advanced - Cases, Modal Verbs', hours: '10h' },
                            { week: 'Week 13-20', focus: 'A2 Core - Perfect Tense, Prepositions', hours: '20h' },
                            { week: 'Week 21-32', focus: 'B1 Intermediate - Complex Grammar', hours: '30h' },
                            { week: 'Week 33-48', focus: 'B2 Upper Intermediate - Fluency', hours: '40h' },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 text-sm">
                              <div>
                                <span className="font-medium">{item.week}</span>
                                <p className="text-xs text-muted-foreground">{item.focus}</p>
                              </div>
                              <Badge variant="outline" size="sm">{item.hours}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <p className="text-sm text-muted-foreground text-center">
                      Estimated time to reach {answers.targetLevel}: ~48 weeks ({answers.dailyGoal} min/day)
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="ghost"
                    onClick={() => currentStep > 0 ? setCurrentStep((prev) => prev - 1) : router.push('/dashboard')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {currentStep === 0 ? 'Skip' : 'Back'}
                  </Button>
                  <Button onClick={handleNext} disabled={!canProceed()}>
                    {isLastStep ? 'Start Learning!' : 'Continue'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
