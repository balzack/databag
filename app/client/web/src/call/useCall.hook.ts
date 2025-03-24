import { useState, useContext, useEffect, useRef } from 'react'
import { RingContext } from '../context/RingContext'
import { DisplayContext } from '../context/DisplayContext'
import { ContextType } from '../context/ContextType'
import { Card } from 'databag-client-sdk'

export function useCall() {
  const ring = useContext(RingContext) as ContextType
  const display = useContext(DisplayContext) as ContextType
  const offsetTime = useRef(0)
  const offset = useRef(false)

  const [state, setState] = useState({
    strings: display.state.strings,
    calls: [] as { callId: string; card: Card }[],
    calling: null as null | Card,
    localStream: null as null | MediaStream,
    remoteStream: null as null | MediaStream,
    remoteVideo: false,
    localVideo: false,
    audioEnabled: false,
    videoEnabled: false,
    connected: false,
    duration: 0,
    failed: false,
    width: 0,
    height: 0,
    fullscreen: false,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const { width, height, strings } = display.state
    updateState({ width, height, strings })
  }, [display.state])

  useEffect(() => {
    const interval = setInterval(() => {
      if (offset.current) {
        const now = new Date()
        const duration = Math.floor(now.getTime() / 1000 - offsetTime.current)
        updateState({ duration })
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const { calls, calling, fullscreen, localStream, remoteStream, remoteVideo, localVideo, audioEnabled, videoEnabled, connected, connectedTime, failed } = ring.state
    offsetTime.current = connectedTime
    offset.current = connected
    const duration = connected ? Math.floor(new Date().getTime() / 1000 - connectedTime) : 0
    updateState({ calls, calling, fullscreen, duration, localStream, remoteStream, remoteVideo, localVideo, audioEnabled, videoEnabled, connected, failed })
  }, [ring.state])

  const actions = ring.actions
  return { state, actions }
}
