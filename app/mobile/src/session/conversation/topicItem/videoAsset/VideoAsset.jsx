import { ActivityIndicator, Image, Text, View, TouchableOpacity } from 'react-native';
import Colors from 'constants/Colors';
import Video from 'react-native-video';
import { useVideoAsset } from './useVideoAsset.hook';
import { styles } from './VideoAsset.styled';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import FastImage from 'react-native-fast-image'
import { SafeAreaView } from 'react-native-safe-area-context';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function VideoAsset({ asset, dismiss }) {

  const { state, actions } = useVideoAsset(asset);

  useKeepAwake();

  return (
    <View style={styles.base}>
      <TouchableOpacity activeOpacity={1} style={styles.container}  onPress={actions.showControls}>
        <FastImage source={{ uri: asset.thumb }} onLoad={actions.setThumbSize}
            style={styles.thumb} resizeMode={FastImage.resizeMode.contain} />
        { state.url && (
          <Video source={{ uri: state.url, type: 'video/mp4' }} style={styles.main}
            onLoad={actions.setVideoSize} repeat={true} paused={!state.playing} resizeMode="contain" />
        )}
        { (!state.playing || state.controls) && (
          <View style={styles.overlay} />
        )}
        { !state.playing && state.videoLoaded && (
          <TouchableOpacity style={styles.control} onPress={actions.play}>
            <Icons name="play-circle-outline" size={92} color={Colors.white} />
          </TouchableOpacity>
        )}
        { state.controls && state.playing && state.videoLoaded && (
          <TouchableOpacity style={styles.control} onPress={actions.pause}>
            <Icons name="pause-circle-outline" size={92} color={Colors.white} />
          </TouchableOpacity>
        )}
        { (state.controls || !state.playing) && state.videoLoaded && (
          <TouchableOpacity style={styles.share} onPress={actions.download}>
            { state.downloaded && (
              <MatIcons name="download-outline" size={32} color={Colors.white} />
            )}
            { !state.downloaded && (
              <MatIcons name="download" size={32} color={Colors.white} />
            )}
          </TouchableOpacity>
        )}
        { (state.controls || !state.playing) && state.videoLoaded && (
          <TouchableOpacity style={styles.close} onPress={dismiss}>
             <Icons name="window-close" size={32} color={Colors.white} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      { !state.videoLoaded && (
        <TouchableOpacity style={styles.loading} onPress={dismiss}>
          <ActivityIndicator color={Colors.white} size="large" />
          { asset.total > 0 && (
            <Text style={styles.decrypting}>{ asset.block } / { asset.total }</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
  
