import React, { useContext, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { AppContext } from 'context/AppContext';
                                           
export function Home() {

  const navigate = useNavigate();
  const app = useContext(AppContext);

  useEffect(() => {
    if (app?.state) {
      if (app.state.access == null) {
        navigate('/login')
      }
      else if (app.state.access === 'user') {
        navigate('/user')
      }
      else if (app.state.access === 'admin') {
        navigate('/admin')
      }
    }
  }, [])

  return <></>
}

