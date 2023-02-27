import { useEffect } from 'react';
import { View, FlatList, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { styles } from './Channels.styled';
import { useChannels } from './useChannels.hook';
import { Colors } from 'constants/Colors';
import { ChannelItem } from './channelItem/ChannelItem';

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
        { state.channels.length == 0 && (
          <View style={styles.content}>
            <Text style={styles.notfoundtext}>No Topics Found</Text>
          </View>
        )}
        { state.channels.length != 0 && (
          <FlatList 
            style={styles.content}
            data={state.channels}
            initialNumToRender={25}
            renderItem={({ item }) => <ChannelItem item={item} openConversation={openConversation} />}
            keyExtractor={item => (`${item.cardId}:${item.channelId}`)}
          />
        )}
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

