import React, {useEffect} from 'react'
import { Focus } from 'databag-client-sdk'
import classes from './Conversation.module.css'
import { useConversation } from './useConversation.hook';
import { IconX } from '@tabler/icons-react'
import { Text } from '@mantine/core'

export function Conversation() {
  const { state, actions } = useConversation();
  return (
    <div className={classes.conversation}>
      <div className={classes.header}>
        <div className={classes.title} onClick={actions.more}> 
          <Text className={classes.label}>CONVERSATION</Text>
        </div>
        <IconX size={30} className={classes.close} onClick={actions.close} />
      </div>
    </div>
  );
}
