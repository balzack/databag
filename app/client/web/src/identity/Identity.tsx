import { useState } from 'react';
import classes from './Identity.module.css';
import { useIdentity } from './useIdentity.hook';
import { Menu, Switch } from '@mantine/core';
import {
  IconLogout,
  IconSettings,
  IconAddressBook
} from '@tabler/icons-react'
import { modals } from '@mantine/modals';

export function Identity({ settings, contacts }) {
  const { state, actions } = useIdentity();
  const [all, setAll] = useState(false);

  const click = (ev) => {
    console.log("CLICK", ev.currentTarget.checked);
  }

  const logout = () => modals.openConfirmModal({
    title: state.strings.confirmLogout,
    withCloseButton: false,
    children: (
      <Switch label={state.strings.allDevices} value={all} size="md" onChange={(ev) => actions.setAll(ev.currentTarget.checked)} />
    ),
    labels: { confirm: state.strings.logout, cancel: state.strings.cancel },
    onConfirm: actions.logout,
  });

  return (
    <Menu shadow="md" position="right">
      <Menu.Target>
        <div className={classes.identity}>IDENTITY</div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={settings} leftSection={<IconSettings />}>{ state.strings.settings }</Menu.Item>
        <Menu.Item leftSection={<IconAddressBook />}>{ state.strings.contacts }</Menu.Item>
        <Menu.Item onClick={logout} leftSection={<IconLogout />}>{ state.strings.logout }</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
