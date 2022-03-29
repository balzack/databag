import React, { useState, useEffect, useRef } from 'react'
import { CloseOutlined } from '@ant-design/icons';
import { useContact } from './useContact.hook';
import { Button, Checkbox, Modal } from 'antd'
import { ContactWrapper, CloseButton } from './Contact.styled';

export function Contact({ match }) {

  const { state, actions } = useContact();

  return (
    <ContactWrapper>
      <div class="header">
        <div class="title">{ state.handle }</div>
        <CloseButton type="text" class="close" size={'large'} onClick={() => actions.close()} icon={<CloseOutlined />} />
      </div>
      <div class="container"></div>
    </ContactWrapper>
  )
}

