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
    const { pathname, node, session } = app.state || {}
    const path =
      pathname === '/session' || pathname === '/node' || pathname === '/access'
        ? pathname
        : '/'
    if (path === '/session' && !session) {
      navigate('/')
    } else if (path === '/node' && !node) {
      navigate('/')
    } else if (path === '/' && !session && !node) {
      navigate('/access')
    } else if (path !== '/node' && node) {
      navigate('/node')
    } else if (path !== '/session' && session) {
      navigate('/session')
    } else {
      navigate('/')
    }
  }, [state?.pathname, app.state?.session, app.state?.node])

  const actions = {}

  return { state, actions }
}
