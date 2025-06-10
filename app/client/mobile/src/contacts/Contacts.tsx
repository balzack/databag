import React, {useState} from 'react';
import {Divider, Surface, Icon, IconButton, Menu, Button, Text, TextInput, useTheme} from 'react-native-paper';
import {SafeAreaView, Pressable, FlatList, View} from 'react-native';
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
  const [menuAction, setMenuAction] = useState(null as null | string);
  const {state, actions} = useContacts();
  const [more, setMore] = useState(null as null | string);
  const [tab, setTab] = useState('all');
  const [alert, setAlert] = useState(false);
  const [alertParams] = useState({
    title: state.strings.operationFailed,
    prompt: state.strings.tryAgain,
    confirm: {
      label: state.strings.ok,
      action: () => setAlert(false),
    },
  });

  const allTab = tab === 'all' && state.filtered.length !== 0;
  const requestedTab = tab === 'requested' && state.requested.length !== 0;
  const connectedTab = tab === 'connected' && state.connected.length !== 0;
  const emptyTab = !allTab && !requestedTab && !connectedTab;

  const call = async (card: Card) => {
    setMore(null);
    setMenuAction(card.cardId);
    try {
      await actions.call(card);
      callContact(card);
    } catch (err) {
      console.log(err);
      setAlert(true);
    }
    setMenuAction(null);
  };

  const resync = async (card: Card) => {
    setMore(null);
    setMenuAction(card.cardId);
    try {
      await actions.resync(card.cardId);
    } catch (err) {
      console.log(err);
      setAlert(true);
    }
    setMenuAction(null);
  }

  const cancel = async (card: Card) => {
    setMore(null);
    setMenuAction(card.cardId);
    try {
      await actions.cancel(card.cardId);
    } catch (err) {
      console.log(err);
      setAlert(true);
    }
    setMenuAction(null);
  }

  const connect = async (card: Card) => {
    setMore(null);
    setMenuAction(card.cardId);
    try {
      await actions.connect(card.cardId);
    } catch (err) {
      console.log(err);
      setAlert(true);
    }
    setMenuAction(null);
  }

  const accept = async (card: Card) => {
    setMore(null);
    setMenuAction(card.cardId);
    try {
      await actions.accept(card.cardId);
    } catch (err) {
      console.log(err);
      setAlert(true);
    }
    setMenuAction(null);
  }

  return (
    <View style={styles.component}>
      { state.layout === 'small' && (
        <View style={styles.contacts}>
          <Surface elevation={9} mode="flat" style={styles.headerSurface}>
            <Surface mode="flat" elevation={0} style={styles.searchSurface}>
              <TextInput
                dense={true}
                style={styles.input}
                outlineStyle={styles.inputBorder}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                mode="outlined"
                placeholder={state.strings.searchContacts}
                left={<TextInput.Icon style={styles.icon} icon="search" />}
                value={state.filter}
                onChangeText={value => actions.setFilter(value)}
              />
            </Surface>
            <Button icon="user-plus" mode="contained" textColor="white" style={styles.newContactButton} onPress={openRegistry}>
              {state.strings.new}
            </Button>
          </Surface>

          <View style={{ ...styles.tabContainer, display: allTab ? 'block' : 'none' }}>
            <FlatList
              style={styles.smCards}
              data={state.filtered}
              initialNumToRender={32}
              contentContainerStyle={styles.cardsContainer}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                const syncStatus = item.offsync ? 'offsync' : item.status;
                const flair = item.status === 'connected' && item.offsync ? <Icon key="host" source="warning-circle" size={18} color={theme.colors.offsync} /> : <></>
                const action = (
                  <Menu
                    key="actions"
                    visible={allTab && more === item.cardId}
                    onDismiss={()=>setMore(null)}
                    anchor={<IconButton style={styles.action} loading={menuAction === item.cardId} icon="dots-horizontal-circle-outline" size={22} onPress={()=>setMore(item.cardId)} />}>
                      { syncStatus === 'offsync' && (
                        <Menu.Item key='resync' leadingIcon="cached" title={state.strings.resyncAction} onPress={() => resync(item)} />
                      )}
                      { syncStatus === 'connected' && (
                        <Menu.Item key='call' leadingIcon="phone-outline" title={state.strings.callAction} onPress={() => call(item)} />
                      )}
                      { syncStatus === 'connected' && (
                        <Menu.Item key='text' leadingIcon="message-outline" title={state.strings.textAction} onPress={() => { setMore(null); textContact(item.cardId)}} />
                      )}
                      { syncStatus === 'confirmed' && (
                        <Menu.Item key='saved' leadingIcon="link" title={state.strings.connectAction} onPress={() => connect(item)} />
                      )}
                      { syncStatus === 'connecting' && (
                        <Menu.Item key='cancel' leadingIcon="cancel" title={state.strings.cancelAction} onPress={() => cancel(item)} />
                      )}
                      { (syncStatus === 'pending' || syncStatus === 'requested') && (
                        <Menu.Item key='accept' leadingIcon="account-check-outline" title={state.strings.acceptAction} onPress={() => accept(item)} />
                      )}
                  </Menu>
                );
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
                    containerStyle={{ ...styles.smCard, handle: { color: theme.colors.onSecondary, fontWeight: 'normal' }}}
                    imageUrl={item.imageUrl}
                    name={item.name}
                    handle={item.handle}
                    node={item.node}
                    placeholder={state.strings.name}
                    select={select}
                    actions={[action]}
                    flair={flair}
                  />
                );
              }}
              keyExtractor={card => card.cardId}
            />
          </View>

          <View style={{ ...styles.tabContainer, display: requestedTab ? 'block' : 'none' }}>
            <FlatList
              style={styles.smCards}
              data={state.requested}
              initialNumToRender={32}
              contentContainerStyle={styles.cardsContainer}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                const syncStatus = item.offsync ? 'offsync' : item.status;
                const flair = item.status === 'connected' && item.offsync ? <Icon key="host" source="warning-circle" size={18} color={theme.colors.offsync} /> : <></>
                const action = (
                  <Menu
                    key="actions"
                    visible={requestedTab && more === item.cardId}
                    onDismiss={()=>setMore(null)}
                    anchor={<IconButton style={styles.action} icon="dots-horizontal-circle-outline" size={22} onPress={()=>setMore(item.cardId)} />}>
                      <Menu.Item key='accept' leadingIcon="account-check-outline" title={state.strings.acceptAction} onPress={() => accept(item)} />
                  </Menu>
                );
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
                    containerStyle={{ ...styles.smCard, handle: { color: theme.colors.onSecondary, fontWeight: 'normal' }}}
                    imageUrl={item.imageUrl}
                    name={item.name}
                    handle={item.handle}
                    node={item.node}
                    placeholder={state.strings.name}
                    select={select}
                    actions={[action]}
                    flair={flair}
                  />
                );
              }}
              keyExtractor={card => card.cardId}
            />
          </View>

          <View style={{ ...styles.tabContainer, display: connectedTab ? 'block' : 'none' }}>
            <FlatList
              style={styles.smCards}
              data={state.connected}
              initialNumToRender={32}
              contentContainerStyle={styles.cardsContainer}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                const syncStatus = item.offsync ? 'offsync' : item.status;
                const flair = item.status === 'connected' && item.offsync ? <Icon key="host" source="warning-circle" size={18} color={theme.colors.offsync} /> : <></>
                const action = (
                  <Menu
                    key="actions"
                    visible={connectedTab && more === item.cardId}
                    onDismiss={()=>setMore(null)}
                    anchor={<IconButton style={styles.action} icon="dots-horizontal-circle-outline" size={22} onPress={()=>setMore(item.cardId)} />}>
                      { syncStatus === 'offsync' && (
                        <Menu.Item key='resync' leadingIcon="cached" title={state.strings.resyncAction} onPress={() => resync(item)} />
                      )}
                      { syncStatus === 'connected' && (
                        <Menu.Item key='call' leadingIcon="phone-outline" title={state.strings.callAction} onPress={() => call(item)} />
                      )}
                      { syncStatus === 'connected' && (
                        <Menu.Item key='text' leadingIcon="message-outline" title={state.strings.textAction} onPress={() => textContact(item.cardId)} />
                      )}
                  </Menu>
                );
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
                    containerStyle={{ ...styles.smCard, handle: { color: theme.colors.onSecondary, fontWeight: 'normal' }}}
                    imageUrl={item.imageUrl}
                    name={item.name}
                    handle={item.handle}
                    node={item.node}
                    placeholder={state.strings.name}
                    select={select}
                    actions={[action]}
                    flair={flair}
                  />
                );
              }}
              keyExtractor={card => card.cardId}
            />
          </View>

          <View style={{ ...styles.tabContainer, display: emptyTab ? 'block' : 'none' }}>
            <View style={styles.none}>
              <Text style={styles.noneLabel}>{state.strings.noContacts}</Text>
            </View>
          </View>

          <View style={styles.tabs}>
            <Pressable style={tab === 'all' ? styles.opaque : styles.opacity} onPress={() => setTab('all')}>
              <Surface style={styles.tab} elevation={tab === 'all' ? 10 : 2}>
                <Text style={tab === 'all' ? styles.tabSet : styles.tabUnset} color="white">{ state.strings.all }</Text>
              </Surface>
            </Pressable>
            <Pressable style={tab === 'requested' ? styles.opaque : styles.opacity} onPress={() => setTab('requested')}>
              <Surface style={styles.tab} elevation={tab === 'requested' ? 10 : 2}>
                <Text style={tab === 'requested' ? styles.tabSet : styles.tabUnset} color="white">{ `${state.strings.requestedTag}${state.requested.length > 0 ? ' (' + state.requested.length + ')' : ''}` }</Text>
              </Surface>
            </Pressable>
            <Pressable style={tab === 'connected' ? styles.opaque : styles.opacity} onPress={() => setTab('connected')}>
              <Surface style={styles.tab} elevation={tab === 'connected' ? 10 : 2}>
                <Text style={tab === 'connected' ? styles.tabSet : styles.tabUnset} color="white">{ state.strings.connectedTag }</Text>
              </Surface>
            </Pressable>
          </View>
        </View>
      )}
      { state.layout === 'large' && (
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
              contentContainerStyle={styles.cardsContainer}
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
        </View>
      )}
      <Confirm show={alert} params={alertParams} />
    </View>
  );
}
