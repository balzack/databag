import { ActivityIndicator, KeyboardAvoidingView, FlatList, Alert, Modal, View, Text, Switch, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { styles } from './Details.styled';
import { useDetails } from './useDetails.hook';
import { Logo } from 'utils/Logo';
import AntIcons from 'react-native-vector-icons/AntDesign';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from 'constants/Colors';
import { MemberItem } from './memberItem/MemberItem';
import { InputField } from 'utils/InputField';

export function Details({ channel, clearConversation }) {

  const [busy, setBusy] = useState(false);
  const { state, actions } = useDetails(clearConversation);

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

  const promptAction = (prompt, action) => {
    prompt(async () => {
      if (!busy) {
        try {
          setBusy(true);
          await action();
          setBusy(false);
        }
        catch (err) {
          console.log(err);
          setBusy(false);
          Alert.alert(
            state.strings.error,
            state.strings.tryAgain,
          );
          throw err;
        }
      }
    });
  }

  return (
    <View style={styles.body}>
      <View style={styles.details}>
        <Logo src={state.logo} width={92} height={92} radius={8} />
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

      <View style={styles.control}>
        { busy && (
          <ActivityIndicator animating={true} color={Colors.text} size={'large'} />
        )}
        { !busy && (
          <View style={styles.drawerActions}>
            { !state.hostId && !state.locked && (
              <TouchableOpacity style={styles.action} activeOpacity={1} onPress={actions.showEditMembers}>
                <MatIcons name="account-group-outline" style={styles.actionIcon} size={44} color={Colors.linkText} />
                <Text style={styles.actionLabel}>{ state.strings.members }</Text>
              </TouchableOpacity>
            )}
            { !state.hostId && (
              <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => promptAction(actions.deletePrompt, actions.removeTopic)}>
                <MatIcons name="text-box-remove-outline" style={styles.actionIcon} size={44} color={Colors.linkText} />
                <Text style={styles.actionLabel}>{ state.strings.delete }</Text>
              </TouchableOpacity>
            )}
            { state.hostId && (
              <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => promptAction(actions.leavePrompt, actions.removeTopic)}>
                <MatIcons name="text-box-minus-outline" style={styles.actionIcon} size={44} color={Colors.linkText} />
                <Text style={styles.actionLabel}>{ state.strings.leave }</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => promptAction(actions.blockPrompt, actions.blockTopic)}>
              <MatIcons name="comment-remove-outline" style={styles.actionIcon} size={44} color={Colors.linkText} />
              <Text style={styles.actionLabel}>{ state.strings.actionBlock }</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.action} activeOpacity={1} onPress={() => promptAction(actions.reportPrompt, actions.reportTopic)}>
              <MatIcons name="comment-alert-outline" style={styles.actionIcon} size={44} color={Colors.linkText} />
              <Text style={styles.actionLabel}>{ state.strings.actionReport }</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.members}>
        <Text style={styles.membersLabel}>{ state.strings.members }</Text>
        { state.unknown > 0 && (
          <Text style={styles.unknown}> (+ {state.unknown}) { state.strings.unknown }</Text>
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
          <View style={styles.blur} />
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
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
      </Modal>

    </View>
  )
}


