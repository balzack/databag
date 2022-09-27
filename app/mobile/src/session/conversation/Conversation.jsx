import { View, TouchableOpacity, Text } from 'react-native';

export function Conversation({ channel, closeConversation, openDetails }) {
  
  return (
    <View>
      <Text>CHANNEL</Text>
      { channel && (
        <>
          <Text>{ channel.cardId }</Text>
          <Text>{ channel.channelId }</Text>
        </>
      )}
      <TouchableOpacity onPress={openDetails}>
        <Text>DETAILS</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={closeConversation}>
        <Text>CLOSE</Text>
      </TouchableOpacity>
    </View>
  );
}

