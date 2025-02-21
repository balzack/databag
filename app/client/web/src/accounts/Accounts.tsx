import { useEffect, useState } from 'react';
import classes from './Accounts.module.css'
import { useAccounts } from './useAccounts.hook'
import { Modal, Divider, Text, ActionIcon } from '@mantine/core'
import { IconUserPlus, IconUserCheck, IconReload, IconSettings, IconLockOpen2, IconUserCancel, IconTrash } from '@tabler/icons-react'
import { Card } from '../card/Card'
import { Colors } from '../constants/Colors';

export function Accounts({ openSetup }: { openSetup: ()=>void }) {
  const { state, actions } = useAccounts();
  const [failed, setFailed] = useState(false);
  const [blocking, setBlocking] = useState(null as null | number);

  useEffect(() => {
    actions.reload();
  }, []);

  const blockAccount = async (accountId: number, block: boolean) => {
    if (!blocking) {
      setBlocking(accountId);
      try {
        await actions.blockAccount(accountId, block);
      } catch (err) {
        console.log(err);
        setFailed(true);
      }
      setBlocking(null);
    }
  }

  const members = state.members.map((member, idx) => {
    const options = [
      <ActionIcon key="acess" className={classes.action} variant="light" onClick={actions.reload} loading={false}><IconLockOpen2 /></ActionIcon>,
      <ActionIcon key="block" className={classes.action} variant="light" loading={blocking === member.accountId} color={Colors.pending} onClick={() => blockAccount(member.accountId, !member.disabled)}>
        { member.disabled && (
          <IconUserCheck />
        )}
        { !member.disabled && (
          <IconUserCancel />
        )}
      </ActionIcon>,
      <ActionIcon key="remove" className={classes.action} variant="light" onClick={actions.reload} loading={false} color={Colors.offsync}><IconTrash /></ActionIcon>,
    ];

    return (
      <Card key={idx} className={classes.member} imageUrl={member.imageUrl} name={member.handle} handle={member.guid}  select={()=>{}} actions={options} placeholder="" node="" />
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

