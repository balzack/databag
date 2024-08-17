import { KeyboardAvoidingView, ActivityIndicator, Modal, ScrollView, Alert, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { styles } from './Reset.styled';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { useReset } from './useReset.hook';
import Colors from '../../constants/Colors';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { tos } from '../../constants/TermsOfService';

export function Reset() {

  const { state, actions } = useReset();

  const reset = async () => {
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
          <TouchableOpacity onPress={actions.config}>
            <Ionicons style={styles.config} name="setting" size={24} color="#aaaaaa" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Databag</Text>
        <View style={styles.spacemid}>
          <Text style={styles.header}>{ state.strings.accessAccount }</Text>
        </View>
        <View style={styles.spacetop}>
          <View style={styles.inputwrapper}>
            <Ionicons style={styles.icon} name="database" size={18} color="#aaaaaa" />
            <TextInput style={styles.inputfield} value={state.server} onChangeText={actions.setServer}
                autoCapitalize="none" placeholder={state.strings.server} placeholderTextColor={Colors.inputPlaceholder} />
            <View style={styles.space} />
          </View>
          <View style={styles.inputwrapper}>
            <Ionicons style={styles.icon} name="key" size={18} color="#aaaaaa" />
            <TextInput style={styles.inputfield} value={state.token} onChangeText={actions.setToken}
                autoCapitalize="none" placeholder={state.strings.token} placeholderTextColor={Colors.inputPlaceholder} />
            <View style={styles.space} />
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
                <Text style={styles.agreetermstext}>{state.strings.agree}</Text>
              </TouchableOpacity>
            </View>
          )}

          { state.enabled && (Platform.OS === 'ios' || state.agree) && (
            <TouchableOpacity style={styles.reset} onPress={reset}>
              { state.busy && (
                <ActivityIndicator size="small" color="#ffffff" />
              )}
              { !state.busy && (
                <Text style={styles.resettext}>{ state.strings.access }</Text>
              )}
            </TouchableOpacity>
          )}
          { (!state.enabled || (Platform.OS !== 'ios' && !state.agree)) && (
            <View style={styles.noreset}>
              <Text style={styles.noresettext}>{ state.strings.access }</Text>
            </View>
          )}
          <TouchableOpacity style={styles.login} onPress={actions.login}>
            <Text style={styles.logintext}>{ state.strings.accountLogin }</Text>
          </TouchableOpacity>
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
    </KeyboardAvoidingView>
  );
}
