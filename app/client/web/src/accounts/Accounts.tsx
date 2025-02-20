import classes from './Accounts.module.css'
import { useAccounts } from './useAccounts.hook'
import { Modal, Divider, Text, ActionIcon } from '@mantine/core'

export function Accounts({ openSetup }: { openSetup: ()=>void }) {
  const { state, actions } = useAccounts();

  return (
    <div className={classes.accounts}>
      <div className={classes.content}>
        <div className={classes.header}>
          <div className={state.layout === 'large' ? classes.leftTitle : classes.centerTitle}>
            <Text className={classes.title}>{ state.strings.accounts }</Text>
          </div>
        </div>
        <Divider className={classes.line} />
      </div>
    </div>
  );
}

