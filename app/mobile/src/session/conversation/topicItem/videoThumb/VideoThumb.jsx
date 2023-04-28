import { View, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useVideoThumb } from './useVideoThumb.hook';
import { styles } from './VideoThumb.styled';
import Colors from 'constants/Colors';
import AntIcons from 'react-native-vector-icons/AntDesign';

export function VideoThumb({ topicId, asset, onAssetView }) {
  const { state, actions } = useVideoThumb(topicId, asset);

  return (
    <TouchableOpacity activeOpacity={1} onPress={onAssetView}>
      <Image source={{ uri: state.url }} style={{ borderRadius: 4, width: 92 * state.ratio, height: 92, marginRight: 16 }} resizeMode={'cover'} />
      <View style={styles.overlay}>
        <AntIcons name="caretright" size={20} color={Colors.white} />
      </View>
    </TouchableOpacity>
  );

}

  
