import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop'
import { ProfileImageWrapper } from './ProfileImage.styled';

export function ProfileImage({ state, actions }) {

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const onCropComplete = useCallback((area, crop) => {
    actions.setEditImageCrop(crop.width, crop.height, crop.x, crop.y)
    // eslint-disable-next-line
  }, []);

  return (
    <ProfileImageWrapper>
      <Cropper image={state.editImage} crop={crop} zoom={zoom} aspect={1}
          onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
    </ProfileImageWrapper>
  )
}

