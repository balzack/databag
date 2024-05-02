import { useAccess } from './useAccess.hook';
import { AccessWrapper } from './Access.styled';
import { Login } from './login/Login';
import { Admin } from './admin/Admin';
import { CreateAccount } from './createAccount/CreateAccount';
import { ThemeProvider } from "styled-components";
import { Select } from 'antd';

import dogin from 'images/dogin.png';
import bogin from 'images/bogin.png';

export function Access({ mode }) {

  const { state, actions } = useAccess();

  return (
    <ThemeProvider theme={state.colors}>
      <AccessWrapper>
        { (state.display === 'large' || state.display === 'xlarge') && (
          <div className="split-layout">
            <div className="left">
              { state.scheme === 'dark' && (
                <img className="splash" src={dogin} alt="Databag Splash" />
              )}
              { state.scheme === 'light' && (
                <img className="splash" src={bogin} alt="Databag Splash" />
              )}
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
              <div className="footer">
                <div className="option">
                  <div className="label">{state.strings.theme}</div>
                  <Select
                      defaultValue={null}
                      size="small"
                      style={{ width: 128 }}
                      value={state.theme}
                      onChange={actions.setTheme}
                      options={[{value: null, label: state.strings.default}, ...state.themes]}
                    />
                </div>
                <div className="option">
                  <div className="label">{state.strings.language}</div>
                  <Select
                      defaultValue={null}
                      size="small"
                      style={{ width: 128 }}
                      value={state.language}
                      onChange={actions.setLanguage}
                      options={[{value: null, label: state.strings.default}, ...state.languages]}
                    />
                </div>
              </div>
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

              <div className="footer">
                <div className="option">
                  <div className="label">{state.strings.theme}</div>
                  <Select
                      defaultValue={null}
                      size="small"
                      style={{ width: 128 }}
                      value={state.theme}
                      onChange={actions.setTheme}
                      options={[{value: null, label: state.strings.default}, ...state.themes]}
                    />
                </div>
                <div className="option">
                  <div className="label">{state.strings.language}</div>
                  <Select
                      defaultValue={null}
                      size="small"
                      style={{ width: 128 }}
                      value={state.language}
                      onChange={actions.setLanguage}
                      options={[{value: null, label: state.strings.default}, ...state.languages]}
                    />
                </div>
              </div>

            </div>
          </div>
        )}
      </AccessWrapper>
    </ThemeProvider>
  );
}

