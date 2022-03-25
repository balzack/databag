import React, { useState, useEffect, useRef } from 'react'
import { EditIcon, ProfileWrapper, CloseButton, ModalFooter, SelectButton } from './Profile.styled';
import { UserOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useProfile } from './useProfile.hook';
import { Button, Checkbox, Modal } from 'antd'
import { ProfileInfo } from './ProfileInfo/ProfileInfo';
import { ProfileImage } from './ProfileImage/ProfileImage';

export function Profile(props) {

  const [ logoVisible, setLogoVisible ] = useState(false);
  const [ infoVisible, setInfoVisible ] = useState(false);
  const { state, actions } = useProfile();
  const imageFile = useRef(null) 

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

  const onProfileSave = async () => {
    if (await actions.setProfileData()) {
      setInfoVisible(false);
    }
  }

  const onImageSave = async () => {
    if (await actions.setProfileImage()) {
      setLogoVisible(false);
    }
  }

  const onSelectImage = () => {
   imageFile.current.click();
  };
  
  const selected = (e) => {
    var reader = new FileReader();
    reader.onload = () => {
      actions.setModalImage(reader.result);
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  const onSearchable = (flag) => {
    actions.setSearchable(flag);
  }

  const Footer = (
      <ModalFooter>
        <input type='file' id='file' accept="image/*" ref={imageFile} onChange={e => selected(e)} style={{display: 'none'}}/>
        <div class="select">
          <Button key="select" class="select" onClick={() => onSelectImage()}>Select Image</Button>
        </div>
        <Button key="back" onClick={() => setLogoVisible(false)}>Cancel</Button>
        <Button key="save" type="primary" onClick={() => onImageSave()}>Save</Button>
      </ModalFooter>
    );

  return (
    <ProfileWrapper>
      <div class="header">
        <div class="title">{ state.handle }</div>
        <CloseButton type="text" class="close" size={'large'} onClick={() => actions.close()} icon={<CloseOutlined />} />
      </div>
      <div class="container">
        <div class="profile">
          <div class="registry">
            <span class="search">Listed in Registry</span>
            <Checkbox checked={state.searchable} onChange={(e) => onSearchable(e.target.checked)} />
          </div>
          <div class="avatar" onClick={() => setLogoVisible(true)}>
            <Logo />
            <div class="logoedit">
              <EditIcon />
            </div>
          </div>
          <div class="block" onClick={() => setInfoVisible(true)}>
            <span class="label">details:</span>
            <EditIcon class="detailedit" />
          </div>
          <div class="details">
            <div class="name"><Name /></div>
            <div class="location"><Location /></div>
            <div class="description"><Description /></div>
          </div>
        </div>
        <div class="contact"></div>
      </div>
      <Modal title="Profile Details" centered visible={infoVisible} okText="Save"
          onOk={() => onProfileSave()} onCancel={() => setInfoVisible(false)}>
        <ProfileInfo state={state} actions={actions} />
      </Modal>
      <Modal title="Profile Image" centered visible={logoVisible} footer={Footer} onCancel={() => setLogoVisible(false)}>
        <ProfileImage state={state} actions={actions} />
      </Modal>
    </ProfileWrapper>
  )
}

