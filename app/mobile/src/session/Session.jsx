import { Text } from 'react-native';
import { styles } from './Session.styled';
import { useSession } from './useSession.hook';

export function Session() {

  const { state, actions } = useSession();

  return <Text>SESSION</Text>
}


