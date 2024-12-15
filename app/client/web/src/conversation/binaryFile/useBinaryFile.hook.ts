import { useState, useEffect } from 'react'

export function useBinaryFile(source: File) {
  const [state, setState] = useState({
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
  }, [source]);    

  const actions = {
  }

  return { state, actions }
}
