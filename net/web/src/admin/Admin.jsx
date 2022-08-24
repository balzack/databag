import React, { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from 'context/AppContext';
import { ViewportContext } from 'context/ViewportContext';
import { useAdmin } from './useAdmin.hook';
import { AdminWrapper } from './Admin.styled';
import { Prompt } from './prompt/Prompt';
import { Dashboard } from './dashboard/Dashboard';

import login from 'images/login.png'

export function Admin({ mode }) {

  const { state, actions } = useAdmin();

  return (
    <AdminWrapper>
      { (state.display === 'large' || state.display === 'xlarge') && (
        <div class="split-layout">
          <div class="left">
            <img class="splash" src={login} alt="Databag Splash" />
          </div>
          <div class="right">
            { state.token == null && (
              <Prompt login={actions.login} />
            )}
            { state.token != null && (
              <Dashboard token={state.token} config={state.config} logout={actions.logout} />
            )}
          </div>
        </div>
      )}
      { (state.display === 'medium' || state.display === 'small') && (
        <div class="full-layout">
          <div class="center">
            { state.token == null && (
              <Prompt login={actions.login} />
            )}
            { state.token != null && (
              <Dashboard token={state.token} config={state.config} logout={actions.logout} />
            )}
          </div>
        </div>
      )}
    </AdminWrapper>
  );
}


