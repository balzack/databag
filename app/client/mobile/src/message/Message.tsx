import { useRef, useEffect, useState, useCallback } from 'react';
import { avatar } from '../constants/Icons'
import { Pressable, ScrollView, View, Image } from 'react-native';
import {Icon, Text, IconButton, Surface, Divider} from 'react-native-paper';
import { Topic, Card, Profile } from 'databag-client-sdk';
import { ImageAsset } from './imageAsset/ImageAsset';
import { AudioAsset } from './audioAsset/AudioAsset';
import { VideoAsset } from './videoAsset/VideoAsset';
import { BinaryAsset } from './binaryAsset/BinaryAsset';
import { useMessage } from './useMessage.hook';
import {styles} from './Message.styled';
import { MediaAsset } from '../conversation/Conversatin';
import { Confirm } from '../confirm/Confirm'; 

export function Message({ topic, card, profile, host, select, selected }: { topic: Topic, card: Card | null, profile: Profile | null, host: boolean, select: (id: null | string)=>void, selected: string }) {
  const { state, actions } = useMessage();
  const { locked, data, created, topicId, status, transform } = topic;
  const { name, handle, node } = profile || card || { name: null, handle: null, node: null }
  const { text, textColor, textSize, assets } = data || { text: null, textColor: null, textSize: null }
  const textStyle = textColor && textSize ? { fontSize: textSize, color: textColor } : textColor ? { color: textColor } : textSize ? { fontSize: textSize } : {}
  const logoUrl = profile ? profile.imageUrl : card ? card.imageUrl : avatar;
  const timestamp = actions.getTimestamp(created);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmParams, setConfirmParams] = useState({});
  const [confirmShow, setConfirmShow] = useState(false);
  const [removing, setRemoving] = useState(false);

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
              setConfirmParams({
                title: state.strings.operationFailed,
                prompt: state.strings.tryAgain,
                cancel: {
                  label: state.strings.cancel,
                  action: () => setConfirmShow(false),
                },
              });
            }
            setRemoving(false);
          }
        }
      },
    });
    setConfirmShow(true);
  };

  const media = !assets ? [] : assets.map((asset: MediaAsset, index: number) => {
    if (asset.image || asset.encrypted?.type === 'image') {
      return <ImageAsset key={index} topicId={topicId} asset={asset as MediaAsset} />
    } else if (asset.audio || asset.encrypted?.type === 'audio') {
      return <AudioAsset key={index} topicId={topicId} asset={asset as MediaAsset} />
    } else if (asset.video || asset.encrypted?.type === 'video') {
      return <VideoAsset key={index} topicId={topicId} asset={asset as MediaAsset} />
    } else if (asset.binary || asset.encrypted?.type === 'binary') {
      return <BinaryAsset key={index} topicId={topicId} asset={asset as MediaAsset} />
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
                  <Text style={styles.handle}>{ `${handle}${node ? '/' + node : ''}` }</Text>
                )}
                { !name && !handle && (
                  <Text style={styles.unknown}>{ state.strings.unknownContact }</Text>
                )}
                <Text style={styles.timestamp}> { timestamp }</Text>
              </View>
            </Pressable>
            <View style={styles.padding}>
              { !locked && status === 'confirmed' && editing && (
                <View style={styles.editing}>
                </View>
              )}
              { !locked && status === 'confirmed' && text && !editing && (
                  <Text style={{ ...styles.text, ...textStyle }}>{ text }</Text>
              )}
              { !locked && status !== 'confirmed' && (
                <View style={styles.unconfirmed}>
                </View>
              )}
              { locked && (
                <Text style={styles.locked}>{ state.strings.encrypted }</Text>
              )}
            </View>
          </View>
        </View>
      </View>
      { !locked && assets?.length > 0 && ( 
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.carousel} contentContainerStyle={styles.assets}>
          { media }
        </ScrollView>
      )}
      { topicId === selected && (
        <Surface style={styles.options}>
          <IconButton style={styles.option} loading={false} compact="true"  mode="contained" icon="share-variant-outline" size={24} onPress={() => {}} />
          <IconButton style={styles.option} loading={false} compact="true"  mode="contained" icon="square-edit-outline" size={24} onPress={() => {}} />
          <IconButton style={styles.option} loading={removing} compact="true"  mode="contained" icon="trash-can-outline" size={24} onPress={remove} />
          <IconButton style={styles.option} loading={false} compact="true"  mode="contained" icon="eye-remove-outline" size={24} onPress={() => {}} />
          <IconButton style={styles.option} loading={false} compact="true"  mode="contained" icon="alert-octagon-outline" size={24} onPress={() => {}} />
        </Surface>
      )}
      <Divider style={styles.border} />
      <Confirm show={confirmShow} params={confirmParams} />
    </View>
  );
}
