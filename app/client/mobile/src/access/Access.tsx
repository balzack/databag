import { Text } from 'react-native';
import { useAccess } from './useAccess.hook';

export function Access() {
  const { state, actions } = useAccess();
  return <Text>ACCESS</Text>
}
