import { TextInput, View, TouchableOpacity, Text, } from 'react-native';
import { useState, useRef } from 'react';
import { useAddTopic } from './useAddTopic.hook';
import { styles } from './AddTopic.styled';
import AntIcons from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Colors from 'constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export function AddTopic() {

  const { state, actions } = useAddTopic();

  return (
    <SafeAreaView style={styles.add} edges={['right']}>
      <TextInput style={styles.input} value={state.message} onChangeText={actions.setMessage}
          autoCapitalize="sentences" placeholder="New Message" multiline={true} />
      <View style={styles.addButtons}>
        <TouchableOpacity style={styles.addButton}>
          <AntIcons name="picture" size={20} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="video-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="music-box-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="format-size" size={20} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="palette-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.space} />
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="send-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

