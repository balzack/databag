import { Image, TouchableOpacity } from 'react-native';
import { useImageAsset } from './useImageAsset.hook';
import { styles } from './ImageAsset.styled';
import Colors from 'constants/Colors';

export function ImageAsset({ topicId, asset }) {
  const { state, actions } = useImageAsset(topicId, asset);

  return (
    <TouchableOpacity activeOpacity={1}>
      <Image source={{ uri: state.url }} style={{ borderRadius: 4, width: 92 * state.ratio, height: 92, marginRight: 16 }} resizeMode={'cover'} />
    </TouchableOpacity>
  );

}

  
