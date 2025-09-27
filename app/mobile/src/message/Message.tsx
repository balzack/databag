import React, {useRef, useEffect, useState} from 'react';
import {avatar} from '../constants/Icons';
import {Pressable, Platform, Linking, ScrollView, View, Image, Modal} from 'react-native';
import {Menu, Icon, Text, useTheme, TextInput, IconButton, Button, Surface} from 'react-native-paper';
import {Topic, Card, Profile} from 'databag-client-sdk';
import {ImageAsset} from './imageAsset/ImageAsset';
import {AudioAsset} from './audioAsset/AudioAsset';
import {VideoAsset} from './videoAsset/VideoAsset';
import {BinaryAsset} from './binaryAsset/BinaryAsset';
import {useMessage} from './useMessage.hook';
import {styles} from './Message.styled';
import {MediaAsset} from '../conversation/Conversation';
import {Confirm} from '../confirm/Confirm';
import {Shimmer} from './shimmer/Shimmer';
import {BlurView} from '../utils/BlurView';
import {sanitizeUrl} from '@braintree/sanitize-url';

export function Message({topic, card, profile, host, select}: {topic: Topic; card: Card | null; profile: Profile | null; host: boolean; select: (id: null | string) => void}) {
  const {state, actions} = useMessage();
  const {locked, data, created, topicId, status, transform} = topic;
  const {name, handle, node} = profile || card || {name: null, handle: null, node: null};
  const {text, textColor, textSize, assets} = data || {text: null, textColor: null, textSize: null};
  const fontSize = textSize ? textSize + state.fontSize : 16 + state.fontSize;
  const textStyle = textColor ? {fontSize, color: textColor} : {fontSize};
  const logoUrl = profile ? profile.imageUrl : card ? card.imageUrl : avatar;
  const timestamp = actions.formatDetailedTimestamp(created).replace(' at ', ' ');
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmParams, setConfirmParams] = useState({});
  const [confirmShow, setConfirmShow] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [reporting, setReporting] = useState(false);
  const loadedCount = useRef(0);
  const [showAsset, setShowAsset] = useState(false);
  const [message, setMessage] = useState<React.ReactNode[]>([]);
  const fontStyle = styles.linkText;
  const [options, setOptions] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setTimeout(() => setShowAsset(true), 2000);
  }, []);

  useEffect(() => {
    setEditText(text);
  }, [text]);

  useEffect(() => {
    const urlPattern = new RegExp('(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)');
    const hostPattern = new RegExp('^https?:\\/\\/', 'i');
    const dotPattern = new RegExp('^.*\\.\\..*$');

    let plain = '';
    let clickable = [];
    const parsed = !text ? '' : text.split(' ');

    if (parsed?.length > 0) {
      const words = parsed as string[];
      words.forEach((word, index) => {
        if (urlPattern.test(word) && !dotPattern.test(word)) {
          clickable.push(
            <Text key={index} style={textStyle}>
              {plain}
            </Text>,
          );
          plain = '';
          const url = hostPattern.test(word) ? word : `https://${word}`;
          clickable.push(
            <Text key={'link-' + index} onPress={() => Linking.openURL(sanitizeUrl(url))} style={fontStyle}>
              {sanitizeUrl(word) + ' '}
            </Text>,
          );
        } else {
          plain += `${word} `;
        }
      });
    }

    if (plain) {
      clickable.push(
        <Text key={parsed.length} style={textStyle}>
          {plain}
        </Text>,
      );
    }
    setMessage(clickable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, locked, state.fontSize]);

  const loaded = () => {
    loadedCount.current += 1;
    if (loadedCount.current >= assets.length) {
      setShowAsset(true);
    }
  };

  const edit = () => {
    setOptions(false);
    setEditing(true);
    select(null);
  };

  const save = async () => {
    setSaving(true);
    try {
      await actions.saveSubject(topic.topicId, topic.sealed, {...topic.data, text: editText});
    } catch (err) {
      console.log(err);
      showError();
    }
    setSaving(false);
    setEditing(false);
  };

  const block = () => {
    setOptions(false);
    setConfirmParams({
      title: state.strings.blockMessage,
      cancel: {
        label: state.strings.cancel,
        action: () => setConfirmShow(false),
      },
      confirm: {
        label: state.strings.block,
        action: async () => {
          if (!blocking) {
            setBlocking(true);
            try {
              await actions.block(topicId);
              setConfirmShow(false);
            } catch (err) {
              console.log(err);
              showError();
            }
            setBlocking(false);
          }
        },
      },
    });
    setConfirmShow(true);
  };

  const report = () => {
    setOptions(false);
    setConfirmParams({
      title: state.strings.reportMessage,
      cancel: {
        label: state.strings.cancel,
        action: () => setConfirmShow(false),
      },
      confirm: {
        label: state.strings.report,
        action: async () => {
          if (!reporting) {
            setReporting(true);
            try {
              await actions.flag(topicId);
              setConfirmShow(false);
            } catch (err) {
              console.log(err);
              showError();
            }
            setReporting(false);
          }
        },
      },
    });
    setConfirmShow(true);
  };

  const remove = () => {
    setOptions(false);
    setConfirmParams({
      title: state.strings.removeMessage,
      cancel: {
        label: state.strings.cancel,
        action: () => setConfirmShow(false),
      },
      confirm: {
        label: state.strings.remove,
        action: async () => {
          if (!removing) {
            setRemoving(true);
            try {
              await actions.remove(topicId);
            } catch (err) {
              console.log(err);
              showError();
            }
            setRemoving(false);
          }
        },
      },
    });
    setConfirmShow(true);
  };

  const showError = () => {
    setConfirmParams({
      title: state.strings.operationFailed,
      prompt: state.strings.tryAgain,
      close: {
        label: state.strings.close,
        action: () => setConfirmShow(false),
      },
    });
    setConfirmShow(true);
  };

  const media = !assets
    ? []
    : assets.map((asset: MediaAsset, index: number) => {
        if (asset.image || asset.encrypted?.type === 'image') {
          return <ImageAsset key={index} topicId={topicId} asset={asset as MediaAsset} loaded={loaded} show={showAsset} />;
        } else if (asset.audio || asset.encrypted?.type === 'audio') {
          return <AudioAsset key={index} topicId={topicId} asset={asset as MediaAsset} loaded={loaded} show={showAsset} />;
        } else if (asset.video || asset.encrypted?.type === 'video') {
          return <VideoAsset key={index} topicId={topicId} asset={asset as MediaAsset} loaded={loaded} show={showAsset} />;
        } else if (asset.binary || asset.encrypted?.type === 'binary') {
          return <BinaryAsset key={index} topicId={topicId} asset={asset as MediaAsset} loaded={loaded} show={showAsset} />;
        } else {
          return <View key={index} />;
        }
      });

  return (
    <View style={styles.message}>
      <View style={styles.component}>
        <View style={styles.headerContainer}>
          {name && <Text numberOfLines={1} style={styles.labelName}>{name}</Text>}
          {!name && handle && <Text numberOfLines={1} style={styles.labelHandle}>{`${handle}${node ? '@' + node : ''}`}</Text>}
          {!name && !handle && <Text numberOfLines={1} style={styles.labelUnknown}>{state.strings.unknownContact}</Text>}
          <View style={styles.headerActions}>
            <Text style={styles.timestamp}> {timestamp}</Text>
            <Menu
              mode={Platform.OS === 'ios' ? 'flat' : 'elevated'}
              elevation={Platform.OS === 'ios' ? 8 : 2}
              contentStyle={styles.menuContent}
              key="actions"
              visible={options}
              onDismiss={() => setOptions(false)}
              anchor={<IconButton style={styles.menuButton} icon="dots-horizontal-circle-outline" size={16} onPress={() => setOptions(true)} />}>
              {Platform.OS === 'ios' && (
                <Surface elevation={11} style={styles.menu}>
                  <BlurView style={styles.blur} blurType={theme.colors.name} blurAmount={8} reducedTransparencyFallbackSize={theme.colors.name} />
                  {!locked && profile && status === 'confirmed' && (
                    <Pressable key="edit" style={styles.menuOption} onPress={edit}>
                      <Icon style={styles.button} source="square-edit-outline" size={28} color={theme.colors.primary} />
                      <Text>{state.strings.editOption}</Text>
                    </Pressable>
                  )}
                  {(host || profile) && (
                    <Pressable key="remove" style={styles.menuOption} onPress={remove}>
                      <Icon style={styles.button} source="trash-can-outline" size={28} color={theme.colors.primary} />
                      <Text>{state.strings.deleteOption}</Text>
                    </Pressable>
                  )}
                  {!profile && (
                    <Pressable key="block" style={styles.menuOption} onPress={block}>
                      <Icon style={styles.button} source="eye-remove-outline" size={28} color={theme.colors.primary} />
                      <Text>{state.strings.blockOption}</Text>
                    </Pressable>
                  )}
                  {!profile && (
                    <Pressable key="report" style={styles.menuOption} onPress={report}>
                      <Icon style={styles.button} source="alert-octagon-outline" size={28} color={theme.colors.primary} />
                      <Text>{state.strings.reportOption}</Text>
                    </Pressable>
                  )}
                </Surface>
              )}
              {Platform.OS !== 'ios' && !locked && profile && status === 'confirmed' && <Menu.Item key="edit" onPress={edit} leadingIcon="square-edit-outline" title={state.strings.editOption} />}
              {Platform.OS !== 'ios' && (host || profile) && <Menu.Item key="remove" onPress={remove} leadingIcon="trash-can-outline" title={state.strings.deleteOption} />}
              {Platform.OS !== 'ios' && !profile && <Menu.Item key="block" onPress={block} leadingIcon="eye-remove-outline" title={state.strings.blockOption} />}
              {Platform.OS !== 'ios' && !profile && <Menu.Item key="edit" onPress={report} leadingIcon="alert-octagon-outline" title={state.strings.reportOption} />}
            </Menu>
          </View>
        </View>
        <View style={[styles.messageContainer, profile ? styles.messageContainerReverse : styles.messageContainerNormal]}>
          <Image style={styles.image} resizeMode={'contain'} source={{uri: logoUrl}} />
          <View style={styles.messageContent}>
            <Surface style={styles.messageSurface} mode="flat" elevation={0}>
              {!locked && status === 'confirmed' && text && <Text style={[styles.text, textStyle, styles.messageText]}>{message}</Text>}
              {!locked && status !== 'confirmed' && (
                <View style={styles.shimmerContainer}>
                  <Shimmer contentStyle={styles.longbone} />
                  <Shimmer contentStyle={styles.shortbone} />
                </View>
              )}
              {locked && <Text style={[styles.locked, styles.lockedText]}>{state.strings.encrypted}</Text>}
              {!locked && assets?.length > 0 && transform === 'complete' && (
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.mediaScroll} contentContainerStyle={styles.assets}>
                  {media}
                </ScrollView>
              )}
              {!locked && media.length > 0 && transform === 'incomplete' && <Shimmer contentStyle={styles.smDot} />}
              {!locked && media.length > 0 && transform !== 'complete' && transform !== 'incomplete' && <Text style={styles.error}>{state.strings.processingError}</Text>}
            </Surface>
          </View>
        </View>
      </View>
      <Confirm show={confirmShow} busy={removing || reporting || blocking} params={confirmParams} />
      <Modal animationType="fade" statusBarTranslucent={true} transparent={true} supportedOrientations={['portrait', 'landscape']} visible={editing} onRequestClose={() => setEditing(false)}>
        <View style={styles.modal}>
          <Pressable style={styles.blur} onPress={() => setEditing(false)}>
            <BlurView style={styles.blur} blurType="dark" blurAmount={6} reducedTransparencyFallbackColor="dark" />
          </Pressable>
          <View style={styles.editArea}>
            <Surface elevation={2} style={{...styles.editContent, backgroundColor: theme.colors.elevation.level12}}>
              <Text style={styles.title}>{state.strings.editOption}</Text>
              <TextInput
                multiline={true}
                mode="outlined"
                outlineStyle={styles.inputBorder}
                style={styles.message}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={state.strings.newMessage}
                value={editText}
                onChangeText={value => setEditText(value)}
              />
              <View style={styles.controls}>
                <Button style={{...styles.control, borderColor: theme.colors.outlineVariant}} mode="outlined" onPress={() => setEditing(false)}>
                  {state.strings.cancel}
                </Button>
                <Button style={styles.control} textColor="white" mode="contained" loading={saving} onPress={save}>
                  {state.strings.save}
                </Button>
              </View>
            </Surface>
          </View>
        </View>
      </Modal>
    </View>
  );
}
