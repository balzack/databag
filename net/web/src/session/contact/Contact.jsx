import { Modal, Button, Tooltip } from 'antd';
import { StatusConnected, StatusRequested, StatusConnecting, StatusPending, StatusConfirmed, StatusUnsaved, ContactWrapper } from './Contact.styled';
import { useContact } from './useContact.hook';
import { Logo } from 'logo/Logo';
import { SyncOutlined, UserAddOutlined, UserDeleteOutlined, UserSwitchOutlined, StopOutlined, DeleteOutlined, DatabaseOutlined, CloseOutlined, BookOutlined, EnvironmentOutlined } from '@ant-design/icons';

export function Contact({ close, guid, listing }) {

  const [ modal, modalContext ] = Modal.useModal();
  const { state, actions } = useContact(guid, listing, close);

  const updateContact = async (action) => {
    try {
      await action();
    }
    catch (err) {
      console.log(err);
      modal.error({
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  }

  return (
    <ContactWrapper>
      { modalContext }
      <div className={ state.display === 'small' || state.display === 'xlarge' ? 'frame' : 'drawer' }>
        { (state.display === 'xlarge' || state.display === 'small') && (
          <div className="header">
            <div className="handle">{ state.handle }</div>
            <div className="close" onClick={close}>
              <CloseOutlined />
            </div>
          </div>
        )}
        { (state.display !== 'xlarge' && state.display !== 'small') && (
          <div className="top">{ state.handle }</div>
        )}

        <div className={ state.display === 'xlarge' ? 'midContent' : 'rightContent' }>
          <div className="logo">
            { state.logoSet && (
              <Logo url={state.logo} width={'100%'} radius={8} />
            )}
          </div>
          <div className="details">
            <div className="name">
              { state.name && (
                <div className="data">{ state.name }</div>
              )}
              { !state.name && (
                <div className="data notset">{ state.strings.name }</div>
              )}
            </div>
            { state.node && (
              <div className="location">
                <DatabaseOutlined />
                <div className="data">{ state.node }</div>
              </div>
            )}
            <div className="location">
              <EnvironmentOutlined />
              { state.location && (
                <div className="data">{ state.location }</div>
              )}
              { !state.location && (
                <div className="data notset">{ state.strings.location }</div>
              )}
            </div>
            <div className="description">
              <BookOutlined />
              { state.description && (
                <div className="data">{ state.description }</div>
              )}
              { !state.description && (
                <div className="data notset">{ state.strings.description }</div>
              )}
            </div>
          </div>
        </div>

        <div className="actions">
          <div className="label">{ state.strings.actions }</div>
          <div className="controls">
            { state.status === 'connected' && (
              <Tooltip placement="top" title={state.strings.disconnectContact}>
                <Button className="button" type="primary" loading={state.busy} icon={<UserDeleteOutlined />} size="medium"  onClick={() => updateContact(actions.disconnect)}>{ state.strings.disconnect }</Button>
              </Tooltip>
            )}
            { state.status === 'connected' && (
              <Tooltip placement="top" title={state.strings.deleteContact}>
                <Button className="button" type="primary" loading={state.busy} icon={<DeleteOutlined />} size="medium"  onClick={() => updateContact(actions.disconnectRemove)}>{ state.strings.remove }</Button>
              </Tooltip>
            )}
            { state.status === 'pending' && (
              <Tooltip placement="top" title={state.strings.saveContact}>
                <Button className="button" type="primary" loading={state.busy} icon={<UserAddOutlined />} size="medium"  onClick={() => updateContact(actions.confirmContact)}>{ state.strings.save }</Button>
              </Tooltip>
            )}
            { state.status === 'pending' && (
              <Tooltip placement="top" title={state.strings.saveAccept}>
                <Button className="button" type="primary" loading={state.busy} icon={<UserSwitchOutlined />} size="medium"  onClick={() => updateContact(actions.connect)}>{ state.strings.connect }</Button>
              </Tooltip>
            )}
            { state.status === 'pending' && (
              <Tooltip placement="top" title={state.strings.ignoreRequest}>
                <Button className="button" type="primary" loading={state.busy} icon={<StopOutlined />} size="medium"  onClick={() => updateContact(actions.remove)}>{ state.strings.cancel }</Button>
              </Tooltip>
            )}
            { state.status === 'requested' && (
              <Tooltip placement="top" title={state.strings.acceptConnection}>
                <Button className="button" type="primary" loading={state.busy} icon={<UserSwitchOutlined />} size="medium"  onClick={() => updateContact(actions.saveConnect)}>{ state.strings.cancel }</Button>
              </Tooltip>
            )}
            { state.status === 'requested' && (
              <Tooltip placement="top" title={state.strings.ignoreRequest}>
                <Button className="button" type="primary" loading={state.busy} icon={<StopOutlined />} size="medium"  onClick={() => updateContact(actions.disconnect)}>{ state.strings.cancel }</Button>
              </Tooltip>
            )}
            { state.status === 'connecting' && (
              <Tooltip placement="top" title="Cancel Request">
                <Button className="button" type="primary" loading={state.busy} icon={<StopOutlined />} size="medium"  onClick={() => updateContact(actions.disconnect)}>{ state.strings.cancel }</Button>
              </Tooltip>
            )}
            { state.status === 'connecting' && (
              <Tooltip placement="top" title={state.strings.deleteContact}>
                <Button className="button" type="primary" loading={state.busy} icon={<DeleteOutlined />} size="medium"  onClick={() => updateContact(actions.disconnectRemove)}>{ state.strings.remove }</Button>
              </Tooltip>
            )}
            { state.status === 'confirmed' && (
              <Tooltip placement="top" title={state.strings.requestConnection}>
                <Button className="button" type="primary" loading={state.busy} icon={<UserSwitchOutlined />} size="medium"  onClick={() => updateContact(actions.connect)}>{ state.strings.connect }</Button>
              </Tooltip>
            )}
            { state.status === 'confirmed' && (
              <Tooltip placement="top" title={state.strings.deleteContact}>
                <Button className="button" type="primary" loading={state.busy} icon={<DeleteOutlined />} size="medium"  onClick={() => updateContact(actions.remove)}>{ state.strings.remove }</Button>
              </Tooltip>
            )}
            { state.status === 'unsaved' && (
              <Tooltip placement="top" title={state.strings.saveContact}>
                <Button className="button" type="primary" loading={state.busy} icon={<UserAddOutlined />} size="medium"  onClick={() => updateContact(actions.saveContact)}>{ state.strings.save }</Button>
              </Tooltip>
            )}
            { state.status === 'unsaved' && (
              <Tooltip placement="top" title={state.strings.saveRequest}>
                <Button className="button" type="primary" loading={state.busy} icon={<UserSwitchOutlined />} size="medium"  onClick={() => updateContact(actions.saveConnect)}>{ state.strings.connect }</Button>
              </Tooltip>
            )}
            { state.offsync && (
              <Tooltip placement="top" title={state.strings.resyncContact}>
                <Button className="button" type="primary" loading={state.busy} icon={<SyncOutlined />} size="medium"  onClick={() => updateContact(actions.resync)}>{ state.strings.resync }</Button>
              </Tooltip>
            )}
          </div>
        </div>

        { state.status === 'connected' && (
          <div className="footer">
            <StatusConnected />
            <div className="status">{state.strings.connectedTip}</div>
          </div>
        )}
        { state.status === 'requested' && (
          <div className="footer">
            <StatusRequested />
            <div className="status">{state.strings.requestedTip}</div>
          </div>
        )}
        { state.status === 'connecting' && (
          <div className="footer">
            <StatusConnecting />
            <div className="status">{state.strings.connectingTip}</div>
          </div>
        )}
        { state.status === 'pending' && (
          <div className="footer">
            <StatusPending />
            <div className="status">{state.strings.pendingTip}</div>
          </div>
        )}
        { state.status === 'confirmed' && (
          <div className="footer">
            <StatusConfirmed />
            <div className="status">{state.strings.confirmedTip}</div>
          </div>
        )}
        { state.status === 'unsaved' && (
          <div className="footer">
            <StatusUnsaved />
            <div className="status">{state.strings.unsavedTip}</div>
          </div>
        )}
      </div>
    </ContactWrapper>
  );
}

