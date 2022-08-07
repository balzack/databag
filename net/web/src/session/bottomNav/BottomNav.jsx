import { BottomNavWrapper } from './BottomNav.styled';
import { CommentOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

export function BottomNav({ state, actions }) {

  const tab = () => {
    if (state.profile) {
      return 'profile';
    }
    if (state.cards || state.contact) {
      return 'cards';
    }
    return 'channels';
  }

  const setChannels = () => {
    actions.closeDetails();
    actions.closeCards();
    actions.closeContact();
    actions.closeProfile();
    actions.closeConversation();
  }

  const setProfile = () => {
    actions.closeDetails();
    actions.closeCards();
    actions.closeContact();
    actions.openProfile();
    actions.closeConversation();
  }

  const setCards = () => {
    actions.closeDetails();
    actions.openCards();
    actions.closeContact();
    actions.closeProfile();
    actions.closeConversation();
  }

  return (
    <BottomNavWrapper>
      { !state.cards && !state.contact && !state.profile && (
        <div class="nav-item">
          <div class="nav-active">
            <div class="nav-div-right">
              <CommentOutlined />
            </div>
          </div>
        </div>
      )}
      { (state.cards || state.contact || state.profile) && (
        <div class="nav-item">
          <div class="nav-inactive">
            <div class="nav-div-right">
              <div class="nav-button" onClick={() => setChannels()}>
                <CommentOutlined />
              </div>
            </div>
          </div>
        </div>
      )}
      { state.profile && (
        <div class="nav-item">
          <div class="nav-active">
            <div class="nav-div-right nav-div-left">
              <UserOutlined />
            </div>
          </div>
        </div>
      )}
      { !state.profile && (
        <div class="nav-item">
          <div class="nav-inactive">
            <div class="nav-div-right nav-div-left">
              <div class="nav-button" onClick={() => setProfile()}>
                <UserOutlined />
              </div>
            </div>
          </div>
        </div>
      )}
      { (state.cards || state.contact) && !state.profile && (
        <div class="nav-item">
          <div class="nav-active">
            <div class="nav-div-left">
              <TeamOutlined />
            </div>
          </div>
        </div>
      )}
      { ((!state.cards && !state.contact) || state.profile) && (
        <div class="nav-item">
          <div class="nav-inactive">
            <div class="nav-div-left">
              <div class="nav-button" onClick={() => setCards()}>
                <TeamOutlined />
              </div>
            </div>
          </div>
        </div>
      )}
    </BottomNavWrapper>
  );
}

