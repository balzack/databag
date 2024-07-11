import { useState, useEffect } from 'react'
import { DatabagSDK, WebStore, Session } from 'databag-client-sdk'

class Store implements WebStore {
  public async getValue (key: string): Promise<any> {
    console.log('web store get: ', key)
    const value = localStorage.getItem(key)
    if (!value) {
      return null
    }
    return JSON.parse(value)
  }

  public async setValue (key: string, value: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value))
  }

  public async clearValue (key: string): Promise<void> {
    localStorage.removeItem(key)
  }

  public async clearAll (): Promise<void> {
    localStorage.clear()
  }
};

export function useAppContext () {
  const [state, setState] = useState({})

  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const init = async () => {
    const sdk = new DatabagSDK(null, null)
    const store = new Store()
    const session: Session | null = await sdk.initOnlineStore(store)
    console.log(session)
    updateState({ sdk, session })
  }

  const actions = {
  }

  return { state, actions }
}
