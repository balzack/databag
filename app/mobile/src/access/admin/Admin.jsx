import { KeyboardAvoidingView, ActivityIndicator, Alert, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { styles } from './Admin.styled';
import Ionicons from '@expo/vector-icons/AntDesign';
import { useAdmin } from './useAdmin.hook';
import Colors from 'constants/Colors';

export function Admin() {

  const { state, actions } = useAdmin();

  const admin = async () => {
    try {
      await actions.access();
    }
    catch (err) {
      Alert.alert(
        "Access Failed",
        "Please check your server and token.",
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
          <Text style={styles.header}>Admin Acess</Text>
        </View>
        <View style={styles.spacetop}>
          <View style={styles.inputwrapper}>
            <Ionicons style={styles.icon} name="database" size={18} color="#aaaaaa" />
            <TextInput style={styles.inputfield} value={state.server} onChangeText={actions.setServer}
                autoCorrect={false} autoCapitalize="none" placeholder="server" placeholderTextColor={Colors.grey} />
            <View style={styles.space} />
          </View>
          <View style={styles.inputwrapper}>
            <Ionicons style={styles.icon} name="key" size={18} color="#aaaaaa" />
            <TextInput style={styles.inputfield} value={state.token} onChangeText={actions.setToken}
                secureTextEntry={!state.plainText} autoCapitalize="none" placeholder="token"
                placeholderTextColor={Colors.grey} />
            <TouchableOpacity>
              { state.plainText && (
                <Ionicons style={styles.icon} name="eye" size={18} color="#aaaaaa" onPress={actions.hidePass}/>
              )}
              { !state.plainText && (
                <Ionicons style={styles.icon} name="eyeo" size={18} color="#aaaaaa" onPress={actions.showPass}/>
              )}
            </TouchableOpacity>
          </View>
          { state.enabled && (
            <TouchableOpacity style={styles.reset} onPress={admin}>
              { state.busy && (
                <ActivityIndicator size="small" color="#ffffff" />
              )}
              { !state.busy && (
                <Text style={styles.resettext}>Access</Text>
              )}
            </TouchableOpacity>
          )}
          { !state.enabled && (
            <View style={styles.noreset}>
              <Text style={styles.noresettext}>Access</Text>
            </View>
          )}
        </View>      
        <View style={styles.version}>
          <Text style={styles.versiontext}>v{ state.version }</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
