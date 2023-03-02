import { useRef, useEffect } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { useImageFile } from './useImageFile.hook';
import { styles } from './ImageFile.styled';
import Colors from 'constants/Colors';

export function ImageFile({ path, setPosition, remove }) {

  const { state, actions } = useImageFile();

  return (
    <TouchableOpacity activeOpacity={1} onLongPress={remove}>
      <Image source={{ uri: path }} onLoad={actions.loaded} style={{ width: 92 * state.ratio, height: 92, marginRight: 16 }} resizeMode={'cover'} />
    </TouchableOpacity>
  );
}
