import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.primary,
  },
  home: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '33%',
    maxWidth: 500,
  },
  conversation: {
    height: '100%',
    flexGrow: 1,
    backgroundColor: 'yellow',
  },
  options: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: 'red',
  },
  option: {
    width: '50%',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    paddingRight: 8,
  },
  channels: {
    flexGrow: 1,
    backgroundColor: 'green',
  },
});
