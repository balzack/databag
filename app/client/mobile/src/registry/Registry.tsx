import React from 'react';
import { View } from 'react-native';
import { IconButton, Icon, Divider, Button, TextInput, Surface } from 'react-native-paper';
import { ContactParams } from '../profile/Profile';
import {styles} from './Registry.styled';
import {useRegistry} from './useRegistry.hook';

export function Registry({ close, openContact }: { close: ()=>void, openContact: (params: ContactParams)=>void }) {
  const { state, actions } = useRegistry();

  return (
    <View style={styles.registry}>
      <View style={styles.header}>
        { close && (
          <IconButton style={styles.close} compact="true"  mode="contained" icon="arrow-left" size={24} onPress={close} />
        )}
        <Surface mode="flat" style={styles.inputUsername}>
          <TextInput dense={true} style={styles.input} underlineStyle={styles.inputUnderline} mode="outlined" placeholder={state.strings.username} left={<TextInput.Icon style={styles.icon} icon="account" />} value={state.username} onChangeText={value => actions.setUsername(value)} />
        </Surface>
        <Surface mode="flat" style={styles.inputServer}>
          <TextInput dense={true} style={styles.input} underlineStyle={styles.inputUnderline} mode="outlined" placeholder={state.strings.server} left={<TextInput.Icon style={styles.icon} icon="server" />} value={state.server} onChangeText={value => actions.setServer(value)} />
        </Surface>
      </View>
      <Divider style={styles.divider} />
    </View>
  )
}
