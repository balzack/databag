import React, { useContext, useState, useEffect, useRef } from 'react'
import { AppContext } from '../AppContext/AppContext';
import { Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useCreate } from './useCreate.hook';
import { CreateWrapper, CreateInput, CreatePassword, CreateLogin, CreateEnter } from './Create.styled';

export function Create() {
  const { state, actions } = useCreate()

  return (
    <CreateWrapper>
      <div class="container">
        <div class="header">indicom</div>
        <div class="subheader">
          <span class="subheader-text">Communication for the Decentralized Web</span>
        </div>
        <CreateInput size="large" spellCheck="false" placeholder="username" prefix={<UserOutlined />} 
           onChange={(e) => actions.setUsername(e.target.value)} value={state.username} 
           addonAfter={state.conflict} />
        <CreatePassword size="large" spellCheck="false" placeholder="password" prefix={<LockOutlined />} 
            onChange={(e) => actions.setPassword(e.target.value)} value={state.password} />
        <CreatePassword size="large" spellCheck="false" placeholder="password" prefix={<LockOutlined />}
            onChange={(e) => actions.setConfirmed(e.target.value)} value={state.confirmed} />
        <CreateEnter type="primary" onClick={() => actions.onCreate()} disabled={actions.isDisabled()}>
          <span>Create Account</span>
        </CreateEnter>
      </div>
      <CreateLogin type="link" onClick={() => actions.onLogin()}>Account Sign In</CreateLogin>
    </CreateWrapper>
  )
}
