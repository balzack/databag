import { useRef, useEffect, useState, useContext } from 'react';
import { Alert, Platform, Modal, KeyboardAvoidingView, ActivityIndicator, FlatList, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { ConversationContext } from 'context/ConversationContext';
import { useConversation } from './useConversation.hook';
import { styles } from './Conversation.styled';
import { Colors } from 'constants/Colors';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { Logo } from 'utils/Logo';
import { AddTopic } from './addTopic/AddTopic';
import { TopicItem } from './topicItem/TopicItem';

export function Conversation({ navigation, cardId, channelId, closeConversation, openDetails, shareIntent, setShareIntent }) {

  const { state, actions } = useConversation();

  const loadMore = async () => {
    try {
      await actions.loadMore();
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Load More Messages',
        'Please try again',
      )
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

  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={styles.title}>
            { state.loaded && (
              <Text style={styles.titletext} numberOfLines={1} ellipsizeMode={'tail'}>{ state.subject }</Text>
            )}
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={openDetails} style={styles.titlebutton}>
            <Ionicons name={'setting'} size={24} color={Colors.primary} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, state.subject, state.loaded]);

  useEffect(() => {
    return () => { closeConversation(); };
  }, []);

  return (
    
  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={navigation ? 72 : 0}>
    <View style={styles.container}>
      { !navigation && (
        <View style={styles.header}>
          { state.loaded && (
            <TouchableOpacity style={styles.headertitle} onPress={openDetails} activeOpacity={1}>
              <Logo src={state.logo} width={32} height={32} radius={2} />
              <Text style={styles.titletext} numberOfLines={1} ellipsizeMode={'tail'}>{ state.subject }</Text>
              <Ionicons name={'setting'} size={24} color={Colors.linkText} style={styles.titlebutton} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerclose} onPress={closeConversation}>
            <Ionicons name={'close'} size={22} color={Colors.descriptionText} style={styles.titlebutton} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.thread}>
        <View style={styles.messages}>
          { !state.loaded && state.delayed && (
            <View style={styles.loading}>
              <ActivityIndicator color={Colors.grey} size="large" />
            </View>
          )}
          { state.moreBusy && state.topics.length > 32 && (
            <ActivityIndicator style={styles.more} color={Colors.primary} />
          )}
          { state.loaded && state.topics.length !== 0 && (
            <FlatList style={{ ...styles.conversation, transform: [{rotate: '180deg'}]}}
               contentContainerStyle={styles.topics}
               data={state.topics}
               initialNumToRender={16}
               onEndReached={loadMore}
               onEndReachedThreshold={0.1}
               renderItem={({item}) => <TopicItem item={item} focused={item.topicId === state.focus} 
                 focus={() => actions.setFocus(item.topicId)} hosting={state.hosted}
                 remove={actions.removeTopic} update={actions.editTopic} block={actions.blockTopic}
                 report={actions.reportTopic} contentKey={state.contentKey} /> }
              keyExtractor={item => item.topicId}
            />
          )}
          { state.loaded && state.topics.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptytext}>Empty Topic</Text>
            </View>
          )}
        </View>
        <AddTopic contentKey={state.contentKey} shareIntent={shareIntent} setShareIntent={setShareIntent} />
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
                  autoCapitalize="sentences" placeholder="Message Text" multiline={true} placeholderTextColor={Colors.grey} />
            </View>
            <View style={styles.editControls}>
              <TouchableOpacity style={styles.cancel} onPress={actions.hideEdit}>
                <Text style={styles.canceltext}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.save} onPress={updateTopic}>
                { state.updateBusy && (
                  <ActivityIndicator size="small" color={Colors.white} />
                )}
                { !state.updateBusy && (
                  <Text style={styles.saveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
      </KeyboardAvoidingView>
  );
}
