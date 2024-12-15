import { useState, useEffect } from 'react'

export function useBinaryFile(source: File) {
  const [state, setState] = useState({
    name: '',
    extension: '',
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const name = source.name.split('.').shift();
    const extension = source.name.split('.').pop();
    updateState({ name, extension });
  }, [source]);    

  const actions = {
  }

  return { state, actions }
}
