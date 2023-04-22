import { Text, View } from 'react-native';
import { useSharing } from './useSharing.hook';
import { styles } from './Sharing.styled';

export function Sharing({ setShare, clearShare }) {

  const { state, actions } = useSharing();

  return (
    <View style={styles.sharingBase}>
      <View style={styles.sharingFrame}>
        <Text>SHARING</Text>
      </View>
    </View>
  )
}
