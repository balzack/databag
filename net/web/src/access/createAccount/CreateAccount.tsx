import { Button, Modal, Form, Input } from 'antd';
import { SettingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { CreateAccountWrapper } from './CreateAccount.styled';
import { useCreateAccount } from './useCreateAccount.hook';

export function CreateAccount() {
  const [modal, modalContext] = Modal.useModal();
  const { state, actions } = useCreateAccount();

  const create = async () => {
    try {
      await actions.onCreateAccount();
    } catch (err) {
      modal.error({
        title: <span style={state.menuStyle}>{state.strings.createError}</span>,
        content: <span style={state.menuStyle}>{state.strings.createMessage}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  };

  const keyDown = (e) => {
    if (e.key === 'Enter') {
      create();
    }
  };

  return (
    <CreateAccountWrapper>
      {modalContext}
      <div className="app-title">
        <span>Databag</span>
        <div
          className="settings"
          onClick={() => actions.onSettings()}
        >
          <SettingOutlined />
        </div>
      </div>
      <div className="form-title">{state.strings.createAccount}</div>
      <div className="form-form">
        <Form
          name="basic"
          wrapperCol={{ span: 24 }}
        >
          <Form.Item
            name="username"
            validateStatus={state.validateStatus}
            help={state.help}
          >
            <Input
              placeholder={state.strings.username}
              spellCheck="false"
              onChange={(e) => actions.setUsername(e.target.value)}
              autoComplete="username"
              autoCapitalize="none"
              onKeyDown={(e) => keyDown(e)}
              prefix={<UserOutlined />}
              size="large"
            />
          </Form.Item>

          <div className="form-space"></div>

          <Form.Item name="password">
            <Input.Password
              placeholder={state.strings.newPassword}
              spellCheck="false"
              onChange={(e) => actions.setPassword(e.target.value)}
              autoComplete="new-password"
              onKeyDown={(e) => keyDown(e)}
              prefix={<LockOutlined />}
              size="large"
            />
          </Form.Item>

          <Form.Item name="confirm">
            <Input.Password
              placeholder={state.strings.confirmPassword}
              spellCheck="false"
              onChange={(e) => actions.setConfirm(e.target.value)}
              autoComplete="new-password"
              onKeyDown={(e) => keyDown(e)}
              prefix={<LockOutlined />}
              size="large"
            />
          </Form.Item>

          <div className="form-button">
            <div className="form-create">
              <Button
                className={actions.isDisabled() ? 'disabled' : 'enabled'}
                type="primary"
                block
                onClick={create}
                disabled={actions.isDisabled()}
                loading={state.busy}
                size="middle"
              >
                {state.strings.create}
              </Button>
            </div>
          </div>

          <div className="form-button">
            <div className="form-login">
              <Button
                type="link"
                block
                onClick={(e) => actions.onLogin()}
              >
                {state.strings.accountLogin}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </CreateAccountWrapper>
  );
}
