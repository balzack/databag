import React, { useState, useEffect, useRef } from 'react'
import { useMembers } from './useMembers.hook';
import { List } from 'antd';
import { MemberItem } from './MemberItem/MemberItem';
import { MembersWrapper } from './Members.styled';

export function Members({ host, members }) {

  const { state, actions } = useMembers({ host, members });

  return (
    <MembersWrapper>
      <List
        locale={{ emptyText: '' }}
        itemLayout="horizontal"
        dataSource={state.contacts}
        renderItem={item => (
          <MemberItem readonly={state.readonly} item={item} />
        )}
      />
    </MembersWrapper>
  )
}

