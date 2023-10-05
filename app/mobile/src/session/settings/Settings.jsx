import { useState } from 'react';
import { Linking, ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, ScrollView, View, Switch, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigate } from 'react-router-dom';
import { styles } from './Settings.styled';
import { useSettings } from './useSettings.hook';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from 'constants/Colors';
import { InputField } from 'utils/InputField';
import { Logo } from 'utils/Logo';

export function Settings({ drawer }) {

  const navigate = useNavigate();
  const [ busy, setBusy ] = useState(false);
  const { state, actions } = useSettings();

  const sealAction = async (method) => {
    if (!busy) {
      try {
        setBusy(true);
        await method();
        actions.hideEditSeal();
      }
      catch (err) {
        console.log(err);
        Alert.alert(
          state.strings.error,
          state.strings.tryAgain,
        );
      }
      setBusy(false);
    }
  };

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

  const unblock = async (action, id) => {
    if (!busy) {
      try {
        setBusy(true);
        await action(id);
      }
      catch (err) {
        console.log(err);
        Alert.alert(
          state.strings.error,
          state.strings.tryAgain,
        );
      }
      setBusy(false);
    }
  };

  const logout = async () => {
    if (!busy) {
      try {
        setBusy(true);
        await actions.logout();
      }
      catch (err) {
        console.log(err);
        Alert.alert(
          state.strings.error,
          state.strings.tryAgain,
        );
      }
      setBusy(false);
    }
  }

  const changeLogin = async () => {
    if (!busy) {
      try {
        setBusy(true);
        await actions.changeLogin();
        actions.hideLogin();
      }
      catch (err) {
        console.log(err);
        Alert.alert(
          state.strings.error,
          state.strings.tryAgain,
        );
      }
      setBusy(false);
    }
  }

  const deleteAccount = async () => {
    if (!busy) {
      try {
        setBusy(true);
        await actions.deleteAccount();
        navigate('/');
      }
      catch (err) {
        console.log(err);
        Alert.alert(  
          state.strings.error,
          state.strings.tryAgain,
        );
      }
      setBusy(false);
    }
  }

  const BlockedContact = ({ item }) => {
    return (
      <View style={styles.item}>
        <Logo src={item.logo} width={32} height={32} radius={6} />
        <View style={styles.detail}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{ item.name }</Text>
          <Text style={styles.handle} numberOfLines={1} ellipsizeMode={'tail'}>{ item.handle }</Text>
        </View>
        <TouchableOpacity onPress={() => unblock(actions.unblockContact, { cardId: item.cardId })}>
          <Text style={styles.restore}>{ state.strings.restore }</Text>
        </TouchableOpacity>
      </View>
    )
  };

  const BlockedTopic = ({ item }) => {
    return (
      <View style={styles.item}>
        <Logo src={item.logo} width={32} height={32} radius={6} />
        <View style={styles.detail}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{ item.subject }</Text>
        </View>
        <TouchableOpacity onPress={() => unblock(actions.unblockTopic, { cardId: item.cardId, channelId: item.channelId })}>
          <Text style={styles.restore}>{ state.strings.restore }</Text>
        </TouchableOpacity>
      </View>
    )
  };

  const BlockedMessage = ({ item }) => {
    return (
      <View style={styles.item}>
        <Logo src={item.logo} width={32} height={32} radius={6} />
        <View style={styles.detail}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{ item.handle }</Text>
        </View>
        <TouchableOpacity onPress={() => unblock(actions.unblockMessage, { cardId: item.cardId, channelId: item.channelId, topicId: item.topicId })}>
          <Text style={styles.restore}>{ state.strings.restore }</Text>
        </TouchableOpacity>
      </View>
    )
  };

  return (
    <>
      { drawer && (
        <>
          <View style={styles.drawerDivider} />
          <TouchableOpacity style={styles.drawerEntry} activeOpacity={1}>
            <View style={styles.icon}>
              <MatIcons name="bell-outline" size={20} color={Colors.text} />
            </View>
            <View style={styles.optionControl}>
              <TouchableOpacity activeOpacity={1} onPress={() => setNotifications(!state.pushEnabled)}>
                <Text style={styles.optionText}>{ state.strings.enableNotifications }</Text>
              </TouchableOpacity>
              <Switch value={state.pushEnabled} style={Platform.OS==='ios' ? styles.notifications : {}} thumbColor={Colors.sliderGrip} ios_backgroundColor={Colors.idleFill}
                  trackColor={styles.track} onValueChange={setNotifications} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerEntry} activeOpacity={1} onPress={actions.showEditSeal}>
            <View style={styles.icon}>
              <MatIcons name="lock-outline" size={20} color={Colors.text} />
            </View>
            <View style={styles.optionControl}>
              { state.sealEnabled && (
                <Text style={styles.optionLink}>{ state.strings.manageTopics }</Text>
              )}
              { !state.sealEnabled && (
                <Text style={styles.optionLink}>{ state.strings.enableTopics }</Text>
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.drawerDivider} />
          <TouchableOpacity style={styles.drawerEntry} activeOpacity={1} onPress={actions.promptLogout}>
            <View style={styles.icon}>
              <MatIcons name="logout" size={20} color={Colors.text} />
            </View>
            <View style={styles.optionControl}>
              <Text style={styles.optionLink}>{ state.strings.logout }</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerEntry} activeOpacity={1} onPress={actions.showLogin}>
            <View style={styles.icon}>
              <MatIcons name="login" size={20} color={Colors.text} />
            </View>
            <View style={styles.optionControl}>
              <Text style={styles.optionLink}>{ state.strings.changeLogin }</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerEntry} activeOpacity={1} onPress={actions.showDelete}>
            <View style={styles.icon}>
              <MatIcons name="trash-can-outline" size={20} color={Colors.text} />
            </View>
            <View style={styles.optionControl}>
              <Text style={styles.dangerLink}>{ state.strings.deleteAccount }</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.drawerDivider} />
          <TouchableOpacity style={styles.drawerEntry} activeOpacity={1} onPress={actions.showBlockedContacts}>
            <View style={styles.icon}>
              <MatIcons name="account-multiple-outline" size={24} color={Colors.text} />
            </View>
            <View style={styles.optionControl}>
              <Text style={styles.optionLink}>{ state.strings.blockedContacts }</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerEntry} activeOpacity={1} onPress={actions.showBlockedTopics}>
            <View style={styles.icon}>
              <MatIcons name="book-open-outline" size={20} color={Colors.text} />
            </View>
            <View style={styles.optionControl}>
              <Text style={styles.optionLink}>{ state.strings.blockedTopics }</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerEntry} activeOpacity={1} onPress={actions.showBlockedMessages}>
            <View style={styles.icon}>
              <MatIcons name="comment-text-multiple-outline" size={20} color={Colors.text} />
            </View>
            <View style={styles.optionControl}>
              <Text style={styles.optionLink}>{ state.strings.blockedMessages }</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.drawerDivider} />
          <TouchableOpacity style={styles.drawerEntry} activeOpacity={1} onPress={() => Linking.openURL('https://github.com/balzack/databag/discussions')}>
            <View style={styles.icon}>
              <MatIcons name="help-network-outline" size={24} color={Colors.text} />
            </View>
            <View style={styles.optionControl}>
              <Text style={styles.optionLink}>{ state.strings.support }</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
      { !drawer && (
        <ScrollView style={styles.content}>
          <SafeAreaView edges={['top']}>

            <Text style={styles.label}>{ state.strings.messaging }</Text>
            <View style={styles.group}>
              <TouchableOpacity style={styles.entry} activeOpacity={1}>
                <View style={styles.icon}>
                  <MatIcons name="bell-outline" size={20} color={Colors.linkText} />
                </View>
                <View style={styles.optionControl}>
                  <TouchableOpacity activeOpacity={1} onPress={() => setNotifications(!state.pushEnabled)}>
                    <Text style={styles.optionLink}>{ state.strings.enableNotifications }</Text>
                  </TouchableOpacity>
                  <Switch value={state.pushEnabled} style={Platform.OS==='ios' ? styles.notifications : {}} thumbColor={Colors.sliderGrip} ios_backgroundColor={Colors.disabledIndicator}
                      trackColor={styles.track} onValueChange={setNotifications} />
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.entry} activeOpacity={1} onPress={actions.showEditSeal}>
                <View style={styles.icon}>
                  <MatIcons name="lock-outline" size={20} color={Colors.linkText} />
                </View>
                <View style={styles.optionControl}>
                  { state.sealEnabled && (
                    <Text style={styles.optionLink}>{ state.strings.manageTopics }</Text>
                  )}
                  { !state.sealEnabled && (
                    <Text style={styles.optionLink}>{ state.strings.enableTopics }</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>{ state.strings.display }</Text>
            <View style={styles.group}>
              <View style={styles.entry}>
                <View style={styles.icon}>
                  <MatIcons name="progress-clock" size={20} color={Colors.labelText} />
                </View>
                <View style={styles.optionControl}>
                  <Text style={styles.labelText}>{ state.strings.hourMode }</Text>
                  <TouchableOpacity style={styles.radio} activeOpacity={1} onPress={() => actions.setTimeFull(false)}>
                    { !state.timeFull && (
                      <View style={styles.activeRadioCircle} />
                    )}
                    { state.timeFull && (
                      <View style={styles.idleRadioCircle} />
                    )}
                    <Text style={styles.radioLabel}>{ state.strings.timeHalf }</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.radio} activeOpacity={1} onPress={() => actions.setTimeFull(true)}>
                    { state.timeFull && (
                      <View style={styles.activeRadioCircle} />
                    )}
                    { !state.timeFull && (
                      <View style={styles.idleRadioCircle} />
                    )}
                    <Text style={styles.radioLabel}>{ state.strings.timeFull }</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.entry} activeOpacity={1}>
                <View style={styles.icon}>
                  <MatIcons name="calendar-month-outline" size={20} color={Colors.labelText} />
                </View>
                <View style={styles.optionControl}>
                  <Text style={styles.labelText}>{ state.strings.dateMode }</Text>
                  <TouchableOpacity style={styles.radio} activeOpacity={1} onPress={() => actions.setMonthLast(false)}>
                    { !state.monthLast && (
                      <View style={styles.activeRadioCircle} />
                    )}
                    { state.monthLast && (
                      <View style={styles.idleRadioCircle} />
                    )}
                    <Text style={styles.radioLabel}>{ state.strings.monthStart }</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.radio} activeOpacity={1} onPress={() => actions.setMonthLast(true)}>
                    { state.monthLast && (
                      <View style={styles.activeRadioCircle} />
                    )}
                    { !state.monthLast && (
                      <View style={styles.idleRadioCircle} />
                    )}
                    <Text style={styles.radioLabel}>{ state.strings.monthEnd }</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
           
            </View>

            <Text style={styles.label}>{ state.strings.account }</Text>
            <View style={styles.group}>
              <TouchableOpacity style={styles.entry} activeOpacity={1} onPress={actions.promptLogout}>
                <View style={styles.icon}>
                  <MatIcons name="logout" size={20} color={Colors.linkText} />
                </View>
                <View style={styles.optionControl}>
                  <Text style={styles.optionLink}>{ state.strings.logout }</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.entry} activeOpacity={1} onPress={actions.showLogin}>
                <View style={styles.icon}>
                  <MatIcons name="login" size={20} color={Colors.linkText} />
                </View>
                <View style={styles.optionControl}>
                  <Text style={styles.optionLink}>{ state.strings.changeLogin }</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.entry} activeOpacity={1} onPress={actions.showDelete}>
                <View style={styles.icon}>
                  <MatIcons name="trash-can-outline" size={20} color={Colors.dangerText} />
                </View>
                <View style={styles.optionControl}>
                  <Text style={styles.dangerLink}>{ state.strings.deleteAccount }</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>{ state.strings.blocked }</Text>
            <View style={styles.group}>
              <TouchableOpacity style={styles.entry} activeOpacity={1} onPress={actions.showBlockedContacts}>
                <View style={styles.icon}>
                  <MatIcons name="account-multiple-outline" size={20} color={Colors.linkText} />
                </View>
                <View style={styles.optionControl}>
                  <Text style={styles.optionLink}>{ state.strings.contacts }</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.entry} activeOpacity={1} onPress={actions.showBlockedTopics}>
                <View style={styles.icon}>
                  <MatIcons name="book-open-outline" size={20} color={Colors.linkText} />
                </View>
                <View style={styles.optionControl}>
                  <Text style={styles.optionLink}>{ state.strings.topics }</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.entry} activeOpacity={1} onPress={actions.showBlockedMessages}>
                <View style={styles.icon}>
                  <MatIcons name="comment-text-multiple-outline" size={20} color={Colors.linkText} />
                </View>
                <View style={styles.optionControl}>
                  <Text style={styles.optionLink}>{ state.strings.messages }</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>{ state.strings.support }</Text>
            <View style={styles.group}>
              <TouchableOpacity style={styles.entry} activeOpacity={1} onPress={() => Linking.openURL('https://github.com/balzack/databag/discussions')}>
                <View style={styles.icon}>
                  <MatIcons name="help-network-outline" size={20} color={Colors.linkText} />
                </View>
                <View style={styles.optionControl}>
                  <Text style={styles.optionLink}>github.com/balzack/databag</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.verticalPad} />
          </SafeAreaView>
        </ScrollView>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={state.editSeal}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideEditSeal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.blur} />
          <KeyboardAvoidingView style={styles.modalBase} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.modalContainer}>
              <View style={styles.modalClose}>
                <TouchableOpacity style={styles.dismissButton} activeOpacity={1} onPress={actions.hideEditSeal}>
                  <MatIcons name="close" size={20} color={Colors.descriptionText} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalHeader}>{ state.strings.sealedTopics }</Text>
              { !state.sealEnabled && (
                <>
                  <Text style={styles.modalDescription}>{ state.strings.sealUnset }</Text>

                  <InputField style={styles.field}
                    label={state.strings.password}
                    secret={true}
                    value={state.sealPassword}
                    autoCapitalize={'none'} 
                    spellCheck={false}
                    onChangeText={actions.setSealPassword}
                  />
     
                  { state.sealPassword && (
                    <TouchableOpacity style={styles.enabledButton} activeOpacity={1} onPress={() => sealAction(actions.generateKey)}>
                      { busy && (
                        <ActivityIndicator style={styles.modalBusy} animating={true} color={Colors.primaryButtonText} />
                      )}
                      { !busy && (
                        <Text style={styles.enabledButtonText}>{ state.strings.generate }</Text>
                      )}
                    </TouchableOpacity>
                  )}
                  { !state.sealPassword && (
                    <View style={styles.disabledButton}>
                      <Text style={styles.disabledButtonText}>{ state.strings.generate }</Text>
                    </View>
                  )}
                  <Text style={styles.delayMessage}>{ state.strings.delayMessage }</Text>
                </>
              )}
              { state.sealEnabled && !state.sealUnlocked && !state.sealRemove && (
                <>
                  <Text style={styles.modalDescription}>{ state.strings.sealLocked }</Text>

                  <InputField style={styles.field}
                    label={state.strings.password}
                    secret={true}
                    value={state.sealPassword}
                    autoCapitalize={'none'}
                    spellCheck={false}
                    onChangeText={actions.setSealPassword}
                  />

                  { state.sealPassword && (
                    <TouchableOpacity style={styles.enabledButton} activeOpacity={1} onPress={() => sealAction(actions.unlockKey)}>
                      { busy && (
                        <ActivityIndicator style={styles.modalBusy} animating={true} color={Colors.primaryButtonText} />
                      )}
                      { !busy && (
                        <Text style={styles.enabledButtonText}>{ state.strings.unlock }</Text>
                      )}
                    </TouchableOpacity>
                  )}
                  { !state.sealPassword && (
                    <View style={styles.disabledButton}>
                      <Text style={styles.disabledButtonText}>{ state.strings.unlock }</Text>
                    </View>
                  )}
                  <TouchableOpacity activeOpacity={1} onPress={actions.showSealRemove}>
                    <Text style={styles.dangerText}>{ state.strings.removeSeal }</Text>
                  </TouchableOpacity>
                </>
              )}
              { state.sealEnabled && state.sealUnlocked && !state.sealRemove && !state.sealUpdate && (
                <>
                  <Text style={styles.modalDescription}>{ state.strings.sealUnlocked }</Text>
                  <TouchableOpacity style={styles.enabledButton} activeOpacity={1} onPress={() => sealAction(actions.disableKey)}>
                    { busy && (
                      <ActivityIndicator style={styles.modalBusy} animating={true} color={Colors.primaryButtonText} />
                    )}
                    { !busy && (
                      <Text style={styles.enabledButtonText}>{ state.strings.disable }</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={1} onPress={actions.showSealUpdate}>
                    <Text style={styles.modeText}>{ state.strings.changeKey }</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={1} onPress={actions.showSealRemove}>
                    <Text style={styles.dangerText}>{ state.strings.removeSeal }</Text>
                  </TouchableOpacity>
                </>
              )}
              { state.sealEnabled && state.sealRemove && (
                <>
                  <Text style={styles.modalDescription}>{ state.strings.sealDelete }</Text>
                  <InputField style={styles.field}
                    label={state.strings.typeDelete}
                    value={state.sealDelete}
                    autoCapitalize={'none'}
                    spellCheck={false}
                    onChangeText={actions.setSealDelete}
                  />
                  { state.sealDelete === state.strings.deleteKey && (
                    <TouchableOpacity style={styles.dangerButton} activeOpacity={1} onPress={() => sealAction(actions.removeKey)}>
                      { busy && (
                        <ActivityIndicator style={styles.modalBusy} animating={true} color={Colors.primaryButtonText} />
                      )}
                      { !busy && (
                        <Text style={styles.dangerButtonText}>{ state.strings.delete }</Text>
                      )}
                    </TouchableOpacity>
                  )}
                  { state.sealDelete !== state.strings.deleteKey && (
                    <View style={styles.disabledButton}>
                      <Text style={styles.disabledButtonText}>{ state.strings.delete }</Text>
                    </View>
                  )}
                  <TouchableOpacity activeOpacity={1} onPress={actions.hideSealRemove}>
                    { state.sealUnlocked && (
                      <Text style={styles.modeText}>{ state.strings.disableSeal }</Text>
                    )}
                    { !state.sealUnlocked && (
                      <Text style={styles.modeText}>{ state.strings.unlockSeal }</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
              { state.sealEnabled && state.sealUnlocked && state.sealUpdate && (
                <>
                  <Text style={styles.modalDescription}>{ state.strings.changePassword }</Text>

                  <InputField style={styles.field}
                    label={state.strings.password}
                    isPassword={true}
                    value={state.sealPassword}
                    autoCapitalize={'none'} 
                    spellCheck={false}
                    onChangeText={actions.setSealPassword}
                  />

                  { state.sealPassword && (
                    <TouchableOpacity style={styles.enabledButton} activeOpacity={1} onPress={() => sealAction(actions.updateKey)}>
                      { busy && (
                        <ActivityIndicator style={styles.modalBusy} animating={true} color={Colors.primaryButtonText} />
                      )}
                      { !busy && (
                        <Text style={styles.enabledButtonText}>{ state.strings.update }</Text>
                      )}
                    </TouchableOpacity>
                  )}
                  { !state.sealPassword && (
                    <View style={styles.disabledButton}>
                      <Text style={styles.disabledButtonText}>{ state.strings.update }</Text>
                    </View>
                  )}
                  <TouchableOpacity activeOpacity={1} onPress={actions.hideSealUpdate}>
                    { state.sealUnlocked && (
                      <Text style={styles.modeText}>{ state.strings.disableSeal }</Text>
                    )}
                    { !state.sealUnlocked && (
                      <Text style={styles.modeText}>{ state.strings.unlockSeal }</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={state.login}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideLogin}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.blur} />
          <KeyboardAvoidingView style={styles.modalBase} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.modalContainer}>
              <View style={styles.modalClose}>
                <TouchableOpacity style={styles.dismissButton} activeOpacity={1} onPress={actions.hideLogin}>
                  <MatIcons name="close" size={20} color={Colors.descriptionText} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalHeader}>{ state.strings.changeLogin }</Text>
              <ActivityIndicator style={styles.modalBusy} animating={busy} color={Colors.primary} />

              <Text textAlign={'center'} style={styles.modalDescription}>{ state.strings.changeMessage }</Text>

              <InputField
                label={state.strings.username}
                value={state.username}
                autoCapitalize={'none'}
                spellCheck={false}
                style={styles.field}
                onChangeText={actions.setUsername}
              /> 

              <InputField
                label={state.strings.password}
                value={state.password}
                autoCapitalize={'none'}
                spellCheck={false}
                style={styles.field}
                onChangeText={actions.setPassword}
                secret={true}
              /> 

              <View style={styles.availableStatus}>
                { state.validated && !state.available && (
                  <Text style={styles.notAvailable}>{ state.strings.notAvailable }</Text>
                )}
              </View>
              <View style={styles.hintButtons}>
                <TouchableOpacity style={styles.cancelButton} activeOpacity={1} onPress={actions.hideLogin}>
                  <Text style={styles.cancelButtonText}>{ state.strings.cancel }</Text>
                </TouchableOpacity>
                { (!state.available || !state.password || !state.validated || !state.username) && (
                  <View style={styles.disabledButton}>
                    <Text style={styles.disabledButtonText}>{ state.strings.update }</Text>
                  </View>
                )}
                { state.available && state.password && state.validated && state.username && (
                  <TouchableOpacity style={styles.promptButton} activeOpacity={1} onPress={changeLogin}>
                    <Text style={styles.enabledButtonText}>{ state.strings.update }</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={state.delete}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.blur} />
          <KeyboardAvoidingView style={styles.modalBase} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.modalContainer}>
              <View style={styles.modalClose}>
                <TouchableOpacity style={styles.dismissButton} activeOpacity={1} onPress={actions.hideDelete}>
                  <MatIcons name="close" size={20} color={Colors.descriptionText} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalHeader}>{ state.strings.deleteAccount }</Text>
              <ActivityIndicator style={styles.modalBusy} animating={busy} color={Colors.primary} />

              <InputField style={styles.field}
                label={state.strings.typeDelete}
                value={state.confirm}
                autoCapitalize={'none'} 
                spellCheck={false}
                onChangeText={actions.setConfirm}
              />

              <View style={styles.buttons}>
                { state.confirm === state.strings.deleteKey && (
                  <TouchableOpacity style={styles.dangerButton} activeOpacity={1} onPress={deleteAccount}>
                    <Text style={styles.dangerButtonText}>{ state.strings.delete }</Text>
                  </TouchableOpacity>
                )}
                { state.confirm !== state.strings.deleteKey && (
                  <View style={styles.disabledButton}>
                    <Text style={styles.disabledButtonText}>{ state.strings.delete }</Text>
                  </View>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={state.blockedContacts}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={state.hideBlockedContacts}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.blur} />
          <View style={styles.modalBase}>
            <View style={styles.modalContainer}>
              <View style={styles.modalClose}>
                <TouchableOpacity style={styles.dismissButton} activeOpacity={1} onPress={actions.hideBlockedContacts}>
                  <MatIcons name="close" size={20} color={Colors.descriptionText} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalHeader}>{ state.strings.blockedContacts }</Text>
              <ActivityIndicator style={styles.modalBusy} animating={busy} color={Colors.primary} />
              <View style={styles.modalList}>
                { state.contacts.length === 0 && (
                  <View style={styles.emptyLabel}>
                    <Text style={styles.emptyLabelText}>{ state.strings.noBlockedContacts }</Text>
                  </View>
                )}
                { state.contacts.length !== 0 && (
                  <FlatList
                    data={state.contacts}
                    renderItem={BlockedContact}
                    keyExtractor={item => item.cardId}
                  />
                )}
              </View>
              <View style={styles.rightButton}>
                <TouchableOpacity style={styles.closeButton} activeOpacity={1} onPress={actions.hideBlockedContacts}>
                  <Text style={styles.closeButtonText}>{ state.strings.close }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={state.blockedTopics}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={state.hideBlockedTopics}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.blur} />
          <View style={styles.modalBase}>
            <View style={styles.modalContainer}>
              <View style={styles.modalClose}>
                <TouchableOpacity style={styles.dismissButton} activeOpacity={1} onPress={actions.hideBlockedTopics}>
                  <MatIcons name="close" size={20} color={Colors.descriptionText} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalHeader}>{ state.strings.blockedTopics }</Text>
              <ActivityIndicator style={styles.modalBusy} animating={busy} color={Colors.primary} />
              <View style={styles.modalList}>
                { state.topics.length === 0 && (
                  <View style={styles.emptyLabel}>
                    <Text style={styles.emptyLabelText}>{ state.strings.noBlockedTopics }</Text>
                  </View>
                )}
                { state.topics.length !== 0 && (
                  <FlatList
                    data={state.topics}
                    renderItem={BlockedTopic}
                    keyExtractor={item => `${item.cardId}.${item.channelId}`}
                  />
                )}
              </View>
              <View style={styles.rightButton}>
                <TouchableOpacity style={styles.closeButton} activeOpacity={1} onPress={actions.hideBlockedTopics}>
                  <Text style={styles.closeButtonText}>{ state.strings.close }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={state.blockedMessages}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideBlockedMessages}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.blur} />
          <View style={styles.modalBase}>
            <View style={styles.modalContainer}>
              <View style={styles.modalClose}>
                <TouchableOpacity style={styles.dismissButton} activeOpacity={1} onPress={actions.hideBlockedMessages}>
                  <MatIcons name="close" size={20} color={Colors.descriptionText} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalHeader}>{ state.strings.blockedMessages }</Text>
              <ActivityIndicator style={styles.modalBusy} animating={busy} color={Colors.primary} />
              <View style={styles.modalList}>
                { state.messages.length === 0 && (
                  <View style={styles.emptyLabel}>
                    <Text style={styles.emptyLabelText}>{ state.strings.noBlockedMessages }</Text>
                  </View>
                )}
                { state.messages.length !== 0 && (
                  <FlatList
                    data={state.messages}
                    renderItem={BlockedMessage}
                    keyExtractor={item => `${item.cardId}.${item.channelId}.${item.topicId}`}
                  />
                )}
              </View>
              <View style={styles.rightButton}>
                <TouchableOpacity style={styles.closeButton} activeOpacity={1} onPress={actions.hideBlockedMessages}>
                  <Text style={styles.closeButtonText}>{ state.strings.close }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </>     
  );
}
