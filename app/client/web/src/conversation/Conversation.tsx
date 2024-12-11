import React, {useEffect, useRef, useCallback} from 'react'
import { Focus } from 'databag-client-sdk'
import classes from './Conversation.module.css'
import { useConversation } from './useConversation.hook';
import { IconX, IconSettings, IconHome, IconServer, IconShield, IconLock, IconExclamationCircle } from '@tabler/icons-react'
import { Divider, Text, ActionIcon, Loader } from '@mantine/core'
import { Message } from '../message/Message';

const LOAD_MORE_POS = 12;
const LOAD_DEBOUNCE = 1000;

export type MediaAsset = {
  encrypted?: { type: string, thumb: string, label: string, extension: string, parts: { blockIv: string, partId: string }[] },
  image?: { thumb: string, full: string },
  audio?: { label: string, full: string },
  video?: { thumb: string, lq: string, hd: string },
  binary?: { label: string, extension: string, data: string }
}

export function Conversation() {
  const thread = useRef(null as HTMLDivElement | null);
  const scrollPos = useRef(0);
  const debounce = useRef(false);
  const { state, actions } = useConversation();
  const attachImage = useRef({ click: ()=>{} } as HTMLInputElement);

  const onSelectImage = (e: any) => {
    actions.add(e.target.files[0]);
  };

  const onScroll = () => {
    const { scrollHeight, clientHeight, scrollTop } = thread.current || { scrollHeight: 0, clientHeight: 0, scrollTop: 0 }
    if (thread.current && state.loadingMore) {
      thread.current.scrollTop = scrollPos.current;
    } else {
      if (scrollPos.current > scrollTop && scrollHeight - (clientHeight - scrollTop) < LOAD_MORE_POS) {
        if (scrollTop < scrollPos.current) {
          actions.more();
        }
      }
      scrollPos.current = scrollTop;
    }
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
        <div className={classes.status}>
          <ActionIcon variant="subtle"> 
            <IconSettings size={24} />
          </ActionIcon>
          <Divider size="sm" orientation="vertical" />
          { state.detailSet && state.host === true && (
            <IconHome size={24} />
          )}
          { state.detailSet && state.host === false && (
            <IconServer size={24} />
          )}
          { state.detailSet && state.sealed === true && (
            <IconShield size={24} />
          )}
          { state.detailSet && state.access === false && (
            <IconExclamationCircle size={24} />
          )}
        </div>
        <div className={classes.title} onClick={() => attachImage.current.click()}> 
          { state.detailSet && state.subject && (
            <Text className={classes.label}>{ state.subject }</Text>
          )}
          { state.detailSet && state.host && !state.subject && state.subjectNames.length == 0 && (
            <Text className={classes.label}>{ state.strings.notes }</Text>
          )}
          { state.detailSet && !state.subject && state.subjectNames.length > 0 && (
            <Text className={classes.label}>{ state.subjectNames.join(', ') }</Text>
          )}
          { state.detailSet && !state.subject && state.unknownContacts > 0 && (
            <Text className={classes.unknown}>{ `, ${state.strings.unknownContact} (${state.unknownContacts})` }</Text>
          )}
        </div>
        <div className={classes.control}>
          <IconX size={24} className={classes.close} onClick={actions.close} />
        </div>
      </div>
      <div ref={thread} className={classes.frame} onScroll={onScroll}>
        { state.loaded && (
          <div className={classes.thread}>
            {topics}
          </div>
        )}
        { state.loadingMore && (
          <div className={classes.topSpinner}>
            <Loader size={32} />
          </div>
        )}
        { !state.loaded && (
          <div className={classes.bottomSpinner}>
            <Loader size={48} />
          </div>
        )}
      </div>
      <div className={classes.add}>
        <input type='file' name="asset" accept="image/*" ref={attachImage} onChange={e => onSelectImage(e)} style={{display: 'none'}}/>
      </div>
    </div>
  );
}
