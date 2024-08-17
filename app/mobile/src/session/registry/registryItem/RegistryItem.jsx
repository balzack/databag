import { Text, TouchableOpacity, View } from 'react-native';
import { Logo } from '../../../utils/Logo';
import { styles } from './RegistryItem.styled';
import { useRegistryItem } from './useRegistryItem.hook';

export function RegistryItem({ item, openContact }) {
  
  const { state, actions } = useRegistryItem(item);
  const handle = item.node ? `${item.handle}i@${item.node}` : item.handle;

  const select = () => {
    const { guid, name, handle, node, location, description, imageSet } = item;
    const contact = { guid, name, handle, node, location, description, imageSet };
    openContact(contact);
  }

  return (
    <View>
      { item.guid && (
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={select}>
          <Logo src={item.logo} width={48} height={48} radius={6} />
          <View style={styles.detail}>
            <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit={true}>{ item.name }</Text>
            <Text style={styles.handle} numberOfLines={1} adjustsFontSizeToFit={true}>{ item.username }</Text>
          </View>
        </TouchableOpacity>
      )}
      { !item.guid && (
        <View style={styles.space} />
      )}
    </View>
  );
}

