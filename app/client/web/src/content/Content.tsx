import React, {useState} from 'react';
import { useContent } from './useContent.hook'
import { Modal, TextInput, Button } from '@mantine/core'
import { IconSearch, IconMessagePlus, IconLabel } from '@tabler/icons-react'
import classes from './Content.module.css'
import { Channel } from '../channel/Channel'
import { Focus } from 'databag-client-sdk'

export function Content({ select }: { select: (focus: Focus) => void }) {
  const { state, actions } = useContent()
  const [add, setAdd] = useState(false);

  const addTopic = async () => {
  }

  const channels = state.filtered.map((channel, idx) => {
    return (
      <Channel
        key={idx}
        className={classes.channel}
        unread={channel.unread}
        imageUrl={channel.imageUrl}
        subject={channel.subject}
        messagePlaceholder={`[${state.strings.sealed}]`}
        notesPlaceholder={state.strings.notes}
        subjectPlaceholder={state.strings.unknown}
        message={channel.message}
        select={() => {
          select(actions.getFocus(channel.cardId, channel.channelId))
        }}
      />
    )
  })

  return (
    <div className={classes.content}>
      <div className={classes.header}>
        <TextInput
          className={classes.input}
          size="sm"
          leftSectionPointerEvents="none"
          leftSection={<IconSearch size={20} />}
          placeholder={state.strings.contacts}
          value={state.filter}
          onChange={(event) => actions.setFilter(event.currentTarget.value)}
        />
        {state.layout === 'small' && (
          <Button className={classes.add} leftSection={<IconMessagePlus size={20} />} onClick={() => setAdd(true)}>
            {state.strings.add}
          </Button>
        )}
      </div>
      {channels.length === 0 && <div className={classes.none}>{state.strings.noTopics}</div>}
      {channels.length !== 0 && <div className={classes.channels}>{channels}</div>}
      {state.layout === 'large' && (
        <div className={classes.bar}>
          <Button className={classes.add} leftSection={<IconMessagePlus size={20} />} onClick={() => setAdd(true)}>
            {state.strings.add}
          </Button>
        </div>
      )}
      <Modal title={state.strings.newTopic} opened={add} onClose={() => setAdd(false)} overlayProps={{ backgroundOpacity: 0.55, blur: 3 }} centered>
        <div className={classes.addContainer}>
          <TextInput
            className={classes.input}
            size="sm"
            leftSectionPointerEvents="none"
            leftSection={<IconLabel size={20} />}
            placeholder={state.strings.subjectOptional}
            value={state.filter}
            onChange={(event) => actions.setFilter(event.currentTarget.value)}
          />
          <div className={classes.addMembers}>

          </div>
        </div>
      </Modal>
    </div>
  )
}
