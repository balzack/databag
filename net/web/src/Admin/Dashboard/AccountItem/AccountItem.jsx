import { Avatar } from 'avatar/Avatar';
import { AccountItemWrapper, DeleteButton, EnableButton, DisableButton, ResetButton } from './AccountItem.styled';
import { useAccountItem } from './useAccountItem.hook';
import { UserDeleteOutlined, UnlockOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

export function AccountItem({ token, item }) {

  const { state, actions } = useAccountItem(token, item);

  const Enable = () => {
    if (state.disabled) {
      return <EnableButton type="text" size="large" icon={<CloseCircleOutlined />}></EnableButton>
    }
    return <DisableButton type="text" size="large" icon={<CheckCircleOutlined />}></DisableButton>
  }

  return (
    <AccountItemWrapper>
      <div class="avatar">
        <Avatar imageUrl={state.imageUrl} />
      </div>
      <div class="id">
        <div class="handle">{ state.handle }</div>
        <div class="guid">{ state.guid }</div>
      </div>
      <div class="control">
        <ResetButton type="text" size="large" icon={<UnlockOutlined />}></ResetButton>
        <Enable />
        <DeleteButton type="text" size="large" icon={<UserDeleteOutlined />}></DeleteButton>
      </div>
    </AccountItemWrapper>
  );
}

