import { Alert, Keyboard, KeyboardAvoidingView, ActivityIndicator, Modal, Platform, TextInput, View, TouchableOpacity, Text, } from 'react-native';
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

export function ConversationHeader({ closeConversation, openDetails, state, actions }) {
  const navigation = useNavigation();

  const setDetails = () => {
    openDetails(navigation);
  };
  const clearConversation = () => {
    closeConversation(navigation);
  };

  return (
    <View style={styles.title}>
      <TouchableOpacity style={styles.subject} activeOpacity={1} onPress={actions.resync}>
        <View style={styles.icon} />
        { state.more && !state.latched && (
          <ActivityIndicator size="small" color={Colors.primary} />
        )}
        { (!state.more || state.latched) && (
          <Text style={styles.subjectText} numberOfLines={1} ellipsizeMode={'tail'}>{ state.subject }</Text>
        )}
        <View style={styles.icon}>
          { state.error && (
            <Ionicons name="exclamationcircleo" size={16} color={Colors.alert} />
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.action} onPress={setDetails}>
        <Ionicons name="setting" size={26} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

export function ConversationBody({ state, actions }) {
  const ref = useRef();

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardWillShow", () => {
      actions.setKeyboard();
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      actions.clearKeyboard();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const latch = () => {
    if (!state.momentum) {
      actions.latch();
      ref.current.scrollToIndex({ animated: true, index: 0 });
    }
  }

  const updateTopic = async () => {
    try {
      await actions.updateTopic();
      actions.hideEdit();
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Update Message',
        'Please try again.',
      )
    }
  }

  const noop = () => {};

  return (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={72}
          enabled={Platform.OS === 'ios' ? state.keyboard : false}>
<View style={styles.thread}>
        { state.topics.length === 0 && (
          <View style={styles.empty}>
            { state.init && (
              <Text style={styles.emptyText}>No Messages</Text>
            )}
          </View>
        )}
        { state.topics.length !== 0 && (
          <FlatList style={styles.conversation}
             contentContainerStyle={styles.topics}
             ref={ref}
             data={state.topics}
             onEndReached={actions.loadMore}
             onMomentumScrollEnd={ Platform.OS === 'ios' ? noop : actions.unlatch }
             onScrollBeginDrag={ Platform.OS !== 'ios' ? noop : actions.unlatch }
             maintainVisibleContentPosition={ state.latched ? null : { minIndexForVisibile: 2, } }
             inverted={true}
             initialNumToRender={16}
             renderItem={({item}) => <TopicItem item={item} focused={item.topicId === state.focus} 
               focus={() => actions.setFocus(item.topicId)} hosting={state.host == null}
               sealed={state.sealed} sealKey={state.sealKey}
               remove={actions.removeTopic} update={actions.editTopic} block={actions.blockTopic}
               report={actions.reportTopic} />}
            keyExtractor={item => item.topicId}
          />
        )}
        { !state.init && state.delayed && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}
        <View>
          { (!state.locked || state.sealKey) && (
            <AddTopic sealed={state.locked} sealKey={state.sealKey} />
          )}
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
              <TouchableOpacity style={styles.save} onPress={updateTopic}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

</View>
      </KeyboardAvoidingView>
  );
}

export function Conversation({ closeConversation, openDetails }) {
  const { state, actions } = useConversation();

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['right', 'top']} style={styles.header}>
        <Text style={styles.subjectText} numberOfLines={1} ellipsizeMode={'tail'}>{ state.subject }</Text>
        <TouchableOpacity style={styles.action} onPress={openDetails}>
          <Ionicons name="setting" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.close} onPress={closeConversation}>
          <Ionicons name="close" size={20} color={Colors.text} />
        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView edges={['bottom']} style={styles.body}>
        <ConversationBody state={state} actions={actions} />
      </SafeAreaView>
    </View>
  );
}
