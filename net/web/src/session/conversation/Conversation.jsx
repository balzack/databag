import { useRef } from 'react';
import { ConversationWrapper, StatusError } from './Conversation.styled';
import { ExclamationCircleOutlined, SettingOutlined, CloseOutlined } from '@ant-design/icons';
import ReactResizeDetector from 'react-resize-detector';
import { useConversation } from './useConversation.hook';
import { Logo } from 'logo/Logo';
import { AddTopic } from './addTopic/AddTopic';
import { TopicItem } from './topicItem/TopicItem';
import { List, Spin, Tooltip } from 'antd';
import { ChannelHeader } from './channelHeader/ChannelHeader';

export function Conversation({ closeConversation, openDetails, cardId, channelId }) {

  const { state, actions } = useConversation(cardId, channelId);
  const thread = useRef(null);

  const topicRenderer = (topic) => {
    return (<TopicItem host={cardId == null} topic={topic} />)
  }

  // an unfortunate cludge for the mobile browser
  // scrollTop not updated without a scroll event
  const latch = () => {
    if (thread.current && thread.current.scrollTop === 0) {
      thread.current.scrollTo({ top: -16, left: 0, behavior: 'smooth' });
      thread.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }

  const scrollThread = (e) => {
    const content = thread.current?.scrollHeight;
    const frame = thread.current?.clientHeight;
    const position = e.target.scrollTop;
    const above = content - (Math.abs(position) + frame);
    if (above < 1024) {
      actions.more();
    }
  };

  return (
    <ConversationWrapper>
      <ChannelHeader openDetails={openDetails} closeConversation={closeConversation} contentKey={state.contentKey}/>
      <div class="thread" ref={thread} onScroll={scrollThread}>
        { state.delayed && state.topics.length === 0 && (
          <div class="empty">This Topic Has No Messages</div>
        )}
        { state.topics.length !== 0 && (
          <ReactResizeDetector handleHeight={true}>
            {() => {
              latch();
              return (
                <List local={{ emptyText: '' }} itemLayout="horizontal" dataSource={state.topics}
                  size="large"  gutter="0" renderItem={topicRenderer} />
              );
            }}
          </ReactResizeDetector>
        )}
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
        { (!state.sealed || state.contentKey) && (
          <AddTopic contentKey={state.contentKey} />
        )}
        { state.uploadError && (
          <div class="upload-error">
            { state.display === 'small' && (
              <StatusError>
                <div onClick={() => actions.clearUploadErrors(cardId, channelId)}>
                  <ExclamationCircleOutlined />
                </div>
              </StatusError>
            )}
            { state.display !== 'small' && (
              <Tooltip placement="bottom" title="upload error">
                <StatusError>
                  <div onClick={() => actions.clearUploadErrors(cardId, channelId)}>
                    <ExclamationCircleOutlined />
                  </div>
                </StatusError>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    </ConversationWrapper>
  );
}

