import { useContext } from 'react';
import { Switch, Alert, FlatList, Modal, KeyboardAvoidingView, ScrollView, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { styles } from './Channels.styled';
import { useChannels } from './useChannels.hook';
import Ionicons from '@expo/vector-icons/AntDesign';
import { ChannelItem } from './channelItem/ChannelItem';
import Colors from 'constants/Colors';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AddMember } from './addMember/AddMember';

export function ChannelsTitle({ state, actions }) {
  return (
    <View style={styles.title}>
      <View style={styles.inputwrapper}>
        <Ionicons style={styles.icon} name="search1" size={16} color={Colors.disabled} />
        <TextInput style={styles.inputfield} value={state.filter} onChangeText={actions.setFilter}
            autoCapitalize="none" placeholderTextColor={Colors.disabled}  placeholder="Topics" />
        <View style={styles.space} />
      </View>
      <TouchableOpacity style={styles.add} onPress={actions.showAdding}>
        <Ionicons name={'message1'} size={16} color={Colors.white} style={[styles.box, { transform: [ { rotateY: "180deg" }, ]} ]}/>
        <Text style={styles.newtext}>New</Text>
      </TouchableOpacity>
    </View>
  );
}

export function ChannelsBody({ state, actions, openConversation }) {

  const addTopic = async () => {
    try {
      const channel = await actions.addTopic();
      actions.hideAdding();
      openConversation(null, channel.id)
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Create Topic',
        'Please try again.'
      )
    }
  }

  return (
    <>
      { state.channels.length == 0 && (
        <View style={styles.notfound}>
          <Text style={styles.notfoundtext}>No Topics Found</Text>
        </View>
      )}
      { state.channels.length > 0 && (
        <FlatList style={styles.channels}
          data={state.channels}
          initialNumToRender={25}
          renderItem={({ item }) => <ChannelItem item={item} openConversation={openConversation} />}
          keyExtractor={item => (`${item.cardId}:${item.channelId}`)}
        />
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.adding}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideAdding}
      >
        <KeyboardAvoidingView behavior="height" style={styles.addWrapper}>
          <View style={styles.addContainer}>
            <Text style={styles.addHeader}>New Topic:</Text>
            <View style={styles.inputField}>
              <TextInput style={styles.input} value={state.addSubject} onChangeText={actions.setAddSubject}
                  autoCapitalize="words" placeholder="Subject (optional)" placeholderTextColor={Colors.grey} />
            </View>
            <Text style={styles.label}>Members:</Text>
            { state.contacts.length == 0 && (
              <View style={styles.emptyMembers}>
                <Text style={styles.empty}>No Connected Contacts</Text>
              </View>
            )}
            { state.contacts.length > 0 && (
              <FlatList style={styles.addMembers}
                data={state.contacts}
                renderItem={({ item }) => <AddMember members={state.addMembers} item={item}
                    setCard={actions.setAddMember} clearCard={actions.clearAddMember} />}
                keyExtractor={item => item.cardId}
              />
            )}
            <View style={styles.addControls}>
              <View style={styles.sealed}>
                { state.sealable && (
                  <>
                    <Switch style={styles.switch} trackColor={styles.track}
                      value={state.sealed} onValueChange={actions.setSealed} />
                    <Text style={styles.sealedText}>Sealed</Text>
                  </>
                )}
              </View>
              <TouchableOpacity style={styles.cancel} onPress={actions.hideAdding}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.save} onPress={addTopic}>
                <Text style={styles.saveText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

export function Channels({ openConversation }) {
  const { state, actions } = useChannels();

  const addTopic = async () => {
    try {
      const channel = await actions.addTopic();
      actions.hideAdding();
      openConversation(null, channel.id)
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Create Topic',
        'Please try again.'
      )
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['left']} style={styles.searchbar}>
        <View style={styles.inputwrapper}>
          <Ionicons style={styles.icon} name="search1" size={16} color={Colors.disabled} />
          <TextInput style={styles.inputfield} value={state.topic} onChangeText={actions.setTopic}
              autoCapitalize="none" placeholderTextColor={Colors.disabled} placeholder="Topics" />
          <View style={styles.space} />
        </View>
      </SafeAreaView>
      <SafeAreaView style={styles.channels} edges={['left']}>
        { state.channels.length == 0 && (
          <View style={styles.notfound}>
            <Text style={styles.notfoundtext}>No Topics Found</Text>
          </View>
        )}
        { state.channels.length != 0 && (
          <FlatList 
            data={state.channels}
            initialNumToRender={25}
            renderItem={({ item }) => <ChannelItem item={item} openConversation={openConversation} />}
            keyExtractor={item => (`${item.cardId}:${item.channelId}`)}
          />
        )}
      </SafeAreaView>
      <SafeAreaView style={styles.bottomArea} edges={['left']}>
        <TouchableOpacity style={styles.addbottom} onPress={actions.showAdding}>
          <Ionicons name={'message1'} size={16} color={Colors.white} />
          <Text style={styles.newtext}>New Topic</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.adding}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideAdding}
      >
        <KeyboardAvoidingView behavior="height" style={styles.addWrapper}>
          <View style={styles.addContainer}>
            <Text style={styles.addHeader}>New Topic:</Text>
            <View style={styles.inputField}>
              <TextInput style={styles.input} value={state.addSubject} onChangeText={actions.setAddSubject}
                  autoCapitalize="words" placeholder="Subject (optional)" placeholderTextColor={Colors.grey} />
            </View>
            <Text style={styles.label}>Members:</Text>
            { state.contacts.length == 0 && (
              <View style={styles.emptyMembers}>
                <Text style={styles.empty}>No Connected Contacts</Text>
              </View>
            )}
            { state.contacts.length > 0 && (
              <FlatList style={styles.addMembers}
                data={state.contacts}
                renderItem={({ item }) => <AddMember members={state.addMembers} item={item}
                    setCard={actions.setAddMember} clearCard={actions.clearAddMember} />}
                keyExtractor={item => item.cardId}
              />
            )}
            <View style={styles.addControls}>
              <View style={styles.sealed}>
                { state.sealable && (
                  <>
                    <Switch style={styles.switch} trackColor={styles.track}
                      value={state.sealed} onValueChange={actions.setSealed} />
                    <Text>Sealed</Text>
                  </>
                )}
              </View>
              <TouchableOpacity style={styles.cancel} onPress={actions.hideAdding}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.save} onPress={addTopic}>
                <Text style={styles.saveText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

