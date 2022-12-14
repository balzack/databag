import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Logo } from 'utils/Logo';
import { styles } from './ChannelItem.styled';
import { useChannelItem } from './useChannelItem.hook';
import Colors from 'constants/Colors';
import Ionicons from '@expo/vector-icons/MaterialCommunityIcons';

export function ChannelItem({ item, openConversation }) {

  const { state, actions } = useChannelItem(item);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => openConversation(item.cardId, item.channelId, item.revision)}>
      <Logo src={item.logo} width={32} height={32} radius={6} />
      <View style={styles.detail}>
        <View style={styles.subject}>
          { item.locked && !item.unlocked && (
            <Ionicons name="lock" style={styles.subjectIcon} size={16} color={Colors.text} />
          )}
          { item.locked && item.unlocked && (
            <Ionicons name="lock-open-variant-outline" style={styles.subjectIcon} size={16} color={Colors.text} />
          )}
          <Text style={styles.subjectText} numberOfLines={1} ellipsizeMode={'tail'}>{ item.subject }</Text>
        </View>
        <Text style={styles.message} numberOfLines={1} ellipsizeMode={'tail'}>{ item.message }</Text>
      </View>
      { item.updated && (
        <View style={styles.dot} />
      )}
    </TouchableOpacity>
  )
}

