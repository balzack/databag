import React, { useState, useEffect, useRef } from 'react';
import { Animated, View, Image, useAnimatedValue } from 'react-native'
import { Text } from 'react-native-paper'
import { useImageAsset } from './useImageAsset.hook';
import { MediaAsset } from '../../conversation/Conversation';
import { styles } from './ImageAsset.styled'

export function ImageAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useImageAsset(topicId, asset);
  const fadeAnim = useAnimatedValue(0);

  useEffect(() => {
    if (state.loaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [state.loaded]);

  return (
    <View style={styles.image}>
      { state.thumbUrl && (
        <Animated.Image
          style={[styles.thumb,{opacity: fadeAnim,},]}
          resizeMode="contain"
          height={92}
          width={92 * state.ratio}
          source={{ uri: state.thumbUrl }}
          onLoad={actions.loaded}
        />
      )}
    </View>
  );
}

