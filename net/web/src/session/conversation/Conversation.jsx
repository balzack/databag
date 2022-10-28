import { useEffect, useRef } from 'react';
import { ConversationWrapper, StatusError } from './Conversation.styled';
import { ExclamationCircleOutlined, SettingOutlined, CloseOutlined } from '@ant-design/icons';
import ReactResizeDetector from 'react-resize-detector';
import { useConversation } from './useConversation.hook';
import { Logo } from 'logo/Logo';
import { AddTopic } from './addTopic/AddTopic';
import { TopicItem } from './topicItem/TopicItem';
import { List, Spin, Tooltip } from 'antd';

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
      <div class="header">
        <div class="title">
          <div class="logo">
            <Logo img={state.image} url={state.logo} width={32} height={32} radius={4} />
          </div>
          <div class="label">{ state.subject }</div>
          { state.error && state.display === 'small' && (
            <StatusError onClick={actions.resync}>
              <ExclamationCircleOutlined />
            </StatusError>
          )}
          { state.error && state.display !== 'small' && (
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
      <div class="thread" ref={thread} onScroll={scrollThread}>
        { state.topics.length === 0 && (
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
        <AddTopic cardId={cardId} channelId={channelId} />
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

