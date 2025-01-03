import React, { useEffect } from 'react';
import { View, Animated, useAnimatedValue } from 'react-native'
import { Text } from 'react-native-paper';
import { useImageFile } from './useImageFile.hook';
import {styles} from './ImageFile.styled'

export function ImageFile({ path, disabled, remove }: {path: string, disabled: boolean, remove: ()=>void}) {
  const { state, actions } = useImageFile();
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

  const showImage = () => {
    setModal(true);
    actions.loadImage();
  };

  const hideImage = () => {
    setModal(false);
    actions.cancelLoad();
  }

  return (
    <View style={styles.image}>
      <Animated.Image
        style={[styles.thumb,{opacity},]}
        resizeMode="contain"
        height={72}
        width={72 * state.ratio}
        source={{ uri: path }}
        onLoad={actions.loaded}
      />
    </View>
  );
}

