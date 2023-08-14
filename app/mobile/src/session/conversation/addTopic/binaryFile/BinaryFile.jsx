import { Image, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './BinaryFile.styled';

export function BinaryFile({ path, remove, extension, label, setLabel }) {
  return (
    <TouchableOpacity style={styles.binary} onLongPress={remove}>
      <TextInput style={ styles.input } value={ label } onChangeText={setLabel}
          multiline={true} autoCapitalize={'none'} placeholder="Binary Label" />
      <View style={styles.extension}>
        <Text style={styles.label}>{ extension }</Text>
      </View>
    </TouchableOpacity>
  )
}
