import { Image, View, TextInput, TouchableOpacity } from 'react-native';
import audio from 'images/audio.png';
import { styles } from './AudioFile.styled';

export function AudioFile({ path, remove, label, setLabel }) {
  return (
    <TouchableOpacity style={styles.audio} onLongPress={remove}>
      <Image source={audio} resizeMode={'cover'} style={styles.image} />
      <TextInput style={ styles.input } value={ label } onChangeText={setLabel}
          multiline={true} autoCapitalize={'none'} placeholder="Audio Label" />
    </TouchableOpacity>
  )
}
