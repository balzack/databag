import { useState, useContext, useEffect } from 'react'
import { DisplayContext } from '../context/DisplayContext'
import { ContextType } from '../context/ContextType'


export function useMessage() {
  const display = useContext(DisplayContext) as ContextType
  const [state, setState] = useState({
    strings: display.state.strings,
    timeFormat: display.state.timeFormat,
    dateFormat: display.state.dateFormat,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const { strings, timeFormat, dateFormat } = display.state;
    updateState({ strings, timeFormat, dateFormat });
  }, [display.state]);

  const actions = {
    getTimestamp: (created: number) => {
      const now = Math.floor((new Date()).getTime() / 1000)
      const date = new Date(created * 1000);
      const offset = now - created;
      if(offset < 43200) {
        if (state.timeFormat === '12h') {
          return date.toLocaleTimeString("en-US", {hour: 'numeric', minute:'2-digit'});
        }
        else {
          return date.toLocaleTimeString("en-GB", {hour: 'numeric', minute:'2-digit'});
        }
      }
      else if (offset < 31449600) {
        if (state.dateFormat === 'mm/dd') {
          return date.toLocaleDateString("en-US", {day: 'numeric', month:'numeric'});
        }
        else {
          return date.toLocaleDateString("en-GB", {day: 'numeric', month:'numeric'});
        }
      }
      else {
        if (state.dateFormat === 'mm/dd') {
          return date.toLocaleDateString("en-US");
        }
        else {
          return date.toLocaleDateString("en-GB");
        }
      }
    }
  }

  return { state, actions }
}
