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
  Pen,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Volume2,
  Sparkles,
  RefreshCw,
  Edit3,
} from 'lucide-react'

const writingPrompts = [
  {
    id: 1,
    title: 'Describe Your Family',
    prompt: 'Write 3-4 sentences about your family in German. Include their names, ages, and where they live.',
    level: 'A1',
    hint: 'Use: heißen, wohnen, Jahre alt, mein/meine',
    sampleAnswer: 'Meine Familie ist groß. Mein Vater heißt Thomas und meine Mutter heißt Maria. Ich habe einen Bruder. Er ist 15 Jahre alt. Wir wohnen in Berlin.',
  },
  {
    id: 2,
    title: 'Your Daily Routine',
    prompt: 'Describe your daily routine in German. What time do you wake up, eat, work/study, and go to bed?',
    level: 'A1',
    hint: 'Use: aufstehen, frühstücken, arbeiten/lernen, zu Abend essen, schlafen gehen',
    sampleAnswer: 'Ich stehe um 7 Uhr auf. Um 8 Uhr frühstücke ich. Dann lerne ich Deutsch. Um 18 Uhr esse ich zu Abend. Um 22 Uhr gehe ich ins Bett.',
  },
]

export default function WritingPage() {
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<{
    score: number
    grammar_errors: Array<{ original: string; corrected: string; explanation: string; type: string }>
    vocabulary_suggestions: string[]
    overall_feedback: string
    corrected_version: string
  } | null>(null)

  const prompt = writingPrompts[currentPrompt]

  const handleSubmit = () => {
    if (!text.trim()) return

    setSubmitted(true)

    // Simulate AI feedback
    setFeedback({
      score: 75,
      grammar_errors: [
        { original: 'Ich haben', corrected: 'Ich habe', explanation: 'Ich takes the first person verb form "habe", not "haben"', type: 'grammar' },
        { original: 'mein Vater', corrected: 'mein Vater', explanation: 'Good use of nominative case!', type: 'grammar' },
      ],
      vocabulary_suggestions: [
        'Consider using "morgens" instead of "am Morgen" for a more natural sound',
        '"anschließend" is a good connector word to use',
      ],
      overall_feedback: 'Good effort! You have a solid foundation in basic sentence structure. Focus on verb conjugation and expanding your vocabulary with more descriptive words.',
      corrected_version: text.replace('Ich haben', 'Ich habe'),
    })
  }

  const reset = () => {
    setText('')
    setSubmitted(false)
    setFeedback(null)
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Writing Practice</h1>
          <p className="text-muted-foreground mt-1">Improve your writing with AI feedback</p>
        </div>

        {/* Writing Prompt */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Edit3 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{prompt.title}</h3>
                  <Badge variant="primary" size="sm">{prompt.level}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{prompt.prompt}</p>
                <Badge variant="outline">
                  <LightbulbIcon /> {prompt.hint}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Writing Area */}
        {!submitted ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Your Answer</label>
                <span className="text-xs text-muted-foreground">
                  {text.length} characters
                </span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write in German..."
                className="input-base min-h-[200px] resize-y font-sans"
                rows={8}
              />
              <div className="flex justify-between items-center mt-4">
                <button onClick={() => setText(prompt.sampleAnswer)} className="btn-ghost text-sm">
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  Show Example
                </button>
                <Button onClick={handleSubmit} disabled={!text.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Review
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : feedback ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Score */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-5xl font-bold text-primary mb-2">{feedback.score}/100</div>
                <p className="text-muted-foreground">Writing Score</p>
                <Progress value={feedback.score} size="lg" className="mt-4" />
              </CardContent>
            </Card>

            {/* Corrected Version */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold">Corrected Version</h3>
                </div>
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                  <p className="text-sm">{feedback.corrected_version}</p>
                </div>
              </CardContent>
            </Card>

            {/* Grammar Errors */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">
                  <AlertTriangle className="h-4 w-4 inline text-warning mr-2" />
                  Grammar & Corrections
                </h3>
                <div className="space-y-3">
                  {feedback.grammar_errors.map((error, i) => (
                    <div key={i} className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          'text-xs font-medium px-1.5 py-0.5 rounded',
                          error.type === 'grammar' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                        )}>
                          {error.type}
                        </span>
                      </div>
                      {error.original !== error.corrected && (
                        <p className="text-sm line-through text-destructive/70 mb-1">{error.original}</p>
                      )}
                      <p className="text-sm font-medium text-accent mb-1">{error.corrected}</p>
                      <p className="text-xs text-muted-foreground">{error.explanation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">
                  <Sparkles className="h-4 w-4 inline text-primary mr-2" />
                  Suggestions
                </h3>
                <ul className="space-y-2">
                  {feedback.vocabulary_suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Overall */}
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground italic">"{feedback.overall_feedback}"</p>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={reset} fullWidth>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={() => {
                  setCurrentPrompt((prev) => (prev + 1) % writingPrompts.length)
                  reset()
                }}
                fullWidth
              >
                Next Prompt
              </Button>
            </div>
          </motion.div>
        ) : null}
      </div>
    </AppShell>
  )
}

function LightbulbIcon() {
  return <Sparkles className="h-3 w-3 mr-1 inline" />
}
