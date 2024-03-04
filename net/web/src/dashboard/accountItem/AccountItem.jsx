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
      title: <span style={state.menuStyle}>{state.strings.confirmDelete}</span>,
      content: <span style={state.menuStyle}>{state.strings.areSure}</span>,
      icon: <ExclamationCircleOutlined />,
      bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      okText: state.strings.remove,
      cancelText: state.strings.cancel,
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
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  }

  const applyAccountStatus = async (status) => {
    try {
      await actions.setStatus(status);
    }
    catch(err) {
      modal.error({
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  }

  const setAccountAccess = async () => {
    try {
      await actions.setAccessLink();
    }
    catch(err) {
      modal.error({
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
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
            <Tooltip placement="topLeft" title={state.strings.accessAccount}>
              <ResetButton type="text" size="large" icon={<UnlockOutlined />}
                  loading={state.accessBusy} onClick={setAccountAccess}></ResetButton>
            </Tooltip>
            { state.disabled && (
              <Tooltip placement="topLeft" title={state.strings.enableAccount}>
                <EnableButton type="text" size="large" icon={<CheckCircleOutlined />}
                    loading={state.statusBusy} onClick={() => applyAccountStatus(false)}></EnableButton>
              </Tooltip>
            )}
            { !state.disabled && (
              <Tooltip placement="topLeft" title={state.strings.disableAccount}>
                <DisableButton type="text" size="large" icon={<CloseCircleOutlined />}
                      loading={state.statusBusy} onClick={() => applyAccountStatus(true)}></DisableButton>
              </Tooltip>
            )}
            <Tooltip placement="topLeft" title={state.strings.deleteAccount}>
              <DeleteButton type="text" size="large" icon={<UserDeleteOutlined />}
                  loading={state.removeBusy} onClick={removeAccount}></DeleteButton>
            </Tooltip>
          </>
        )}
      </div>
      <Modal bodyStyle={{ borderRadius: 8, padding: 16, ...state.menuStyle }} closable={false} visible={state.showAccess} centered width="fitContent"
          footer={null} onCancel={() => actions.setShowAccess(false)}>
        <AccessLayout>
          <div className="header">{ state.strings.accessAccount }</div>
          <div className="url">
            <div className="label">{ state.strings.browserLink }</div>
            <div className="link">{accessLink()}</div>
            <CopyButton onCopy={async () => await onClipboard(accessLink())} />
          </div>
          <div className="url">
            <div className="label">{ state.strings.mobileToken }</div>
            <div className="token">{state.accessToken}</div>
            <CopyButton onCopy={async () => await onClipboard(state.accessToken)} />
          </div>
          <div className="control">
            <Button type="primary" onClick={() => actions.setShowAccess(false)}>{state.strings.ok}</Button>
          </div>
        </AccessLayout>
      </Modal>  
    </AccountItemWrapper>
  );
}

