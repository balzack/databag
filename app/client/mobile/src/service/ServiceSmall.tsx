import React, {useState} from 'react';
import {SafeAreaView, View, useColorScheme} from 'react-native';
import {styles} from './Service.styled';
import {useTheme, IconButton, Surface} from 'react-native-paper';
import {Accounts} from '../accounts/Accounts';
import {Setup} from '../setup/Setup';
import {useService} from './useService.hook';
import {BlurView} from '@react-native-community/blur';

export function ServiceSmall() {
  const {state} = useService();
  const [tab, setTab] = useState('setup');
  const showAccounts = {width: '100%', height: '100%', display: tab === 'accounts' ? 'flex' : 'none'};
  const showSetup = {width: '100%', height: '100%', display: tab === 'setup' ? 'flex' : 'none'};
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
          <Surface style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: 'transparent' }} elevation={4}>
            <BlurView style={styles.blur} blurType="light" blurAmount={8} reducedTransparencyFallbackColor="dark" />
            <View style={{ backgroundColor: theme.colors.bar, height: 96 }}>
              <SafeAreaView style={{ width: '100%', display: 'flex', flexDirection: 'row' }} edges={['bottom']}>
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