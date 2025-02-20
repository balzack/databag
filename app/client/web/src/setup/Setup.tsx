import classes from './Setup.module.css'
import { useSetup } from './useSetup.hook'
import { Loader, Modal, Divider, Text, ActionIcon } from '@mantine/core'

export function Setup() {
  const { state, actions } = useSetup();

  return (
    <div className={classes.accounts}>
      <div className={classes.content}>
        <div className={classes.header}>
          { state.loading && (
            <Loader size={18} />
          )}
          <div className={classes.centerTitle}>
            <Text className={classes.title}>{ state.strings.setup }</Text>
          </div>
          { state.updating && (
            <Loader size={18} />
          )}
        </div>
        <Divider className={classes.line} />
      </div>
    </div>
  );
}

