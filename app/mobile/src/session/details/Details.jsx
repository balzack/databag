import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { styles } from './Details.styled';
import { useDetails } from './useDetails.hook';
import { Logo } from 'utils/Logo';
import Ionicons from '@expo/vector-icons/AntDesign';
import Colors from 'constants/Colors';
import { MemberItem } from './memberItem/MemberItem';

export function DetailsHeader() {
  return <Text style={styles.title}>Topic Settings</Text>
}

export function DetailsBody({ channel, clearConversation }) {

  const { state, actions } = useDetails();

  if(state.contacts) {
    state.contacts.forEach(c => {
      console.log(c.cardId, c.profile);
    });
  }

  return (
    <View style={styles.body}>
      <View style={styles.details}>
        <Logo src={state.logo} width={72} height={72} radius={8} />
        <View style={styles.info}>
          <TouchableOpacity style={styles.subject}>
            <Text style={styles.subject}>{ state.subject }</Text>
            { !state.hostId && (
              <Ionicons name="edit" size={16} color={Colors.text} />
            )}
          </TouchableOpacity>
          <Text style={styles.created}>{ state.created }</Text>
          <Text style={styles.mode}>{ state.mode }</Text>
        </View>  
      </View>

      <View style={styles.controls}>
        { !state.hostId && (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Delete Topic</Text>
          </TouchableOpacity>
        )}
        { !state.hostId && (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Edit Membership</Text>
          </TouchableOpacity>
        )}
        { state.hostId && (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Leave Topic</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.members}>
        <Text style={styles.membersLabel}>Members:</Text>
      </View>

      <FlatList style={styles.cards}
        data={state.contacts}
        renderItem={({ item }) => <MemberItem item={item} />}
        keyExtractor={item => item.cardId}
      />

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

