import { View } from 'react-native';
import { useCardsIcon } from './useCardsIcon.hook';
import { styles } from './CardsIcon.styled';
import Ionicons from 'react-native-vector-icons/AntDesign';

export function CardsIcon({ size, color, active }) {

  return (
    <View>
      <Ionicons name={'contacts'} size={size} color={color} />
    </View>
  );
}

