import { Platform, KeyboardAvoidingView, ScrollView, ActivityIndicator, Alert, Modal, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { styles } from './Create.styled';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { useCreate } from './useCreate.hook';
import Colors from 'constants/Colors';
import MatIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { tos } from 'constants/TermsOfService';

export function Create() {

  const { state, actions } = useCreate();

  const create = async () => {
    try {
      await actions.create();
    }
    catch (err) {
      Alert.alert(
        state.strings.error,
        state.strings.tryAgain,
      );
    }
  }

  const validServer = (state.server && state.serverChecked && state.serverValid);
  const validToken = (!state.tokenRequired || (state.token && state.tokenChecked && state.tokenValid));
  const validUsername = (state.username && state.usernameChecked && state.usernameValid);

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
          <Text style={styles.header}>{ state.strings.createAccount }</Text>
        </View>
        <ScrollView style={styles.spacetop}>
          <View style={styles.inputwrapper}>
            <Ionicons style={styles.icon} name="database" size={18} color={Colors.inputPlaceholder} />
            <TextInput style={styles.inputfield} value={state.server} onChangeText={actions.setServer}
                autoCorrect={false} autoCapitalize="none" placeholder={state.strings.server}
                placeholderTextColor={Colors.inputPlaceholder} />
            { (!state.server || !state.serverChecked) && (
              <View style={styles.required}>
                <Text style={styles.requiredtest}>✻</Text>
              </View>
            )}
            { state.server && state.serverChecked && !state.serverValid && (
              <Ionicons style={styles.icon} name="exclamationcircleo" size={18} color="#ff8888" />
            )}
            { state.server && state.serverChecked && state.serverValid && (
              <Ionicons style={styles.icon} name="checkcircleo" size={18} color="#448866" />
            )}
          </View>
          <View style={styles.token}>
            { state.tokenRequired && (
              <View style={styles.inputwrapper}>
                <Ionicons style={styles.icon} name="key" size={18} color={Colors.inputPlaceholder} />
                <TextInput style={styles.inputfield} value={state.token} onChangeText={actions.setToken}
                    autoCorrect={false} autoCapitalize="none" placeholder={state.strings.token}
                    placeholderTextColor={Colors.inputPlaceholder} />
                <View style={styles.space}>
                  { (!validServer || !state.token || !state.tokenChecked) && (
                    <Text style={styles.required}>✻</Text>
                  )}
                  { validServer && state.token && state.tokenChecked && !state.tokenValid && (
                    <Ionicons style={styles.icon} name="exclamationcircleo" size={18} color="#ff8888" />
                  )}
                  { validServer && state.token && state.tokenChecked && state.tokenValid && (
                    <Ionicons style={styles.icon} name="checkcircleo" size={18} color="#448866" />
                  )}
                </View>
              </View>
            )}
            { !state.tokenRequired && state.server === 'databag.coredb.org' && (
              <View style={styles.demo}>
                <Text style={styles.demoText}>{state.strings.defaultPublic}</Text>
              </View>
            )}
          </View>
          <View style={styles.inputwrapper}>
            <Ionicons style={styles.icon} name="user" size={18} color={Colors.inputPlaceholder} />
            <TextInput style={styles.inputfield} value={state.username} onChangeText={actions.setUsername}
                autoCorrect={false} autoCapitalize="none" placeholder={state.strings.username}
                placeholderTextColor={Colors.inputPlaceholder} />
            { (!validServer || !validToken || !state.username || !state.usernameChecked) && (
              <Text style={styles.required}>✻</Text>
            )}
            { validServer && validToken && state.username && state.usernameChecked && !state.usernameValid && (
              <Ionicons style={styles.icon} name="exclamationcircleo" size={18} color="#ff8888" />
            )}
            { validServer && validToken && state.username && state.usernameChecked && state.usernameValid && (
              <Ionicons style={styles.icon} name="checkcircleo" size={18} color="#448866" />
            )}
          </View>
          { state.showPassword && (
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="lock" size={18} color={Colors.inputPlaceholder} />
              <TextInput style={styles.inputfield} value={state.password} onChangeText={actions.setPassword}
                  autoCorrect={false} autoCapitalize="none" placeholder={state.strings.password}
                  placeholderTextColor={Colors.inputPlaceholder} />
              <TouchableOpacity onPress={actions.hidePassword}>
                <Ionicons style={styles.icon} name="eye" size={18} color={Colors.inputPlaceholder} />
              </TouchableOpacity>
            </View>
          )}
          { !state.showPassword && (
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="lock" size={18} color={Colors.inputPlaceholder} />
              <TextInput style={styles.inputfield} value={state.password} onChangeText={actions.setPassword}
                  autoCorrect={false} secureTextEntry={true} autoCapitalize="none" placeholder={state.strings.password} 
                  placeholderTextColor={Colors.inputPlaceholder} />
              <TouchableOpacity onPress={actions.showPassword}>
                <Ionicons style={styles.icon} name="eyeo" size={18} color={Colors.inputPlaceholder} />
              </TouchableOpacity>
            </View>
          )}
          { state.showConfirm && (
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="lock" size={18} color={Colors.inputPlaceholder} />
              <TextInput style={styles.inputfield} value={state.confirm} onChangeText={actions.setConfirm}
                  autoCorrect={false} autoCapitalize="none" placeholder={state.strings.confirmPassword}
                  placeholderTextColor={Colors.inputPlaceholder} />
              <TouchableOpacity onPress={actions.hideConfirm}>
                <Ionicons style={styles.icon} name="eye" size={18} color={Colors.inputPlaceholder} />
              </TouchableOpacity>
            </View>
          )}
          { !state.showConfirm && (
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="lock" size={18} color={Colors.inputPlaceholder} />
              <TextInput style={styles.inputfield} value={state.confirm} onChangeText={actions.setConfirm}
                  autoCorrect={false} secureTextEntry={true} autoCapitalize="none" placeholder={state.strings.confirmPassword}
                  placeholderTextColor={Colors.inputPlaceholder} />
              <TouchableOpacity onPress={actions.showConfirm}>
                <Ionicons style={styles.icon} name="eyeo" size={18} color={Colors.inputPlaceholder} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.buttons}>
            { state.enabled && (
              <TouchableOpacity style={styles.create} onPress={create}>
                { state.busy && (
                  <ActivityIndicator size="small" color="#ffffff" />
                )}
                { !state.busy && (
                  <Text style={styles.createtext}>{ state.strings.create }</Text>
                )}
              </TouchableOpacity>
            )}
            { !state.enabled && (
              <View style={styles.nocreate}>
                <Text style={styles.nocreatetext}>{ state.strings.create }</Text>
              </View>
            )}
            <TouchableOpacity style={styles.login} onPress={actions.login}>
              <Text style={styles.logintext}>{ state.strings.accountLogin }</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>      
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
            <Text style={styles.termstext}numberOfLines={0}>{ tos[state.strings.languageCode] }</Text>
          </ScrollView>
          <TouchableOpacity style={styles.done} onPress={actions.hideTerms}>
            <Text style={styles.donetext}>{ state.strings.close }</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
