'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import {
  GraduationCap,
  ChevronDown,
  CheckCircle2,
  Lock,
  AlertTriangle,
  Info,
  BookOpen,
} from 'lucide-react'

const grammarTopics = [
  {
    category: 'Nouns & Articles',
    topics: [
      { id: 'gender', title: 'Noun Gender (der/die/das)', level: 'A1', mastered: true, locked: false },
      { id: 'plural', title: 'Plural Forms', level: 'A1', mastered: true, locked: false },
      { id: 'nominative', title: 'Nominative Case', level: 'A1', mastered: false, locked: false },
      { id: 'accusative', title: 'Accusative Case', level: 'A1', mastered: false, locked: false },
      { id: 'dative', title: 'Dative Case', level: 'A2', mastered: false, locked: true },
      { id: 'genitive', title: 'Genitive Case', level: 'B1', mastered: false, locked: true },
    ],
  },
  {
    category: 'Verbs',
    topics: [
      { id: 'present', title: 'Present Tense Conjugation', level: 'A1', mastered: true, locked: false },
      { id: 'sein-haben', title: 'Sein & Haben', level: 'A1', mastered: true, locked: false },
      { id: 'modal', title: 'Modal Verbs (können, müssen, dürfen)', level: 'A1', mastered: false, locked: false },
      { id: 'separable', title: 'Separable Verbs', level: 'A2', mastered: false, locked: false },
      { id: 'perfect', title: 'Perfect Tense', level: 'A2', mastered: false, locked: true },
      { id: 'preterite', title: 'Präteritum (Simple Past)', level: 'B1', mastered: false, locked: true },
    ],
  },
  {
    category: 'Sentence Structure',
    topics: [
      { id: 'word-order', title: 'Basic Word Order', level: 'A1', mastered: true, locked: false },
      { id: 'questions', title: 'Forming Questions', level: 'A1', mastered: false, locked: false },
      { id: 'position', title: 'Verb Position (Satzklammer)', level: 'A2', mastered: false, locked: false },
      { id: 'nebensatz', title: 'Subordinate Clauses', level: 'B1', mastered: false, locked: true },
      { id: 'relativ', title: 'Relative Clauses', level: 'B1', mastered: false, locked: true },
    ],
  },
  {
    category: 'Advanced Topics',
    topics: [
      { id: 'passive', title: 'Passive Voice', level: 'B1', mastered: false, locked: true },
      { id: 'konjunktiv2', title: 'Konjunktiv II', level: 'B1', mastered: false, locked: true },
      { id: 'future', title: 'Future Tense', level: 'A2', mastered: false, locked: true },
      { id: 'adjectives', title: 'Adjective Endings', level: 'A2', mastered: false, locked: true },
    ],
  },
]

export default function GrammarPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Nouns & Articles')
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold">Grammar</h1>
          <p className="text-muted-foreground mt-1">Master German grammar step by step</p>
        </div>

        {/* Overall Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-secondary" />
                <span className="font-semibold">Grammar Mastery</span>
              </div>
              <span className="text-2xl font-bold text-secondary">32%</span>
            </div>
            <Progress value={32} size="lg" barClassName="bg-secondary" />
          </CardContent>
        </Card>

        {/* Grammar Topics */}
        <div className="space-y-4">
          {grammarTopics.map((category) => (
            <Card key={category.category}>
              <button
                onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)}
                className="w-full p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{category.category}</span>
                  <Badge variant="outline" size="sm">
                    {category.topics.filter((t) => t.mastered).length}/{category.topics.length}
                  </Badge>
                </div>
                <ChevronDown className={cn(
                  'h-5 w-5 text-muted-foreground transition-transform',
                  expandedCategory === category.category && 'rotate-180'
                )} />
              </button>

              {expandedCategory === category.category && (
                <div className="px-5 pb-5 space-y-2">
                  {category.topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left',
                        topic.locked ? 'opacity-50' : 'hover:bg-surface-50 dark:hover:bg-surface-800',
                        selectedTopic === topic.id && 'bg-primary/5 border border-primary/20'
                      )}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold',
                        topic.mastered ? 'bg-accent/10 text-accent' : 'bg-surface-100 dark:bg-surface-800 text-muted-foreground'
                      )}>
                        {topic.level}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{topic.title}</span>
                          {topic.mastered && <CheckCircle2 className="h-3.5 w-3.5 text-accent" />}
                          {topic.locked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                        </div>
                      </div>
                      {selectedTopic === topic.id && (
                        <ChevronDown className="h-4 w-4 text-primary -rotate-90" />
                      )}
                    </button>
                  ))}

                  {/* Selected Topic Detail */}
                  {selectedTopic && (
                    <Card glass className="mt-4">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Info className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">
                            {category.topics.find((t) => t.id === selectedTopic)?.title}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          This is a placeholder for the detailed grammar explanation.
                          Each grammar topic includes visual diagrams, examples, exercises,
                          common mistakes, and AI-powered explanations.
                        </p>
                        <div className="space-y-3">
                          <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                            <p className="text-sm font-medium mb-1">Rule</p>
                            <p className="text-sm text-muted-foreground">Grammar rule explanation here</p>
                          </div>
                          <div className="p-3 rounded-xl bg-accent/5 border border-accent/10">
                            <p className="text-sm font-medium text-accent mb-1">Example</p>
                            <p className="text-sm">Example sentence in German</p>
                          </div>
                          <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/10">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                              <p className="text-sm font-medium text-destructive">Common Mistake</p>
                            </div>
                            <p className="text-sm">Common mistake explanation</p>
                          </div>
                        </div>
                        <button className="btn-primary w-full mt-4" onClick={() => window.location.href = '/learn'}>
                          Practice This Topic
                        </button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </motion.div>
    </AppShell>
  )
}
