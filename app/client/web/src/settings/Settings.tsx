import { useSettings } from './useSettings.hook';
import { Text, Image, Button } from '@mantine/core';
import classes from './Settings.module.css';

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
    </div>
  );
}

