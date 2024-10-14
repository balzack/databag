import { useRegistry } from './useRegistry.hook';
import { TextInput } from '@mantine/core';
import classes from './Registry.module.css'
import { IconX, IconArrowLeft, IconServer, IconUser } from '@tabler/icons-react';

export function Registry({ close }: { close: ()=>void }) {
  const { state, actions } = useRegistry();

  return (
    <div className={classes.registry}>
      <div className={classes.header}>
        <TextInput
          className={classes.username}
          size="sm"
          leftSectionPointerEvents="none"
          leftSection={<IconUser size={20} />}
          placeholder={state.strings.username}
          value={state.username}
          onChange={(event) => actions.setUsername(event.currentTarget.value)}
        />
        <TextInput
          className={classes.server}
          size="sm"
          leftSectionPointerEvents="none"
          leftSection={<IconServer size={20} />}
          placeholder={state.strings.node}
          value={state.server}
          onChange={(event) => actions.setServer(event.currentTarget.value)}
        />
        { close && (
          <IconX className={classes.close} onClick={close} />
        )}
      </div>

      <div className={classes.cards}></div>
    </div>
  );
}

