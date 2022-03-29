import React, { useState } from 'react'
import { UserOutlined } from '@ant-design/icons';
import { LogoWrapper } from './Logo.styled';

export function Logo({ imageSet, imageUrl }) {
  if (imageUrl == null) {
    return <></>
  } else if (!imageSet) {
    return (
      <LogoWrapper>
        <UserOutlined />
      </LogoWrapper>
    )
  } else {
    return (
      <LogoWrapper>
        <img class='logo' src={ imageUrl } alt='' />
      </LogoWrapper>
    );
  }
}
 
