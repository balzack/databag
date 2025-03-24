import React, { useEffect, useState, useRef } from 'react';
import {Animated, useAnimatedValue, Modal, ScrollView, Pressable, View, FlatList } from 'react-native';
import {styles} from './Conversation.styled';
import {useConversation} from './useConversation.hook';
import {Message} from '../message/Message';
import {Surface, Icon, Text, TextInput, Menu, IconButton, Divider} from 'react-native-paper';
import { ActivityIndicator } from 'react-native-paper';
import { Colors } from '../constants/Colors';
import { Confirm } from '../confirm/Confirm';
import ColorPicker from 'react-native-wheel-color-picker';
import {BlurView} from '@react-native-community/blur';
import ImagePicker from 'react-native-image-crop-picker';
import { ImageFile } from './imageFile/ImageFile';
import { VideoFile } from './videoFile/VideoFile';
import { AudioFile } from './audioFile/AudioFile';
import { BinaryFile } from './binaryFile/BinaryFile';
import DocumentPicker from 'react-native-document-picker';

const SCROLL_THRESHOLD = 16;

export type MediaAsset = {
  encrypted?: { type: string, thumb: string, label: string, extension: string, parts: { blockIv: string, partId: string }[] },
  image?: { thumb: string, full: string },
  audio?: { label: string, full: string },
  video?: { thumb: string, lq: string, hd: string },
  binary?: { label: string, extension: string, data: string }
}

export function Conversation({close, openDetails, wide}: {close: ()=>void, openDetails: ()=>void, wide: boolean}) {
  const { state, actions } = useConversation();
  const [ more, setMore ] = useState(false);
  const [ alert, setAlert ] = useState(false);
  const [ sending, setSending ] = useState(false);
  const [ selected, setSelected ] = useState(null as null | string);
  const [ sizeMenu, setSizeMenu ] = useState(false);
  const [ colorMenu, setColorMenu ] = useState(false);
  const [avoid, setAvoid] = useState(false);
  const thread = useRef();
  const scrolled = useRef(false);
  const contentHeight = useRef(0);
  const contentLead = useRef(null);
  const scrollOffset = useRef(0);
  const busy = useRef(false);
  const scale = useAnimatedValue(0);

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
        setAvoid(false);
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

  const onScroll = (ev) => {
    const { contentOffset } = ev.nativeEvent;
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
    try {
      const { path, mime, size } = await ImagePicker.openPicker({ mediaType: 'photo' });
      actions.addImage(path, mime, size);
    }
    catch (err) {
      console.log(err);
    }
  };

  const addVideo = async () => {
    try {
      const { path, mime } = await ImagePicker.openPicker({ mediaType: 'video' });
      actions.addVideo(path, mime);
    }
    catch (err) {
      console.log(err);
    }
  };

  const addAudio = async () => {
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
      return <ImageFile key={index} path={asset.path} disabled={sending} remove={()=>actions.removeAsset(index)} />;
    } else if (asset.type === 'video') {
      return <VideoFile key={index} path={asset.path} thumbPosition={(position: number) => actions.setThumbPosition(index, position)} disabled={sending} remove={()=>actions.removeAsset(index)} />;
    } else if (asset.type === 'audio') {
      return <AudioFile key={index} path={asset.path} disabled={sending} remove={()=>actions.removeAsset(index)} />;
    } else {
      return <BinaryFile key={index} path={asset.path} disabled={sending} remove={()=>actions.removeAsset(index)} />;
    }
  });

  const containerStyle = state.layout === 'large' ? { ...styles.conversation, ...styles.largeConversation } : styles.conversation;
  const headerStyle = state.layout === 'large' ? { ...styles.header, ...styles.largeHeader, flexDirection: 'row-reverse' } : { ...styles.header, flexDirection: 'row' };
  const padStyle = state.layout === 'large' ? styles.pad : styles.nopad;
  const inputPadStyle = state.layout === 'large' ? styles.pad : styles.indent;
  const offset = state.layout === 'large' ? state.avoid - 64 : state.avoid - 120;
  const disableImage = !state.detailSet || !state.detail?.enableImage;
  const disableVideo = !state.detailSet || !state.detail?.enableVideo;
  const disableAudio = !state.detailSet || !state.detail?.enableAudio;
  const disableBinary = !state.detailSet || !state.detail?.enableBinary;
  const statusStyle = state.layout === 'large' ? { ...styles.status, flexDirection: 'row-reverse' } : { ...styles.status, flexDirection: 'row' };

  return (
    <View style={containerStyle}>
      <View style={headerStyle}>
        <IconButton style={styles.icon} mode="contained" icon={wide ? 'close' : 'arrow-left'} size={28} onPress={onClose} />
        <View style={styles.status} />
        <View style={styles.title}>
         { state.detailSet && state.subject && (
            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.label}>{ state.subject }</Text>
          )}
          { state.detailSet && state.host && !state.subject && state.subjectNames.length === 0 && (
            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.label}>{ state.strings.notes }</Text>
          )}
          { state.detailSet && !state.subject && state.subjectNames.length > 0 && (
            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.label}>{ state.subjectNames.join(', ') }</Text>
          )}
          { state.detailSet && !state.subject && state.unknownContacts > 0 && (
            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.unknown}>{ `, ${state.strings.unknownContact} (${state.unknownContacts})` }</Text>
          )}
        </View>
        <View style={statusStyle}>
          { state.detailSet && !state.access && (
            <Icon source="alert-circle-outline" size={20} color={Colors.offsync} />
          )}
          { state.detailSet && state.host && (
            <Icon source="home-outline" size={22} />
          )}
          { state.detailSet && !state.host && (
            <Icon source="server" size={20} />
          )}
          { state.detailSet && state.sealed && (
            <Icon source="shield-outline" size={20} />
          )}
        </View>
        <IconButton style={styles.icon} mode="contained" icon={state.layout === 'large' ? 'cog-transfer-outline' : 'dots-vertical'} size={28} onPress={openDetails} />
      </View>
      <View style={padStyle}>
        <Divider style={styles.topBorder} bold={true} />
      </View>
      <View style={styles.thread}>
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
          contentContainerStyle={styles.messages}
          renderItem={({item}) => {
            const { host } = state;
            const card = state.cards.get(item.guid) || null;
            const profile = state.profile?.guid === item.guid ? state.profile : null;
            return (
              <Message
                topic={item}
                card={card}
                profile={profile}
                host={host}
                select={(id)=>setSelected(id)}
                selected={selected}
              />
            );
          }}
          keyExtractor={topic => (topic.topicId)}
        />
        { state.loaded && state.topics.length === 0 && (
          <Text style={styles.empty}>{state.strings.noMessages}</Text>
        )}
        { !state.loaded && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        )}
        { state.loaded && more && (
          <View style={styles.more}>
            <ActivityIndicator />
          </View>
        )}
      </View>
      <View style={padStyle}>
        <Divider style={styles.border} bold={true}>
          { sending && (
            <View style={{ ...styles.progress, width: `${state.progress}%` }} />
          )}
        </Divider>
      </View>
      <Confirm show={alert} params={alertParams} />
      <View style={styles.add}>
        <Animated.View style={[{},{height: scale}]}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.carousel} contentContainerStyle={styles.assets}>
            { media }
          </ScrollView>
        </Animated.View>
        <View style={inputPadStyle}>
          <TextInput multiline={true} mode="outlined" style={{ ...styles.message, fontSize: state.textSize }}
              blurOnSubmit={true} onSubmitEditing={sendMessage} returnKeyType="send"
              onFocus={()=>setAvoid(true)} onBlur={()=>setAvoid(false)} editable={!sending}
              textColor={state.textColorSet ? state.textColor : undefined} outlineColor="transparent" activeOutlineColor="transparent"spellcheck={false}
              autoComplete="off" autoCapitalize="none" autoCorrect={false} placeholder={state.strings.newMessage} placeholderTextColor={state.textColorSet ? state.textColor : undefined}
              cursorColor={state.textColorSet ? state.textColor : undefined} value={state.message} onChangeText={value => actions.setMessage(value)} />

          { avoid && (<View style={{ ...styles.avoid, height: offset }} />) }

          <View style={styles.controls}>
            { !disableImage && (
              <Pressable style={styles.control} onPress={addImage}><Surface style={styles.surface} elevation={2} mode="flat"><Icon style={styles.button} source="camera" size={24} color={Colors.primary} /></Surface></Pressable>
            )}
            { !disableVideo && (
              <Pressable style={styles.control} onPress={addVideo}><Surface style={styles.surface} elevation={2} mode="flat"><Icon style={styles.button} source="video-outline" size={24} color={Colors.primary} /></Surface></Pressable>
            )}
            { !disableAudio && (
              <Pressable style={styles.control} onPress={addAudio}><Surface style={styles.surface} elevation={2} mode="flat"><Icon style={styles.button} source="volume-high" size={24} color={Colors.primary} /></Surface></Pressable>
            )}
            { !disableBinary && (
              <Pressable style={styles.control} onPress={addBinary}><Surface style={styles.surface} elevation={2} mode="flat"><Icon style={styles.button} source="file-outline" size={24} color={Colors.primary} /></Surface></Pressable>
            )}
            { (!disableImage || !disableVideo || !disableAudio || !disableBinary) && (
              <Divider style={styles.separator} />
            )}
            <Pressable style={styles.control} onPress={()=>setColorMenu(true)}>
              <Surface style={styles.surface} elevation={2} mode="flat">
                <Icon style={styles.button} source="format-color-text" size={24} color={Colors.primary} />
              </Surface>
            </Pressable>

            <Menu
              visible={sizeMenu}
              onDismiss={()=>setSizeMenu(false)}
              anchor={(
                <Pressable style={styles.control} onPress={()=>setSizeMenu(true)}>
                  <Surface style={styles.surface} elevation={2} mode="flat">
                    <Icon style={styles.button} source="format-size" size={24} color={Colors.primary} />
                  </Surface>
                </Pressable>
              )}>
              <Menu.Item onPress={() => { actions.setTextSize(12); setSizeMenu(false); }} title={state.strings.textSmall} />
              <Menu.Item onPress={() => { actions.setTextSize(16); setSizeMenu(false); }} title={state.strings.textMedium} />
              <Menu.Item onPress={() => { actions.setTextSize(20); setSizeMenu(false); }} title={state.strings.textLarge} />
            </Menu>

            <View style={styles.end}>
              <Pressable style={styles.control} onPress={sendMessage}>
                <Surface style={styles.surface} elevation={2} mode="flat">
                  { sending && (
                    <ActivityIndicator size="small" />
                  )}
                  { !sending && state.access && state.validShare && (state.message || state.assets.length !== 0) && (
                    <Icon style={styles.button} source="send" size={24} color={Colors.primary} />
                  )}
                  { !sending && (!state.access || !state.validShare || (!state.message && state.assets.length === 0)) && (
                    <Icon style={styles.button} source="send" size={24} color={Colors.placeholder} />
                  )}
                </Surface>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={colorMenu} onRequestClose={()=>setColorMenu(false)}>
        <View style={styles.modal}>
          <Pressable style={styles.blur} onPress={()=>setColorMenu(false)}>
            <BlurView style={styles.blur} blurType="dark" blurAmount={6} reducedTransparencyFallbackColor="dark" />
          </Pressable>
          <Surface elevation={2} style={styles.colorArea}>
            <ColorPicker color={state.textColorSet ? state.textColor : undefined} onColorChange={actions.setTextColor} onColorChangeComplete={actions.setTextColor} swatched={false} />
            <IconButton style={styles.closeIcon} icon="close" compact="true" mode="contained" size={20} onPress={()=>setColorMenu(false)} />
          </Surface>
        </View>
      </Modal>
    </View>
  );
}
