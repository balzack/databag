import React, { useState } from 'react'
import { Text, Drawer } from '@mantine/core'
import { DisplayContext } from '../context/DisplayContext'
import { RingContextProvider } from '../context/RingContext'
import { ContextType } from '../context/ContextType'
import classes from './Session.module.css'
import { useSession } from './useSession.hook'
import { IconAddressBook, IconMessages, IconSettings } from '@tabler/icons-react'
import { Settings } from '../settings/Settings'
import { Identity } from '../identity/Identity'
import { Contacts } from '../contacts/Contacts'
import { Registry } from '../registry/Registry'
import { Profile, ProfileParams } from '../profile/Profile'
import { Details } from '../details/Details';
import { Content } from '../content/Content'
import { Conversation } from '../conversation/Conversation'
import { Focus, Card } from 'databag-client-sdk'
import { useDisclosure } from '@mantine/hooks'
import { IconAlertCircle } from '@tabler/icons-react'
import { Base } from '../base/Base';
import { Ring } from '../ring/Ring';
import { Call } from '../call/Call';

export function Session() {
  const { state } = useSession();
  const [tab, setTab] = useState('content')
  const [profileParams, setProfileParams] = useState({ guid: '' } as ProfileParams)
  const [settings, { open: openSettings, close: closeSettings }] = useDisclosure(false)
  const [contacts, { open: openContacts, close: closeContacts }] = useDisclosure(false)
  const [registry, { open: openRegistry, close: closeRegistry }] = useDisclosure(false)
  const [details, { open: openDetails, close: closeDetails }] = useDisclosure(false)
  const [profile, { open: openProfile, close: closeProfile }] = useDisclosure(false)
  const [textCard, setTextCard] = useState({ cardId: null} as {cardId: null|string});

  const textContact = (cardId: string) => {
    setTextCard({ cardId });
    closeContacts();
    setTab('content');
  }

  return (
    <RingContextProvider>
      <div className={classes.session}>
        {state.layout === 'small' && (
          <>
            <div className={classes.body}>
              <Ring />
              <div className={tab === 'content' ? classes.show : classes.hide}>
                <div className={classes.screen}>
                  <Content textCard={textCard} />
                </div>
                {state.focus && (
                  <div className={classes.screen}>
                    <Conversation openDetails={openDetails} />
                  </div>
                )}
                {details && (
                  <div className={classes.screen}>
                    <Details showClose={true} close={closeDetails} />
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
                    textContact={textContact}
                    openRegistry={openRegistry}
                    closeContacts={()=>{}}
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
                    <Profile params={profileParams} showClose={true} close={closeProfile} />
                  </div>
                )}
              </div>
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
                <Content textCard={textCard} />
              </div>
            </div>
            <div className={classes.right}>
              <Ring />
              <div className={classes.conversation}>
                {!state.focus && <Base />}
                {state.focus && <Conversation openDetails={openDetails} />}
              </div>
            </div>
            <Drawer opened={contacts} onClose={closeContacts} withCloseButton={false} size="md" padding="0" position="right">
              <div style={{ height: '100vh' }}>
                <Contacts
                  textContact={textContact}
                  openRegistry={openRegistry}
                  closeContacts={closeContacts}
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
                <Profile params={profileParams} showClose={false} close={closeProfile} />
              </div>
            </Drawer>
            <Drawer opened={details} onClose={closeDetails} withCloseButton={false} size="xs" padding="0" position="right" trapFocus={false}>
              <div style={{ height: '100vh' }}>
                <Details showClose={false} close={closeDetails} />
              </div>
            </Drawer>
            <Drawer opened={settings} onClose={closeSettings} withCloseButton={false} size="sm" padding="0" position="right">
              <div style={{ height: '100vh' }}>
                <Settings showLogout={false} />
              </div>
            </Drawer>
          </div>
        )}
        { state.disconnected && (
          <div className={classes.alert}>
            <div className={classes.alertArea}>
              <IconAlertCircle className={classes.alertLabel} />
              <Text className={classes.alertLabel}>{ state.strings.disconnected }</Text>
            </div>
          </div>
        )}
        <Call />
      </div>
    </RingContextProvider>
  )
}
