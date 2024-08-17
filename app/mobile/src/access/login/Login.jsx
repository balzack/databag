import { Platform, KeyboardAvoidingView, ActivityIndicator, Modal, ScrollView, Alert, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { styles } from './Login.styled';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { useLogin } from './useLogin.hook';
import { Colors } from '../../constants/Colors';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { tos } from '../../constants/TermsOfService';
import { BlurView } from "@react-native-community/blur";
import { InputCode } from '../../utils/InputCode';

export function Login() {

  const { state, actions } = useLogin();

  const login = async () => {
    try {
      await actions.login();
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
          <TouchableOpacity onPress={actions.config}>
            <Ionicons style={styles.config} name="setting" size={24} color="#aaaaaa" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Databag!</Text>
        <View style={styles.spacemid}>
          <Text style={styles.header}>{ state.strings.login }</Text>
        </View>
        <View style={styles.spacetop}>
          <View style={styles.inputwrapper}>
            <Ionicons style={styles.icon} name="user" size={18} color="#aaaaaa" />
            <TextInput style={styles.inputfield} value={state.login} onChangeText={actions.setLogin}
                autoCorrect={false} autoCapitalize="none" placeholder={`${state.strings.username} / ${state.strings.server}`}
                placeholderTextColor={Colors.inputPlaceholder} />
            <View style={styles.space} />
          </View>
          { state.showPassword && (
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="lock" size={18} color="#aaaaaa" />
              <TextInput style={styles.inputfield} value={state.password} onChangeText={actions.setPassword}
                  autoCorrect={false} autoCapitalize="none" placeholder={state.strings.password}
                  placeholderTextColor={Colors.inputPlaceholder} />
              <TouchableOpacity onPress={actions.hidePassword}>
                <Ionicons style={styles.icon} name="eye" size={18} color="#aaaaaa" />
              </TouchableOpacity>
            </View>
          )}
          { !state.showPassword && (
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="lock" size={18} color="#aaaaaa" />
              <TextInput style={styles.inputfield} value={state.password} onChangeText={actions.setPassword}
                  autoCorrect={false} secureTextEntry={true} autoCapitalize="none" placeholder={state.strings.password} 
                  placeholderTextColor={Colors.inputPlaceholder} />
              <TouchableOpacity onPress={actions.showPassword}>
                <Ionicons style={styles.icon} name="eyeo" size={18} color="#aaaaaa" />
              </TouchableOpacity>
            </View>
          )}

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
            <TouchableOpacity style={styles.login} onPress={login}>
              { state.busy && (
                <ActivityIndicator size="small" color="#ffffff" />
              )}
              { !state.busy && (
                <Text style={styles.logintext}>Login</Text>
              )}
            </TouchableOpacity>
          )}
          { (!state.enabled || (Platform.OS !== 'ios' && !state.agree)) && (
            <View style={styles.nologin}>
              <Text style={styles.nologintext}>{ state.strings.login }</Text>
            </View>
          )}
          <TouchableOpacity style={styles.create} onPress={actions.create}>
            <Text style={styles.createtext}>{ state.strings.createAccount }</Text>
          </TouchableOpacity>
          <View style={styles.bottom}>
            <TouchableOpacity style={styles.create} onPress={actions.reset}>
              <Text style={styles.createtext}>{ state.strings.forgotPassword }</Text>
            </TouchableOpacity>
          </View>
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
