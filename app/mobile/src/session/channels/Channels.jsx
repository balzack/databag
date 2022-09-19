import { useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { styles } from './Channels.styled';
import { useChannels } from './useChannels.hook';
import Ionicons from '@expo/vector-icons/AntDesign';

export function Channels() {

  const { state, actions } = useChannels();

  return (
    <View style={styles.container}>
      <View style={styles.inputwrapper}>
        <Ionicons style={styles.icon} name="search1" size={18} color={'#ffffff'} />
        <TextInput style={styles.inputfield} value={state.topic} onChangeText={actions.setTopic}
            autoCapitalize="none" placeholderTextColor={'#ffffff'}  placeholder="Topic" />
        <View style={styles.space} />
      </View>
    </View>
  );
}
