import { View, Image, TouchableOpacity } from 'react-native';
import { useVideoThumb } from './useVideoThumb.hook';
import { styles } from './VideoThumb.styled';
import Colors from 'constants/Colors';
import Ionicons from '@expo/vector-icons/AntDesign';

export function VideoThumb({ topicId, asset, onAssetView }) {
  const { state, actions } = useVideoThumb(topicId, asset);

  return (
    <TouchableOpacity activeOpacity={1} onPress={onAssetView}>
      <Image source={{ uri: state.url }} style={{ borderRadius: 4, width: 92 * state.ratio, height: 92, marginRight: 16 }} resizeMode={'cover'} />
      <View style={styles.overlay}>
        <Ionicons name="caretright" size={20} color={Colors.white} />
      </View>
    </TouchableOpacity>
  );

}

  
