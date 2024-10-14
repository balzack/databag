import { Text } from '@mantine/core'
import { useContacts } from './useContacts.hook';
import { UnstyledButton, ActionIcon, TextInput, Button } from '@mantine/core';
import { IconSearch, IconUserPlus, IconSortAscending, IconSortDescending, IconMessage2, IconPhone } from '@tabler/icons-react';
import classes from './Contacts.module.css'
import { Card } from '../card/Card';

export function Contacts({ openRegistry }: { openRegistry: ()=>void }) {
  const { state, actions } = useContacts();

  const cards = state.filtered.map((card) => {
    const call = <ActionIcon variant="subtle"><IconPhone size={24} onClick={() => {console.log("CALL:", card.cardId)}} /></ActionIcon>
    const message = <ActionIcon variant="subtle"><IconMessage2 size={24} onClick={() => {console.log("TEXT:", card.cardId)}} /></ActionIcon>
    const options = card.status === 'connected' && !card.offsync ? [message, call] : [];
    const select = () => { console.log("SELECT:", card.cardId); }
    const status = card.offsync ? classes.offsync : classes[card.status];
    return (<Card className={`${classes.card} ${status}`} key={card.cardId} imageUrl={card.imageUrl} name={card.name} handle={card.handle} node={card.node} placeholder={state.strings.name} select={select} actions={options} />)
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

      <div className={classes.cards}>{ cards }</div>
    </div>
  );
}
