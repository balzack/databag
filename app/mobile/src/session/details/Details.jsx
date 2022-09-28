import { View, Text, TouchableOpacity } from 'react-native';

export function Details({ channel, clearConversation }) {
  return (
    <View>
      <Text>DETAILS</Text>
      { channel && (
        <>
          <Text>{ channel.cardId }</Text>
          <Text>{ channel.channelId }</Text>
        </>
      )}
      <TouchableOpacity onPress={clearConversation}>
        <Text>CLEAR</Text>
      </TouchableOpacity>
    </View>
  )
}

