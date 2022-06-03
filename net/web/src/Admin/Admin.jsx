import React from 'react'
import { Input, Button, Space } from 'antd';
import { AdminWrapper, LoginWrapper, TokenInput } from './Admin.styled';
import { useAdmin } from './useAdmin.hook';
import { Dashboard } from './Dashboard/Dashboard';
import { UserOutlined } from '@ant-design/icons';          

export function Admin() {

  const { state, actions } = useAdmin()

  if (state.unclaimed == null) {
    return <></>
  }

  if (state.unclaimed) {
    return (
      <LoginWrapper>
        <div className="login">
          <Space>
            <TokenInput placeholder="Admin Token" spellcheck="false" onChange={(e) => actions.setToken(e.target.value)} />
            <Button loading={state.busy} type="primary" onClick={() => actions.setAccess()}>Set</Button>
          </Space>
        </div>
      </LoginWrapper>
    );
  }

  if (!state.access) {
    return (
      <LoginWrapper>
        <div class="user" onClick={() => actions.onUser()}>
          <UserOutlined />
        </div>
        <div className="login">
          <Space>
            <TokenInput placeholder="Admin Token" spellcheck="false" onChange={(e) => actions.setToken(e.target.value)} />
            <Button loading={state.busy} type="primary" onClick={() => actions.getAccess()}>Go</Button>
          </Space>
        </div>
      </LoginWrapper>
    );
  }

  return (
    <AdminWrapper>
      <Dashboard />
    </AdminWrapper>
  )
}

