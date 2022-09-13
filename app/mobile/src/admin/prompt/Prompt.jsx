import { ActivityIndicator, Alert, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { styles } from './Prompt.styled';
import Ionicons from '@expo/vector-icons/AntDesign';
import { usePrompt } from './usePrompt.hook';

export function Prompt({ login }) {

  const { state, actions } = usePrompt();

  const setLogin = async () => {
    try {
      let config = await actions.attach();
      login(state.password, config);
    }
    catch(err) {
      Alert.alert(
        "Access Failed",
        "Please check your admin token.",
      );
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.control}>
          <TouchableOpacity onPress={actions.login}>
            <Ionicons style={styles.config} name="user" size={24} color="#aaaaaa" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
