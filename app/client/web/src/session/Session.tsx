import React, { useState, useContext } from 'react'
import { Text, Button } from '@mantine/core'
import { AppContext } from '../context/AppContext'
import { SettingsContext } from '../context/SettingsContext';
import { ContextType } from '../context/ContextType'
import classes from './Session.module.css'
import { IconAddressBook, IconMessages, IconUser, IconSettings } from '@tabler/icons-react'

export function Session() {
  const [ tab, setTab ] = useState('channels');
  const app = useContext(AppContext) as ContextType
  const settings = useContext(SettingsContext) as ContextType

console.log(tab);

  return (
    <div className={classes.session}>
      { settings.state.display === 'small' && (
        <div className={classes.tabs}>
          { tab === 'channels' && (
            <div className={classes.activeTabItem}><IconMessages className={classes.tabIcon} /></div>
          )}
          { tab !== 'channels' && (
            <div className={classes.idleTabItem} onClick={() => setTab('channels')}><IconMessages className={classes.tabIcon} /></div>
          )}
          <div className={classes.tabDivider} />
          { tab === 'contacts' && (
            <div className={classes.activeTabItem}><IconAddressBook className={classes.tabIcon} /></div>
          )}
          { tab !== 'contacts' && (
            <div className={classes.idleTabItem} onClick={() => setTab('contacts')}><IconAddressBook className={classes.tabIcon} /></div>
          )}
          <div className={classes.tabDivider} />
          { tab === 'profile' && (
            <div className={classes.activeTabItem}><IconUser className={classes.tabIcon} /></div>
          )}
          { tab !== 'profile' && (
            <div className={classes.idleTabItem} onClick={() => setTab('profile')}><IconUser className={classes.tabIcon} /></div>
          )}
          <div className={classes.tabDivider} />
          { tab === 'settings' && (
            <div className={classes.activeTabItem}><IconSettings className={classes.tabIcon} /></div>
          )}
          { tab !== 'settings' && (
            <div className={classes.idleTabItem} onClick={() => setTab('settings')}><IconSettings className={classes.tabIcon} /></div>
          )}
        </div>
      )}
      { settings.state.display === 'medium' && (
        <div>MEDIUM DISPLAY</div>
      )}
      { settings.state.display === 'large' && (
        <div>LARGE DISPLAY</div>
      )}
      <Button onClick={app.actions.accountLogout}>Session Logout</Button>
    </div>
  );
}


