import React, { useState, useEffect, useRef } from 'react'
import { Avatar } from 'avatar/Avatar';
import { MemberItemWrapper, CheckIcon, UncheckIcon } from './MemberItem.styled';
import { useMemberItem } from './useMemberItem.hook';
import { Button } from 'antd';

export function MemberItem({ readonly, item }) {

  const { state, actions } = useMemberItem({ item });

  const SetMembership = () => {
    if (readonly) {
      return <></>
    }
    if (item.member) {
      return <Button type="link" icon={<CheckIcon />} loading={state.busy}
        onClick={() => actions.clearMembership()} />
    }
    return <Button type="link" icon={<UncheckIcon />} loading={state.busy}
        onClick={() => actions.setMembership()} />
  }

  return (
    <MemberItemWrapper>
      <div class="avatar">
        <Avatar imageUrl={state.imageUrl} />
      </div>
      <div class="label">
        <div class="name">{state.name}</div>
        <div class="handle">{state.handle}</div>
      </div>
      <SetMembership />
    </MemberItemWrapper>
  )
}

