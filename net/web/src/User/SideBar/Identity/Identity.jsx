import { Avatar, Image } from 'antd';
import React from 'react'
import { IdentityWrapper, IdentityDropdown, MenuWrapper } from './Identity.styled';
import { RightOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { useIdentity } from './useIdentity.hook';
import { Menu, Dropdown } from 'antd';
import { Logo } from '../../../Logo/Logo';

export function Identity() {

  const { state, actions } = useIdentity()

  const menu = (
    <MenuWrapper>
      <Menu.Item key="0">
        <div onClick={() => actions.editProfile()}>Edit Profile</div>
      </Menu.Item>
      <Menu.Item key="1">
        <div>Change Login</div>
      </Menu.Item>
      <Menu.Item key="2">
        <div onClick={() => actions.logout()}>Sign Out</div>
      </Menu.Item>
    </MenuWrapper>
  );

  return (
    <IdentityWrapper>
      <IdentityDropdown overlay={menu} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="rightTop">
        <div class="container">
          <div class="avatar">
            <Logo imageSet={state.image!=null} imageUrl={state.imageUrl} />
          </div>
          <div class="username">
            <span class="name">{ state.name }</span>
            <span class="handle">{ state.handle }</span>
          </div>
          <RightOutlined />
        </div>
      </IdentityDropdown>     
    </IdentityWrapper>
  )
}
