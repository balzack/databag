import { FlatList, View, Alert, TouchableOpacity, Text } from 'react-native';
import { styles } from './BlockedTopics.styled';
import { useBlockedTopics } from './useBlockedTopics.hook';
import { Logo } from 'utils/Logo';

export function BlockedTopics() {

  const { state, actions } = useBlockedTopics();

  const unblock = (cardId, channelId) => {
    Alert.alert(
      'Unblocking Contact',
      'Confirm?',
      [
        { text: "Cancel", onPress: () => {}, },
        { text: "Unblock", onPress: () => actions.unblock(cardId, channelId) },
      ],
    );
  };

  const BlockedItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => unblock(item.cardId, item.channelId)}>
        <View style={styles.detail}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{ item.name }</Text>
          <Text style={styles.created} numberOfLines={1} ellipsizeMode={'tail'}>{ item.created }</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      { state.channels.length === 0 && (
        <Text style={styles.default}>No Blocked Topics</Text>
      )}
      { state.channels.length !== 0 && (
        <FlatList 
          data={state.channels}
          renderItem={({item}) => <BlockedItem item={item} />}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
}

