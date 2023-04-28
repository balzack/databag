import { View } from 'react-native';
import { useProfileIcon } from './useProfileIcon.hook';
import { styles } from './ProfileIcon.styled';
import Ionicons from 'react-native-vector-icons/AntDesign';

export function ProfileIcon({ size, color }) {

  const { state, actions } = useProfileIcon();

  return (
    <View>
      <Ionicons name={'user'} size={size} color={color} />
      { state.disconnected && (
        <View style={styles.disconnected} />
      )}
    </View>
  );
}

