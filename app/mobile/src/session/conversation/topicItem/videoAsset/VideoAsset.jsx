import { Image, View, TouchableOpacity } from 'react-native';
import Colors from 'constants/Colors';
import { Video, AVPlaybackStatus } from 'expo-av';
import { useVideoAsset } from './useVideoAsset.hook';

export function VideoAsset({ topicId, asset }) {

  const { state, actions } = useVideoAsset(topicId, asset);

  return (
    <>
      { state.url && (
        <Video source={{ uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }} style={{ width: 200, height: 200 }} resizeMode={'cover'} 
        useNativeControls
        resizeMode="contain" />
      )}
    </>
  );
}
  
