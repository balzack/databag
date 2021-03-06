import React from 'react'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useCreate } from './useCreate.hook';
import { CreateWrapper, CreateInput, CreatePassword, CreateLogin, CreateEnter, CreateSpin } from './Create.styled';

export function Create() {
  const { state, actions } = useCreate()

  return (
    <CreateWrapper>
      <div class="container">
        <div class="header">databag</div>
        <div class="subheader">
          <span class="subheader-text">Communication for the Decentralized Web</span>
        </div>
        <CreateInput size="large" spellCheck="false" placeholder="username" prefix={<UserOutlined />} 
           onChange={(e) => actions.setUsername(e.target.value)} value={state.username} 
           addonAfter={state.conflict} />
        <CreatePassword size="large" spellCheck="false" placeholder="password" prefix={<LockOutlined />} 
            onChange={(e) => actions.setPassword(e.target.value)} value={state.password} />
        <CreatePassword size="large" spellCheck="false" placeholder="confirm password" prefix={<LockOutlined />}
            onChange={(e) => actions.setConfirmed(e.target.value)} value={state.confirmed} />
        <CreateEnter type="primary" onClick={() => actions.onCreate()} disabled={actions.isDisabled()}>
          <span>Create Account</span>
        </CreateEnter>
      </div>
      <CreateLogin type="text" onClick={() => actions.onLogin()}>Account Sign In</CreateLogin>
      <CreateSpin size="large" spinning={state.spinning} />
    </CreateWrapper>
  )
}
