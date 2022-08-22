import { ConversationWrapper } from './Conversation.styled';
import { SettingOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
import { useConversation } from './useConversation.hook';
import { Logo } from 'logo/Logo';

export function Conversation({ closeConversation, openDetails, cardId, channelId }) {

  const { state, actions } = useConversation(cardId, channelId);

console.log(state);

  return (
    <ConversationWrapper>
      <div class="header">
        <div class="title">
          <Logo img={state.image} url={state.logo} width={32} height={32} radius={4} />
          <div class="label">{ state.subject }</div>
          { state.display !== 'xlarge' && (
            <div class="button" onClick={openDetails}>
              <SettingOutlined />
            </div>
          )}
        </div>
        { state.display !== 'xlarge' && (
          <div class="button" onClick={closeConversation}>
            <CloseOutlined />
          </div>
        )}
      </div>
    </ConversationWrapper>
  );
}

