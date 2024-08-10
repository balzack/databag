import React, { useContext } from 'react'
import { Button } from '@mantine/core'
import { AppContext } from '../context/AppContext';
import { ContextType } from '../context/ContextType';

export function Session() {
  const app = useContext(AppContext) as ContextType;

  return (
    <Button onClick={app.actions.accountLogout}>Session Logout</Button>
  )
}
