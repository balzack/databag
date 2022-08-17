import { useEffect, useContext } from 'react';
import { Drawer } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SessionWrapper } from './Session.styled';
import { AppContext } from 'context/AppContext';
import { useSession } from './useSession.hook';
import { Conversation } from './conversation/Conversation';
import { Details } from './details/Details';
import { Identity } from './identity/Identity';
import { Channels } from './channels/Channels';
import { Cards } from './cards/Cards';
import { Contact } from './contact/Contact';
import { Profile } from './profile/Profile';
import { Listing } from './listing/Listing';
import { Account } from './account/Account';
import { Welcome } from './welcome/Welcome';
import { BottomNav } from './bottomNav/BottomNav';

export function Session() {

  const { state, actions } = useSession();
  const app = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (app.state) {
      if (!app.state.access) {
        navigate('/');
      }
    }
  }, [app, navigate]);

  const closeAccount = () => {
    actions.closeProfile();
    actions.closeAccount();
  }

  const openAccount = () => {
    actions.openAccount();
    actions.closeCards();
    actions.closeContact();
    actions.closeListing();
  }

  const closeCards = () => {
    actions.closeCards();
    actions.closeContact();
    actions.closeListing();
  }

  const openCards = () => {
    actions.openCards();
    actions.closeProfile();
    actions.closeAccount();
  }

console.log(state);

  return (
    <SessionWrapper>
      { (state.display === 'xlarge') && (
        <div class="desktop-layout noselect">
          <div class="left">
            <Identity openAccount={openAccount} openCards={openCards} cardUpdated={state.cardUpdated} />
            <div class="bottom">
              <Channels />
            </div>
          </div>
          <div class="center">
            { state.conversation && (
              <div class="reframe">
                <Conversation cardId={state.cardId} conversationId={state.conversationId} />
              </div>
            )}
            { state.contact && (
              <div class="reframe">
                <Contact close={actions.closeContact} guid={state.contactGuid} node={state.contactNode} />
              </div>
            )}
            { state.profile && (
              <div class="reframe">
                <Profile closeProfile={actions.closeProfile} />
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
                <Cards closeCards={closeCards} openContact={actions.openContact} openListing={actions.openListing} />
                <Drawer bodyStyle={{ padding: 0 }} placement="bottom" closable={false} visible={state.listing}
                    onClose={actions.closeListing} getContainer={false} height={'80%'}
                    style={{ position: 'absolute', overflow: 'hidden' }}>
                  <Listing openContact={actions.openContact} />
                </Drawer>
              </div>
            )}
            { (state.profile || state.account) && (
              <div class="reframe">
                <Account closeAccount={closeAccount} openProfile={actions.openProfile} />
              </div>
            )}
          </div>
        </div>
      )}
      { (state.display === 'large' || state.display === 'medium') && (
        <div class="tablet-layout noselect">
          <div class="left">
            <Identity openAccount={actions.openProfile} openCards={actions.openCards} cardUpdated={state.cardUpdated} />
            <div class="bottom">
              <Channels />
            </div>
          </div>
          <div class="right">
            <Welcome />
            { state.conversation && (
              <div class="reframe">
                <Conversation cardId={state.cardId} conversationId={state.conversationId} />
              </div>
            )}
            <Drawer bodyStyle={{ padding: 0 }} width={'33%'} closable={false} onClose={actions.closeDetails} visible={state.details} zIndex={10}>
              { state.details && (
                <Details cardId={state.cardId} conversationId={state.conversationId} />
              )}
            </Drawer>
            <Drawer bodyStyle={{ padding: 0 }} width={'33%'} closable={false} onClose={closeCards} visible={state.cards} zIndex={20} push={state.contact}>
              { state.cards && (
                <Cards closeCards={closeCards} openContact={actions.openContact} openListing={actions.openListing} />
              )}
              <Drawer bodyStyle={{ padding: 0 }} placement="bottom" closable={false} visible={state.listing}
                  onClose={actions.closeListing} getContainer={false} height={'80%'}
                  style={{ overflow: 'hidden', position: 'absolute' }}>
                <Listing openContact={actions.openContact} />
              </Drawer>
              <Drawer bodyStyle={{ padding: 0 }} width={'33%'} closable={false} onClose={actions.closeContact} visible={state.contact} zIndex={30}>
                { state.contact && (
                  <Contact close={actions.closeContact} guid={state.contactGuid} listing={state.contactListing} />
                )}
              </Drawer>
            </Drawer>
            <Drawer bodyStyle={{ padding: 0 }} width={'33%'} closable={false} onClose={closeAccount} visible={state.profile || state.account} zIndex={40}>
              { (state.profile || state.account) && (
                <Profile closeProfile={closeAccount}/>
              )}
            </Drawer>
          </div>
        </div>
      )}
      { (state.display === 'small') && (
        <div class="mobile-layout noselect">
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
                <Cards openContact={actions.openContact} openListing={actions.openListing} />
              </div>
            )}
            { state.listing && (
              <div class="reframe">
                <Listing openContact={actions.openContact} />
              </div>
            )}
            { state.contact && (
              <div class="reframe">
                <Contact close={actions.closeContact} guid={state.contactGuid} listing={state.contactListing} />
              </div>
            )}
            { (state.profile || state.account) && (
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

