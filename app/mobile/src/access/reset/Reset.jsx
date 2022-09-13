import { ActivityIndicator, Alert, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { styles } from './Reset.styled';
import Ionicons from '@expo/vector-icons/AntDesign';
import { useReset } from './useReset.hook';

export function Reset() {

  const { state, actions } = useReset();

  const reset = async () => {
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
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.control}>
          <TouchableOpacity onPress={actions.config}>
            <Ionicons style={styles.config} name="setting" size={24} color="#aaaaaa" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Databag</Text>
        <View style={styles.spacemid}>
          <Text style={styles.header}>Access Account</Text>
        </View>
        <View style={styles.spacetop}>
          <View style={styles.inputwrapper}>
            <Ionicons style={styles.icon} name="database" size={18} color="#aaaaaa" />
            <TextInput style={styles.inputfield} value={state.server} onChangeText={actions.setServer}
                autoCapitalize="none" placeholder="server" />
            <View style={styles.space} />
          </View>
          <View style={styles.inputwrapper}>
            <Ionicons style={styles.icon} name="key" size={18} color="#aaaaaa" />
            <TextInput style={styles.inputfield} value={state.token} onChangeText={actions.setToken}
                autoCapitalize="none" placeholder="token"/>
            <View style={styles.space} />
          </View>
          { state.enabled && (
            <TouchableOpacity style={styles.reset} onPress={reset}>
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
          <TouchableOpacity style={styles.login} onPress={actions.login}>
            <Text style={styles.createtext}>Account Login</Text>
          </TouchableOpacity>
        </View>      
      </View>
    </View>
  );
}
