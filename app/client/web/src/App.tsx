import React, { useContext } from 'react'
import { Root } from './root/Root'
import { Access } from './access/Access'
import { Node } from './node/Node'
import { Session } from './session/Session'
import { createTheme, MantineProvider, virtualColor } from '@mantine/core'
import './App.css'
import '@mantine/core/styles.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import classes from './App.module.css'
import { SettingsContext } from './context/SettingsContext'
import { ContextType } from './context/ContextType'

const theme = createTheme({
  primaryColor: 'databag-green',
  primaryShade: { light: 6, dark: 7 },
  colors: {
    'databag-green': [
      '#eef6f2',
      '#cce5d9',
      '#aad4bf',
      '#88c3a6',
      '#66b28c',
      '#4d9973',
      '#3c7759',
      '#2b5540',
      '#1a3326',
      '#09110d',
    ],
    'dark-surface': [
      '#000000',
      '#111111',
      '#222222',
      '#333333',
      '#444444',
      '#555555',
      '#666666',
      '#777777',
      '#888888',
      '#999999',
    ],
    'light-surface': [
      '#ffffff',
      '#eeeeee',
      '#dddddd',
      '#cccccc',
      '#bbbbbb',
      '#aaaaaa',
      '#999999',
      '#888888',
      '#777777',
      '#666666',
    ],
    'dark-text': [
      '#ffffff',
      '#eeeeee',
      '#dddddd',
      '#cccccc',
      '#bbbbbb',
      '#aaaaaa',
      '#999999',
      '#888888',
      '#777777',
      '#666666',
    ],
    'light-text': [
      '#000000',
      '#111111',
      '#222222',
      '#333333',
      '#444444',
      '#555555',
      '#666666',
      '#777777',
      '#888888',
      '#999999',
    ],
    surface: virtualColor({
      name: 'surface',
      dark: 'dark-surface',
      light: 'light-surface',
    }),
    text: virtualColor({
      name: 'text',
      dark: 'dark-text',
      light: 'light-text',
    }),
  },
})

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: '/', element: <></> },
      { path: 'access', element: <Access /> },
      { path: 'session', element: <Session /> },
      { path: 'node', element: <Node /> },
    ],
  },
])

export function App() {
  const settings = useContext(SettingsContext) as ContextType

  return (
    <div className={classes.app}>
      <MantineProvider forceColorScheme={settings.state.theme} theme={theme}>
        <RouterProvider router={router} />
      </MantineProvider>
    </div>
  )
}
