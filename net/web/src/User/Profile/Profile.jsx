import React from 'react'
import { ProfileWrapper } from './Profile.styled';
import { CloseOutlined } from '@ant-design/icons';
import { useProfile } from './useProfile.hook';

export function Profile(props) {

  const { state, actions } = useProfile();

  return (
    <ProfileWrapper>
      <div class="close" onClick={() => actions.close()}>
        <CloseOutlined />
      </div>
    </ProfileWrapper>
  )
}

