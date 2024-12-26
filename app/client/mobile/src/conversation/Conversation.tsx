import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {styles} from './Conversation.styled';
import {useConversation} from './useConversation.hook';

export function Conversation({close}: {close: ()=>void}) {
  const { state, actions } = useConversation();

  return <TouchableOpacity onPress={close}><Text>CONVERSATION</Text></TouchableOpacity>;
}
