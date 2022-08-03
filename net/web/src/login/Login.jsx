import React, { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from 'context/AppContext';
import { ViewportContext } from 'context/ViewportContext';
import { LoginWrapper } from './Login.styled';

export function Login() {

  const navigate = useNavigate();
  const app = useContext(AppContext);
  const viewport = useContext(ViewportContext);

  useEffect(() => {
    if (app.state) {
      if (app.state.access) {
        navigate('/user');
      }
    }
  }, [app]);

  return (
    <LoginWrapper>
      { viewport.state.display === 'large' && (
        <div>LARGE</div>
      )}
      { viewport.state.display === 'medium' && (
        <div>MEDIUM</div>
      )}
      { viewport.state.display === 'small' && (
        <div>SMALL</div>
      )}
    </LoginWrapper>
  );
}

