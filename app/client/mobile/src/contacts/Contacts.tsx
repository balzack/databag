import React from 'react';
import {Divider, Surface, IconButton, Button, Text, TextInput, useTheme} from 'react-native-paper';
import {SafeAreaView, FlatList, View} from 'react-native';
import {styles} from './Contacts.styled';
import { Colors } from '../constants/Colors';
import {useContacts} from './useContacts.hook';
import { Card } from '../card/Card';
import { ContactParams } from '../profile/Profile';

export function Contacts({ openRegistry, openContact }: { openRegistry: ()=>void, openContact: (params: ContactParams)=>void }) {
  const { state, actions } = useContacts();
  const theme = useTheme();

  return (
    <View style={styles.contacts}>
      <View style={styles.header}>
        <IconButton style={styles.sort} mode="contained" icon={state.sortAsc ? 'sort-descending' : 'sort-ascending'} size={24} onPress={actions.toggleSort} />

        <Surface mode="flat" style={styles.inputSurface}>
          <TextInput dense={true} style={styles.input} unserlineStyle={styles.inputUnderline} mode="outlined" placeholder={state.strings.contacts} left={<TextInput.Icon style={styles.icon} icon="magnify" />} value={state.filter} onChangeText={value => actions.setFilter(value)} />
        </Surface>

        <Button icon="account-plus" mode="contained" style={{ borderRadius: 8 }} onPress={openRegistry}>{ state.strings.add }</Button>
      </View>
      <Divider style={styles.divider} />

      { state.filtered.length !== 0 && (
        <FlatList
          style={styles.cards}
          data={state.filtered}
          initialNumToRender={32}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const call = <IconButton key="call" style={styles.icon} mode="contained" icon="phone-outline" />
            const message = <IconButton key="text" style={styles.icon} mode="contained" icon="message-outline" />
            const options = item.status === 'connected' && !item.offsync ? [message, call] : [];
            const select = () => {
              const { guid, handle, node, name, location, description, offsync, imageUrl, cardId, status } = item;
              const params = { guid, handle, node, name, location, description, offsync, imageUrl, cardId, status };
              openContact(params);
            }
            const status = item.offsync ? 'offsync' : item.status;
            return (
              <View style={{ borderRightWidth: 2, borderColor: Colors[status] }}>
                <Card containerStyle={{ ...styles.card, borderColor: theme.colors.outlineVariant }} imageUrl={item.imageUrl} name={item.name} handle={item.handle} node={item.node} placeholder={state.strings.name} select={select} actions={options} />
              </View>
            )
          }}
          keyExtractor={(card) => card.cardId}
        />
      )}
      { state.filtered.length === 0 && (
        <Text style={styles.none}>{ state.strings.noContacts }</Text>
      )}

    </View>
  );
}

