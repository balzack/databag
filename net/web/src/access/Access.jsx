import React, { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from 'context/AppContext';
import { ViewportContext } from 'context/ViewportContext';
import { AccessWrapper } from './Access.styled';
import { Login } from './login/Login';
import { CreateAccount } from './createAccount/CreateAccount';

import login from 'images/login.png'

export function Access({ mode }) {

  const navigate = useNavigate();
  const app = useContext(AppContext);
  const viewport = useContext(ViewportContext);

  useEffect(() => {
    if (app.state) {
      if (app.state.access) {
        navigate('/session');
      }
    }
  }, [app, navigate]);

  const Prompt = () => {
    if (mode === 'login') {
      return <Login />
    }
    if (mode === 'create') {
      return <CreateAccount />
    }
    return <></>
  } 

  return (
    <AccessWrapper>
      { (viewport.state.display === 'large' || viewport.state.display === 'xlarge') && (
        <div class="split-layout">
          <div class="left">
            <img class="splash" src={login} alt="Databag Splash" />
          </div>
          <div class="right">
            { mode === 'login' && (
              <Login />
            )}
            { mode === 'create' && (
              <CreateAccount />
            )}
          </div>
        </div>
      )}
      { (viewport.state.display === 'medium' || viewport.state.display === 'small') && (
        <div class="full-layout">
          <div class="center">
            { mode === 'login' && (
              <Login />
            )}
            { mode === 'create' && (
              <CreateAccount />
            )}
          </div>
        </div>
      )}
    </AccessWrapper>
  );
}

