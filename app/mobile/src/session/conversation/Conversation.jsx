import { View, TouchableOpacity, Text, } from 'react-native';
import { FlatList, ScrollView } from '@stream-io/flat-list-mvcp';
import { useState, useRef } from 'react';
import { useConversation } from './useConversation.hook';
import { styles } from './Conversation.styled';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/AntDesign';
import Colors from 'constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        <Text style={styles.subjectText} numberOfLines={1} ellipsizeMode={'tail'}>{ state.subject }</Text>
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
      maintainVisibleContentPosition={{ minIndexForVisibile: 0, }}
      inverted={true}
      renderItem={({item}) => <View><Text>ITEM { item?.detail?.data }</Text></View>}
      keyExtractor={item => item.topicId}
    />
  );
}

export function Conversation({ channel, closeConversation, openDetails }) {
  
  const { state, actions } = useConversation(channel?.cardId, channel?.channelId);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subjectText} numberOfLines={1} ellipsizeMode={'tail'}>{ state.subject }</Text>
        <TouchableOpacity style={styles.action} onPress={openDetails}>
          <Ionicons name="setting" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.close} onPress={closeConversation}>
          <Ionicons name="close" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>
      <SafeAreaView edges={['bottom']} style={styles.body}>
        <ConversationBody channel={channel} />
      </SafeAreaView>
    </View>
  );
}
