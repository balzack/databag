import { View, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useVideoThumb } from './useVideoThumb.hook';
import { styles } from './VideoThumb.styled';
import Colors from '../../../../constants/Colors';
import AntIcons from 'react-native-vector-icons/AntDesign';

export function VideoThumb({ url, onAssetView }) {
  const { state, actions } = useVideoThumb();

  return (
    <TouchableOpacity activeOpacity={1} onPress={onAssetView}>
      <Image source={{ uri: url }} style={{ opacity: state.loaded ? 1 : 0, borderRadius: 4, width: 92 * state.ratio, height: 92, marginRight: 16 }}
          onLoad={actions.loaded} resizeMode={'cover'} />
      <View style={styles.overlay}>
        <AntIcons name="caretright" size={20} color={Colors.white} />
      </View>
    </TouchableOpacity>
  );

}

  
