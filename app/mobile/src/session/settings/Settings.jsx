import { ActivityIndicator, KeyboardAvoidingView, Modal, ScrollView, View, Switch, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Settings.styled';
import { useSettings } from './useSettings.hook';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from 'constants/Colors';

export function Settings() {
  
  const { state, actions } = useSettings();

  const saveSeal = async () => {
    try {
      await actions.saveSeal();
      actions.hideEditSeal();
    }
    catch (err) {
      console.log(err);
      Alert.alert(
        'Failed to Update Topic Sealing',
        'Please try again.',
      )
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
            <View style={styles.option}>
              <Text style={styles.optionLink}>{ state.strings.enableNotifications }</Text>
            </View>
            <View style={styles.control}>
              <Switch style={styles.notifications} trackColor={styles.track}/>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.entry} activeOpacity={1} onPress={actions.showEditSeal}>
            <View style={styles.icon}>
              <MatIcons name="lock-outline" size={20} color={Colors.linkText} />
            </View>
            <View style={styles.option}>
              { state.sealEnabled && (
                <Text style={styles.optionLink}>{ state.strings.manageTopics }</Text>
              )}
              { !state.sealEnabled && (
                <Text style={styles.optionLink}>{ state.strings.enableTopics }</Text>
              )}
            </View>
            <View style={styles.control} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>{ state.strings.display }</Text>
        <View style={styles.group}>
          <View style={styles.entry}>
            <View style={styles.icon}>
              <MatIcons name="progress-clock" size={20} color={Colors.text} />
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
              <MatIcons name="calendar-month-outline" size={20} color={Colors.text} />
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
          <TouchableOpacity style={styles.entry} activeOpacity={1}>
            <View style={styles.icon}>
              <MatIcons name="logout" size={20} color={Colors.linkText} />
            </View>
            <View style={styles.option}>
              <Text style={styles.optionLink}>{ state.strings.logout }</Text>
            </View>
            <View style={styles.control} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.entry} activeOpacity={1}>
            <View style={styles.icon}>
              <MatIcons name="login" size={20} color={Colors.linkText} />
            </View>
            <View style={styles.option}>
              <Text style={styles.optionLink}>{ state.strings.changeLogin }</Text>
            </View>
            <View style={styles.control} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.entry} activeOpacity={1}>
            <View style={styles.icon}>
              <MatIcons name="trash-can-outline" size={20} color={Colors.dangerText} />
            </View>
            <View style={styles.option}>
              <Text style={styles.dangerLink}>{ state.strings.deleteAccount }</Text>
            </View>
            <View style={styles.control} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>{ state.strings.blocked }</Text>
        <View style={styles.group}>
          <TouchableOpacity style={styles.entry} activeOpacity={1}>
            <View style={styles.icon}>
              <MatIcons name="account-multiple-outline" size={20} color={Colors.linkText} />
            </View>
            <View style={styles.optionControl}>
              <Text style={styles.optionLink}>{ state.strings.contacts }</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.entry} activeOpacity={1}>
            <View style={styles.icon}>
              <MatIcons name="book-open-outline" size={20} color={Colors.linkText} />
            </View>
            <View style={styles.optionControl}>
              <Text style={styles.optionLink}>{ state.strings.topics }</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.entry} activeOpacity={1}>
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
          <TouchableOpacity style={styles.entry} activeOpacity={1}>
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
          <KeyboardAvoidingView behavior="height" style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalClose}>
                <TouchableOpacity activeOpacity={1} onPress={actions.hideEditSeal}>
                  <MatIcons name="close" size={20} color={Colors.descriptionText} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalHeader}>{ state.strings.sealedTopics }</Text>
              { !state.sealEnabled && (
                <>
                  <Text style={styles.modalDescription}>{ state.strings.sealUnset }</Text>
                  <View style={styles.modalInput}>
                    <TextInput style={styles.inputText} value={state.sealPassword} onChangeText={actions.setSealPassword}
                        autoCapitalize={'none'} secureTextEntry={state.hidePassword} placeholder={state.strings.password}
                        placeholderTextColor={Colors.inputPlaceholder} />
                    { state.hidePassword && (
                      <TouchableOpacity style={styles.inputVisibility} activeOpacity={1} onPress={actions.showPassword}>
                        <MatIcons name="eye-outline" size={16} color={Colors.inputPlaceholder} />
                      </TouchableOpacity>
                    )}
                    { !state.hidePassword && (
                      <TouchableOpacity style={styles.inputVisibility} activeOpacity={1} onPress={actions.hidePassword}>
                        <MatIcons name="eye-off-outline" size={16} color={Colors.inputPlaceholder} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.modalInput}>
                    <TextInput style={styles.inputText} value={state.sealConfirm} onChangeText={actions.setSealConfirm}
                        autoCapitalize={'none'} secureTextEntry={state.hideConfirm} placeholder={state.strings.confirmPassword}
                        placeholderTextColor={Colors.inputPlaceholder} />
                    { state.hideConfirm && (
                      <TouchableOpacity style={styles.inputVisibility} activeOpacity={1} onPress={actions.showConfirm}>
                        <MatIcons name="eye-outline" size={16} color={Colors.inputPlaceholder} />
                      </TouchableOpacity>
                    )}
                    { !state.hideConfirm && (
                      <TouchableOpacity style={styles.inputVisibility} activeOpacity={1} onPress={actions.showConfirm}>
                        <MatIcons name="eye-off-outline" size={16} color={Colors.inputPlaceholder} />
                      </TouchableOpacity>
                    )}
                  </View>
                  { state.sealPassword === state.sealConfirm && state.sealPassword && (
                    <TouchableOpacity style={styles.enabledButton} activeOpacity={1} onPress={actions.generateKey}>
                      <Text style={styles.enabledButtonText}>{ state.strings.generate }</Text>
                    </TouchableOpacity>
                  )}
                  { (state.sealPassword !== state.sealConfirm || !state.sealPassword) && (
                    <View style={styles.disabledButton}>
                      <Text style={styles.disabledButtonText}>{ state.strings.generate }</Text>
                    </View>
                  )}
                </>
              )}
              { state.sealEnabled && !state.sealUnlocked && (
                <Text style={styles.modalDescription}>{ state.strings.sealLocked }</Text>
              )}
              { state.sealEnabled && state.sealUnlocked && (
                <>
                  <Text style={styles.modalDescription}>{ state.strings.sealUnlocked }</Text>
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        </Modal>

      </SafeAreaView>
    </ScrollView>
  );
}
