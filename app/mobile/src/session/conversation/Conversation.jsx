import { useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ConversationContext } from 'context/ConversationContext';
import { useConversation } from './useConversation.hook';
import { styles } from './Conversation.styled';
import { Colors } from 'constants/Colors';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { Logo } from 'utils/Logo';

export function Conversation({ navigation, cardId, channelId, closeConversation, openDetails }) {

  const conversation = useContext(ConversationContext);
  const { state, actions } = useConversation();

  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={styles.title}>
            <Text style={styles.titletext}>{ state.subject }</Text>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={openDetails}>
            <Ionicons name={'setting'} size={24} color={Colors.primary} style={styles.titlebutton} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, state.subject]);

  useEffect(() => {
    conversation.actions.setConversation(cardId, channelId);
    return () => { conversation.actions.clearConversation() };
  }, [cardId, channelId]);

  return (
    <View>
      { !navigation && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.headertitle} onPress={openDetails}>
            <Logo src={state.logo} width={32} height={32} radius={2} />
            <Text style={styles.titletext}>{ state.subject }</Text>
            <Ionicons name={'setting'} size={24} color={Colors.primary} style={styles.titlebutton} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerclose} onPress={closeConversation}>
            <Ionicons name={'close'} size={28} color={Colors.grey} style={styles.titlebutton} />
          </TouchableOpacity>
        </View>
      )}
      <Text>Conversation</Text>
    </View>
  );
}
