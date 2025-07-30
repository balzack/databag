import React from 'react'
import classes from './Identity.module.css'
import { useIdentity } from './useIdentity.hook'
import { Text, Image, Menu, Switch } from '@mantine/core'
import { TbLogout, TbChevronRight, TbSettings, TbAddressBook } from "react-icons/tb";
import { modals } from '@mantine/modals'

export function Identity({ settings, contacts }: { settings: () => void; contacts: () => void }) {
  const { state, actions } = useIdentity()

  const logout = () =>
    modals.openConfirmModal({
      title: state.strings.confirmLogout,
      withCloseButton: false,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: <Switch label={state.strings.allDevices} size="md" onChange={(ev) => actions.setAll(ev.currentTarget.checked)} />,
      labels: { confirm: state.strings.logout, cancel: state.strings.cancel },
      onConfirm: actions.logout,
    })

  return (
    <Menu shadow="md" position="right">
      <Menu.Target>
        <div className={classes.identity}>
          <Image radius="sm" className={classes.image} src={state.imageUrl} />
          <div className={classes.text}>
            {!state.profile.name && <Text className={classes.nameUnset}>{state.strings.name}</Text>}
            {state.profile.name && <Text className={classes.nameSet}>{state.profile.name}</Text>}
            <Text className={classes.handle}>{`${state.profile.handle}${state.profile.node ? '/' + state.profile.node : ''}`}</Text>
          </div>
          <TbChevronRight className={classes.icon} />
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={settings} leftSection={<TbSettings />}>
          {state.strings.settings}
        </Menu.Item>
        <Menu.Item onClick={contacts} leftSection={<TbAddressBook />}>
          {state.strings.contacts}
        </Menu.Item>
        <Menu.Item onClick={logout} leftSection={<TbLogout />}>
          {state.strings.logout}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
