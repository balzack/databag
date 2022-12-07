import { ActivityIndicator, Image, View, TouchableOpacity } from 'react-native';
import Colors from 'constants/Colors';
import { useKeepAwake } from 'expo-keep-awake';
import { Video, AVPlaybackStatus } from 'expo-av';
import { useVideoAsset } from './useVideoAsset.hook';
import { styles } from './VideoAsset.styled';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';

export function VideoAsset({ topicId, asset, dismiss }) {

  const { state, actions } = useVideoAsset(topicId, asset);

  useKeepAwake();

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={1} style={styles.container}  onPress={actions.showControls}>
        <Video source={{ uri: state.url }} style={{ width: state.width, height: state.height }} resizeMode={'cover'} 
          onReadyForDisplay={(e) => actions.setResolution(e.naturalSize.width, e.naturalSize.height)}
          onLoad={actions.loaded} isLooping={true} shouldPlay={state.playing} resizeMode="contain" />
        { (!state.playing || state.controls) && (
          <View style={{ ...styles.overlay, width: state.width, height: state.height }} />
        )}
        { !state.playing && state.loaded && (
          <TouchableOpacity style={styles.control} onPress={actions.play}>
            <Icons name="play-circle-outline" size={92} color={Colors.white} />
          </TouchableOpacity>
        )}
        { state.controls && state.playing && state.loaded && (
          <TouchableOpacity style={styles.control} onPress={actions.pause}>
            <Icons name="pause-circle-outline" size={92} color={Colors.white} />
          </TouchableOpacity>
        )}
        { (state.controls || !state.playing) && state.loaded && (
          <TouchableOpacity style={styles.close} onPress={dismiss}>
            <Icons name="window-close" size={32} color={Colors.white} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      { !state.loaded && (
        <TouchableOpacity style={styles.loading} onPress={dismiss}>
          <ActivityIndicator color={Colors.white} size="large" />
        </TouchableOpacity>
      )}
    </View>
  );
}
  
