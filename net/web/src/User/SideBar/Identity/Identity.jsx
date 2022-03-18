import { Avatar, Image } from 'antd';
import React from 'react'
import { IdentityWrapper } from './Identity.styled';
import { DownOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { useIdentity } from './useIdentity.hook';
import { Menu, Dropdown } from 'antd';

export function Identity() {

  const { state, actions } = useIdentity()

  const Logo = () => {
    if (state.imageUrl === '') {
      return <Avatar size={64} icon={<UserOutlined />} />
    }
    return <Avatar size={64} src={<Image preview={false} src={ state.imageUrl } style={{ width: 64 }} />} />
  }

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <div onClick={() => {}}>Edit Profile</div>
      </Menu.Item>
      <Menu.Item key="1">
        <div onClick={() => actions.logout()}>Sign Out</div>
      </Menu.Item>
    </Menu>
  );

  return (
    <IdentityWrapper>
      <Dropdown overlay={menu} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="bottomRight">
        <div>
          <div class="container">
            <div class="logo">
              <Logo />
            </div>
            <div class="username">
              <span class="name">{ state.name }</span>
              <span class="handle">{ state.handle }</span>
            </div>
            <DownOutlined />
          </div>
        </div>
      </Dropdown>     
    </IdentityWrapper>
  )
}
