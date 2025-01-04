import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Modal, Pressable, View, Image, Animated, useAnimatedValue } from 'react-native'
import { Icon, ProgressBar, IconButton } from 'react-native-paper'
import { useAudioAsset } from './useAudioAsset.hook';
import { MediaAsset } from '../../conversation/Conversation';
import { styles } from './AudioAsset.styled'
import {BlurView} from '@react-native-community/blur';
import Video from 'react-native-video'
import thumb from '../../images/audio.png';

export function AudioAsset({ topicId, asset, loaded, show }: { topicId: string, asset: MediaAsset, loaded: ()=>void, show: boolean }) {
  const { state, actions } = useAudioAsset(topicId, asset);
  const [modal, setModal] = useState(false);
  const opacity = useAnimatedValue(0);

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

