import React, { useContext, useState, useEffect, useRef } from 'react'
import { AppContext } from '../AppContext/AppContext';
import { Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLogin } from './useLogin.hook';

export function Login() {
  const { state, actions } = useLogin()

  return (
    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', top: 0, left: 0, width: '100%', height: '100%' }}>
      <div style={{ backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', padding: '16px', borderRadius: '8px', width: '500px' }}>
        <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#555555' }}>indicom</div>
        <div style={{ fontSize: '12px', display: 'flex', borderBottom: '1px solid black', color: '#444444', paddingLeft: '16px', paddingRight: '16px' }}>
          <span style={{ textAlign: 'center', width: '100%' }}>Communication for the Decentralized Web</span>
        </div>
        <Input size="large" spellCheck="false" onChange={(e) => actions.setUsername(e.target.value)} value={state.username} placeholder="username" prefix={<UserOutlined />} style={{ marginTop: '16px' }} />
        <Input.Password spellCheck="false" size="large" onChange={(e) => actions.setPassword(e.target.value)} value={state.password} placeholder="password" prefix={<LockOutlined />} style={{ marginTop: '16px' }} />
        <Button type="primary" spellCheck="false" onClick={() => actions.onLogin()} disabled={actions.isDisabled()} style={{ alignSelf: 'center', marginTop: '16px', width: '33%' }}>Sign In</Button>
      </div>
      <Button type="link" onClick={() => actions.onCreate()} disabled={!state.available} style={{ marginTop: '4px' }}>Create Account</Button>
    </div>
  )
}
