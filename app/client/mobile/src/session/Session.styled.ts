import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  screen: {
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
    minWidth: 325,
    backgroundColor: 'yellow',
  },
  right: {
    height: '100%',
    display: 'flex',
    flexGrow: 1,
  },
});

