import React from 'react';
import {Divider, Surface, IconButton, Button, Text, TextInput, useTheme} from 'react-native-paper';
import {SafeAreaView, FlatList, View} from 'react-native';
import {styles} from './Contacts.styled';
import {useContacts} from './useContacts.hook';
import { Card } from '../card/Card';

export function Contacts() {
  const { state, actions } = useContacts();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={styles.contacts}>
      <View style={styles.header}>
        <IconButton style={{ borderRadius: 4 }} mode="contained" icon={state.sortAsc ? 'sort-descending' : 'sort-ascending'} size={24} onPress={actions.toggleSort} />

        <Surface mode="flat" style={styles.inputSurface}>
          <TextInput dense={true} style={styles.input} unserlineStyle={styles.inputUnderline} mode="outlined" placeholder={state.strings.contacts} left={<TextInput.Icon style={styles.icon} icon="magnify" />} value={state.filter} onChangeText={value => actions.setFilter(value)} />
        </Surface>

        <Button icon="account-plus" mode="contained" style={{ borderRadius: 8 }}>{ state.strings.add }</Button>
      </View>
      <Divider style={styles.divider} />

      { state.filtered.length !== 0 && (
        <FlatList
          style={styles.cards}
          data={state.filtered}
          initialNumToRender={32}
          renderItem={({ item }) => {
            const call = <IconButton icon="phone" />
            const message = <IconButton icon="message" />
            const options = item.status === 'connected' && !item.offsync ? [message, call] : [];
            const select = () => {
              const { guid, handle, node, name, location, description, offsync, imageUrl, cardId, status } = item;
              const params = { guid, handle, node, name, location, description, offsync, imageUrl, cardId, status };
              openContact(params);
            }
            const status = item.offsync ? styles.offsync : styles[item.status];
            return (
              <Card containerStyle={{ ...styles.card, borderColor: colors.outlineVariant }} imageUrl={item.imageUrl} name={item.name} handle={item.handle} node={item.node} placeholder={state.strings.name} select={select} actions={options} />
            )
          }}
          keyExtractor={(card) => card.cardId}
        />
      )}
      { state.filtered.length === 0 && (
        <Text style={styles.none}>{ state.strings.noContacts }</Text>
      )}

    </SafeAreaView>
  );
}

