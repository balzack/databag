import { AccountWrapper } from './Account.styled';
import { DoubleRightOutlined } from '@ant-design/icons';
import { SettingOutlined } from '@ant-design/icons';
import { AccountAccess } from './profile/accountAccess/AccountAccess';

export function Account({ closeAccount, openProfile }) {

  return (
    <AccountWrapper>
      <div className="header">
        <div className="label">Account</div>
        <div className="dismiss" onClick={closeAccount}>
          <DoubleRightOutlined />
        </div>
      </div>
      <div className="content">
        <AccountAccess />
        <div className="bottom">
          <div className="link" onClick={openProfile}>
            <SettingOutlined />
            <div className="label">Update Profile</div>
          </div>
        </div>
      </div>
    </AccountWrapper>
  );
}

