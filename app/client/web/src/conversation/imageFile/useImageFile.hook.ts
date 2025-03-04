import { useState, useEffect } from 'react'

export function useImageFile(source: File) {
  const [state, setState] = useState({
    thumbUrl: null,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const thumbUrl = URL.createObjectURL(source);
    updateState({ thumbUrl });
    return () => { URL.revokeObjectURL(thumbUrl) };
  }, [source]);    

  const actions = {
  }

  return { state, actions }
}
