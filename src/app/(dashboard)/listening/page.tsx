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
  Headphones,
  Volume2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  CheckCircle2,
  ChevronRight,
  Repeat,
  Mic,
  FileText,
  Globe,
} from 'lucide-react'

const listeningExercises = [
  {
    id: 1,
    title: 'Introduction Dialogue',
    level: 'A1',
    transcript: 'Hallo! Ich heiße Lukas. Ich komme aus Berlin. Ich bin 25 Jahre alt und ich studiere Medizin.',
    translation: 'Hello! My name is Lukas. I come from Berlin. I am 25 years old and I study medicine.',
    translation_fa: 'سلام! اسم من لوکاس است. من اهل برلین هستم. من ۲۵ سال دارم و پزشکی می‌خوانم.',
    questions: [
      { q: 'What is his name?', options: ['Lukas', 'Max', 'Peter', 'Hans'], correct: 0 },
      { q: 'Where is he from?', options: ['München', 'Hamburg', 'Berlin', 'Köln'], correct: 2 },
      { q: 'How old is he?', options: ['22', '25', '28', '30'], correct: 1 },
      { q: 'What does he study?', options: ['Jura', 'Medizin', 'Informatik', 'BWL'], correct: 1 },
    ],
  },
]

export default function ListeningPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [mode, setMode] = useState<'normal' | 'slow'>('normal')

  const exercise = listeningExercises[0]
  const allAnswered = exercise.questions.length === Object.keys(answers).length
  const score = allAnswered
    ? exercise.questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0)
    : 0

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Listening Practice</h1>
          <p className="text-muted-foreground mt-1">Improve your listening comprehension with native audio</p>
        </div>

        {/* Audio Player */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Headphones className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{exercise.title}</h3>
                <Badge variant="primary" size="sm">{exercise.level}</Badge>
              </div>
            </div>

            {/* Waveform (visual) */}
            <div className="h-16 rounded-xl bg-surface-50 dark:bg-surface-800/50 flex items-center justify-center mb-4 overflow-hidden">
              <div className="flex items-center gap-[3px] h-10">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-primary/30"
                    style={{ height: `${Math.random() * 100}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button className="btn-ghost p-2" onClick={() => setIsPlaying(false)} title="Restart">
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-white"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
              </button>
              <button className="btn-ghost p-2" onClick={() => setIsPlaying(false)} title="Skip">
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            {/* Speed Toggle */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setMode('normal')}
                className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all', mode === 'normal' ? 'bg-primary text-primary-foreground' : 'bg-surface-50 dark:bg-surface-800')}
              >
                Normal
              </button>
              <button
                onClick={() => setMode('slow')}
                className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all', mode === 'slow' ? 'bg-primary text-primary-foreground' : 'bg-surface-50 dark:bg-surface-800')}
              >
                <Volume2 className="h-4 w-4 mr-1 inline" />
                Slow
              </button>
              <button className="btn-ghost p-2" title="Repeat" onClick={() => setIsPlaying(true)}>
                <Repeat className="h-4 w-4" />
              </button>
            </div>

            {/* Show/Hide Transcript */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="btn-ghost flex items-center gap-2 text-sm"
              >
                <FileText className="h-4 w-4" />
                {showTranscript ? 'Hide' : 'Show'} Transcript
              </button>
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="btn-ghost flex items-center gap-2 text-sm"
              >
                <Globe className="h-4 w-4" />
                {showTranslation ? 'Hide' : 'Show'} Translation
              </button>
            </div>

            {showTranscript && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50"
              >
                <p className="text-sm">{exercise.transcript}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="ghost" size="sm">
                    <Volume2 className="h-3 w-3 mr-1" />
                    Shadowing Mode
                  </Badge>
                  <Badge variant="ghost" size="sm">
                    <Mic className="h-3 w-3 mr-1" />
                    Repeat Mode
                  </Badge>
                </div>
              </motion.div>
            )}

            {showTranslation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50"
              >
                <p className="text-sm text-muted-foreground">{exercise.translation}</p>
                <p className="text-sm text-muted-foreground mt-1" dir="rtl">{exercise.translation_fa}</p>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Comprehension Questions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Comprehension Questions</h3>
            <div className="space-y-6">
              {exercise.questions.map((q, i) => (
                <div key={i}>
                  <p className="font-medium mb-2">{i + 1}. {q.q}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, j) => (
                      <button
                        key={j}
                        onClick={() => {
                          if (!showResults) {
                            setAnswers((prev) => ({ ...prev, [i]: j }))
                          }
                        }}
                        className={cn(
                          'p-3 rounded-xl text-sm font-medium transition-all border',
                          answers[i] === j && !showResults && 'border-primary bg-primary/10 text-primary',
                          showResults && answers[i] === j && j === q.correct && 'border-accent bg-accent/10 text-accent',
                          showResults && answers[i] === j && j !== q.correct && 'border-destructive bg-destructive/10 text-destructive',
                          showResults && answers[i] !== j && j === q.correct && 'border-accent/30 bg-accent/5',
                          !answers[i] && 'border-border hover:border-primary/30'
                        )}
                        disabled={showResults}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {!showResults && allAnswered && (
              <Button onClick={() => setShowResults(true)} fullWidth className="mt-6">
                Check Answers
              </Button>
            )}

            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 text-center"
              >
                <p className="text-2xl font-bold text-primary">{score}/{exercise.questions.length}</p>
                <p className="text-sm text-muted-foreground">Questions correct</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
