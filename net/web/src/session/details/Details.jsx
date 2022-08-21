import { Space } from 'antd';
import { DetailsWrapper } from './Details.styled';
import { DoubleRightOutlined } from '@ant-design/icons';
import { useDetails } from './useDetails.hook';
import { Logo } from 'logo/Logo';
import { EditOutlined } from '@ant-design/icons';
import { CardSelect } from '../cardSelect/CardSelect';

export function Details({ cardId, channelId, closeDetails, closeConversation, openContact }) {

  const { state, actions } = useDetails(cardId, channelId);

console.log(state.contacts);

  return (
    <DetailsWrapper>
      <div class="header">
        <div class="label">Channel</div>
        <div class="dismiss" onClick={closeConversation}>
          <DoubleRightOutlined />
        </div>
      </div>
      <div class="content" onClick={closeDetails}>
        <div class="description">
          <div class="logo">
            <Logo width={72} height={72} radius={4} img={state.img} />
          </div>
          <div class="stats">
            { state.host && (
              <div class="subject edit">
                <Space>
                  <div>{ state.subject }</div>
                  <EditOutlined />
                </Space>
              </div>
            )}
            { !state.host && (
              <div class="subject">{ state.subject }</div>
            )}
            { state.host && (
              <div class="host">host</div>
            )}
            { !state.host && (
              <div class="host">guest</div>
            )}
            <div class="created">{ state.started }</div>
          </div>
        </div>
        { state.host && (
          <div class="button">Delete Channel</div>
        )}
        { state.host && (
          <div class="button">Edit Membership</div>
        )}
        { !state.host && (
          <div class="button">Leave Channel</div>
        )}
        <div class="label">Members</div>
        <div class="members">
          <CardSelect filter={(item) => {
            console.log("CHECK: ", item.id, state.contacts);
            if(state.contacts.includes(item.id)) {
              console.log("YES");
              return true;
            }
            return false;
          }} unknown={0}
          markup={cardId} />
        </div>
      </div>
    </DetailsWrapper>
  );
}

