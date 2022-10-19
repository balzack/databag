import { View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useImageAsset } from './useImageAsset.hook';
import { styles } from './ImageAsset.styled';
import Colors from 'constants/Colors';

export function ImageAsset({ topicId, asset, dismiss }) {
  const { state, actions } = useImageAsset(topicId, asset);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={dismiss}>
      <Image source={{ uri: state.url }} onLoad={actions.loaded} style={{ borderRadius: 4, width: state.imageWidth, height: state.imageHeight }} resizeMode={'cover'} />
      { !state.loaded && (
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.white} size="large" />
        </View>
      )}
    </TouchableOpacity>
  );
}
  
