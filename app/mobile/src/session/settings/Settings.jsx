import { ActivityIndicator, KeyboardAvoidingView, Modal, ScrollView, View, Switch, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Settings.styled';
import { useSettings } from './useSettings.hook';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/AntDesign';
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
              <Text style={styles.optionLink}>{ state.strings.sealedTopics }</Text>
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
              <Text style={styles.optionText}>{ state.strings.hourMode }</Text>
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
              <Text style={styles.optionText}>{ state.strings.dateMode }</Text>
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
          <KeyboardAvoidingView behavior="height" style={styles.modalWrapper}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalHeader}>Sealed Topics:</Text>
              <View style={styles.sealable}>
                <TouchableOpacity onPress={() => actions.setSealEnable(!state.sealEnabled)} activeOpacity={1}>
                  <Text style={styles.sealableText}>Enable Sealed Topics</Text>
                </TouchableOpacity>
                <Switch style={styles.enableSwitch} value={state.sealEnabled} onValueChange={actions.setSealEnable} trackColor={styles.switch}/>
              </View>
              { state.sealMode === 'unlocking' && (
                <>
                  { !state.showSealUnlock && (
                    <View style={styles.inputField}>
                      <TextInput style={styles.input} value={state.sealUnlock} onChangeText={actions.setSealUnlock}
                          autoCapitalize={'none'} secureTextEntry={true} placeholder="Password for Seal"
                          placeholderTextColor={Colors.grey} />
                      <TouchableOpacity onPress={actions.showSealUnlock}>
                        <Ionicons style={styles.icon} name="eyeo" size={18} color="#888888" />
                      </TouchableOpacity>
                    </View>
                  )}
                  { state.showSealUnlock && (
                    <View style={styles.inputField}>
                      <TextInput style={styles.input} value={state.sealUnlock} onChangeText={actions.setSealUnlock}
                          autoCapitalize={'none'} secureTextEntry={false} placeholder="Password for Seal"
                          placeholderTextColor={Colors.grey} />
                      <TouchableOpacity onPress={actions.hideSealUnlock}>
                        <Ionicons style={styles.icon} name="eye" size={18} color="#888888" />
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
              { (state.sealMode === 'updating' || state.sealMode === 'enabling') && (
                <>
                  { !state.showSealPassword && (
                    <View style={styles.inputField}>
                      <TextInput style={styles.input} value={state.sealPassword} onChangeText={actions.setSealPassword}
                          autoCapitalize={'none'} secureTextEntry={true} placeholder="Password for Seal"
                          placeholderTextColor={Colors.grey} />
                      <TouchableOpacity onPress={actions.showSealPassword}>
                        <Ionicons style={styles.icon} name="eyeo" size={18} color="#888888" />
                      </TouchableOpacity>
                    </View>
                  )}
                  { state.showSealPassword && (
                    <View style={styles.inputField}>
                      <TextInput style={styles.input} value={state.sealPassword} onChangeText={actions.setSealPassword}
                          autoCapitalize={'none'} secureTextEntry={false} placeholder="Password for Seal"
                          placeholderTextColor={Colors.grey} />
                      <TouchableOpacity onPress={actions.hideSealPassword}>
                        <Ionicons style={styles.icon} name="eye" size={18} color="#888888" />
                      </TouchableOpacity>
                    </View>
                  )}
                  { !state.showSealConfirm && (
                    <View style={styles.inputField}>
                      <TextInput style={styles.input} value={state.sealConfirm} onChangeText={actions.setSealConfirm}
                          autoCapitalize={'none'} secureTextEntry={true} placeholder="Confirm Password"
                          placeholderTextColor={Colors.grey} />
                      <TouchableOpacity onPress={actions.showSealConfirm}>
                        <Ionicons style={styles.icon} name="eyeo" size={18} color="#888888" />
                      </TouchableOpacity>
                    </View>
                  )}
                  { state.showSealConfirm && (
                    <View style={styles.inputField}>
                      <TextInput style={styles.input} value={state.sealConfirm} onChangeText={actions.setSealConfirm}
                          autoCapitalize={'none'} secureTextEntry={false} placeholder="Confirm Password"
                          placeholderTextColor={Colors.grey} />
                      <TouchableOpacity onPress={actions.hideSealConfirm}>
                        <Ionicons style={styles.icon} name="eye" size={18} color="#888888" />
                      </TouchableOpacity>
                    </View>
                  )}
                  <Text style={styles.notice}>saving can take a few minutes</Text>
                </>
              )}
              { state.sealMode === 'disabling' && (
                <View style={styles.inputField}>
                  <Ionicons style={styles.warn} name="exclamationcircleo" size={18} color="#888888" />
                  <TextInput style={styles.input} value={state.sealDelete} onChangeText={actions.setSealDelete}
                      autoCapitalize={'none'} placeholder="Type 'delete' to remove sealing key"
                      placeholderTextColor={Colors.grey} />
                </View>
              )}
              { state.sealMode === 'unlocked' && (
                <View style={styles.inputField}>
                  <TextInput style={styles.input} value={'xxxxxxxx'} editable={false} secureTextEntry={true} />
                  <Ionicons style={styles.icon} name="eyeo" size={18} color="#888888" />
                  <TouchableOpacity style={styles.sealUpdate} onPress={actions.updateSeal} />
                </View>
              )}
              <View style={styles.modalControls}>
                <TouchableOpacity style={styles.cancel} onPress={actions.hideEditSeal}>
                  <Text style={styles.canceltext}>Cancel</Text>
                </TouchableOpacity>
                { state.canSaveSeal && (
                  <>
                    { state.sealMode !== 'unlocking' && state.sealMode !== 'unlocked' && (
                      <TouchableOpacity style={styles.save} onPress={saveSeal}>
                        { state.saving && (
                          <ActivityIndicator style={styles.activity} color={Colors.white} />
                        )}
                        <Text style={styles.saveText}>Save</Text>
                      </TouchableOpacity>
                    )}
                    { state.sealMode === 'unlocked' && (
                      <TouchableOpacity style={styles.save} onPress={saveSeal}>
                        { state.saving && (
                          <ActivityIndicator style={styles.activity} color={Colors.white} />
                        )}
                        <Text style={styles.saveText}>Forget</Text>
                      </TouchableOpacity>
                    )}
                    { state.sealMode === 'unlocking' && (
                      <TouchableOpacity style={styles.save} onPress={saveSeal}>
                        { state.saving && (
                          <ActivityIndicator style={styles.activity} color={Colors.white} />
                        )}
                        <Text style={styles.saveText}>Unlock</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
                { !state.canSaveSeal && (
                  <>
                    { state.sealMode !== 'unlocking' && (
                      <View style={styles.disabled}>
                        { state.saving && (
                          <ActivityIndicator style={styles.activity} color={Colors.white} />
                        )}
                        <Text style={styles.disabledText}>Save</Text>
                      </View>
                    )}
                    { state.sealMode === 'unlocking' && (
                      <View style={styles.disabled}>
                        { state.saving && (
                          <ActivityIndicator style={styles.activity} color={Colors.white} />
                        )}
                        <Text style={styles.disabledText}>Unlock</Text>
                      </View>
                    )}
                  </>
                )}

              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

      </SafeAreaView>
    </ScrollView>
  );
}
