import React, { useEffect } from 'react';
import { View, Image } from 'react-native'
import { IconButton } from 'react-native-paper';
import { useAudioFile } from './useAudioFile.hook';
import {styles} from './AudioFile.styled'
import thumb from '../../images/audio.png';

export function AudioFile({ path, disabled, remove }: {path: string, disabled: boolean, remove: ()=>void}) {
  const { state, actions } = useAudioFile();

  return (
    <View style={styles.audio}>
      <Image
        style={styles.thumb}
        resizeMode="contain"
        source={thumb}
      />
      <IconButton style={styles.icon} mode="contained" icon="close" disabled={disabled} size={20} onPress={remove} />
    </View>
  );
}

