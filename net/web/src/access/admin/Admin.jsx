import { Button, Modal, Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AdminWrapper, MFAModal } from './Admin.styled';
import { useAdmin } from './useAdmin.hook';

export  function Admin() {

  const [ modal, modalContext ] = Modal.useModal();
  const { state, actions } = useAdmin();

  const login = async () => {
    try {
      await actions.login();
    }
    catch(err) {
      modal.error({
        title: <span style={state.menuStyle}>{state.strings.adminError}</span>,
        content: <span style={state.menuStyle}>{state.strings.adminMessage}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
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
      { modalContext }
      <div className="app-title">
        <span>Databag</span>
        <div className="settings" onClick={() => actions.navUser()}>
          <UserOutlined />
        </div>
      </div>
      <div className="form-title">{state.strings.admin}</div>
      <div className="form-form">
        <Form name="basic" wrapperCol={{ span: 24, }}>

          <Form.Item name="password">
            <Input.Password placeholder={ state.unclaimed ? state.strings.newPassword : state.strings.password } spellCheck="false"
                onChange={(e) => actions.setPassword(e.target.value)} autoComplete="current-password"
                onKeyDown={(e) => keyDown(e)} prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <div className="form-button">
            <div className="form-login">
              <Button className={state.password ? 'enabled' : 'disabled'} type="primary" block onClick={login} size="middle" loading={state.busy}
                disabled={!state.password}>{state.strings.login}</Button>
            </div>
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
    </AdminWrapper>
  );
};

