import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { ContextType } from '../context/ContextType'
import { useLocation, useNavigate } from 'react-router-dom'

export function useRoot() {
  const app = useContext(AppContext) as ContextType
  const location = useLocation()
  const navigate = useNavigate()
  const [state, setState] = useState({
    pathname: '',
    session: null,
    node: null,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    const { pathname } = location
    updateState({ pathname })
  }, [location.pathname])

  useEffect(() => {
    const state = app.state || {}
    if (state.pathname === '/session' && !state.session) {
      navigate('/')
    } else if (state.pathname === '/node' && !state.node) {
      navigate('/')
    } else if (
      state.pathname === '/' &&
      !state.session &&
      !state.node
    ) {
      navigate('/access')
    } else if (state.pathname !== '/node' && state.node) {
      navigate('/node')
    } else if (state.pathname !== '/session' && state.session) {
      navigate('/session')
    }
  }, [state?.pathname, app.state?.session, app.state?.node])

  const actions = {}

  return { state, actions }
}
