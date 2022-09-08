import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import { styles } from './Login.styled';
import Ionicons from '@expo/vector-icons/AntDesign';
import { useLogin } from './useLogin.hook';

export function Login() {

  const { state, actions } = useLogin();

  return (
    <View style={styles.wrapper}>
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
                autoCapitalize="none" />
            <View style={styles.space} />
          </View>
          <View style={styles.inputwrapper}>
            <Ionicons style={styles.icon} name="lock" size={18} color="#aaaaaa" />
            <TextInput style={styles.inputfield} value={state.password} onChangeText={actions.setPassword}
                autoCapitalize="none" />
            <TouchableOpacity>
              <Ionicons style={styles.icon} name="eye" size={18} color="#aaaaaa" />
            </TouchableOpacity>
          </View>
          { state.enabled && (
            <TouchableOpacity style={styles.login}>
              <Text style={styles.logintext}>Login</Text>
            </TouchableOpacity>
          )}
          { !state.enabled && (
            <View style={styles.nologin}>
              <Text style={styles.nologintext}>Login</Text>
            </View>
          )}
          { state.createable && (
            <TouchableOpacity style={styles.create}>
              <Text style={styles.createtext}>Create Account</Text>
            </TouchableOpacity>
          )}
          { !state.createable && (
            <View style={styles.create}>
              <Text style={styles.nocreatetext}>Create Account</Text>
            </View>
          )}
        </View>      
      </View>
    </View>
  );
}
