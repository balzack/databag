import { Text, TouchableOpacity, View } from 'react-native';
import { Logo } from 'utils/Logo';
import { styles } from './CardItem.styled';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from 'constants/Colors';

export function CardItem({ item, openContact, enableIce, call, message }) {
  
  const select = () => {
    const { guid, name, handle, node, location, description, imageSet } = item;
    const contact = { guid, name, handle, node, location, description, imageSet };
    openContact(contact);
  };

  return (
    <View>
      { item.cardId && (
        <View style={styles.container}>
          <TouchableOpacity style={styles.profile} activeOpacity={1} onPress={select}>
            <Logo src={item.logo} width={32} height={32} radius={6} />
            <View style={styles.detail}>
              <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{ item.name }</Text>
              <Text style={styles.handle} numberOfLines={1} ellipsizeMode={'tail'}>{ item.handle }</Text>
            </View>
          </TouchableOpacity>
          { item.status === 'connected' && (
            <View style={styles.options}>
              <TouchableOpacity style={styles.option} onPress={message}>
                <MatIcons name={'message-outline'} size={20} color={Colors.primary} />
              </TouchableOpacity>
              { enableIce && (
                <TouchableOpacity style={styles.option} onPress={call}>
                  <MatIcons name={'phone-outline'} size={20} color={Colors.primary} />
                </TouchableOpacity>
              )}
            </View>
          )}
          { item.status === 'connected' && item.offsync && (
            <View style={styles.offsync} />
          )}
          { item.status === 'connected' && !item.offsync && (
            <View style={styles.connected} />
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
        </View>
      )}
      { !item.cardId && (
        <View style={styles.space} />
      )}
    </View>
  );
}

