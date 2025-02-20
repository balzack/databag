import React, { useContext } from 'react'
import { Button } from '@mantine/core'
import { AppContext } from '../context/AppContext'
import { ContextType } from '../context/ContextType'

export function Service() {
  const app = useContext(AppContext) as ContextType

  return <Button onClick={app.actions.adminLogout}>Node Logout</Button>
}
