import React, { useState, useEffect, useRef } from 'react'
import { Avatar } from 'avatar/Avatar';
import { MemberItemWrapper } from './MemberItem.styled';
import { useMemberItem } from './useMemberItem.hook';
import { Button } from 'antd';

export function MemberItem({ readonly, item }) {

  const { state, actions } = useMemberItem({ item });

  const SetMembership = () => {
    if (readonly) {
      return <></>
    }
    if (item.member) {
      return <Button type="primary" size="small" danger onClick={() => actions.clearMembership()}>Remove</Button>
    }
    return <Button type="primary" size="small" onClick={() => actions.setMembership()}>Add</Button>
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

