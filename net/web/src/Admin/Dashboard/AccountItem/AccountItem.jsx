import { Avatar } from 'avatar/Avatar';
import { AccountItemWrapper, DeleteButton, EnableButton, DisableButton, ResetButton } from './AccountItem.styled';
import { useAccountItem } from './useAccountItem.hook';
import { UserDeleteOutlined, UnlockOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

export function AccountItem({ token, item }) {

  const { state, actions } = useAccountItem(token, item);

  const Enable = () => {
    if (state.disabled) {
      return (
        <Tooltip placement="topLeft" title="Enable Account">
          <EnableButton type="text" size="large" icon={<CheckCircleOutlined />}
              onClick={() => actions.setStatus(false)}></EnableButton>
        </Tooltip>
      )
    }
    return (
      <Tooltip placement="topLeft" title="Disable Account">
        <DisableButton type="text" size="large" icon={<CloseCircleOutlined />}
              onClick={() => actions.setStatus(true)}></DisableButton>
      </Tooltip>
    )
  }

  return (
    <AccountItemWrapper>
      <div class="avatar">
        <Avatar imageUrl={state.imageUrl} />
      </div>
      <div class={state.activeClass}>
        <div class="handle">{ state.handle }</div>
        <div class="guid">{ state.guid }</div>
      </div>
      <div class="control">
        <Tooltip placement="topLeft" title="Reset Password">
          <ResetButton type="text" size="large" icon={<UnlockOutlined />}></ResetButton>
        </Tooltip>
        <Enable />
        <Tooltip placement="topLeft" title="Delete Account">
          <DeleteButton type="text" size="large" icon={<UserDeleteOutlined />}></DeleteButton>
        </Tooltip>
      </div>
    </AccountItemWrapper>
  );
}

