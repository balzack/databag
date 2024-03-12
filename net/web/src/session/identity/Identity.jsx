import { useRef } from 'react';
import { Modal, Switch, Dropdown, Menu, Tooltip } from 'antd';
import { Logo } from 'logo/Logo';
import { IdentityWrapper, LogoutContent, ErrorNotice, InfoNotice } from './Identity.styled';
import { useIdentity } from './useIdentity.hook';
import { LogoutOutlined, InfoCircleOutlined, ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';

export function Identity({ openAccount, openCards, cardUpdated }) {

  const [modal, modalContext] = Modal.useModal();
  const { state, actions } = useIdentity();
  const all = useRef(false);

  const logout = () => {
    modal.confirm({
      title: <span style={state.menuStyle}>{state.strings.confirmLogout}</span>,
      icon: <LogoutOutlined />,
      content: <LogoutContent onClick={(e) => e.stopPropagation()}>
                <span className="logoutMode">{ state.strings.allDevices }</span>
                <Switch onChange={(e) => all.current = e} size="small" />
               </LogoutContent>,
      bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      okText: state.strings.ok,
      onOk() {
        actions.logout(all.current);
      },
      cancelText: state.strings.cancel,
      onCancel() {},
    });
  }

  const menu = (
    <Menu style={state.menuStyle}>
      <Menu.Item style={state.menuStyle} key="0">
        <div onClick={openCards}>{ state.strings.contacts }</div>
      </Menu.Item>
      <Menu.Item style={state.menuStyle} key="1">
        <div onClick={openAccount}>{ state.strings.settings }</div>
      </Menu.Item>
      <Menu.Item style={state.menuStyle} key="2">
        <div onClick={logout}>{ state.strings.logout }</div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="bottomRight">
      <IdentityWrapper>
        { modalContext }
        { state.init && (
          <Logo url={state.url} width={40} height={40} radius={4} />
        )}
        <div className="label">
          <div className="name">{state.name}</div>
          <div className="handle">
            <div className="notice">
              { state.status !== 'connected' && ( 
                <Tooltip placement="right" title={state.strings.disconnected}>
                  <ErrorNotice>
                    <ExclamationCircleOutlined />
                  </ErrorNotice>
                </Tooltip>
              )}
            </div>
            <div>{state.handle}</div>
            <div className="notice">
              { cardUpdated && (
                <Tooltip placement="right" title={state.strings.contactsUpdated}>
                  <InfoNotice>
                    <InfoCircleOutlined />
                  </InfoNotice>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
        <div className="drop">
          <DownOutlined />
        </div>
      </IdentityWrapper>
    </Dropdown>
  );
}


