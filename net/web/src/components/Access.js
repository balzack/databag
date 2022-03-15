import React, { useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext';
import { Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

export function Access() {
  const [available, setAvailable] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')  
  const [confirmed, setConfirmed] = useState('')
  const [creatable, setCreatable] = useState(false)
  const [conflict, setConflict] = useState('')
  const [loginMode, setLoginMode] = useState(true);
  const [context, setContext] = useState(false);

  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const debounce = useRef(null)

  useEffect(() => {
    console.log(appContext)
    if (appContext) {
      if (appContext.access === 'admin') {
        navigate("/admin")
      } else if (appContext.access === 'user') {
        navigate("/user")
      } else {
        setContext(true)
        appContext.actions.available().then(a => {
          setAvailable(a > 0)
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }, [appContext, navigate])

  const usernameSet = (name) => {
    setCreatable(false)
    setUsername(name)
    clearTimeout(debounce.current)
    debounce.current = setTimeout(async () => {
      let valid = await appContext.actions.username(name)
      setCreatable(valid)
      if (!valid) {
        setConflict('not available')
      } else {
        setConflict('')
      }
    }, 500)
  }

  const onLogin = async () => {
    try {
      await appContext.actions.login(username, password)
    } catch(err) {
      window.alert(err)
    }
  }

  const onCreate = async () => {
    try {
      await appContext.actions.create(username, password)
    }
    catch(err) {
      window.alert(err)
    }
  }

  if (context && loginMode) {
    return (
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', top: 0, left: 0, width: '100%', height: '100%' }}>
        <div style={{ backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', padding: '16px', borderRadius: '8px', width: '500px' }}>
          <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#555555' }}>indicom</div>
          <div style={{ fontSize: '12px', display: 'flex', borderBottom: '1px solid black', color: '#444444', paddingLeft: '16px', paddingRight: '16px' }}>
            <span style={{ textAlign: 'center', width: '100%' }}>Communication for the Decentralized Web</span>
          </div>
          <Input size="large" spellCheck="false" onChange={(e) => usernameSet(e.target.value)} value={username} placeholder="username" prefix={<UserOutlined />} style={{ marginTop: '16px' }} />
          <Input.Password size="large" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="password" prefix={<LockOutlined />} style={{ marginTop: '16px' }} />
          <Button type="primary" onClick={onLogin} disabled={username===''||password===''} style={{ alignSelf: 'center', marginTop: '16px', width: '33%' }}>Sign In</Button>
        </div>
        <Button type="link" onClick={() => setLoginMode(false)} disabled={!available} style={{ marginTop: '4px' }}>Create Account</Button> 
      </div>
    )
  }
  if (context && !loginMode) {
    return (
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', top: 0, left: 0, width: '100%', height: '100%' }}>
        <div style={{ backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', padding: '16px', borderRadius: '8px', width: '500px' }}>
          <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#555555' }}>indicom</div>
          <div style={{ fontSize: '12px', display: 'flex', borderBottom: '1px solid black', color: '#444444', paddingLeft: '16px', paddingRight: '16px' }}>
            <span style={{ textAlign: 'center', width: '100%' }}>Communication for the Decentralized Web</span>
          </div>
          <Input size="large" spellCheck="false" addonAfter={conflict} onChange={(e) => usernameSet(e.target.value)} value={username} placeholder="username" prefix={<UserOutlined />} style={{ marginTop: '16px' }} />
          <Input.Password size="large" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="password" prefix={<LockOutlined />} style={{ marginTop: '16px' }} />
          <Input.Password size="large" onChange={(e) => setConfirmed(e.target.value)} value={confirmed} placeholder="confirm password" prefix={<LockOutlined />} style={{ marginTop: '16px' }} />
          <Button type="primary" onClick={onCreate} disabled={username===''||password===''||confirmed!==password||!creatable} style={{ alignSelf: 'center', marginTop: '16px', width: '33%' }}>Create Account</Button>
        </div>
        <Button type="link" onClick={() => setLoginMode(true)} style={{ marginTop: '4px' }}>Account Sign In</Button>
      </div>
    )
  }
  return <></>
}

