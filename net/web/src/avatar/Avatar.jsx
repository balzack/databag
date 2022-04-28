import React, { useState } from 'react'
import { UserOutlined } from '@ant-design/icons';
import { AvatarWrapper } from './Avatar.styled';

export function Avatar({ imageUrl }) {
  if (imageUrl == null) {
    return (
      <AvatarWrapper>
        <UserOutlined />
      </AvatarWrapper>
    )
  } else {
    return (
      <AvatarWrapper>
        <img class='avatar' src={ imageUrl } alt='' />
      </AvatarWrapper>
    );
  }
}
 
