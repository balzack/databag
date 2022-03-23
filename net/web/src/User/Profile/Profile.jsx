import React, { useState, useEffect } from 'react'
import { ProfileWrapper, CloseButton } from './Profile.styled';
import { UserOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useProfile } from './useProfile.hook';
import { Button, Modal } from 'antd'
import { ProfileInfo } from './ProfileInfo/ProfileInfo';

export function Profile(props) {

  const [ infoVisible, setInfoVisible ] = useState(false);
  const { state, actions } = useProfile();

  const Logo = () => {
    if (state.imageUrl != null) {
      if (state.imageUrl === '') {
        return <div class="logo"><UserOutlined /></div>
      }
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

  const onProfileSave = async () => {
    if (await actions.setModalProfile()) {
      setInfoVisible(false);
    }
  }

  return (
    <ProfileWrapper>
      <div class="header">
        <div class="title">{ state.handle }</div>
        <CloseButton type="text" class="close" size={'large'} onClick={() => actions.close()} icon={<CloseOutlined />} />
      </div>
      <div class="profile">
        <div class="avatar">
      <img class="logo" src={ state.imageUrl } alt="" />
          <div class="logoedit">
            <EditOutlined />
          </div>
        </div>
        <div class="details">
          <div class="name"><Name /></div>
          <div class="location"><Location /></div>
          <div class="description"><Description /></div>
          <Button type="text" onClick={() => setInfoVisible(true)} icon={<EditOutlined />} />
        </div>
      </div>
      <Modal
        title="Profile Info"
        centered
        visible={infoVisible}
        okText="Save"
        onOk={() => onProfileSave()}
        onCancel={() => setInfoVisible(false)}
      >
        <ProfileInfo state={state} actions={actions} />
      </Modal>
    </ProfileWrapper>
  )
}

