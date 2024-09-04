import classes from './Identity.module.css';
import { useIdentity } from './useIdentity.hook';
import { Menu } from '@mantine/core';
import {
  IconLogout,
  IconSettings,
  IconAddressBook
} from '@tabler/icons-react'

export function Identity() {
  const { state, actions } = useIdentity();

  return (
    <Menu shadow="md" position="right">
      <Menu.Target>
        <div className={classes.identity}>IDENTITY</div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconSettings />}>{ state.strings.settings }</Menu.Item>
        <Menu.Item leftSection={<IconAddressBook />}>{ state.strings.contacts }</Menu.Item>
        <Menu.Item leftSection={<IconLogout />}>{ state.strings.logout }</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
