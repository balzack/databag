import { KeyboardAvoidingView, Modal, Platform, TextInput, View, TouchableOpacity, Text, } from 'react-native';
import { FlatList, ScrollView } from '@stream-io/flat-list-mvcp';
import { memo, useState, useRef, useEffect } from 'react';
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
console.log(state.editing);


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

export function ConversationBody() {
  const { state, actions } = useConversation();

  const ref = useRef();

  const latch = () => {
    if (!state.momentum) {
      actions.latch();
      ref.current.scrollToIndex({ animated: true, index: 0 });
    }
  }

  const noop = () => {};

  return (
      <KeyboardAvoidingView style={styles.thread} behavior="padding" keyboardVerticalOffset="100"
          enabled={Platform.OS === 'ios' ? true : false}>
        <FlatList style={styles.conversation}
           contentContainerStyle={styles.topics}
           ref={ref}
           data={state.topics}
           onMomentumScrollEnd={ Platform.OS === 'ios' ? noop : actions.unlatch }
           onScrollBeginDrag={ Platform.OS !== 'ios' ? noop : actions.unlatch }
           maintainVisibleContentPosition={ state.latched ? null : { minIndexForVisibile: 2, } }
           inverted={true}
           renderItem={({item}) => <TopicItem item={item} focused={item.topicId === state.focus} 
             focus={() => actions.setFocus(item.topicId)} hosting={state.host == null} 
             remove={actions.removeTopic} update={actions.editTopic} block={actions.blockTopic} />}
          keyExtractor={item => item.topicId}
        />
        <View>
          <AddTopic />
          <View style={styles.latchbar}>
            { !state.latched && (
              <TouchableOpacity style={styles.latch} onPress={latch}>
                <Ionicons name="unlock" size={16} color={Colors.primary} />
              </TouchableOpacity>
            )} 
          </View>
        </View>
      <Modal
          animationType="fade"
          transparent={true}
          visible={state.editing}
          supportedOrientations={['portrait', 'landscape']}
          onRequestClose={actions.hideEdit}
      >
        <KeyboardAvoidingView behavior="height" style={styles.modal}>
          <View style={styles.editContainer}>
            <Text style={styles.editHeader}>Edit Message Text:</Text>
            <View style={styles.inputField}>
              <TextInput style={styles.input} value={state.editMessage} onChangeText={actions.setEditMessage}
                  autoCapitalize="sentences" placeholder="Message Text" multiline={true} />
            </View>
            <View style={styles.editControls}>
              <TouchableOpacity style={styles.cancel} onPress={actions.hideEdit}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.save} onPress={actions.updateTopic}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      </KeyboardAvoidingView>
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
