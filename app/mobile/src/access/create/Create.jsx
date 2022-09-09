import { ScrollView, ActivityIndicator, Alert, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { styles } from './Create.styled';
import Ionicons from '@expo/vector-icons/AntDesign';
import { useCreate } from './useCreate.hook';

export function Create() {

  const { state, actions } = useCreate();

  const create = async () => {
    try {
      await actions.create();
    }
    catch (err) {
      Alert.alert(
        "Create Failed",
        "Please check your username and password.",
      );
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.control}>
          <TouchableOpacity onPress={actions.config}>
            <Ionicons style={styles.config} name="setting" size={24} color="#888888" />
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
                autoCapitalize="none" placeholder="server" />
            <View style={styles.space}>
              <Text style={styles.required}>✻</Text>
            </View>
          </View>
          { state.tokenRequired && (
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="key" size={18} color="#888888" />
              <TextInput style={styles.inputfield} value={state.token} onChangeText={actions.setToken}
                  autoCapitalize="none" placeholder="token" />
              <View style={styles.space} />
            </View>
          )}
          <View style={styles.inputwrapperpad}>
            <Ionicons style={styles.icon} name="user" size={18} color="#888888" />
            <TextInput style={styles.inputfield} value={state.username} onChangeText={actions.setUsername}
                autoCapitalize="none" placeholder="username" />
            <View style={styles.space}>
              <Text style={styles.required}>✻</Text>
            </View>
          </View>
          { state.showPassword && (
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="lock" size={18} color="#888888" />
              <TextInput style={styles.inputfield} value={state.password} onChangeText={actions.setPassword}
                  autoCapitalize="none" placeholder="password" />
              <TouchableOpacity onPress={actions.hidePassword}>
                <Ionicons style={styles.icon} name="eye" size={18} color="#888888" />
              </TouchableOpacity>
            </View>
          )}
          { !state.showPassword && (
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="lock" size={18} color="#888888" />
              <TextInput style={styles.inputfield} value={state.password} onChangeText={actions.setPassword}
                  secureTextEntry={true} autoCapitalize="none" placeholder="password" />
              <TouchableOpacity onPress={actions.showPassword}>
                <Ionicons style={styles.icon} name="eyeo" size={18} color="#888888" />
              </TouchableOpacity>
            </View>
          )}
          { state.showConfirm && (
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="lock" size={18} color="#888888" />
              <TextInput style={styles.inputfield} value={state.confirm} onChangeText={actions.setConfirm}
                  autoCapitalize="none" placeholder="confirm password" />
              <TouchableOpacity onPress={actions.hideConfirm}>
                <Ionicons style={styles.icon} name="eye" size={18} color="#888888" />
              </TouchableOpacity>
            </View>
          )}
          { !state.showConfirm && (
            <View style={styles.inputwrapper}>
              <Ionicons style={styles.icon} name="lock" size={18} color="#888888" />
              <TextInput style={styles.inputfield} value={state.confirm} onChangeText={actions.setConfirm}
                  secureTextEntry={true} autoCapitalize="none" placeholder="confirm password" />
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
            <TouchableOpacity style={styles.login} onPress={actions.create}>
              <Text style={styles.createtext}>Account Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>      
      </View>
    </View>
  );
}
