import React from 'react'
import { useRoot } from './useRoot.hook'
import { Outlet } from 'react-router-dom'

export function Root() {
  useRoot()
  return <Outlet />
}
