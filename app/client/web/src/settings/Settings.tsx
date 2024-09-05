import { useSettings } from './useSettings.hook';
import { Switch, Text, Image, Button, UnstyledButton } from '@mantine/core';
import classes from './Settings.module.css';
import { IconCloudLock, IconBell, IconEye, IconBook, IconMapPin } from '@tabler/icons-react'

export function Settings() {
  const { state, actions } = useSettings();

  console.log(state);
  
  return (
    <div className={classes.settings}>
      <Text className={classes.header}>{`${state.profile.handle}${state.profile.node ? '/' + state.profile.node : ''}`}</Text>
      <div className={classes.image}>
        <Image radius="md" src={state.imageUrl} /> 
        <div className={classes.edit}>
          <Button size="compact-md" variant="light">{ state.strings.edit }</Button>
        </div>
      </div>
      <div className={classes.section}>
        <div className={classes.divider} />
        <UnstyledButton className={classes.sectionEdit}>{ state.strings.edit }</UnstyledButton>
      </div>
      { !state.profile.name && (
        <Text className={classes.nameUnset}>{state.strings.name}</Text>
      )}
      { state.profile.name && (
        <Text className={classes.nameSet}>{state.profile.name}</Text>
      )}
      <div className={classes.entry}>
        <div className={classes.entryIcon}>
          <IconMapPin />
        </div>
        { !state.profile.location && (
          <Text className={classes.entryUnset}>{state.strings.location}</Text>
        )}
        { state.profile.location && (
          <Text className={classes.entrySet}>{state.profile.location}</Text>
        )}
      </div>
      <div className={classes.entry}>
        <div className={classes.entryIcon}>
          <IconBook />
        </div>
        { !state.profile.description && (
          <Text className={classes.entryUnset}>{state.strings.description}</Text>
        )}
        { state.profile.description && (
          <Text className={classes.entrySet}>{state.profile.description}</Text>
        )}
      </div>
      <div className={classes.divider} />
      <div className={classes.entry}>
        <div className={classes.entryIcon}>
          <IconEye />
        </div>
        <div className={classes.entryValue}>
          <Text className={classes.entryLabel}>{ state.strings.registry }</Text>
          <Switch className={classes.entryControl} />
        </div>
      </div>
      <div className={classes.entry}>
        <div className={classes.entryIcon}>
          <IconCloudLock />
        </div>
        <div className={classes.entryValue}>
          <Text className={classes.entryLabel}>{ state.strings.manageTopics }</Text>
        </div>
      </div>
      <div className={classes.entry}>
        <div className={classes.entryIcon}>
          <IconBell />
        </div>
        <div className={classes.entryValue}>
          <Text className={classes.entryLabel}>{ state.strings.enableNotifications }</Text>
          <Switch className={classes.entryControl} />
        </div>
      </div>
    </div>
  );
}

