import { TextInput, View, TouchableOpacity, Text, } from 'react-native';
import { FlatList, ScrollView } from '@stream-io/flat-list-mvcp';
import { useState, useRef, useEffect } from 'react';
import { useConversation } from './useConversation.hook';
import { styles } from './Conversation.styled';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/AntDesign';
import Colors from 'constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddTopic } from './addTopic/AddTopic';
import { TopicItem } from './topicItem/TopicItem';

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
        <Ionicons name="setting" size={26} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

function show(arg) {
  console.log(arg);
}

export function ConversationBody() {
  const { state, actions } = useConversation();

  const ref = useRef();

  const latch = () => {
    if (!state.momentum) {
      actions.latch();
      ref.current.scrollToIndex({ animated: false, index: 0 });
    }
  }

  return (
    <View style={styles.topics}>
      <FlatList
        ref={ref}
        data={state.topics}
        onMomentumScrollEnd={actions.unlatch}
        maintainVisibleContentPosition={ state.latched ? null : { minIndexForVisibile: 2, } }
        inverted={true}
        renderItem={({item}) => (<TopicItem item={item} />)}
        keyExtractor={item => item.topicId}
      />
      <View>
        <AddTopic />
        <View style={styles.latchbar}>
          { !state.latched && (
            <TouchableOpacity style={styles.latch} onPress={latch}>
              <Ionicons name="downcircleo" size={24} color={Colors.primary} />
            </TouchableOpacity>
          )} 
        </View>
      </View>
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
          <Ionicons name="setting" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.close} onPress={closeConversation}>
          <Ionicons name="close" size={20} color={Colors.text} />
        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView edges={['bottom']} style={styles.body}>
        <ConversationBody />
      </SafeAreaView>
    </View>
  );
}
