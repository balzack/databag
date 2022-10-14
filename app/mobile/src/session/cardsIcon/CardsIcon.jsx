import { View } from 'react-native';
import { useCardsIcon } from './useCardsIcon.hook';
import { styles } from './CardsIcon.styled';
import Ionicons from '@expo/vector-icons/AntDesign';

export function CardsIcon({ size, color, active }) {

  const { state, actions } = useCardsIcon(active);

  return (
    <View>
      <Ionicons name={'contacts'} size={size} color={color} />
      { state.curRevision !== state.setRevision && (
        <View style={styles.requested} />
      )}
    </View>
  );
}

