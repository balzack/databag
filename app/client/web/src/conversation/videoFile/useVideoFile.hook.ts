import { useState, useEffect } from 'react'

export function useVideoFile(source: File) {
  const [state, setState] = useState({
    videoUrl: null,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const videoUrl = URL.createObjectURL(source);
    updateState({ videoUrl });
    return () => { URL.revokeObjectURL(videoUrl) };
  }, [source]);    

  const actions = {
  }

  return { state, actions }
}
