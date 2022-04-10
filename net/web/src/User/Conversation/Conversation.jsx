import React, { useState, useEffect, useRef } from 'react'
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import { useConversation } from './useConversation.hook';
import { Button, Checkbox, Modal } from 'antd'
import { ConversationWrapper, CloseButton } from './Conversation.styled';

export function Conversation() {

  const { state, actions } = useConversation();

  return (
    <ConversationWrapper>
      <div class="header">
        <div class="title">{ state.handle }</div>
        <CloseButton type="text" class="close" size={'large'} onClick={() => actions.close()} icon={<CloseOutlined />} />
      </div>
      <div class="container"></div>
    </ConversationWrapper>
  )
}

