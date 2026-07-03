'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseAudioProps {
  onEnded?: () => void
  onError?: (error: string) => void
}

interface UseAudioReturn {
  isPlaying: boolean
  isPaused: boolean
  duration: number
  currentTime: number
  volume: number
  play: (url?: string) => void
  pause: () => void
  resume: () => void
  stop: () => void
  setVolume: (volume: number) => void
  seek: (time: number) => void
  setSpeed: (speed: number) => void
  slowPlay: (url: string) => void
  normalPlay: (url: string) => void
  loading: boolean
  error: string | null
}

export function useAudio(props: UseAudioProps = {}): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentUrlRef = useRef<string>('')
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.preload = 'auto'

    const audio = audioRef.current

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
      setLoading(false)
    })

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
    })

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentTime(0)
      props.onEnded?.()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    })

    audio.addEventListener('error', () => {
      setError('Failed to load audio')
      setLoading(false)
      setIsPlaying(false)
    })

    audio.addEventListener('canplaythrough', () => {
      setLoading(false)
    })

    return () => {
      audio.pause()
      audio.src = ''
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const play = useCallback(
    (url?: string) => {
      const audio = audioRef.current
      if (!audio) return

      const targetUrl = url || currentUrlRef.current
      if (!targetUrl) {
        setError('No audio URL provided')
        return
      }

      if (url && url !== currentUrlRef.current) {
        currentUrlRef.current = url
        audio.src = url
        audio.load()
        setLoading(true)
      }

      audio.play().then(() => {
        setIsPlaying(true)
        setIsPaused(false)
        setError(null)
      }).catch((err) => {
        setError(`Failed to play audio: ${err.message}`)
      })
    },
    []
  )

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      setIsPaused(true)
      setIsPlaying(false)
    }
  }, [])

  const resume = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.play().then(() => {
        setIsPlaying(true)
        setIsPaused(false)
      }).catch((err) => {
        setError(`Failed to resume: ${err.message}`)
      })
    }
  }, [])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      setIsPlaying(false)
      setIsPaused(false)
    }
  }, [])

  const setVolume = useCallback((newVolume: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, newVolume))
      setVolumeState(audio.volume)
    }
  }, [])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = Math.max(0, Math.min(time, duration))
    }
  }, [duration])

  const setSpeed = useCallback((speed: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.playbackRate = Math.max(0.5, Math.min(2, speed))
    }
  }, [])

  const slowPlay = useCallback((url: string) => {
    setSpeed(0.75)
    play(url)
  }, [play, setSpeed])

  const normalPlay = useCallback((url: string) => {
    setSpeed(1)
    play(url)
  }, [play, setSpeed])

  return {
    isPlaying,
    isPaused,
    duration,
    currentTime,
    volume,
    play,
    pause,
    resume,
    stop,
    setVolume,
    seek,
    setSpeed,
    slowPlay,
    normalPlay,
    loading,
    error,
  }
}
