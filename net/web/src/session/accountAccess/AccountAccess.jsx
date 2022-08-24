import { AccountAccessWrapper, EditFooter } from './AccountAccess.styled';
import { useAccountAccess } from './useAccountAccess.hook';
import { AccountLogin } from './accountLogin/AccountLogin';
import { Button, Modal, Checkbox } from 'antd';
import { LockOutlined } from '@ant-design/icons';

export function AccountAccess() {

  const { state, actions } = useAccountAccess();

  const saveSearchable = async (e) => {
    try {
      await actions.setSearchable(e.target.checked);
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

  return (
    <AccountAccessWrapper>
      <Checkbox checked={state.searchable} onChange={(e) => saveSearchable(e)}>Visible in Registry</Checkbox>
      <div class="link" onClick={actions.setEditLogin}>
        <LockOutlined />
        <div class="label">Change Login</div>
      </div>
      <Modal title="Account Login" centered visible={state.editLogin} footer={editLoginFooter}
          onCancel={actions.clearEditLogin}>
        <AccountLogin state={state} actions={actions} />
      </Modal>
    </AccountAccessWrapper>
  );
}

