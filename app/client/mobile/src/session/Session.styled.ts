import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  full: {
    width: '100%',
    height: '100%',
  },
  frame: {
    display: 'flex',
    flexDirection: 'row',
  },
  left: {
    height: '100%',
    width: '33%',
    maxWidth: 300,
  },
  right: {
    height: '100%',
    display: 'flex',
    flexGrow: 1,
  },
  channels: {
    flexGrow: 1,
  },
  screen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  body: {
    width: '100%',
    flexGrow: 1,
    flexShrink: 1,
  },
  tabs: {
    flexShrink: 0,
    height: 64,
    width: '100%',
    displlay: 'flex',
    flexDirection: 'row',
  },
  idleTab: {
    flex: 1,
    backgroundColor: 'transparent',
    opacity: 0.5,
  },
  activeTab: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
