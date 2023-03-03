import { View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useImageAsset } from './useImageAsset.hook';
import { styles } from './ImageAsset.styled';
import Colors from 'constants/Colors';
import Ionicons from 'react-native-vector-icons/AntDesign';

export function ImageAsset({ topicId, asset, dismiss }) {
  const { state, actions } = useImageAsset(topicId, asset);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={actions.showControls}>
      { state.url && (
        <Image source={{ uri: state.url }} onLoad={actions.loaded} onError={actions.failed}
            style={{ borderRadius: 4, width: state.imageWidth, height: state.imageHeight }} resizeMode={'cover'} />
      )}

      { state.controls && (
        <TouchableOpacity style={styles.close} onPress={dismiss}>
          <Ionicons name={'close'} size={32} color={Colors.white} />
        </TouchableOpacity>
      )}

      { state.failed && (
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.alert} size="large" />
        </View>
      )}
      { !state.loaded && !state.failed && (
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.white} size="large" />
        </View>
      )}
    </TouchableOpacity>
  );
}
  
