import { useRef, useEffect } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { useImageFile } from './useImageFile.hook';
import { styles } from './ImageFile.styled';
import Icons from '@expo/vector-icons/AntDesign';
import Colors from 'constants/Colors';

export function ImageFile({ path, setPosition, remove }) {

  const { state, actions } = useImageFile();

  useEffect(() => {
    Image.getSize(path, actions.setInfo);
  }, [path]);

  return (
    <TouchableOpacity activeOpacity={1} onLongPress={remove}>
      <Image source={{ uri: path }} style={{ width: 92 * state.ratio, height: 92, marginRight: 16 }} resizeMode={'contain'} />
    </TouchableOpacity>
  );
}
