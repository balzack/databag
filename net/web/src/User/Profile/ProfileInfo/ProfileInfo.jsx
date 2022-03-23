import React from 'react';
import { ProfileInfoWrapper, ProfileInput, ProfileDescription, ProfileSpin } from './ProfileInfo.styled';

export function ProfileInfo({ state, actions }) {

  return (
    <ProfileInfoWrapper>
      <ProfileInput size="large" spellCheck="false" placeholder="Name"
        onChange={(e) => actions.setModalName(e.target.value)} value={state.modalName} />
      <ProfileInput size="large" spellCheck="false" placeholder="Location"
        onChange={(e) => actions.setModalLocation(e.target.value)} value={state.modalLocation} />
      <ProfileDescription spellCheck="false" placeholder="Description" autoSize={{ minRows: 2, maxRows: 6 }}
          onChange={(e) => actions.setModalDescription(e.target.value)} value={state.modalDescription} />
      <ProfileSpin size="large" spinning={state.modalBusy} />
    </ProfileInfoWrapper>
  )
}
