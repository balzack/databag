import { useRegistry } from './useRegistry.hook';
import { TextInput } from '@mantine/core';
import classes from './Registry.module.css'
import { IconX, IconArrowLeft, IconServer, IconUser } from '@tabler/icons-react';
import { Card } from '../card/Card';

export function Registry({ close }: { close?: ()=>void }) {
  const { state, actions } = useRegistry();

console.log(state.profiles);
  const profiles = state.profiles.map((profile, idx) => {
    const select = () => { console.log("SELECT") }
    return (
      <Card key={idx} className={classes.card} imageUrl={profile.imageUrl} name={profile.name} handle={profile.handle} node={profile.node} placeholder={state.strings.name} select={select} actions={[]} />
    )
  });

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

      <div className={classes.cards}>{ profiles }</div>
    </div>
  );
}
