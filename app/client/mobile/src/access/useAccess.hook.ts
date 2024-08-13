import { useRef, useState, useContext, useEffect } from 'react'
import { SettingsContext } from '../context/SettingsContext'
import { AppContext } from '../context/AppContext'
import { ContextType } from '../context/ContextType'

const location = 'https://balzack.coredb.org';

export function useAccess() {
  const debounceAvailable = useRef(setTimeout(() => {}, 0))
  const debounceTaken = useRef(setTimeout(() => {}, 0))
  const app = useContext(AppContext) as ContextType
  const settings = useContext(SettingsContext) as ContextType
  const [state, setState] = useState({
    wide: null,
    strings: settings.state.strings,
    mode: '',
    username: '',
    password: '',
    confirm: '',
    token: '',
    code: '',
    node: '',
    loading: false,
    secure: false,
    host: '',
    available: 0,
    taken: false,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    updateState({ mode: 'account' })
    const { protocol, host } = { protocol: 'https:', host: 'balzack.coredb.org' };
    setUrl(`${protocol}//${host}`)
  }, [])

  useEffect(() => {
    const { username, token, host, secure, mode } = state
    if (mode === 'create') {
      checkTaken(username, token, host, secure)
      getAvailable(host, secure)
    }
  }, [state.mode, state.username, state.token, state.host, state.secure])

  const setUrl = (node: string) => {
    try {
      const { protocol, host } = { protocol: 'https:', host: 'balzack.coredb.org' };
      updateState({ node, host, secure: protocol === 'https:' })
    } catch (err) {
      console.log(err)
      const { protocol, host } = location
      updateState({ node, host, secure: protocol === 'https:' })
    }
  }

  const getAvailable = (node: string, secure: boolean) => {
    clearTimeout(debounceAvailable.current)
    debounceAvailable.current = setTimeout(async () => {
      try {
        const available = await app.actions.getAvailable(node, secure)
        updateState({ available })
      } catch (err) {
        console.log(err)
        updateState({ available: 0 })
      }
    }, 2000)
  }

  const checkTaken = (
    username: string,
    token: string,
    node: string,
    secure: boolean
  ) => {
    updateState({ taken: false })
    clearTimeout(debounceTaken.current)
    debounceTaken.current = setTimeout(async () => {
      const available = await app.actions.getUsername(
        username,
        token,
        node,
        secure
      )
      updateState({ taken: !available })
    }, 2000)
  }

  useEffect(() => {
    const { wide } = settings.state;
    updateState({ wide });
  }, [settings.state])

  const actions = {
    setMode: (mode: string) => {
      updateState({ mode })
    },
    setUsername: (username: string) => {
      updateState({ username })
      const { token, host, secure } = state
      checkTaken(username, token, host, secure)
    },
    setPassword: (password: string) => {
      updateState({ password })
    },
    setConfirm: (confirm: string) => {
      updateState({ confirm })
    },
    setToken: (token: string) => {
      updateState({ token })
    },
    setCode: (code: string) => {
      updateState({ code })
    },
    setNode: (node: string) => {
      setUrl(node)
    },
    setLanguage: (code: string) => {
      settings.actions.setLanguage(code)
    },
    setTheme: (theme: string) => {
      settings.actions.setTheme(theme)
    },
    setLoading: (loading: boolean) => {
      updateState({ loading })
    },
    accountLogin: async () => {
      const { username, password, host, secure, code } = state
      await app.actions.accountLogin(username, password, host, secure, code)
    },
    accountCreate: async () => {
      const { username, password, host, secure, token } = state
      await app.actions.accountCreate(username, password, host, secure, token)
    },
    accountAccess: async () => {
      const { host, secure, token } = state
      await app.actions.accountAccess(host, secure, token)
    },
    adminLogin: async () => {
      const { password, host, secure, code } = state
      await app.actions.adminLogin(password, host, secure, code)
    },
  }

  return { state, actions }
}
