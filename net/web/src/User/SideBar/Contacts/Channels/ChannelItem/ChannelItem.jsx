import React, { useEffect, useState } from 'react'
import { useChannelItem } from './useChannelItem.hook';
import { ChannelItemWrapper } from './ChannelItem.styled';
import { ChannelLogo } from './ChannelLogo/ChannelLogo';
import { ChannelLabel } from './ChannelLabel/ChannelLabel';

export function ChannelItem({ item }) {

  let { state, actions } = useChannelItem();

  const onSelect = () => {
    actions.select(item);
  }

  return (
    <ChannelItemWrapper onClick={() => onSelect()}>
      <ChannelLogo item={item} />
      <ChannelLabel item={item} />
    </ChannelItemWrapper>
  )
}

