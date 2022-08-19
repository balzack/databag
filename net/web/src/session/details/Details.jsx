import { DetailsWrapper } from './Details.styled';
import { DoubleRightOutlined } from '@ant-design/icons';
import { useDetails } from './useDetails.hook';
import { Logo } from 'logo/Logo';

export function Details({ cardId, channelId, closeDetails, closeConversation, openContact }) {

  const { state, actions } = useDetails(cardId, channelId);

  return (
    <DetailsWrapper>
      <div class="header">
        <div class="label">Channel</div>
        <div class="dismiss" onClick={closeConversation}>
          <DoubleRightOutlined />
        </div>
      </div>
      <div class="content" onClick={closeDetails}>
        <div class="details">
          <Logo url={state.logo} width={48} height={48} radius={4} img={state.img} />
        </div>
      </div>
    </DetailsWrapper>
  );
}

