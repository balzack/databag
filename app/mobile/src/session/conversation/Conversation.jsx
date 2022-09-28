import { View, TouchableOpacity, Text } from 'react-native';
import { useConversation } from './useConversation.hook';
import { styles } from './Conversation.styled';
import { useNavigation } from '@react-navigation/native';

export function ConversationHeader({ channel, closeConversation, openDetails }) {
  const navigation = useNavigation();
  const { state, actions } = useConversation();

  const setDetails = () => {
    openDetails(navigation);
  };
  const clearConversation = () => {
    closeConversation(navigation);
  };

  return (
    <View style={styles.title}>
      <TouchableOpacity onPress={clearConversation}>
        <Text>CLOSE</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={setDetails}>
        <Text>DETAILS</Text>
      </TouchableOpacity>
    </View>
  );
}
  
export function ConversationBody({ channel }) {
  const { state, actions } = useConversation();

  return (
    <View> 
      <Text>CHANNEL</Text>
      { channel && (
        <>
          <Text>{ channel.cardId }</Text>
          <Text>{ channel.channelId }</Text>
        </>
      )}
    </View>
  );
}

export function Conversation({ channel, closeConversation, openDetails }) {
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ConversationHeader channel={channel} closeConversation={closeConversation} openDetails={openDetails} />
      </View>
      <View style={styles.body}>
        <ConversationBody channel={channel} />
      </View>
    </View>
  );
}
