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

export function ContentSmall({
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
        sealedTopic || !state.allowUnsealed,
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
      <View style={styles.content}>
        <Surface elevation={9} mode="flat">
          <SafeAreaView style={styles.searchContainer} edges={['left', 'right']}>
            <Surface mode="flat" elevation={0} style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                outlineStyle={styles.inputBorder}
                dense={true}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                mode="outlined"
                placeholder={state.strings.searchTopics}
                left={<TextInput.Icon style={styles.icon} icon="search" />}
                value={state.filter}
                onChangeText={value => actions.setFilter(value)}
              />
            </Surface>
            {(state.sealSet || state.allowUnsealed) && (
              <Button icon="message1" mode="contained" textColor="white" style={styles.newButton} onPress={createConversation}>
                {state.strings.new}
              </Button>
            )}
          </SafeAreaView>
        </Surface>

        <View style={styles.topics}>
          <View style={{...styles.tabView, ...(allTab ? styles.tabVisible : styles.tabHidden)}}>
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
                const action = (
                  <Menu
                    visible={allTab && more === `${item.cardId}:${item.channelId}`}
                    onDismiss={() => setMore(null)}
                    anchor={<IconButton style={styles.action} icon="dots-horizontal-circle-outline" size={22} onPress={() => setMore(`${item.cardId}:${item.channelId}`)} />}>
                    {state.favorite.some(entry => item.cardId == entry.cardId && item.channelId === entry.channelId) && (
                      <Menu.Item
                        key="clearFavorite"
                        leadingIcon="star"
                        title={state.strings.removeFavorites}
                        onPress={() => {
                          setMore(null);
                          actions.clearFavorite(item.cardId, item.channelId);
                        }}
                      />
                    )}
                    {!state.favorite.some(entry => item.cardId == entry.cardId && item.channelId === entry.channelId) && (
                      <Menu.Item
                        key="setFavorite"
                        leadingIcon="star"
                        title={state.strings.addFavorites}
                        onPress={() => {
                          setMore(null);
                          actions.setFavorite(item.cardId, item.channelId);
                        }}
                      />
                    )}
                    {unread && (
                      <Menu.Item
                        key="markRead"
                        leadingIcon="email-open-outline"
                        title={state.strings.markRead}
                        onPress={() => {
                          setMore(null);
                          actions.clearUnread(item.cardId, item.channelId);
                        }}
                      />
                    )}
                    {!unread && (
                      <Menu.Item
                        key="markUnread"
                        leadingIcon="email-outline"
                        title={state.strings.markUnread}
                        onPress={() => {
                          setMore(null);
                          actions.setUnread(item.cardId, item.channelId);
                        }}
                      />
                    )}
                  </Menu>
                );
                return (
                  <View>
                    <Channel
                      containerStyle={{...styles.smChannel, message: {color: theme.colors.onSecondary, fontWeight: 'normal'}}}
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
                  </View>
                );
              }}
              keyExtractor={channel => `${channel.cardId}:${channel.channelId}`}
            />
          </View>
          <View style={{...styles.tabView, ...(unreadTab ? styles.tabVisible : styles.tabHidden)}}>
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
                const action = (
                  <Menu
                    visible={unreadTab && more === `${item.cardId}:${item.channelId}`}
                    onDismiss={() => setMore(null)}
                    anchor={<IconButton style={styles.action} icon="dots-horizontal-circle-outline" size={22} onPress={() => setMore(`${item.cardId}:${item.channelId}`)} />}>
                    {state.favorite.some(entry => item.cardId == entry.cardId && item.channelId === entry.channelId) && (
                      <Menu.Item
                        key="clearFavorite"
                        leadingIcon="star"
                        title={state.strings.removeFavorites}
                        onPress={() => {
                          setMore(null);
                          actions.clearFavorite(item.cardId, item.channelId);
                        }}
                      />
                    )}
                    {!state.favorite.some(entry => item.cardId == entry.cardId && item.channelId === entry.channelId) && (
                      <Menu.Item
                        key="setFavorite"
                        leadingIcon="star"
                        title={state.strings.addFavorites}
                        onPress={() => {
                          setMore(null);
                          actions.setFavorite(item.cardId, item.channelId);
                        }}
                      />
                    )}
                    <Menu.Item
                      key="markRead"
                      leadingIcon="email-open-outline"
                      title={state.strings.markRead}
                      onPress={() => {
                        setMore(null);
                        actions.clearUnread(item.cardId, item.channelId);
                      }}
                    />
                  </Menu>
                );
                return (
                  <View>
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
                  </View>
                );
              }}
              keyExtractor={channel => `${channel.cardId}:${channel.channelId}`}
            />
          </View>
          <View style={{...styles.tabView, ...(favoritesTab ? styles.tabVisible : styles.tabHidden)}}>
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
                const action = (
                  <Menu
                    visible={favoritesTab && more === `${item.cardId}:${item.channelId}`}
                    onDismiss={() => setMore(null)}
                    anchor={<IconButton style={styles.action} icon="dots-horizontal-circle-outline" size={22} onPress={() => setMore(`${item.cardId}:${item.channelId}`)} />}>
                    <Menu.Item
                      key="clearFavorite"
                      leadingIcon="star"
                      title={state.strings.removeFavorites}
                      onPress={() => {
                        setMore(null);
                        actions.clearFavorite(item.cardId, item.channelId);
                      }}
                    />
                    {unread && (
                      <Menu.Item
                        key="markRead"
                        leadingIcon="email-open-outline"
                        title={state.strings.markRead}
                        onPress={() => {
                          setMore(null);
                          actions.clearUnread(item.cardId, item.channelId);
                        }}
                      />
                    )}
                    {!unread && (
                      <Menu.Item
                        key="markUnread"
                        leadingIcon="email-outline"
                        title={state.strings.markUnread}
                        onPress={() => {
                          setMore(null);
                          actions.setUnread(item.cardId, item.channelId);
                        }}
                      />
                    )}
                  </Menu>
                );

                return (
                  <View>
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
                  </View>
                );
              }}
              keyExtractor={channel => `${channel.cardId}:${channel.channelId}`}
            />
          </View>
          <View style={{...styles.tabView, ...(emptyTab ? styles.tabVisible : styles.tabHidden)}}>
            <View style={styles.none}>
              <Text style={styles.noneLabel}>{state.strings.noTopics}</Text>
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
          <Pressable style={tab === 'unread' ? styles.opaque : styles.opacity} onPress={() => setTab('unread')}>
            <Surface style={styles.tab} elevation={tab === 'unread' ? 10 : 2}>
              <Text style={tab === 'unread' ? styles.tabSet : styles.tabUnset} color="white">{`${state.strings.unread}${state.unread.length > 0 ? ' (' + state.unread.length + ')' : ''}`}</Text>
            </Surface>
          </Pressable>
          <Pressable style={tab === 'favorites' ? styles.opaque : styles.opacity} onPress={() => setTab('favorites')}>
            <Surface style={styles.tab} elevation={tab === 'favorites' ? 10 : 2}>
              <Text style={tab === 'favorites' ? styles.tabSet : styles.tabUnset} color="white">
                {state.strings.favorites}
              </Text>
            </Surface>
          </Pressable>
        </View>
      </View>
      <Selector share={share} selected={select} channels={state.channels} />
    </View>
  );
}
