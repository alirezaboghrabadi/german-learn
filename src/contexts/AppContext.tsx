'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react'
import { User, CEFRLevel, NotificationPreference, UserStatistics } from '@/types'

interface AppState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  statistics: UserStatistics | null
  notifications: NotificationPreference
  dailyGoal: number
  currentLevel: CEFRLevel
  xp: number
  coins: number
  streakDays: number
  sidebarOpen: boolean
}

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_XP'; payload: number }
  | { type: 'UPDATE_COINS'; payload: number }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'UPDATE_LEVEL'; payload: CEFRLevel }
  | { type: 'SET_STATISTICS'; payload: UserStatistics }
  | { type: 'SET_NOTIFICATIONS'; payload: NotificationPreference }
  | { type: 'SET_DAILY_GOAL'; payload: number }
  | { type: 'TOGGLE_SIDEBAR' }

const initialState: AppState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  statistics: null,
  notifications: {
    study_reminder: true,
    streak_reminder: true,
    daily_challenge: true,
    achievement_unlock: true,
    review_reminder: true,
    study_time: '09:00',
    timezone: 'UTC',
    sound_enabled: true,
    vibration_enabled: true,
  },
  dailyGoal: 15,
  currentLevel: 'A0',
  xp: 0,
  coins: 0,
  streakDays: 0,
  sidebarOpen: false,
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        currentLevel: action.payload.current_level,
        xp: action.payload.xp,
        coins: action.payload.coins,
        streakDays: action.payload.streak_days,
        dailyGoal: action.payload.daily_goal_minutes,
      }
    case 'CLEAR_USER':
      return { ...initialState, isLoading: false }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'UPDATE_XP':
      return { ...state, xp: state.xp + action.payload }
    case 'UPDATE_COINS':
      return { ...state, coins: state.coins + action.payload }
    case 'UPDATE_STREAK':
      return { ...state, streakDays: action.payload }
    case 'UPDATE_LEVEL':
      return { ...state, currentLevel: action.payload }
    case 'SET_STATISTICS':
      return { ...state, statistics: action.payload }
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload }
    case 'SET_DAILY_GOAL':
      return { ...state, dailyGoal: action.payload }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<Action>
  addXP: (amount: number) => void
  addCoins: (amount: number) => void
  updateLevel: (level: CEFRLevel) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const addXP = useCallback(
    (amount: number) => {
      dispatch({ type: 'UPDATE_XP', payload: amount })
    },
    []
  )

  const addCoins = useCallback(
    (amount: number) => {
      dispatch({ type: 'UPDATE_COINS', payload: amount })
    },
    []
  )

  const updateLevel = useCallback(
    (level: CEFRLevel) => {
      dispatch({ type: 'UPDATE_LEVEL', payload: level })
    },
    []
  )

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (userData) {
            dispatch({ type: 'SET_USER', payload: userData })
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuth()
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch, addXP, addCoins, updateLevel }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
