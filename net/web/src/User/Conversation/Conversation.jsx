import React, { useState, useEffect, useRef } from 'react'
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import { useConversation } from './useConversation.hook';
import { Button, Checkbox, Modal, Spin } from 'antd'
import { ConversationWrapper, ConversationButton, CloseButton, ListItem, BusySpin } from './Conversation.styled';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';
import { AddTopic } from './AddTopic/AddTopic';
import { VirtualList } from '../../VirtualList/VirtualList';
import { TopicItem } from './TopicItem/TopicItem';

export function Conversation() {

  const { state, actions } = useConversation();

  const topicRenderer = (topic) => {
    return (<TopicItem topic={topic} />)
  }

  return (
    <ConversationWrapper>
      <div class="header">
        <div class="title"></div>
        <div class="buttons">
          <ConversationButton ghost onClick={() => actions.remove()}>Remove Conversation</ConversationButton>
        </div>
        <CloseButton type="text" class="close" size={'large'}
            onClick={() => actions.close()} icon={<CloseOutlined />} />
      </div>
      <div class="thread">
        <VirtualList id={state.channelId + state.cardId} 
            items={state.topics} itemRenderer={topicRenderer} />
        <BusySpin size="large" delay="1000" spinning={!state.init} />
      </div>
      <AddTopic />
    </ConversationWrapper>
  )
}

