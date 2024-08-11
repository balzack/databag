import { useState, useEffect, useRef } from 'react'
import { DatabagSDK, Session } from 'databag-client-sdk'
import { SessionStore } from '../SessionStore'

export function useAppContext() {
  const sdk = useRef(new DatabagSDK(null))
  const [state, setState] = useState({
    session: null as null | Session,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const store = new SessionStore()
    const session: Session | null = await sdk.current.initOnlineStore(store)
    if (session) {
      updateState({ session })
    }
  }

  const actions = {
    accountLogin: async (
      username: string,
      password: string,
      node: string,
      secure: boolean
    ) => {
      console.log('LOGIN:', username, password, node, secure)

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
      const login = await sdk.current.login(
        username,
        password,
        node,
        secure,
        null,
        params
      )
      updateState({ session: login })
    },
    accountLogout: async () => {
      if (state.session) {
        await sdk.current.logout(state.session, false)
        updateState({ session: null })
      }
    },
    getAvailable: async (node: string, secure: boolean) => {
      return await sdk.current.available(node, secure)
    },
    adminLogin: async () => {},
    adminLogout: async () => {},
  }

  return { state, actions }
}
