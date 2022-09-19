import { useState, useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export function Contact({ navigation, closeContact }) {

  const onPressCard = () => {
    closeContact();
  }

  return <TouchableOpacity onPress={onPressCard}><Text>CLOSE</Text></TouchableOpacity>
}

