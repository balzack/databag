import { FlatList, View, Alert, TouchableOpacity, Text } from 'react-native';
import { styles } from './BlockedMessages.styled';
import { useBlockedMessages } from './useBlockedMessages.hook';
import { Logo } from 'utils/Logo';

export function BlockedMessages() {

  const { state, actions } = useBlockedMessages();

  const unblock = (cardId, channelId, topicId) => {
    Alert.alert(
      'Unblocking Message',
      'Confirm?',
      [
        { text: "Cancel", onPress: () => {}, },
        { text: "Unblock", onPress: () => actions.unblock(cardId, channelId, topicId) },
      ],
    );
  };

  const BlockedItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => unblock(item.cardId, item.channelId, item.topicId)}>
        <View style={styles.detail}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{ item.name }</Text>
          <Text style={styles.created} numberOfLines={1} ellipsizeMode={'tail'}>{ item.timestamp }</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      { state.messages.length === 0 && (
        <Text style={styles.default}>No Blocked Messages</Text>
      )}
      { state.messages.length !== 0 && (
        <FlatList 
          data={state.messages}
          renderItem={({item}) => <BlockedItem item={item} />}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
}

