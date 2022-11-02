import { FlatList, View, Alert, TouchableOpacity, Text } from 'react-native';
import { styles } from './BlockedContacts.styled';
import { useBlockedContacts } from './useBlockedContacts.hook';
import { Logo } from 'utils/Logo';

export function BlockedContacts() {

  const { state, actions } = useBlockedContacts();

  const unblock = (cardId) => {
    Alert.alert(
      'Unblocking Contact',
      'Confirm?',
      [
        { text: "Cancel", onPress: () => {}, },
        { text: "Unblock", onPress: () => actions.unblock(cardId) },
      ],
    );
  };

  const BlockedItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => unblock(item.cardId)}>
        <Logo src={item.logo} width={32} height={32} radius={6} />
        <View style={styles.detail}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{ item.name }</Text>
          <Text style={styles.handle} numberOfLines={1} ellipsizeMode={'tail'}>{ item.handle }</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      { state.cards.length === 0 && (
        <Text style={styles.default}>No Blocked Contacts</Text>
      )}
      { state.cards.length !== 0 && (
        <FlatList 
          data={state.cards}
          renderItem={({item}) => <BlockedItem item={item} />}
          keyExtractor={item => item.cardId}
        />
      )}
    </View>
  );
}

