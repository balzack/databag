import { AlertIcon, DashboardWrapper, SettingsButton, AddButton, SettingsLayout, CreateLayout } from './Dashboard.styled';
import { Tooltip, Switch, Select, Button, Modal, Input, InputNumber, List } from 'antd';
import { ExclamationCircleOutlined, SettingOutlined, CopyOutlined, UserAddOutlined, LogoutOutlined, ReloadOutlined } from '@ant-design/icons';
import { useDashboard } from './useDashboard.hook';
import { AccountItem } from './accountItem/AccountItem';

export function Dashboard() {

  const { state, actions } = useDashboard();

  const onClipboard = (value) => {
    navigator.clipboard.writeText(value);
  };

  const createLink = () => {
    return window.location.origin + '/#/create?add=' + state.createToken;
  };

  return (
    <DashboardWrapper>
      <div className="container">
        <div className="header">
          <div className="label">Accounts</div>
          { state.display === 'small' && (
            <>
              <div className="settings">
                  <SettingsButton type="text" size="small" icon={<ReloadOutlined />}
                      onClick={() => actions.reload()}></SettingsButton>
              </div>
              <div className="settings">
                  <SettingsButton type="text" size="small" icon={<SettingOutlined />}
                      onClick={() => actions.setShowSettings(true)}></SettingsButton>
              </div>
              <div className="settings">
                  <SettingsButton type="text" size="small" icon={<LogoutOutlined />}
                      onClick={() => actions.logout()}></SettingsButton>
              </div>
              { (state.configError || state.accountsError) && (
                <AlertIcon>
                    <ExclamationCircleOutlined />
                </AlertIcon>
              )}
              <div className="add">
                  <AddButton type="text" size="large" icon={<UserAddOutlined />}
                      loading={state.createBusy} onClick={() => actions.setCreateLink()}></AddButton>
              </div>
            </>
          )}
          { state.display !== 'small' && (
            <>
              <div className="settings">
                <Tooltip placement="topRight" title="Reload Accounts"> 
                  <SettingsButton type="text" size="small" icon={<ReloadOutlined />}
                      onClick={() => actions.reload()}></SettingsButton>
                </Tooltip>
              </div>
              <div className="settings">
                <Tooltip placement="topRight" title="Configure Server"> 
                  <SettingsButton type="text" size="small" icon={<SettingOutlined />}
                      onClick={() => actions.setShowSettings(true)}></SettingsButton>
                </Tooltip>
              </div>
              <div className="settings">
                <Tooltip placement="topRight" title="Logout"> 
                  <SettingsButton type="text" size="small" icon={<LogoutOutlined />}
                      onClick={() => actions.logout()}></SettingsButton>
                </Tooltip>
              </div>
              { state.configError && (
                <Tooltip placement="topRight" title="failed to load accounts">
                  <AlertIcon className="alert">
                    <ExclamationCircleOutlined />
                  </AlertIcon>
                </Tooltip>
              )}
              { state.accountsError && (
                <Tooltip placement="topRight" title="failed to load config">
                  <AlertIcon className="alert">
                    <ExclamationCircleOutlined />
                  </AlertIcon>
                </Tooltip>
              )}
              <div className="add">
                <Tooltip placement="topRight" title="Create Account Link"> 
                  <AddButton type="text" size="large" icon={<UserAddOutlined />}
                      loading={state.createBusy} onClick={() => actions.setCreateLink()}></AddButton>
                </Tooltip>
              </div>
            </>
          )}
        </div>

        <div className="body">
          <List
            locale={{ emptyText: '' }}
            itemLayout="horizontal"
            dataSource={state.accounts}
            loading={state.loading}
            renderItem={item => (<AccountItem item={item} remove={actions.removeAccount}/>)}
          />
        </div>
      </div>

      <Modal title="Settings" visible={state.showSettings} centered bodyStyle={{ padding: 16 }}
          okText="Save" onOk={() => actions.setSettings()} onCancel={() => actions.setShowSettings(false)}>
       <SettingsLayout direction="vertical">
          <div className="field">
            <div>Federated Host:&nbsp;</div>
            <Input placeholder="domain:port/app" onChange={(e) => actions.setHost(e.target.value)}
                value={state.domain} />
          </div>
          <div className="field">
            <div>Storage Limit (GB) / Account:&nbsp;</div>
            <InputNumber defaultValue={0} onChange={(e) => actions.setStorage(e)}
                placeholder="0 for unrestricted" value={state.accountStorage} />
          </div>
          <div className="field">
            <div>Account Key Type:&nbsp;</div>
            <Select labelInValue defaultValue={{ value: 'RSA4096', label: 'RSA 4096' }}
                value={state.keyType} onChange={(o) => actions.setKeyType(o.value)}>
              <Select.Option value="RSA2048">RSA 2048</Select.Option>
              <Select.Option value="RSA4096">RSA 4096</Select.Option>
            </Select>
          </div>
          <div className="field">
            <div>Enable Push Notification:&nbsp;</div>
            <Switch onChange={(e) => actions.setPushSupported(e)} size="small"
              defaultChecked={true} checked={state.pushSupported} />
          </div>
          <div className="field">
            <div>Enable Image Queue:&nbsp;</div>
            <Switch onChange={(e) => actions.setEnableImage(e)} size="small"
              defaultChecked={true} checked={state.enableImage} />
          </div>
          <div className="field">
            <div>Enable Audio Queue:&nbsp;</div>
            <Switch onChange={(e) => actions.setEnableAudio(e)} size="small"
              defaultChecked={true} checked={state.enableAudio} />
          </div>
          <div className="field">
            <div>Enable Video Queue:&nbsp;</div>
            <Switch onChange={(e) => actions.setEnableVideo(e)} size="small"
              defaultChecked={true} checked={state.enableVideo} />
          </div>
        </SettingsLayout>
      </Modal>
      <Modal bodyStyle={{ padding: 16 }} title="Create Account" visible={state.showCreate} centered width="fitContent"
          footer={[ <Button type="primary" onClick={() => actions.setShowCreate(false)}>OK</Button> ]}
          onCancel={() => actions.setShowCreate(false)}>
        <CreateLayout>
          <div className="url">
            <div className="label">Browser Link:</div>
            <div className="link">{createLink()}</div>
            <Button icon={<CopyOutlined />} size="small"
              onClick={() => onClipboard(createLink())} />
          </div>
          <div className="url">
            <div className="label">App Token:</div>
            <div className="token">{state.createToken}</div>
            <Button icon={<CopyOutlined />} size="small"
              onClick={() => onClipboard(state.createToken)} />
          </div>
        </CreateLayout>
      </Modal>    
    </DashboardWrapper>
  );
}

