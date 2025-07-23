import React from 'react';
import {SettingsSmall} from './SettingsSmall';
import {SettingsLarge} from './SettingsLarge';
import {LayoutSelector} from '../utils/LayoutSelector';

type SettingsProps = {
  setupNav: {back: () => void; next: () => void};
  showLogout: boolean;
};

export function Settings({showLogout}: SettingsProps) {
  return <LayoutSelector SmallComponent={SettingsSmall} LargeComponent={SettingsLarge} props={{showLogout}} />;
}
