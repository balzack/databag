import React, {useState} from 'react';
import {Divider, Surface, IconButton, Button, Text, TextInput, useTheme} from 'react-native-paper';
import {SafeAreaView, FlatList, View} from 'react-native';
import {styles} from './Contacts.styled';
import {Colors} from '../constants/Colors';
import {useContacts} from './useContacts.hook';
import {Card} from '../card/Card';
import {ContactParams} from '../profile/Profile';
import {Confirm} from '../confirm/Confirm';

function Action({icon, color, select}: {icon: string; color: string; select: () => Promise<void>}) {
  const [loading, setLoading] = useState(false);
  const onPress = async () => {
    setLoading(true);
    await select();
    setLoading(false);
  };
  return <IconButton style={styles.icon} loading={loading} iconColor={color} mode="contained" icon={icon} onPress={onPress} />;
}

export function Contacts({
  openRegistry,
  openContact,
  callContact,
  textContact,
}: {
  openRegistry: () => void;
  openContact: (params: ContactParams) => void;
  callContact: (card: null | Card) => void;
  textContact: (cardId: null | string) => void;
}) {
  const theme = useTheme();
  const {state, actions} = useContacts();
  const [alert, setAlert] = useState(false);
  const [alertParams] = useState({
    title: state.strings.operationFailed,
    prompt: state.strings.tryAgain,
    confirm: {
      label: state.strings.ok,
      action: () => setAlert(false),
    },
  });

  return (
    <View style={styles.contacts}>
      <SafeAreaView style={styles.header}>
        <IconButton style={styles.sort} mode="contained" icon={state.sortAsc ? 'sort-descending' : 'sort-ascending'} size={24} onPress={actions.toggleSort} />

        <Surface mode="flat" elevation={5} style={styles.inputSurface}>
          <TextInput
            dense={true}
            style={styles.input}
            outlineColor="transparent"
            activeOutlineColor="transparent"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            underlineStyle={styles.inputUnderline}
            mode="outlined"
            placeholder={state.strings.contacts}
            left={<TextInput.Icon style={styles.icon} icon="magnify" />}
            value={state.filter}
            onChangeText={value => actions.setFilter(value)}
          />
        </Surface>

        <Button icon="account-plus" mode="contained" style={styles.button} onPress={openRegistry}>
          {state.strings.add}
        </Button>
      </SafeAreaView>
      <Divider style={styles.divider} />

      {state.filtered.length !== 0 && (
        <FlatList
          style={styles.cards}
          data={state.filtered}
          initialNumToRender={32}
          contentContainerStyle={state.layout === 'large' ? styles.cardsContainer : {}}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            const syncStatus = item.offsync ? 'offsync' : item.status;
            const getOptions = () => {
              if (syncStatus === 'connected') {
                return [
                  <Action
                    key="call"
                    icon="phone-outline"
                    color={Colors.connected}
                    select={async () => {
                      try {
                        await actions.call(item);
                        callContact(item);
                      } catch (err) {
                        console.log(err);
                        setAlert(true);
                      }
                    }}
                  />,
                  <Action key="text" icon="message-outline" color={Colors.connected} select={() => textContact(item.cardId)} />,
                ];
              } else if (syncStatus === 'offsync') {
                return [
                  <Action
                    key="resync"
                    icon="cached"
                    color={Colors.offsync}
                    select={async () => {
                      try {
                        await actions.resync(item.cardId);
                      } catch (err) {
                        console.log(err);
                        setAlert(true);
                      }
                    }}
                  />,
                ];
              } else if (syncStatus === 'received') {
                return [
                  <Action
                    key="accept"
                    icon="account-check-outline"
                    color={Colors.requested}
                    select={async () => {
                      try {
                        await actions.accept(item.cardId);
                      } catch (err) {
                        console.log(err);
                        setAlert(true);
                      }
                    }}
                  />,
                ];
              } else if (syncStatus === 'connecting') {
                return [
                  <Action
                    key="cancel"
                    icon="cancel"
                    color={Colors.connecting}
                    select={async () => {
                      try {
                        await actions.cancel(item.cardId);
                      } catch (err) {
                        console.log(err);
                        setAlert(true);
                      }
                    }}
                  />,
                ];
              } else if (syncStatus === 'pending') {
                return [
                  <Action
                    key="accept"
                    icon="account-check-outline"
                    color={Colors.pending}
                    select={async () => {
                      try {
                        await actions.accept(item.cardId);
                      } catch (err) {
                        console.log(err);
                        setAlert(true);
                      }
                    }}
                  />,
                ];
              }
              return [];
            };
            const options = getOptions();
            const select = () => {
              const {guid, handle, node, name, location, description, offsync, imageUrl, cardId, status} = item;
              const params = {
                guid,
                handle,
                node,
                name,
                location,
                description,
                offsync,
                imageUrl,
                cardId,
                status,
              };
              openContact(params);
            };
            return (
              <Card
                containerStyle={{
                  ...styles.card,
                  borderColor: theme.colors.outlineVariant,
                }}
                imageUrl={item.imageUrl}
                name={item.name}
                handle={item.handle}
                node={item.node}
                placeholder={state.strings.name}
                select={select}
                actions={options}
              />
            );
          }}
          keyExtractor={card => card.cardId}
        />
      )}
      {state.filtered.length === 0 && (
        <View style={styles.none}>
          <Text style={styles.noneLabel}>{state.strings.noContacts}</Text>
        </View>
      )}
      <Confirm show={alert} params={alertParams} />
    </View>
  );
}
