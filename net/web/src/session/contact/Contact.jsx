import { Modal } from 'antd';
import { ContactWrapper } from './Contact.styled';
import { useContact } from './useContact.hook';
import { Logo } from 'logo/Logo';
import { DatabaseOutlined, CloseOutlined, RightOutlined, BookOutlined, EnvironmentOutlined } from '@ant-design/icons';

export function Contact({ close, guid, listing }) {

  const [ modal, modalContext ] = Modal.useModal();
  const { state, actions } = useContact(guid, listing, close);

  const ring = async () => {
    actions.ring();
  };

  const updateContact = async (action) => {
    try {
      await action();
    }
    catch (err) {
      console.log(err);
      modal.error({
        title: 'Failed to Update Contact',
        content: 'Please try again.',
      });
    }
  }

  return (
    <ContactWrapper>
      { modalContext }
      { state.display === 'xlarge' && (
        <div className="header">
          <div className="handle">{ state.handle }</div>
          <div className="close" onClick={close}>
            <RightOutlined />
          </div>
        </div>
      )}
      { state.display !== 'xlarge' && (
        <div className="view">
          <div className="title">
            <div className="close" />
            <div className="handle">{ state.handle }</div>
            { state.display === 'small' && (
              <div className="close" onClick={close}>
                <CloseOutlined />
              </div>
            )}
            { state.display !== 'small' && (
              <div className="close" onClick={close}>
                <RightOutlined />
              </div>
            )}
          </div>
        </div>
      )}

      <div className={ state.display === 'xlarge' ? 'midContent' : 'rightContent' }>
        <div className="logo">
          <Logo url={state.logo} width={'100%'} radius={8} />
        </div>
        <div className="details">
          <div className="name">
            { state.name && (
              <div className="data">{ state.name }</div>
            )}
            { !state.name && (
              <div className="data notset">name</div>
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
              <div className="data notset">location</div>
            )}
          </div>
          <div className="description">
            <BookOutlined />
            { state.description && (
              <div className="data">{ state.description }</div>
            )}
            { !state.description && (
              <div className="data notset">description</div>
            )}
          </div>

          { state.status === 'connected' && (
            <div className="controls">
              <div className={ state.buttonStatus } onClick={() => updateContact(actions.disconnect)}>Disconnect</div>
              <div className={ state.buttonStatus } onClick={() => updateContact(actions.disconnectRemove)}>Delete Contact</div>
            </div>
          )}

          { state.status === 'pending' && (
            <div className="controls">
              <div className={ state.buttonStatus } onClick={() => updateContact(actions.confirmContact)}>Save Contact</div>
              <div className={ state.buttonStatus } onClick={() => updateContact(actions.connect)}>Save and Accept</div>
              <div className={ state.buttonStatus } onClick={() => updateContact(actions.remove)}>Ignore Request</div>
            </div>
          )}

          { state.status === 'request received' && (
            <div className="controls">
              <div className={ state.buttonStatus } onClick={() => updateContact(actions.saveConnect)}>Accept Connection</div>
              <div className={ state.buttonStatus } onClick={() => updateContact(actions.disconnect)}>Ignore Request</div>
            </div>
          )}

          { state.status === 'request sent' && (
            <div className="controls">
              <div className={ state.buttonStatus } onClick={() => updateContact(actions.disconnect)}>Cancel Request</div>
              <div className={ state.buttonStatus } onClick={() => updateContact(actions.disconnectRemove)}>Delete Contact</div>
            </div>
          )}

          { state.status === 'saved' && (
            <div className="controls">
              <div className={ state.buttonStatus } onClick={() => updateContact(actions.connect)}>Request Connection</div>
              <div className={ state.buttonStatus } onClick={() => updateContact(actions.remove)}>Delete Contact</div>
            </div>
          )}

          { state.status === 'unsaved' && (
            <div className="controls">
              <div className={ state.buttonStatus } onClick={() => updateContact(actions.saveContact)}>Save Contact</div>
              <div className={ state.buttonStatus } onClick={() => updateContact(actions.saveConnect)}>Save and Request</div>
            </div>
          )}

          <div className={ state.buttonStatus } onClick={ring}>RING</div>

        </div>
      </div>

      <div className="footer">
        <div className="status">Status: { state.status }</div>
      </div>
    </ContactWrapper>
  );
}

