import { KeyboardAvoidingView, ScrollView, ActivityIndicator, Alert, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { styles } from './Create.styled';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { useCreate } from './useCreate.hook';
import Colors from 'constants/Colors';

export function Create() {

  const { state, actions } = useCreate();

  const create = async () => {
    try {
      await actions.create();
    }
    catch (err) {
      Alert.alert(
        "Create Failed",
        "Please check your server and token.",
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
          <Text style={styles.header}>Create Account</Text>
        </View>
        <ScrollView style={styles.spacetop}>
          <View style={styles.inputwrapper}>
            <Ionicons style={styles.icon} name="database" size={18} color="#888888" />
            <TextInput style={styles.inputfield} value={state.server} onChangeText={actions.setServer}
                autoCorrect={false} autoCapitalize="none" placeholder="server" placeholderTextColor={Colors.grey} />
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
                <Ionicons style={styles.icon} name="key" size={18} color="#888888" />
                <TextInput style={styles.inputfield} value={state.token} onChangeText={actions.setToken}
                    autoCorrect={false} autoCapitalize="none" placeholder="token" placeholderTextColor={Colors.grey} />
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
                <Text style={styles.demoText}>The default public server is to test out the system. Use a private server othersize.</Text>
              </View>
            )}
          </View>
          <View style={styles.inputwrapper}>
            <Ionicons style={styles.icon} name="user" size={18} color="#888888" />
            <TextInput style={styles.inputfield} value={state.username} onChangeText={actions.setUsername}
                autoCorrect={false} autoCapitalize="none" placeholder="username" placeholderTextColor={Colors.grey} />
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
              <Ionicons style={styles.icon} name="lock" size={18} color="#888888" />
              <TextInput style={styles.inputfield} value={state.password} onChangeText={actions.setPassword}
                  autoCorrect={false} autoCapitalize="none" placeholder="password" placeholderTextColor={Colors.grey} />
              <TouchableOpacity onPress={actions.hidePassword}>
                <Ionicons style={styles.icon} name="eye" size={18} color="#888888" />
              </TouchableOpacity>
            </View>
          )}
          { !state.showPassword && (
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="lock" size={18} color="#888888" />
              <TextInput style={styles.inputfield} value={state.password} onChangeText={actions.setPassword}
                  autoCorrect={false} secureTextEntry={true} autoCapitalize="none" placeholder="password" 
                  placeholderTextColor={Colors.grey} />
              <TouchableOpacity onPress={actions.showPassword}>
                <Ionicons style={styles.icon} name="eyeo" size={18} color="#888888" />
              </TouchableOpacity>
            </View>
          )}
          { state.showConfirm && (
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="lock" size={18} color="#888888" />
              <TextInput style={styles.inputfield} value={state.confirm} onChangeText={actions.setConfirm}
                  autoCorrect={false} autoCapitalize="none" placeholder="confirm password"
                  placeholderTextColor={Colors.grey} />
              <TouchableOpacity onPress={actions.hideConfirm}>
                <Ionicons style={styles.icon} name="eye" size={18} color="#888888" />
              </TouchableOpacity>
            </View>
          )}
          { !state.showConfirm && (
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="lock" size={18} color="#888888" />
              <TextInput style={styles.inputfield} value={state.confirm} onChangeText={actions.setConfirm}
                  autoCorrect={false} secureTextEntry={true} autoCapitalize="none" placeholder="confirm password"
                  placeholderTextColor={Colors.grey} />
              <TouchableOpacity onPress={actions.showConfirm}>
                <Ionicons style={styles.icon} name="eyeo" size={18} color="#888888" />
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
                  <Text style={styles.createtext}>Create Account</Text>
                )}
              </TouchableOpacity>
            )}
            { !state.enabled && (
              <View style={styles.nocreate}>
                <Text style={styles.nocreatetext}>Create</Text>
              </View>
            )}
            <TouchableOpacity style={styles.login} onPress={actions.login}>
              <Text style={styles.logintext}>Account Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>      
      </View>
    </KeyboardAvoidingView>
  );
}
