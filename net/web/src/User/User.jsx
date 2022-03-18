import React from 'react'
import { useUser } from './useUser.hook';
import { Button } from 'antd';
import { UserWrapper } from './User.styled';
import { SideBar } from './SideBar/SideBar';
import connect from '../connect.png';

          
export function User() {

  const { state, actions } = useUser()

  return (
    <UserWrapper>
      <SideBar />
      <div class="canvas">
        <img class="connect" src={connect} alt="" />
      </div>
    </UserWrapper>
  )
}

