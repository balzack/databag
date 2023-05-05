import { ActivityIndicator, Image, Text, View, TouchableOpacity } from 'react-native';
import Colors from 'constants/Colors';
import Video from 'react-native-video';
import { useVideoAsset } from './useVideoAsset.hook';
import { styles } from './VideoAsset.styled';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import FastImage from 'react-native-fast-image'

import { useEffect } from 'react';

export function VideoAsset({ asset, dismiss }) {

  const { state, actions } = useVideoAsset(asset);

  useKeepAwake();

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={1} style={styles.container}  onPress={actions.showControls}>
        <FastImage source={{ uri: asset.thumb }} onLoad={actions.setRatio}
            style={{ ...styles.thumb, width: state.thumbWidth, height: state.thumbHeight }}
            resizeMode={FastImage.resizeMode.contain} />
        { state.url && (
          <Video source={{ uri: state.url, type: 'video/mp4' }} style={{ ...styles.main, width: state.width, height: state.height }}
            resizeMode={'cover'}  onReadyForDisplay={(e) => { console.log(e) }}
            onLoad={actions.loaded} repeat={true} paused={!state.playing} resizeMode="contain" />
        )}
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
          { asset.total > 0 && (
            <Text style={styles.decrypting}>{ asset.block } / { asset.total }</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
  
