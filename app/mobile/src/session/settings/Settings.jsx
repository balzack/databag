import { useState } from 'react';
import { Linking, ActivityIndicator, KeyboardAvoidingView, Modal, ScrollView, View, Switch, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigate } from 'react-router-dom';
import { styles } from './Settings.styled';
import { useSettings } from './useSettings.hook';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from 'constants/Colors';
import { BlurView } from "@react-native-community/blur";
import { FloatingLabelInput } from 'react-native-floating-label-input';

export function Settings() {

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

  return (
    <ScrollView style={styles.content}>
      <SafeAreaView edges={['top']}>

        <Text style={styles.label}>{ state.strings.messaging }</Text>
        <View style={styles.group}>
          <TouchableOpacity style={styles.entry} activeOpacity={1}>
            <View style={styles.icon}>
              <MatIcons name="bell-outline" size={20} color={Colors.linkText} />
            </View>
            <View style={styles.optionControl}>
              <Text style={styles.optionLink}>{ state.strings.enableNotifications }</Text>
              <Switch value={state.pushEnabled} style={styles.notifications} thumbColor={Colors.sliderGrip} ios_backgroundColor={Colors.disabledIndicator}
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
          <TouchableOpacity style={styles.entry} activeOpacity={1} onPress={actions.showLogout}>
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

        <Modal
          animationType="fade"
          transparent={true}
          visible={state.editSeal}
          supportedOrientations={['portrait', 'landscape']}
          onRequestClose={actions.hideEditSeal}
        >
          <BlurView style={styles.modalOverlay} blurType={Colors.overlay} blurAmount={2} reducedTransparencyFallbackColor="black">
            <View style={styles.modalContainer}>
              <View style={styles.modalClose}>
                <TouchableOpacity style={styles.dismissButton} activeOpacity={1} onPress={actions.hideEditSeal}>
                  <MatIcons name="close" size={20} color={Colors.descriptionText} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalHeader}>{ state.strings.sealedTopics }</Text>
              <ActivityIndicator style={styles.modalBusy} animating={busy} color={Colors.primary} />
              { !state.sealEnabled && (
                <>
                  <Text style={styles.modalDescription}>{ state.strings.sealUnset }</Text>

                  <View style={styles.modalInput}>
                    <FloatingLabelInput
                      label={state.strings.password}
                      isPassword={true}
                      value={state.sealPassword}
                      autoCapitalize={'none'} 
                      spellCheck={false}

                      inputStyles={styles.floatingInput}
                      labelStyles={styles.floatingLabel}
                      customLabelStyles={styles.floatingCustomLabel}
                      containerStyles={styles.floatingContainer}

                      onChangeText={actions.setSealPassword}
                      customShowPasswordComponent={<MatIcons name="eye-outline" size={16} color={Colors.inputPlaceholder} />}
                      customHidePasswordComponent={<MatIcons name="eye-off-outline" size={16} color={Colors.inputPlaceholder} />}
                    />
                  </View>
     
                  { state.sealPassword && (
                    <TouchableOpacity style={styles.enabledButton} activeOpacity={1} onPress={() => sealAction(actions.generateKey)}>
                      <Text style={styles.enabledButtonText}>{ state.strings.generate }</Text>
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

                  <View style={styles.modalInput}>
                    <FloatingLabelInput
                      label={state.strings.password}
                      isPassword={true}
                      value={state.sealPassword}
                      autoCapitalize={'none'}
                      spellCheck={false}

                      inputStyles={styles.floatingInput}
                      labelStyles={styles.floatingLabel}
                      customLabelStyles={styles.floatingCustomLabel}
                      containerStyles={styles.floatingContainer}

                      onChangeText={actions.setSealPassword}
                      customShowPasswordComponent={<MatIcons name="eye-outline" size={16} color={Colors.inputPlaceholder} />}
                      customHidePasswordComponent={<MatIcons name="eye-off-outline" size={16} color={Colors.inputPlaceholder} />}
                    />
                  </View>

                  <View style={styles.buttons}>
                    { state.sealPassword && (
                      <TouchableOpacity style={styles.enabledButton} activeOpacity={1} onPress={() => sealAction(actions.unlockKey)}>
                        <Text style={styles.enabledButtonText}>{ state.strings.unlock }</Text>
                      </TouchableOpacity>
                    )}
                    { !state.sealPassword && (
                      <View style={styles.disabledButton}>
                        <Text style={styles.disabledButtonText}>{ state.strings.unlock }</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity activeOpacity={1} onPress={actions.showSealRemove}>
                    <Text style={styles.dangerText}>{ state.strings.removeSeal }</Text>
                  </TouchableOpacity>
                </>
              )}
              { state.sealEnabled && state.sealUnlocked && !state.sealRemove && !state.sealUpdate && (
                <>
                  <Text style={styles.modalDescription}>{ state.strings.sealUnlocked }</Text>
                  <TouchableOpacity style={styles.enabledButton} activeOpacity={1} onPress={() => sealAction(actions.disableKey)}>
                    <Text style={styles.enabledButtonText}>{ state.strings.disable }</Text>
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
                  <View style={styles.modalInput}>
                    <FloatingLabelInput
                      label={state.strings.typeDelete}
                      value={state.sealDelete}
                      autoCapitalize={'none'}
                      spellCheck={false}
                      inputStyles={styles.floatingInput}
                      labelStyles={styles.floatingLable}
                      customLabelStyles={styles.floatingCustomLabel}
                      containerStyles={styles.floatingContainer}
                      onChangeText={actions.setSealDelete}
                    />
                  </View>
                  { state.sealDelete === state.strings.deleteKey && (
                    <TouchableOpacity style={styles.dangerButton} activeOpacity={1} onPress={() => sealAction(actions.removeKey)}>
                      <Text style={styles.dangerButtonText}>{ state.strings.delete }</Text>
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

                  <View style={styles.modalInput}>
                    <FloatingLabelInput
                      label={state.strings.password}
                      isPassword={true}
                      value={state.sealPassword}
                      autoCapitalize={'none'} 
                      spellCheck={false}

                      inputStyles={styles.floatingInput}
                      labelStyles={styles.floatingLabel}
                      customLabelStyles={styles.floatingCustomLabel}
                      containerStyles={styles.floatingContainer}

                      onChangeText={actions.setSealPassword}
                      customShowPasswordComponent={<MatIcons name="eye-outline" size={16} color={Colors.inputPlaceholder} />}
                      customHidePasswordComponent={<MatIcons name="eye-off-outline" size={16} color={Colors.inputPlaceholder} />}
                    />
                  </View>

                  { state.sealPassword && (
                    <TouchableOpacity style={styles.enabledButton} activeOpacity={1} onPress={() => sealAction(actions.updateKey)}>
                      <Text style={styles.enabledButtonText}>{ state.strings.update }</Text>
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
          </BlurView>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={state.logout}
          supportedOrientations={['portrait', 'landscape']}
          onRequestClose={actions.hideLogout}
        >
          <BlurView style={styles.modalOverlay} blurType={Colors.overlay} blurAmount={2} reducedTransparencyFallbackColor="black">
            <View style={styles.modalContainer}>
              <Text style={styles.modalHeader}>{ state.strings.loggingOut }</Text>
              <View style={styles.buttons}>
                <TouchableOpacity style={styles.cancelButton} activeOpacity={1} onPress={actions.hideLogout}>
                  <Text style={styles.enabledButtonText}>{ state.strings.cancel }</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.promptButton} activeOpacity={1} onPress={logout}>
                  <Text style={styles.enabledButtonText}>{ state.strings.confirmLogout }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Modal>
 
        <Modal
          animationType="fade"
          transparent={true}
          visible={state.login}
          supportedOrientations={['portrait', 'landscape']}
          onRequestClose={actions.hideLogin}
        >
          <BlurView style={styles.modalOverlay} blurType={Colors.overlay} blurAmount={2} reducedTransparencyFallbackColor="black">
            <View style={styles.modalContainer}>
              <View style={styles.modalClose}>
                <TouchableOpacity style={styles.dismissButton} activeOpacity={1} onPress={actions.hideLogin}>
                  <MatIcons name="close" size={20} color={Colors.descriptionText} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalHeader}>{ state.strings.changeLogin }</Text>
              <ActivityIndicator style={styles.modalBusy} animating={busy} color={Colors.primary} />

              <Text textAlign={'center'} style={styles.modalDescription}>{ state.strings.changeMessage }</Text>
              <View style={styles.modalInput}>
                <FloatingLabelInput
                  label={state.strings.username}
                  value={state.username}
                  autoCapitalize={'none'} 
                  spellCheck={false}
                  staticLabel={false}
                  autoCorrect={false}
                  autoComplete={'off'}

                  inputStyles={styles.floatingInput}
                  labelStyles={styles.floatingLable}
                  customLabelStyles={styles.floatingCustomLabel}
                  containerStyles={styles.floatingContainer}

                  onChangeText={actions.setUsername}
                />
              </View>

              <View style={styles.modalInput}>
                <FloatingLabelInput
                  label={state.strings.password}
                  isPassword={true}
                  value={state.password}
                  autoCapitalize={'none'} 
                  spellCheck={false}

                  inputStyles={styles.floatingInput}
                  labelStyles={styles.floatingLable}
                  customLabelStyles={styles.floatingCustomLabel}
                  containerStyles={styles.floatingContainer}

                  onChangeText={actions.setPassword}
                  customShowPasswordComponent={<MatIcons name="eye-outline" size={16} color={Colors.inputPlaceholder} />}
                  customHidePasswordComponent={<MatIcons name="eye-off-outline" size={16} color={Colors.inputPlaceholder} />}
                />
              </View>
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
          </BlurView>
        </Modal>
 
        <Modal
          animationType="fade"
          transparent={true}
          visible={state.delete}
          supportedOrientations={['portrait', 'landscape']}
          onRequestClose={actions.hideDelete}
        >
          <BlurView style={styles.modalOverlay} blurType={Colors.overlay} blurAmount={2} reducedTransparencyFallbackColor="black">
            <View style={styles.modalContainer}>
              <View style={styles.modalClose}>
                <TouchableOpacity style={styles.dismissButton} activeOpacity={1} onPress={actions.hideDelete}>
                  <MatIcons name="close" size={20} color={Colors.descriptionText} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalHeader}>{ state.strings.deleteAccount }</Text>
              <ActivityIndicator style={styles.modalBusy} animating={busy} color={Colors.primary} />

              <View style={styles.modalInput}>
                <FloatingLabelInput
                  label={state.strings.typeDelete}
                  value={state.confirm}
                  autoCapitalize={'none'} 
                  spellCheck={false}
                  inputStyles={styles.floatingInput}
                  labelStyles={styles.floatingLable}
                  customLabelStyles={styles.floatingCustomLabel}
                  containerStyles={styles.floatingContainer}
                  onChangeText={actions.setConfirm}
                />
              </View>
 
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
          </BlurView>
        </Modal>
  
        <Modal
          animationType="fade"
          transparent={true}
          visible={state.blockedContacts}
          supportedOrientations={['portrait', 'landscape']}
          onRequestClose={state.hideBlockedContacts}
        >
          <BlurView style={styles.modalOverlay} blurType={Colors.overlay} blurAmount={2} reducedTransparencyFallbackColor="black">
            <View style={styles.modalContainer}>
              <View style={styles.modalClose}>
                <TouchableOpacity style={styles.dismissButton} activeOpacity={1} onPress={actions.hideBlockedContacts}>
                  <MatIcons name="close" size={20} color={Colors.descriptionText} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalHeader}>{ state.strings.blockedContacts }</Text>
              <ActivityIndicator style={styles.modalBusy} animating={busy} color={Colors.primary} />
              <View style={styles.modalList}></View>
              <View style={styles.rightButton}>
                <TouchableOpacity style={styles.closeButton} activeOpacity={1} onPress={actions.hideBlockedContacts}>
                  <Text style={styles.closeButtonText}>{ state.strings.close }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Modal>
   
        <Modal
          animationType="fade"
          transparent={true}
          visible={state.blockedTopics}
          supportedOrientations={['portrait', 'landscape']}
          onRequestClose={state.hideBlockedTopics}
        >
          <BlurView style={styles.modalOverlay} blurType={Colors.overlay} blurAmount={2} reducedTransparencyFallbackColor="black">
            <View style={styles.modalContainer}>
              <View style={styles.modalClose}>
                <TouchableOpacity style={styles.dismissButton} activeOpacity={1} onPress={actions.hideBlockedTopics}>
                  <MatIcons name="close" size={20} color={Colors.descriptionText} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalHeader}>{ state.strings.blockedContacts }</Text>
              <ActivityIndicator style={styles.modalBusy} animating={busy} color={Colors.primary} />
              <View style={styles.modalList}></View>
              <View style={styles.rightButton}>
                <TouchableOpacity style={styles.closeButton} activeOpacity={1} onPress={actions.hideBlockedTopics}>
                  <Text style={styles.closeButtonText}>{ state.strings.close }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Modal>
    
        <Modal
          animationType="fade"
          transparent={true}
          visible={state.blockedMessages}
          supportedOrientations={['portrait', 'landscape']}
          onRequestClose={actions.hideBlockedMessages}
        >
          <BlurView style={styles.modalOverlay} blurType={Colors.overlay} blurAmount={2} reducedTransparencyFallbackColor="black">
            <View style={styles.modalContainer}>
              <View style={styles.modalClose}>
                <TouchableOpacity style={styles.dismissButton} activeOpacity={1} onPress={actions.hideBlockedMessages}>
                  <MatIcons name="close" size={20} color={Colors.descriptionText} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalHeader}>{ state.strings.blockedContacts }</Text>
              <ActivityIndicator style={styles.modalBusy} animating={busy} color={Colors.primary} />
              <View style={styles.modalList}></View>
              <View style={styles.rightButton}>
                <TouchableOpacity style={styles.closeButton} activeOpacity={1} onPress={actions.hideBlockedMessages}>
                  <Text style={styles.closeButtonText}>{ state.strings.close }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Modal>
     
      </SafeAreaView>
    </ScrollView>
  );
}
