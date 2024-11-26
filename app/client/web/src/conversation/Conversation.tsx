import React, {useEffect, useRef} from 'react'
import { Focus } from 'databag-client-sdk'
import classes from './Conversation.module.css'
import { useConversation } from './useConversation.hook';
import { IconX } from '@tabler/icons-react'
import { Text } from '@mantine/core'

export function Conversation() {
  const { state, actions } = useConversation();
  const attachImage = useRef({ click: ()=>{} } as HTMLInputElement);

  const onSelectImage = (e: any) => {
    actions.add(e.target.files[0]);
  };

  return (
    <div className={classes.conversation}>
      <div className={classes.header}>
        <div className={classes.title} onClick={() => attachImage.current.click()}> 
          <Text className={classes.label}>CONVERSATION</Text>
        </div>
        <IconX size={30} className={classes.close} onClick={actions.close} />
      </div>
      <input type='file' name="asset" accept="image/*" ref={attachImage} onChange={e => onSelectImage(e)} style={{display: 'none'}}/>
    </div>
  );
}
