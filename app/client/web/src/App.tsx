import React from 'react'
import { Root } from './root/Root'
import { createTheme, MantineProvider, virtualColor } from '@mantine/core'
import './App.css'
import '@mantine/core/styles.css';
import classes from './App.module.css';

const theme = createTheme({
  focusClassName: classes.focus,
  primaryColor: 'databag-green',
  primaryShade: { light: 6, dark: 7 },
  colors: {
    'databag-green': ['#eef6f2', '#cce5d9', '#aad4bf', '#88c3a6', '#66b28c', '#4d9973', '#3c7759', '#2b5540', '#1a3326', '#09110d'],
  },
});

export function App () {

console.log("FOCUS", classes.focus);


  return (
    <MantineProvider forceColorScheme="dark" theme={theme}>
      <div className='App'>
        <Root />
      </div>
    </MantineProvider>
  )
}
