import { Image } from 'react-native';
import { useImageAsset } from './useImageAsset.hook';
import { styles } from './ImageAsset.styled';
import Colors from 'constants/Colors';

export function ImageAsset({ topicId, asset }) {
  const { state, actions } = useImageAsset(topicId, asset);

  return (
    <Image source={{ uri: state.url }} style={{ borderRadius: 4, width: state.imageWidth, height: state.imageHeight }} resizeMode={'cover'} />
  );
}
  
