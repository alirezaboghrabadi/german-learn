'use client'

import { useState, useRef, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import {
  Sparkles,
  Send,
  Bot,
  User,
  Volume2,
  Copy,
  RefreshCw,
  BookOpen,
  GraduationCap,
  Pen,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  ChevronRight,
} from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  corrections?: string[]
}

const suggestions = [
  { icon: BookOpen, label: 'Explain grammar', query: 'Can you explain how the accusative case works in German?' },
  { icon: MessageSquare, label: 'Practice dialogue', query: 'Let me practice a dialogue about ordering food' },
  { icon: HelpCircle, label: 'Correct my sentence', query: 'Can you correct this: "Ich geht nach Schule"?' },
  { icon: Lightbulb, label: 'Generate exercise', query: 'Create a short exercise for A1 level verb conjugation' },
]

export default function AiTutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hallo! 👋 I\'m your AI German tutor. I can help you with grammar, vocabulary, pronunciation, conversation practice, and more. What would you like to work on today?',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'accusative': 'Great question! The **accusative case** (Akkusativ) is used for the **direct object** in a sentence.\n\n**Rule:**\n- der → den\n- die → die\n- das → das\n- die (plural) → die\n\n**Examples:**\n- Ich sehe **den** Tisch (I see the table)\n- Ich habe **die** Blume (I have the flower)\n- Ich lese **das** Buch (I read the book)\n\nWould you like to practice with some exercises?',
        'food': 'Great choice! Let\'s practice ordering food. I\'ll be the waiter, you be the customer.\n\n**Waiter:** Guten Abend! Was möchten Sie bestellen?\n\nTry responding! You can say something like:\n- "Ich hätte gerne..." (I would like...)\n- "Für mich bitte..." (For me please...)',
        'sentence': 'Let me correct your sentence: "Ich geht nach Schule"\n\n**Corrections:**\n1. "geht" → "gehe" (ich → first person)\n2. "nach Schule" → "zur Schule" (zu + der = zur)\n\n**Correct version:**\n**Ich gehe zur Schule.**\n\n**Explanation:**\n- "Ich" takes the first person verb form "gehe"\n- "zu der Schule" contracts to "zur Schule"',
        'exercise': 'Here\'s an A1 verb conjugation exercise!\n\n**Fill in the blanks with the correct form of the verb:**\n\n1. Ich ___ (sein) müde.\n2. Du ___ (haben) ein Buch.\n3. Er ___ (kommen) aus Berlin.\n4. Wir ___ (spielen) Fußball.\n5. Ihr ___ (lernen) Deutsch.\n\nTry answering and I\'ll check your responses!',
      }

      let responseContent = 'That\'s a great topic! Let me help you with that. Could you provide more details about what specifically you\'d like to learn?'
      
      for (const [key, response] of Object.entries(responses)) {
        if (input.toLowerCase().includes(key)) {
          responseContent = response
          break
        }
      }

      const aiMessage: Message = { role: 'assistant', content: responseContent }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Tutor</h1>
              <p className="text-xs text-muted-foreground">Powered by advanced language AI</p>
            </div>
            <Badge variant="secondary" size="sm" className="ml-auto">
              <Bot className="h-3 w-3 mr-1" />
              Beta
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-hide">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              )}
              <div className={cn(
                'max-w-[80%] rounded-2xl p-4',
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface-50 dark:bg-surface-800/50'
              )}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j} className={cn(j > 0 && 'mt-2', 'whitespace-pre-wrap')}>
                      {line}
                    </p>
                  ))}
                </div>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                    <button className="btn-ghost p-1.5">
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                    <button className="btn-ghost p-1.5">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button className="btn-ghost p-1.5">
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-surface-200 dark:bg-surface-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="rounded-2xl p-4 bg-surface-50 dark:bg-surface-800/50">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce animation-delay-100" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce animation-delay-200" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-4 sm:px-6 pb-4">
            <p className="text-xs text-muted-foreground mb-3">Suggested topics:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(suggestion.query); handleSend() }}
                  className="flex items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-surface-50 dark:hover:bg-surface-800 transition-all text-left text-sm"
                >
                  <suggestion.icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="truncate">{suggestion.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 sm:p-6 border-t border-border bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <Input
              placeholder="Ask your AI tutor anything about German..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} loading={isLoading} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
