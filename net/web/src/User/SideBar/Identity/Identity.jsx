import { Avatar, Space, Image, Modal, Form, Input, Button } from 'antd';
import React, { useState } from 'react'
import { IdentityWrapper, IdentityDropdown, MenuWrapper } from './Identity.styled';
import { ExclamationCircleOutlined, RightOutlined, EditOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { useIdentity } from './useIdentity.hook';
import { Menu, Dropdown } from 'antd';
import { Logo } from '../../../Logo/Logo';

export function Identity() {

  const { state, actions } = useIdentity()

  const showLogout = () => {
    Modal.confirm({
      title: 'Do you want to logout?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes, Logout',
      cancelText: 'No, Cancel',
      onOk() { actions.logout() },
    });
  };

  const menu = (
    <MenuWrapper>
      <Menu.Item key="0">
        <div onClick={() => actions.editProfile()}>Edit Profile</div>
      </Menu.Item>
      <Menu.Item key="1">
        <div onClick={() => actions.setShowLogin(true)}>Change Login</div>
      </Menu.Item>
      <Menu.Item key="2">
        <div onClick={() => showLogout()}>Sign Out</div>
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
      <Modal title="Account Login" visible={state.showLogin} centered okText="Save" 
          onCancel={() => actions.setShowLogin(false)} loading={state.busy}
          footer={[
            <Button key="back" onClick={() => actions.setShowLogin(false)}>Cancel</Button>,
            <Button key="save" type="primary" onClick={() => actions.setLogin()}>Save</Button>
          ]}>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Input size="large" spelleCheck="false" placeholder="Username" prefix={<UserOutlined />}
            onChange={(e) => actions.setUsername(e.target.value)} defaultValue={state.handle}
            addonAfter={state.usernameStatus} />

          <Input.Password size="large" spelleCheck="false" placeholder="Password" prefix={<LockOutlined />}
            onChange={(e) => actions.setPassword(e.target.value)}
            addonAfter={state.passwordStatus} />

          <Input.Password size="large" spelleCheck="false" placeholder="Confirm Password" prefix={<LockOutlined />}
            onChange={(e) => actions.setConfirm(e.target.value)} 
            addonAfter={state.confirmStatus} />
        </Space>
      </Modal>
    </IdentityWrapper>
  )
}
