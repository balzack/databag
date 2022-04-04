import React, { useState, useEffect, useRef } from 'react'
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import { useContact } from './useContact.hook';
import { Button, Checkbox, Modal } from 'antd'
import { ContactWrapper, CloseButton } from './Contact.styled';

export function Contact() {

  const { state, actions } = useContact();

  const Logo = () => {
    if (state.imageUrl != null) {
      if (state.imageUrl === '') {
        return <div class="logo"><UserOutlined /></div>
      }
      return <img class="logo" src={ state.imageUrl } alt="" />
    }
    return <></>
  }

  const Name = () => {
    if (state.name == '' || state.name == null) {
      return <span class="unset">Name</span>
    }
    return <span>{ state.name }</span>
  }

  const Location = () => {
    if (state.location == '' || state.location == null) {
      return <span class="unset">Location</span>
    }
    return <span>{ state.location }</span>
  }

  const Description = () => {
    if (state.description == '' || state.description == null) {
      return <span class="unset">Description</span>
    }
    return <span>{ state.description }</span>
  }

  return (
    <ContactWrapper>
      <div class="header">
        <div class="title">{ state.handle }</div>
        <CloseButton type="text" class="close" size={'large'} onClick={() => actions.close()} icon={<CloseOutlined />} />
      </div>
      <div class="container">
        <div class="profile">
          <div class="avatar">
            <Logo />
          </div>
          <div class="block">
            <span class="label">details:</span>
          </div>
          <div class="details">
            <div class="name"><Name /></div>
            <div class="location"><Location /></div>
            <div class="description"><Description /></div>
          </div>
        </div>
        <div class="contact"></div>
      </div>
    </ContactWrapper>
  )
}

