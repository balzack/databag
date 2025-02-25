import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { DisplayContext } from '../context/DisplayContext';
import { ContextType } from '../context/ContextType'
import { Channel } from 'databag-client-sdk';

export function useSelector() {
  const app = useContext(AppContext) as ContextType
  const display = useContext(DisplayContext) as ContextType
  const [state, setState] = useState({
    strings: display.state.strings,
    channels: [] as Channel[],
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  const actions = {
  }

  return { state, actions }
}
