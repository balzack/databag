import React, {useEffect, useState, useRef} from 'react';
import {Animated, useAnimatedValue, Keyboard, KeyboardEvent, TextInput as RawInput, Modal, ScrollView, Pressable, View, FlatList} from 'react-native';
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

export function ConversationSmall({close, openDetails}: {close: () => void; openDetails: () => void}) {
  const {state, actions} = useConversation();
  const [more, setMore] = useState(false);
  const [alert, setAlert] = useState(false);
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
    };
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
    actions.close();
    close();
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
    }
  };

  const addVideo = async () => {
    setOptions(false);
    try {
      const {path, mime} = await ImagePicker.openPicker({mediaType: 'video'});
      actions.addVideo(path, mime);
    } catch (err) {
      console.log(err);
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

  const disableImage = !state.detailSet || !state.detail?.enableImage;
  const disableVideo = !state.detailSet || !state.detail?.enableVideo;
  const disableAudio = !state.detailSet || !state.detail?.enableAudio;
  const disableBinary = !state.detailSet || !state.detail?.enableBinary;

  return (
    <View style={styles.component}>
      <Surface elevation={1} mode="flat" style={styles.content}>
        <Surface elevation={9} mode="flat" style={styles.surfaceMaxWidth}>
          <SafeAreaView edges={['left', 'right']} style={styles.safeAreaNav}>
            <Pressable style={styles.navIcon} onPress={onClose}>
              <Icon size={24} source="left" color={'white'} />
            </Pressable>
            <View style={styles.title}>
              {state.detailSet && state.subject && (
                <Text numberOfLines={1} style={styles.smLabel}>
                  {state.subject}
                </Text>
              )}
              {state.detailSet && state.host && !state.subject && state.subjectNames.length === 0 && (
                <Text numberOfLines={1} style={styles.smLabel}>
                  {state.strings.notes}
                </Text>
              )}
              {state.detailSet && !state.subject && state.subjectNames.length > 0 && (
                <Text numberOfLines={1} style={styles.smLabel}>
                  {state.subjectNames.join(', ')}
                </Text>
              )}
              {state.detailSet && !state.subject && state.unknownContacts > 0 && (
                <Text numberOfLines={1} style={styles.smUnknown}>{`, ${state.strings.unknownContact} (${state.unknownContacts})`}</Text>
              )}
            </View>
            <Pressable onPress={openDetails} style={styles.navIcon}>
              <Icon size={24} source="cog-outline" color={'white'} />
            </Pressable>
          </SafeAreaView>
        </Surface>

        <SafeAreaView style={styles.thread} edges={['left', 'right']}>
          <FlatList
            style={styles.messageList}
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
              return <Message small={true} topic={item} card={card} profile={profile} host={host} select={id => setSelected(id)} selected={selected} />;
            }}
            keyExtractor={topic => topic.topicId}
          />
          {state.loaded && state.topics.length === 0 && <Text style={styles.empty}>{state.strings.noMessages}</Text>}
          {!state.loaded && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" />
            </View>
          )}
          {state.loaded && more && (
            <View style={styles.more}>
              <ActivityIndicator />
            </View>
          )}
          <View style={styles.canvas}>
            <Surface style={styles.frame} mode="flat" elevation={0}>
              <Animated.View style={[{}, {height: scale}]}>
                {state.assets.length > 0 && <View style={styles.assetSpacer} />}
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.carousel} contentContainerStyle={styles.assets}>
                  {media}
                </ScrollView>
              </Animated.View>
              <View style={styles.compose}>
                <Menu
                  key="actions"
                  visible={options}
                  onDismiss={() => setOptions(false)}
                  anchorPosition="top"
                  anchor={<IconButton style={styles.options} mode="contained" iconColor={theme.colors.onSurface} icon="plus-square" size={20} onPress={() => setOptions(true)} />}>
                  {!disableImage && (
                    <Pressable style={styles.option} onPress={addImage}>
                      <Icon style={styles.button} source="camera" size={24} color={Colors.primary} />
                      <Text>{state.strings.attachImage}</Text>
                    </Pressable>
                  )}
                  {!disableVideo && (
                    <Pressable style={styles.option} onPress={addVideo}>
                      <Icon style={styles.button} source="video-outline" size={24} color={Colors.primary} />
                      <Text>{state.strings.attachVideo}</Text>
                    </Pressable>
                  )}
                  {!disableAudio && (
                    <Pressable style={styles.option} onPress={addAudio}>
                      <Icon style={styles.button} source="volume-high" size={24} color={Colors.primary} />
                      <Text>{state.strings.attachAudio}</Text>
                    </Pressable>
                  )}
                  {!disableBinary && (
                    <Pressable style={styles.option} onPress={addBinary}>
                      <Icon style={styles.button} source="file-outline" size={24} color={Colors.primary} />
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
                    <Icon style={styles.button} source="format-color-text" size={24} color={Colors.primary} />
                    <Text>{state.strings.textColor}</Text>
                  </Pressable>
                  <Pressable
                    style={styles.option}
                    onPress={() => {
                      setOptions(false);
                      setSizeModal(true);
                    }}>
                    <Icon style={styles.button} source="format-size" size={24} color={Colors.primary} />
                    <Text>{state.strings.textSize}</Text>
                  </Pressable>
                </Menu>
                <RawInput
                  multiline={true}
                  mode="outlined"
                  dense={true}
                  style={{color: state.textColorSet ? state.textColor : theme.colors.onSurface, fontSize: state.textSize, ...styles.textInput}}
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
                <IconButton
                  style={styles.send}
                  loading={sending}
                  mode="contained"
                  iconColor={!state.access || !state.validShare || (!state.message && state.assets.length === 0) ? theme.colors.secondary : theme.colors.onSurface}
                  icon="send"
                  size={20}
                  onPress={sendMessage}
                />
              </View>
            </Surface>
          </View>
          <View style={{...styles.keyboardSpacer, height: keyboardHeight - 96}} />
        </SafeAreaView>
      </Surface>
      <Confirm show={alert} params={alertParams} />
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={colorMenu} onRequestClose={() => setColorMenu(false)}>
        <View style={styles.modal}>
          <Pressable style={styles.blur} onPress={() => setColorMenu(false)}>
            <BlurView style={styles.blur} blurType="dark" blurAmount={6} reducedTransparencyFallbackColor="dark" />
          </Pressable>
          <Surface elevation={2} style={styles.colorArea}>
            <ColorPicker color={state.textColorSet ? state.textColor : undefined} onColorChange={actions.setTextColor} onColorChangeComplete={actions.setTextColor} swatched={false} />
            <IconButton style={styles.closeIcon} icon="close" compact="true" mode="contained" size={20} onPress={() => setColorMenu(false)} />
          </Surface>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={sizeModal} onRequestClose={() => setSizeModal(false)}>
        <View style={styles.modal}>
          <Pressable style={styles.blur} onPress={() => setSizeModal(false)}>
            <BlurView style={styles.blur} blurType="dark" blurAmount={6} reducedTransparencyFallbackSize="dark" />
          </Pressable>
          <Surface elevation={2} style={styles.sizeArea}>
            <IconButton style={styles.closeIcon} icon="close" compact="true" mode="contained" size={20} onPress={() => setSizeModal(false)} />
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
          </Surface>
        </View>
      </Modal>
    </View>
  );
}
