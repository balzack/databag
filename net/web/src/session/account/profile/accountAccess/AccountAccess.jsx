import { AccountAccessWrapper, SealModal, EditFooter } from './AccountAccess.styled';
import { useAccountAccess } from './useAccountAccess.hook';
import { Button, Modal, Switch, Form, Input, Radio, Select } from 'antd';
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
        title: 'Failed to Set Sealing Key',
        comment: 'Please try again.',
        bodyStyle: { padding: 16 },
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
        title: 'Update Registry Failed',
        content: 'Please try again.',
        bodyStyle: { padding: 16 },
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
        title: 'Failed to Save',
        comment: 'Please try again.',
        bodyStyle: { padding: 16 },
      });
    }
  }

  const editLoginFooter = (
    <EditFooter>
      <div className="select"></div>
      <Button key="back" onClick={actions.clearEditLogin}>Cancel</Button>
      <Button key="save" type="primary" onClick={saveLogin} disabled={!actions.canSaveLogin()} loading={state.busy}>Save</Button>
    </EditFooter>
  );

  const editSealFooter = (
    <EditFooter>
      <div className="select"></div>
      <Button key="back" onClick={actions.clearEditSeal}>Cancel</Button>
      { state.sealMode === 'enabled' && (
        <Button key="save" type="primary" onClick={saveSeal} loading={state.busy}>Forget</Button>
      )}
      { state.sealMode === 'unlocking' && (
        <Button key="save" type="primary" onClick={saveSeal} disabled={!actions.canSaveSeal()} loading={state.busy}>Unlock</Button>
      )}
      { state.sealMode !== 'unlocking' && state.sealMode !== 'enabled' && (
        <Button key="save" type="primary" onClick={saveSeal} disabled={!actions.canSaveSeal()} loading={state.busy}>Save</Button>
      )}
    </EditFooter>
  );
        
  return (
    <AccountAccessWrapper>
      { modalContext }
      <div className="account">
        <div className="section">Application</div>
        <div className="controls">
          <div className="option">
            <div className="label">Time Format</div>
            <Radio.Group onChange={actions.setTimeFormat} value={state.timeFormat}>
              <Radio value={'12h'}>12h</Radio>
              <Radio value={'24h'}>24h</Radio>
            </Radio.Group>
          </div>
          <div className="option">
            <div className="label">Date Format</div>
            <Radio.Group onChange={actions.setDateFormat} value={state.dateFormat}>
              <Radio value={'mm/dd'}>mm/dd</Radio>
              <Radio value={'dd/mm'}>dd/mm</Radio>
            </Radio.Group>
          </div>
          <div className="option">
            <div className="label">Theme</div>
            <Select
                defaultValue={null}
                style={{ width: 128 }}
                value={state.theme}
                onChange={actions.setTheme}
                options={[
                  { value: null, label: 'Default' },
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
              />
          </div>
          <div className="option">
            <div className="label">Language</div>
            <Select
                defaultValue={null}
                style={{ width: 128 }}
                value={state.language}
                onChange={actions.setLanguage}
                options={state.languages}
              />
          </div>
        </div>
      </div>
      <div className="account">
        <div className="section">Account</div>
        <div className="controls">
          <div className="switch">
            <Switch size="small" checked={state.searchable} onChange={enable => saveSearchable(enable)} />
            <div className="switchLabel">Visible in Registry &nbsp;&nbsp;</div>
          </div>
          <div className="link" onClick={actions.setEditSeal}>
            <SettingOutlined />
            <div className="label">Sealed Topics</div>
          </div>
          <div className="link" onClick={actions.setEditLogin}>
            <LockOutlined />
            <div className="label">Change Login</div>
          </div>
        </div>
      </div>
      <Modal title="Topic Sealing Key" centered visible={state.editSeal} footer={editSealFooter} onCancel={actions.clearEditSeal} bodyStyle={{ padding: 16 }}>
        <SealModal>
          <div className="switch">
            <Switch size="small" checked={state.sealEnabled} onChange={enable => actions.enableSeal(enable)} />
            <div className="switchLabel">Enable Sealed Topics</div>
          </div>
          { (state.sealMode === 'updating' || state.sealMode === 'enabling') && (
            <div className="sealPassword">
              <Input.Password placeholder="New Password" spellCheck="false" onChange={(e) => actions.setSealPassword(e.target.value)}
                autocomplete="new-password" prefix={<LockOutlined />} />
            </div>
          )}
          { (state.sealMode === 'updating' || state.sealMode === 'enabling') && (
            <div className="sealPassword">
              <Input.Password placeholder="Confirm Password" spellCheck="false" onChange={(e) => actions.setSealConfirm(e.target.value)}
                autocomplete="new-password" prefix={<LockOutlined />} />
            </div>
          )}
          { state.sealMode === 'disabling' && (
            <div className="sealPassword">
              <Input placeholder="Type 'delete' to remove key" spellCheck="false" onChange={(e) => actions.setSealDelete(e.target.value)}
                prefix={<ExclamationCircleOutlined />} />
            </div>
          )}
          { state.sealMode === 'enabled' && (
            <div className="sealPassword" onClick={() => actions.updateSeal()}>
              <Input.Password defaultValue="xxxxxxxxxx" disabled={true} prefix={<LockOutlined />} />
              <div className="editPassword" />
            </div>
          )}
          { state.sealMode === 'unlocking' && (
            <div className="sealPassword">
              <Input.Password placeholder="Password" spellCheck="false" onChange={(e) => actions.setSealUnlock(e.target.value)}
                prefix={<LockOutlined />} />
            </div>
          )}
        </SealModal>
      </Modal>
      <Modal title="Account Login" centered visible={state.editLogin} footer={editLoginFooter}
          bodyStyle={{ paddingLeft: 16, paddingRight: 16 }} onCancel={actions.clearEditLogin}>
        <Form name="basic" wrapperCol={{ span: 24, }}>
            <Form.Item name="username" validateStatus={state.editStatus} help={state.editMessage}>
              <Input placeholder="Username" spellCheck="false" onChange={(e) => actions.setEditHandle(e.target.value)}
                  defaultValue={state.editHandle} autocomplete="username" autocapitalize="none" prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item name="password">
              <Input.Password placeholder="Password" spellCheck="false" onChange={(e) => actions.setEditPassword(e.target.value)}
                  autocomplete="new-password" prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item name="confirm">
              <Input.Password placeholder="Confirm Password" spellCheck="false" onChange={(e) => actions.setEditConfirm(e.target.value)}
                  autocomplete="new-password" prefix={<LockOutlined />} />
            </Form.Item>
        </Form>
      </Modal>
    </AccountAccessWrapper>
  );
}

