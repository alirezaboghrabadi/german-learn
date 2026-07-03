'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { BookOpen, Sparkles, Brain, Mic, Headphones, Zap, ArrowRight, Star, Shield, Globe, GraduationCap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-lg gradient-text">GermanLearn</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6">
              <Sparkles className="h-4 w-4 mr-1.5" />
              A0 to B2 German Learning
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance mb-6">
              Master German with{' '}
              <span className="gradient-text">AI-Powered</span>{' '}
              Precision
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
              Personalized lessons, spaced repetition, and an AI tutor that adapts to your learning style.
              From absolute beginner to confident B2 speaker.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="xl" className="text-base px-10">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="text-base">
                See How It Works
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20"
          >
            {[
              { icon: Brain, value: '5000+', label: 'Vocabulary Items' },
              { icon: BookOpen, value: '400+', label: 'Lessons' },
              { icon: Mic, value: '50+', label: 'Grammar Topics' },
              { icon: Star, value: 'B2', label: 'Target Level' },
            ].map((stat, index) => (
              <div key={index} className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50">
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-surface-50 dark:bg-surface-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to Reach B2
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              A complete learning system designed by language experts and powered by AI.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: 'Smart Spaced Repetition', description: 'SM-2 algorithm optimizes review timing for maximum retention' },
              { icon: Sparkles, title: 'AI Tutor', description: 'Personal AI tutor explains grammar, corrects mistakes, and adapts to you' },
              { icon: Mic, title: 'Speech Recognition', description: 'Practice speaking with instant pronunciation feedback' },
              { icon: Headphones, title: 'Listening Practice', description: 'Native audio with slow and normal speed modes' },
              { icon: Zap, title: 'Gamification', description: 'XP, streaks, achievements, and challenges keep you motivated' },
              { icon: Shield, title: 'Offline Mode', description: 'Download lessons and learn anywhere, anytime' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-surface-800 border border-border hover:shadow-lg transition-all"
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl gradient-primary"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start Your German Journey Today
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
              Join learners worldwide and master German from A0 to B2 with our personalized learning system.
            </p>
            <Link href="/signup">
              <Button variant="glass" size="xl" className="text-base text-white border-white/20 hover:bg-white/20">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>GermanLearn - A0 to B2 German Learning Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026 GermanLearn</span>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
