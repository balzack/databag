import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './AudioThumb.styled';
import Colors from 'constants/Colors';
import audio from 'images/audio.png';

export function AudioThumb({ topicId, asset }) {

  return (
    <TouchableOpacity activeOpacity={1}>
      <Image source={audio} style={{ borderRadius: 4, width: 92, height: 92, marginRight: 16, backgroundColor: Colors.lightgrey }} resizeMode={'cover'} />
      { asset.label && (
        <View style={styles.overlay}>
          <Text style={styles.label}>{ asset.label }</Text>
        </View>
      )}
    </TouchableOpacity>
  );

}

  
