import { Image, View, TouchableOpacity } from 'react-native';
import Colors from 'constants/Colors';
import Video from 'react-native-video';
import { useVideoAsset } from './useVideoAsset.hook';

export function VideoAsset({ topicId, asset }) {

  const { state, actions } = useVideoAsset(topicId, asset);

  return (
    <>
      { state.url && (
        <Video source={{ uri: state.url }} style={{ width: state.width, height: state.height }} resizeMode={'cover'} paused={true}
            controls={true} onLoad={({ naturalSize }) => actions.setResolution(naturalSize.width, naturalSize.height)} />
      )}
    </>
  );
}
  
