import { Text, TouchableOpacity, View } from 'react-native';
import { Logo } from 'utils/Logo';
import { styles } from './MemberItem.styled';
import { useMemberItem } from './useMemberItem.hook';
import Ionicons from '@expo/vector-icons/MaterialCommunityIcons';
import Colors from 'constants/Colors';

export function MemberItem({ hostId, item }) {

  const { state, actions } = useMemberItem(item);

  return (
    <View style={styles.container}>
      <Logo src={state.logo} width={32} height={32} radius={6} />
      <View style={styles.detail}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{ state.name }</Text>
        <Text style={styles.handle} numberOfLines={1} ellipsizeMode={'tail'}>{ state.handle }</Text>
      </View>
      { hostId === state.cardId && (
        <Ionicons name="server" size={16} color={Colors.grey} />
      )}
    </View>
  );
}

