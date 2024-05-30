import { AlertIcon, MFAModal, DashboardWrapper, SettingsButton, AddButton, SettingsLayout, CreateLayout } from './Dashboard.styled';
import { Tooltip, Switch, Select, Button, Space, Modal, Input, InputNumber, List } from 'antd';
import { ExclamationCircleOutlined, SettingOutlined, UserAddOutlined, LogoutOutlined, ReloadOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { ThemeProvider } from "styled-components";
import { useDashboard } from './useDashboard.hook';
import { AccountItem } from './accountItem/AccountItem';
import { CopyButton } from '../copyButton/CopyButton';

export function Dashboard() {

  const [ modal, modalContext ] = Modal.useModal();
  const { state, actions } = useDashboard();

  const onClipboard = async (value) => {
    await navigator.clipboard.writeText(value);
  };

  const createLink = () => {
    return window.location.origin + '/#/create?add=' + state.createToken;
  };

  const confirmDisableMFA = () => {
    modal.confirm({
      title: <span style={state.menuStyle}>{state.strings.confirmDisable}</span>,
      content: <span style={state.menuStyle}>{state.strings.disablePrompt}</span>,
      icon: <ExclamationCircleOutlined />,
      bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      okText: state.strings.disable,
      cancelText: state.strings.cancel,
      onOk() {
        disableMFA();
      },
      onCancel() {},
    });
  }

  const disableMFA = async () => {
    try {
      await actions.disableMFA();
    }
    catch(err) {
      console.log(err);
      modal.error({
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  }

  const enableMFA = async () => {
    try {
      await actions.enableMFA();
    }
    catch(err) {
      console.log(err);
      modal.error({
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  }

  const confirmMFA = async () => {
    try {
      await actions.confirmMFA();
    }
    catch(err) {
      console.log(err);
      modal.error({
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  }

  return (
    <ThemeProvider theme={state.colors}>
      <DashboardWrapper>
        { modalContext }
        <div className="container">
          <div className="header">
            <div className="label">{ state.strings.accounts }</div>
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
                { (state.mfAuthSet && state.mfaAuthEnabled) && (
                  <div className="settings">
                      <SettingsButton type="text" size="small" icon={<UnlockOutlined />}
                        onClick={confirmDisableMFA}></SettingsButton> 
                  </div>
                )}
                { (state.mfAuthSet && !state.mfaAuthEnabled) && (
                  <div className="settings">
                      <SettingsButton type="text" size="small" icon={<LockOutlined />}
                        onClick={enableMFA}></SettingsButton> 
                  </div>
                )}
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
                  <Tooltip placement="topRight" title={state.strings.reloadAccounts}> 
                    <SettingsButton type="text" size="small" icon={<ReloadOutlined />}
                        onClick={() => actions.reload()}></SettingsButton>
                  </Tooltip>
                </div>
                <div className="settings">
                  <Tooltip placement="topRight" title={state.strings.configureServer}> 
                    <SettingsButton type="text" size="small" icon={<SettingOutlined />}
                        onClick={() => actions.setShowSettings(true)}></SettingsButton>
                  </Tooltip>
                </div>
                { (state.mfAuthSet && state.mfaAuthEnabled) && (
                  <div className="settings">
                    <Tooltip placement="topRight" title={state.strings.disableMultifactor}>
                      <SettingsButton type="text" size="small" icon={<LockOutlined />}
                        onClick={confirmDisableMFA}></SettingsButton> 
                    </Tooltip>
                  </div>
                )}
                { (state.mfAuthSet && !state.mfaAuthEnabled) && (
                  <div className="settings">
                    <Tooltip placement="topRight" title={state.strings.enableMultifactor}>
                      <SettingsButton type="text" size="small" icon={<UnlockOutlined />}
                        onClick={enableMFA}></SettingsButton> 
                    </Tooltip>
                  </div>
                )}
                <div className="settings">
                  <Tooltip placement="topRight" title={state.strings.logout}> 
                    <SettingsButton type="text" size="small" icon={<LogoutOutlined />}
                        onClick={() => actions.logout()}></SettingsButton>
                  </Tooltip>
                </div>
                { (state.configError || state.accountsError) && (
                  <Tooltip placement="topRight" title={state.strings.failedLoad}>
                    <AlertIcon className="alert">
                      <ExclamationCircleOutlined />
                    </AlertIcon>
                  </Tooltip>
                )}
                <div className="add">
                  <Tooltip placement="topRight" title={state.strings.createAccount}> 
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
        <Modal bodyStyle={{ borderRadius: 8, padding: 16, ...state.menuStyle }} closable={false} visible={state.showSettings} 
          centered width="fitContent" footer={null} onCancel={() => actions.setShowSettings(false)}>
         <SettingsLayout direction="vertical">
            <div className="header">{state.strings.settings}</div>
            <div className="field">
              <div>{ state.strings.federatedHost }</div>
              <Input placeholder={state.strings.hostHint} onChange={(e) => actions.setHost(e.target.value)}
                  value={state.domain} />
            </div>
            <div className="field">
              <div>{state.strings.storageLimit}</div>
              <InputNumber defaultValue={0} min={0} onChange={(e) => actions.setStorage(e)}
                  placeholder={state.strings.storageHint} value={state.accountStorage} />
            </div>
            <div className="field">
              <div>{state.strings.keyType}</div>
              <Select labelInValue defaultValue={{ value: 'RSA4096', label: 'RSA 4096' }}
                  value={state.keyType} onChange={(o) => actions.setKeyType(o.value)}>
                <Select.Option value="RSA2048">RSA 2048</Select.Option>
                <Select.Option value="RSA4096">RSA 4096</Select.Option>
              </Select>
            </div>
            <div className="field">
              <Space className="minHeight" size="middle">
                <div>{state.strings.accountCreation}</div>
                <Switch onChange={(e) => actions.setEnableOpenAccess(e)} size="small"
                  defaultChecked={false} checked={state.enableOpenAccess} />
                { state.enableOpenAccess && (
                  <InputNumber defaultValue={0} min={0} onChange={(e) => actions.setOpenAccessLimit(e)}
                      placeholder={state.strings.limit} value={state.openAccessLimit} />
                )}
              </Space>
            </div>
            <div className="field">
              <div>{state.strings.enablePush}</div>
              <Switch onChange={(e) => actions.setPushSupported(e)} size="small"
                defaultChecked={true} checked={state.pushSupported} />
            </div>
            { state.transformSupported && (
              <div className="field">
                <div>{state.strings.allowUnsealed}</div>
                <Switch onChange={(e) => actions.setAllowUnsealed(e)} size="small"
                  defaultChecked={true} checked={state.allowUnsealed} />
              </div>
            )}
            <div className="field label">
              <span>{state.strings.topicContent}</span>
            </div>
            <Tooltip placement="topLeft" title={state.strings.imageHint}>
              <div className="field">
                <div>{state.strings.enableImage}</div>
                <Switch onChange={(e) => actions.setEnableImage(e)} size="small"
                  defaultChecked={true} checked={state.enableImage} />
              </div>
            </Tooltip>
            <Tooltip placement="topLeft" title={state.strings.audioHint}>
              <div className="field">
                <div>{state.strings.enableAudio}</div>
                <Switch onChange={(e) => actions.setEnableAudio(e)} size="small"
                  defaultChecked={true} checked={state.enableAudio} />
              </div>
            </Tooltip>
            <Tooltip placement="topLeft" title={state.strings.videoHint}>
              <div className="field">
                <div>{state.strings.enableVideo}</div>
                <Switch onChange={(e) => actions.setEnableVideo(e)} size="small"
                  defaultChecked={true} checked={state.enableVideo} />
              </div>
            </Tooltip>
            <Tooltip placement="topLeft" title={state.strings.binaryHint}>
              <div className="field">
                <div>{state.strings.enableBinary}</div>
                <Switch onChange={(e) => actions.setEnableBinary(e)} size="small"
                  defaultChecked={true} checked={state.enableBinary} />
              </div>
            </Tooltip>
            <Tooltip placement="topLeft" title={state.strings.webHint}>
              <div className="field label">
                <div>{state.strings.enableWeb}</div>
                <Switch onChange={(e) => actions.setEnableIce(e)} size="small"
                  defaultChecked={false} checked={state.enableIce} />
              </div>
            </Tooltip>
            { state.enableIce && (
              <div className="iceInput">
                <Tooltip placement="topLeft" title={state.strings.serviceHint}>
                  <div className="field">
                    <div>{state.strings.enableService}</div>
                    <Switch onChange={(e) => actions.setIceService(e)} size="small"
                      defaultChecked={false} checked={state.iceService} />
                  </div>
                </Tooltip>
                { !state.iceService && (
                  <div className="field">
                    <div>{state.strings.serverUrl}</div>
                    <Input placeholder={state.strings.urlHint} onChange={(e) => actions.setIceUrl(e.target.value)}
                        value={state.iceUrl} />
                  </div>
                )}
                <div className="field">
                  <div>{state.strings.webUsername}</div>
                  <Input placeholder={state.strings.username} onChange={(e) => actions.setIceUsername(e.target.value)}
                      value={state.iceUsername} />
                </div>
                <div className="field">
                  <div>{state.strings.webPassword}</div>
                  <Input placeholder={state.strings.password} onChange={(e) => actions.setIcePassword(e.target.value)}
                      value={state.icePassword} />
                </div>
              </div>
            )}
            <div className="control">
              <Button key="back" onClick={() => actions.setShowSettings(false)}>{state.strings.cancel}</Button>
              <Button key="save" type="primary" onClick={() => actions.setSettings()} loading={state.busy}>{state.strings.save}</Button>
            </div>
          </SettingsLayout>
        </Modal>
        <Modal bodyStyle={{ borderRadius: 8, padding: 16, ...state.menuStyle }} closable={false} visible={state.showCreate} centered width="fitContent"
            footer={null} onCancel={() => actions.setShowCreate(false)}>
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
              <Button type="primary" onClick={() => actions.setShowCreate(false)}>{state.strings.ok}</Button>
            </div>
          </CreateLayout>
        </Modal>    
        <Modal bodyStyle={{ borderRadius: 8, padding: 16, ...state.menuStyle }} closable={false} visible={state.mfaModal} centered width="fitContent"
            destroyOnClose={true} footer={null} onCancel={actions.dismissMFA}>
          <MFAModal>
            <div className="title">{state.strings.mfaTitle}</div>
            <div className="description">{state.strings.mfaSteps}</div>
            <img src={state.mfaImage} alt="QRCode" />
            <div className="secret">
              <div className="label">{ state.mfaText }</div>
              <CopyButton onCopy={async () => await navigator.clipboard.writeText(state.mfaText)} />
            </div>
            <Input.OTP onChange={actions.setCode} />
            <div className="alert">
              { state.mfaError === '401' && (
                <span>{state.strings.mfaError}</span>
              )}
              { state.mfaError === '429' && (
                <span>{state.strings.mfaDisabled}</span>
              )}
            </div>
            <div className="controls">
              <Button key="back" onClick={actions.dismissMFA}>{state.strings.cancel}</Button>
              <Button key="save" type="primary" className={state.mfaCode ? 'saveEnabled' : 'saveDisabled'} onClick={confirmMFA}
                  disabled={!state.mfaCode} loading={state.busy}>{state.strings.mfaConfirm}</Button>
            </div>
          </MFAModal>
        </Modal>    
      </DashboardWrapper>
    </ThemeProvider>
  );
}

