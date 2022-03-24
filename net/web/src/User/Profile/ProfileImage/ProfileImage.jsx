import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop'
import { UserOutlined } from '@ant-design/icons';
import { ProfileSpin, ProfileImageWrapper, ProfileDefaultImage } from './ProfileImage.styled';

export function ProfileImage({ state, actions }) {
  
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const onCropComplete = useCallback((area, crop) => {
    actions.setModalCrop(crop.width, crop.height, crop.x, crop.y) 
  });

  const Logo = () => {
    if (state.modalImage == null) {
      return <ProfileDefaultImage class="logo"><UserOutlined /></ProfileDefaultImage>
    }
    return <></>
  }

  return (
    <ProfileImageWrapper>
      <Cropper image={state.modalImage} crop={crop} zoom={zoom} aspect={1} 
          onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
      <Logo /> 
      <ProfileSpin size="large" spinning={state.modalBusy} />
    </ProfileImageWrapper>
  )
}
