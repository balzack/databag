import { Text, View, Image, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { useImageAsset } from './useImageAsset.hook';
import { styles } from './ImageAsset.styled';
import Colors from 'constants/Colors';
import Ionicons from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image'
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function ImageAsset({ asset, dismiss }) {
  const { state, actions } = useImageAsset(asset);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={actions.showControls}>
      <FastImage source={{ uri: asset.thumb }} onLoad={actions.setRatio} 
          style={{ ...styles.thumb, width: state.imageWidth, height: state.imageHeight }}
          resizeMode={FastImage.resizeMode.contain} />
      { state.url && (
        <FastImage source={{ uri: state.url }} onLoad={actions.loaded}
            style={{ ...styles.main, width: state.imageWidth, height: state.imageHeight }}
            resizeMode={FastImage.resizeMode.contain} />
      )}
      { state.showDownloaded && (
        <View style={styles.downloaded}>
          <MatIcons name="folder-download-outline" size={22} color={Colors.white} />
          { Platform.OS === 'ios' && (
            <Text style={styles.downloadedLabel}>Documents</Text>
          )}
          { Platform.OS !== 'ios' && (
            <Text style={styles.downloadedLabel}>Downloads</Text>
          )}
        </View>
      )}

      { state.loaded && state.controls && (
        <TouchableOpacity style={styles.share} onPress={actions.download}>
          { state.downloaded && (
            <MatIcons name="download-outline" size={32} color={Colors.white} />
          )}
          { !state.downloaded && (
            <MatIcons name="download" size={32} color={Colors.white} />
          )}
        </TouchableOpacity>
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
          { asset.total > 1 && (
            <Text style={styles.decrypting}>{ asset.block } / { asset.total }</Text>
          )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
