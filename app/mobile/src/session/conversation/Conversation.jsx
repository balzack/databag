import { TextInput, View, TouchableOpacity, Text, } from 'react-native';
import { FlatList, ScrollView } from '@stream-io/flat-list-mvcp';
import { useState, useRef } from 'react';
import { useConversation } from './useConversation.hook';
import { styles } from './Conversation.styled';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/AntDesign';
import Colors from 'constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddTopic } from './addTopic/AddTopic';

export function ConversationHeader({ closeConversation, openDetails }) {
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
      <View style={styles.subject}>
        <Text style={styles.subjectText} numberOfLines={1} ellipsizeMode={'tail'}>{ state.subject }</Text>
      </View>
      <TouchableOpacity style={styles.action} onPress={setDetails}>
        <Ionicons name="setting" size={20} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

export function ConversationBody() {
  const { state, actions } = useConversation();

  return (
    <View style={styles.topics}>
      <FlatList
        data={state.topics}
        maintainVisibleContentPosition={{ minIndexForVisibile: 0, }}
        inverted={true}
        renderItem={({item}) => <View><Text>ITEM { item?.detail?.data }</Text></View>}
        keyExtractor={item => item.topicId}
      />
      <AddTopic />
    </View>
  );
}

export function Conversation({ closeConversation, openDetails }) {
  const { state, actions } = useConversation();

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['right']} style={styles.header}>
        <Text style={styles.subjectText} numberOfLines={1} ellipsizeMode={'tail'}>{ state.subject }</Text>
        <TouchableOpacity style={styles.action} onPress={openDetails}>
          <Ionicons name="setting" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.close} onPress={closeConversation}>
          <Ionicons name="close" size={20} color={Colors.text} />
        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView edges={['bottom']} style={styles.body}>
        <ConversationBody channel={channel} />
      </SafeAreaView>
    </View>
  );
}
