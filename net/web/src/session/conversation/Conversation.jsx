import { ConversationWrapper, StatusError } from './Conversation.styled';
import { ExclamationCircleOutlined, SettingOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
import { useConversation } from './useConversation.hook';
import { Logo } from 'logo/Logo';
import { AddTopic } from './addTopic/AddTopic';
import { VirtualList } from './virtualList/VirtualList';
import { TopicItem } from './topicItem/TopicItem';
import { Progress, Spin, Tooltip } from 'antd';

export function Conversation({ closeConversation, openDetails, cardId, channelId }) {

  const { state, actions } = useConversation(cardId, channelId);

  const topicRenderer = (topic) => {
    return (<TopicItem host={cardId == null} topic={topic} />)
  }

  return (
    <ConversationWrapper>
      <div class="header">
        <div class="title">
          <div class="logo">
            <Logo img={state.image} url={state.logo} width={32} height={32} radius={4} />
          </div>
          <div class="label">{ state.subject }</div>
          { state.error && (
            <Tooltip placement="bottom" title="sync error">
              <StatusError onClick={actions.resync}>
                <ExclamationCircleOutlined />
              </StatusError>
            </Tooltip>
          )}
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
      <div class="thread">
        <VirtualList id={`${cardId}:${channelId}`}
            items={state.topics} itemRenderer={topicRenderer} loadMore={actions.more} />
        { state.loadingInit && (
          <div class="loading">
            <Spin size="large" delay={250} />
          </div>
        )}
        { state.loadingMore && (
          <div class="loading">
            <Spin size="large" delay={500} />
          </div>
        )}
      </div>
      <div class="divider">
        <div class="line" />
        { state.uploadError && (
          <div class="progress-error" />
        )}
        { state.upload && !state.uploadError && (
          <div class="progress-active" style={{ width: state.uploadPercent + '%' }} />
        )}
        { !state.upload && (
          <div class="progress-idle" />
        )}
      </div>
      <div class="topic">
        <AddTopic cardId={cardId} channelId={channelId} />
        { state.uploadError && (
          <div class="upload-error">
            <Tooltip placement="bottom" title="upload error">
              <StatusError>
                <div onClick={() => actions.clearUploadErrors(cardId, channelId)}>
                  <ExclamationCircleOutlined />
                </div>
              </StatusError>
            </Tooltip>
          </div>
        )}
      </div>
    </ConversationWrapper>
  );
}

