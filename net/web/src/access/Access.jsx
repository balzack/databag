import { useAccess } from './useAccess.hook';
import { AccessWrapper } from './Access.styled';
import { Login } from './login/Login';
import { Admin } from './admin/Admin';
import { CreateAccount } from './createAccount/CreateAccount';

import login from 'images/login.png'

export function Access({ mode }) {

  const { state } = useAccess();

  return (
    <AccessWrapper>
      { (state.display === 'large' || state.display === 'xlarge') && (
        <div className="split-layout">
          <div className="left">
            <img className="splash" src={login} alt="Databag Splash" />
          </div>
          <div className="right">
            { mode === 'login' && (
              <Login />
            )}
            { mode === 'create' && (
              <CreateAccount />
            )}
            { mode === 'admin' && (
              <Admin />
            )}
          </div>
        </div>
      )}
      { (state.display === 'medium' || state.display === 'small') && (
        <div className="full-layout">
          <div className="center">
            { mode === 'login' && (
              <Login />
            )}
            { mode === 'create' && (
              <CreateAccount />
            )}
            { mode === 'admin' && (
              <Admin />
            )}
          </div>
        </div>
      )}
    </AccessWrapper>
  );
}

