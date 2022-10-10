import { Text, TouchableOpacity, View } from 'react-native';
import { Logo } from 'utils/Logo';
import { styles } from './MemberItem.styled';

export function MemberItem({ item, openContact }) {
  
  const select = () => {
    openContact({ card: item.cardId });
  };

  return (
    <View style={styles.container}>
      <Logo src={item.logo} width={32} height={32} radius={6} />
      <View style={styles.detail}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{ item.name }</Text>
        <Text style={styles.handle} numberOfLines={1} ellipsizeMode={'tail'}>{ item.handle }</Text>
      </View>
    </View>
  );
}

