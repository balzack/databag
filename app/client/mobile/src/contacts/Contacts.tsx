import React from 'react';
import {Divider, Surface, IconButton, Button, TextInput} from 'react-native-paper';
import {SafeAreaView, View} from 'react-native';
import {styles} from './Contacts.styled';
import {useContacts} from './useContacts.hook';

export function Contacts() {
  const { state, actions } = useContacts();

  return (
    <SafeAreaView style={styles.contacts}>
      <View style={styles.header}>
        <IconButton style={{ borderRadius: 4 }} mode="contained" icon="sort-ascending" size={24} />

        <Surface mode="flat" style={styles.inputSurface}>
          <TextInput dense={true} style={styles.input} unserlineStyle={styles.inputUnderline} mode="outlined" placeholder={state.strings.contacts} left={<TextInput.Icon style={styles.icon} icon="magnify" />} />
        </Surface>

        <Button icon="account-plus" mode="contained" style={{ borderRadius: 8 }}>{ state.strings.add }</Button>
      </View>
      <Divider style={{ width: '100%', height: 2 }} />
    </SafeAreaView>
  );
}

