import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext';
import { Button } from 'antd';

export function User() {
  const [context, setContext] = useState(false)
  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (appContext) {
      if (appContext.access !== 'user') {
        navigate("/")
      }
      setContext(true)
    }
  }, [appContext, navigate])

  const onLogout = () => {
    appContext.actions.logout()
  }

  if (context) {
    return <Button type="link" onClick={() => onLogout()} style={{ marginTop: '4px' }}>Sign Out User</Button>
  }
  return <></>
}

