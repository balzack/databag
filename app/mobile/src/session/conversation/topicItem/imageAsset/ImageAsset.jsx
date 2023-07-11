import { Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useImageAsset } from './useImageAsset.hook';
import { styles } from './ImageAsset.styled';
import Colors from 'constants/Colors';
import Ionicons from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image'
import Gallery from 'react-native-awesome-gallery';

export function ImageAsset({ asset, dismiss }) {
  const { state, actions } = useImageAsset(asset);

  return (
    <TouchableOpacity activeOpacity={1} style={{ display: 'flex', width: '100%', height: '100%' }} onPress={actions.showControls}>
      { state.url && (
        <Gallery data={[ state.url ]} onIndexChange={actions.loaded}
            style={{ ...styles.main }} />
      )}
      { state.controls && (
        <TouchableOpacity style={styles.close} onPress={dismiss}>
          <Ionicons name={'close'} size={32} color={Colors.white} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
