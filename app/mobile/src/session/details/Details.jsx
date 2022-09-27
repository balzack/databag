import { View, Text, TouchableOpacity } from 'react-native';

export function Details({ channel, closeDetails }) {
  return (
    <View>
      <Text>DETAILS</Text>
      { channel && (
        <>
          <Text>{ channel.cardId }</Text>
          <Text>{ channel.channelId }</Text>
        </>
      )}
      <TouchableOpacity onPress={closeDetails}>
        <Text>CLOSE</Text>
      </TouchableOpacity>
    </View>
  )
}

