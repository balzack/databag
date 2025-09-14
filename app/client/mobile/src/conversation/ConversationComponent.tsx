import React, {useEffect, useState, useRef} from 'react';
import {Animated, useAnimatedValue, Platform, Keyboard, KeyboardEvent, TextInput as RawInput, Modal, ScrollView, Pressable, View, FlatList} from 'react-native';
import {styles} from './Conversation.styled';
import {useConversation} from './useConversation.hook';
import {Message} from '../message/Message';
import {Button, Surface, Icon, Text, Menu, IconButton, useTheme, Divider} from 'react-native-paper';
import {ActivityIndicator} from 'react-native-paper';
import {Colors} from '../constants/Colors';
import {Confirm} from '../confirm/Confirm';
import ColorPicker from 'react-native-wheel-color-picker';
import {BlurView} from '@react-native-community/blur';
import ImagePicker from 'react-native-image-crop-picker';
import {ImageFile} from './imageFile/ImageFile';
import {VideoFile} from './videoFile/VideoFile';
import {AudioFile} from './audioFile/AudioFile';
import {BinaryFile} from './binaryFile/BinaryFile';
import DocumentPicker from 'react-native-document-picker';
import {SafeAreaView} from 'react-native-safe-area-context';

const SCROLL_THRESHOLD = 16;

export type MediaAsset = {
  encrypted?: {type: string; thumb: string; label: string; extension: string; parts: {blockIv: string; partId: string}[]};
  image?: {thumb: string; full: string};
  audio?: {label: string; full: string};
  video?: {thumb: string; lq: string; hd: string};
  binary?: {label: string; extension: string; data: string};
};

export function ConversationComponent({layout, close, openDetails}: {layotu: string; close: () => void; openDetails: () => void}) {
  const {state, actions} = useConversation();
  const [more, setMore] = useState(false);
  const [alert, setAlert] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [sending, setSending] = useState(false);
  const [selected, setSelected] = useState(null as null | string);
  const [colorMenu, setColorMenu] = useState(false);
  const [sizeModal, setSizeModal] = useState(false);
  const thread = useRef();
  const scrolled = useRef(false);
  const contentHeight = useRef(0);
  const contentLead = useRef(null);
  const scrollOffset = useRef(0);
  const busy = useRef(false);
  const scale = useAnimatedValue(0);
  const [options, setOptions] = useState(false);
  const theme = useTheme();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [focused, setFocused] = useState(false);

  function onKeyboardShow(event: KeyboardEvent) {
    setKeyboardHeight(event.endCoordinates.height);
  }

  function onKeyboardHide() {
    setKeyboardHeight(0);
  }

  useEffect(() => {
    const onShow = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    const onHide = Keyboard.addListener('keyboardDidHide', onKeyboardHide);

    return () => {
      onShow.remove();
      onHide.remove();
      actions.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alertParams = {
    title: state.strings.operationFailed,
    prompt: state.strings.tryAgain,
    cancel: {
      label: state.strings.close,
      action: () => {
        setAlert(false);
      },
    },
  };

  const errParams = {
    title: state.strings.operationFailed,
    prompt: state.strings.appPermission,
    close: {
      label: state.strings.close,
      action: () => {
        setMediaError(false);
      },
    },
  };

  useEffect(() => {
    if (state.assets.length > 0) {
      Animated.timing(scale, {
        toValue: 80,
        duration: 100,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(scale, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.assets]);

  const sendMessage = async () => {
    if (!busy.current && state.access && (state.message || state.assets.length > 0)) {
      busy.current = true;
      setSending(true);
      try {
        await actions.send();
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setSending(false);
      busy.current = false;
    }
  };

  const loadMore = async () => {
    if (!more) {
      setMore(true);
      await actions.more();
      setMore(false);
    }
  };

  const onClose = () => {
    close();

    setTimeout(() => {
      actions.close();
    }, 250);
  };

  const onContent = (width, height) => {
    const currentLead = state.topics.length > 0 ? state.topics[0].topicId : null;
    if (scrolled.current) {
      if (currentLead !== contentLead.current) {
        const offset = scrollOffset.current + (height - contentHeight.current);
        const animated = false;
        thread.current.scrollToOffset({offset, animated});
      }
    }
    contentLead.current = currentLead;
    contentHeight.current = height;
  };

  const onScroll = ev => {
    const {contentOffset} = ev.nativeEvent;
    const offset = contentOffset.y;
    if (offset > scrollOffset.current) {
      if (offset > SCROLL_THRESHOLD) {
        scrolled.current = true;
      }
    } else {
      if (offset < SCROLL_THRESHOLD) {
        scrolled.current = false;
      }
    }
    scrollOffset.current = offset;
  };

  const addImage = async () => {
    setOptions(false);
    try {
      const {path, mime, size} = await ImagePicker.openPicker({mediaType: 'photo'});
      actions.addImage(path, mime, size);
    } catch (err) {
      console.log(err);
      if (err.message === 'User did not grant library permission.') {
        setMediaError(true);
      }
    }
  };

  const addVideo = async () => {
    setOptions(false);
    try {
      const {path, mime} = await ImagePicker.openPicker({mediaType: 'video'});
      actions.addVideo(path, mime);
    } catch (err) {
      console.log(err);
      if (err.message === 'User did not grant library permission.') {
        setMediaError(true);
      }
    }
  };

  const addAudio = async () => {
    setOptions(false);
    try {
      const audio = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: DocumentPicker.types.audio,
      });
      actions.addAudio(audio.fileCopyUri, audio.name);
    } catch (err) {
      console.log(err);
      if (err.message === 'User did not grant library permission.') {
        setMediaError(true);
      }
    }
  };

  const addBinary = async () => {
    setOptions(false);
    try {
      const binary = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: DocumentPicker.types.allFiles,
      });
      actions.addBinary(binary.fileCopyUri, binary.name);
    } catch (err) {
      console.log(err);
      if (err.message === 'User did not grant library permission.') {
        setMediaError(true);
      }
    }
  };

  const media = state.assets.map((asset, index) => {
    if (asset.type === 'image') {
      return <ImageFile key={index} path={asset.path} disabled={sending} remove={() => actions.removeAsset(index)} />;
    } else if (asset.type === 'video') {
      return <VideoFile key={index} path={asset.path} thumbPosition={(position: number) => actions.setThumbPosition(index, position)} disabled={sending} remove={() => actions.removeAsset(index)} />;
    } else if (asset.type === 'audio') {
      return <AudioFile key={index} path={asset.path} disabled={sending} remove={() => actions.removeAsset(index)} />;
    } else {
      return <BinaryFile key={index} path={asset.path} disabled={sending} remove={() => actions.removeAsset(index)} />;
    }
  });

  const offset = state.keyboardOffset + keyboardHeight - (Platform.OS === 'ios' && layout === 'large' ? 24 : Platform.OS === 'ios' ? 96 : 80)
  const disableImage = !state.detailSet || !state.detail?.enableImage;
  const disableVideo = !state.detailSet || !state.detail?.enableVideo;
  const disableAudio = !state.detailSet || !state.detail?.enableAudio;
  const disableBinary = !state.detailSet || !state.detail?.enableBinary;

  return (
    <View style={styles.component}>
      <Surface elevation={2} mode="flat" style={{ ...styles.content, paddingBottom: layout === 'large' ? 0 : 96 }}>
        <Surface elevation={layout === 'large' ? 2 : 9} mode="flat" style={styles.surfaceMaxWidth}>
          <SafeAreaView edges={['left', 'right']} style={layout === 'large' ? { ...styles.safeAreaHeader, borderColor: theme.colors.elevation.level9 } : styles.safeAreaNav}>
            <Pressable style={styles.navIcon} onPress={onClose}>
              { layout === 'large' && (
                <Icon size={32} source="close" />
              )}
              { layout !== 'large' && (
                <Icon size={32} source="left" color={'white'} />
              )}
            </Pressable>
            <View style={{ ...styles.title, opacity: state.showMessages ? 1 : 0 }}>
              {state.detailSet && state.subject && (
                <Text numberOfLines={1} style={{ ...styles.smLabel, color: layout !== 'large' ? 'white' : theme.colors.onSurface }}>
                  {state.subject}
                </Text>
              )}
              {state.detailSet && state.host && !state.subject && state.subjectNames.length === 0 && (
                <Text numberOfLines={1} style={{ ...styles.smLabel, color: layout !== 'large' ? 'white' : theme.colors.onSurface }}>
                  {state.strings.notes}
                </Text>
              )}
              {state.detailSet && !state.subject && state.subjectNames.length > 0 && (
                <Text numberOfLines={1} style={{ ...styles.smLabel, color: layout !== 'large' ? 'white' : theme.colors.onSurface }}>
                  {state.subjectNames.join(', ')}
                </Text>
              )}
              {state.detailSet && !state.subject && state.unknownContacts > 0 && (
                <Text numberOfLines={1} style={{ ...styles.smUnknown, color: layout !== 'large' ? 'white' : undefined }}>{`, ${state.strings.unknownContact} (${state.unknownContacts})`}</Text>
              )}
            </View>
            {state.offsync && (
              <Icon size={24} source="warning" color={theme.colors.error} />
            )}
            <Pressable onPress={openDetails} style={styles.navIcon}>
              <Icon size={28} source="gear-six" color={layout !== 'large' ? 'white' : undefined} />
            </Pressable>
          </SafeAreaView>
        </Surface>

        <SafeAreaView style={styles.thread} edges={['left', 'right']}>
          <FlatList
            style={{...styles.messageList, opacity: state.showMessages ? 1 : 0}}
            inverted
            ref={thread}
            onScroll={onScroll}
            data={state.topics}
            initialNumToRender={32}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={onContent}
            onEndReached={loadMore}
            onEndReachedThreshold={0}
            contentContainerStyle={styles.smMessages}
            renderItem={({item}) => {
              const {host} = state;
              const card = state.cards.get(item.guid) || null;
              const profile = state.profile?.guid === item.guid ? state.profile : null;
              return <Message topic={item} card={card} profile={profile} host={host} select={id => setSelected(id)} selected={selected} />;
            }}
            keyExtractor={topic => topic.topicId}
          />
          {state.showMessages && state.topics.length === 0 && <Text style={styles.empty}>{state.strings.noMessages}</Text>}
          {!state.showMessages && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" />
            </View>
          )}
          {state.showMessages && more && (
            <View style={styles.more}>
              <ActivityIndicator />
            </View>
          )}
          <Surface style={styles.canvas} mode="flat" elevation={2}>
            <Surface style={{...styles.frame, borderColor: theme.colors.outlineVariant}} mode="flat" elevation={0}>
              <Animated.View style={[{}, {height: scale}]}>
                {state.assets.length > 0 && <View style={styles.assetSpacer} />}
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.smCarousel} contentContainerStyle={styles.assets}>
                  {media}
                </ScrollView>
              </Animated.View>
              <View style={styles.compose}>
                <Menu
                  mode={Platform.OS === 'ios' ? 'flat' : 'elevated'}
                  elevation={Platform.OS === 'ios' ? 8 : 2}
                  contentStyle={styles.menuContent}
                  visible={options}
                  onDismiss={() => setOptions(false)}
                  anchorPosition="top"
                  anchor={<IconButton style={styles.options} mode="contained" iconColor={theme.colors.onSurface} icon="plus-square" size={24} onPress={() => setOptions(true)} />}>
                  {Platform.OS === 'ios' && (
                    <Surface elevation={11} style={styles.menu}>
                      <BlurView style={styles.blur} blurType={theme.colors.name} blurAmount={8} reducedTransparencyFallbackColor={theme.colors.name} />
                      {!disableImage && (
                        <Pressable style={styles.option} onPress={addImage}>
                          <Icon style={styles.button} source="camera" size={28} color={theme.colors.primary} />
                          <Text>{state.strings.attachImage}</Text>
                        </Pressable>
                      )}
                      {!disableVideo && (
                        <Pressable style={styles.option} onPress={addVideo}>
                          <Icon style={styles.button} source="video-outline" size={28} color={theme.colors.primary} />
                          <Text>{state.strings.attachVideo}</Text>
                        </Pressable>
                      )}
                      {!disableAudio && (
                        <Pressable style={styles.option} onPress={addAudio}>
                          <Icon style={styles.button} source="volume-high" size={28} color={theme.colors.primary} />
                          <Text>{state.strings.attachAudio}</Text>
                        </Pressable>
                      )}
                      {!disableBinary && (
                        <Pressable style={styles.option} onPress={addBinary}>
                          <Icon style={styles.button} source="file-outline" size={28} color={theme.colors.primary} />
                          <Text>{state.strings.attachFile}</Text>
                        </Pressable>
                      )}
                      {(!disableImage || !disableVideo || !disableAudio || !disableBinary) && <Divider />}
                      <Pressable
                        style={styles.option}
                        onPress={() => {
                          setOptions(false);
                          setColorMenu(true);
                        }}>
                        <Icon style={styles.button} source="format-color-text" size={28} color={theme.colors.primary} />
                        <Text>{state.strings.textColor}</Text>
                      </Pressable>
                      <Pressable
                        style={styles.option}
                        onPress={() => {
                          setOptions(false);
                          setSizeModal(true);
                        }}>
                        <Icon style={styles.button} source="format-size" size={28} color={theme.colors.primary} />
                        <Text>{state.strings.textSize}</Text>
                      </Pressable>
                    </Surface>
                  )}
                  {Platform.OS !== 'ios' && !disableImage && <Menu.Item key="image" onPress={addImage} leadingIcon="camera" title={state.strings.attachImage} />}
                  {Platform.OS !== 'ios' && !disableVideo && <Menu.Item key="video" onPress={addVideo} leadingIcon="video-outline" title={state.strings.attachVideo} />}
                  {Platform.OS !== 'ios' && !disableAudio && <Menu.Item key="audio" onPress={addAudio} leadingIcon="volume-high" title={state.strings.attachAudio} />}
                  {Platform.OS !== 'ios' && !disableBinary && <Menu.Item key="binary" onPress={addBinary} leadingIcon="file-outline" title={state.strings.attachFile} />}
                  {Platform.OS !== 'ios' && (!disableImage || !disableVideo || !disableAudio || !disableBinary) && <Divider />}
                  {Platform.OS !== 'ios' && (
                    <Menu.Item
                      key="color"
                      onPress={() => {
                        setOptions(false);
                        setColorMenu(true);
                      }}
                      leadingIcon="format-color-text"
                      title={state.strings.textColor}
                    />
                  )}
                  {Platform.OS !== 'ios' && (
                    <Menu.Item
                      key="size"
                      onPress={() => {
                        setOptions(false);
                        setSizeModal(true);
                      }}
                      leadingIcon="format-size"
                      title={state.strings.textSize}
                    />
                  )}
                </Menu>
                <View style={styles.textInput}>
                  <RawInput
                    multiline={true}
                    mode="outlined"
                    dense={true}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{color: state.textColorSet ? state.textColor : theme.colors.onSurface, fontSize: state.textSize}}
                    outlineColor="transparent"
                    activeOutlineColor={Colors.placeholder}
                    spellcheck={false}
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder={state.strings.newMessage}
                    placeholderTextColor={state.textColorSet ? state.textColor : theme.colors.tertiery}
                    selectionColor={state.textColorSet ? state.textColor : theme.colors.onSurface}
                    value={state.message}
                    onChangeText={value => actions.setMessage(value)}
                  />
                </View>
                <IconButton
                  style={styles.send}
                  loading={sending}
                  mode="contained"
                  iconColor={!state.access || !state.validShare || (!state.message && state.assets.length === 0) ? theme.colors.secondary : theme.colors.onSurface}
                  icon="send"
                  size={24}
                  onPress={sendMessage}
                />
              </View>
            </Surface>
          </Surface>
          { focused && (
            <Surface style={{...styles.keyboardSpacer, height: offset}} mode="flat" elevation={2} />
          )}
        </SafeAreaView>
      </Surface>
      <Confirm show={alert} params={alertParams} />
      <Confirm show={mediaError} params={errParams} />
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={colorMenu} onRequestClose={() => setColorMenu(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType={theme.colors.name} blurAmount={4} reducedTransparencyFallbackColor="dark" />
          <Surface elevation={2} style={{...styles.colorSurface, backgroundColor: theme.colors.elevation.level12}}>
            <View style={styles.modalContent}>
              <View style={styles.modalArea}>
                <ColorPicker color={state.textColorSet ? state.textColor : undefined} onColorChange={actions.setTextColor} onColorChangeComplete={actions.setTextColor} swatched={false} />
                <Button style={styles.close} mode="text" textColor={theme.colors.onSecondary} onPress={() => setColorMenu(false)}>
                  {state.strings.close}
                </Button>
              </View>
            </View>
          </Surface>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={sizeModal} onRequestClose={() => setSizeModal(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType={theme.colors.name} blurAmount={4} reducedTransparencyFallbackColor="dark" />
          <Surface elevation={2} style={{...styles.sizeSurface, backgroundColor: theme.colors.elevation.level12}}>
            <View style={styles.modalContent}>
              <Button
                mode="contained"
                style={({pressed}) => [styles.sizeOption, pressed && styles.sizeOptionPressed]}
                onPress={() => {
                  actions.setTextSize(20);
                  setSizeModal(false);
                }}>
                <Text style={styles.sizeLargeText}>{state.strings.textLarge}</Text>
              </Button>
              <Button
                mode="contained"
                style={({pressed}) => [styles.sizeOption, pressed && styles.sizeOptionPressed]}
                onPress={() => {
                  actions.setTextSize(16);
                  setSizeModal(false);
                }}>
                <Text style={styles.sizeMediumText}>{state.strings.textMedium}</Text>
              </Button>
              <Button
                mode="contained"
                style={({pressed}) => [styles.sizeOption, pressed && styles.sizeOptionPressed]}
                onPress={() => {
                  actions.setTextSize(12);
                  setSizeModal(false);
                }}>
                <Text style={styles.sizeSmallText}>{state.strings.textSmall}</Text>
              </Button>
              <Button style={styles.close} mode="text" textColor={theme.colors.onSecondary} onPress={() => setSizeModal(false)}>
                {state.strings.close}
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>
    </View>
  );
}
