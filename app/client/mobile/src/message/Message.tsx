import { useRef, useEffect, useState, useCallback } from 'react';
import { avatar } from '../constants/Icons'
import { Pressable, Linking, ScrollView, View, Image, Modal } from 'react-native';
import {Icon, Text, TextInput, IconButton, Button, Surface, Divider} from 'react-native-paper';
import { Topic, Card, Profile } from 'databag-client-sdk';
import { ImageAsset } from './imageAsset/ImageAsset';
import { AudioAsset } from './audioAsset/AudioAsset';
import { VideoAsset } from './videoAsset/VideoAsset';
import { BinaryAsset } from './binaryAsset/BinaryAsset';
import { useMessage } from './useMessage.hook';
import {styles} from './Message.styled';
import { MediaAsset } from '../conversation/Conversatin';
import { Confirm } from '../confirm/Confirm'; 
import { Shimmer } from './shimmer/Shimmer';
import {BlurView} from '@react-native-community/blur';
import { sanitizeUrl } from '@braintree/sanitize-url';

export function Message({ topic, card, profile, host, select, selected }: { topic: Topic, card: Card | null, profile: Profile | null, host: boolean, select: (id: null | string)=>void, selected: string }) {
  const { state, actions } = useMessage();
  const { locked, data, created, topicId, status, transform } = topic;
  const { name, handle, node } = profile || card || { name: null, handle: null, node: null }
  const { text, textColor, textSize, assets } = data || { text: null, textColor: null, textSize: null }
  const textStyle = textColor && textSize ? { fontSize: textSize, color: textColor } : textColor ? { color: textColor } : textSize ? { fontSize: textSize } : {}
  const logoUrl = profile ? profile.imageUrl : card ? card.imageUrl : avatar;
  const timestamp = actions.getTimestamp(created);
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
  const [message, setMessage] = useState([]);

  useEffect(() => {
    setTimeout(() => setShowAsset(true), 2000);
  }, []);

  useEffect(() => {
    setEditText(text);
  }, [text]);

  useEffect(() => {
    const urlPattern = new RegExp('(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)');
    const hostPattern = new RegExp('^https?:\\/\\/', 'i');

    let plain = '';
    let clickable = [];
    const parsed = !text ? '' : text.split(' ');

    if (parsed?.length > 0) {
      const words = parsed as string[];
      words.forEach((word, index) => {
        if (!!urlPattern.test(word)) {
          clickable.push(<Text key={index} style={textStyle}>{ plain }</Text>);
          plain = '';
          const url = !!hostPattern.test(word) ? word : `https://${word}`;
          clickable.push(<Text key={'link-' + index} onPress={() => Linking.openURL(sanitizeUrl(url))} style={{ fontStyle: 'italic' }}>{ sanitizeUrl(word) + ' ' }</Text>);
        }
        else {
          plain += `${word} `;
        }
      })
    }

    if (plain) {
      clickable.push(<Text key={parsed.length} style={textStyle}>{ plain }</Text>);
    }
    setMessage(clickable)
  }, [text, locked]);

  const loaded = () => {
    loadedCount.current += 1;
    if (loadedCount.current >= assets.length) {
      setShowAsset(true);
    }
  }

  const edit = () => {
    setEditing(true);
    select(null);
  }

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
  }

  const block = () => {
    setConfirmParams({
      title: state.strings.blockMessage,
      prompt: state.strings.blockMessagePrompt,
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
        }
      },
    });
    setConfirmShow(true);
  };

  const report = () => {
    setConfirmParams({
      title: state.strings.flagMessage,
      prompt: state.strings.flagMessagePrompt,
      cancel: {
        label: state.strings.cancel,
        action: () => setConfirmShow(false),
      },
      confirm: {
        label: state.strings.flag,
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
        }
      },
    });
    setConfirmShow(true);
  };


  const remove = () => {
    setConfirmParams({
      title: state.strings.deleteMessage,
      prompt: state.strings.messageHint,
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
        }
      },
    });
    setConfirmShow(true);
  };

  const showError = () => {
    setConfirmParams({
      title: state.strings.operationFailed,
      prompt: state.strings.tryAgain,
      cancel: {
        label: state.strings.cancel,
        action: () => setConfirmShow(false),
      },
    });
    setConfirmShow(true);
  }

  const media = !assets ? [] : assets.map((asset: MediaAsset, index: number) => {
    if (asset.image || asset.encrypted?.type === 'image') {
      return <ImageAsset key={index} topicId={topicId} asset={asset as MediaAsset} loaded={loaded} show={showAsset} />
    } else if (asset.audio || asset.encrypted?.type === 'audio') {
      return <AudioAsset key={index} topicId={topicId} asset={asset as MediaAsset} loaded={loaded} show={showAsset} />
    } else if (asset.video || asset.encrypted?.type === 'video') {
      return <VideoAsset key={index} topicId={topicId} asset={asset as MediaAsset} loaded={loaded} show={showAsset} />
    } else if (asset.binary || asset.encrypted?.type === 'binary') {
      return <BinaryAsset key={index} topicId={topicId} asset={asset as MediaAsset} loaded={loaded} show={showAsset} />
    } else {
      return <View key={index}></View>
    }
  });

  return (
    <View style={styles.message}>
      <View style={styles.topic}>
        <View style={styles.content}>
          <Image style={styles.logo} resizeMode={'contain'} source={{uri: logoUrl}} />
          <View style={styles.body}>
            <Pressable style={styles.header} onPress={()=>select(topicId == selected ? null : topicId)}>
              <View style={styles.name}>
                { name && (
                  <Text style={styles.handle}>{ name }</Text>
                )}
                { !name && handle && (
                  <Text style={styles.handle}>{ `${handle}${node ? '@' + node : ''}` }</Text>
                )}
                { !name && !handle && (
                  <Text style={styles.unknown}>{ state.strings.unknownContact }</Text>
                )}
                <Text style={styles.timestamp}> { timestamp }</Text>
              </View>
            </Pressable>
            <View style={styles.padding}>
              { !locked && status === 'confirmed' && text && (
                  <Text style={{ ...styles.text, ...textStyle }}>{ message }</Text>
              )}
              { !locked && status !== 'confirmed' && (
                <View>
                  <Shimmer contentStyle={styles.longbone} />
                  <Shimmer contentStyle={styles.shortbone} />
                </View>
              )}
              { locked && (
                <Text style={styles.locked}>{ state.strings.encrypted }</Text>
              )}
            </View>
          </View>
        </View>
      </View>
      { !locked && assets?.length > 0 && transform === 'complete' && ( 
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.carousel} contentContainerStyle={styles.assets}>
          { media }
        </ScrollView>
      )}
      { !locked && media.length > 0 && transform === 'incomplete' && (
        <Shimmer contentStyle={styles.dot} />
      )}
      { !locked && media.length > 0 && transform !== 'complete' && transform !== 'incomplete' && (
        <Text style={styles.error}>{ state.strings.processingError }</Text>
      )}
      { topicId === selected && (
        <Surface style={styles.options}>
          { !locked && profile && status === 'confirmed' && (
            <IconButton style={styles.option} loading={false} compact="true"  mode="contained" icon="square-edit-outline" size={24} onPress={edit} />
          )}
          { (host || profile) && (
            <IconButton style={styles.option} loading={removing} compact="true"  mode="contained" icon="trash-can-outline" size={24} onPress={remove} />
          )}
          { !profile && (
            <IconButton style={styles.option} loading={false} compact="true"  mode="contained" icon="eye-remove-outline" size={24} onPress={block} />
          )}
          { !profile && (
            <IconButton style={styles.option} loading={false} compact="true"  mode="contained" icon="alert-octagon-outline" size={24} onPress={report} />
          )}
        </Surface>
      )}
      <View style={styles.pad}>
        <Divider style={styles.border} />
      </View>
      <Confirm show={confirmShow} busy={removing || reporting || blocking} params={confirmParams} />
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={editing} onRequestClose={()=>setEditing(false)}>
        <View style={styles.modal}>
          <Pressable style={styles.blur} onPress={()=>setEditing(false)}>
            <BlurView style={styles.blur} blurType="dark" blurAmount={6} reducedTransparencyFallbackColor="dark" />
          </Pressable>
          <Surface elevation={2} style={styles.editArea}>
            <Text style={styles.title}>{ state.strings.edit }</Text>
            <TextInput multiline={true} mode="outlined" style={styles.message}
                outlineColor="transparent" activeOutlineColor="transparent" spellcheck={false}
                autoComplete="off" autoCapitalize="none" autoCorrect={false} placeholder={state.strings.newMessage} 
                value={editText} onChangeText={value => setEditText(value)} />
            <View style={styles.controls}>
              <Button mode="outlined" onPress={()=>setEditing(false)}>
                {state.strings.cancel}
              </Button>
              <Button mode="contained" loading={saving} onPress={save}>
                {state.strings.save}
              </Button>
            </View>
            <IconButton style={styles.closeIcon} icon="close" compact="true" mode="contained" size={24} onPress={()=>setEditing(false)} />
          </Surface>
        </View>
      </Modal>

    </View>
  );
}
