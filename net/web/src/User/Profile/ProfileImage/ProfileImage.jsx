import React, { useState } from 'react';
import Cropper from 'react-easy-crop'
import { UserOutlined } from '@ant-design/icons';
import { ProfileImageWrapper, ProfileDefaultImage } from './ProfileImage.styled';

export function ProfileImage({ state, actions }) {
  
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log("crop complete");
  };

  const Logo = () => {
    if (state.modalImage == null) {
      return <ProfileDefaultImage class="logo"><UserOutlined /></ProfileDefaultImage>
    }
    return <></>
  }

  const onSelect = () => {
    console.log("ON SELECT");
  }

  return (
    <ProfileImageWrapper>
      <Cropper onClick={() => onSelect()} image={state.modalImage} crop={crop} zoom={zoom} aspect={1} 
          onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
      <Logo /> 
    </ProfileImageWrapper>
  )
}
