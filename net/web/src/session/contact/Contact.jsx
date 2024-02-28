import { Modal, Button, Tooltip } from 'antd';
import { ContactWrapper } from './Contact.styled';
import { useContact } from './useContact.hook';
import { Logo } from 'logo/Logo';
import { SyncOutlined, UserAddOutlined, UserDeleteOutlined, UserSwitchOutlined, StopOutlined, DeleteOutlined, DatabaseOutlined, CloseOutlined, BookOutlined, EnvironmentOutlined } from '@ant-design/icons';

export function Contact({ close, guid, listing }) {

  const [ modal, modalContext ] = Modal.useModal();
  const { state, actions } = useContact(guid, listing, close);

console.log(state.busy);


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
                <div className="data notset">Name</div>
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
                <div className="data notset">Location</div>
              )}
            </div>
            <div className="description">
              <BookOutlined />
              { state.description && (
                <div className="data">{ state.description }</div>
              )}
              { !state.description && (
                <div className="data notset">Description</div>
              )}
            </div>
          </div>
        </div>

        <div className="actions">
          <div className="label">Actions</div>
          <div className="controls">
            { state.status === 'connected' && (
              <Tooltip placement="top" title="Disconnect Contact">
                <Button className="button" type="primary" loading={state.busy} icon={<UserDeleteOutlined />} size="medium"  onClick={() => updateContact(actions.disconnect)}>Disconnect</Button>
              </Tooltip>
            )}
            { state.status === 'connected' && (
              <Tooltip placement="top" title="Delete Contact">
                <Button className="button" type="primary" loading={state.busy} icon={<DeleteOutlined />} size="medium"  onClick={() => updateContact(actions.disconnectRemove)}>Delete</Button>
              </Tooltip>
            )}
            { state.status === 'pending' && (
              <Tooltip placement="top" title="Save Contact">
                <Button className="button" type="primary" loading={state.busy} icon={<UserAddOutlined />} size="medium"  onClick={() => updateContact(actions.confirmContact)}>Save</Button>
              </Tooltip>
            )}
            { state.status === 'pending' && (
              <Tooltip placement="top" title="Save and Accept">
                <Button className="button" type="primary" loading={state.busy} icon={<UserSwitchOutlined />} size="medium"  onClick={() => updateContact(actions.connect)}>Connect</Button>
              </Tooltip>
            )}
            { state.status === 'pending' && (
              <Tooltip placement="top" title="Ignore Request">
                <Button className="button" type="primary" loading={state.busy} icon={<StopOutlined />} size="medium"  onClick={() => updateContact(actions.remove)}>Cancel</Button>
              </Tooltip>
            )}
            { state.status === 'request received' && (
              <Tooltip placement="top" title="Accept Connection">
                <Button className="button" type="primary" loading={state.busy} icon={<UserSwitchOutlined />} size="medium"  onClick={() => updateContact(actions.saveConnect)}>Connect</Button>
              </Tooltip>
            )}
            { state.status === 'request received' && (
              <Tooltip placement="top" title="Ignore Request">
                <Button className="button" type="primary" loading={state.busy} icon={<StopOutlined />} size="medium"  onClick={() => updateContact(actions.disconnect)}>Cancel</Button>
              </Tooltip>
            )}
            { state.status === 'request sent' && (
              <Tooltip placement="top" title="Cancel Request">
                <Button className="button" type="primary" loading={state.busy} icon={<StopOutlined />} size="medium"  onClick={() => updateContact(actions.disconnect)}>Cancel</Button>
              </Tooltip>
            )}
            { state.status === 'request sent' && (
              <Tooltip placement="top" title="Delete Contact">
                <Button className="button" type="primary" loading={state.busy} icon={<DeleteOutlined />} size="medium"  onClick={() => updateContact(actions.disconnectRemove)}>Delete</Button>
              </Tooltip>
            )}
            { state.status === 'saved' && (
              <Tooltip placement="top" title="Request Connection">
                <Button className="button" type="primary" loading={state.busy} icon={<UserSwitchOutlined />} size="medium"  onClick={() => updateContact(actions.connect)}>Connect</Button>
              </Tooltip>
            )}
            { state.status === 'saved' && (
              <Tooltip placement="top" title="Delete Contact">
                <Button className="button" type="primary" loading={state.busy} icon={<DeleteOutlined />} size="medium"  onClick={() => updateContact(actions.remove)}>Delete</Button>
              </Tooltip>
            )}
            { state.status === 'unsaved' && (
              <Tooltip placement="top" title="Save Contact">
                <Button className="button" type="primary" loading={state.busy} icon={<UserAddOutlined />} size="medium"  onClick={() => updateContact(actions.saveContact)}>Save</Button>
              </Tooltip>
            )}
            { state.status === 'unsaved' && (
              <Tooltip placement="top" title="Save and Request">
                <Button className="button" type="primary" loading={state.busy} icon={<UserSwitchOutlined />} size="medium"  onClick={() => updateContact(actions.saveConnect)}>Connect</Button>
              </Tooltip>
            )}
            { state.offsync && (
              <Tooltip placement="top" title="Resync Contact">
                <Button className="button" type="primary" loading={state.busy} icon={<SyncOutlined />} size="medium"  onClick={() => updateContact(actions.resync)}>Resync</Button>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="footer">
          <div className="status">Status: { state.status }</div>
        </div>
      </div>
    </ContactWrapper>
  );
}

