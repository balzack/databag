import { useEffect } from 'react';
import { Alert, ActivityIndicator, Switch, KeyboardAvoidingView, Modal, View, FlatList, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { styles } from './Channels.styled';
import { useChannels } from './useChannels.hook';
import { Colors } from 'constants/Colors';
import { ChannelItem } from './channelItem/ChannelItem';
import { AddMember } from './addMember/AddMember';

export function Channels({ cardId, channelId, navigation, openConversation }) {

  const { state, actions } = useChannels();

  const addChannel = async () => {
    try {
      const channelId = await actions.addChannel();
      actions.hideAdding();
      openConversation(null, channelId); 
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Add Topic',
        'Please try again.'
      )
    }
  };

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
          <View style={styles.notfound}>
            <Text style={styles.notfoundtext}>No Topics Found</Text>
          </View>
        )}
        { state.channels.length != 0 && (
          <FlatList 
            style={styles.content}
            data={state.channels}
            initialNumToRender={25}
            renderItem={({ item }) => <ChannelItem cardId={cardId} channelId={channelId} item={item} openConversation={openConversation} />}
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
            <View style={styles.addField}>
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
              <TouchableOpacity style={styles.save} onPress={addChannel}>
                { state.busy && (
                  <ActivityIndicator color={Colors.white} />
                )}
                <Text style={styles.saveText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

