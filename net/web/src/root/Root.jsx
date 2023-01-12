import React, { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from 'context/AppContext';

export function Root() {

  const navigate = useNavigate();
  const app = useContext(AppContext);

  useEffect(() => {
console.log(app.state);
    if (app.state) {
      if (app.state.status) {
        navigate('/session');
      }
      else {
        navigate('/login');
      }
    }
  }, [app.state, navigate]);

  return <></>
}

