import { Button, Modal, Form, Input } from 'antd';
import { SettingOutlined, LockOutlined } from '@ant-design/icons';
import { AdminWrapper } from './Admin.styled';
import { useAdmin } from './useAdmin.hook';

export  function Admin() {

  const { state, actions } = useAdmin();

  const login = async () => {
    try {
      await actions.login();
    }
    catch(err) {
      Modal.error({
        title: 'Login Error',
        content: 'Please confirm your password.',
      });
    }
  }

  const keyDown = (e) => {
    if (e.key === 'Enter') {
      login()
    }
  }

  return (
    <AdminWrapper>
      <div className="app-title">
        <span>Databag</span>
        <div className="settings" onClick={() => actions.navUser()}>
          <SettingOutlined />
        </div>
      </div>
      <div className="form-title">Admin</div>
      <div className="form-form">
        <Form name="basic" wrapperCol={{ span: 24, }}>

          <Form.Item name="password">
            <Input.Password placeholder={ state.unclaimed ? 'New Password' : 'Password' } spellCheck="false"
                onChange={(e) => actions.setPassword(e.target.value)} autoComplete="current-password"
                onKeyDown={(e) => keyDown(e)} prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <div className="form-button">
            <div className="form-login">
              <Button type="primary" block onClick={login} size="middle" loading={state.busy}
                disabled={!state.password}>Login</Button>
            </div>
          </div>

        </Form>
      </div>
    </AdminWrapper>
  );
};

