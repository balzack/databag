import React, { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from 'context/AppContext';
import { ViewportContext } from 'context/ViewportContext';
import { LoginWrapper } from './Login.styled';

import login from 'images/login.png'

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
      { (viewport.state.display === 'large' || viewport.state.display === 'xlarge') && (
        <div class="split-layout">
          <div class="left">
            <img class="splash" src={login} alt={login} />
          </div>
          <div class="right">RIGHT</div>
        </div>
      )}
      { (viewport.state.display === 'medium' || viewport.state.display === 'small') && (
        <div class="full-layout">
          <div class="center"></div>
        </div>
      )}
    </LoginWrapper>
  );
}

