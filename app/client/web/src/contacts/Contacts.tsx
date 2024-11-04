import React, {useState} from 'react'
import { useContacts } from './useContacts.hook'
import { Text, ActionIcon, TextInput, Button } from '@mantine/core'
import { IconUserCheck, IconCancel, IconRefresh, IconSearch, IconUserPlus, IconSortAscending, IconSortDescending, IconMessage2, IconPhone } from '@tabler/icons-react'
import classes from './Contacts.module.css'
import { Card } from '../card/Card'
import { ProfileParams } from '../profile/Profile'
import { Colors } from '../constants/Colors';
import { modals } from '@mantine/modals'

function Action({ icon, color, select, strings }: { icon: string, color: string, select: ()=>Promise<void> }) {
  const [loading, setLoading] = useState(false);
  const onClick = async () => {
    setLoading(true);
    try {
      await select();
    } catch (err) {
      console.log(err)
      modals.openConfirmModal({
        title: strings.operationFailed,
        withCloseButton: true,
        overlayProps: {
          backgroundOpacity: 0.55,
          blur: 3,
        },
        children: <Text>{strings.tryAgain}</Text>,
        cancelProps: { display: 'none' },
        confirmProps: { display: 'none' },
      })
    }
    setLoading(false);
  }
  return <ActionIcon variant="subtle" loading={loading} color={color} onClick={onClick}>{ icon }</ActionIcon>
}

export function Contacts({ openRegistry, openContact }: { openRegistry: () => void; openContact: (params: ProfileParams) => void }) {
  const { state, actions } = useContacts()

  const cards = state.filtered.map((card, idx) => {
    const getOptions = () => {
      const status = card.offsync ? 'offsync' : card.status;
      if (status === 'connected') {
        const call = <IconPhone size={24} />
        const text = <IconMessage2 size={24} />
        return [
          <Action key="call" icon={call} color={Colors.connected} select={() => actions.call(card.cardId)} strings={state.strings} />,
          <Action key="text" icon={text} color={Colors.connected} select={() => actions.text(card.cardId)} strings={state.strings} />
        ];
      } else if (status === 'offsync') {
        const resync = <IconRefresh size={24} />
        return [<Action key="resync" icon={resync} color={Colors.offsync} select={() => actions.resync(card.cardId)} strings={state.strings} />];
      } else if (status === 'received') {
        const accept = <IconUserCheck size={24} />
        return [<Action key="accept" icon={accept} color={Colors.received} select={() => actions.accept(card.cardId)} strings={state.strings} />];
      } else if (status === 'connecting') {
        const cancel = <IconCancel size={24} />
        return [<Action key="cancel" icon={cancel} color={Colors.connecting} select={() => actions.cancel(card.cardId)} strings={state.strings} />];
      } else if (status === 'pending') {
        const accept = <IconUserCheck size={24} />
        return [<Action key="accept" icon={accept} color={Colors.pending} select={() => actions.accept(card.cardId)} strings={state.strings} />];
      } else {
        return [];
      }
    }
    const options = getOptions();

    const select = () => {
      const { guid, handle, node, name, location, description, offsync, imageUrl, cardId, status } = card
      const params = { guid, handle, node, name, location, description, offsync, imageUrl, cardId, status }
      openContact(params)
    }
    const status = card.offsync ? classes.offsync : classes[card.status]

    return (
      <Card
        key={idx}
        className={classes.card}
        imageUrl={card.imageUrl}
        name={card.name}
        handle={card.handle}
        node={card.node}
        placeholder={state.strings.name}
        select={select}
        actions={options}
      />
    )
  })

  return (
    <div className={classes.contacts}>
      <div className={classes.header}>
        <ActionIcon variant="subtle">
          {state.sortAsc && <IconSortAscending size={32} onClick={actions.toggleSort} />}
          {!state.sortAsc && <IconSortDescending size={32} onClick={actions.toggleSort} />}
        </ActionIcon>
        <TextInput
          className={classes.input}
          size="sm"
          leftSectionPointerEvents="none"
          leftSection={<IconSearch size={20} />}
          placeholder={state.strings.contacts}
          value={state.filter}
          onChange={(event) => actions.setFilter(event.currentTarget.value)}
        />
        <Button className={classes.add} leftSection={<IconUserPlus size={20} />} onClick={openRegistry}>
          {state.strings.add}
        </Button>
      </div>
      {cards.length !== 0 && <div className={classes.cards}>{cards}</div>}
      {cards.length === 0 && <div className={classes.none}>{state.strings.noContacts}</div>}
    </div>
  )
}
