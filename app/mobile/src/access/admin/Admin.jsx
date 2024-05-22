import { KeyboardAvoidingView, Modal, ScrollView, ActivityIndicator, Alert, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { styles } from './Admin.styled';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { useAdmin } from './useAdmin.hook';
import Colors from 'constants/Colors';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { tos } from 'constants/TermsOfService';
import { BlurView } from "@react-native-community/blur";
import { InputCode } from 'utils/InputCode';

export function Admin() {

  const { state, actions } = useAdmin();

  const admin = async () => {
    try {
      await actions.access();
    }
    catch (err) {
      Alert.alert(
        state.strings.error,
        state.strings.tryAgain,
      );
    }
  }

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior="padding" enabled={Platform.OS === 'ios' ? true : false}>
      <View style={styles.container}>
        <View style={styles.control}>
          <TouchableOpacity onPress={actions.login}>
            <Ionicons style={styles.config} name="user" size={24} color="#aaaaaa" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Databag</Text>
        <View style={styles.spacemid}>
          <Text style={styles.header} adjustsFontSizeToFit={true} numberOfLines={1}>{ state.strings.adminAccess }</Text>
        </View>
        <View style={styles.spacetop}>
          <View style={styles.inputwrapper}>
            <Ionicons style={styles.icon} name="database" size={18} color="#aaaaaa" />
            <TextInput style={styles.inputfield} value={state.server} onChangeText={actions.setServer}
                autoCorrect={false} autoCapitalize="none" placeholder={state.strings.server}
                placeholderTextColor={Colors.inputPlaceholder} />
            <View style={styles.space} />
          </View>
          <View style={styles.inputwrapper}>
            <Ionicons style={styles.icon} name="key" size={18} color="#aaaaaa" />
            <TextInput style={styles.inputfield} value={state.token} onChangeText={actions.setToken}
                secureTextEntry={!state.plainText} autoCapitalize="none" placeholder={state.strings.token}
                placeholderTextColor={Colors.inputPlaceholder} />
            <TouchableOpacity>
              { state.plainText && (
                <Ionicons style={styles.icon} name="eye" size={18} color="#aaaaaa" onPress={actions.hidePass}/>
              )}
              { !state.plainText && (
                <Ionicons style={styles.icon} name="eyeo" size={18} color="#aaaaaa" onPress={actions.showPass}/>
              )}
            </TouchableOpacity>
          </View>

          { Platform.OS !== 'ios' && (
            <View style={styles.tos}>
              <TouchableOpacity style={styles.viewterms} onPress={actions.showTerms}>
                <Text style={styles.viewtermstext}>{ state.strings.terms }</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.agreeterms} onPress={() => actions.agree(!state.agree)}>
                { state.agree && (
                  <MatIcons name={'checkbox-outline'} size={20} color={Colors.primary} />
                )}
                { !state.agree && (
                  <MatIcons name={'checkbox-blank-outline'} size={20} color={Colors.primary} />
                )}
                <Text style={styles.agreetermstext}>{ state.strings.agree }</Text>
              </TouchableOpacity>
            </View>
          )}

          { state.enabled && (Platform.OS === 'ios' || state.agree) && (
            <TouchableOpacity style={styles.reset} onPress={admin}>
              { state.busy && (
                <ActivityIndicator size="small" color="#ffffff" />
              )}
              { !state.busy && (
                <Text style={styles.resettext}>Access</Text>
              )}
            </TouchableOpacity>
          )}
          { (!state.enabled || (Platform.OS !== 'ios' && !state.agree)) && (
            <View style={styles.noreset}>
              <Text style={styles.noresettext}>{ state.strings.access }</Text>
            </View>
          )}
        </View>      
        <View style={styles.version}>
          <Text style={styles.versiontext}>v{ state.version }</Text>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.showTerms}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.hideTerms}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.terms} persistentScrollbar={true}>
            <Text style={styles.termsheader}>{ state.strings.policy }</Text>
            <Text numberOfLines={0} style={styles.termstext}>{ tos[state.strings.languageCode] }</Text>
          </ScrollView>
          <TouchableOpacity style={styles.done} onPress={actions.hideTerms}>
            <Text style={styles.donetext}>{ state.strings.close }</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.mfaModal}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={actions.dismissMFA}
      >
        <View>
          <BlurView style={styles.mfaOverlay} blurType={Colors.overlay} blurAmount={2} reducedTransparencyFallbackColor="black" />
          <View style={styles.mfaBase}>
            <View style={styles.mfaContainer}>
              <Text style={styles.mfaTitle}>{ state.strings.mfaTitle }</Text>
              <Text style={styles.mfaDescription}>{ state.strings.mfaEnter }</Text>
              <InputCode style={{ width: '100%' }} onChangeText={actions.setCode} />
              <View style={styles.mfaError}>
                { state.mfaError == '403' && (
                  <Text style={styles.mfaErrorLabel}>{ state.strings.mfaError }</Text>
                )}
                { state.mfaError == '429' && (
                  <Text style={styles.mfaErrorLabel}>{ state.strings.mfaDisabled }</Text>
                )}
              </View>
              <View style={styles.mfaControl}>
                <TouchableOpacity style={styles.mfaCancel} onPress={actions.dismissMFA}>
                  <Text style={styles.mfaCancelLabel}>{ state.strings.cancel }</Text>
                </TouchableOpacity>
                { state.mfaCode != '' && (
                  <TouchableOpacity style={styles.mfaConfirm} onPress={actions.login}>
                    <Text style={styles.mfaConfirmLabel}>{ state.strings.mfaConfirm }</Text>
                  </TouchableOpacity>
                )}
                { state.mfaCode == '' && (
                  <View style={styles.mfaDisabled}>
                    <Text style={styles.mfaDisabledLabel}>{ state.strings.mfaConfirm }</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
