import { useContext } from 'react';
import { AppContext } from 'context/AppContext';
import { Dropdown, Menu, Tooltip } from 'antd';
import { Logo } from 'logo/Logo';
import { IdentityWrapper } from './Identity.styled';
import { useIdentity } from './useIdentity.hook';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';

export function Identity() {

  const { state, actions } = useIdentity();

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <div>Edit Profile</div>
      </Menu.Item>
      <Menu.Item key="1">
        <div>Change Login</div>
      </Menu.Item>
      <Menu.Item key="2">
        <div onClick={actions.logout}>Logout</div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="bottomRight">
      <IdentityWrapper>
        { state.init && (
          <Logo url={state.url} width={48} height={48} radius={4} />
        )}
        <div class="label">
          <div class="name">{state.name}</div>
          <div class="handle">
            <div class="alert">
              { state.disconnected && ( 
                <Tooltip placement="right" title="disconnected from server">
                  <ExclamationCircleOutlined />
                </Tooltip>
              )}
            </div>
            <div>{state.handle}</div>
            <div class="alert"></div>
          </div>
        </div>
        <div class="drop">
          <DownOutlined />
        </div>
      </IdentityWrapper>
    </Dropdown>
  );
}

