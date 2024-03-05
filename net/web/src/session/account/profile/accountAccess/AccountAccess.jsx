import { AccountAccessWrapper, LoginModal, SealModal } from './AccountAccess.styled';
import { useAccountAccess } from './useAccountAccess.hook';
import { Button, Modal, Switch, Input, Radio, Select } from 'antd';
import { SettingOutlined, UserOutlined, LockOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export function AccountAccess() {

  const [ modal, modalContext ] = Modal.useModal();
  const { state, actions } = useAccountAccess();

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
                options={state.themes}
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
                options={state.languages}
              />
          </div>
          <div className="option">
            <div className="label">{state.strings.microphone}</div>
            <Select
               defaultValue={null}
                style={{ width: '60%' }}
                size="small"
                value={state.audioInput}
                onChange={actions.setAudio}
                options={[ { value: null, label: 'Default' }, ...state.audioInputs ]}
              />
          </div>
          <div className="option">
            <div className="label">{state.strings.camera}</div>
            <Select
               defaultValue={null}
                style={{ width: '60%' }}
                size="small"
                value={state.videoInput}
                onChange={actions.setVideo}
                options={[ { value: null, label: 'Default' }, ...state.videoInputs ]}
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
    </AccountAccessWrapper>
  );
}

