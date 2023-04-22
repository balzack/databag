import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Logo } from 'utils/Logo';
import { styles } from './SharingItem.styled';
import Colors from 'constants/Colors';

export function SharingItem({ item, selection, select }) {

  const container = (selection?.cardId === item.cardId && selection?.channelId === item.channelId) ? styles.active : styles.container;

  return (
    <TouchableOpacity style={container} activeOpacity={1} onPress={() => select({ cardId: item.cardId, channelId: item.channelId })}>
      <Logo src={item.logo} width={32} height={32} radius={3} />
      <View style={styles.detail}>
        <View style={styles.subject}>
          <Text style={styles.subjectText} numberOfLines={1} ellipsizeMode={'tail'}>{ item.subject }</Text>
        </View>
        <Text style={styles.message} numberOfLines={1} ellipsizeMode={'tail'}>{ item.message }</Text>
      </View>
    </TouchableOpacity>
  )
}
