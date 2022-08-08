import { useEffect, useContext } from 'react';
import { Drawer } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SessionWrapper } from './Session.styled';
import { AppContext } from 'context/AppContext';
import { ViewportContext } from 'context/ViewportContext';
import { useSession } from './useSession.hook';
import { Conversation } from './conversation/Conversation';
import { Details } from './details/Details';
import { Identity } from './identity/Identity';
import { Channels } from './channels/Channels';
import { Cards } from './cards/Cards';
import { Contact } from './contact/Contact';
import { Profile } from './profile/Profile';
import { Welcome } from './welcome/Welcome';
import { BottomNav } from './bottomNav/BottomNav';

export function Session() {

  const { state, actions } = useSession();
  const app = useContext(AppContext);
  const viewport = useContext(ViewportContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (app.state) {
      if (!app.state.access) {
        navigate('/');
      }
    }
  }, [app, navigate]);

  return (
    <SessionWrapper>
      { (viewport.state.display === 'xlarge') && (
        <div class="desktop-layout">
          <div class="left">
            <Identity />
            <Channels />
          </div>
          <div class="center">
            { state.conversation && (
              <div class="reframe">
                <Conversation cardId={state.cardId} conversationId={state.conversationId} />
              </div>
            )}
            { state.contact && (
              <div class="reframe">
                <Contact guid={state.contactGuid} />
              </div>
            )}
            { state.profile && (
              <div class="reframe">
                <Profile />
              </div>
            )}
          </div>
          <div class="right">
            <Welcome />
            { state.conversation && (
              <div class="reframe">
                <Details cardId={state.cardId} conversationId={state.conversationId} />
              </div>
            )}
            { state.cards && (
              <div class="reframe">
                <Cards />
              </div>
            )}
          </div>
        </div>
      )}
      { (viewport.state.display === 'large' || viewport.state.display === 'medium') && (
        <div class="tablet-layout">
          <div class="left">
            <Identity />
            <Channels />
          </div>
          <div class="right">
            <Welcome />
            { state.conversation && (
              <div class="reframe">
                <Conversation cardId={state.cardId} conversationId={state.conversationId} />
              </div>
            )}
            <Drawer width={'33%'} closable={false} onClose={actions.closeDetails} visible={state.details} zIndex={10}>
              { state.details && (
                <Details cardId={state.cardId} conversationId={state.conversationId} />
              )}
            </Drawer>
            <Drawer width={'33%'} closable={false} onClose={actions.closeCards} visible={state.cards} zIndex={20}>
              { state.cards && (
                <Cards />
              )}
              <Drawer width={'33%'} closable={false} onClose={actions.closeContact} visible={state.contact} zIndex={30}>
                { state.contact && (
                  <Contact guid={state.contactGuid} />
                )}
              </Drawer>
            </Drawer>
            <Drawer width={'33%'} closable={false} onClose={actions.closeProfile} visible={state.profile} zIndex={40}>
              { state.profile && (
                <Profile />
              )}
            </Drawer>
          </div>
        </div>
      )}
      { (viewport.state.display === 'small') && (
        <div class="mobile-layout">
          <div class="top">
            <div class="reframe">
              <Channels />
            </div>
            { state.conversation && (
              <div class="reframe">
                <Conversation cardId={state.cardId} conversationId={state.conversationId} />
              </div>
            )}
            { state.details && (
              <div class="reframe">
                <Details cardId={state.cardId} conversation={state.conversationId} />
              </div>
            )}
            { state.cards && (
              <div class="reframe">
                <Cards />
              </div>
            )}
            { state.contact && (
              <div class="reframe">
                <Contact guid={state.contactGuid} />
              </div>
            )}
            { state.profile && (
              <div class="reframe">
                <Profile />
              </div>
            )}
          </div>
          <div class="bottom">
            <BottomNav state={state} actions={actions} />
          </div>
        </div>
      )}
    </SessionWrapper>
  );
}

