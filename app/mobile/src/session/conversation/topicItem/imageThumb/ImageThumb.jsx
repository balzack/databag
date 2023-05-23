import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useImageThumb } from './useImageThumb.hook';
import { styles } from './ImageThumb.styled';
import Colors from 'constants/Colors';

export function ImageThumb({ url, onAssetView }) {
  const { state, actions } = useImageThumb();

  return (
    <TouchableOpacity activeOpacity={1} onPress={onAssetView}>
      <Image source={{ uri: url }} style={{ opacity: state.loaded ? 1 : 0, borderRadius: 4, width: 92 * state.ratio, height: 92, marginRight: 16 }}
          onLoad={actions.loaded} resizeMode={'cover'} />
    </TouchableOpacity>
  );

}

  
