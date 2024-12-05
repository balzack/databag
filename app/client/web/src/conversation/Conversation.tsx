import React, {useEffect, useRef, useCallback} from 'react'
import { Focus } from 'databag-client-sdk'
import classes from './Conversation.module.css'
import { useConversation } from './useConversation.hook';
import { IconX } from '@tabler/icons-react'
import { Text } from '@mantine/core'
import { Message } from '../message/Message';

export type MediaAsset = {
  encrypted?: { type: string, thumb: string, label: string, extension: string, parts: { blockIv: string, partId: string }[] },
  image?: { thumb: string, full: string },
  audio?: { label: string, full: string },
  video?: { thumb: string, lq: string, hd: string },
  binary?: { label: string, extension: string, data: string }
}

export function Conversation() {
  const { state, actions } = useConversation();
  const attachImage = useRef({ click: ()=>{} } as HTMLInputElement);

  const onSelectImage = (e: any) => {
    actions.add(e.target.files[0]);
  };

  const topics = state.topics.map((topic, idx) => {
    const { host } = state;
    const card = state.cards.get(topic.guid) || null;
    const profile = state.profile?.guid === topic.guid ? state.profile : null;
    return (
      <Message
        key={idx}
        topic={topic}
        card={card}
        profile={profile}
        host={host}
      />
    )
  })

  return (
    <div className={classes.conversation}>
      <div className={classes.header}>
        <div className={classes.title} onClick={() => attachImage.current.click()}> 
          <Text className={classes.label}>CONVERSATION</Text>
        </div>
        <IconX size={24} className={classes.close} onClick={actions.close} />
      </div>
      <div className={classes.frame}>
        <div className={classes.thread}>
        {topics}
        </div>
      </div>
      <div className={classes.add}>
        <input type='file' name="asset" accept="image/*" ref={attachImage} onChange={e => onSelectImage(e)} style={{display: 'none'}}/>
      </div>
    </div>
  );
}
