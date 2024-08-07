import React from 'react'
import { TextInput, Button } from '@mantine/core'
import { useRoot } from './useRoot.hook'
import { Outlet } from 'react-router-dom'

export function Root() {
  const { state, actions } = useRoot()

  return (
    <Outlet />
  )
}
