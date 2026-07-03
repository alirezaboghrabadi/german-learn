'use client'

import { useApp } from '@/contexts/AppContext'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import {
  Sun,
  Moon,
  Menu,
  Bell,
  Flame,
  Coins,
  Trophy,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { state } = useApp()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden btn-ghost p-2"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},
            </span>
            <span className="text-sm font-medium">
              {state.user?.display_name || 'Learner'}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Streak */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-50 dark:bg-surface-800 text-sm">
            <Flame className="h-4 w-4 text-warning" />
            <span className="font-semibold">{state.streakDays}</span>
          </div>

          {/* Coins */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-50 dark:bg-surface-800 text-sm">
            <Coins className="h-4 w-4 text-warning" />
            <span className="font-semibold">{state.coins.toLocaleString()}</span>
          </div>

          {/* XP */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl gradient-primary text-white text-sm">
            <Trophy className="h-4 w-4" />
            <span className="font-semibold">{state.xp.toLocaleString()} XP</span>
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn-ghost p-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}

          {/* Notifications */}
          <button className="btn-ghost p-2 relative" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </button>

          {/* Avatar */}
          <div className="hidden sm:block ml-1">
            <Avatar
              src={state.user?.avatar_url}
              name={state.user?.display_name}
              size="sm"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
