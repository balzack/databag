import React, { useEffect, useState } from 'react'
import { useChannelItem } from './useChannelItem.hook';
import { ChannelItemWrapper, Marker } from './ChannelItem.styled';
import { ChannelLogo } from './ChannelLogo/ChannelLogo';
import { ChannelLabel } from './ChannelLabel/ChannelLabel';

export function ChannelItem({ item }) {

  let { state, actions } = useChannelItem(item);

  const onSelect = () => {
    actions.select(item);
  }

  return (
    <ChannelItemWrapper onClick={() => onSelect()}>
      <ChannelLogo item={item} />
      {state.updated && (
        <Marker />
      )}
      <ChannelLabel item={item} />
    </ChannelItemWrapper>
  )
}

