'use client'

import { useState, useCallback } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  Search,
  Plus,
  Volume2,
  Heart,
  AlertTriangle,
  Star,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { vocabularyData } from '@/data/vocabulary-data'

interface VocabDisplay {
  id: string
  german: string
  article: string
  ipa: string
  english: string
  persian: string
  level: string
  mastered: boolean
  favorited: boolean
  difficult: boolean
}

export default function VocabularyPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'mastered' | 'favorites' | 'difficult'>('all')
  const [items, setItems] = useState<VocabDisplay[]>(() =>
    vocabularyData.map(v => ({
      id: v.id, german: v.article + ' ' + v.german, article: v.article,
      ipa: v.ipa, english: v.english, persian: v.persian, level: v.level,
      mastered: false, favorited: false, difficult: false,
    }))
  )

  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'de-DE'
    utterance.rate = 0.85
    speechSynthesis.cancel()
    speechSynthesis.speak(utterance)
  }, [])

  const toggleFav = useCallback((id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, favorited: !i.favorited } : i))
  }, [])

  const toggleDiff = useCallback((id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, difficult: !i.difficult } : i))
  }, [])

  const filteredItems = items.filter((item) => {
    if (filter === 'mastered' && !item.mastered) return false
    if (filter === 'favorites' && !item.favorited) return false
    if (filter === 'difficult' && !item.difficult) return false
    if (search) {
      const q = search.toLowerCase()
      if (!item.german.toLowerCase().includes(q) && !item.english.toLowerCase().includes(q) && !item.persian.includes(q)) return false
    }
    return true
  })

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Vocabulary Notebook</h1>
            <p className="text-muted-foreground mt-1">{items.length} words · A0-B2</p>
          </div>
          <Button onClick={() => { const word = prompt('Enter a German word to add:'); if (word) alert('Word saved locally! (Database sync coming soon)') }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Word
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total', value: items.length, icon: BookOpen, color: 'text-primary' },
            { label: 'Mastered', value: items.filter((v) => v.mastered).length, icon: Star, color: 'text-accent' },
            { label: 'Favorites', value: items.filter((v) => v.favorited).length, icon: Heart, color: 'text-destructive' },
            { label: 'Difficult', value: items.filter((v) => v.difficult).length, icon: AlertTriangle, color: 'text-warning' },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search vocabulary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'mastered', 'favorites', 'difficult'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface-50 dark:bg-surface-800 text-foreground/70 hover:text-foreground'
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredItems.slice(0, 100).map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm',
                    item.article === 'der' && 'bg-blue-500',
                    item.article === 'die' && 'bg-pink-500',
                    item.article === 'das' && 'bg-green-500',
                  )}>
                    {item.article}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.german}</span>
                      <span className="text-xs text-muted-foreground">{item.ipa}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.english} · {item.persian}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="btn-ghost p-2" onClick={() => speak(item.german)} title="Hear pronunciation">
                      <Volume2 className="h-4 w-4" />
                    </button>
                    <button
                      className={cn('btn-ghost p-2', item.favorited && 'text-destructive')}
                      onClick={() => toggleFav(item.id)}
                      title="Toggle favorite"
                    >
                      <Heart className={cn('h-4 w-4', item.favorited && 'fill-current')} />
                    </button>
                    <button
                      className={cn('btn-ghost p-2', item.difficult && 'text-warning')}
                      onClick={() => toggleDiff(item.id)}
                      title="Toggle difficult"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </button>
                    <Badge variant={item.mastered ? 'accent' : 'outline'}>{item.level}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {filteredItems.length > 100 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Showing 100 of {filteredItems.length} results. Use search to narrow down.
            </p>
          )}
        </div>
      </motion.div>
    </AppShell>
  )
}
