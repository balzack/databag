import React from 'react'
import { useUser } from './useUser.hook';
import { Button } from 'antd';
import { UserWrapper } from './User.styled';
import connect from '../connect.png';

          
export function User() {

  const { state, actions } = useUser()

  return (
    <UserWrapper>
      <div class="listing">
        <Button type="primary" onClick={() => actions.onLogout()} style={{ alignSelf: 'center', marginTop: '16px', width: '33%' }}>Sign Out</Button>
      </div>
      <div class="canvas">
        <img class="connect" src={connect} alt="" />
      </div>
    </UserWrapper>
  )
}

