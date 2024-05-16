import { AccountAccessWrapper, LoginModal, MFAModal, SealModal, LogoutContent } from './AccountAccess.styled';
import { useAccountAccess } from './useAccountAccess.hook';
import { Button, Modal, Switch, Input, Radio, Select, Flex, Typography } from 'antd';
import type { GetProp } from 'antd';
import type { OTPProps } from 'antd/es/input/OTP';
import { LogoutOutlined, SettingOutlined, UserOutlined, LockOutlined, ExclamationCircleOutlined, KeyOutlined } from '@ant-design/icons';
import { CopyButton } from '../../../../copyButton/CopyButton';
import { useRef } from 'react';

export function AccountAccess() {

  const [ modal, modalContext ] = Modal.useModal();
  const { state, actions } = useAccountAccess();
  const all = useRef(false);

  const saveSeal = async () => {
    try {
      await actions.saveSeal();
      actions.clearEditSeal();
    }
    catch (err) {
      console.log(err);
      modal.error({
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  }

  const saveSearchable = async (enable) => {
    try {
      await actions.setSearchable(enable);
    }
    catch (err) {
      console.log(err);
      modal.error({
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  };

  const enableMFA = async (enable) => {
    try {
      if (enable) {
        await actions.enableMFA();
      }
      else {
        await actions.disableMFA();
      }
    }
    catch (err) {
      console.log(err);
      modal.error({
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  }

  const saveLogin = async () => {
    try {
      await actions.setLogin();
      actions.clearEditLogin();
    }
    catch (err) {
      console.log(err);
      modal.error({
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  }

  const logout = () => {
    modal.confirm({
      title: <span style={state.menuStyle}>{state.strings.confirmLogout}</span>,
      icon: <LogoutOutlined />,
      content: <LogoutContent onClick={(e) => e.stopPropagation()}>
                <span className="logoutMode">{ state.strings.allDevices }</span>
                <Switch onChange={(e) => all.current = e} size="small" />
               </LogoutContent>,
      bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      okText: state.strings.ok,
      onOk() {
        actions.logout(all.current);
      },
      cancelText: state.strings.cancel,
      onCancel() {},
    });
  }

  return (
    <AccountAccessWrapper>
      { modalContext }
      <div className="account">
        <div className="section">{state.strings.account}</div>
        <div className="controls">
          <div className="switch">
            <div className="control">
              <Switch size="small" checked={state.searchable} onChange={enable => saveSearchable(enable)} />
            </div>
            <div className="switchLabel">{state.strings.registry}</div>
          </div>
          <div className="switch">
            <div className="control">
              <Switch size="small" checked={state.mfaEnabled} onChange={enable => enableMFA(enable)} />
            </div>
            <div className="switchLabel">Multi-Factor Authentication</div>
          </div>
          <div className="link" onClick={actions.setEditSeal}>
            <div className="control">
              <SettingOutlined />
            </div>
            <div className="label">{state.strings.sealedTopics}</div>
          </div>
          <div className="link" onClick={actions.setEditLogin}>
            <div className="control">
              <LockOutlined />
            </div>
            <div className="label">{state.strings.changeLogin}</div>
          </div>
          { state.display === 'small' && (
            <div className="link" onClick={logout}>
              <div className="control">
                <LogoutOutlined className="icon" />
              </div>
              <div className="label">{ state.strings.logout }</div>
            </div>
          )}
        </div>
      </div>
      <div className="account">
        <div className="section">{state.strings.application}</div>
        <div className="controls">
          <div className="option">
            <div className="label">{state.strings.timeFormat}</div>
            <Radio.Group onChange={actions.setTimeFormat} value={state.timeFormat}>
              <Radio style={{borderRadius: 3, paddingLeft: 6, ...state.menuStyle}} value={'12h'}>{state.strings.timeUs}</Radio>
              <Radio style={{borderRadius: 3, paddingLeft: 6, ...state.menuStyle}} value={'24h'}>{state.strings.timeEu}</Radio>
            </Radio.Group>
          </div>
          <div className="option">
            <div className="label">{state.strings.dateFormat}</div>
            <Radio.Group onChange={actions.setDateFormat} value={state.dateFormat}>
              <Radio style={{borderRadius: 3, paddingLeft: 6, ...state.menuStyle}} value={'mm/dd'}>{state.strings.dateUs}</Radio>
              <Radio style={{borderRadius: 3, paddingLeft: 6, ...state.menuStyle}} value={'dd/mm'}>{state.strings.dateEu}</Radio>
            </Radio.Group>
          </div>
          <div className="option">
            <div className="label">{state.strings.theme}</div>
            <Select
                defaultValue={null}
                style={{ width: 128 }}
                size="small"
                value={state.theme}
                onChange={actions.setTheme}
                options={[ { value: null, label: state.strings.default }, ...state.themes ]}
              />
          </div>
          <div className="option">
            <div className="label">{state.strings.language}</div>
            <Select
                defaultValue={null}
                style={{ width: 128 }}
                size="small"
                value={state.language}
                onChange={actions.setLanguage}
                options={[ { value: null, label: state.strings.default }, ...state.languages ]}
              />
          </div>
          <div className="option">
            <div className="label">{state.strings.microphone}</div>
            <Select
               defaultValue={null}
                style={{ width: '60%' }}
                size="small"
                value={state.audioId}
                onChange={actions.setAudio}
                options={[ { value: null, label: state.strings.default }, ...state.audioInputs ]}
              />
          </div>
          <div className="option">
            <div className="label">{state.strings.camera}</div>
            <Select
               defaultValue={null}
                style={{ width: '60%' }}
                size="small"
                value={state.videoId}
                onChange={actions.setVideo}
                options={[ { value: null, label: state.strings.default }, ...state.videoInputs ]}
              />
          </div>
        </div>
      </div>
      <Modal centered closable={false} visible={state.editSeal} footer={null} onCancel={actions.clearEditSeal} bodyStyle={{ borderRadius: 8, padding: 16, ...state.menuStyle }}>
        <SealModal>
          <div className="title">{state.strings.sealedTopics}</div>
          <div className="switch">
            <Switch size="small" checked={state.sealEnabled} onChange={enable => actions.enableSeal(enable)} />
            <div className="switchLabel">{state.strings.enableSealed}</div>
          </div>
          { (state.sealMode === 'updating' || state.sealMode === 'enabling') && (
            <div className="sealChange">
              <Input.Password placeholder={state.strings.newPassword} spellCheck="false" onChange={(e) => actions.setSealPassword(e.target.value)}
                autocomplete="new-password" prefix={<LockOutlined />} />
            </div>
          )}
          { (state.sealMode === 'updating' || state.sealMode === 'enabling') && (
            <div className="sealChange">
              <Input.Password placeholder={state.strings.confirmPassword} spellCheck="false" onChange={(e) => actions.setSealConfirm(e.target.value)}
                autocomplete="new-password" prefix={<LockOutlined />} />
            </div>
          )}
          { state.sealMode === 'disabling' && (
            <div className="sealChange">
              <Input placeholder={state.strings.deleteKey} spellCheck="false" onChange={(e) => actions.setSealDelete(e.target.value)}
                prefix={<ExclamationCircleOutlined />} />
            </div>
          )}
          { state.sealMode === 'enabled' && (
            <div className="sealChange" onClick={() => actions.updateSeal()}>
              <Input.Password defaultValue="xxxxxxxxxx" disabled={true} prefix={<LockOutlined />} />
              <div className="editPassword" />
            </div>
          )}
          { state.sealMode === 'unlocking' && (
            <div className="sealChange">
              <Input.Password placeholder={state.strings.password} spellCheck="false" onChange={(e) => actions.setSealUnlock(e.target.value)}
                prefix={<LockOutlined />} />
            </div>
          )}
          <div className="controls">
            <Button key="back" onClick={actions.clearEditSeal}>{state.strings.cancel}</Button>
            { state.sealMode === 'enabled' && (
              <Button key="save" type="primary" onClick={saveSeal} loading={state.busy}>{state.strings.forget}</Button>
            )}
            { state.sealMode === 'unlocking' && (
              <Button key="save" type="primary" onClick={saveSeal} className={actions.canSaveSeal() ? 'saveEnabled' : 'saveDisabled'} disabled={!actions.canSaveSeal()} loading={state.busy}>{state.strings.unlock}</Button>
            )}
            { state.sealMode !== 'unlocking' && state.sealMode !== 'enabled' && (
              <Button key="save" type="primary" onClick={saveSeal} className={actions.canSaveSeal() ? 'saveEnabled' : 'saveDisabled'} disabled={!actions.canSaveSeal()} loading={state.busy}>{state.strings.save}</Button>
            )}
          </div>
        </SealModal>
      </Modal>
      <Modal centered closable={false} footer={null} visible={state.editLogin} bodyStyle={{ borderRadius: 8, padding: 16, ...state.menuStyle }} onCancel={actions.clearEditLogin}>
        <LoginModal>
          <div className="title">{state.strings.changeLogin}</div>
          <Input className="loginValue" placeholder={state.strings.username} spellCheck="false" onChange={(e) => actions.setEditHandle(e.target.value)}
              defaultValue={state.editHandle} autocomplete="username" autocapitalize="none" prefix={<UserOutlined />} />

          <Input.Password className="loginValue" placeholder={state.strings.newPassword} spellCheck="false" onChange={(e) => actions.setEditPassword(e.target.value)}
              autocomplete="new-password" prefix={<LockOutlined />} />

          <Input.Password className="loginValue" placeholder={state.strings.confirmPassword} spellCheck="false" onChange={(e) => actions.setEditConfirm(e.target.value)}
              autocomplete="new-password" prefix={<LockOutlined />} />
          <div className="controls">
            <Button key="back" onClick={actions.clearEditLogin}>{state.strings.cancel}</Button>
            <Button key="save" type="primary" className={actions.canSaveLogin() ? 'saveEnabled' : 'saveDisabled'} onClick={saveLogin}
                disabled={!actions.canSaveLogin()} loading={state.busy}>{state.strings.save}</Button>
          </div>
        </LoginModal>
      </Modal>
      <Modal centerd closable={false} footer={null} visible={state.mfaModal} destroyOnClose={true} bodyStyle={{ borderRadius: 8, padding: 16, ...state.menuStyle }} onCancel={actions.dismissMFA}>
        <MFAModal>
          <div className="title">Multi-Factor Authentication</div>
          <div className="description">Store the secret and confirm the verification code</div>
          <img src={state.mfaImage} alt="QRCode" />
          <div className="secret">
            <div className="label">{ state.mfaSecret }</div>
            <CopyButton onCopy={async () => await navigator.clipboard.writeText(state.mfaSecret)} />
          </div>
          <Input.OTP onChange={actions.setCode} />
          <div className="alert">
            { state.mfaError && state.mfaErrorCode == 'Error: 401' && (
              <span>verification code error</span>
            )}
            { state.mfaError && state.mfaErrorCode == 'Error: 429' && (
              <span>verification temporarily disabled</span>
            )}
          </div>
          <div className="controls">
            <Button key="back" onClick={actions.dismissMFA}>{state.strings.cancel}</Button>
            <Button key="save" type="primary" className={state.mfaCode ? 'saveEnabled' : 'saveDisabled'} onClick={actions.confirmMFA}
                disabled={!state.mfaCode} loading={state.busy}>Confirm</Button>
          </div>
        </MFAModal>
      </Modal>
    </AccountAccessWrapper>
  );
}

