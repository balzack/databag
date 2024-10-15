import { Text } from '@mantine/core'
import { useContacts } from './useContacts.hook';
import { UnstyledButton, ActionIcon, TextInput, Button } from '@mantine/core';
import { IconSearch, IconUserPlus, IconSortAscending, IconSortDescending, IconMessage2, IconPhone } from '@tabler/icons-react';
import classes from './Contacts.module.css'
import { Card } from '../card/Card';
import { ContactParams } from '../contact/Contact';

export function Contacts({ openRegistry, openContact }: { openRegistry: ()=>void, openContact: (params: ContactParams)=>void }) {
  const { state, actions } = useContacts();

  const cards = state.filtered.map((card, idx) => {
    const call = <ActionIcon key={'call'} variant="subtle"><IconPhone size={24} onClick={() => {console.log("CALL:", card.cardId)}} /></ActionIcon>
    const message = <ActionIcon key={'text'} variant="subtle"><IconMessage2 size={24} onClick={() => {console.log("TEXT:", card.cardId)}} /></ActionIcon>
    const options = card.status === 'connected' && !card.offsync ? [message, call] : [];
    const select = () => {
      const { guid, handle, node, name, location, description, offsync, imageUrl, cardId, status } = card;
      const params = { guid, handle, node, name, location, description, offsync, imageUrl, cardId, status };
      openContact(params);
    }
    const status = card.offsync ? classes.offsync : classes[card.status];

    return (
      <Card key={idx} className={`${classes.card} ${status}`} imageUrl={card.imageUrl} name={card.name} handle={card.handle} node={card.node} placeholder={state.strings.name} select={select} actions={options} />
    )
  });

  return (
    <div className={classes.contacts}>
      <div className={classes.header}>
        <ActionIcon variant="subtle">
          { state.sortAsc && (
            <IconSortAscending size={32} onClick={actions.toggleSort} />
          )}
          { !state.sortAsc && (
            <IconSortDescending size={32} onClick={actions.toggleSort} />
          )}
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
      { cards.length !== 0 && (
        <div className={classes.cards}>{ cards }</div>
      )}
      { cards.length === 0 && (
        <div className={classes.none}>{ state.strings.noContacts }</div>
      )}
    </div>
  );
}
