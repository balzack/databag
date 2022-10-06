import { Image, View, TouchableOpacity } from 'react-native';
import Colors from 'constants/Colors';
import { Video, AVPlaybackStatus } from 'expo-av';
import { useVideoAsset } from './useVideoAsset.hook';

export function VideoAsset({ topicId, asset }) {

  const { state, actions } = useVideoAsset(topicId, asset);

  return (
    <>
      { state.url && (
        <Video source={{ uri: state.url }} style={{ width: state.width, height: state.height }} resizeMode={'cover'} 
          onReadyForDisplay={(e) => actions.setResolution(e.naturalSize.width, e.naturalSize.height)}
          useNativeControls={state.controls} resizeMode="contain" />
      )}
    </>
  );
}
  
