import { DashboardWrapper, SettingsButton, AddButton, SettingsLayout } from './Dashboard.styled';
import { Button, Modal, Input, InputNumber, Space } from 'antd';
import { SettingOutlined, UserAddOutlined } from '@ant-design/icons';
import { useDashboard } from './useDashboard.hook';

export function Dashboard({ password, config }) {

  const { state, actions } = useDashboard(password, config);

  return (
    <DashboardWrapper>

      <div class="container">
        <div class="header">
          <div class="label">Accounts</div>
          <div class="settings">
            <SettingsButton type="text" size="small" icon={<SettingOutlined />}
                onClick={() => actions.setShowSettings(true)}></SettingsButton>
          </div>
          <div class="add">
            <AddButton type="text" size="large" icon={<UserAddOutlined />}></AddButton>
          </div>
        </div>
      </div>

      <Modal title="Settings" visible={state.showSettings} centered
          okText="Save" onOk={() => actions.onSaveSettings()} onCancel={() => actions.setShowSettings(false)}>
       <SettingsLayout direction="vertical">
          <div class="host">
            <div>Federated Host:&nbsp;</div>
            <Input placeholder="domain:port/app" onChange={(e) => actions.setHost(e.target.value)}
                value={state.host} />
          </div>
          <div class="storage">
            <div>Account Storage (GB):&nbsp;</div>
            <InputNumber defaultValue={8} onChange={(e) => actions.setStorage(e)}
                placeholder="0 for unrestricted" value={state.storage} />
          </div>
        </SettingsLayout>
      </Modal>
    
    </DashboardWrapper>
  );
}

