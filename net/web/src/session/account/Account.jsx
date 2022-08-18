import { AccountWrapper } from './Account.styled';
import { DoubleRightOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd';
import { SettingOutlined, LockOutlined } from '@ant-design/icons';
import { AccountAccess } from '../accountAccess/AccountAccess';

export function Account({ closeAccount, openProfile }) {

  return (
    <AccountWrapper>
      <div class="header">
        <div class="label">Account</div>
        <div class="dismiss" onClick={closeAccount}>
          <DoubleRightOutlined />
        </div>
      </div>
      <div class="content">
        <div class="link" onClick={openProfile}>
          <SettingOutlined />
          <div class="label">Update Profile</div>
        </div>
        <AccountAccess />
      </div>
    </AccountWrapper>
  );
}

