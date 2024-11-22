import React, { useState, useContext } from 'react'
import { Drawer } from '@mantine/core'
import { DisplayContext } from '../context/DisplayContext'
import { ContextType } from '../context/ContextType'
import classes from './Session.module.css'
import { useSession } from './useSession.hook'
import { IconAddressBook, IconMessages, IconSettings } from '@tabler/icons-react'
import { Settings } from '../settings/Settings'
import { Identity } from '../identity/Identity'
import { Contacts } from '../contacts/Contacts'
import { Registry } from '../registry/Registry'
import { Profile, ProfileParams } from '../profile/Profile'
import { Content } from '../content/Content'
import { Conversation } from '../conversation/Conversation'
import { Focus } from 'databag-client-sdk'
import { useDisclosure } from '@mantine/hooks'

export function Session() {
  const { state } = useSession();
  const [tab, setTab] = useState('content')
  const [profileParams, setProfileParams] = useState({ guid: '' } as ProfileParams)
  const [settings, { open: openSettings, close: closeSettings }] = useDisclosure(false)
  const [contacts, { open: openContacts, close: closeContacts }] = useDisclosure(false)
  const [registry, { open: openRegistry, close: closeRegistry }] = useDisclosure(false)
  const [profile, { open: openProfile, close: closeProfile }] = useDisclosure(false)

  return (
    <div className={classes.session}>
      {state.layout === 'small' && (
        <>
          <div className={tab === 'content' ? classes.show : classes.hide}>
            <div className={classes.screen}>
              <Content />
            </div>
            {state.focus && (
              <div className={classes.screen}>
                <Conversation />
              </div>
            )}
          </div>
          <div className={tab === 'settings' ? classes.show : classes.hide}>
            <div className={classes.screen}>
              <Settings showLogout={true} />
            </div>
          </div>
          <div className={tab === 'contacts' ? classes.show : classes.hide}>
            <div className={classes.screen}>
              <Contacts
                openRegistry={openRegistry}
                openContact={(params) => {
                  setProfileParams(params)
                  openProfile()
                }}
              />
            </div>
            {registry && (
              <div className={classes.screen}>
                <Registry
                  close={closeRegistry}
                  openContact={(params) => {
                    setProfileParams(params)
                    openProfile()
                  }}
                />
              </div>
            )}
            {profile && (
              <div className={classes.screen}>
                <Profile params={profileParams} close={closeProfile} />
              </div>
            )}
          </div>
          <div className={classes.tabs}>
            {tab === 'content' && (
              <div className={classes.activeTabItem}>
                <IconMessages className={classes.tabIcon} />
              </div>
            )}
            {tab !== 'content' && (
              <div className={classes.idleTabItem} onClick={() => setTab('content')}>
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
              <div className={classes.idleTabItem} onClick={() => setTab('contacts')}>
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
              <div className={classes.idleTabItem} onClick={() => setTab('settings')}>
                <IconSettings className={classes.tabIcon} />
              </div>
            )}
          </div>
        </>
      )}
      {state.layout === 'large' && (
        <div className={classes.display}>
          <div className={classes.left}>
            <Identity settings={openSettings} contacts={openContacts} />
            <div className={classes.content}>
              <Content />
            </div>
          </div>
          <div className={classes.right}>{state.focus && <Conversation />}</div>
          <Drawer opened={contacts} onClose={closeContacts} withCloseButton={false} size="md" padding="0" position="right">
            <div style={{ height: '100vh' }}>
              <Contacts
                openRegistry={openRegistry}
                openContact={(params) => {
                  setProfileParams(params)
                  openProfile()
                }}
              />
            </div>
          </Drawer>
          <Drawer opened={registry} onClose={closeRegistry} withCloseButton={false} size="sm" padding="0" position="right">
            <div style={{ height: '100vh' }}>
              <Registry
                openContact={(params) => {
                  setProfileParams(params)
                  openProfile()
                }}
              />
            </div>
          </Drawer>
          <Drawer opened={profile} onClose={closeProfile} withCloseButton={false} size="xs" padding="0" position="right">
            <div style={{ height: '100vh' }}>
              <Profile params={profileParams} />
            </div>
          </Drawer>
          <Drawer opened={settings} onClose={closeSettings} withCloseButton={false} size="sm" padding="0" position="right">
            <div style={{ height: '100vh' }}>
              <Settings showLogout={false} />
            </div>
          </Drawer>
        </div>
      )}
    </div>
  )
}
