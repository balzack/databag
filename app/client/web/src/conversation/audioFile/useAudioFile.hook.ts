import { useState, useEffect } from 'react'

export function useAudioFile(source: File) {
  const [state, setState] = useState({
    label: '',
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const label = source.name.split('.').shift()
    updateState({ label })
  }, [source])

  const actions = {
    setLabel: (label: string) => {
      updateState({ label })
    },
  }

  return { state, actions }
}
