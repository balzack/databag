import { DetailsWrapper } from './Details.styled';
import { DoubleRightOutlined } from '@ant-design/icons';

export function Details({ closeDetails, closeConversation, openContact }) {
  return (
    <DetailsWrapper>
      <div class="header">
        <div class="label">Conversation</div>
        <div class="dismiss" onClick={closeConversation}>
          <DoubleRightOutlined />
        </div>
      </div>
      <div class="content" onClick={closeDetails}>
      </div>
    </DetailsWrapper>
  );
}

