import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, Modal, Pressable, View, Image, Animated, useAnimatedValue} from 'react-native';
import {Surface, Icon, Text, ProgressBar, IconButton} from 'react-native-paper';
import {useAudioAsset} from './useAudioAsset.hook';
import {MediaAsset} from '../../conversation/Conversation';
import {styles} from './AudioAsset.styled';
import {BlurView} from '@react-native-community/blur';
import Video, {VideoRef} from 'react-native-video';
import thumb from '../../images/audio.png';
import {activateKeepAwake, deactivateKeepAwake} from '@sayem314/react-native-keep-awake';

export function AudioAsset({topicId, asset, loaded, show}: {topicId: string; asset: MediaAsset; loaded: () => void; show: boolean}) {
  const {state, actions} = useAudioAsset(topicId, asset);
  const [modal, setModal] = useState(false);
  const opacity = useAnimatedValue(0);
  const videoRef = useRef<VideoRef>(null as null | VideoRef);
  const [status, setStatus] = useState('loading');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (show) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const showAudio = () => {
    setModal(true);
    actions.loadAudio();
    activateKeepAwake();
  };

  const hideAudio = () => {
    setModal(false);
    actions.cancelLoad();
    deactivateKeepAwake();
  };

  const play = () => {
    videoRef.current.resume();
  };

  const pause = () => {
    videoRef.current.pause();
  };

  const end = () => {
    videoRef.current.seek(0);
  };

  const playbackRateChange = e => {
    if (e.playbackRate === 0) {
      setStatus('paused');
    } else {
      setStatus('playing');
    }
  };

  const download = async () => {
    if (!downloading) {
      setDownloading(true);
      try {
        await actions.download();
      } catch (err) {
        console.log(err);
      }
      setDownloading(false);
    }
  };

  return (
    <Surface elevation={1} style={styles.audio}>
      <Pressable onPress={showAudio}>
        <Animated.View style={[styles.container, {opacity}]}>
          <Image style={styles.thumb} resizeMode="contain" height={92} width={92} source={thumb} onLoad={loaded} />
          <Surface elevation={2} style={styles.button}>
            <Icon size={28} source="play-box-outline" />
          </Surface>
          <Text style={styles.info} numberOfLines={1}>
            {asset.audio?.label || asset.encrypted?.label}
          </Text>
        </Animated.View>
      </Pressable>
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={modal} onRequestClose={hideAudio}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={16} reducedTransparencyFallbackColor="dark" />
          <Image style={styles.full} resizeMode="contain" source={thumb} />
          {state.dataUrl && (
            <Video
              source={{uri: state.dataUrl}}
              style={styles.player}
              paused={false}
              ref={videoRef}
              onPlaybackRateChange={playbackRateChange}
              onEnd={end}
              onError={actions.failed}
              audioOnly={true}
              controls={false}
              resizeMode="contain"
            />
          )}
          {status === 'playing' && (
            <Surface elevation={2} style={styles.control}>
              <IconButton style={styles.iconButton} size={64} icon="pause" onPress={pause} />
            </Surface>
          )}
          {status === 'paused' && (
            <Surface elevation={2} style={styles.control}>
              <IconButton style={styles.iconButton} size={64} icon="play" onPress={play} />
            </Surface>
          )}
          {state.loading && (
            <View style={styles.progress}>
              <ProgressBar progress={state.loadPercent / 100} />
            </View>
          )}
          <SafeAreaView style={styles.close}>
            {state.dataUrl && <IconButton style={styles.closeIcon} icon="download" loading={downloading} compact="true" mode="contained" size={28} onPress={download} />}
            <Text style={styles.label} adjustsFontSizeToFit={true} numberOfLines={1}>
              {asset.audio?.label || asset.encrypted?.label}
            </Text>
            <IconButton style={styles.closeIcon} icon="close" compact="true" mode="contained" size={28} onPress={hideAudio} />
          </SafeAreaView>
          <SafeAreaView style={styles.alert}>{state.failed && <Text style={styles.alertLabel}>{state.strings.failedLoad}</Text>}</SafeAreaView>
        </View>
      </Modal>
    </Surface>
  );
}
