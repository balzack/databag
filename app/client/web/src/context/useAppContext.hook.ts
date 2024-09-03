import { useState, useEffect, useRef, useContext } from 'react'
import { DatabagSDK, Session } from 'databag-client-sdk'
import { SessionStore } from '../SessionStore'
import { ContextType } from './ContextType'

export function useAppContext() {
  const sdk = useRef(new DatabagSDK())
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
      secure: boolean,
      code: string
    ) => {
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
        code,
        params
      )
      updateState({ session: login });
    },
    accountLogout: async () => {
      if (state.session) {
        await sdk.current.logout(state.session, false)
        updateState({ session: null });
      }
    },
    accountCreate: async (
      handle: string,
      password: string,
      node: string,
      secure: boolean,
      token: string
    ) => {
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
      const session = await sdk.current.create(
        handle,
        password,
        node,
        secure,
        token,
        params
      )
      updateState({ session });
    },
    accountAccess: async (node: string, secure: boolean, token: string) => {
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
      const session = await sdk.current.access(node, secure, token, params)
      updateState({ session });
    },
    getAvailable: async (node: string, secure: boolean) => {
      return await sdk.current.available(node, secure)
    },
    getUsername: async (
      username: string,
      token: string,
      node: string,
      secure: boolean
    ) => {
      return await sdk.current.username(username, token, node, secure)
    },
    adminLogin: async (
      token: string,
      node: string,
      secure: boolean,
      code: string
    ) => {
      const login = await sdk.current.configure(node, secure, token, code)
      updateState({ node: login })
    },
    adminLogout: async () => {
      updateState({ node: null })
    },
  }

  return { state, actions }
}
