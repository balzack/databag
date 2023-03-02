import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { styles } from './AudioThumb.styled';
import Colors from 'constants/Colors';
import audio from 'images/audio.png';

export function AudioThumb({ topicId, asset, onAssetView }) {

  return (
    <TouchableOpacity activeOpacity={1} onPress={onAssetView}>
      <Image source={audio} style={{ borderRadius: 4, width: 92, height: 92, marginRight: 16, backgroundColor: Colors.lightgrey }} resizeMode={'cover'} />
      { asset.label && (
        <View style={styles.overlay}>
          <Text style={styles.label}>{ asset.label }</Text>
        </View>
      )}
    </TouchableOpacity>
  );

}

  
