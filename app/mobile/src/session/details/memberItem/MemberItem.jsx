import { TouchableOpacity, Switch, Text, View } from 'react-native';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './MemberItem.styled';
import { Logo } from 'utils/Logo';
import { Colors } from 'constants/Colors';

export function MemberItem({ item, hostId, toggle }) {

  const select = () => {
    if (toggle) {
      toggle(item.cardId, item.selected);
    }
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={select}>
      <Logo src={item.logo} width={32} height={32} radius={6} />
      <View style={styles.detail}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{ item.name }</Text>
        <Text style={styles.handle} numberOfLines={1} ellipsizeMode={'tail'}>{ item.handle }</Text>
      </View>
      { hostId === item.cardId && (
        <MatIcons name="server" size={20} color={Colors.grey} />
      )}
      { toggle && (
        <Switch style={styles.switch} trackColor={styles.track} value={item.selected} onValueChange={select} />
      )}
    </TouchableOpacity>
  );
}

