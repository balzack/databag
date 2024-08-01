import React from 'react'
import { Root } from './root/Root'
import { createTheme, MantineProvider } from '@mantine/core'
import './App.css'

const theme = createTheme({
  /** Your theme override here */
});

export function App () {
  return (
    <MantineProvider theme={theme}>
      <div className='App'>
        <Root />
      </div>
    </MantineProvider>
  )
}
