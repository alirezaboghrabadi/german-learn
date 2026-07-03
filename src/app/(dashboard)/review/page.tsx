'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import {
  Brain,
  RefreshCw,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  ChevronRight,
  Sparkles,
  Clock,
  BarChart3,
} from 'lucide-react'

interface ReviewCard {
  id: string
  front: string
  back: string
  example: string
  type: 'vocabulary' | 'grammar'
  difficulty: 'easy' | 'medium' | 'hard'
}

const reviewCards: ReviewCard[] = [
  { id: '1', front: 'der Tisch', back: 'table · میز', example: 'Der Tisch ist groß.', type: 'vocabulary', difficulty: 'easy' },
  { id: '2', front: 'laufen', back: 'to run · دویدن', example: 'Ich laufe jeden Morgen.', type: 'vocabulary', difficulty: 'medium' },
  { id: '3', front: 'die Schule', back: 'school · مدرسه', example: 'Die Schule ist neu.', type: 'vocabulary', difficulty: 'easy' },
  { id: '4', front: 'treffen', back: 'to meet · ملاقات کردن', example: 'Wir treffen uns heute.', type: 'vocabulary', difficulty: 'hard' },
  { id: '5', front: 'der Computer', back: 'computer · کامپیوتر', example: 'Der Computer ist kaputt.', type: 'vocabulary', difficulty: 'easy' },
]

export default function ReviewPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [completed, setCompleted] = useState<Record<string, number>>({})
  const [isComplete, setIsComplete] = useState(false)

  const currentCard = reviewCards[currentIndex]
  const progress = (Object.keys(completed).length / reviewCards.length) * 100
  const correct = Object.values(completed).filter((v) => v >= 3).length

  const handleAnswer = (quality: number) => {
    setCompleted((prev) => ({ ...prev, [currentCard.id]: quality }))

    if (currentIndex < reviewCards.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
        setShowAnswer(false)
      }, 400)
    } else {
      setIsComplete(true)
    }
  }

  if (isComplete) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Review Complete!</h1>
            <p className="text-muted-foreground mb-8">
              You reviewed {reviewCards.length} items
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
              <div className="p-4 rounded-xl bg-accent/10">
                <p className="text-2xl font-bold text-accent">{correct}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div className="p-4 rounded-xl bg-destructive/10">
                <p className="text-2xl font-bold text-destructive">{reviewCards.length - correct}</p>
                <p className="text-xs text-muted-foreground">Need Review</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/10">
                <p className="text-2xl font-bold text-primary">{Math.round((correct / reviewCards.length) * 100)}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
            </div>
            <Button onClick={() => { setCurrentIndex(0); setShowAnswer(false); setCompleted({}); setIsComplete(false) }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Review Again
            </Button>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Spaced Repetition</h1>
            <Badge variant="primary">
              <Brain className="h-3.5 w-3.5 mr-1" />
              SM-2
            </Badge>
          </div>
          <Progress value={progress} showLabel label={`${Object.keys(completed).length} of ${reviewCards.length}`} />
        </div>

        {/* Flashcard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, rotateY: showAnswer ? 180 : 0 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="cursor-pointer" hover>
              <CardContent
                className="p-12 text-center min-h-[300px] flex flex-col items-center justify-center"
                onClick={() => setShowAnswer(true)}
              >
                {!showAnswer ? (
                  <>
                    <Badge variant="outline" size="sm" className="mb-4">
                      {currentCard.type}
                    </Badge>
                    <h2 className="text-3xl font-bold mb-2">{currentCard.front}</h2>
                    <p className="text-sm text-muted-foreground mt-4">Tap to reveal answer</p>
                  </>
                ) : (
                  <>
                    <Badge variant="accent" size="sm" className="mb-4">Answer</Badge>
                    <h2 className="text-3xl font-bold mb-3">{currentCard.front}</h2>
                    <p className="text-xl text-muted-foreground mb-4">{currentCard.back}</p>
                    <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 max-w-md w-full">
                      <p className="text-sm italic">{currentCard.example}</p>
                      <button className="btn-ghost p-1.5 mt-2 mx-auto">
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Quality Rating */}
                    <div className="mt-8 space-y-3 w-full max-w-sm">
                      <p className="text-sm text-muted-foreground">How well did you know this?</p>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleAnswer(1)}
                          className="flex flex-col items-center gap-1 p-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
                        >
                          <ThumbsDown className="h-5 w-5" />
                          <span className="text-xs">Hard</span>
                        </button>
                        <button
                          onClick={() => handleAnswer(3)}
                          className="flex flex-col items-center gap-1 p-3 rounded-xl bg-warning/10 text-warning hover:bg-warning/20 transition-all"
                        >
                          <RotateCcw className="h-5 w-5" />
                          <span className="text-xs">Medium</span>
                        </button>
                        <button
                          onClick={() => handleAnswer(5)}
                          className="flex flex-col items-center gap-1 p-3 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 transition-all"
                        >
                          <ThumbsUp className="h-5 w-5" />
                          <span className="text-xs">Easy</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 text-sm">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Ease: </span>
            <span className="font-medium">2.5</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 text-sm">
            <RefreshCw className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">Interval: </span>
            <span className="font-medium">1 day</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 text-sm">
            <Brain className="h-4 w-4 text-secondary" />
            <span className="text-muted-foreground">Status: </span>
            <span className="font-medium">Learning</span>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
