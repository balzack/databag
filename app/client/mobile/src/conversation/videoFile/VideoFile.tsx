import React, {useEffect, useRef, useState} from 'react';
import {Pressable, View, Animated, useAnimatedValue} from 'react-native';
import {Icon, IconButton} from 'react-native-paper';
import {useVideoFile} from './useVideoFile.hook';
import {styles} from './VideoFile.styled';
import { VideoView, useVideoPlayer } from 'expo-video';

export function VideoFile({path, thumbPosition, disabled, remove}: {path: string; thumbPosition: (position: number) => void; disabled: boolean; remove: () => void}) {
  const {state, actions} = useVideoFile();
  const opacity = useAnimatedValue(0);
  const [seek, setSeek] = useState(0);

const player = useVideoPlayer(path, player => {
    player.loop = true; // Set video to loop
    player.play();      // Start playing the video automatically
  });


  useEffect(() => {
    if (state.loaded) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.loaded]);

  return (
    <View style={styles.video}>
      <Animated.View style={[{...styles.thumb, width: 72 * state.ratio}, {opacity}]}>
        <VideoView player={player} height={72} width={72 * state.ratio} paused={true} controls={false} resizeMode="contain" onLoad={actions.loaded} />
        <IconButton style={styles.icon} mode="contained" icon="close" disabled={disabled} size={20} onPress={remove} />
      </Animated.View>
    </View>
  );
}
