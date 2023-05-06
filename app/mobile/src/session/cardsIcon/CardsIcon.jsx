import { View } from 'react-native';
import { useCardsIcon } from './useCardsIcon.hook';
import { styles } from './CardsIcon.styled';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { useCardIcon } from './useCardIcon.hook.js';

export function CardsIcon({ size, color, active }) {

  const { state, actions } = useCardIcon();

  return (
    <View>
      <Ionicons name={'contacts'} size={size} color={color} />
      { state.requested && (
        <View style={styles.requested} />
      )}
      { state.offsync && (
        <View style={styles.offsync} />
      )}
    </View>
  );
}

