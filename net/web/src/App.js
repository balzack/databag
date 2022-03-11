import React, { useState, useEffect, useRef } from 'react'
import login from './login.png';
import { Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css'; 

var base64 = require('base-64');

const FETCH_TIMEOUT = 15000;

function checkResponse(response) {
  if(response.status >= 400 && response.status < 600) {
    throw new Error(response.url + " failed");
  }
}

async function fetchWithTimeout(url, options) {
  return Promise.race([
    fetch(url, options).catch(err => { throw new Error(url + ' failed'); }),
    new Promise((_, reject) => setTimeout(() => reject(new Error(url + ' timeout')), FETCH_TIMEOUT))
  ]);
}

async function getAvailable() {
  let available = await fetchWithTimeout("/account/available", { method: 'GET', timeout: FETCH_TIMEOUT })
  checkResponse(available)
  return await available.json()
}

async function getUsername(name: string) {
  let available = await fetchWithTimeout('/account/username?name=' + encodeURIComponent(name), { method: 'GET', timeout: FETCH_TIMEOUT })
  checkResponse(available)
  return await available.json()
}

async function setLogin(username: string, password: string) {
  let headers = new Headers()
  headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
  let app = { Name: "indicom", Description: "decentralized communication" }
  let login = await fetchWithTimeout('/account/apps', { method: 'POST', timeout: FETCH_TIMEOUT, body: JSON.stringify(app), headers: headers })
  checkResponse(login)
  return await login.json()
}

async function createAccount(username: string, password: string) {
  let headers = new Headers()
  headers.append('Credentials', 'Basic ' + base64.encode(username + ":" + password));
  let profile = await fetchWithTimeout("/account/profile", { method: 'POST', timeout: FETCH_TIMEOUT, headers: headers })
  checkResponse(profile);
  return await profile.json()
}

function App() {
  const [available, setAvailable] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')  
  const [confirmed, setConfirmed] = useState('')
  const [mode, setMode] = useState('login')
  const [creatable, setCreatable] = useState(false)
  const [conflict, setConflict] = useState('')
  const [token, setToken] = useState('')
  const debounce = useRef(null)
  const ws = useRef(null) 

  useEffect(() => {
    getAvailable().then(a => {
      setAvailable(a > 0)
    }).catch(err => {
      console.log(err)
    })

  }, [])

  const usernameSet = (name) => {
    setCreatable(false)
    setUsername(name)
    clearTimeout(debounce.current)
    debounce.current = setTimeout(async () => {
      let valid = await getUsername(name)
      setCreatable(valid)
      if (!valid) {
        setConflict('not available')
      } else {
        setConflict('')
      }
      setCreatable(await getUsername(name))
    }, 500)
  }

  const connectStatus = (access: string) => {
    ws.current = new WebSocket("wss://" + window.location.host + "/status");
    ws.current.onmessage = (ev) => {
      console.log(ev)
    }
    ws.current.onclose = () => {
      console.log('ws close')
      setTimeout(() => {
        if (ws.current != null) {
          ws.current.onmessage = () => {}
          ws.current.onclose = () => {}
          ws.current.onopen = () => {}
          ws.current.onerror = () => {}
          connectStatus(access)
        }
      }, 2000)
    }
    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ AppToken: access }))
    }
    ws.current.error = () => {
      console.log('ws error')
    }
  }

  const Logout = () => {
    if (mode === 'logout') {
      return <Button type="primary" onClick={onLogout} style={{ alignSelf: 'center', marginTop: '16px', width: '33%' }}>Sign Out</Button>
    }
    return <></>
  }

  const Link = () => {
    if (mode === 'create') {
      return <Button type="link" onClick={() => setMode('login')} disabled={!available} style={{ marginTop: '4px' }}>Account Sign In</Button> 
    }
    if (mode === 'login') {
      return <Button type="link" onClick={() => setMode('create')} disabled={!available} style={{ marginTop: '4px' }}>Create Account</Button> 
    }
    return <></>
  }

  const canLogin = () => {
    return username !== '' && password !== ''
  }

  const canCreate = () => {
    return username !== '' && password !== '' && confirmed === password && creatable
  }

  const onLogin = async () => {
    try {
      let access = await setLogin(username, password)
      connectStatus(access)
      setMode('logout')
      console.log(access)
    }
    catch(err) {
      window.alert("failed to sign into account")
    }
  }

  const onCreate = async () => {
    try {
      let profile = await createAccount(username, password)
      setMode('created')
      try {
        let access = await setLogin(username, password)
        connectStatus(access)
        setMode('logout')
        console.log(access)
      }
      catch(err) {
        window.alert("failed to sign into account")
      }
    }
    catch(err) {
      window.alert("failed to create account")
    }
  }

  const onLogout = () => {
    ws.current.onclose = () => {}
    ws.current.close(1000, "bye")
    setMode('login')
  }

  if (mode === 'login') {
    return (
      <div style={{ width: '100%', height: '100vh', backgroundColor: '#8fbea7' }}>
        <img src={login} alt="" style={{ position: 'absolute', width: '33%', bottom: 0, right: 0 }}/>
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', top: 0, left: 0, width: '100%', height: '67%' }}>
          <div style={{ backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', padding: '16px', borderRadius: '8px', width: '500px' }}>
            <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#555555' }}>indicom</div>
            <div style={{ fontSize: '12px', display: 'flex', borderBottom: '1px solid black', color: '#444444', paddingLeft: '16px', paddingRight: '16px' }}>
              <span style={{ textAlign: 'center', width: '100%' }}>Communication for the Decentralized Web</span>
            </div>
            <Input size="large" spellCheck="false" onChange={(e) => usernameSet(e.target.value)} value={username} placeholder="username" prefix={<UserOutlined />} style={{ marginTop: '16px' }} />
            <Input.Password size="large" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="password" prefix={<LockOutlined />} style={{ marginTop: '16px' }} />
            <Button type="primary" onClick={onLogin} disabled={!canLogin()} style={{ alignSelf: 'center', marginTop: '16px', width: '33%' }}>Sign In</Button>
          </div>
          <Link />
        </div>
      </div>
    )
  }
  if (mode === 'create') {
    return (
      <div style={{ width: '100%', height: '100vh', backgroundColor: '#8fbea7' }}>
        <img src={login} alt="" style={{ position: 'absolute', width: '33%', bottom: 0, right: 0 }}/>
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', top: 0, left: 0, width: '100%', height: '67%' }}>
          <div style={{ backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', padding: '16px', borderRadius: '8px', width: '500px' }}>
            <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#555555' }}>indicom</div>
            <div style={{ fontSize: '12px', display: 'flex', borderBottom: '1px solid black', color: '#444444', paddingLeft: '16px', paddingRight: '16px' }}>
              <span style={{ textAlign: 'center', width: '100%' }}>Communication for the Decentralized Web</span>
            </div>
            <Input size="large" spellCheck="false" addonAfter={conflict} onChange={(e) => usernameSet(e.target.value)} value={username} placeholder="username" prefix={<UserOutlined />} style={{ marginTop: '16px' }} />
            <Input.Password size="large" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="password" prefix={<LockOutlined />} style={{ marginTop: '16px' }} />
            <Input.Password size="large" onChange={(e) => setConfirmed(e.target.value)} value={confirmed} placeholder="confirm password" prefix={<LockOutlined />} style={{ marginTop: '16px' }} />
            <Button type="primary" onClick={onCreate} disabled={!canCreate()} style={{ alignSelf: 'center', marginTop: '16px', width: '33%' }}>Create Account</Button>
          </div>
          <Link />
        </div>
      </div>
    )
  }
  if (mode === 'logout') {
    return (
      <div style={{ width: '100%', height: '100vh', backgroundColor: '#8fbea7' }}>
        <img src={login} alt="" style={{ position: 'absolute', width: '33%', bottom: 0, right: 0 }}/>
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', top: 0, left: 0, width: '100%', height: '67%' }}>
          <div style={{ backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', padding: '16px', borderRadius: '8px', width: '500px' }}>
            <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#555555' }}>indicom</div>
            <div style={{ fontSize: '12px', display: 'flex', borderBottom: '1px solid black', color: '#444444', paddingLeft: '16px', paddingRight: '16px' }}>
              <span style={{ textAlign: 'center', width: '100%' }}>Communication for the Decentralized Web</span>
            </div>
            <Button type="primary" onClick={onLogout} style={{ alignSelf: 'center', marginTop: '16px', width: '33%' }}>Sign Out</Button>
          </div>
          <Link />
        </div>
      </div>
    )
  }
  else {
    return (
      <div style={{ width: '100%', height: '100vh', backgroundColor: '#8fbea7' }}>
        <img src={login} alt="" style={{ position: 'absolute', width: '33%', bottom: 0, right: 0 }}/>
      </div>
    )
  }
  return <></>
}

export default App;
