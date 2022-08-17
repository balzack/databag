import { ContactWrapper } from './Contact.styled';
import { useContact } from './useContact.hook';
import { Logo } from 'logo/Logo';
import { DatabaseOutlined, CloseOutlined, RightOutlined, BookOutlined, EnvironmentOutlined } from '@ant-design/icons';

export function Contact({ close, guid, listing }) {

  const { state, actions } = useContact(guid, listing);

  const Image = (
    <div class="logo">
      <Logo url={state.logo} width={'100%'} radius={8} />
    </div>
  );

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
        </>
      )}
      { state.init && state.display !== 'xlarge' && (
        <div class="view">
          <div class="title">
            { state.display === 'small' && (
              <div class="close"></div>
            )}
            <div class="handle">{ state.handle }</div>
            { state.display === 'small' && (
              <div class="close" onClick={close}>
                <CloseOutlined />
              </div>
            )}
          </div>
          { Image }
          { Details }
        </div>
      )}
    </ContactWrapper>
  );
}

