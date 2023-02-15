import { KeyboardAvoidingView, ActivityIndicator, Alert, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { styles } from './Login.styled';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { useLogin } from './useLogin.hook';
import { Colors } from 'constants/Colors';

export function Login() {

  const { state, actions } = useLogin();

  const login = async () => {
    try {
      await actions.login();
    }
    catch (err) {
      Alert.alert(
        "Login Failed",
        "Please check your login and password.",
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
          <Text style={styles.header}>Login</Text>
        </View>
        <View style={styles.spacetop}>
          <View style={styles.inputwrapper}>
            <Ionicons style={styles.icon} name="user" size={18} color="#aaaaaa" />
            <TextInput style={styles.inputfield} value={state.login} onChangeText={actions.setLogin}
                autoCorrect={false} autoCapitalize="none" placeholder="username@server" placeholderTextColor={Colors.grey} />
            <View style={styles.space} />
          </View>
          { state.showPassword && (
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="lock" size={18} color="#aaaaaa" />
              <TextInput style={styles.inputfield} value={state.password} onChangeText={actions.setPassword}
                  autoCorrect={false} autoCapitalize="none" placeholder="password" placeholderTextColor={Colors.grey} />
              <TouchableOpacity onPress={actions.hidePassword}>
                <Ionicons style={styles.icon} name="eye" size={18} color="#aaaaaa" />
              </TouchableOpacity>
            </View>
          )}
          { !state.showPassword && (
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="lock" size={18} color="#aaaaaa" />
              <TextInput style={styles.inputfield} value={state.password} onChangeText={actions.setPassword}
                  autoCorrect={false} secureTextEntry={true} autoCapitalize="none" placeholder="password" 
                  placeholderTextColor={Colors.grey} />
              <TouchableOpacity onPress={actions.showPassword}>
                <Ionicons style={styles.icon} name="eyeo" size={18} color="#aaaaaa" />
              </TouchableOpacity>
            </View>
          )}
          { state.enabled && (
            <TouchableOpacity style={styles.login} onPress={login}>
              { state.busy && (
                <ActivityIndicator size="small" color="#ffffff" />
              )}
              { !state.busy && (
                <Text style={styles.logintext}>Login</Text>
              )}
            </TouchableOpacity>
          )}
          { !state.enabled && (
            <View style={styles.nologin}>
              <Text style={styles.nologintext}>Login</Text>
            </View>
          )}
          <TouchableOpacity style={styles.create} onPress={actions.create}>
            <Text style={styles.createtext}>Create Account</Text>
          </TouchableOpacity>
          <View style={styles.bottom}>
            <TouchableOpacity style={styles.create} onPress={actions.reset}>
              <Text style={styles.createtext}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
        </View>      
      </View>
    </KeyboardAvoidingView>
  );
}
