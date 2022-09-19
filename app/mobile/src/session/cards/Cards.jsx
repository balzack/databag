import { useState, useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from 'context/AppContext';

export function Cards({ navigation, openContact }) {

  const app = useContext(AppContext);
  const [cardId, setCardId] = useState(0);

  const onPressCard = () => {
    openContact(cardId);
    setCardId(cardId + 1);
  }

  return <TouchableOpacity onPress={onPressCard}><Text>CARD</Text></TouchableOpacity>
}

