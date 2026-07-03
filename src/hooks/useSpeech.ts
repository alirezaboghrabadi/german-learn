'use client'

import { useState, useCallback, useRef } from 'react'
import { SpeakingResult } from '@/types'

interface UseSpeechProps {
  language?: string
  continuous?: boolean
  interimResults?: boolean
}

interface UseSpeechReturn {
  isListening: boolean
  isSupported: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  speak: (text: string, rate?: number, pitch?: number) => void
  evaluate: (expected: string) => SpeakingResult
  error: string | null
}

export function useSpeech({
  language = 'de-DE',
  continuous = false,
  interimResults = true,
}: UseSpeechProps = {}): UseSpeechReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) &&
    'speechSynthesis' in window

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser')
      return
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.lang = language
      recognition.continuous = continuous
      recognition.interimResults = interimResults

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.results[event.results.length - 1]
        if (current.isFinal) {
          setTranscript(current[0].transcript)
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(`Speech recognition error: ${event.error}`)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
      setIsListening(true)
      setError(null)
    } catch (err) {
      setError(`Failed to start speech recognition: ${err}`)
    }
  }, [language, continuous, interimResults, isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [])

  const speak = useCallback(
    (text: string, rate: number = 0.9, pitch: number = 1) => {
      if (!isSupported) {
        setError('Speech synthesis is not supported in this browser')
        return
      }

      try {
        synthRef.current = window.speechSynthesis
        if (synthRef.current.speaking) {
          synthRef.current.cancel()
        }

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = language
        utterance.rate = rate
        utterance.pitch = pitch

        // Try to find a German voice
        const voices = synthRef.current.getVoices()
        const germanVoice = voices.find(
          (voice) => voice.lang.startsWith('de') && voice.name.includes('Google')
        ) || voices.find((voice) => voice.lang.startsWith('de'))

        if (germanVoice) {
          utterance.voice = germanVoice
        }

        synthRef.current.speak(utterance)
        setError(null)
      } catch (err) {
        setError(`Failed to speak: ${err}`)
      }
    },
    [language, isSupported]
  )

  const evaluate = useCallback(
    (expected: string): SpeakingResult => {
      const userText = transcript.toLowerCase().trim()
      const expectedText = expected.toLowerCase().trim()

      // Simple accuracy calculation
      const userWords = userText.split(/\s+/)
      const expectedWords = expectedText.split(/\s+/)

      let correct = 0
      const pronunciationErrors: string[] = []

      expectedWords.forEach((word, index) => {
        if (userWords[index] === word) {
          correct++
        } else if (userWords[index]) {
          pronunciationErrors.push(`Expected "${word}", got "${userWords[index]}"`)
        }
      })

      const accuracy = expectedWords.length > 0
        ? Math.round((correct / expectedWords.length) * 100)
        : 0

      const suggestions: string[] = []
      if (accuracy < 50) {
        suggestions.push('Try speaking more slowly and clearly')
        suggestions.push('Practice the individual words first')
      } else if (accuracy < 80) {
        suggestions.push('Good effort! Focus on the words you missed')
      } else {
        suggestions.push('Excellent! Great pronunciation')
      }

      const fluency = Math.min(100, Math.round((userWords.length / expectedWords.length) * 100))
      const confidence = Math.min(100, Math.round(accuracy * 0.7 + fluency * 0.3))

      return {
        transcript,
        accuracy,
        fluency,
        confidence,
        suggestions,
        pronunciation_errors: pronunciationErrors,
      }
    },
    [transcript]
  )

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    speak,
    evaluate,
    error,
  }
}
