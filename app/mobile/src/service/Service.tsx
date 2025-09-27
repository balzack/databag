import React, {useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {styles} from './Service.styled';
import {useTheme, IconButton, Surface} from 'react-native-paper';
import {Accounts} from '../accounts/Accounts';
import {Setup} from '../setup/Setup';
import {BlurView} from '../utils/BlurView';

export function Service() {
  const [tab, setTab] = useState('setup');
  const showAccounts = tab === 'accounts' ? styles.visibleTab : styles.hiddenTab;
  const showSetup = tab === 'setup' ? styles.visibleTab : styles.hiddenTab;
  const theme = useTheme();

  return (
    <Surface elevation={0} style={styles.service}>
      <View style={styles.full}>
        <View style={styles.screen}>
          <View style={showAccounts}>
            <Accounts />
          </View>
          <View style={showSetup}>
            <Setup />
          </View>
          <Surface style={styles.tabContainer} elevation={4}>
            <BlurView style={styles.blur} blurType="light" blurAmount={8} reducedTransparencyFallbackColor="dark" />
            <View style={[styles.tabBar, {backgroundColor: theme.colors.bar}]}>
              <SafeAreaView style={styles.tabRow} edges={['bottom']}>
                {tab === 'setup' && (
                  <IconButton
                    style={styles.activeTab}
                    mode="contained"
                    icon={'cog'}
                    size={28}
                    onPress={() => {
                      setTab('setup');
                    }}
                  />
                )}
                {tab !== 'setup' && (
                  <IconButton
                    style={styles.idleTab}
                    mode="contained"
                    icon={'cog-outline'}
                    size={28}
                    onPress={() => {
                      setTab('setup');
                    }}
                  />
                )}
                {tab === 'accounts' && (
                  <IconButton
                    style={styles.activeTab}
                    mode="contained"
                    icon={'users-four-filled'}
                    size={28}
                    onPress={() => {
                      setTab('accounts');
                    }}
                  />
                )}
                {tab !== 'accounts' && (
                  <IconButton
                    style={styles.idleTab}
                    mode="contained"
                    icon={'users-four'}
                    size={28}
                    onPress={() => {
                      setTab('accounts');
                    }}
                  />
                )}
              </SafeAreaView>
            </View>
          </Surface>
        </View>
      </View>
    </Surface>
  );
}
