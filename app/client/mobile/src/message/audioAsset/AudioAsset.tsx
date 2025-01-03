import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Modal, Pressable, View, Image } from 'react-native'
import { Icon, ProgressBar, IconButton } from 'react-native-paper'
import { useAudioAsset } from './useAudioAsset.hook';
import { MediaAsset } from '../../conversation/Conversation';
import { styles } from './AudioAsset.styled'
import {BlurView} from '@react-native-community/blur';
import Video from 'react-native-video'
import thumb from '../../images/audio.png';

export function AudioAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useAudioAsset(topicId, asset);
  const [modal, setModal] = useState(false);

  const showAudio = () => {
    setModal(true);
    actions.loadAudio();
  };

  const hideAudio = () => {
    setModal(false);
    actions.cancelLoad();
  }

  return (
    <View style={styles.audio}>
      <Pressable style={styles.container} onPress={showAudio}>
        <Image
          style={styles.thumb}
          resizeMode="contain"
          source={thumb}
        />
        <View style={styles.button}>
          <Icon size={28} source="play-box-outline" />
        </View>
      </Pressable>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={modal} onRequestClose={hideAudio}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={16} reducedTransparencyFallbackColor="dark" />
          <Image
            style={styles.full}
            resizeMode="contain"
            source={thumb}
          />
          { state.dataUrl && (
          <Video source={{ uri: state.dataUrl }} style={styles.full} paused={false}
            onLoad={(e)=>console.log(e)} onError={(e)=>console.log(e)} controls={false} resizeMode="contain" />
          )}
          { state.loading && (
            <View style={styles.progress}>
              <ProgressBar progress={state.loadPercent / 100}  />
            </View>
          )}
          <SafeAreaView style={styles.close}>
            <IconButton style={styles.closeIcon} icon="close" compact="true" mode="contained" size={28} onPress={hideAudio} />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

