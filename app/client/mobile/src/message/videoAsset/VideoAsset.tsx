import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Modal, Pressable, Animated, View, Image, useAnimatedValue } from 'react-native'
import { Icon, ProgressBar, IconButton } from 'react-native-paper'
import { useVideoAsset } from './useVideoAsset.hook';
import { MediaAsset } from '../../conversation/Conversation';
import { styles } from './VideoAsset.styled'
import {BlurView} from '@react-native-community/blur';
import Video from 'react-native-video'

export function VideoAsset({ topicId, asset, loaded, show }: { topicId: string, asset: MediaAsset, loaded: ()=>void, show: boolean }) {
  const { state, actions } = useVideoAsset(topicId, asset);
  const [modal, setModal] = useState(false);
  const opacity = useAnimatedValue(0);

  useEffect(() => {
    if (state.loaded && show) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
    if (state.loaded) {
      loaded();
    }
  }, [state.loaded, show]);

  const showVideo = () => {
    setModal(true);
    actions.loadVideo();
  };

  const hideVideo = () => {
    setModal(false);
    actions.cancelLoad();
  }

  return (
    <View style={styles.video}>
      { state.thumbUrl && (
        <Pressable style={styles.container} onPress={showVideo}>
          <Animated.View style={[styles.thumb,{opacity},]}>
            <Image
              resizeMode="contain"
              height={92}
              width={92 * state.ratio}
              source={{ uri: state.thumbUrl }}
              onLoad={actions.loaded}
            />
            <View style={styles.button}>
              <Icon size={32} source="play-circle-outline" />
            </View>
          </Animated.View>
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
            controls={false} resizeMode="contain" />
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

