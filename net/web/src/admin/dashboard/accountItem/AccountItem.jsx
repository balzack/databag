import { Logo } from 'logo/Logo';
import { AccountItemWrapper, AccessLayout, DeleteButton, EnableButton, DisableButton, ResetButton } from './AccountItem.styled';
import { useAccountItem } from './useAccountItem.hook';
import { ExclamationCircleOutlined, CopyOutlined, UserDeleteOutlined, UnlockOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Modal, Tooltip, Button } from 'antd';

export function AccountItem({ token, item, remove }) {

  const { state, actions } = useAccountItem(token, item, remove);

  const removeAccount = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete the account?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        actions.remove();
      },
      onCancel() {},
    });
  }

  const onClipboard = (value) => {
    navigator.clipboard.writeText(value);
  };

  const Enable = () => {
    if (state.disabled) {
      return (
        <Tooltip placement="topLeft" title="Enable Account">
          <EnableButton type="text" size="large" icon={<CheckCircleOutlined />}
              loading={state.statusBusy} onClick={() => actions.setStatus(false)}></EnableButton>
        </Tooltip>
      )
    }
    return (
      <Tooltip placement="topLeft" title="Disable Account">
        <DisableButton type="text" size="large" icon={<CloseCircleOutlined />}
              loading={state.statusBusy} onClick={() => actions.setStatus(true)}></DisableButton>
      </Tooltip>
    )
  }

  const accessLink = () => {
    return window.location.origin + '/#/login?access=' + state.accessToken;
  };

  return (
    <AccountItemWrapper>
      <div class="avatar">
        <Logo url={state.imageUrl} width={32} height={32} radius={4} />
      </div>
      <div class={state.activeClass}>
        <div class="handle">{ state.handle }</div>
        <div class="guid">{ state.guid }</div>
      </div>
      <div class="control">
        <Tooltip placement="topLeft" title="Account Login Link">
          <ResetButton type="text" size="large" icon={<UnlockOutlined />}
              loading={state.accessBusy} onClick={() => actions.setAccessLink()}></ResetButton>
        </Tooltip>
        <Enable />
        <Tooltip placement="topLeft" title="Delete Account">
          <DeleteButton type="text" size="large" icon={<UserDeleteOutlined />}
              loading={state.removeBusy} onClick={removeAccount}></DeleteButton>
        </Tooltip>
      </div>
      <Modal title="Access Account Link" visible={state.showAccess} centered width="fitContent"
          footer={[ <Button type="primary" onClick={() => actions.setShowAccess(false)}>OK</Button> ]}
          onCancel={() => actions.setShowAccess(false)}>
        <AccessLayout>
          <div class="url">
            <div class="link">{accessLink()}</div>
            <Button icon={<CopyOutlined />} size="small"
              onClick={() => onClipboard(accessLink())}/>
          </div>
        </AccessLayout>
      </Modal>  
    </AccountItemWrapper>
  );
}

