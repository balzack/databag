import { BottomNavWrapper } from './BottomNav.styled';
import { CommentOutlined, ContactsOutlined, UserOutlined } from '@ant-design/icons';

export function BottomNav({ state, actions }) {

  const setChannels = () => {
    actions.closeDetails();
    actions.closeCards();
    actions.closeListing();
    actions.closeContact();
    actions.closeProfile();
    actions.closeAccount();
    actions.closeConversation();
  }

  const setProfile = () => {
    actions.closeDetails();
    actions.closeCards();
    actions.closeListing();
    actions.closeContact();
    actions.openProfile();
    actions.closeConversation();
  }

  const setCards = () => {
    actions.closeDetails();
    actions.openCards();
    actions.closeContact();
    actions.closeProfile();
    actions.closeAccount();
    actions.closeConversation();
  }

  return (
    <BottomNavWrapper>
      { !state.cards && !state.contact && !state.profile && (
        <div className="nav-item">
          <div className="nav-active">
            <div className="nav-div-right">
              <CommentOutlined />
            </div>
          </div>
        </div>
      )}
      { (state.cards || state.contact || state.profile) && (
        <div className="nav-item" onClick={() => setChannels()}>
          <div className="nav-inactive">
            <div className="nav-div-right">
              <CommentOutlined />
            </div>
          </div>
        </div>
      )}
      { state.profile && (
        <div className="nav-item">
          <div className="nav-active">
            <div className="nav-div-right nav-div-left">
              <UserOutlined />
            </div>
          </div>
        </div>
      )}
      { !state.profile && (
        <div className="nav-item" onClick={() => setProfile()}>
          <div className="nav-inactive">
            <div className="nav-div-right nav-div-left">
              <UserOutlined />
            </div>
          </div>
        </div>
      )}
      { (state.cards || state.contact) && !state.profile && (
        <div className="nav-item">
          <div className="nav-active">
            <div className="nav-div-left bump">
              <ContactsOutlined />
            </div>
          </div>
        </div>
      )}
      { ((!state.cards && !state.contact) || state.profile) && (
        <div className="nav-item" onClick={() => setCards()}>
          <div className="nav-inactive">
            <div className="nav-div-left bump">
              <ContactsOutlined />
            </div>
          </div>
        </div>
      )}
    </BottomNavWrapper>
  );
}

