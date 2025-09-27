import React, {useEffect, useRef, useState} from 'react';
import {Pressable, View, Animated, useAnimatedValue} from 'react-native';
import {Icon, IconButton} from 'react-native-paper';
import {useVideoFile} from './useVideoFile.hook';
import {styles} from './VideoFile.styled';
import Video, {VideoRef} from 'react-native-video';

export function VideoFile({path, thumbPosition, disabled, remove}: {path: string; thumbPosition: (position: number) => void; disabled: boolean; remove: () => void}) {
  const {state, actions} = useVideoFile();
  const opacity = useAnimatedValue(0);
  const videoRef = useRef<VideoRef>(null as null | VideoRef);
  const [seek, setSeek] = useState(0);

  const next = () => {
    const step = state.duration / 10;
    const pos = seek + step > state.duration ? 0 : seek + step;
    thumbPosition(pos);
    videoRef.current.seek(pos);
    setSeek(pos);
  };

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
        <Video ref={videoRef} source={{uri: path}} height={72} width={72 * state.ratio} paused={true} controls={false} resizeMode="contain" onLoad={actions.loaded} />
        {!disabled && (
          <Pressable style={styles.next} height={72} width={72 * state.ratio} onPress={next}>
            <Icon size={28} source="chevron-right" />
          </Pressable>
        )}
        <IconButton style={styles.icon} mode="contained" icon="close" disabled={disabled} size={20} onPress={remove} />
      </Animated.View>
    </View>
  );
}

