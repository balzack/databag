import React, { useEffect, useState } from 'react';
import { Modal, View, FlatList } from 'react-native';
import {useTheme, Surface, Button, Text, IconButton} from 'react-native-paper';
import {BlurView} from '@react-native-community/blur';
import { styles } from './Selector.styled';
import { useSelector } from './useSelector.hook';
import { ChannelParams } from '../content/Content';
import { Channel } from '../channel/Channel';

export function Selector({ share, selected, channels }: { share: { filePath: string, mimeType: string }, selected: (cardId: string, channelId: string)=>void, channels: ChannelParams[] }) {
  const { state, actions } = useSelector();
  const [show, setShow] = useState(false);
  const theme = useTheme();
  const [topic, setTopic] = useState(null as null | { cardId: string, channelId: stirng});

  useEffect(() => {
    if (share) {
      setShow(true);
    }
  }, [share]);

  const select = () => {
    const { cardId, channelId } = topic;
    setShow(false);
    selected(cardId, channelId);
  }

  return (
    <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={show} onRequestClose={()=>setShow(false)}>
      <View style={styles.modal}>
        <BlurView style={styles.blur} blurType="dark" blurAmount={6} reducedTransparencyFallbackColor="dark" />
        <Surface elevation={3} style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{ state.strings.selectShare }</Text>
            <IconButton style={styles.close} icon="close" size={24} onPress={() => setShow(false)} />
          </View>
          <View style={styles.data}>
            <Surface elevation={1} mode="flat" style={styles.channels}>
              { channels.length === 0 && (
                <Text style={styles.empty}>{ state.strings.noTopics }</Text>
              )}
              { channels.length > 0 && (
                <FlatList
                  style={styles.list}
                  data={channels}
                  initialNumToRender={32}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => {
                    const {cardId, channelId, sealed, focused, hosted, unread, imageUrl, subject, message} = item;
                    const select = () => {
                      setTopic({ cardId, channelId });
                    };
                    return (
                      <Surface elevation={topic?.cardId === cardId && topic?.channelId === channelId ? 0 : 2 }>
                        <Channel
                          containerStyle={{
                            ...styles.channel,
                            borderColor: theme.colors.outlineVariant,
                          }}
                          select={select}
                          unread={false}
                          sealed={sealed}
                          hosted={hosted}
                          imageUrl={imageUrl}
                          notesPlaceholder={state.strings.notes}
                          subjectPlaceholder={state.strings.unknown}
                          subject={subject}
                          messagePlaceholder={`[${state.strings.sealed}]`}
                          message={message}
                        />
                      </Surface>
                    );
                  }}
                  keyExtractor={channel => `${channel.cardId}:${channel.channelId}`}
                />
              )}
            </Surface>
          </View>
          <View style={styles.controls}>
            <Button style={styles.control} mode="outlined" onPress={()=>setShow(false)}>
              {state.strings.cancel}
            </Button>
            <Button style={styles.control} disabled={topic==null} mode="contained" onPress={select}>
              {state.strings.selectImage}
            </Button>
          </View>
        </Surface>
      </View>
    </Modal>
  );
}

