import React, { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from 'context/AppContext';

export function Root() {

  const navigate = useNavigate();
  const app = useContext(AppContext);

  useEffect(() => {
    if (app.state) {
      if (app.state.access) {
        navigate('/user');
      }
      else {
        navigate('/login');
      }
    }
  }, [app]);

  return <></>
}

