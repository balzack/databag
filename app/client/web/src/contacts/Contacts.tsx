import { Text } from '@mantine/core'
import { useContacts } from './useContacts.hook';
import { UnstyledButton, ActionIcon, TextInput, Button } from '@mantine/core';
import { IconSearch, IconUserPlus, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import classes from './Contacts.module.css'
import { Card } from '../card/Card';

export function Contacts() {
  const { state, actions } = useContacts();

  const cards = state.filtered.map((card) => <Card className={classes.card} key={card.cardId} imageUrl={card.imageUrl} name={card.name} handle={card.handle} node={card.node} placeholder={state.strings.name} children={<IconSearch />} />)

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
        <Button className={classes.add} leftSection={<IconUserPlus size={20} />}>
          {state.strings.add}
        </Button>
      </div>

      <div className={classes.cards}>{ cards }</div>
    </div>
  );
}
