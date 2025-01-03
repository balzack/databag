import React, { useEffect } from 'react';
import { View, Animated, useAnimatedValue } from 'react-native'
import { Text } from 'react-native-paper';
import { useVideoFile } from './useVideoFile.hook';
import {styles} from './VideoFile.styled'
import Video from 'react-native-video'

export function VideoFile({ path, disabled, remove }: {path: string, disabled: boolean, remove: ()=>void}) {
  const { state, actions } = useVideoFile();
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

console.log("PATH: ", path);

  return (
    <View style={styles.video}>
      <Animated.View style={[styles.thumb,{opacity},]}>
        <Video source={{ uri: path }} height={72} width={72 * state.ratio} paused={true} controls={false} resizeMode="contain" onLoad={actions.loaded} />
      </Animated.View>
    </View>
  );
}

