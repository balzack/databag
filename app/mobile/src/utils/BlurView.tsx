import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

export function BlurView() {
  const theme = useTheme();
  return <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: theme.colors.backdrop }}></View>
}
