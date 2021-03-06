import { DashboardWrapper, SettingsButton, AddButton, SettingsLayout, CreateLayout } from './Dashboard.styled';
import { Tooltip, Button, Modal, Input, InputNumber, Space, List } from 'antd';
import { SettingOutlined, CopyOutlined, UserAddOutlined, LogoutOutlined, ReloadOutlined } from '@ant-design/icons';
import { useDashboard } from './useDashboard.hook';
import { AccountItem } from './AccountItem/AccountItem';

export function Dashboard({ token, config, logout }) {

  const { state, actions } = useDashboard(token, config);

  const onClipboard = (value) => {
    navigator.clipboard.writeText(value);
  };

  const createLink = () => {
    return window.location.origin + '/#/create?add=' + state.createToken;
  };

  return (
    <DashboardWrapper>

      <div class="container">
        <div class="header">
          <div class="label">Accounts</div>
          <div class="settings">
            <Tooltip placement="topRight" title="Reload Accounts"> 
              <SettingsButton type="text" size="small" icon={<ReloadOutlined />}
                  onClick={() => actions.getAccounts()}></SettingsButton>
            </Tooltip>
          </div>
          <div class="settings">
            <Tooltip placement="topRight" title="Configure Server"> 
              <SettingsButton type="text" size="small" icon={<SettingOutlined />}
                  onClick={() => actions.setShowSettings(true)}></SettingsButton>
            </Tooltip>
          </div>
          <div class="settings">
            <Tooltip placement="topRight" title="Logout"> 
              <SettingsButton type="text" size="small" icon={<LogoutOutlined />}
                  onClick={() => logout()}></SettingsButton>
            </Tooltip>
          </div>
          <div class="add">
            <Tooltip placement="topRight" title="Create Account Link"> 
              <AddButton type="text" size="large" icon={<UserAddOutlined />}
                  loading={state.createBusy} onClick={() => actions.setCreateLink()}></AddButton>
            </Tooltip>
          </div>
        </div>

        <div class="body">
          <List
            locale={{ emptyText: '' }}
            itemLayout="horizontal"
            dataSource={state.accounts}
            loading={state.loading}
            renderItem={item => (<AccountItem token={token} item={item}
              remove={actions.removeAccount}/>)}
          />
        </div>
      </div>

      <Modal title="Settings" visible={state.showSettings} centered 
          okText="Save" onOk={() => actions.setSettings()} onCancel={() => actions.setShowSettings(false)}>
       <SettingsLayout direction="vertical">
          <div class="host">
            <div>Federated Host:&nbsp;</div>
            <Input placeholder="domain:port/app" onChange={(e) => actions.setHost(e.target.value)}
                value={state.host} />
          </div>
          <div class="storage">
            <div>Storage Limit (GB) / Account:&nbsp;</div>
            <InputNumber defaultValue={8} onChange={(e) => actions.setStorage(e)}
                placeholder="0 for unrestricted" value={state.storage} />
          </div>
        </SettingsLayout>
      </Modal>
      <Modal title="Create Account Link" visible={state.showCreate} centered width="fitContent"
          footer={[ <Button type="primary" onClick={() => actions.setShowCreate(false)}>OK</Button> ]}
          onCancel={() => actions.setShowCreate(false)}>
        <CreateLayout>
          <div>{createLink()}</div>
          <Button icon={<CopyOutlined />} size="small"
            onClick={() => onClipboard(createLink())}
          />
        </CreateLayout>
      </Modal>    
    </DashboardWrapper>
  );
}

