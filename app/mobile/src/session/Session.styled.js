import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
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
    width: '67%',
  },
  drawer: {
    width: '100%',
    height: '100%',
    paddingLeft: 8,
    backgroundColor: Colors.formBackground,
  },
  options: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 4,
    paddingRight: 8,
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
    flexShrink: 1,
    position: 'relative',
  },
  tabframe: {
    width: '100%',
    height: '100%',
  },
  disconnected: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.alert,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  profileLabel: {
    paddingLeft: 8,
  },
});
