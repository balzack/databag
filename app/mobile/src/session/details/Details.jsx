import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './Details.styled';

export function DetailsHeader({ channel }) {
  return <Text style={styles.title}>Details</Text>
}

export function DetailsBody({ channel, clearConversation }) {
  return (
    <TouchableOpacity onPress={clearConversation}>
      <Text>CLEAR</Text>
    </TouchableOpacity>
  )
}

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

