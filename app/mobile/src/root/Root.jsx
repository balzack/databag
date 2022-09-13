import { View } from 'react-native';
import { styles } from './Root.styled';
import { useRoot } from './useRoot.hook';

export function Root() {
  const root = useRoot();
  return <View style={styles.wrapper} />
}
