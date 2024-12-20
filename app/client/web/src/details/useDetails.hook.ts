import { useState, useContext, useEffect } from 'react'

export function useDetails() {
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
