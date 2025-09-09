'use client'

import { useEffect, useState, useCallback } from 'react'
import { wsClient } from '@/lib/websocket'
import { Socket } from 'socket.io-client'

interface UseWebSocketProps {
  namespace?: string
  autoConnect?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: any) => void
}

export function useWebSocket({
  namespace = '',
  autoConnect = true,
  onConnect,
  onDisconnect,
  onError
}: UseWebSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    if (autoConnect) {
      let currentSocket: Socket
      
      if (namespace === 'transactions') {
        currentSocket = wsClient.connectTransactions()
      } else {
        currentSocket = wsClient.getSocket()
      }
      
      setSocket(currentSocket)
      
      const handleConnect = () => {
        setIsConnected(true)
        setError(null)
        onConnect?.()
      }

      const handleDisconnect = () => {
        setIsConnected(false)
        onDisconnect?.()
      }

      const handleError = (err: any) => {
        setError(err.message || 'WebSocket error')
        onError?.(err)
      }

      currentSocket.on('connect', handleConnect)
      currentSocket.on('disconnect', handleDisconnect)
      currentSocket.on('connect_error', handleError)
      currentSocket.on('error', handleError)

      return () => {
        currentSocket.off('connect', handleConnect)
        currentSocket.off('disconnect', handleDisconnect)
        currentSocket.off('connect_error', handleError)
        currentSocket.off('error', handleError)
        if (namespace === 'transactions') {
          currentSocket.disconnect()
        }
      }
    }
  }, [namespace, autoConnect])

  const emit = useCallback((event: string, data?: any) => {
    socket?.emit(event, data)
  }, [socket])

  const on = useCallback((event: string, callback: (data: any) => void) => {
    socket?.on(event, callback)
    
    return () => {
      socket?.off(event, callback)
    }
  }, [socket])

  const off = useCallback((event: string, callback?: (data: any) => void) => {
    socket?.off(event, callback)
  }, [socket])

  return {
    isConnected,
    error,
    emit,
    on,
    off,
    client: socket
  }
}