import { Image, View, TextInput } from 'react-native';
import audio from 'images/audio.png';
import { styles } from './AudioFile.styled';

export function AudioFile({ path, remove, label, setLabel }) {
  return (
    <View style={styles.audio}>
      <Image source={audio} resizeMode={'cover'} style={styles.image} />
      <TextInput style={ styles.input } value={ label } onChangeText={setLabel}
          multiline={true} autoCapitalize={'none'} placeholder="Audio Label" />
    </View>
  )
}

