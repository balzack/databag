import { DashboardWrapper, SettingsButton, AddButton, SettingsLayout, CreateLayout } from './Dashboard.styled';
import { Tooltip, Checkbox, Select, Button, Modal, Input, InputNumber, List } from 'antd';
import { SettingOutlined, CopyOutlined, UserAddOutlined, LogoutOutlined, ReloadOutlined } from '@ant-design/icons';
import { useDashboard } from './useDashboard.hook';
import { AccountItem } from './accountItem/AccountItem';

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
          <div class="field">
            <div>Federated Host:&nbsp;</div>
            <Input placeholder="domain:port/app" onChange={(e) => actions.setHost(e.target.value)}
                value={state.domain} />
          </div>
          <div class="field">
            <div>Storage Limit (GB) / Account:&nbsp;</div>
            <InputNumber defaultValue={0} onChange={(e) => actions.setStorage(e)}
                placeholder="0 for unrestricted" value={state.accountStorage} />
          </div>
          <div class="field">
            <div>Account Key Type:&nbsp;</div>
            <Select labelInValue defaultValue={{ value: 'RSA4096', label: 'RSA 4096' }}
                value={state.keyType} onChange={(o) => actions.setKeyType(o.value)}>
              <Select.Option value="RSA2048">RSA 2048</Select.Option>
              <Select.Option value="RSA4096">RSA 4096</Select.Option>
            </Select>
          </div>
          <div class="field">
            <Checkbox onChange={(e) => actions.setEnableImage(e.target.checked)}
              defaultChecked={true} checked={state.enableImage}>Enable Image Queue</Checkbox>
          </div>
          <div class="field">
            <Checkbox onChange={(e) => actions.setEnableAudio(e.target.checked)}
              defaultChecked={true} checked={state.enableAudio}>Enable Audio Queue</Checkbox>
          </div>
          <div class="field">
            <Checkbox onChange={(e) => actions.setEnableVideo(e.target.checked)}
              defaultChecked={true} checked={state.enableVideo}>Enable Video Queue</Checkbox>
          </div>
        </SettingsLayout>
      </Modal>
      <Modal title="Create Account Link" visible={state.showCreate} centered width="fitContent"
          footer={[ <Button type="primary" onClick={() => actions.setShowCreate(false)}>OK</Button> ]}
          onCancel={() => actions.setShowCreate(false)}>
        <CreateLayout>
          <div class="url">
            <div class="link">{createLink()}</div>
            <Button icon={<CopyOutlined />} size="small"
              onClick={() => onClipboard(createLink())} />
          </div>
        </CreateLayout>
      </Modal>    
    </DashboardWrapper>
  );
}

