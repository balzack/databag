import { KeyboardAvoidingView, FlatList, Alert, Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { styles } from './Details.styled';
import { useDetails } from './useDetails.hook';
import { Logo } from 'utils/Logo';
import Ionicons from '@expo/vector-icons/AntDesign';
import Colors from 'constants/Colors';
import { MemberItem } from './memberItem/MemberItem';

export function DetailsHeader() {
  return <Text style={styles.title}>Topic Settings</Text>
}

export function DetailsBody({ channel, clearConversation }) {

  const { state, actions } = useDetails();

  const saveSubject = async () => {
    try {
      await actions.saveSubject();
      actions.hideEditSubject();
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Save Subject',
        'Please try again.'
      )
    }
  }

  return (
    <View style={styles.body}>
      <View style={styles.details}>
        <Logo src={state.logo} width={72} height={72} radius={8} />
        <View style={styles.info}>
          <TouchableOpacity style={styles.subject} onPress={actions.showEditSubject}>
            <Text style={styles.subject}>{ state.subject }</Text>
            { !state.hostId && (
              <Ionicons name="edit" size={16} color={Colors.text} />
            )}
          </TouchableOpacity>
          <Text style={styles.created}>{ state.created }</Text>
          <Text style={styles.mode}>{ state.hostId ? 'guest' : 'host' }</Text>
        </View>  
      </View>

      <View style={styles.controls}>
        { !state.hostId && (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Delete Topic</Text>
          </TouchableOpacity>
        )}
        { !state.hostId && (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Edit Membership</Text>
          </TouchableOpacity>
        )}
        { state.hostId && (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Leave Topic</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.members}>
        <Text style={styles.membersLabel}>Members:</Text>
        { state.count - state.contacts.length > 0 && (
          <Text style={styles.unknown}> (+ {state.count - state.contacts.length} unknown)</Text>
        )}
      </View>

      <FlatList style={styles.cards}
        data={state.contacts}
        renderItem={({ item }) => <MemberItem hostId={state.hostId} item={item} />}
        keyExtractor={item => item.cardId}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={state.editSubject}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideEditSubject}
      >
        <KeyboardAvoidingView behavior="height" style={styles.editWrapper}>
          <View style={styles.editContainer}>
            <Text style={styles.editHeader}>Edit Subject:</Text>
            <View style={styles.inputField}>
              <TextInput style={styles.input} value={state.subjectUpdate} onChangeText={actions.setSubjectUpdate}
                  autoCapitalize="words" placeholder="Subject" />
            </View>
            <View style={styles.editControls}>
              <TouchableOpacity style={styles.cancel} onPress={actions.hideEditSubject}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.save} onPress={saveSubject}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  )
}

export function Details({ channel, clearConversation }) {
  return (
    <View>
      <Text>DETAILS</Text>
      <DetailsBody channel={channel} clearConversation={clearConversation} />
    </View>
  )
}

