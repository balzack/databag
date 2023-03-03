import { useRef, useEffect, useState, useContext } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { ConversationContext } from 'context/ConversationContext';
import { useConversation } from './useConversation.hook';
import { styles } from './Conversation.styled';
import { Colors } from 'constants/Colors';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { Logo } from 'utils/Logo';
import { AddTopic } from './addTopic/AddTopic';
import { TopicItem } from './topicItem/TopicItem';

export function Conversation({ navigation, cardId, channelId, closeConversation, openDetails }) {

  const [ready, setReady] = useState(true);
  const conversation = useContext(ConversationContext);
  const { state, actions } = useConversation();
  const ref = useRef();

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
  }, [navigation, state.subject]);

  useEffect(() => {
    return () => { closeConversation(); };
  }, []);

  return (
    <View style={styles.container}>
      { !navigation && (
        <View style={styles.header}>
          { state.loaded && (
            <TouchableOpacity style={styles.headertitle} onPress={openDetails}>
              <Logo src={state.logo} width={32} height={32} radius={2} />
              <Text style={styles.titletext} numberOfLines={1} ellipsizeMode={'tail'}>{ state.subject }</Text>
              <Ionicons name={'setting'} size={24} color={Colors.primary} style={styles.titlebutton} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerclose} onPress={closeConversation}>
            <Ionicons name={'close'} size={22} color={Colors.grey} style={styles.titlebutton} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.thread}>
        <View style={styles.messages}>
          { !state.loaded && (
            <View style={styles.loading}>
              <ActivityIndicator color={Colors.grey} size="large" />
            </View>
          )}
          { state.loaded && (
            <FlatList style={styles.conversation}
               contentContainerStyle={styles.topics}
               data={state.topics}
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
        </View>
        <AddTopic />
      </View>
    </View>
  );
}
