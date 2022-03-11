import React, { useState, useEffect } from 'react'
import login from './login.png';
import { Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css'; 

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
  let available = await fetchWithTimeout("/account/available", { method: 'GET', timeout: FETCH_TIMEOUT } );
  checkResponse(available);
  return await available.json()
}

function App() {
  const [available, setAvailable] = useState(0)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {

    getAvailable().then(a => {
      setAvailable(a)
      console.log(a)
    }).catch(err => {
      console.log(err)
    })

  }, [])

  const Create = () => {
    if (available > 0) {
      return <Button type="link" onClick={onCreate} style={{ marginTop: '4px', color: '#000044' }}>Create Account</Button> 
    }
    return <></>
  }

  const onLogin = () => {
    console.log(username)
    console.log(password)
  }

  const onCreate = () => {
    console.log("create account")
  }

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#8fbea7' }}>
      <img src={login} style={{ position: 'absolute', width: '33%', bottom: 0, right: 0 }}/>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', top: 0, left: 0, width: '100%', height: '67%' }}>
        <div style={{ backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', padding: '16px', borderRadius: '8px', width: '500px' }}>
          <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#555555' }}>indicom</div>
          <div style={{ fontSize: '12px', display: 'flex', borderBottom: '1px solid black', color: '#444444', paddingLeft: '16px', paddingRight: '16px' }}>
            <span style={{ textAlign: 'center', width: '100%' }}>Communication for the Decentralized Web</span>
          </div>
          <Input size="large" onChange={(e) => setUsername(e.target.value)} placeholder="username" prefix={<UserOutlined />} style={{ marginTop: '16px' }} />
          <Input.Password size="large" onChange={(e) => setPassword(e.target.value)} placeholder="password" prefix={<LockOutlined />} style={{ marginTop: '16px' }} />
          <Button type="primary" onClick={onLogin} style={{ alignSelf: 'center', marginTop: '16px', width: '33%' }}>Sign In</Button> 
        </div>
        <Create />
      </div>
    </div>
  );
}

export default App;
