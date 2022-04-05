import React, { useState, useEffect, useRef } from 'react'
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import { useContact } from './useContact.hook';
import { Button, Checkbox, Modal } from 'antd'
import { ContactWrapper, ProfileButton, CloseButton, ContactSpin } from './Contact.styled';

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

  const Disconnect = () => {
    if (state.showButtons.disconnect) {
      return <ProfileButton ghost>Disconnect</ProfileButton>
    }
    return <></>
  }

  const Remove = () => {
    if (state.showButtons.remove) {
      return <ProfileButton ghost onClick={() => actions.remove()}>Remove Contact</ProfileButton>
    }
    return <></>
  }

  const Cancel = () => {
    if (state.showButtons.cancel) {
      return <ProfileButton ghost>Cancel Request</ProfileButton>
    }
    return <></>
  }

  const Ignore = () => {
    if (state.showButtons.ignore) {
      return <ProfileButton ghost>Ignore Request</ProfileButton>
    }
    return <></>
  }

  const Save = () => {
    if (state.showButtons.save) {
      return <ProfileButton ghost onClick={() => actions.save()}>Save Contact</ProfileButton>
    }
    return <></>
  }

  const SaveRequest = () => {
    if (state.showButtons.saveRequest) {
      return <ProfileButton ghost>Save & Request</ProfileButton>
    }
    return <></>
  }

  const Connect = () => {
    if (state.showButtons.connect) {
      return <ProfileButton ghost>Connect</ProfileButton>
    }
    return <></>
  }

  const SaveAccept = () => {
    if (state.showButtons.saveAccept) {
      return <ProfileButton ghost>Save & Accept</ProfileButton>
    }
    return <></>
  }

  const Accept = () => {
    if (state.showButtons.accept) {
      return <ProfileButton ghost>Accept Connection</ProfileButton>
    }
    return <></>
  }

  return (
    <ContactWrapper>
      <div class="header">
        <div class="title">{ state.handle }</div>
        <div class="buttons">
          <ContactSpin size="large" spinning={state.busy} />
          <Disconnect />
          <Remove />
          <Cancel />
          <Ignore />
          <Save />
          <SaveRequest />
          <Connect />
          <SaveAccept />
          <Accept />
        </div>
        <CloseButton type="text" class="close" size={'large'} onClick={() => actions.close()} icon={<CloseOutlined />} />
      </div>
      <div class="container">
        <div class="profile">
          <div class="avatar">
            <Logo />
          </div>
          <div class="block">
            <span class="label">status: { state.status }</span>
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

