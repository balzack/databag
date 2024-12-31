import React, { useState, useEffect, useRef } from 'react';
import { Modal, Pressable, Animated, View, Image, useAnimatedValue } from 'react-native'
import { Text } from 'react-native-paper'
import { useImageAsset } from './useImageAsset.hook';
import { MediaAsset } from '../../conversation/Conversation';
import { styles } from './ImageAsset.styled'
import {BlurView} from '@react-native-community/blur';

export function ImageAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useImageAsset(topicId, asset);
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

  return (
    <View style={styles.image}>
      { state.thumbUrl && (
        <Pressable onPress={()=>setModal(true)}>
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
      <Modal animationType="fade" transparent={true} supportedOrientations={['portrait', 'landscape']} visible={modal} onRequestClose={() => setModal(false)}>
        <View style={styles.modal}>
          <BlurView style={styles.blur} blurType="dark" blurAmount={2} reducedTransparencyFallbackColor="dark" />
<View style={{ width: 200, height: 200, backgroundColor: 'yellow' }} />
        </View>
      </Modal>
    </View>
  );
}

