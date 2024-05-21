import { Button, Modal, Form, Input } from 'antd';
import { SettingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginWrapper, MFAModal } from './Login.styled';
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
        title: <span style={state.menuStyle}>{state.strings.loginError}</span>,
        content: <span style={state.menuStyle}>{state.strings.loginMessage}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  }

  const keyDown = (e) => {
    if (e.key === 'Enter') {
      login()
    }
  }

console.log(state.mfaError);

  return (
    <LoginWrapper>
      { modalContext }
      <div className="app-title">
        <span>Databag</span>
        <div className="settings" onClick={() => actions.onSettings()}>
          <SettingOutlined />
        </div>
      </div>
      <div className="form-title">
        <div>{ state.strings.login }</div>
        { !state.available && state.availableSet && (
          <div className="form-message">{ state.strings.toCreate }</div>
        )}
      </div>

      <div className="form-form">
        <Form name="basic" wrapperCol={{ span: 24, }}>

          <Form.Item name="username">
            <Input placeholder={state.strings.username} spellCheck="false" onChange={(e) => actions.setUsername(e.target.value)}
                autoComplete="username" autoCapitalize="none" onKeyDown={(e) => keyDown(e)} prefix={<UserOutlined />} size="large" />
          </Form.Item>

          <Form.Item name="password">
            <Input.Password placeholder={state.strings.password} spellCheck="false" onChange={(e) => actions.setPassword(e.target.value)}
                autoComplete="current-password" onKeyDown={(e) => keyDown(e)} prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <div className="form-button">
            <div className="form-login">
              <Button className={actions.isDisabled() ? 'disabled' : 'enabled'} type="primary" block onClick={login} disabled={ actions.isDisabled()} 
                  size="middle" loading={state.busy}>
                {state.strings.login}
              </Button>
            </div>
          </div>

          <div className="form-button">
            <Button type="link" block disabled={ !state.available } onClick={(e) => actions.onCreate()}>
              {state.strings.createAccount}
            </Button>
          </div>

        </Form>
      </div>
      <Modal centerd closable={false} footer={null} visible={state.mfaModal} destroyOnClose={true} bodyStyle={{ borderRadius: 8, padding: 16, ...state.menuStyle }} onCancel={actions.dismissMFA}>
        <MFAModal>
          <div className="title">{state.strings.mfaTitle}</div>
          <div className="description">{state.strings.mfaEnter}</div>
          <Input.OTP onChange={actions.setCode} />
          <div className="alert">
            { state.mfaError === '403' && (
              <span>{state.strings.mfaError}</span>
            )}
            { state.mfaError === '429' && (
              <span>{state.strings.mfaDisabled}</span>
            )}
          </div>
          <div className="controls">
            <Button key="back" onClick={actions.dismissMFA}>{state.strings.cancel}</Button>
            <Button key="save" type="primary" className={state.mfaCode ? 'saveEnabled' : 'saveDisabled'} onClick={login}
                disabled={!state.mfaCode} loading={state.busy}>{state.strings.login}</Button>
          </div>
        </MFAModal>
      </Modal>
    </LoginWrapper>
  );
};

