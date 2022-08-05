import { Button, Modal, Form, Input } from 'antd';
import { SettingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { CreateAccountWrapper } from './CreateAccount.styled';
import { useCreateAccount } from './useCreateAccount.hook';

export  function CreateAccount() {

  const { state, actions } = useCreateAccount();

  const create = async () => {
    try {
      await actions.onCreateAccount();
    }
    catch(err) {
      Modal.error({
        title: 'Create Account Error',
        content: 'Please check with you administrator.',
      });
    }
  }

  const keyDown = (e) => {
    if (e.key === 'Enter') {
      create()
    }
  }

  return (
    <CreateAccountWrapper>
      <div class="app-title">
        <span>Databag</span>
        <div class="settings" onClick={() => actions.onSettings()}>
          <SettingOutlined />
        </div>
      </div>
      <div class="form-title">Create Account</div>
      <div class="form-form">
        <Form name="basic" wrapperCol={{ span: 24, }}>

          <Form.Item name="username" validateStatus={state.validateStatus} help={state.help}>
            <Input placeholder="Username" spellCheck="false" onChange={(e) => actions.setUsername(e.target.value)}
                autocomplete="username" autocapitalize="none" onKeyDown={(e) => keyDown(e)} prefix={<UserOutlined />} />
          </Form.Item>

          <div class="form-space"></div>

          <Form.Item name="password">
            <Input.Password placeholder="Password" spellCheck="false" onChange={(e) => actions.setPassword(e.target.value)}
                autocomplete="new-password" onKeyDown={(e) => keyDown(e)} prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item name="confirm">
            <Input.Password placeholder="Confirm Password" spellCheck="false" onChange={(e) => actions.setConfirm(e.target.value)}
                autocomplete="new-password" onKeyDown={(e) => keyDown(e)} prefix={<LockOutlined />} />
          </Form.Item>

          <div class="form-button">
            <div class="form-create">
              <Button type="primary" block onClick={create} disabled={ actions.isDisabled()} 
                  loading={state.busy}>
                Create Account
              </Button>
            </div>
          </div>

          <div class="form-button">
            <div class="form-login">
              <Button type="link" block onClick={(e) => actions.onLogin()}>
                Account Login
              </Button>
            </div>
          </div>

        </Form>
      </div>
    </CreateAccountWrapper>
  );
};

