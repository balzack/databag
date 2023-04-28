import { Button, Modal, Form, Input } from 'antd';
import { SettingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginWrapper } from './Login.styled';
import { useLogin } from './useLogin.hook';

export  function Login() {

  const [ modal, modalContext ] = Modal.useModal();
  const { state, actions } = useLogin();

  const login = async () => {
    try {
      await actions.onLogin();
    }
    catch(err) {
      modal.error({
        title: 'Login Error',
        content: 'Please confirm your username and password.',
        bodyStyle: { padding: 16 },
      });
    }
  }

  const keyDown = (e) => {
    if (e.key === 'Enter') {
      login()
    }
  }

  return (
    <LoginWrapper>
      { modalContext }
      <div className="app-title">
        <span>Databag</span>
        <div className="settings" onClick={() => actions.onSettings()}>
          <SettingOutlined />
        </div>
      </div>
      <div className="form-title">Login</div>
      <div className="form-form">
        <Form name="basic" wrapperCol={{ span: 24, }}>

          <Form.Item name="username">
            <Input placeholder="Username" spellCheck="false" onChange={(e) => actions.setUsername(e.target.value)}
                autoComplete="username" autoCapitalize="none" onKeyDown={(e) => keyDown(e)} prefix={<UserOutlined />} size="large" />
          </Form.Item>

          <Form.Item name="password">
            <Input.Password placeholder="Password" spellCheck="false" onChange={(e) => actions.setPassword(e.target.value)}
                autoComplete="current-password" onKeyDown={(e) => keyDown(e)} prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <div className="form-button">
            <div className="form-login">
              <Button type="primary" block onClick={login} disabled={ actions.isDisabled()} 
                  size="middle" loading={state.busy}>
                Login
              </Button>
            </div>
          </div>

          <div className="form-button">
            <Button type="link" block disabled={ !state.available } onClick={(e) => actions.onCreate()}>
              Create Account
            </Button>
          </div>

        </Form>
      </div>
    </LoginWrapper>
  );
};

