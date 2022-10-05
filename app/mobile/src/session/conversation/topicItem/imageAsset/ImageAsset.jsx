import { Image, View, TouchableOpacity } from 'react-native';
import { useImageAsset } from './useImageAsset.hook';
import { styles } from './ImageAsset.styled';
import Colors from 'constants/Colors';

export function ImageAsset({ topicId, asset, onClearCarousel }) {
  const { state, actions } = useImageAsset(topicId, asset);

  return (
    <TouchableOpacity onPress={onClearCarousel} activeOpacity={1}>
      <Image source={{ uri: state.url }} style={{ borderRadius: 4, width: state.imageWidth, height: state.imageHeight }} resizeMode={'cover'} />
    </TouchableOpacity>
  );
}
  
