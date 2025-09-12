import React from 'react';
import {SettingsComponent} from './SettingsComponent';
import {LayoutSelector} from '../utils/LayoutSelector';

type SettingsProps = {
  layout: string;
  setupNav: {back: () => void; next: () => void};
  showLogout: boolean;
};

export function Settings({layout, setupNav, showLogout}: SettingsProps) {
  return <LayoutSelector SmallComponent={SettingsComponent} LargeComponent={SettingsComponent} props={{layout, setupNav, showLogout}} />;
}
