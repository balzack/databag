import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import { useState, useRef } from 'react';
import { useConversation } from './useConversation.hook';
import { styles } from './Conversation.styled';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/AntDesign';
import Colors from 'constants/Colors';

export function ConversationHeader({ channel, closeConversation, openDetails }) {
  const navigation = useNavigation();
  const { state, actions } = useConversation(channel?.cardId, channel?.channelId);

  const setDetails = () => {
    openDetails(navigation);
  };
  const clearConversation = () => {
    closeConversation(navigation);
  };

  return (
    <View style={styles.title}>
      <View style={styles.subject}>
        <Text style={styles.subjectText}>{ state.subject }</Text>
      </View>
      <TouchableOpacity style={styles.action} onPress={setDetails}>
        <Ionicons name="setting" size={20} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
}
  
export function ConversationBody({ channel }) {
  const { state, actions } = useConversation(channel?.cardId, channel?.channelId);

  return (
    <FlatList style={styles.topics}
      data={state.topics}
      inverted={true}
      renderItem={({item}) => <View style={{ height: item.id }}><Text>ITEM { item.id }</Text></View>}
      keyExtractor={item => item.id}
    />
  );
}

export function Conversation({ channel, closeConversation, openDetails }) {
  
  const { state, actions } = useConversation(channel?.cardId, channel?.channelId);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subjectText}>{ state.subject }</Text>
        <TouchableOpacity style={styles.action} onPress={openDetails}>
          <Ionicons name="setting" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <ConversationBody channel={channel} />
      </View>
    </View>
  );
}
