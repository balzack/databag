import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './Details.styled';
import { useDetails } from './useDetails.hook';
import { Logo } from 'utils/Logo';
import Ionicons from '@expo/vector-icons/AntDesign';
import Colors from 'constants/Colors';

export function DetailsHeader() {
  return <Text style={styles.title}>Topic Settings</Text>
}

export function DetailsBody({ channel, clearConversation }) {

  const { state, actions } = useDetails();

console.log(state);

  return (
    <View style={styles.details}>
      <Logo src={state.logo} width={72} height={72} radius={8} />
      <View style={styles.info}>
        <View style={styles.subject}>
          <Text style={styles.subject}>{ state.subject }</Text>
          { state.mode === 'host' && (
            <Ionicons name="edit" size={16} color={Colors.text} />
          )}
        </View>
        <Text style={styles.created}>{ state.created }</Text>
        <Text style={styles.mode}>{ state.mode }</Text>
      </View>  
    </View>
  )
}

export function Details({ channel, clearConversation }) {
  return (
    <View>
      <Text>DETAILS</Text>
      <DetailsBody channel={channel} clearConversation={clearConversation} />
    </View>
  )
}

