import { Button, Modal, Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { PromptWrapper } from './Prompt.styled';
import { usePrompt } from './usePrompt.hook';

export  function Prompt({ login }) {

  const { state, actions } = usePrompt();

  const setLogin = async () => {
    try {
      let config = await actions.onLogin();
      login(state.password, config);
    }
    catch(err) {
      Modal.error({
        title: 'Prompt Error',
        content: 'Please confirm your admin password.',
      });
    }
  }

  const keyDown = (e) => {
    if (e.key === 'Enter') {
      login()
    }
  }

  return (
    <PromptWrapper>
      <div class="app-title">
        <span>Databag</span>
        <div class="user" onClick={() => actions.onUser()}>
          <UserOutlined />
        </div>
      </div>
      <div class="form-title">Admin Login</div>
      <div class="form-form">
        <Form name="basic" wrapperCol={{ span: 24, }}>

          <Form.Item name="password">
            <Input.Password placeholder="Admin Password" spellCheck="false" onChange={(e) => actions.setPassword(e.target.value)}
                autocomplete="current-password" onKeyDown={(e) => keyDown(e)} prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <div class="form-button">
            <div class="form-login">
              <Button type="primary" block onClick={setLogin} size="middle" loading={state.busy}>
                Login
              </Button>
            </div>
          </div>

        </Form>
      </div>
    </PromptWrapper>
  );
};

