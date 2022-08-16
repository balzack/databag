import { Dropdown, Menu, Tooltip } from 'antd';
import { Logo } from 'logo/Logo';
import { IdentityWrapper, ErrorNotice, InfoNotice } from './Identity.styled';
import { useIdentity } from './useIdentity.hook';
import { InfoCircleOutlined, ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';

export function Identity({ openAccount, openCards, cardUpdated }) {

  const { state, actions } = useIdentity();

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <div onClick={openAccount}>Account</div>
      </Menu.Item>
      <Menu.Item key="1">
        <div onClick={openCards}>Contacts</div>
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
          <Logo url={state.url} width={40} height={40} radius={4} />
        )}
        <div class="label">
          <div class="name">{state.name}</div>
          <div class="handle">
            <div class="notice">
              { state.disconnected && ( 
                <Tooltip placement="right" title="disconnected from server">
                  <ErrorNotice>
                    <ExclamationCircleOutlined />
                  </ErrorNotice>
                </Tooltip>
              )}
            </div>
            <div>{state.handle}</div>
            <div class="notice">
              { cardUpdated && (
                <Tooltip placement="right" title="contacts have updated">
                  <InfoNotice>
                    <InfoCircleOutlined />
                  </InfoNotice>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
        <div class="drop">
          <DownOutlined />
        </div>
      </IdentityWrapper>
    </Dropdown>
  );
}

