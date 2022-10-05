import { Image, View, TouchableOpacity } from 'react-native';
import Colors from 'constants/Colors';

export function VideoAsset({ topicId, asset, onClearCarousel }) {

  return (
    <TouchableOpacity onPress={onClearCarousel} activeOpacity={1} style={{ width: 100, height: 100, backgroundColor: 'yellow' }} onPress={onClearCarousel} />
  );
}
  
