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

      { state.loaded && state.controls && (
        <TouchableOpacity style={styles.close} onPress={dismiss}>
          <Ionicons name={'close'} size={32} color={Colors.white} />
        </TouchableOpacity>
      )}

      { state.failed && (
        <TouchableOpacity style={styles.loading} onPress={dismiss}>
          <ActivityIndicator color={Colors.alert} size="large" />
        </TouchableOpacity>
      )}
      { !state.loaded && !state.failed && (
        <TouchableOpacity style={styles.loading} onPress={dismiss}>
          <ActivityIndicator color={Colors.white} size="large" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
  
