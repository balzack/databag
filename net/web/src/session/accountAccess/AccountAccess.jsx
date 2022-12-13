import { AccountAccessWrapper, SealModal, EditFooter } from './AccountAccess.styled';
import { useAccountAccess } from './useAccountAccess.hook';
import { AccountLogin } from './accountLogin/AccountLogin';
import { Button, Modal, Switch, Input } from 'antd';
import { SettingOutlined, LockOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export function AccountAccess() {

  const { state, actions } = useAccountAccess();

  const saveSeal = async () => {
    try {
      await actions.saveSeal();
      actions.clearEditSeal();
    }
    catch (err) {
      console.log(err);
      Modal.error({
        title: 'Failed to Set Sealing Key',
        comment: 'Please try again.',
      });
    }
  }

  const saveSearchable = async (enable) => {
    try {
      await actions.setSearchable(enable);
    }
    catch (err) {
      console.log(err);
      Modal.error({
        title: 'Update Registry Failed',
        content: 'Please try again.',
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
      Modal.error({
        title: 'Failed to Save',
        comment: 'Please try again.',
      });
    }
  }

  const editLoginFooter = (
    <EditFooter>
      <div class="select"></div>
      <Button key="back" onClick={actions.clearEditLogin}>Cancel</Button>
      <Button key="save" type="primary" onClick={saveLogin} disabled={!actions.canSaveLogin()} loading={state.busy}>Save</Button>
    </EditFooter>
  );

  const editSealFooter = (
    <EditFooter>
      <div class="select"></div>
      <Button key="back" onClick={actions.clearEditSeal}>Cancel</Button>
      { state.sealMode === 'unlocking' && (
        <Button key="save" type="primary" onClick={saveSeal} disabled={!actions.canSaveSeal()} loading={state.busy}>Unlock</Button>
      )}
      { state.sealMode !== 'unlocking' && (
        <Button key="save" type="primary" onClick={saveSeal} disabled={!actions.canSaveSeal()} loading={state.busy}>Save</Button>
      )}
    </EditFooter>
  );
        
  return (
    <AccountAccessWrapper>
      <div class="switch">
        <Switch size="small" checked={state.searchable} onChange={enable => saveSearchable(enable)} />
        <div class="switchLabel">Visible in Registry &nbsp;&nbsp;</div>
      </div>
      <div class="link" onClick={actions.setEditSeal}>
        <SettingOutlined />
        <div class="label">Sealed Topics</div>
      </div>
      <div class="link" onClick={actions.setEditLogin}>
        <LockOutlined />
        <div class="label">Change Login</div>
      </div>
      <Modal title="Topic Sealing Key" centered visible={state.editSeal} footer={editSealFooter} onCancel={actions.clearEditSeal}>
        <SealModal>
          <div class="switch">
            <Switch size="small" checked={state.sealEnabled} onChange={enable => actions.enableSeal(enable)} />
            <div class="switchLabel">Enable Sealed Topics</div>
          </div>
          { (state.sealMode === 'updating' || state.sealMode === 'enabling') && (
            <div class="sealPassword">
              <Input.Password placeholder="New Password" spellCheck="false" onChange={(e) => actions.setSealPassword(e.target.value)}
                autocomplete="new-password" prefix={<LockOutlined />} />
            </div>
          )}
          { (state.sealMode === 'updating' || state.sealMode === 'enabling') && (
            <div class="sealPassword">
              <Input.Password placeholder="Confirm Password" spellCheck="false" onChange={(e) => actions.setSealConfirm(e.target.value)}
                autocomplete="new-password" prefix={<LockOutlined />} />
            </div>
          )}
          { state.sealMode === 'disabling' && (
            <div class="sealPassword">
              <Input placeholder="Type 'delete' to remove key" spellCheck="false" onChange={(e) => actions.setSealDelete(e.target.value)}
                prefix={<ExclamationCircleOutlined />} />
            </div>
          )}
          { state.sealMode === 'enabled' && (
            <div class="sealPassword" onClick={() => actions.updateSeal()}>
              <Input.Password defaultValue="xxxxxxxxxx" disabled={true} prefix={<LockOutlined />} />
              <div class="editPassword" />
            </div>
          )}
          { state.sealMode === 'unlocking' && (
            <div class="sealPassword">
              <Input.Password placeholder="Password" spellCheck="false" onChange={(e) => actions.setSealUnlock(e.target.value)}
                prefix={<LockOutlined />} />
            </div>
          )}
        </SealModal>
      </Modal>
      <Modal title="Account Login" centered visible={state.editLogin} footer={editLoginFooter}
          onCancel={actions.clearEditLogin}>
        <AccountLogin state={state} actions={actions} />
      </Modal>
    </AccountAccessWrapper>
  );
}

