import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Modal, Pressable, Animated, View, Image, useAnimatedValue } from 'react-native'
import { Icon, ProgressBar, IconButton } from 'react-native-paper'
import { useVideoAsset } from './useVideoAsset.hook';
import { MediaAsset } from '../../conversation/Conversation';
import { styles } from './VideoAsset.styled'
import {BlurView} from '@react-native-community/blur';
import Video from 'react-native-video'

export function VideoAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useVideoAsset(topicId, asset);
  const [modal, setModal] = useState(false);
  const opacity = useAnimatedValue(0);

  useEffect(() => {
    if (state.loaded) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [state.loaded]);

  const showVideo = () => {
    setModal(true);
    actions.loadVideo();
  };

  const hideVideo = () => {
    setModal(false);
    actions.cancelLoad();
  }

  return (
    <View style={styles.image}>
      { state.thumbUrl && (
        <Pressable onPress={showVideo}>
          <Animated.Image
            style={[styles.thumb,{opacity},]}
            resizeMode="contain"
            height={92}
            width={92 * state.ratio}
            source={{ uri: state.thumbUrl }}
            onLoad={actions.loaded}
          />
        </Pressable>
      )}
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={modal} onRequestClose={hideVideo}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={16} reducedTransparencyFallbackColor="dark" />
          <Image
            style={styles.full}
            resizeMode="contain"
            source={{ uri: state.thumbUrl }}
          />
          { state.dataUrl && (
          <Video source={{ uri: state.dataUrl }} style={styles.full}
            controls={false} onLoad={(e)=>console.log("LOAD", e)} onError={(e)=>console.log("ERR", e)} resizeMode="contain" />
          )}
          { state.loading && (
            <View style={styles.progress}>
              <ProgressBar progress={state.loadPercent / 100}  />
            </View>
          )}
          <SafeAreaView style={styles.close}>
            <IconButton style={styles.closeIcon} icon="close" compact="true" mode="contained" size={28} onPress={hideVideo} />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

