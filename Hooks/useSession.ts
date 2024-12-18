'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SessionData, SESSION_EXPIRY_HOURS } from '@/utils/type'
import { useSingleRoom } from '@/services/querys'

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if session is valid
  const isValidSession = useCallback((sessionData: SessionData) => {
    if (!sessionData) return false

    const currentTime = Date.now()
    const sessionAge = currentTime - sessionData.joinedAt
    const maxSessionAge = SESSION_EXPIRY_HOURS * 60 * 60 * 1000 // Convert hours to milliseconds

    return sessionAge < maxSessionAge
  }, [])

  // Load and validate session
  useEffect(() => {
    const savedSession = localStorage.getItem('gameSession')
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession) as SessionData

        if (isValidSession(parsedSession)) {
          setSession(parsedSession)
        } else {
          localStorage.removeItem('gameSession')
        }
      } catch (error) {
        console.error('Error parsing session:', error)
      }
    }
    setIsLoading(false)
  }, [isValidSession])

  // Save new session
  const saveSession = useCallback((data: Omit<SessionData, 'joinedAt'>) => {
    const sessionData: SessionData = {
      ...data,
      joinedAt: Date.now(),
    }
    localStorage.setItem('gameSession', JSON.stringify(sessionData))
    setSession(sessionData)
  }, [])

  // Clear session
  const clearSession = useCallback(() => {
    localStorage.removeItem('gameSession')
    setSession(null)
    router.push('/')
  }, [router])

  const getSessions = useCallback((user: any, roomId: string) => {
    const savedSession = localStorage.getItem('gameSession')
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession) as SessionData
      if (
        user &&
        user.user === parsedSession.emailAddress &&
        parsedSession.roomId === roomId
      ) {
        setSession(parsedSession)
        return parsedSession
      }
      if (!user && parsedSession.roomId === roomId) {
        setSession(parsedSession)
        return parsedSession
      }

      router.push(`/room/join/${roomId}`)
      setSession(null) // Aktualisiert den State
      return null
    }
    return null
  }, [])

  const isSessionValidForRoom = (roomId: string) => {
    return session && session.roomId === roomId
  }

  return {
    session,
    isLoading,
    saveSession,
    clearSession,
    getSessions,
    isSessionValidForRoom,
  }
}
