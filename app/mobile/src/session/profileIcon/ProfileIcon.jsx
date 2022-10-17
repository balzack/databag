import { View } from 'react-native';
import { useProfileIcon } from './useProfileIcon.hook';
import { styles } from './ProfileIcon.styled';
import Ionicons from '@expo/vector-icons/AntDesign';

export function ProfileIcon({ size, color }) {

  const { state, actions } = useProfileIcon();

  return (
    <View>
      <Ionicons name={'user'} size={size} color={color} />
      { state.disconnected > 3 && (
        <View style={styles.disconnected} />
      )}
    </View>
  );
}

