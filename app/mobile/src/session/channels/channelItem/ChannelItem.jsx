import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Logo } from 'utils/Logo';
import { styles } from './ChannelItem.styled';
import { useChannelItem } from './useChannelItem.hook';

export function ChannelItem({ item, openConversation }) {

  const { state, actions } = useChannelItem(item);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => openConversation(item.cardId, item.channelId, item.revision)}>
      <Logo src={item.logo} width={32} height={32} radius={6} />
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

