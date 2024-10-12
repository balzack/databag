import React, { useState, useContext } from 'react'
import { Drawer } from '@mantine/core'
import { DisplayContext } from '../context/DisplayContext'
import { ContextType } from '../context/ContextType'
import classes from './Session.module.css'
import {
  IconAddressBook,
  IconMessages,
  IconSettings,
} from '@tabler/icons-react'
import { Settings } from '../settings/Settings'
import { Identity } from '../identity/Identity'
import { Contacts } from '../contacts/Contacts'
import { useDisclosure } from '@mantine/hooks'

export function Session() {
  const [tab, setTab] = useState('channels')
  const display = useContext(DisplayContext) as ContextType
  const [settings, { open: openSettings, close: closeSettings }] =
    useDisclosure(false)
  const [contacts, { open: openContacts, close: closeContacts }] =
    useDisclosure(false)

  return (
    <div className={classes.session}>
      {display.state.layout === 'small' && (
        <>
          <div className={classes.screen}>
            {tab === 'settings' && <Settings showLogout={true} />}
            {tab === 'contacts' && <Contacts />} 
          </div>
          <div className={classes.tabs}>
            {tab === 'channels' && (
              <div className={classes.activeTabItem}>
                <IconMessages className={classes.tabIcon} />
              </div>
            )}
            {tab !== 'channels' && (
              <div
                className={classes.idleTabItem}
                onClick={() => setTab('channels')}
              >
                <IconMessages className={classes.tabIcon} />
              </div>
            )}
            <div className={classes.tabDivider} />
            {tab === 'contacts' && (
              <div className={classes.activeTabItem}>
                <IconAddressBook className={classes.tabIcon} />
              </div>
            )}
            {tab !== 'contacts' && (
              <div
                className={classes.idleTabItem}
                onClick={() => setTab('contacts')}
              >
                <IconAddressBook className={classes.tabIcon} />
              </div>
            )}
            <div className={classes.tabDivider} />
            {tab === 'settings' && (
              <div className={classes.activeTabItem}>
                <IconSettings className={classes.tabIcon} />
              </div>
            )}
            {tab !== 'settings' && (
              <div
                className={classes.idleTabItem}
                onClick={() => setTab('settings')}
              >
                <IconSettings className={classes.tabIcon} />
              </div>
            )}
          </div>
        </>
      )}
      {display.state.layout === 'large' && (
        <div className={classes.display}>
          <div className={classes.left}>
            <Identity settings={openSettings} contacts={openContacts} />
          </div>
          <div className={classes.right}></div>
          <Drawer
            opened={contacts}
            onClose={closeContacts}
            withCloseButton={false}
            size="sm"
            padding="0"
            position="right"
          >
            <div style={{ height: '100vh' }}>
              <Contacts />
            </div>
          </Drawer>
          <Drawer
            opened={settings}
            onClose={closeSettings}
            withCloseButton={false}
            size="sm"
            padding="0"
            position="right"
          >
            <div style={{ height: '100vh' }}>
              <Settings showLogout={false} />
            </div>
          </Drawer>
        </div>
      )}
    </div>
  )
}
