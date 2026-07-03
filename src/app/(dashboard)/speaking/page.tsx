'use client'

import { useState, useCallback } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  XCircle,
  BarChart3,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Headphones,
} from 'lucide-react'

const speakingPrompts = [
  { de: 'Hallo, wie geht es dir?', en: 'Hello, how are you?', fa: 'سلام، حالت چطوره؟', hints: ['Hallo', 'geht', 'dir'] },
  { de: 'Ich heiße Anna.', en: 'My name is Anna.', fa: 'اسم من آنا است.', hints: ['Ich', 'heiße', 'Anna'] },
  { de: 'Wo wohnst du?', en: 'Where do you live?', fa: 'کجا زندگی می‌کنی؟', hints: ['Wo', 'wohnst', 'du'] },
]

export default function SpeakingPage() {
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [results, setResults] = useState<Array<{ accuracy: number; fluency: number }>>([])
  const [showResult, setShowResult] = useState(false)

  const prompt = speakingPrompts[currentPrompt]

  const toggleListening = useCallback(() => {
    if (isListening) {
      setIsListening(false)
      // Simulate result
      if (transcript) {
        const accuracy = Math.floor(Math.random() * 40) + 60
        setResults((prev) => [...prev, { accuracy, fluency: accuracy - 10 + Math.floor(Math.random() * 20) }])
        setShowResult(true)
      }
    } else {
      setIsListening(true)
      setTranscript('')
      setShowResult(false)
    }
  }, [isListening, transcript])

  const nextPrompt = () => {
    if (currentPrompt < speakingPrompts.length - 1) {
      setCurrentPrompt((prev) => prev + 1)
      setShowResult(false)
      setTranscript('')
    }
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Speaking Practice</h1>
          <p className="text-muted-foreground mt-1">Practice pronunciation with speech recognition</p>
        </div>

        {/* Progress */}
        <Progress value={(currentPrompt / speakingPrompts.length) * 100} showLabel label={`${currentPrompt + 1} of ${speakingPrompts.length}`} />

        {/* Current Prompt */}
        <Card>
          <CardContent className="p-8 text-center">
            <Badge variant="secondary" className="mb-4">Prompt {currentPrompt + 1}</Badge>
            <h2 className="text-2xl font-bold mb-2">{prompt.de}</h2>
            <p className="text-muted-foreground mb-1">{prompt.en}</p>
            <p className="text-sm text-muted-foreground" dir="rtl">{prompt.fa}</p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <Button variant="outline" onClick={() => {
                const u = new SpeechSynthesisUtterance(prompt.de)
                u.lang = 'de-DE'; u.rate = 0.85
                speechSynthesis.cancel(); speechSynthesis.speak(u)
              }}>
                <Volume2 className="h-4 w-4 mr-2" />
                Hear It
              </Button>
              <Button variant="outline" onClick={() => {
                const u = new SpeechSynthesisUtterance(prompt.de)
                u.lang = 'de-DE'; u.rate = 0.5
                speechSynthesis.cancel(); speechSynthesis.speak(u)
              }}>
                <Headphones className="h-4 w-4 mr-2" />
                Slow Mode
              </Button>
            </div>

            {/* Hints */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {prompt.hints.map((hint, i) => (
                <Badge key={i} variant="outline">{hint}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recording Area */}
        <Card className={cn('transition-all', isListening && 'ring-2 ring-primary/50')}>
          <CardContent className="p-8 text-center">
            <button
              onClick={toggleListening}
              className={cn(
                'w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all mb-4',
                isListening
                  ? 'bg-destructive/10 text-destructive animate-pulse'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              )}
            >
              {isListening ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
            </button>

            <p className="text-lg font-medium mb-2">
              {isListening ? 'Listening...' : 'Tap to start speaking'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isListening ? 'Speak the German phrase clearly' : 'Press the button and speak'}
            </p>

            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50"
              >
                <p className="text-sm text-muted-foreground mb-1">Your speech:</p>
                <p className="font-medium">{transcript}</p>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {showResult && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Pronunciation Feedback</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Accuracy', value: results[results.length - 1].accuracy },
                    { label: 'Fluency', value: results[results.length - 1].fluency },
                    { label: 'Confidence', value: Math.min(100, results[results.length - 1].accuracy + 5) },
                  ].map((metric, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-bold text-primary">{metric.value}%</div>
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                      <Progress value={metric.value} size="sm" className="mt-2" />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    'Good pronunciation of "Hallo"',
                    'Try to emphasize the "ch" sound in "ich"',
                    'Speak with more confidence',
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      {i === 0 ? (
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                      )}
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button onClick={nextPrompt} fullWidth size="lg">
              Next Prompt
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </div>
    </AppShell>
  )
}
