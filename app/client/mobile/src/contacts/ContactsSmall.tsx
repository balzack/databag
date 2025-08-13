import React, {useState, useCallback, useRef, useEffect} from 'react';
import {Surface, Icon, IconButton, Menu, Button, Text, TextInput, useTheme} from 'react-native-paper';
import {Pressable, FlatList, View, Platform} from 'react-native';
import {styles} from './Contacts.styled';
import {useContacts} from './useContacts.hook';
import {Card} from '../card/Card';
import {ContactParams} from '../profile/Profile';
import {Confirm} from '../confirm/Confirm';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';

const keyExtractor = (card: any) => card.cardId;

const AllTab = React.memo(function AllTab({
  data,
  theme,
  strings,
  more,
  setMore,
  menuAction,
  resync,
  call,
  text,
  connect,
  cancel,
  accept,
  openContact,
  enableIce,
}: {
  data: any[];
  theme: any;
  strings: any;
  more: string | null;
  setMore: (value: string | null) => void;
  menuAction: string | null;
  resync: (card: any) => void;
  call: (card: any) => void;
  text: (card: any) => void;
  connect: (card: any) => void;
  cancel: (card: any) => void;
  accept: (card: any) => void;
  openContact: (params: any) => void;
  enableIce: boolean;
}) {
  return (
    <FlatList
      style={styles.smCards}
      data={data}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      windowSize={10}
      updateCellsBatchingPeriod={50}
      removeClippedSubviews={true}
      contentContainerStyle={styles.cardsContainer}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => {
        const syncStatus = item.status === 'connected' && item.offsync ? 'offsync' : item.status;
        const flair = item.status === 'connected' && item.offsync ? <Icon key="host" source="warning-circle" size={18} color={theme.colors.offsync} /> : <></>;
        const action = (
          <Menu
            mode={Platform.OS === 'ios' ? 'flat' : 'elevated'}
            elevation={Platform.OS === 'ios' ? 8 : 2}
            contentStyle={styles.menuContent}
            key="actions"
            visible={more === `all:${item.cardId}`}
            onDismiss={() => setMore(null)}
            anchor={<IconButton style={styles.action} contentStyle={styles.actionPad} rippleColor="transparent" loading={menuAction === item.cardId} icon="dots-horizontal-circle-outline" size={22} onPress={() => setMore(`all:${item.cardId}`)} />}>
            {Platform.OS === 'ios' && (
              <Surface elevation={11} style={styles.menu}>
                <BlurView style={styles.blur} blurType={theme.colors.name} blurAmount={4} reducedTransparencyFallbackSize={theme.colors.name} />
                {syncStatus === 'offsync' && (
                  <Pressable key="resync" style={styles.menuOption} onPress={() => resync(item)}>
                    <Icon style={styles.button} source="cached" size={28} color={theme.colors.primary} />
                    <Text>{strings.resyncAction}</Text>
                  </Pressable>
                )}
                {syncStatus === 'connected' && enableIce && (
                  <Pressable key="call" style={styles.menuOption} onPress={() => call(item)}>
                    <Icon style={styles.button} source="phone" size={28} color={theme.colors.primary} />
                    <Text>{strings.callAction}</Text>
                  </Pressable>
                )}
                {syncStatus === 'connected' && (
                  <Pressable key="text" style={styles.menuOption} onPress={() => text(item)}>
                    <Icon style={styles.button} source="chat-circle" size={28} color={theme.colors.primary} />
                    <Text>{strings.textAction}</Text>
                  </Pressable>
                )}
                {syncStatus === 'confirmed' && (
                  <Pressable key="saved" style={styles.menuOption} onPress={() => connect(item)}>
                    <Icon style={styles.button} source="link" size={28} color={theme.colors.primary} />
                    <Text>{strings.connectAction}</Text>
                  </Pressable>
                )}
                {syncStatus === 'connecting' && (
                  <Pressable key="cancel" style={styles.menuOption} onPress={() => cancel(item)}>
                    <Icon style={styles.button} source="cancel" size={28} color={theme.colors.primary} />
                    <Text>{strings.cancelAction}</Text>
                  </Pressable>
                )}
                {(syncStatus === 'pending' || syncStatus === 'requested') && (
                  <Pressable key="accept" style={styles.menuOption} onPress={() => accept(item)}>
                    <Icon style={styles.button} source="account-check-outline" size={28} color={theme.colors.primary} />
                    <Text>{strings.acceptAction}</Text>
                  </Pressable>
                )}
              </Surface>
            )}
            {Platform.OS !== 'ios' && syncStatus === 'offsync' && <Menu.Item key="resync" leadingIcon="cached" onPress={() => resync(item)} title={strings.resyncAction} />}
            {Platform.OS !== 'ios' && syncStatus === 'connected' && <Menu.Item key="call" leadingIcon="phone" onPress={() => call(item)} title={strings.callAction} />}
            {Platform.OS !== 'ios' && syncStatus === 'connected' && <Menu.Item key="text" leadingIcon="chat-circle" onPress={() => text(item)} title={strings.textAction} />}
            {Platform.OS !== 'ios' && syncStatus === 'confirmed' && <Menu.Item key="saved" leadingIcon="link" onPress={() => connect(item)} title={strings.connectAction} />}
            {Platform.OS !== 'ios' && syncStatus === 'connecting' && <Menu.Item key="cancel" leadingIcon="cancel" onPress={() => cancel(item)} title={strings.cancelAction} />}
            {Platform.OS !== 'ios' && syncStatus === 'pending' && <Menu.Item key="pending" leadingIcon="account-check-outline" onPress={() => accept(item)} title={strings.acceptAction} />}
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
            containerStyle={{...styles.smCard, handle: {color: theme.colors.onSecondary, fontWeight: 'normal'}}}
            imageUrl={item.imageUrl}
            name={item.name}
            handle={item.handle}
            node={item.node}
            placeholder={strings.name}
            select={select}
            actions={[action]}
            flair={flair}
          />
        );
      }}
      keyExtractor={keyExtractor}
    />
  );
});

const RequestedTab = React.memo(function RequestedTab({
  data,
  theme,
  strings,
  more,
  setMore,
  menuAction,
  accept,
  openContact,
}: {
  data: any[];
  theme: any;
  strings: any;
  more: string | null;
  setMore: (value: string | null) => void;
  menuAction: string | null;
  accept: (card: any) => void;
  openContact: (params: any) => void;
}) {
  return (
    <FlatList
      style={styles.smCards}
      data={data}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      windowSize={10}
      updateCellsBatchingPeriod={50}
      removeClippedSubviews={true}
      contentContainerStyle={styles.cardsContainer}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => {
        const flair = item.status === 'connected' && item.offsync ? <Icon key="host" source="warning-circle" size={18} color={theme.colors.offsync} /> : <></>;
        const action = (
          <Menu
            mode={Platform.OS === 'ios' ? 'flat' : 'elevated'}
            elevation={Platform.OS === 'ios' ? 8 : 2}
            contentStyle={styles.menuContent}
            key="actions"
            visible={more === `requested:${item.cardId}`}
            onDismiss={() => setMore(null)}
            anchor={<IconButton style={styles.action} contentStyle={styles.actionPad} rippleColor="transparent" loading={menuAction === item.cardId} icon="dots-horizontal-circle-outline" size={22} onPress={() => setMore(`requested:${item.cardId}`)} />}>
            {Platform.OS === 'ios' && (
              <Surface elevation={11} style={styles.menu}>
                <BlurView style={styles.blur} blurType={theme.colors.name} blurAmount={4} reducedTransparencyFallbackSize={theme.colors.name} />
                <Pressable key="accept" style={styles.menuOption} onPress={() => accept(item)}>
                  <Icon style={styles.button} source="account-check-outline" size={28} color={theme.colors.primary} />
                  <Text>{strings.acceptAction}</Text>
                </Pressable>
              </Surface>
            )}
            {Platform.OS !== 'ios' && <Menu.Item key="pending" leadingIcon="account-check-outline" onPress={() => accept(item)} title={strings.acceptAction} />}
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
            containerStyle={{...styles.smCard, handle: {color: theme.colors.onSecondary, fontWeight: 'normal'}}}
            imageUrl={item.imageUrl}
            name={item.name}
            handle={item.handle}
            node={item.node}
            placeholder={strings.name}
            select={select}
            actions={[action]}
            flair={flair}
          />
        );
      }}
      keyExtractor={keyExtractor}
    />
  );
});

const ConnectedTab = React.memo(function ConnectedTab({
  data,
  theme,
  strings,
  more,
  setMore,
  menuAction,
  resync,
  call,
  text,
  openContact,
  enableIce,
}: {
  data: any[];
  theme: any;
  strings: any;
  more: string | null;
  setMore: (value: string | null) => void;
  menuAction: string | null;
  resync: (card: any) => void;
  call: (card: any) => void;
  text: (card: any) => void;
  openContact: (params: any) => void;
  enableIce: boolean;
}) {
  return (
    <FlatList
      style={styles.smCards}
      data={data}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      windowSize={10}
      updateCellsBatchingPeriod={50}
      removeClippedSubviews={true}
      contentContainerStyle={styles.cardsContainer}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => {
        const syncStatus = item.offsync ? 'offsync' : item.status;
        const flair = item.status === 'connected' && item.offsync ? <Icon key="host" source="warning-circle" size={18} color={theme.colors.offsync} /> : <></>;
        const action = (
          <Menu
            mode={Platform.OS === 'ios' ? 'flat' : 'elevated'}
            elevation={Platform.OS === 'ios' ? 8 : 2}
            contentStyle={styles.menuContent}
            key="actions"
            visible={more === `connected:${item.cardId}`}
            onDismiss={() => setMore(null)}
            anchor={<IconButton style={styles.action} contentStyle={styles.actionPad} rippleColor="transparent" loading={menuAction === item.cardId} icon="dots-horizontal-circle-outline" size={22} onPress={() => setMore(`connected:${item.cardId}`)} />}>
            {Platform.OS === 'ios' && (
              <Surface elevation={11} style={styles.menu}>
                <BlurView style={styles.blur} blurType={theme.colors.name} blurAmount={4} reducedTransparencyFallbackSize={theme.colors.name} />
                {syncStatus === 'offsync' && (
                  <Pressable key="resync" style={styles.menuOption} onPress={() => resync(item)}>
                    <Icon style={styles.button} source="cached" size={28} color={theme.colors.primary} />
                    <Text>{strings.resyncAction}</Text>
                  </Pressable>
                )}
                {syncStatus !== 'offsync' && enableIce && (
                  <Pressable key="call" style={styles.menuOption} onPress={() => call(item)}>
                    <Icon style={styles.button} source="phone" size={28} color={theme.colors.primary} />
                    <Text>{strings.callAction}</Text>
                  </Pressable>
                )}
                {syncStatus !== 'offsync' && (
                  <Pressable key="text" style={styles.menuOption} onPress={() => text(item)}>
                    <Icon style={styles.button} source="chat-circle" size={28} color={theme.colors.primary} />
                    <Text>{strings.textAction}</Text>
                  </Pressable>
                )}
              </Surface>
            )}
            {Platform.OS !== 'ios' && syncStatus === 'offsync' && <Menu.Item key="resync" leadingIcon="cached" onPress={() => resync(item)} title={strings.resyncAction} />}
            {Platform.OS !== 'ios' && syncStatus !== 'offsync' && <Menu.Item key="call" leadingIcon="phone" onPress={() => call(item)} title={strings.callAction} />}
            {Platform.OS !== 'ios' && syncStatus !== 'offsync' && <Menu.Item key="text" leadingIcon="chat-circle" onPress={() => text(item)} title={strings.textAction} />}
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
            containerStyle={{...styles.smCard, handle: {color: theme.colors.onSecondary, fontWeight: 'normal'}}}
            imageUrl={item.imageUrl}
            name={item.name}
            handle={item.handle}
            node={item.node}
            placeholder={strings.name}
            select={select}
            actions={[action]}
            flair={flair}
          />
        );
      }}
      keyExtractor={keyExtractor}
    />
  );
});

export function ContactsSmall({
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
    close: {
      label: state.strings.close,
      action: () => setAlert(false),
    },
  });

  const allTab = tab === 'all' && state.filtered.length !== 0;
  const requestedTab = tab === 'requested' && state.requested.length !== 0;
  const connectedTab = tab === 'connected' && state.connected.length !== 0;
  const emptyTab = !allTab && !requestedTab && !connectedTab;

  const call = useCallback(async (card: Card) => {
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
  }, [actions, callContact]);

  const text = useCallback(async (card: Card) => {
    setMore(null);
    setMenuAction(card.cardId);
    try {
      await new Promise(r => setTimeout(r, 100));
      textContact(card.cardId);
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.log(err);
      setAlert(true);
    }
    setMenuAction(null);
  }, [textContact]);

  const resync = useCallback(async (card: Card) => {
    setMore(null);
    setMenuAction(card.cardId);
    try {
      await actions.resync(card.cardId);
    } catch (err) {
      console.log(err);
      setAlert(true);
    }
    setMenuAction(null);
  }, [actions]);

  const cancel = useCallback(async (card: Card) => {
    setMore(null);
    setMenuAction(card.cardId);
    try {
      await actions.cancel(card.cardId);
    } catch (err) {
      console.log(err);
      setAlert(true);
    }
    setMenuAction(null);
  }, [actions]);

  const connect = useCallback(async (card: Card) => {
    setMore(null);
    setMenuAction(card.cardId);
    try {
      await actions.connect(card.cardId);
    } catch (err) {
      console.log(err);
      setAlert(true);
    }
    setMenuAction(null);
  }, [actions]);

  const accept = useCallback(async (card: Card) => {
    setMore(null);
    setMenuAction(card.cardId);
    try {
      await actions.accept(card.cardId);
    } catch (err) {
      console.log(err);
      setAlert(true);
    }
    setMenuAction(null);
  }, [actions]);

  return (
    <View style={styles.component}>
      <View style={styles.contacts}>
        <Surface elevation={9} mode="flat" style={styles.surfaceMaxWidth}>
          <SafeAreaView style={styles.headerSurface} edges={['left', 'right']}>
            <Surface mode="flat" elevation={0} style={styles.searchSurface}>
              <TextInput
                dense={true}
                style={styles.input}
                contentStyle={styles.inputContent}
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
            <Button icon="user-plus" mode="contained" textColor="white" style={styles.newContactButton} contentStyle={styles.newContactContent} onPress={openRegistry}>
              {state.strings.new}
            </Button>
          </SafeAreaView>
        </Surface>

        <View style={styles.tabContainer}>
          <View style={{...styles.tabContainer, ...(allTab ? styles.tabVisible : styles.tabHidden)}}>
            <AllTab
              data={state.filtered}
              theme={theme}
              strings={state.strings}
              more={more}
              setMore={setMore}
              menuAction={menuAction}
              resync={resync}
              call={call}
              text={text}
              connect={connect}
              cancel={cancel}
              accept={accept}
              openContact={openContact}
              enableIce={state.enableIce}
            />
          </View>
          <View style={{...styles.tabContainer, ...(requestedTab ? styles.tabVisible : styles.tabHidden)}}>
            <RequestedTab
              data={state.requested}
              theme={theme}
              strings={state.strings}
              more={more}
              setMore={setMore}
              menuAction={menuAction}
              accept={accept}
              openContact={openContact}
            />
          </View>
          <View style={{...styles.tabContainer, ...(connectedTab ? styles.tabVisible : styles.tabHidden)}}>
            <ConnectedTab
              data={state.connected}
              theme={theme}
              strings={state.strings}
              more={more}
              setMore={setMore}
              menuAction={menuAction}
              resync={resync}
              call={call}
              text={text}
              openContact={openContact}
              enableIce={state.enableIce}
            />
          </View>
          <View style={{...styles.tabContainer, ...(emptyTab ? styles.tabVisible : styles.tabHidden)}}>
            <View style={styles.none}>
              <Text style={styles.noneLabel}>{state.strings.noContacts}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabs}>
          <Pressable style={tab === 'all' ? styles.opaque : styles.opacity} onPress={() => setTab('all')}>
            <Surface style={styles.tab} elevation={tab === 'all' ? 10 : 2}>
              <Text style={tab === 'all' ? styles.tabSet : styles.tabUnset} color="white">
                {state.strings.all}
              </Text>
            </Surface>
          </Pressable>
          <Pressable style={tab === 'requested' ? styles.opaque : styles.opacity} onPress={() => setTab('requested')}>
            <Surface style={styles.tab} elevation={tab === 'requested' ? 10 : 2}>
              <Text style={tab === 'requested' ? styles.tabSet : styles.tabUnset} color="white">{`${state.strings.requestedTag}${
                state.requested.length > 0 ? ' (' + state.requested.length + ')' : ''
              }`}</Text>
            </Surface>
          </Pressable>
          <Pressable style={tab === 'connected' ? styles.opaque : styles.opacity} onPress={() => setTab('connected')}>
            <Surface style={styles.tab} elevation={tab === 'connected' ? 10 : 2}>
              <Text style={tab === 'connected' ? styles.tabSet : styles.tabUnset} color="white">
                {state.strings.connectedTag}
              </Text>
            </Surface>
          </Pressable>
        </View>
      </View>
      <Confirm show={alert} params={alertParams} />
    </View>
  );
}
