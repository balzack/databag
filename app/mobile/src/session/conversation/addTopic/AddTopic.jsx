import { TextInput, View, TouchableOpacity, Text, } from 'react-native';
import { useState, useRef } from 'react';
import { useAddTopic } from './useAddTopic.hook';
import { styles } from './AddTopic.styled';
import Ionicons from '@expo/vector-icons/AntDesign';
import Colors from 'constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export function AddTopic() {

  const { state, actions } = useAddTopic();

  return (
    <SafeAreaView style={styles.add} edges={['right']}>
      <TextInput style={styles.input} value={state.message} onChangeText={actions.setMessage}
          autoCapitalize="sentences" placeholder="New Message" multiline={true} />
      <View style={styles.addButtons}>
        <View style={styles.addButton}>
          <Ionicons name="picture" size={20} color={Colors.text} />
        </View>
        <View style={styles.addButton}>
          <Ionicons name="videocamera" size={20} color={Colors.text} />
        </View>
        <View style={styles.addButton}>
          <Ionicons name="sound" size={20} color={Colors.text} />
        </View>
        <View style={styles.space}></View>
      </View>
    </SafeAreaView>
  );
}

