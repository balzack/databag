import { useContext } from 'react';
import { FlatList, ScrollView, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { styles } from './Channels.styled';
import { useChannels } from './useChannels.hook';
import Ionicons from '@expo/vector-icons/AntDesign';
import { ChannelItem } from './channelItem/ChannelItem';
import Colors from 'constants/Colors';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export function Channels() {
  const { state, actions } = useChannels();
  return (
    <View style={styles.container}>
      { state.tabbed && (
        <>
          <View style={styles.topbar}>
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="search1" size={16} color={Colors.disabled} />
              <TextInput style={styles.inputfield} value={state.filter} onChangeText={actions.setFilter}
                  autoCapitalize="none" placeholderTextColor={Colors.disabled}  placeholder="Topic" />
              <View style={styles.space} />
            </View>
            <TouchableOpacity style={styles.add}>
              <Ionicons name={'message1'} size={16} color={Colors.white} style={[styles.box, { transform: [ { rotateY: "180deg" }, ]} ]}/>
              <Text style={styles.newtext}>New</Text>
            </TouchableOpacity>
          </View>
          <FlatList style={styles.channels}
            data={state.channels}
            renderItem={({ item }) => <ChannelItem item={item} />}
            keyExtractor={item => (`${item.cardId}:${item.channelId}`)}
          />
        </>
      )}
      { !state.tabbed && (
        <>
          <SafeAreaView edges={['left']} style={styles.searchbar}>
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="search1" size={16} color={Colors.disabled} />
              <TextInput style={styles.inputfield} value={state.topic} onChangeText={actions.setTopic}
                  autoCapitalize="none" placeholderTextColor={Colors.disabled} placeholder="Topic" />
              <View style={styles.space} />
            </View>
          </SafeAreaView>
          <SafeAreaView style={styles.channels} edges={['left']}>
            <FlatList 
              data={state.channels}
              renderItem={({ item }) => <ChannelItem item={item} />}
              keyExtractor={item => (`${item.cardId}:${item.channelId}`)}
            />
          </SafeAreaView>
          <SafeAreaView style={styles.bottomArea} edges={['left']}>
            <TouchableOpacity style={styles.addbottom}>
              <Ionicons name={'message1'} size={16} color={Colors.white} />
              <Text style={styles.newtext}>New Topic</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </>
      )}
    </View>
  );
}

