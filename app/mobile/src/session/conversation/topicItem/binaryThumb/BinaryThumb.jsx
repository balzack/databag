import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { styles } from './BinaryThumb.styled';
import Colors from 'constants/Colors';
import AntIcons from 'react-native-vector-icons/AntDesign';

export function BinaryThumb({ label, extension, onAssetView }) {

  return (
    <TouchableOpacity activeOpacity={1} style={styles.canvas} onPress={onAssetView}>
      <Text style={styles.label}>{ label }</Text>
      <View style={styles.action}>
        <AntIcons name="download" size={28} color={Colors.white} />
      </View>
      <Text style={styles.extension}>{ extension }</Text>
    </TouchableOpacity>
  );

}

