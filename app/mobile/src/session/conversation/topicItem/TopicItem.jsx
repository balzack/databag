import { View, Text, TouchableOpacity } from 'react-native';
import { useTopicItem } from './useTopicItem.hook';
import { styles } from './TopicItem.styled';
import { Logo } from 'utils/Logo';

export function TopicItem({ item }) {

  const { state, actions } = useTopicItem(item);

  return (
    <View style={styles.item}>
      <View style={styles.header}>
        <Logo src={state.logo} width={28} height={28} radius={6} />
        <Text style={styles.name}>{ state.name }</Text>
        <Text style={styles.timestamp}>{ state.timestamp }</Text>
      </View>
      <Text style={styles.message}>{ state.message }</Text>
    </View>
  );
}

