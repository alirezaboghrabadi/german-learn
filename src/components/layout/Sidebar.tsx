'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { useApp } from '@/contexts/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  BookOpen,
  Volume2,
  Mic,
  BookMarked,
  Pen,
  MessageSquare,
  Brain,
  Award,
  Zap,
  Settings,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  BarChart3,
  Calendar,
  Library,
  Edit3,
  Headphones,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <Home className="h-5 w-5" /> },
  { label: 'Learn', href: '/learn', icon: <BookOpen className="h-5 w-5" />, badge: 'Continue' },
  { label: 'Vocabulary', href: '/vocabulary', icon: <Library className="h-5 w-5" /> },
  { label: 'Grammar', href: '/grammar', icon: <GraduationCap className="h-5 w-5" /> },
  { label: 'Listening', href: '/listening', icon: <Headphones className="h-5 w-5" /> },
  { label: 'Speaking', href: '/speaking', icon: <Mic className="h-5 w-5" /> },
  { label: 'Reading', href: '/reading', icon: <BookMarked className="h-5 w-5" /> },
  { label: 'Writing', href: '/writing', icon: <Edit3 className="h-5 w-5" /> },
  { label: 'AI Tutor', href: '/ai-tutor', icon: <Sparkles className="h-5 w-5" />, badge: 'AI' },
  { label: 'Review', href: '/review', icon: <Brain className="h-5 w-5" /> },
]

const bottomNavItems: NavItem[] = [
  { label: 'Challenges', href: '/challenges', icon: <Zap className="h-5 w-5" /> },
  { label: 'Achievements', href: '/achievements', icon: <Award className="h-5 w-5" /> },
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 className="h-5 w-5" /> },
  { label: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
]

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { state } = useApp()

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        initial={{ width: collapsed ? 72 : 260 }}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 h-screen z-40 flex flex-col',
          'bg-white/80 dark:bg-surface-900/80 backdrop-blur-2xl',
          'border-r border-border',
          'overflow-hidden'
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center h-16 px-4 border-b border-border', collapsed && 'justify-center')}>
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-bold text-lg gradient-text"
              >
                GermanLearn
              </motion.span>
            )}
          </Link>
        </div>

        {/* User Level */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm',
                'bg-gradient-to-br',
                state.currentLevel === 'A0' && 'from-amber-400 to-orange-500',
                state.currentLevel === 'A1' && 'from-emerald-400 to-teal-500',
                state.currentLevel === 'A2' && 'from-blue-400 to-indigo-500',
                state.currentLevel === 'B1' && 'from-violet-400 to-purple-500',
                state.currentLevel === 'B2' && 'from-pink-400 to-rose-500',
              )}>
                {state.currentLevel}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{state.user?.display_name || 'Learner'}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{state.xp.toLocaleString()} XP</span>
                  <span>·</span>
                  <span>🔥 {state.streakDays}d</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide py-3">
          <div className="px-3 space-y-1">
            {!collapsed && (
              <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Learning
              </p>
            )}
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground/70 hover:text-foreground hover:bg-surface-100 dark:hover:bg-surface-800',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={cn('flex-shrink-0', isActive && 'text-primary')}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="tag-primary text-[10px] px-1.5 py-0.5">{item.badge}</span>
                  )}
                  {collapsed && isActive && (
                    <span className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-border py-2 px-3 space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground/70 hover:text-foreground hover:bg-surface-100 dark:hover:bg-surface-800',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                <span className={cn('flex-shrink-0', isActive && 'text-primary')}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Collapse Button */}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center h-10 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </motion.aside>
    </AnimatePresence>
  )
}
