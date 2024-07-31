import { useState, useEffect } from 'react'
import { DatabagSDK, Session } from 'databag-client-sdk'
import { SessionStore } from '../SessionStore'

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
    const sdk = new DatabagSDK(null)
    const store = new SessionStore()
    const session: Session | null = await sdk.initOnlineStore(store)
    console.log(session)
    if (session) {
      updateState({ sdk, session })
    } else {
      const params = {
        topicBatch: 16,
        tagBatch: 16,
        channelTypes: ['test'],
        pushType: 'fcm',
        deviceToken: 'aabbcc',
        notifications: [{ event: 'msg', messageTitle: 'msgd' }],
        deviceId: '0011',
        version: '0.0.1',
        appName: 'databag',
      }
      console.log('-----> SDK LOGIN')
      const login = await sdk.login('asdf', 'asdf', 'balzack.coredb.org', true, null, params)
      console.log(login)
      updateState({ sdk, session: login })
    }
  }

  const actions = {
  }

  return { state, actions }
}
