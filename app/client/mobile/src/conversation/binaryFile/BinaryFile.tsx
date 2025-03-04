import React, { useEffect } from 'react';
import { View, Image } from 'react-native'
import { IconButton } from 'react-native-paper'
import { useBinaryFile } from './useBinaryFile.hook';
import {styles} from './BinaryFile.styled'
import thumb from '../../images/binary.png';

export function BinaryFile({ path, disabled, remove }: {path: string, disabled: boolean, remove: ()=>void}) {
  const { state, actions } = useBinaryFile();

  return (
    <View style={styles.binary}>
      <Image
        style={styles.thumb}
        resizeMode="contain"
        source={thumb}
      />
      <IconButton style={styles.icon} mode="contained" icon="close" disabled={disabled} size={20} onPress={remove} />
    </View>
  );
}

