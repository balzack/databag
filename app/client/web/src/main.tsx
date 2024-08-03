import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/App'
import './index.css'
import { AppContextProvider } from './context/AppContext'
import { SettingsContextProvider } from './context/SettingsContext'

const rootElement = document.querySelector('[data-js="root"]')

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

const root = createRoot(rootElement)
root.render(
  <SettingsContextProvider>
    <AppContextProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </AppContextProvider>
  </SettingsContextProvider>
)
