import React, { useState } from 'react'
import login from './login.png';
import { Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css'; 

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
        <div style={{ backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', padding: '16px', borderRadius: '8px' }}>
          <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#555555' }}>indicom</div>
          <div style={{ fontSize: '12px', borderBottom: '1px solid black', color: '#444444', paddingLeft: '16px', paddingRight: '16px' }}>
            <span>Communication for the Decentralized Web</span>
          </div>
          <Input size="large" onChange={(e) => setUsername(e.target.value)} placeholder="username" prefix={<UserOutlined />} style={{ marginTop: '16px' }} />
          <Input.Password size="large" onChange={(e) => setPassword(e.target.value)} placeholder="password" prefix={<LockOutlined />} style={{ marginTop: '16px' }} />
          <Button type="primary" onClick={onLogin} style={{ marginTop: '16px' }}>Sign In</Button> 
        </div>
        <Button type="link" onClick={onCreate} style={{ marginTop: '4px', color: '#000044' }}>Create Account</Button> 
      </div>
    </div>
  );
}

export default App;
