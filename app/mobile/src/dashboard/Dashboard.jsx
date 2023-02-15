import { Text } from 'react-native';
import { styles } from './Dashboard.styled';
import { useDashboard } from './useDashboard.hook';

export function Dashboard(props) {

  const { state, actions } = useDashboard(config, server, token);

  return <Text>DASHBOARD</Text>;
}

