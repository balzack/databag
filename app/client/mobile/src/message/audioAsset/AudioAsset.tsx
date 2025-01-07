import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Modal, Share, Pressable, View, Image, Animated, useAnimatedValue } from 'react-native'
import { Icon, Text, ProgressBar, IconButton } from 'react-native-paper'
import { useAudioAsset } from './useAudioAsset.hook';
import { MediaAsset } from '../../conversation/Conversation';
import { styles } from './AudioAsset.styled'
import {BlurView} from '@react-native-community/blur';
import Video, { VideoRef } from 'react-native-video'
import thumb from '../../images/audio.png';
import {Colors} from '../../constants/Colors';

export function AudioAsset({ topicId, asset, loaded, show }: { topicId: string, asset: MediaAsset, loaded: ()=>void, show: boolean }) {
  const { state, actions } = useAudioAsset(topicId, asset);
  const [modal, setModal] = useState(false);
  const opacity = useAnimatedValue(0);
  const videoRef = useRef<VideoRef>(null as null | VideoRef);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (show) { 
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [show]);

  const showAudio = () => {
    setModal(true);
    actions.loadAudio();
  };

  const hideAudio = () => {
    setModal(false);
    actions.cancelLoad();
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
    <View style={styles.audio}>
      <Pressable onPress={showAudio}>
        <Animated.View style={[styles.container,{opacity},]}>
          <Image
            style={styles.thumb}
            resizeMode="contain"
            height={92}
            width={92}
            source={thumb}
            onLoad={loaded}
          />
          <View style={styles.button}>
            <Icon size={28} source="play-box-outline" />
          </View>
          <Text style={styles.info} numberOfLines={1}>{ asset.audio?.label || asset.encrypted?.label }</Text>
        </Animated.View>
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
            <Video source={{ uri: state.dataUrl }} style={styles.full} paused={false} ref={videoRef}
              onPlaybackRateChange={playbackRateChange} onEnd={end} onError={actions.failed}
              controls={false} resizeMode="contain" />
          )}
          { status === 'playing' && (
            <IconButton style={styles.control} size={64} icon="pause" onPress={pause} />
          )}
          { status === 'paused' && (
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
            <Text style={styles.label} adjustsFontSizeToFit={true} numberOfLines={1}>{ asset.audio?.label || asset.encrypted?.label }</Text>
            <IconButton style={styles.closeIcon} icon="close" compact="true" mode="contained" size={28} onPress={hideAudio} />
          </SafeAreaView>
          <SafeAreaView style={styles.alert}>
            { state.failed && (
              <Text style={styles.alertLabel}>{ state.strings.failedLoad }</Text>
            )}
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

