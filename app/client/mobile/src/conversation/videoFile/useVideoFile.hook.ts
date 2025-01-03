import { useState, useEffect } from 'react'

export function useVideoFile(source: any) {
  const [state, setState] = useState({
    loaded: false,
    ratio: 1,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  const actions = {
    loaded: (e) => {
      const { width, height } = e.naturalSize;
      updateState({ loaded: true, ratio: width / height });
    },
  }

  return { state, actions }
}
