import React, { useEffect } from 'react';
import { View, Animated, useAnimatedValue } from 'react-native'
import { IconButton, Text } from 'react-native-paper';
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

  return (
    <View style={styles.video}>
      <Animated.View style={[{...styles.thumb, width: 72 * state.ratio},{opacity},]}>
        <Video source={{ uri: path }} height={72} width={72 * state.ratio} paused={true} controls={false} resizeMode="contain" onLoad={actions.loaded} />
        <IconButton style={styles.icon} mode="contained" icon="close" disabled={disabled} size={20} onPress={remove} />
      </Animated.View>
    </View>
  );
}

