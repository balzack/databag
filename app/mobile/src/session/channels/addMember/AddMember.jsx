import { Alert, Text, Switch, TouchableOpacity, View } from 'react-native';
import { Logo } from '../../../utils/Logo';
import { styles } from './AddMember.styled';
import { useAddMember } from './useAddMember.hook';
import Colors from '../../../constants/Colors';

export function AddMember({ members, item, setCard, clearCard }) {

  const { state, actions } = useAddMember(item, members);

  const setMember = (set) => {
    if (set) {
      setCard(item.cardId);
    }
    else {
      clearCard(item.cardId);
    }
  };

  return (
    <TouchableOpacity activeOpacity={1} style={styles.container} onPress={() => setMember(!state.member)}>
      <Logo src={state.logo} width={32} height={32} radius={6} />
      <View style={styles.detail}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{ state.name }</Text>
        <Text style={styles.handle} numberOfLines={1} ellipsizeMode={'tail'}>{ state.handle }</Text>
      </View>
      <Switch style={styles.switch} trackColor={styles.track}
        value={state.member} onValueChange={setMember} />
    </TouchableOpacity>
  );
}
