import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Share, Modal, Pressable, Animated, View, Image, useAnimatedValue } from 'react-native'
import { Text, Icon, ProgressBar, IconButton } from 'react-native-paper'
import { useVideoAsset } from './useVideoAsset.hook';
import { MediaAsset } from '../../conversation/Conversation';
import { styles } from './VideoAsset.styled'
import {BlurView} from '@react-native-community/blur';
import Video, { VideoRef } from 'react-native-video'
import { Colors } from '../../constants/Colors';

export function VideoAsset({ topicId, asset, loaded, show }: { topicId: string, asset: MediaAsset, loaded: ()=>void, show: boolean }) {
  const { state, actions } = useVideoAsset(topicId, asset);
  const [modal, setModal] = useState(false);
  const opacity = useAnimatedValue(0);
  const videoRef = useRef<VideoRef>(null as null | VideoRef);
  const [status, setStatus] = useState('loading');
  const [showControl, setShowControl] = useState(false);
  const clear = useRef();
 
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

  const controls = () => {
    clearTimeout(clear.current);
    setShowControl(true);
    clear.current = setTimeout(() => {
      setShowControl(false);
    }, 3000);
  }

  const play = () => {
    videoRef.current.resume();
  }

  const pause = () => {
    videoRef.current.pause();
  }

  const end = () => {
    videoRef.current.seek(0);
  }

  const playbackRateChange = (e) => {
    if (e.playbackRate === 0) {
      setStatus('paused');
    } else {
      setStatus('playing');
    }
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
        <Pressable style={styles.modal} onPress={controls}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={16} reducedTransparencyFallbackColor="dark" />
          <Image
            style={styles.full}
            resizeMode="contain"
            source={{ uri: state.thumbUrl }}
          />
          { state.dataUrl && (
            <Video source={{ uri: state.dataUrl }} style={styles.full} ref={videoRef}
              onPlaybackRateChange={playbackRateChange} onEnd={end} onError={actions.failed}
              controls={false} resizeMode="contain" />
          )}
          { status === 'playing' && showControl && (
            <IconButton style={styles.control} size={64} icon="pause" onPress={pause} />
          )}
          { status === 'paused' && showControl && (
            <IconButton style={styles.control} size={64} icon="play" onPress={play} />
          )}
          { state.loading && (
            <View style={styles.progress}>
              <ProgressBar progress={state.loadPercent / 100}  />
            </View>
          )}
          <SafeAreaView style={styles.close}>
            { state.dataUrl && (
              <IconButton style={styles.closeIcon} icon="download" compact="true" mode="contained" size={28} onPress={actions.download} />
            )}
            <View style={styles.spacer} />
            <IconButton style={styles.closeIcon} icon="close" compact="true" mode="contained" size={28} onPress={hideVideo} />
          </SafeAreaView>
          <SafeAreaView style={styles.alert}>
            { state.failed && (
              <Text style={styles.alertLabel}>{ state.strings.failedLoad }</Text>
            )}
          </SafeAreaView>
        </Pressable>
      </Modal>
    </View>
  );
}

