import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useImageThumb } from './useImageThumb.hook';
import { styles } from './ImageThumb.styled';
import Colors from 'constants/Colors';

export function ImageThumb({ topicId, asset, onAssetView }) {
  const { state, actions } = useImageThumb(topicId, asset);

  return (
    <TouchableOpacity activeOpacity={1} onPress={onAssetView}>
      <Image source={{ uri: state.url }} style={{ borderRadius: 4, width: 92 * state.ratio, height: 92, marginRight: 16 }} resizeMode={'cover'} />
    </TouchableOpacity>
  );

}

  
