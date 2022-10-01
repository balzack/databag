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
    <TouchableOpacity onLongPress={remove}>
      <Image source={{ uri: path }} style={{ width: 92 * state.ratio, height: 92, marginRight: 16 }} resizeMode={'contain'} />
      <View style={styles.overlay}>
        <Icons name="picture" size={20} color={Colors.grey} />
      </View>
    </TouchableOpacity>
  );
}
