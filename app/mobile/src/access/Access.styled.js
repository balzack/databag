import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
  },
  splash: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'center',
  },
  pane: {
    width: '50%',
    height: '100%',
  },
  paddedPane: {
    width: '50%',
    height: '100%',
    paddingRight: 16,
  },
});
