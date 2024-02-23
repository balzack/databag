import { AccountWrapper } from './Account.styled';
import { RightOutlined } from '@ant-design/icons';
import { SettingOutlined } from '@ant-design/icons';
import { AccountAccess } from './profile/accountAccess/AccountAccess';

export function Account({ closeAccount, openProfile }) {

  return (
    <AccountWrapper>
      <div className="header">
        <div className="label">Settings</div>
        <div className="dismiss" onClick={closeAccount}>
          <RightOutlined />
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

