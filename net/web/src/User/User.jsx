import React from 'react'
import { Outlet } from 'react-router-dom';
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
      <div class="canvas noselect">
        <img class="connect" src={connect} alt="" />
        <div class="page">
          <Outlet />
        </div>
      </div>
    </UserWrapper>
  )
}

