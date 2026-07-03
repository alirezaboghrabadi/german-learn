'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  Volume2,
  XCircle,
  ChevronRight,
  Headphones,
  Mic,
  Sun,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { vocabularyData } from '@/data/vocabulary-data'

type StepType = 'vocabulary' | 'pronunciation' | 'grammar' | 'examples' | 'audio' | 'exercise' | 'mini-quiz' | 'summary'

interface LessonStep {
  type: StepType
  title: string
}

const lessonSteps: LessonStep[] = [
  { type: 'vocabulary', title: 'Key Vocabulary' },
  { type: 'pronunciation', title: 'Pronunciation' },
  { type: 'grammar', title: 'Grammar Point' },
  { type: 'examples', title: 'Examples' },
  { type: 'audio', title: 'Audio Practice' },
  { type: 'exercise', title: 'Exercise' },
  { type: 'mini-quiz', title: 'Mini Quiz' },
  { type: 'summary', title: 'Lesson Summary' },
]

const A0_WORDS = vocabularyData.filter(v => v.level === 'A0').slice(0, 8)
const LESSON_WORDS = [...A0_WORDS].sort(() => Math.random() - 0.5).slice(0, 4)

const quizQuestions = LESSON_WORDS.map((w, i) => {
  const wrong = vocabularyData.filter(v => v.level === 'A0' && v.id !== w.id).sort(() => Math.random() - 0.5).slice(0, 3)
  const options = [w.english, ...wrong.map(x => x.english)].sort(() => Math.random() - 0.5)
  const correct = options.indexOf(w.english)
  return {
    question: `What does "${w.german}" mean?`,
    options,
    correct,
  }
})

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResult, setShowResult] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const step = lessonSteps[currentStep]
  const progress = ((currentStep + 1) / lessonSteps.length) * 100
  const isLastStep = currentStep === lessonSteps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      setIsComplete(true)
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, lessonSteps.length - 1))
    }
  }

  const handleQuizAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }))
  }

  const speak = useCallback((text: string, lang = 'de-DE', rate = 0.85) => {
    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate
    speechSynthesis.speak(utterance)
  }, [])

  const isQuizComplete = Object.keys(answers).length === quizQuestions.length

  const quizScore = isQuizComplete
    ? quizQuestions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0)
    : 0

  const renderStep = () => {
    switch (step.type) {
      case 'vocabulary':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground mb-4">Learn these essential German words:</p>
            <div className="grid gap-3">
              {LESSON_WORDS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold">{item.german}</p>
                      <p className="text-xs text-muted-foreground">{item.ipa}</p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div>
                      <p className="text-sm">{item.english}</p>
                      <p className="text-xs text-muted-foreground" dir="rtl">{item.persian}</p>
                    </div>
                  </div>
                   <button className="btn-ghost p-2" onClick={() => speak(item.german)}>
                     <Volume2 className="h-4 w-4" />
                   </button>
                 </motion.div>
               ))}
             </div>
           </div>
         )

       case 'pronunciation':
         return (
           <div className="space-y-6">
             <div className="text-center p-8 rounded-2xl bg-surface-50 dark:bg-surface-800/50">
               <Mic className="h-12 w-12 text-primary mx-auto mb-4" />
               <h3 className="text-lg font-semibold mb-2">Practice Pronunciation</h3>
               <p className="text-muted-foreground mb-6">Click the button and speak the word clearly</p>
               <div className="flex items-center justify-center gap-4">
                 <Button variant="primary" size="lg" onClick={() => {
                   if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                     const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
                     const rec = new SR()
                     rec.lang = 'de-DE'
                     rec.onresult = (e: any) => alert(`You said: ${e.results[0][0].transcript}`)
                     rec.start()
                   } else { alert('Speech recognition not supported in this browser. Try Chrome.') }
                 }}>
                   <Mic className="h-5 w-5 mr-2" />
                   Start Speaking
                 </Button>
                 <Button variant="outline" size="lg" onClick={() => speak(LESSON_WORDS.map(w => w.german).join(', '))}>
                   <Volume2 className="h-5 w-5 mr-2" />
                   Hear It
                 </Button>
               </div>
             </div>
             <div className="grid grid-cols-2 gap-3">
               {LESSON_WORDS.map((w) => (
                 <div key={w.id} className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 flex items-center justify-between">
                   <span className="font-medium">{w.german}</span>
                   <button className="btn-ghost p-1" onClick={() => speak(w.german)}>
                     <Volume2 className="h-4 w-4 text-muted-foreground" />
                   </button>
                 </div>
               ))}
             </div>
           </div>
         )

      case 'grammar':
        return (
          <div className="space-y-4">
            <Card glass>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2">Formal vs Informal Greetings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  In German, you use different greetings depending on the time of day and your relationship with the person.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                    <p className="text-sm font-medium">Informal</p>
                    <p className="text-xs text-muted-foreground">Friends & Family</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>Hallo</li>
                      <li>Tschüss</li>
                      <li>Servus</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                    <p className="text-sm font-medium">Formal</p>
                    <p className="text-xs text-muted-foreground">Strangers & Work</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>Guten Tag</li>
                      <li>Auf Wiedersehen</li>
                      <li>Grüß Gott</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'examples':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">See how these words are used in context:</p>
             {LESSON_WORDS.filter(w => w.example_sentence_de).map((w, i) => (
               <motion.div
                 key={w.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.15 }}
                 className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50"
               >
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="font-semibold">{w.example_sentence_de}</p>
                     <p className="text-sm text-muted-foreground">{w.example_sentence_en}</p>
                     <p className="text-xs text-muted-foreground mt-1" dir="rtl">{w.example_sentence_fa}</p>
                   </div>
                   <button className="btn-ghost p-2" onClick={() => speak(w.example_sentence_de)}>
                     <Volume2 className="h-4 w-4" />
                   </button>
                 </div>
               </motion.div>
             ))}
             {LESSON_WORDS.filter(w => !w.example_sentence_de).slice(0, 3 - LESSON_WORDS.filter(w => w.example_sentence_de).length).map((w, i) => (
               <motion.div key={w.id + i} className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="font-semibold">{w.german} ist ein wichtiges Wort.</p>
                     <p className="text-sm text-muted-foreground">{w.german} is an important word.</p>
                   </div>
                   <button className="btn-ghost p-2" onClick={() => speak(`${w.german} ist ein wichtiges Wort.`)}>
                     <Volume2 className="h-4 w-4" />
                   </button>
                 </div>
               </motion.div>
             ))}
          </div>
        )

      case 'audio':
        return (
          <div className="space-y-6">
            <div className="text-center p-8 rounded-2xl bg-surface-50 dark:bg-surface-800/50">
              <Headphones className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Listen & Repeat</h3>
              <p className="text-muted-foreground mb-6">Listen to the native pronunciation and repeat</p>
               <div className="flex items-center justify-center gap-3">
                 <Button variant="primary" size="lg" onClick={() => speak(LESSON_WORDS.map(w => w.german).join('. '))}>
                   <Volume2 className="h-5 w-5 mr-2" />
                   Normal Speed
                 </Button>
                 <Button variant="outline" size="lg" onClick={() => speak(LESSON_WORDS.map(w => w.german).join('. '), 'de-DE', 0.55)}>
                   <Headphones className="h-5 w-5 mr-2" />
                   Slow Mode
                 </Button>
               </div>
             </div>
             <div className="space-y-2">
               {LESSON_WORDS.map((w) => (
                 <div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                   <span className="font-medium">{w.german}</span>
                   <div className="flex gap-2">
                     <button className="btn-ghost p-1.5" onClick={() => speak(w.german)}>
                       <Volume2 className="h-4 w-4" />
                     </button>
                     <button className="btn-ghost p-1.5" onClick={() => {
                       if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                         const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
                         const rec = new SR()
                         rec.lang = 'de-DE'
                         rec.onresult = (e: any) => {
                           const said = e.results[0][0].transcript.toLowerCase()
                           const correct = w.german.toLowerCase()
                           if (said.includes(correct) || correct.includes(said)) {
                             alert('Great pronunciation! 🎉')
                           } else {
                             alert(`You said: "${e.results[0][0].transcript}". Try again!`)
                           }
                         }
                         rec.start()
                       } else { alert('Speech recognition not supported in this browser.') }
                     }}>
                       <Mic className="h-4 w-4" />
                     </button>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )

      case 'exercise':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">Match the German words with their English meanings:</p>
            {[
              { german: 'Hallo', options: ['Hello', 'Goodbye', 'Thank you'], correct: 0 },
              { german: 'Tschüss', options: ['Good morning', 'Bye', 'Please'], correct: 1 },
              { german: 'Danke', options: ['Sorry', 'Thank you', 'Yes'], correct: 1 },
            ].map((ex, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                <p className="font-semibold mb-2">{ex.german}</p>
                <div className="flex gap-2">
                  {ex.options.map((opt, j) => (
                    <button
                      key={j}
                      onClick={() => handleQuizAnswer(i, j)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
                        answers[i] === j
                          ? answers[i] === ex.correct
                            ? 'bg-accent/10 border-accent text-accent'
                            : 'bg-destructive/10 border-destructive text-destructive'
                          : 'border-border hover:border-primary/30'
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )

      case 'mini-quiz':
        return (
          <div className="space-y-6">
            {showResult ? (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="text-center p-8"
              >
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                <p className="text-muted-foreground mb-4">
                  You got {quizScore} out of {quizQuestions.length} correct
                </p>
                <div className="text-4xl font-bold text-primary mb-4">
                  {quizScore}/{quizQuestions.length}
                </div>
                <Progress value={(quizScore / quizQuestions.length) * 100} size="lg" />
              </motion.div>
            ) : (
              <div className="space-y-6">
                {quizQuestions.map((q, i) => (
                  <div key={i} className="space-y-3">
                    <p className="font-medium">
                      {i + 1}. {q.question}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, j) => {
                        const selected = answers[i] === j
                        return (
                          <button
                            key={j}
                            onClick={() => handleQuizAnswer(i, j)}
                            className={cn(
                              'p-3 rounded-xl text-sm font-medium transition-all border',
                              selected
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:border-primary/30'
                            )}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
                {isQuizComplete && (
                  <Button onClick={() => setShowResult(true)} fullWidth>
                    See Results
                  </Button>
                )}
              </div>
            )}
          </div>
        )

      case 'summary':
        return (
          <div className="space-y-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Great Progress!</h3>
              <p className="text-muted-foreground">You&apos;ve completed this lesson. Here&apos;s what you learned:</p>
            </div>
            <div className="grid gap-3">
              {[
                { label: 'New Words', value: '4 words' },
                { label: 'Grammar', value: 'Formal vs Informal' },
                { label: 'XP Earned', value: '+20 XP', highlight: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={cn('text-sm font-medium', item.highlight && 'text-primary')}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
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
            <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Lesson Complete!</h1>
            <p className="text-muted-foreground mb-8">You earned 20 XP and 5 coins</p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">+20</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">+5</p>
                <p className="text-xs text-muted-foreground">Coins</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">🔥 1</p>
                <p className="text-xs text-muted-foreground">Streak</p>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push('/learn')} variant="outline">
                Back to Path
              </Button>
              <Button onClick={() => { setCurrentStep(0); setAnswers({}); setShowResult(false); setIsComplete(false) }}>
                Next Lesson
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Top Bar */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="btn-ghost p-2">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                {step.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {currentStep + 1} / {lessonSteps.length}
              </span>
            </div>
            <Progress value={progress} size="sm" />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-bold mb-4">{step.title}</h2>
                {renderStep()}
              </CardContent>
            </Card>
            </motion.div>
        </AnimatePresence>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-t border-border">
        <div className="max-w-3xl mx-auto flex justify-end">
          <Button onClick={handleNext} size="lg">
            {isLastStep ? 'Complete Lesson' : 'Continue'}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  </AppShell>
)
}
