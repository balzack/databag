import { Text } from '@mantine/core'
import { useContacts } from './useContacts.hook';
import { UnstyledButton, ActionIcon, TextInput, Button } from '@mantine/core';
import { IconSearch, IconUserPlus, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import classes from './Contacts.module.css'

export function Contacts() {
  const { state, actions } = useContacts();

  return (
    <div className={classes.contacts}>
      <div className={classes.header}>
        <ActionIcon variant="subtle">
          <IconSortDescending size={32} />
        </ActionIcon>
        <TextInput
          className={classes.input}
          size="sm"
          leftSectionPointerEvents="none"
          leftSection={<IconSearch size={20} />}
          placeholder={state.strings.contacts}
        />
        <Button classNae={classes.add} leftSection={<IconUserPlus size={20} />}>
          {state.strings.add}
        </Button>
      </div>
    </div>
  );
}
