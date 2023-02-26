import { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { styles } from './Channels.styled';
import { useChannels } from './useChannels.hook';
import { Colors } from 'constants/Colors';

export function Channels({ navigation, openConversation }) {

  const { state, actions } = useChannels();

  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={styles.title}>
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="search1" size={16} color={Colors.disabled} />
              <TextInput style={styles.inputfield} value={state.filter} onChangeText={actions.setFilter}
                  autoCapitalize="none" placeholderTextColor={Colors.disabled}  placeholder="Topics" />
            </View>
            <TouchableOpacity style={styles.addtop} onPress={actions.showAdding}>
              <Ionicons name={'message1'} size={16} color={Colors.white} style={[styles.box, { transform: [ { rotateY: "180deg" }, ]} ]}/>
              <Text style={styles.addtext}>New</Text>
            </TouchableOpacity>
          </View>
        ),
      });
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      { !navigation && (
        <View style={styles.columntop}>
          <View style={styles.inputwrapper}>
            <Ionicons style={styles.icon} name="search1" size={16} color={Colors.disabled} />
            <TextInput style={styles.inputfield} value={state.filter} onChangeText={actions.setFilter}
                autoCapitalize="none" placeholderTextColor={Colors.disabled}  placeholder="Topics" />
          </View>
        </View>
      )}
      <View style={styles.content}>
        <Text>Channels</Text>
      </View>
      { !navigation && (
        <View style={styles.columnbottom}>
          <TouchableOpacity style={styles.addbottom} onPress={actions.showAdding}>
            <Ionicons name={'message1'} size={16} color={Colors.white} />
            <Text style={styles.addtext}>New Topic</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

