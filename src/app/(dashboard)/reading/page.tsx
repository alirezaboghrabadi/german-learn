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
  BookMarked,
  Volume2,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Search,
  BookOpen,
  GraduationCap,
  Lightbulb,
} from 'lucide-react'

interface ReadingArticle {
  id: string
  title: string
  level: string
  wordCount: number
  content: string
  vocabulary: Array<{ word: string; translation: string }>
  questions: Array<{ question: string; options: string[]; correct: number }>
}

const articles: ReadingArticle[] = [
  {
    id: '1',
    title: 'Mein Tag',
    level: 'A1',
    wordCount: 120,
    content: `Hallo! Ich bin Anna und ich bin 20 Jahre alt. Ich wohne in München. Jeden Tag stehe ich um 7 Uhr auf. Ich frühstücke um 7:30 Uhr. Ich esse Brot und trinke Kaffee. Dann gehe ich zur Universität. Ich studiere Biologie. Um 12 Uhr esse ich zu Mittag. Am Nachmittag lerne ich in der Bibliothek. Um 18 Uhr gehe ich nach Hause. Am Abend koche ich Abendessen und sehe fern. Um 22 Uhr gehe ich ins Bett. Das ist mein Tag!`,
    vocabulary: [
      { word: 'aufstehen', translation: 'to get up' },
      { word: 'frühstücken', translation: 'to have breakfast' },
      { word: 'zu Mittag essen', translation: 'to have lunch' },
      { word: 'nach Hause', translation: 'homewards' },
      { word: 'Abendessen', translation: 'dinner' },
      { word: 'ins Bett gehen', translation: 'to go to bed' },
    ],
    questions: [
      { question: 'Wie alt ist Anna?', options: ['18', '20', '22', '25'], correct: 1 },
      { question: 'Wo wohnt Anna?', options: ['Berlin', 'Hamburg', 'München', 'Köln'], correct: 2 },
      { question: 'Was studiert Anna?', options: ['Medizin', 'Jura', 'Biologie', 'Informatik'], correct: 2 },
      { question: 'Wann geht Anna ins Bett?', options: ['21 Uhr', '22 Uhr', '23 Uhr', '24 Uhr'], correct: 1 },
    ],
  },
  {
    id: '2',
    title: 'Der Wochenmarkt',
    level: 'A2',
    wordCount: 180,
    content: `Jeden Samstag gehe ich mit meiner Familie auf den Wochenmarkt. Der Markt ist in der Altstadt und beginnt um 8 Uhr morgens. Es gibt viele Stände mit frischem Obst und Gemüse. Mein Bruder kauft immer Äpfel und Birnen. Ich mag besonders die Erdbeeren im Sommer. Meine Mutter kauft Brot und Käse beim Bäcker. Der Bäcker heißt Müller und sein Brot ist sehr lecker. Wir kaufen auch Blumen für das Wohnzimmer. Der Markt schließt um 14 Uhr.`,
    vocabulary: [
      { word: 'der Wochenmarkt', translation: 'weekly market' },
      { word: 'die Altstadt', translation: 'old town' },
      { word: 'der Stand', translation: 'stall' },
      { word: 'das Obst', translation: 'fruit' },
      { word: 'das Gemüse', translation: 'vegetables' },
      { word: 'der Bäcker', translation: 'baker' },
    ],
    questions: [
      { question: 'Wann beginnt der Markt?', options: ['6 Uhr', '7 Uhr', '8 Uhr', '9 Uhr'], correct: 2 },
      { question: 'Was kauft der Bruder?', options: ['Erdbeeren', 'Äpfel', 'Brot', 'Blumen'], correct: 1 },
      { question: 'Wie heißt der Bäcker?', options: ['Schmidt', 'Müller', 'Weber', 'Fischer'], correct: 1 },
    ],
  },
]

export default function ReadingPage() {
  const [currentArticle, setCurrentArticle] = useState(0)
  const [selectedVocab, setSelectedVocab] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)

  const article = articles[currentArticle]
  const allAnswered = article.questions.length === Object.keys(answers).length
  const score = allAnswered
    ? article.questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0)
    : 0

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reading</h1>
            <p className="text-muted-foreground mt-1">Improve reading comprehension</p>
          </div>
          <Badge variant="primary" size="lg">
            <BookOpen className="h-4 w-4 mr-1" />
            {article.wordCount} words
          </Badge>
        </div>

        {/* Level & Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="accent">{article.level}</Badge>
            <span className="text-sm text-muted-foreground">{article.title}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setCurrentArticle((prev) => Math.max(0, prev - 1)); setAnswers({}); setShowResults(false) }}
              disabled={currentArticle === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setCurrentArticle((prev) => Math.min(articles.length - 1, prev + 1)); setAnswers({}); setShowResults(false) }}
              disabled={currentArticle === articles.length - 1}
            >
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Article */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
              {article.content.split('\n').filter(Boolean).map((paragraph, i) => (
                <p key={i} className="mb-4 text-foreground/90">
                  {paragraph.split(' ').map((word, j) => {
                    const vocabWord = article.vocabulary.find((v) => v.word === word.replace(/[.!?,]/g, ''))
                    return vocabWord ? (
                      <span
                        key={j}
                        onClick={() => setSelectedVocab(selectedVocab === word ? null : word)}
                        className="cursor-pointer text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all"
                      >
                        {word}{' '}
                      </span>
                    ) : (
                      <span key={j}>{word}{' '}</span>
                    )
                  })}
                </p>
              ))}
            </div>

            {/* Vocabulary Popup */}
            {selectedVocab && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
              >
                {(() => {
                  const vocab = article.vocabulary.find((v) => v.word === selectedVocab.replace(/[.!?,]/g, ''))
                  return vocab ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-primary">{vocab.word}</p>
                        <p className="text-sm text-muted-foreground">{vocab.translation}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : null
                })()}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Comprehension Questions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Comprehension Questions</h3>
            <div className="space-y-4">
              {article.questions.map((q, i) => (
                <div key={i}>
                  <p className="font-medium text-sm mb-2">{i + 1}. {q.question}</p>
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
                          !answers?.[i] && 'border-border hover:border-primary/30'
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
                <p className="text-2xl font-bold text-primary">{score}/{article.questions.length}</p>
                <p className="text-sm text-muted-foreground">Questions correct</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
