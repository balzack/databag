import { Text, TouchableOpacity, View } from 'react-native';
import { Logo } from 'utils/Logo';
import { styles } from './RegistryItem.styled';
import { useRegistryItem } from './useRegistryItem.hook';

export function RegistryItem({ item }) {
  
  const { state, actions } = useRegistryItem(item);

  return (
    <View>
      { item.guid && (
        <TouchableOpacity style={styles.container} activeOpacity={1}>
          <Logo src={item.logo} width={32} height={32} radius={6} />
          <View style={styles.detail}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{ item.name }</Text>
            <Text style={styles.handle} numberOfLines={1} ellipsizeMode={'tail'}>{ item.handle }</Text>
          </View>
        </TouchableOpacity>
      )}
      { !item.guid && (
        <View style={styles.space} />
      )}
    </View>
  );
}

