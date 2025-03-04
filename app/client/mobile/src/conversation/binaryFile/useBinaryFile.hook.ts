import { useState, useEffect } from 'react'

export function useBinaryFile(path: string) {
  const [state, setState] = useState({
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  const actions = {
  }

  return { state, actions }
}
