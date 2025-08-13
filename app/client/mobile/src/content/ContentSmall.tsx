import React, {useEffect, useState, useCallback} from 'react';
import {Surface, IconButton, Icon, Menu, Button, Text, TextInput, useTheme} from 'react-native-paper';
import {Pressable, Platform, FlatList, View} from 'react-native';
import {styles} from './Content.styled';
import {useContent} from './useContent.hook';
import {Channel} from '../channel/Channel';
import {Selector} from '../selector/Selector';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
import {Confirm} from '../confirm/Confirm';

const keyExtractor = (channel: any) => `${channel.cardId}:${channel.channelId}`;

const AllTab = React.memo(function AllTab({
  data,
  theme,
  strings,
  more,
  setMore,
  favorite,
  actions,
  open,
  setLeave,
  setRemove,
}: {
  data: any[];
  theme: any;
  strings: any;
  more: string | null;
  setMore: (value: string | null) => void;
  favorite: any[];
  actions: any;
  open: (cardId: string | null, channelId: string) => void;
  setLeave: (params: any) => void;
  setRemove: (params: any) => void;
}) {
  return (
    <FlatList
      style={styles.channels}
      contentContainerStyle={styles.flatListContent}
      data={data}
      initialNumToRender={8}
      maxToRenderPerBatch={4}
      windowSize={8}
      updateCellsBatchingPeriod={50}
      removeClippedSubviews={true}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => {
        const {sealed, hosted, unread, imageUrl, subject, message} = item;
        const choose = () => {
          open(item.cardId, item.channelId);
        };
        const action = (
          <Menu
            mode={Platform.OS === 'ios' ? 'flat' : 'elevated'}
            contentStyle={styles.menuContent}
            elevation={Platform.OS === 'ios' ? 8 : 2}
            visible={more === `all:${item.cardId}:${item.channelId}`}
            onDismiss={() => setMore(null)}
            anchor={<IconButton style={styles.action} contentStyle={styles.actionPad} rippleColor="transparent" icon="dots-horizontal-circle-outline" size={22} onPress={() => setMore(`all:${item.cardId}:${item.channelId}`)} />}>
            {Platform.OS === 'ios' && (
              <Surface elevation={11} style={styles.menu}>
                <BlurView style={styles.blur} blurType={theme.colors.name} blurAmount={4} reducedTransparencyFallbackSize={theme.colors.name} />
                {favorite.some(entry => item.cardId === entry.cardId && item.channelId === entry.channelId) && (
                  <Pressable
                    key="clearFavorite"
                    style={styles.menuOption}
                    onPress={() => {
                      setMore(null);
                      actions.clearFavorite(item.cardId, item.channelId);
                    }}>
                    <Icon style={styles.button} source="star-filled" size={24} color={theme.colors.primary} />
                    <Text>{strings.removeFavorites}</Text>
                  </Pressable>
                )}
                {!favorite.some(entry => item.cardId === entry.cardId && item.channelId === entry.channelId) && (
                  <Pressable
                    key="setFavorite"
                    style={styles.menuOption}
                    onPress={() => {
                      setMore(null);
                      actions.setFavorite(item.cardId, item.channelId);
                    }}>
                    <Icon style={styles.button} source="star" size={24} color={theme.colors.primary} />
                    <Text>{strings.addFavorites}</Text>
                  </Pressable>
                )}
                {unread && (
                  <Pressable
                    key="markRead"
                    style={styles.menuOption}
                    onPress={() => {
                      setMore(null);
                      actions.clearUnread(item.cardId, item.channelId);
                    }}>
                    <Icon style={styles.button} source="mail-filled" size={24} color={theme.colors.primary} />
                    <Text>{strings.markRead}</Text>
                  </Pressable>
                )}
                {!unread && (
                  <Pressable
                    key="markUnead"
                    style={styles.menuOption}
                    onPress={() => {
                      setMore(null);
                      actions.setUnread(item.cardId, item.channelId);
                    }}>
                    <Icon style={styles.button} source="mail" size={24} color={theme.colors.primary} />
                    <Text>{strings.markUnread}</Text>
                  </Pressable>
                )}
                <Pressable
                  key="delete"
                  style={styles.menuOption}
                  onPress={() => {
                    setMore(null);
                    if (item.cardId) {
                      setLeave({cardId: item.cardId, channelId: item.channelId});
                    } else {
                      setRemove({channelId: item.channelId});
                    }
                  }}>
                  <Icon style={styles.button} source="trash-2" size={24} color={theme.colors.primary} />
                  <Text>{hosted ? strings.deleteChat : strings.leaveChat}</Text>
                </Pressable>
              </Surface>
            )}
            {Platform.OS !== 'ios' && favorite.some(entry => item.cardId === entry.cardId && item.channelId === entry.channelId) && (
              <Menu.Item
                leadingIcon="star-filled"
                onPress={() => {
                  setMore(null);
                  actions.clearFavorite(item.cardId, item.channelId);
                }}
                title={strings.removeFavorites}
              />
            )}
            {Platform.OS !== 'ios' && !favorite.some(entry => item.cardId === entry.cardId && item.channelId === entry.channelId) && (
              <Menu.Item
                leadingIcon="star"
                onPress={() => {
                  setMore(null);
                  actions.setFavorite(item.cardId, item.channelId);
                }}
                title={strings.addFavorites}
              />
            )}
            {Platform.OS !== 'ios' && unread && (
              <Menu.Item
                leadingIcon="mail-filled"
                onPress={() => {
                  setMore(null);
                  actions.clearUnread(item.cardId, item.channelId);
                }}
                title={strings.markRead}
              />
            )}
            {Platform.OS !== 'ios' && !unread && (
              <Menu.Item
                leadingIcon="mail"
                onPress={() => {
                  setMore(null);
                  actions.setUnread(item.cardId, item.channelId);
                }}
                title={strings.markUnread}
              />
            )}
            {Platform.OS !== 'ios' && (
              <Menu.Item
                leadingIcon="trash-2"
                onPress={() => {
                  setMore(null);
                  if (item.cardId) {
                    setLeave({cardId: item.cardId, channelId: item.channelId});
                  } else {
                    setRemove({channelId: item.channelId});
                  }
                }}
                title={hosted ? strings.deleteChat : strings.leaveChat}
              />
            )}
          </Menu>
        );
        return (
          <View>
            <Channel
              containerStyle={{...styles.smChannel, title: {fontWeight: unread ? 'bold' : 'normal'}, message: {color: theme.colors.onSecondary, fontWeight: unread ? 700 : 'normal'}}}
              select={choose}
              sealed={sealed}
              hosted={hosted}
              imageUrl={imageUrl}
              notesPlaceholder={strings.notes}
              subjectPlaceholder={strings.unknown}
              subject={subject}
              messagePlaceholder={`${strings.encrypted}`}
              message={message}
              action={action}
            />
          </View>
        );
      }}
      keyExtractor={keyExtractor}
    />
  );
});

const UnreadTab = React.memo(function UnreadTab({
  data,
  theme,
  strings,
  more,
  setMore,
  favorite,
  actions,
  open,
  setLeave,
  setRemove,
}: {
  data: any[];
  theme: any;
  strings: any;
  more: string | null;
  setMore: (value: string | null) => void;
  favorite: any[];
  actions: any;
  open: (cardId: string | null, channelId: string) => void;
  setLeave: (params: any) => void;
  setRemove: (params: any) => void;
}) {
  return (
    <FlatList
      style={styles.channels}
      contentContainerStyle={styles.flatListContent}
      data={data}
      initialNumToRender={8}
      maxToRenderPerBatch={4}
      windowSize={8}
      updateCellsBatchingPeriod={50}
      removeClippedSubviews={true}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => {
        const {sealed, hosted, imageUrl, subject, message} = item;
        const choose = () => {
          open(item.cardId, item.channelId);
        };
        const action = (
          <Menu
            mode={Platform.OS === 'ios' ? 'flat' : 'elevated'}
            elevation={Platform.OS === 'ios' ? 8 : 2}
            contentStyle={styles.menuContent}
            visible={more === `unread:${item.cardId}:${item.channelId}`}
            onDismiss={() => setMore(null)}
            anchor={<IconButton style={styles.action} contentStyle={styles.actionPad} rippleColor="transparent" icon="dots-horizontal-circle-outline" size={22} onPress={() => setMore(`unread:${item.cardId}:${item.channelId}`)} />}>
            {Platform.OS === 'ios' && (
              <Surface elevation={11} style={styles.menu}>
                <BlurView style={styles.blur} blurType={theme.colors.name} blurAmount={4} reducedTransparencyFallbackSize={theme.colors.name} />
                {favorite.some(entry => item.cardId === entry.cardId && item.channelId === entry.channelId) && (
                  <Pressable
                    key="clearFavorite"
                    style={styles.menuOption}
                    onPress={() => {
                      setMore(null);
                      actions.clearFavorite(item.cardId, item.channelId);
                    }}>
                    <Icon style={styles.button} source="star-filled" size={24} color={theme.colors.primary} />
                    <Text>{strings.removeFavorites}</Text>
                  </Pressable>
                )}
                {!favorite.some(entry => item.cardId === entry.cardId && item.channelId === entry.channelId) && (
                  <Pressable
                    key="setFavorite"
                    style={styles.menuOption}
                    onPress={() => {
                      setMore(null);
                      actions.setFavorite(item.cardId, item.channelId);
                    }}>
                    <Icon style={styles.button} source="star" size={24} color={theme.colors.primary} />
                    <Text>{strings.addFavorites}</Text>
                  </Pressable>
                )}
                <Pressable
                  key="markRead"
                  style={styles.menuOption}
                  onPress={() => {
                    setMore(null);
                    actions.clearUnread(item.cardId, item.channelId);
                  }}>
                  <Icon style={styles.button} source="mail-filled" size={24} color={theme.colors.primary} />
                  <Text>{strings.markRead}</Text>
                </Pressable>
                <Pressable
                  key="delete"
                  style={styles.menuOption}
                  onPress={() => {
                    setMore(null);
                    if (item.cardId) {
                      setLeave({cardId: item.cardId, channelId: item.channelId});
                    } else {
                      setRemove({channelId: item.channelId});
                    }
                  }}>
                  <Icon style={styles.button} source="trash-2" size={24} color={theme.colors.primary} />
                  <Text>{hosted ? strings.deleteChat : strings.leaveChat}</Text>
                </Pressable>
              </Surface>
            )}
            {Platform.OS !== 'ios' && favorite.some(entry => item.cardId === entry.cardId && item.channelId === entry.channelId) && (
              <Menu.Item
                leadingIcon="star-filled"
                onPress={() => {
                  setMore(null);
                  actions.clearFavorite(item.cardId, item.channelId);
                }}
                title={strings.removeFavorites}
              />
            )}
            {Platform.OS !== 'ios' && !favorite.some(entry => item.cardId === entry.cardId && item.channelId === entry.channelId) && (
              <Menu.Item
                leadingIcon="star"
                onPress={() => {
                  setMore(null);
                  actions.setFavorite(item.cardId, item.channelId);
                }}
                title={strings.addFavorites}
              />
            )}
            {Platform.OS !== 'ios' && (
              <Menu.Item
                leadingIcon="mail-filled"
                onPress={() => {
                  setMore(null);
                  actions.clearUnread(item.cardId, item.channelId);
                }}
                title={strings.markRead}
              />
            )}
            {Platform.OS !== 'ios' && (
              <Menu.Item
                leadingIcon="trash-2"
                onPress={() => {
                  setMore(null);
                  if (item.cardId) {
                    setLeave({cardId: item.cardId, channelId: item.channelId});
                  } else {
                    setRemove({channelId: item.channelId});
                  }
                }}
                title={hosted ? strings.deleteChat : strings.leaveChat}
              />
            )}
          </Menu>
        );
        return (
          <View>
            <Channel
              containerStyle={{...styles.smChannel, message: {color: theme.colors.onSecondary, fontWeight: 700}}}
              select={choose}
              sealed={sealed}
              hosted={hosted}
              imageUrl={imageUrl}
              notesPlaceholder={strings.notes}
              subjectPlaceholder={strings.unknown}
              subject={subject}
              messagePlaceholder={`[${strings.sealed}]`}
              message={message}
              action={action}
            />
          </View>
        );
      }}
      keyExtractor={keyExtractor}
    />
  );
});

const FavoritesTab = React.memo(function FavoritesTab({
  data,
  theme,
  strings,
  more,
  setMore,
  favorite,
  actions,
  open,
  setLeave,
  setRemove,
}: {
  data: any[];
  theme: any;
  strings: any;
  more: string | null;
  setMore: (value: string | null) => void;
  favorite: any[];
  actions: any;
  open: (cardId: string | null, channelId: string) => void;
  setLeave: (params: any) => void;
  setRemove: (params: any) => void;
}) {
  return (
    <FlatList
      style={styles.channels}
      contentContainerStyle={styles.flatListContent}
      data={data}
      initialNumToRender={8}
      maxToRenderPerBatch={4}
      windowSize={8}
      updateCellsBatchingPeriod={50}
      removeClippedSubviews={true}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => {
        const {sealed, hosted, unread, imageUrl, subject, message} = item;
        const choose = () => {
          open(item.cardId, item.channelId);
        };
        const action = (
          <Menu
            mode={Platform.OS === 'ios' ? 'flat' : 'elevated'}
            elevation={Platform.OS === 'ios' ? 8 : 2}
            contentStyle={styles.menuContent}
            visible={more === `favorite:${item.cardId}:${item.channelId}`}
            onDismiss={() => setMore(null)}
            anchor={<IconButton style={styles.action} contentStyle={styles.actionPad} rippleColor="transparent" icon="dots-horizontal-circle-outline" size={22} onPress={() => setMore(`favorite:${item.cardId}:${item.channelId}`)} />}>
            {Platform.OS === 'ios' && (
              <Surface elevation={11} style={styles.menu}>
                <BlurView style={styles.blur} blurType={theme.colors.name} blurAmount={4} reducedTransparencyFallbackSize={theme.colors.name} />
                {favorite.some(entry => item.cardId === entry.cardId && item.channelId === entry.channelId) && (
                  <Pressable
                    key="clearFavorite"
                    style={styles.menuOption}
                    onPress={() => {
                      setMore(null);
                      actions.clearFavorite(item.cardId, item.channelId);
                    }}>
                    <Icon style={styles.button} source="star-filled" size={24} color={theme.colors.primary} />
                    <Text>{strings.removeFavorites}</Text>
                  </Pressable>
                )}
                {!favorite.some(entry => item.cardId === entry.cardId && item.channelId === entry.channelId) && (
                  <Pressable
                    key="setFavorite"
                    style={styles.menuOption}
                    onPress={() => {
                      setMore(null);
                      actions.setFavorite(item.cardId, item.channelId);
                    }}>
                    <Icon style={styles.button} source="star" size={24} color={theme.colors.primary} />
                    <Text>{strings.addFavorites}</Text>
                  </Pressable>
                )}
                {unread && (
                  <Pressable
                    key="markRead"
                    style={styles.menuOption}
                    onPress={() => {
                      setMore(null);
                      actions.clearUnread(item.cardId, item.channelId);
                    }}>
                    <Icon style={styles.button} source="mail-filled" size={24} color={theme.colors.primary} />
                    <Text>{strings.markRead}</Text>
                  </Pressable>
                )}
                {!unread && (
                  <Pressable
                    key="markUnead"
                    style={styles.menuOption}
                    onPress={() => {
                      setMore(null);
                      actions.setUnread(item.cardId, item.channelId);
                    }}>
                    <Icon style={styles.button} source="mail" size={24} color={theme.colors.primary} />
                    <Text>{strings.markUnread}</Text>
                  </Pressable>
                )}
                <Pressable
                  key="delete"
                  style={styles.menuOption}
                  onPress={() => {
                    setMore(null);
                    if (item.cardId) {
                      setLeave({cardId: item.cardId, channelId: item.channelId});
                    } else {
                      setRemove({channelId: item.channelId});
                    }
                  }}>
                  <Icon style={styles.button} source="trash-2" size={24} color={theme.colors.primary} />
                  <Text>{hosted ? strings.deleteChat : strings.leaveChat}</Text>
                </Pressable>
              </Surface>
            )}
            {Platform.OS !== 'ios' && (
              <Menu.Item
                leadingIcon="star-filled"
                onPress={() => {
                  setMore(null);
                  actions.clearFavorite(item.cardId, item.channelId);
                }}
                title={strings.removeFavorites}
              />
            )}
            {Platform.OS !== 'ios' && unread && (
              <Menu.Item
                leadingIcon="mail-filled"
                onPress={() => {
                  setMore(null);
                  actions.clearUnread(item.cardId, item.channelId);
                }}
                title={strings.markRead}
              />
            )}
            {Platform.OS !== 'ios' && !unread && (
              <Menu.Item
                leadingIcon="mail"
                onPress={() => {
                  setMore(null);
                  actions.setUnread(item.cardId, item.channelId);
                }}
                title={strings.markUnread}
              />
            )}
            {Platform.OS !== 'ios' && (
              <Menu.Item
                leadingIcon="trash-2"
                onPress={() => {
                  setMore(null);
                  if (item.cardId) {
                    setLeave({cardId: item.cardId, channelId: item.channelId});
                  } else {
                    setRemove({channelId: item.channelId});
                  }
                }}
                title={hosted ? strings.deleteChat : strings.leaveChat}
              />
            )}
          </Menu>
        );

        return (
          <View>
            <Channel
              containerStyle={{...styles.smChannel, title: {fontWeight: unread ? 'bold' : 'normal'}, message: {color: theme.colors.onSecondary, fontWeight: unread ? 700 : 'normal'}}}
              select={choose}
              sealed={sealed}
              hosted={hosted}
              imageUrl={imageUrl}
              notesPlaceholder={strings.notes}
              subjectPlaceholder={strings.unknown}
              subject={subject}
              messagePlaceholder={`[${strings.sealed}]`}
              message={message}
              action={action}
            />
          </View>
        );
      }}
      keyExtractor={keyExtractor}
    />
  );
});

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
  const {state, actions} = useContent();
  const [, setAdding] = useState(false);
  const theme = useTheme();
  const [alert, setAlert] = useState(false);
  const [leave, setLeave] = useState(null as null | {cardId: string | null; channelId: string});
  const [leaving, setLeaving] = useState(false);
  const [remove, setRemove] = useState(null as null | {channelId: string});
  const [removing, setRemoving] = useState(false);

  const alertParams = {
    title: state.strings.operationFailed,
    prompt: state.strings.tryAgain,
    close: {
      label: state.strings.close,
      action: () => {
        setAlert(false);
      },
    },
  };

  const leaveParams = {
    title: state.strings.leaveChat,
    cancel: {
      label: state.strings.cancel,
      action: () => {
        setLeave(null);
      },
    },
    confirm: {
      label: state.strings.leave,
      action: async () => {
        setLeaving(true);
        try {
          if (leave) {
            await actions.leaveChat(leave.cardId, leave.channelId);
          }
        } catch (err) {
          console.log(err);
          setAlert(true);
        }
        setLeaving(false);
        setLeave(null);
      },
    },
  };

  const removeParams = {
    title: state.strings.deleteChat,
    cancel: {
      label: state.strings.cancel,
      action: () => {
        setRemove(null);
      },
    },
    confirm: {
      label: state.strings.remove,
      action: async () => {
        setRemoving(true);
        try {
          if (remove) {
            await actions.removeChat(remove.channelId);
          }
        } catch (err) {
          console.log(err);
          setAlert(true);
        }
        setRemoving(false);
        setRemove(null);
      },
    },
  };

  const open = useCallback((cardId: string | null, channelId: string) => {
    actions.setFocus(cardId, channelId);
    openConversation();
  }, [actions, openConversation]);

  const select = useCallback((cardId: string | null, channelId: string) => {
    if (share) {
      const {filePath, mimeType} = share;
      actions.setSharing({cardId, channelId, filePath, mimeType});
    }
    open(cardId, channelId);
  }, [share, actions, open]);

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
                contentStyle={styles.inputContent}
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
            {(state.sealSet || state.allowUnsealed || true) && (
              <Button icon="message1" mode="contained" textColor="white" style={styles.newButton} contentStyle={styles.newContent} onPress={createConversation}>
                {state.strings.new}
              </Button>
            )}
          </SafeAreaView>
        </Surface>

        <View style={styles.topics}>
          <View style={{...styles.tabView, ...(allTab ? styles.tabVisible : styles.tabHidden)}}>
            <AllTab
              data={state.filtered}
              theme={theme}
              strings={state.strings}
              more={more}
              setMore={setMore}
              favorite={state.favorite}
              actions={actions}
              open={open}
              setLeave={setLeave}
              setRemove={setRemove}
            />
          </View>
          <View style={{...styles.tabView, ...(unreadTab ? styles.tabVisible : styles.tabHidden)}}>
            <UnreadTab
              data={state.unread}
              theme={theme}
              strings={state.strings}
              more={more}
              setMore={setMore}
              favorite={state.favorite}
              actions={actions}
              open={open}
              setLeave={setLeave}
              setRemove={setRemove}
            />
          </View>
          <View style={{...styles.tabView, ...(favoritesTab ? styles.tabVisible : styles.tabHidden)}}>
            <FavoritesTab
              data={state.favorites}
              theme={theme}
              strings={state.strings}
              more={more}
              setMore={setMore}
              favorite={state.favorite}
              actions={actions}
              open={open}
              setLeave={setLeave}
              setRemove={setRemove}
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
      <Confirm show={alert} params={alertParams} />
      <Confirm show={Boolean(remove)} busy={removing} params={removeParams} />
      <Confirm show={Boolean(leave)} busy={leaving} params={leaveParams} />
    </View>
  );
}
