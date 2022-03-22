import React from 'react'
import { ProfileWrapper, CloseButton } from './Profile.styled';
import { UserOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useProfile } from './useProfile.hook';
import { Button } from 'antd'

export function Profile(props) {

  const { state, actions } = useProfile();

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
    <ProfileWrapper>
      <div class="header">
        <div class="title">{ state.handle }</div>
        <CloseButton type="text" class="close" size={'large'} onClick={() => actions.close()} icon={<CloseOutlined />} />
      </div>
      <div class="profile">
        <div class="avatar">
          <Logo />
        </div>
        <div class="logoedit">
          <EditOutlined />
        </div>
        <div class="details">
          <div class="name"><Name /></div>
          <div class="location"><Location /></div>
          <div class="description"><Description /></div>
          <Button type="text" icon={<EditOutlined />} />
        </div>
      </div>
    </ProfileWrapper>
  )
}

