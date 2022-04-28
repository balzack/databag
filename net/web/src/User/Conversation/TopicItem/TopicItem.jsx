import React, { useEffect, useState } from 'react';
import { TopicItemWrapper } from './TopicItem.styled';
import ReactResizeDetector from 'react-resize-detector';
import { useTopicItem } from './useTopicItem.hook';
import { Avatar } from 'avatar/Avatar';

export function TopicItem({ topic }) {

  const { state, actions } = useTopicItem(topic);

  let name = state.name ? state.name : state.handle;
  let nameClass = state.name ? 'set' : 'unset';

  return (
    <TopicItemWrapper>
      <div class="avatar">
        <Avatar imageUrl={state.imageUrl} />
      </div>
      <div class="topic">
        <div class="info">
          <div class={nameClass}>{ name }</div>
        </div>
        <div class="message">{ state.message }</div>
      </div>
    </TopicItemWrapper>
  )
}

