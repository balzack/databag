import { Modal } from 'antd';
import { ContactWrapper } from './Contact.styled';
import { useContact } from './useContact.hook';
import { Logo } from 'logo/Logo';
import { DatabaseOutlined, CloseOutlined, RightOutlined, BookOutlined, EnvironmentOutlined } from '@ant-design/icons';

export function Contact({ close, guid, listing }) {

  const { state, actions } = useContact(guid, listing, close);

  const Image = (
    <div class="logo">
      <Logo url={state.logo} width={'100%'} radius={8} />
    </div>
  );

  const updateContact = async (action) => {
    try {
      await action();
    }
    catch (err) {
      console.log(err);
      Modal.error({
        title: 'Failed to Update Contact',
        content: 'Please try again.',
      });
    }
  }

  const Details = (
    <div class="details">
      <div class="name">
        <div class="data">{ state.name }</div>
      </div>
      { state.node && (
        <div class="location">
          <DatabaseOutlined />
          <div class="data">{ state.node }</div>
        </div>
      )}
      <div class="location">
        <EnvironmentOutlined />
        <div class="data">{ state.location }</div>
      </div>
      <div class="description">
        <BookOutlined />
        <div class="data">{ state.description }</div>
      </div>

      { state.status === 'connected' && (
        <div class="controls">
          <div class={ state.buttonStatus } onClick={() => updateContact(actions.disconnect)}>Disconnect</div>
          <div class={ state.buttonStatus } onClick={() => updateContact(actions.disconnectRemove)}>Delete Contact</div>
        </div>
      )}

      { state.status === 'pending' && (
        <div class="controls">
          <div class={ state.buttonStatus } onClick={() => updateContact(actions.confirmContact)}>Save Contact</div>
          <div class={ state.buttonStatus } onClick={() => updateContact(actions.connect)}>Save and Accept</div>
          <div class={ state.buttonStatus } onClick={() => updateContact(actions.remove)}>Ignore Request</div>
        </div>
      )}

      { state.status === 'request received' && (
        <div class="controls">
          <div class={ state.buttonStatus } onClick={() => updateContact(actions.saveConnect)}>Accept Connection</div>
          <div class={ state.buttonStatus } onClick={() => updateContact(actions.disconnect)}>Ignore Request</div>
        </div>
      )}

      { state.status === 'request sent' && (
        <div class="controls">
          <div class={ state.buttonStatus } onClick={() => updateContact(actions.disconnect)}>Cancel Request</div>
          <div class={ state.buttonStatus } onClick={() => updateContact(actions.disconnectRemove)}>Delete Contact</div>
        </div>
      )}

      { state.status === 'saved' && (
        <div class="controls">
          <div class={ state.buttonStatus } onClick={() => updateContact(actions.connect)}>Request Connection</div>
          <div class={ state.buttonStatus } onClick={() => updateContact(actions.remove)}>Delete Contact</div>
        </div>
      )}

      { state.status === 'unsaved' && (
        <div class="controls">
          <div class={ state.buttonStatus } onClick={() => updateContact(actions.saveContact)}>Save Contact</div>
          <div class={ state.buttonStatus } onClick={() => updateContact(actions.saveConnect)}>Save and Request</div>
        </div>
      )}
    </div>
  );


  return (
    <ContactWrapper>
      { state.init && state.display === 'xlarge' && (
        <>
          <div class="header">
            <div class="handle">{ state.handle }</div>
            <div class="close" onClick={close}>
              <RightOutlined />
            </div>
          </div>

          <div class="content">
            { Image }
            { Details }
          </div>

          <div class="footer">
            <div class="status">Status: { state.status }</div>
          </div>
        </>
      )}
      { state.init && state.display !== 'xlarge' && (
        <div class="view">
          <div class="title">
            <div class="close" />
            <div class="handle">{ state.handle }</div>
            { state.display === 'small' && (
              <div class="close" onClick={close}>
                <CloseOutlined />
              </div>
            )}
            { state.display !== 'small' && (
              <div class="close" onClick={close}>
                <RightOutlined />
              </div>
            )}
          </div>
          { Image }
          { Details }
          <div class="footer">
            <div>contact { state.status }</div>
          </div>
        </div>
      )}
    </ContactWrapper>
  );
}

