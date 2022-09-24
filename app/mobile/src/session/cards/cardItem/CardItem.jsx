import { Text, TouchableOpacity, View } from 'react-native';
import { Logo } from 'utils/Logo';
import { styles } from './CardItem.styled';
import { useCardItem } from './useCardItem.hook';

export function CardItem({ item }) {
  
  const { state, actions } = useCardItem(item);

  return (
    <View>
      { item.cardId && (
        <TouchableOpacity style={styles.container} activeOpacity={1}>
          <Logo src={item.logo} width={32} height={32} radius={6} />
          <View style={styles.detail}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{ item.name }</Text>
            <Text style={styles.handle} numberOfLines={1} ellipsizeMode={'tail'}>{ item.handle }</Text>
          </View>
          { item.status === 'connected' && (
            <View style={styles.confirmed} />
          )}
          { item.status === 'requested' && (
            <View style={styles.requested} />
          )}
          { item.status === 'connecting' && (
            <View style={styles.connecting} />
          )}
          { item.status === 'pending' && (
            <View style={styles.pending} />
          )}
          { item.status === 'confirmed' && (
            <View style={styles.confirmed} />
          )}
        </TouchableOpacity>
      )}
      { !item.cardId && (
        <View style={styles.space} />
      )}
    </View>
  );
}

