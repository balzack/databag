import { Avatar, Image } from 'antd';
import React from 'react'
import { IdentityWrapper, MenuWrapper } from './Identity.styled';
import { RightOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { useIdentity } from './useIdentity.hook';
import { Menu, Dropdown } from 'antd';

export function Identity() {

  const { state, actions } = useIdentity()

  const Logo = () => {
    if (state.imageUrl != null) {
      if (state.imageUrl === '') {
        return <UserOutlined />
      }
      return <img class="logo" src={ state.imageUrl } alt="" />
    }
    return <></>
  }

  const menu = (
    <MenuWrapper>
      <Menu.Item key="0">
        <div onClick={() => actions.editProfile()}>Edit Profile</div>
      </Menu.Item>
      <Menu.Item key="2">
        <div onClick={() => actions.logout()}>Sign Out</div>
      </Menu.Item>
    </MenuWrapper>
  );

  return (
    <IdentityWrapper>
      <Dropdown overlay={menu} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="rightTop">
        <div>
          <div class="container">
            <div class="avatar">
              <Logo />
            </div>
            <div class="username">
              <span class="name">{ state.name }</span>
              <span class="handle">{ state.handle }</span>
            </div>
            <RightOutlined />
          </div>
        </div>
      </Dropdown>     
    </IdentityWrapper>
  )
}
