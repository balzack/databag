import { Text, TouchableOpacity, View } from 'react-native';
import { Logo } from 'utils/Logo';
import { styles } from './ChannelItem.styled';
import { useChannelItem } from './useChannelItem.hook';

export function ChannelItem({ item }) {

  const { state, actions } = useChannelItem(item);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={actions.setRead}>
      <Logo src={item.logo} width={40} height={40} radius={6} />
      <View style={styles.detail}>
        <Text style={styles.subject} numberOfLines={1} ellipsizeMode={'tail'}>{ item.subject }</Text>
        <Text style={styles.message} numberOfLines={1} ellipsizeMode={'tail'}>{ item.message }</Text>
      </View>
      { item.updated && (
        <View style={styles.dot} />
      )}
    </TouchableOpacity>
  )
}

