import { useRef, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';
import { useVideoFile } from './useVideoFile.hook';
import { styles } from './VideoFile.styled';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Colors from 'constants/Colors';

export function VideoFile({ path, setPosition, remove }) {

  const { state, actions } = useVideoFile();

  const video = useRef();

  useEffect(() => {
    if (video.current) {
      video.current.seek(state.position);
      setPosition(state.position);
    }
  }, [state.position]);

  return (
    <TouchableOpacity onPress={actions.setNextPosition} onLongPress={remove}>
      <Video source={{ uri: path }} style={{ width: 92 * state.ratio, height: 92, marginRight: 16 }} resizeMode={'cover'} paused={true}
        onLoad={({ naturalSize, duration }) => actions.setInfo(naturalSize.width, naturalSize.height, duration)}
        ref={(ref) => video.current = ref}
      />
      <View style={styles.overlay}>
        <Icons name="video-outline" size={20} color={Colors.grey} /> 
      </View>  
    </TouchableOpacity>
  );
}
