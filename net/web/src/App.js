import React, { useContext, useState, useEffect, useRef } from 'react'
import login from './login.png';
import { Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css'; 
import { BrowserRouter as Router, Routes, Route, useHistory } from "react-router-dom";
import { AppContextProvider } from './context/AppContext';
import { Root } from './components/Root';

function App() {

  return (
    <AppContextProvider>
      <Root />
    </AppContextProvider>
  );
}

export default App;
