import { Button, Modal, Form, Input } from 'antd';
import { SettingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginWrapper } from './Login.styled';
import { useLogin } from './useLogin.hook';

export  function Login() {

  const { state, actions } = useLogin();

  const login = async () => {
    try {
      await actions.onLogin();
    }
    catch(err) {
      Modal.error({
        title: 'Login Error',
        content: 'Please confirm your username and password.',
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
      <div class="app-title">
        <span>Databag</span>
        <div class="settings" onClick={() => actions.onSettings()}>
          <SettingOutlined />
        </div>
      </div>
      <div class="form-title">Login</div>
      <div class="form-form">
        <Form name="basic" wrapperCol={{ span: 24, }}>

          <Form.Item name="username">
            <Input placeholder="Username" spellCheck="false" onChange={(e) => actions.setUsername(e.target.value)}
                autocomplete="username" autocapitalize="none" onKeyDown={(e) => keyDown(e)} prefix={<UserOutlined />} size="large" />
          </Form.Item>

          <Form.Item name="password">
            <Input.Password placeholder="Password" spellCheck="false" onChange={(e) => actions.setPassword(e.target.value)}
                autocomplete="current-password" onKeyDown={(e) => keyDown(e)} prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <div class="form-button">
            <div class="form-login">
              <Button type="primary" block onClick={login} disabled={ actions.isDisabled()} 
                  size="middle" loading={state.busy}>
                Login
              </Button>
            </div>
          </div>

          <div class="form-button">
            <Button type="link" block disabled={ !state.available } onClick={(e) => actions.onCreate()}>
              Create Account
            </Button>
          </div>

        </Form>
      </div>
    </LoginWrapper>
  );
};

