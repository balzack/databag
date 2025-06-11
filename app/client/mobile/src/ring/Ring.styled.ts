import {StyleSheet} from 'react-native';
import {Colors} from '../constants/Colors';

export const styles = StyleSheet.create({
  active: {
    width: '100%',
    height: 80,
    maxWidth: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactive: {
    display: 'none',
  },
  ring: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingLeft: 16,
    paddingRight: 8,
  },
  card: {
    padding: 8,
    width: '100%',
  },
  clearIcon: {
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
  },
  flipIcon: {
    transform: [{rotate: '135deg'}],
  },
  end: {
    padding: 8,
    transform: [{rotate: '135deg'}],
  },
  name: {
    flexGrow: 1,
    flexShrink: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  nameSet: {
    fontSize: 24,
    fontWeight: 600,
    color: 'white',
  },
  ringing: {
    fontSize: 14,
  },
  nameUnset: {
    fontSize: 24,
    fontStyle: 'italic',
    color: 'white',
  },
  handle: {
    fontSize: 18,
    color: 'white',
  },
  duration: {
    color: 'white',
    fontSize: 14,
  },
});
