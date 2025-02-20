import classes from './Accounts.module.css'
import { useAccounts } from './useAccounts.hook'
import { Modal, Divider, Text, ActionIcon } from '@mantine/core'
import { IconUserPlus, IconReload, IconSettings, IconLockOpen2, IconUserCancel, IconTrash } from '@tabler/icons-react'
import { Card } from '../card/Card'

export function Accounts({ openSetup }: { openSetup: ()=>void }) {
  const { state, actions } = useAccounts();

  const members = state.members.map((member, idx) => {
    const options = [
      <ActionIcon key="acess" className={classes.action} variant="light" onClick={actions.reload} loading={state.loading}><IconLockOpen2 /></ActionIcon>,
      <ActionIcon key="block" className={classes.action} variant="light" onClick={actions.reload} loading={state.loading}><IconUserCancel /></ActionIcon>,
      <ActionIcon key="remove" className={classes.action} variant="light" onClick={actions.reload} loading={state.loading}><IconTrash /></ActionIcon>,
    ];

    return (
      <Card key={idx} className={classes.member} imageUrl={member.imageUrl} name={member.handle} handle={member.guid}  select={()=>{}} actions={options} />
    )
  });

  return (
    <div className={classes.accounts}>
      <div className={classes.content}>
        <div className={classes.header}>
          { state.layout !== 'large' && (
            <ActionIcon className={classes.action} variant="light" onClick={actions.reload} loading={state.loading}> 
              <IconReload />
            </ActionIcon>
          )}
          <div className={state.layout === 'large' ? classes.leftTitle : classes.centerTitle}>
            <Text className={classes.title}>{ state.strings.accounts }</Text>
          </div>
          { state.layout === 'large' && (
            <ActionIcon className={classes.action} variant="light" onClick={actions.reload} loading={state.loading}> 
              <IconReload />
            </ActionIcon>
          )}
          <ActionIcon className={classes.action} variant="light" onClick={()=>{}}> 
            <IconUserPlus />
          </ActionIcon>
          { state.layout === 'large' && (
            <ActionIcon className={classes.action} variant="light" onClick={openSetup}> 
              <IconSettings />
            </ActionIcon>
          )}
        </div>
        <div className={classes.members}>
          { members }
        </div>
      </div>
    </div>
  );
}

