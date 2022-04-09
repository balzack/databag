import React, { useEffect, useState } from 'react'
import { ChannelItemWrapper } from './ChannelItem.styled';
import { ChannelLogo } from './ChannelLogo/ChannelLogo';
import { ChannelLabel } from './ChannelLabel/ChannelLabel';

export function ChannelItem({ item }) {

  // if 0 or 5+ render number in big border
  // if 2 renber other in big border
  // if 3 or 4 render others in small borders

  // subject, hosting, username list, last msg, updated time, unread flag  

  const onSelect = () => {
    console.log(item);
  }

  return (
    <ChannelItemWrapper onClick={() => onSelect()}>
      <ChannelLogo item={item} />
      <ChannelLabel item={item} />
    </ChannelItemWrapper>
  )
}

