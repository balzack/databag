import { AccountWrapper } from './Account.styled';
import { CloseOutlined } from '@ant-design/icons';
import { SettingOutlined } from '@ant-design/icons';
import { AccountAccess } from './profile/accountAccess/AccountAccess';
import { useAccount } from './useAccount.hook';

export function Account({ closeAccount, openProfile }) {
  const { state } = useAccount();

  return (
    <AccountWrapper>
      <div className="header">
        <div className="label">{state.strings.settings}</div>
        <div
          className="dismiss"
          onClick={closeAccount}
        >
          <CloseOutlined />
        </div>
      </div>
      <div className="content">
        <AccountAccess />
        <div className="bottom">
          <div
            className="link"
            onClick={openProfile}
          >
            <SettingOutlined />
            <div className="label">{state.strings.updateProfile}</div>
          </div>
        </div>
      </div>
    </AccountWrapper>
  );
}
