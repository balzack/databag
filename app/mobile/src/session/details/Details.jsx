import { ActivityIndicator, KeyboardAvoidingView, FlatList, Alert, Modal, View, Text, Switch, TouchableOpacity, TextInput } from 'react-native';
import { styles } from './Details.styled';
import { useDetails } from './useDetails.hook';
import { Logo } from 'utils/Logo';
import AntIcons from 'react-native-vector-icons/AntDesign';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from 'constants/Colors';
import { MemberItem } from './memberItem/MemberItem';
import { BlurView } from '@react-native-community/blur';
import { InputField } from 'utils/InputField';

export function Details({ channel, clearConversation }) {

  const { state, actions } = useDetails();

  const toggle = async (cardId, selected) => {
    try {
      if (selected) {
        await actions.clearCard(cardId);
      }
      else {
        await actions.setCard(cardId);
      }
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        state.strings.error,
        state.strings.tryAgain,
      );
    }
  };

  const saveSubject = async () => {
    try {
      await actions.saveSubject();
      actions.hideEditSubject();
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        state.strings.error,
        state.strings.tryAgain,
      );
    }
  }

  const setNotifications = async (notify) => {
    try {
      await actions.setNotifications(notify);
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        state.strings.error,
        state.strings.tryAgain,
      );
    }
  }

  const remove = () => {
    Alert.alert(
      "Removing Topic",
      "Confirm?",
      [
        { text: "Cancel",
          onPress: () => {},
        },
        { text: "Remove",
          onPress: async () => {
            try {
              await actions.remove(); 
              clearConversation();
            }
            catch (err) {
              console.log(err);
              Alert.alert(
                'Failed to Delete Topic',
                'Please try again.'
              )
            }
          },
        }
      ]
    );
  }

  const block = () => {
    Alert.alert(
      "Blocking Topic",
      "Confirm?",
      [
        { text: "Cancel",
          onPress: () => {},
        },
        { text: "Block",
          onPress: async () => {
            try {
              await actions.block();
              clearConversation();
            }
            catch (err) {
              console.log(err);
              Alert.alert(
                'Failed to Block Topic',
                'Please try again.'
              )
            }
          },
        }
      ]
    );
  }


  const report = () => {
    Alert.alert(
      "Report Topic",
      "Confirm?",
      [
        { text: "Cancel",
          onPress: () => {},
        },
        { text: "Report",
          onPress: async () => {
            try {
              await actions.report();
            }
            catch (err) {
              console.log(err);
              Alert.alert(
                'Failed to Report Topic',
                'Please try again.'
              )
            }
          },
        }
      ]
    );
  }

  return (
    <View style={styles.body}>
      <View style={styles.details}>
        <Logo src={state.logo} width={72} height={72} radius={8} />
        <View style={styles.info}>
          <View style={styles.subject}>
            { state.locked && !state.unlocked && (
              <AntIcons name="lock" style={styles.subjectIcon} size={16} color={Colors.text} />
            )}
            { state.locked && state.unlocked && (
              <MatIcons name="lock-open-variant-outline" style={styles.subjectIcon} size={16} color={Colors.text} />
            )}
            <Text style={styles.subjectText} numberOfLines={1} ellipsizeMode={'tail'}>{ state.subject }</Text>
            { !state.hostId && (!state.locked || state.unlocked) && (
              <TouchableOpacity onPress={actions.showEditSubject}>
                <AntIcons name="edit" size={16} color={Colors.text} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.created}>{ state.timestamp }</Text>
          <Text style={styles.mode}>{ state.hostId ? state.strings.guest : state.strings.host }</Text>
        </View>  
      </View>

      <View style={styles.controls}>
        { !state.hostId && (
          <TouchableOpacity style={styles.button} onPress={remove}>
            { state.deleteBusy && (
              <ActivityIndicator color={Colors.white} />
            )}
            { !state.deleteBusy && (
              <Text style={styles.buttonText}>Delete Topic</Text>
            )}
          </TouchableOpacity>
        )}
        { state.hostId && (
          <TouchableOpacity style={styles.button} onPress={remove}>
            { state.deleteBusy && (
              <ActivityIndicator color={Colors.white} />
            )}
            { !state.deleteBusy && (
              <Text style={styles.buttonText}>Leave Topic</Text>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={block}>
          { state.blockBusy && (
            <ActivityIndicator color={Colors.white} />
          )}
          { !state.blockBusy && (
            <Text style={styles.buttonText}>Block Topic</Text>
          )}
        </TouchableOpacity>
        { state.hostId && (
          <TouchableOpacity style={styles.button} onPress={report}>
            <Text style={styles.buttonText}>Report Topic</Text>
          </TouchableOpacity>
        )}
        { !state.hostId && !state.locked && (
          <TouchableOpacity style={styles.button} onPress={actions.showEditMembers}>
            <Text style={styles.buttonText}>Edit Membership</Text>
          </TouchableOpacity>
        )}

        <View style={styles.notify}>
          <TouchableOpacity onPress={() => setNotifications(!state.notification)} activeOpacity={1}>
            <Text style={styles.notifyText}>{ state.strings.enableNotifications }</Text>
          </TouchableOpacity>
          { state.notification != null && (
            <Switch style={styles.switch} value={state.notification} onValueChange={setNotifications} trackColor={styles.track}/>
          )}
        </View>

      </View>

      <View style={styles.members}>
        <Text style={styles.membersLabel}>{ state.strings.members }</Text>
        { state.count - state.members.length > 0 && (
          <Text style={styles.unknown}> (+ {state.count - state.contacts.length} unknown)</Text>
        )}
      </View>

      <FlatList style={styles.cards}
        data={state.members}
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
        <View style={styles.modalOverlay}>
          <BlurView style={styles.modalOverlay} blurType={Colors.overlay} blurAmount={2} reducedTransparencyFallbackColor="black" />
          <KeyboardAvoidingView style={styles.modalBase} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.modalContainer}>
              <Text style={styles.editHeader}>{ state.strings.editSubject }</Text>

              <InputField
                label={state.strings.subject}
                value={state.subjectUpdate}
                autoCapitalize={'words'}
                spellCheck={false}
                style={styles.field}
                onChangeText={actions.setSubjectUpdate}
              />

              <View style={styles.editControls}>
                <TouchableOpacity style={styles.close} onPress={actions.hideEditSubject}>
                  <Text style={styles.closeText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.save} onPress={saveSubject}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={state.editMembers}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideEditMembers}
      >
        <View style={styles.modalOverlay}>
          <BlurView style={styles.modalOverlay} blurType={Colors.overlay} blurAmount={2} reducedTransparencyFallbackColor="black" />
          <KeyboardAvoidingView style={styles.modalBase} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.modalContainer}>
              <Text style={styles.editHeader}>{ state.strings.topicMembers }</Text>
              <FlatList style={styles.editMembers}
                data={state.connected}
                renderItem={({ item }) => <MemberItem item={item} toggle={toggle} />}
                keyExtractor={item => item.cardId}
              />
              <View style={styles.editControls}>
                <TouchableOpacity style={styles.close} onPress={actions.hideEditMembers}>
                  <Text style={styles.closeText}>{ state.strings.close }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

    </View>
  )
}


