import { useEffect, useState } from 'react';
import classes from './Accounts.module.css'
import { useAccounts } from './useAccounts.hook'
import { Modal, Divider, Text, ActionIcon, Button } from '@mantine/core'
import { IconUserPlus, IconUserCheck, IconCopy, IconCheck, IconReload, IconSettings, IconLockOpen2, IconUserCancel, IconTrash } from '@tabler/icons-react'
import { Card } from '../card/Card'
import { Colors } from '../constants/Colors';
import { modals } from '@mantine/modals'
import { useDisclosure } from '@mantine/hooks'

export function Accounts({ openSetup }: { openSetup: ()=>void }) {
  const { state, actions } = useAccounts();
  const [loading, setLoading] = useState(false);
  const [blocking, setBlocking] = useState(null as null | number);
  const [removing, setRemoving] = useState(null as null | number);
  const [accessing, setAccessing] = useState(null as null | number);
  const [adding, setAdding] = useState(false);
  const [accessOpened, { open: accessOpen, close: accessClose }] = useDisclosure(false)
  const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false)
  const [tokenCopy, setTokenCopy] = useState(false);
  const [linkCopy, setLinkCopy] = useState(false);
  const [token, setToken] = useState('');
  const link = `${window.location.origin}/#/create?add=${token}`;

  useEffect(() => {
    actions.reload();
  }, []);

  const loadAccounts = async () => {
    if (!loading) {
      setLoading(true);
      try {
        await actions.reload();
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
  }

  const copyToken = async () => {
    if (!tokenCopy) {
      try {
        navigator.clipboard.writeText(token)
        setTokenCopy(true);
        setTimeout(() => {
          setTokenCopy(false);
        }, 2000);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const copyLink = async () => {
    if (!linkCopy) {
      try {
        navigator.clipboard.writeText(link)
        setLinkCopy(true);
        setTimeout(() => {
          setLinkCopy(false);
        }, 2000);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const showError = () => {
    modals.openConfirmModal({
      title: state.strings.operationFailed,
      withCloseButton: true,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: <Text>{state.strings.tryAgain}</Text>,
      cancelProps: { display: 'none' },
      confirmProps: { display: 'none' },
    })
  }

  const addAccount = async () => {
    if (!adding) {
      setAdding(true);
      try {
        const access = await actions.addAccount();
        setToken(access);
        addOpen();
      } catch (err) {
        console.log(err);
        showError();
      }
      setAdding(false);
    }
  }

  const accessAccount = async (accountId: number) => {
    if (!accessing) {
      setAccessing(accountId);
      try {
        const access = await actions.accessAccount(accountId);
        setToken(access);
        accessOpen();
      } catch (err) {
        console.log(err);
        showError();
      }
      setAccessing(null);
    }
  }

  const blockAccount = async (accountId: number, block: boolean) => {
    if (!blocking) {
      setBlocking(accountId);
      try {
        await actions.blockAccount(accountId, block);
      } catch (err) {
        console.log(err);
        showError();
      }
      setBlocking(null);
    }
  }

  const removeAccount = (accountId: number) => {
    modals.openConfirmModal({
      title: state.strings.confirmDelete,
      withCloseButton: false,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: <Text>{ state.strings.areSure }</Text>,
      labels: { confirm: state.strings.remove, cancel: state.strings.cancel },
      onConfirm: async () => {
        if (!removing) {
          setRemoving(accountId);
          try {
            await actions.removeAccount(accountId);
          } catch (err) {
            console.log(err);
            showError();
          }
          setRemoving(null);
        }
      }
    });
  }

  const members = state.members.map((member, idx) => {
    const options = [
      <ActionIcon key="acess" className={classes.action} variant="light" loading={removing === member.accountId} onClick={() => accessAccount(member.accountId)}>
        <IconLockOpen2 />
      </ActionIcon>,
      <ActionIcon key="block" className={classes.action} variant="light" loading={blocking === member.accountId} color={Colors.pending} onClick={() => blockAccount(member.accountId, !member.disabled)}>
        { member.disabled && (
          <IconUserCheck />
        )}
        { !member.disabled && (
          <IconUserCancel />
        )}
      </ActionIcon>,
      <ActionIcon key="remove" className={classes.action} variant="light" loading={removing === member.accountId} color={Colors.offsync} onClick={() => removeAccount(member.accountId)}><IconTrash /></ActionIcon>,
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
            <ActionIcon className={classes.action} variant="light" onClick={actions.reload} loading={loading}> 
              <IconReload />
            </ActionIcon>
          )}
          <div className={state.layout === 'large' ? classes.leftTitle : classes.centerTitle}>
            <Text className={classes.title}>{ state.strings.accounts }</Text>
          </div>
          { state.layout === 'large' && (
            <ActionIcon className={classes.action} variant="light" onClick={actions.reload} loading={loading}> 
              <IconReload />
            </ActionIcon>
          )}
          <ActionIcon className={classes.action} variant="light" onClick={addAccount}> 
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
      <Modal title={state.strings.addingTitle} size="lg" opened={addOpened} onClose={addClose} overlayProps={{ backgroundOpacity: 0.55, blur: 3 }} centered>
        <div className={classes.modal}>
          <Text className={classes.prompt}>{state.strings.addingLink}:</Text>
          <div className={classes.copy}>
            <Text className={classes.value}>{ link }</Text>
            {linkCopy && <IconCheck size="16" />}
            {!linkCopy && <IconCopy size="16" className={classes.icon} onClick={copyLink} />}
          </div>
          <Text className={classes.prompt}>{state.strings.addingToken}:</Text>
          <div className={classes.copy}>
            <Text className={classes.value}>{ token }</Text>
            {tokenCopy && <IconCheck size="16" />}
            {!tokenCopy && <IconCopy size="16" className={classes.icon} onClick={copyToken} />}
          </div>
          <div className={classes.control}>
            <Button onClick={addClose}>{ state.strings.close }</Button>
          </div>
        </div>
      </Modal>
      <Modal title={state.strings.accessingTitle} size="lg" opened={accessOpened} onClose={accessClose} overlayProps={{ backgroundOpacity: 0.55, blur: 3 }} centered>
        <div className={classes.modal}>
          <Text className={classes.prompt}>{state.strings.accessingLink}:</Text>
          <div className={classes.copy}>
            <Text className={classes.value}>{ link }</Text>
            {linkCopy && <IconCheck size="16" />}
            {!linkCopy && <IconCopy size="16" className={classes.icon} onClick={copyLink} />}
          </div>
          <Text className={classes.prompt}>{state.strings.accessingToken}:</Text>
          <div className={classes.copy}>
            <Text className={classes.value}>{ token }</Text>
            {tokenCopy && <IconCheck size="16" />}
            {!tokenCopy && <IconCopy size="16" className={classes.icon} onClick={copyToken} />}
          </div>
          <div className={classes.control}>
            <Button onClick={addClose}>{ state.strings.close }</Button>
          </div>
        </div>
      </Modal> 
    </div>
  );
}

