import {
  AlertIcon,
  DashboardWrapper,
  SettingsButton,
  AddButton,
  SettingsLayout,
  CreateLayout,
} from './Dashboard.styled';
import { Tooltip, Switch, Select, Button, Space, Modal, Input, InputNumber, List } from 'antd';
import {
  ExclamationCircleOutlined,
  SettingOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { ThemeProvider } from 'styled-components';
import { useDashboard } from './useDashboard.hook';
import { AccountItem } from './accountItem/AccountItem';
import { CopyButton } from './copyButton/CopyButton';

export function Dashboard() {
  const { state, actions } = useDashboard();

  const onClipboard = async (value) => {
    await navigator.clipboard.writeText(value);
  };

  const createLink = () => {
    return window.location.origin + '/#/create?add=' + state.createToken;
  };

  return (
    <ThemeProvider theme={state.colors}>
      <DashboardWrapper>
        <div className="container">
          <div className="header">
            <div className="label">{state.strings.accounts}</div>
            {state.display === 'small' && (
              <>
                <div className="settings">
                  <SettingsButton
                    type="text"
                    size="small"
                    icon={
                      <ReloadOutlined
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    }
                    onClick={() => actions.reload()}
                  ></SettingsButton>
                </div>
                <div className="settings">
                  <SettingsButton
                    type="text"
                    size="small"
                    icon={
                      <SettingOutlined
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    }
                    onClick={() => actions.setShowSettings(true)}
                  ></SettingsButton>
                </div>
                <div className="settings">
                  <SettingsButton
                    type="text"
                    size="small"
                    icon={
                      <LogoutOutlined
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    }
                    onClick={() => actions.logout()}
                  ></SettingsButton>
                </div>
                {(state.configError || state.accountsError) && (
                  <AlertIcon>
                    <ExclamationCircleOutlined
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  </AlertIcon>
                )}
                <div className="add">
                  <AddButton
                    type="text"
                    size="large"
                    icon={
                      <UserAddOutlined
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    }
                    loading={state.createBusy}
                    onClick={() => actions.setCreateLink()}
                  ></AddButton>
                </div>
              </>
            )}
            {state.display !== 'small' && (
              <>
                <div className="settings">
                  <Tooltip
                    placement="topRight"
                    title={state.strings.reloadAccounts}
                  >
                    <SettingsButton
                      type="text"
                      size="small"
                      icon={
                        <ReloadOutlined
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      }
                      onClick={() => actions.reload()}
                    ></SettingsButton>
                  </Tooltip>
                </div>
                <div className="settings">
                  <Tooltip
                    placement="topRight"
                    title={state.strings.configureServer}
                  >
                    <SettingsButton
                      type="text"
                      size="small"
                      icon={
                        <SettingOutlined
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      }
                      onClick={() => actions.setShowSettings(true)}
                    ></SettingsButton>
                  </Tooltip>
                </div>
                <div className="settings">
                  <Tooltip
                    placement="topRight"
                    title={state.strings.logout}
                  >
                    <SettingsButton
                      type="text"
                      size="small"
                      icon={
                        <LogoutOutlined
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      }
                      onClick={() => actions.logout()}
                    ></SettingsButton>
                  </Tooltip>
                </div>
                {(state.configError || state.accountsError) && (
                  <Tooltip
                    placement="topRight"
                    title={state.strings.failedLoad}
                  >
                    <AlertIcon className="alert">
                      <ExclamationCircleOutlined
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    </AlertIcon>
                  </Tooltip>
                )}
                <div className="add">
                  <Tooltip
                    placement="topRight"
                    title={state.strings.createAccount}
                  >
                    <AddButton
                      type="text"
                      size="large"
                      icon={
                        <UserAddOutlined
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      }
                      loading={state.createBusy}
                      onClick={() => actions.setCreateLink()}
                    ></AddButton>
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
              renderItem={(item) => (
                <AccountItem
                  item={item}
                  remove={actions.removeAccount}
                />
              )}
            />
          </div>
        </div>
        <Modal
          bodyStyle={{ borderRadius: 8, padding: 16, ...state.menuStyle }}
          closable={false}
          visible={state.showSettings}
          centered
          width="fitContent"
          footer={null}
          onCancel={() => actions.setShowSettings(false)}
        >
          <SettingsLayout direction="vertical">
            <div className="header">{state.strings.settings}</div>
            <div className="field">
              <div>{state.strings.federatedHost}</div>
              <Input
                placeholder={state.strings.hostHint}
                onChange={(e) => actions.setHost(e.target.value)}
                value={state.domain}
              />
            </div>
            <div className="field">
              <div>{state.strings.storageLimit}</div>
              <InputNumber
                defaultValue={0}
                min={0}
                onChange={(e) => actions.setStorage(e)}
                placeholder={state.strings.storageHint}
                value={state.accountStorage}
              />
            </div>
            <div className="field">
              <div>{state.strings.keyType}</div>
              <Select
                labelInValue
                defaultValue={{ value: 'RSA4096', label: 'RSA 4096' }}
                value={state.keyType}
                onChange={(o) => actions.setKeyType(o.value)}
              >
                <Select.Option value="RSA2048">RSA 2048</Select.Option>
                <Select.Option value="RSA4096">RSA 4096</Select.Option>
              </Select>
            </div>
            <div className="field">
              <Space
                className="minHeight"
                size="middle"
              >
                <div>{state.strings.accountCreation}</div>
                <Switch
                  onChange={(e) => actions.setEnableOpenAccess(e)}
                  size="small"
                  defaultChecked={false}
                  checked={state.enableOpenAccess}
                />
                {state.enableOpenAccess && (
                  <InputNumber
                    defaultValue={0}
                    min={0}
                    onChange={(e) => actions.setOpenAccessLimit(e)}
                    placeholder={state.strings.limit}
                    value={state.openAccessLimit}
                  />
                )}
              </Space>
            </div>
            <div className="field">
              <div>{state.strings.enablePush}</div>
              <Switch
                onChange={(e) => actions.setPushSupported(e)}
                size="small"
                defaultChecked={true}
                checked={state.pushSupported}
              />
            </div>
            {state.transformSupported && (
              <div className="field">
                <div>{state.strings.allowUnsealed}</div>
                <Switch
                  onChange={(e) => actions.setAllowUnsealed(e)}
                  size="small"
                  defaultChecked={true}
                  checked={state.allowUnsealed}
                />
              </div>
            )}
            <div className="field label">
              <span>{state.strings.topicContent}</span>
            </div>
            <Tooltip
              placement="topLeft"
              title={state.strings.imageHint}
            >
              <div className="field">
                <div>{state.strings.enableImage}</div>
                <Switch
                  onChange={(e) => actions.setEnableImage(e)}
                  size="small"
                  defaultChecked={true}
                  checked={state.enableImage}
                />
              </div>
            </Tooltip>
            <Tooltip
              placement="topLeft"
              title={state.strings.audioHint}
            >
              <div className="field">
                <div>{state.strings.enableAudio}</div>
                <Switch
                  onChange={(e) => actions.setEnableAudio(e)}
                  size="small"
                  defaultChecked={true}
                  checked={state.enableAudio}
                />
              </div>
            </Tooltip>
            <Tooltip
              placement="topLeft"
              title={state.strings.videoHint}
            >
              <div className="field">
                <div>{state.strings.enableVideo}</div>
                <Switch
                  onChange={(e) => actions.setEnableVideo(e)}
                  size="small"
                  defaultChecked={true}
                  checked={state.enableVideo}
                />
              </div>
            </Tooltip>
            <Tooltip
              placement="topLeft"
              title={state.strings.webHint}
            >
              <div className="field label">
                <div>{state.strings.enableWeb}</div>
                <Switch
                  onChange={(e) => actions.setEnableIce(e)}
                  size="small"
                  defaultChecked={false}
                  checked={state.enableIce}
                />
              </div>
            </Tooltip>
            <div className="field">
              <div>{state.strings.serverUrl}</div>
              <Input
                placeholder={state.strings.urlHint}
                onChange={(e) => actions.setIceUrl(e.target.value)}
                disabled={!state.enableIce}
                value={state.iceUrl}
              />
            </div>
            <div className="field">
              <div>{state.strings.webUsername}</div>
              <Input
                placeholder={state.strings.username}
                onChange={(e) => actions.setIceUsername(e.target.value)}
                disabled={!state.enableIce}
                value={state.iceUsername}
              />
            </div>
            <div className="field">
              <div>{state.strings.webPassword}</div>
              <Input
                placeholder={state.strings.password}
                onChange={(e) => actions.setIcePassword(e.target.value)}
                disabled={!state.enableIce}
                value={state.icePassword}
              />
            </div>
            <div className="control">
              <Button
                key="back"
                onClick={() => actions.setShowSettings(false)}
              >
                {state.strings.cancel}
              </Button>
              <Button
                key="save"
                type="primary"
                onClick={() => actions.setSettings()}
                loading={state.busy}
              >
                {state.strings.save}
              </Button>
            </div>
          </SettingsLayout>
        </Modal>
        <Modal
          bodyStyle={{ borderRadius: 8, padding: 16, ...state.menuStyle }}
          closable={false}
          visible={state.showCreate}
          centered
          width="fitContent"
          footer={null}
          onCancel={() => actions.setShowCreate(false)}
        >
          <CreateLayout>
            <div className="header">{state.strings.createAccount}</div>
            <div className="url">
              <div className="label">{state.strings.browserLink}</div>
              <div className="link">{createLink()}</div>
              <CopyButton onCopy={async () => await onClipboard(createLink())} />
            </div>
            <div className="url">
              <div className="label">{state.strings.mobileToken}</div>
              <div className="token">{state.createToken}</div>
              <CopyButton onCopy={async () => await onClipboard(state.createToken)} />
            </div>
            <div className="control">
              <Button
                type="primary"
                onClick={() => actions.setShowCreate(false)}
              >
                {state.strings.ok}
              </Button>
            </div>
          </CreateLayout>
        </Modal>
      </DashboardWrapper>
    </ThemeProvider>
  );
}
