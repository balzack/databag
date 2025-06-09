import React, {useEffect, useState} from 'react';
import {Divider, Switch, Surface, IconButton, Menu, Button, Text, TextInput, useTheme} from 'react-native-paper';
import {Pressable, Modal, FlatList, View} from 'react-native';
import {styles} from './Content.styled';
import {useContent} from './useContent.hook';
import {Channel} from '../channel/Channel';
import {BlurView} from '@react-native-community/blur';
import {Card} from '../card/Card';
import {Confirm} from '../confirm/Confirm';
import {Selector} from '../selector/Selector';
import {SafeAreaView} from 'react-native-safe-area-context';

export function Content({
  share,
  closeAll,
  openConversation,
  createConversation,
  textCard,
}: {
  share: {filePath: string; mimeType: string};
  closeAll: () => void;
  openConversation: () => void;
  createConversation: () => void;
  textCard: {cardId: null | string};
}) {
  const [more, setMore] = useState(null as null | string);
  const [tab, setTab] = useState('all');
  const [add, setAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [sealedTopic, setSealedTopic] = useState(false);
  const {state, actions} = useContent();
  const theme = useTheme();
  const [subjectTopic, setSubjectTopic] = useState('');
  const [members, setMembers] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertParams] = useState({
    title: state.strings.operationFailed,
    prompt: state.strings.tryAgain,
    confirm: {
      label: state.strings.ok,
      action: () => setAlert(false),
    },
  });
  const cards = state.sealSet && sealedTopic ? state.sealable : state.connected;

  const select = (cardId: string | null, channelId: string) => {
    if (share) {
      const {filePath, mimeType} = share;
      actions.setSharing({cardId, channelId, filePath, mimeType});
    }
    open(cardId, channelId);
  };

  const open = (cardId: string | null, channelId: string) => {
    actions.setFocus(cardId, channelId);
    openConversation();
  };

  useEffect(() => {
    if (share) {
      closeAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [share]);

  useEffect(() => {
    if (textCard.cardId) {
      openTopic(textCard.cardId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textCard]);

  const openTopic = async (cardId: string) => {
    setAdding(true);
    try {
      const id = await actions.openTopic(cardId);
      await actions.setFocus(null, id);
      openConversation();
    } catch (err) {
      console.log(err);
      setAlert(true);
    }
    setAdding(false);
  };

  const addTopic = async () => {
    setAdding(true);
    try {
      const id = await actions.addTopic(
        sealedTopic,
        subjectTopic,
        members.filter(memberId => Boolean(cards.find(card => card.cardId === memberId))),
      );
      setAdd(false);
      setSubjectTopic('');
      setMembers([]);
      setSealedTopic(false);
      await actions.setFocus(null, id);
      openConversation();
    } catch (err) {
      console.log(err);
      setAdd(false);
      setAlert(true);
    }
    setAdding(false);
  };

  const allTab = tab === 'all' && state.filtered.length !== 0;
  const unreadTab = tab === 'unread' && state.unread.length !== 0;
  const favoritesTab = tab === 'favorites' && state.favorites.length !== 0;
  const emptyTab = !allTab && !unreadTab && !favoritesTab;

  return (
    <View style={styles.container}>
      { state.layout === 'small' && (
        <View style={styles.content}>
          <Surface elevation={9} mode="flat" style={styles.searchContainer}>
            <Surface mode="flat" elevation={0} style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                dense={true}
                outlineColor="transparent"
                activeOutlineColor="transparent"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                underlineStyle={styles.inputUnderline}
                mode="outlined"
                placeholder={state.strings.searchTopics}
                left={<TextInput.Icon style={styles.icon} icon="search" />}
                value={state.filter}
                onChangeText={value => actions.setFilter(value)}
              />
            </Surface>
            <Button icon="message1" mode="contained" textColor="white" style={styles.newButton} onPress={createConversation}>
              {state.strings.new}
            </Button>
          </Surface>

          <View style={styles.topics}>
            <View style={{ ...styles.tabView, display: allTab ? 'flex' : 'none' }}>
              <FlatList
                style={styles.channels}
                contentContainerStyle={styles.flatListContent}
                data={state.filtered}
                initialNumToRender={10}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => {
                  const {sealed, focused, hosted, unread, imageUrl, subject, message} = item;
                  const choose = () => {
                    open(item.cardId, item.channelId);
                  };
                  const Wrap = state.layout === 'large' && focused ? Surface : View;
                  const action = (
                    <Menu
                      visible={allTab && more === `${item.cardId}:${item.channelId}`}
                      onDismiss={()=>setMore(null)}
                      anchor={<IconButton style={styles.action} icon="dots-horizontal-circle-outline" size={22} onPress={()=>setMore(`${item.cardId}:${item.channelId}`)} />}>
                        { state.favorite.some(entry => item.cardId == entry.cardId && item.channelId === entry.channelId) && (
                          <Menu.Item key='clearFavorite' leadingIcon="star" title={state.strings.removeFavorites} onPress={()=>{setMore(null); actions.clearFavorite(item.cardId, item.channelId)}} />
                        )}
                        { !state.favorite.some(entry => item.cardId == entry.cardId && item.channelId === entry.channelId) && (
                          <Menu.Item key='setFavorite' leadingIcon="star" title={state.strings.addFavorites} onPress={()=>{setMore(null); actions.setFavorite(item.cardId, item.channelId)}} />
                        )}
                        { unread && (
                          <Menu.Item key='markRead' leadingIcon="email-open-outline" title={state.strings.markRead} onPress={()=>{setMore(null); actions.clearUnread(item.cardId, item.channelId)}} />
                        )}
                        { !unread && (
                          <Menu.Item key='markUnread' leadingIcon="email-outline" title={state.strings.markUnread} onPress={()=>{setMore(null); actions.setUnread(item.cardId, item.channelId)}} />
                        )}
                    </Menu>
                  );
                  return (
                    <Wrap elevation={1} mode="flat">
                      <Channel
                        containerStyle={{ ...styles.smChannel, message: { color: theme.colors.onSecondary, fontWeight: 'normal' }}}
                        select={choose}
                        sealed={sealed}
                        hosted={hosted}
                        imageUrl={imageUrl}
                        notesPlaceholder={state.strings.notes}
                        subjectPlaceholder={state.strings.unknown}
                        subject={subject}
                        messagePlaceholder={`[${state.strings.sealed}]`}
                        message={message}
                        action={action}
                      />
                    </Wrap>
                  );
                }}
                keyExtractor={channel => `${channel.cardId}:${channel.channelId}`}
              />
            </View>
            <View style={{ ...styles.tabView, display: unreadTab ? 'flex' : 'none' }}>
              <FlatList
                style={styles.channels}
                contentContainerStyle={styles.flatListContent}
                data={state.unread}
                initialNumToRender={10}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => {
                  const {sealed, focused, hosted, unread, imageUrl, subject, message} = item;
                  const choose = () => {
                    open(item.cardId, item.channelId);
                  };
                  const Wrap = state.layout === 'large' && focused ? Surface : View;
                  const action = (
                    <Menu
                      visible={unreadTab && more === `${item.cardId}:${item.channelId}`}
                      onDismiss={()=>setMore(null)}
                      anchor={<IconButton style={styles.action} icon="dots-horizontal-circle-outline" size={22} onPress={()=>setMore(`${item.cardId}:${item.channelId}`)} />}>
                        { state.favorite.some(entry => item.cardId == entry.cardId && item.channelId === entry.channelId) && (
                          <Menu.Item key='clearFavorite' leadingIcon="star" title={state.strings.removeFavorites} onPress={()=>{setMore(null); actions.clearFavorite(item.cardId, item.channelId)}} />
                        )}
                        { !state.favorite.some(entry => item.cardId == entry.cardId && item.channelId === entry.channelId) && (
                          <Menu.Item key='setFavorite' leadingIcon="star" title={state.strings.addFavorites} onPress={()=>{setMore(null); actions.setFavorite(item.cardId, item.channelId)}} />
                        )}
                        <Menu.Item key='markRead' leadingIcon="email-open-outline" title={state.strings.markRead} onPress={()=>{setMore(null); actions.clearUnread(item.cardId, item.channelId)}} />
                    </Menu>
                  );
                  return (
                    <Wrap elevation={1} mode="flat">
                      <Channel
                        containerStyle={styles.smChannel}
                        select={choose}
                        sealed={sealed}
                        hosted={hosted}
                        imageUrl={imageUrl}
                        notesPlaceholder={state.strings.notes}
                        subjectPlaceholder={state.strings.unknown}
                        subject={subject}
                        messagePlaceholder={`[${state.strings.sealed}]`}
                        message={message}
                        action={action}
                      />
                    </Wrap>
                  );
                }}
                keyExtractor={channel => `${channel.cardId}:${channel.channelId}`}
              />
            </View>
            <View style={{ ...styles.tabView, display: favoritesTab ? 'flex' : 'none' }}>
              <FlatList
                style={styles.channels}
                contentContainerStyle={styles.flatListContent}
                data={state.favorites}
                initialNumToRender={10}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => {
                  const {sealed, focused, hosted, unread, imageUrl, subject, message} = item;
                  const choose = () => {
                    open(item.cardId, item.channelId);
                  };
                  const Wrap = state.layout === 'large' && focused ? Surface : View;
                  const action = (
                    <Menu
                      visible={favoritesTab && more === `${item.cardId}:${item.channelId}`}
                      onDismiss={()=>setMore(null)}
                      anchor={<IconButton style={styles.action} icon="dots-horizontal-circle-outline" size={22} onPress={()=>setMore(`${item.cardId}:${item.channelId}`)} />}>
                        <Menu.Item key='clearFavorite' leadingIcon="star" title={state.strings.removeFavorites} onPress={()=>{setMore(null); actions.clearFavorite(item.cardId, item.channelId)}} />
                        { unread && (
                          <Menu.Item key='markRead' leadingIcon="email-open-outline" title={state.strings.markRead} onPress={()=>{setMore(null); actions.clearUnread(item.cardId, item.channelId)}} />
                        )}
                        { !unread && (
                          <Menu.Item key='markUnread' leadingIcon="email-outline" title={state.strings.markUnread} onPress={()=>{setMore(null); actions.setUnread(item.cardId, item.channelId)}} />
                        )}
                    </Menu>
                  );

                  return (
                    <Wrap elevation={1} mode="flat">
                      <Channel
                        containerStyle={styles.smChannel}
                        select={choose}
                        sealed={sealed}
                        hosted={hosted}
                        imageUrl={imageUrl}
                        notesPlaceholder={state.strings.notes}
                        subjectPlaceholder={state.strings.unknown}
                        subject={subject}
                        messagePlaceholder={`[${state.strings.sealed}]`}
                        message={message}
                        action={action}
                      />
                    </Wrap>
                  );
                }}
                keyExtractor={channel => `${channel.cardId}:${channel.channelId}`}
              />
            </View>
            <View style={{...styles.tabView, display: emptyTab ? 'flex' : 'none' }}>
              <View style={styles.none}>
                <Text style={styles.noneLabel}>{state.strings.noTopics}</Text>
              </View>
            </View>
          </View>
          <View style={styles.tabs}>
            <Pressable style={tab === 'all' ? styles.opaque : styles.opacity} onPress={() => setTab('all')}>
              <Surface style={styles.tab} elevation={tab === 'all' ? 10 : 2}>
                <Text style={tab === 'all' ? styles.tabSet : styles.tabUnset} color="white">{ state.strings.all }</Text>
              </Surface>
            </Pressable>
            <Pressable style={tab === 'unread' ? styles.opaque : styles.opacity} onPress={() => setTab('unread')}>
              <Surface style={styles.tab} elevation={tab === 'unread' ? 10 : 2}>
                <Text style={tab === 'unread' ? styles.tabSet : styles.tabUnset} color="white">{ `${state.strings.unread}${state.unread.length > 0 ? ' (' + state.unread.length + ')' : ''}` }</Text>
              </Surface>
            </Pressable>
            <Pressable style={tab === 'favorites' ? styles.opaque : styles.opacity} onPress={() => setTab('favorites')}>
              <Surface style={styles.tab} elevation={tab === 'favorites' ? 10 : 2}>
                <Text style={tab === 'favorites' ? styles.tabSet : styles.tabUnset} color="white">{ state.strings.favorites }</Text>
              </Surface>
            </Pressable>
          </View>
        </View>
      )}
      { state.layout === 'large' && (
        <SafeAreaView style={styles.content} edges={['bottom']}>
          <View style={styles.header}>
            <Surface mode="flat" elevation={5} style={styles.inputSurface}>
              <TextInput
                dense={true}
                style={styles.input}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                unserlineStyle={styles.inputUnderline}
                outlineColor="transparent"
                activeOutlineColor="transparent"
                mode="outlined"
                placeholder={state.strings.topics}
                left={<TextInput.Icon style={styles.icon} icon="magnify" />}
                value={state.filter}
                onChangeText={value => actions.setFilter(value)}
              />
            </Surface>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.topics}>
            {state.filtered.length !== 0 && (
              <FlatList
                style={styles.channels}
                contentContainerStyle={styles.largeFlatListContent}
                data={state.filtered}
                initialNumToRender={32}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => {
                  const {sealed, focused, hosted, unread, imageUrl, subject, message} = item;
                  const choose = () => {
                    open(item.cardId, item.channelId);
                  };
                  const Wrap = state.layout === 'large' && focused ? Surface : View;
                  //const action = <IconButton style={styles.action} icon="dots-horizontal-circle-outline" size={22} onPress={()=>{}} />
                  return (
                    <Wrap elevation={1} mode="flat">
                      <Channel
                        containerStyle={{
                          ...styles.channel,
                          borderColor: theme.colors.outlineVariant,
                        }}
                        select={choose}
                        unread={unread}
                        sealed={sealed}
                        hosted={hosted}
                        imageUrl={imageUrl}
                        notesPlaceholder={state.strings.notes}
                        subjectPlaceholder={state.strings.unknown}
                        subject={subject}
                        messagePlaceholder={`[${state.strings.sealed}]`}
                        message={message}
                      />
                    </Wrap>
                  );
                }}
                keyExtractor={channel => `${channel.cardId}:${channel.channelId}`}
              />
            )}
            {state.filtered.length === 0 && (
              <View style={styles.none}>
                <Text style={styles.noneLabel}>{state.strings.noTopics}</Text>
              </View>
            )}
          </View>
          <View style={styles.bar}>
            <Divider style={styles.divider} />
            <Button icon="comment-plus" mode="contained" style={styles.button} onPress={() => setAdd(true)}>
              {state.strings.new}
            </Button>
          </View>
        </SafeAreaView>
      )}

      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={add} onRequestClose={() => setAdd(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
          <View style={styles.addContainer}>
            <Surface elevation={4} mode="flat" style={styles.addSurface}>
              <Text style={styles.addLabel}>{state.strings.newTopic}</Text>
              <IconButton style={styles.addClose} icon="close" size={24} onPress={() => setAdd(false)} />
              <Surface elevation={0} style={styles.subjectContainer}>
                <TextInput
                  dense={true}
                  style={styles.subjectInput}
                  autoCapitalize={false}
                  underlineStyle={styles.inputUnderline}
                  placeholder={state.strings.subjectOptional}
                  left={<TextInput.Icon style={styles.icon} icon="label-outline" />}
                  value={subjectTopic}
                  onChangeText={value => setSubjectTopic(value)}
                />
                <Divider style={styles.modalDivider} />
              </Surface>
              <View style={styles.membersContainer}>
                <Divider style={styles.modalDivider} />
                <Surface elevation={0} mode="flat" style={styles.members}>
                  <FlatList
                    style={styles.cards}
                    data={cards}
                    initialNumToRender={32}
                    renderItem={({item}) => {
                      const enable = (
                        <Switch
                          key="enable"
                          style={styles.memberSwitch}
                          value={Boolean(members?.find(cardId => cardId === item.cardId))}
                          onValueChange={flag => {
                            if (flag) {
                              setMembers([item.cardId, ...members]);
                            } else {
                              setMembers(members.filter(cardId => cardId !== item.cardId));
                            }
                          }}
                        />
                      );
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
                          actions={[enable]}
                        />
                      );
                    }}
                    keyExtractor={card => card.cardId}
                  />
                </Surface>
                <Divider style={styles.modalDivider} />
              </View>
              <View style={styles.addControls}>
                <View style={styles.sealable}>
                  {state.sealSet && (
                    <View style={styles.sealableContent}>
                      <Text style={styles.switchLabel}>{state.strings.sealedTopic}</Text>
                      <Switch style={styles.sealSwitch} value={sealedTopic} onValueChange={flag => setSealedTopic(flag)} />
                    </View>
                  )}
                </View>
                <Button mode="outlined" onPress={() => setAdd(false)}>
                  {state.strings.cancel}
                </Button>
                <Button mode="contained" loading={adding} onPress={addTopic}>
                  {state.strings.create}
                </Button>
              </View>
            </Surface>
          </View>
        </View>
      </Modal>
      <Confirm show={alert} params={alertParams} />
      <Selector share={share} selected={select} channels={state.channels} />
    </View>
  );
}
