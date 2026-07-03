'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import {
  Settings,
  Bell,
  Globe,
  Sun,
  Moon,
  Monitor,
  Volume2,
  Mic,
  Brain,
  Clock,
  LogOut,
  User,
  ChevronRight,
  Smartphone,
  Shield,
  MessageSquare,
} from 'lucide-react'

interface SettingSection {
  id: string
  title: string
  icon: React.ReactNode
  items: SettingItem[]
}

interface SettingItem {
  id: string
  label: string
  description: string
  type: 'toggle' | 'select' | 'slider' | 'time' | 'button'
  value?: string | number | boolean
  options?: string[]
}

export default function SettingsPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('language')
  const [settingValues, setSettingValues] = useState<Record<string, string | number | boolean>>({
    'app-lang': 'English', 'target-lang': 'German',
    'study-reminder': true, 'streak-reminder': true, 'daily-challenge': true,
    'achievement-unlock': true, 'review-reminder': true,
    'study-time': '09:00', 'timezone': 'UTC',
    'native-lang': 'Persian', 'proficiency': 'Beginner',
    'theme': 'System', 'sound': 'Normal',
    'daily-goal': '15 min',
  })

  const toggleValue = useCallback((id: string) => {
    setSettingValues(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const handleSignOut = useCallback(async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/login')
    } catch { router.push('/login') }
  }, [router])

  const sections: SettingSection[] = [
    {
      id: 'language',
      title: 'Language & Region',
      icon: <Globe className="h-5 w-5" />,
      items: [
        { id: 'app-lang', label: 'App Language', description: 'Choose your preferred language', type: 'select', value: 'English', options: ['English', 'Persian', 'German'] },
        { id: 'target-lang', label: 'Learning Language', description: 'The language you are learning', type: 'select', value: 'German', options: ['German'] },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      items: [
        { id: 'study-reminder', label: 'Study Reminder', description: 'Daily reminder to study', type: 'toggle', value: true },
        { id: 'streak-reminder', label: 'Streak Reminder', description: 'Reminder to keep your streak', type: 'toggle', value: true },
        { id: 'challenge-alert', label: 'Challenge Alerts', description: 'New challenges available', type: 'toggle', value: true },
        { id: 'review-reminder', label: 'Review Reminder', description: 'When reviews are due', type: 'toggle', value: true },
        { id: 'reminder-time', label: 'Reminder Time', description: 'Preferred time for reminders', type: 'time', value: '09:00' },
      ],
    },
    {
      id: 'theme',
      title: 'Appearance',
      icon: <Sun className="h-5 w-5" />,
      items: [
        { id: 'theme-mode', label: 'Theme', description: 'Choose your theme preference', type: 'select', value: 'System', options: ['Light', 'Dark', 'System'] },
      ],
    },
    {
      id: 'speech',
      title: 'Speech & Audio',
      icon: <Volume2 className="h-5 w-5" />,
      items: [
        { id: 'voice-speed', label: 'Speech Speed', description: 'Speed of audio playback', type: 'select', value: 'Normal', options: ['Slow', 'Normal', 'Fast'] },
        { id: 'auto-play', label: 'Auto-Play Audio', description: 'Automatically play audio for new words', type: 'toggle', value: true },
        { id: 'voice-input', label: 'Voice Input', description: 'Enable speech recognition for speaking exercises', type: 'toggle', value: true },
      ],
    },
    {
      id: 'study',
      title: 'Study Preferences',
      icon: <Brain className="h-5 w-5" />,
      items: [
        { id: 'daily-goal', label: 'Daily Goal', description: 'Minutes to study each day', type: 'select', value: '15 min', options: ['5 min', '10 min', '15 min', '30 min', '60 min'] },
        { id: 'review-limit', label: 'Reviews per Session', description: 'Maximum review items per session', type: 'select', value: '20', options: ['10', '20', '30', '50'] },
        { id: 'hint-level', label: 'Hint Level', description: 'How many hints to show during exercises', type: 'select', value: 'Medium', options: ['None', 'Minimal', 'Medium', 'Full'] },
      ],
    },
    {
      id: 'account',
      title: 'Account',
      icon: <User className="h-5 w-5" />,
      items: [
        { id: 'export', label: 'Export Data', description: 'Download your learning data', type: 'button' },
        { id: 'import', label: 'Import Data', description: 'Import vocabulary from Anki or CSV', type: 'button' },
        { id: 'delete', label: 'Delete Account', description: 'Permanently delete your account', type: 'button' },
      ],
    },
  ]

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold">Settings</h1>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/70 hover:text-foreground hover:bg-surface-50 dark:hover:bg-surface-800'
                )}
              >
                {section.icon}
                <span>{section.title}</span>
              </button>
            ))}

            <hr className="my-4 border-border" />

            <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all">
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-4">
            {sections
              .filter((s) => s.id === activeSection)
              .map((section) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {section.icon}
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {section.items.map((item) => {
                        const currentValue = item.id in settingValues ? settingValues[item.id] : item.value
                        return (
                        <div key={item.id} className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-medium text-sm">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                          {item.type === 'toggle' && (
                            <button
                              onClick={() => toggleValue(item.id)}
                              className={cn(
                                'w-11 h-6 rounded-full transition-colors relative',
                                currentValue ? 'bg-primary' : 'bg-surface-300 dark:bg-surface-600'
                              )}
                            >
                              <span
                                className={cn(
                                  'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                                  currentValue && 'translate-x-5'
                                )}
                              />
                            </button>
                          )}
                          {item.type === 'select' && (
                            <Badge variant="outline" className="cursor-pointer" onClick={() => {
                              const opts = item.options || []
                              const idx = opts.indexOf(currentValue as string)
                              const next = opts[(idx + 1) % opts.length]
                              setSettingValues(prev => ({ ...prev, [item.id]: next }))
                            }}>
                              {currentValue as string}
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Badge>
                          )}
                          {item.type === 'time' && (
                            <span className="text-sm font-medium">{currentValue as string}</span>
                          )}
                          {item.type === 'button' && (
                            <Button variant="outline" size="sm" onClick={() => alert(`${item.label} functionality coming soon!`)}>
                              {item.label === 'Delete Account' ? 'Delete' : item.label === 'Export Data' ? 'Export' : item.label === 'Import Data' ? 'Import' : item.label}
                            </Button>
                          )}
                        </div>
                      )
                    })}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      </motion.div>
    </AppShell>
  )
}
