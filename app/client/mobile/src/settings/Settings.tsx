import React from 'react';
import {useSettings} from './useSettings.hook';
import {SettingsSmall} from './SettingsSmall';
import {SettingsLarge} from './SettingsLarge';

export function Settings({setupNav, showLogout}: {setupNav: { back: ()=>void, next: ()=>void }, showLogout: boolean}) {
  const {state} = useSettings();

  if (state.layout === 'small') {
    return <SettingsSmall setupNav={setupNav} showLogout={showLogout} />;
  }

  return <SettingsLarge setupNav={setupNav} showLogout={showLogout} />;
}