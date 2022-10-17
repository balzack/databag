import { Image, View, TouchableOpacity } from 'react-native';
import Colors from 'constants/Colors';
import { Video, AVPlaybackStatus } from 'expo-av';
import { useVideoAsset } from './useVideoAsset.hook';
import GestureRecognizer from 'react-native-swipe-gestures';
import { styles } from './VideoAsset.styled';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';

export function VideoAsset({ topicId, asset, dismiss }) {

  const { state, actions } = useVideoAsset(topicId, asset);

  return (
    <TouchableOpacity activeOpacity={1} onPress={actions.showClose}>
      { state.url && (
        <Video source={{ uri: state.url }} style={{ width: state.width, height: state.height }} resizeMode={'cover'} 
          onReadyForDisplay={(e) => actions.setResolution(e.naturalSize.width, e.naturalSize.height)}
          useNativeControls={state.controls} resizeMode="contain" />
      )}
      { state.closing && (
        <TouchableOpacity style={styles.close} onPress={dismiss}>
          <Icons name="close" size={24} color={Colors.white} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
  
