import { Logo } from 'logo/Logo';
import { AccountItemWrapper, AccessLayout, DeleteButton, EnableButton, DisableButton, ResetButton } from './AccountItem.styled';
import { useAccountItem } from './useAccountItem.hook';
import { ExclamationCircleOutlined, UserDeleteOutlined, UnlockOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Modal, Tooltip, Button } from 'antd';
import { CopyButton } from '../copyButton/CopyButton';

export function AccountItem({ item, remove }) {

  const [ modal, modalContext ] = Modal.useModal();
  const { state, actions } = useAccountItem(item, remove);

  const removeAccount = () => {
    modal.confirm({
      title: 'Are you sure you want to delete the account?',
      icon: <ExclamationCircleOutlined />,
      bodyStyle: { padding: 16 },
      onOk() {
        applyRemoveAccount();
      },
      onCancel() {},
    });
  }

  const applyRemoveAccount = async () => {
    try {
      await actions.remove();
    }
    catch(err) {
      modal.error({ 
        title: 'Failed to Remove Account',
        content: 'Please try again.',
        bodyStyle: { padding: 16 },
      });
    }
  }

  const applyAccountStatus = async (status) => {
    try {
      await actions.setStatus(status);
    }
    catch(err) {
      modal.error({
        title: 'Failed to Set Account Status',
        content: 'Please try again.',
        bodyStyle: { padding: 16 },
      });
    }
  }

  const setAccountAccess = async () => {
    try {
      await actions.setAccessLink();
    }
    catch(err) {
      modal.error({
        title: 'Failed to Set Account Access',
        content: 'Please try again.',
        bodyStyle: { padding: 16 },
      });
    }
  }

  const onClipboard = (value) => {
    navigator.clipboard.writeText(value);
  };

  const accessLink = () => {
    return window.location.origin + '/#/login?access=' + state.accessToken;
  };

  return (
    <AccountItemWrapper>
      { modalContext }
      <div className="avatar">
        <Logo url={state.imageUrl} width={32} height={32} radius={4} />
      </div>
      <div className={state.activeClass}>
        <div className="handle">
          <span>{ state.handle }</span>
          { state?.storage > 0 && (
            <span className="storage">{ state.storage } { state.storageUnit }</span>
          )}
        </div>
        <div className="guid">{ state.guid }</div>
      </div>
      <div className="control">
        { state.display === 'small' && (
          <>
            <ResetButton type="text" size="large" icon={<UnlockOutlined />}
                loading={state.accessBusy} onClick={setAccountAccess}></ResetButton>
            { state.disabled && (
              <EnableButton type="text" size="large" icon={<CheckCircleOutlined />}
                  loading={state.statusBusy} onClick={() => applyAccountStatus(false)}></EnableButton>
            )}
            { !state.disabled && (
              <DisableButton type="text" size="large" icon={<CloseCircleOutlined />}
                    loading={state.statusBusy} onClick={() => applyAccountStatus(true)}></DisableButton>
            )}
            <DeleteButton type="text" size="large" icon={<UserDeleteOutlined />}
                loading={state.removeBusy} onClick={removeAccount}></DeleteButton>
          </>
        )}
        { state.display !== 'small' && (
          <>
            <Tooltip placement="topLeft" title="Account Login Link">
              <ResetButton type="text" size="large" icon={<UnlockOutlined />}
                  loading={state.accessBusy} onClick={setAccountAccess}></ResetButton>
            </Tooltip>
            { state.disabled && (
              <Tooltip placement="topLeft" title="Enable Account">
                <EnableButton type="text" size="large" icon={<CheckCircleOutlined />}
                    loading={state.statusBusy} onClick={() => applyAccountStatus(false)}></EnableButton>
              </Tooltip>
            )}
            { !state.disabled && (
              <Tooltip placement="topLeft" title="Disable Account">
                <DisableButton type="text" size="large" icon={<CloseCircleOutlined />}
                      loading={state.statusBusy} onClick={() => applyAccountStatus(true)}></DisableButton>
              </Tooltip>
            )}
            <Tooltip placement="topLeft" title="Delete Account">
              <DeleteButton type="text" size="large" icon={<UserDeleteOutlined />}
                  loading={state.removeBusy} onClick={removeAccount}></DeleteButton>
            </Tooltip>
          </>
        )}
      </div>
      <Modal title="Access Account" visible={state.showAccess} centered width="fitContent"
          footer={[ <Button type="primary" onClick={() => actions.setShowAccess(false)}>OK</Button> ]}
          bodyStyle={{ padding: 16 }} onCancel={() => actions.setShowAccess(false)}>
        <AccessLayout>
          <div className="url">
            <div className="label">Browser Link:</div>
            <div className="link">{accessLink()}</div>
            <CopyButton onCopy={async () => await onClipboard(accessLink())} />
          </div>
          <div className="url">
            <div className="label">App Token:</div>
            <div className="token">{state.accessToken}</div>
            <CopyButton onCopy={async () => await onClipboard(state.accessToken)} />
          </div>
        </AccessLayout>
      </Modal>  
    </AccountItemWrapper>
  );
}

