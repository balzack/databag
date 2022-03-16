import React from 'react'
import { useUser } from './useUser.hook';
import { Button } from 'antd';
                                           
export function User() {

  const { state, actions } = useUser()

  return <Button type="primary" onClick={() => actions.onLogout()} style={{ alignSelf: 'center', marginTop: '16px', width: '33%' }}>Sign Out</Button>
}

