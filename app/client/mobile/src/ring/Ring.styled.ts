import {StyleSheet} from 'react-native';
import { Colors } from '../constants/Colors';

export const styles = StyleSheet.create({
  active: {
    width: '100%',
    height: 64,
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
    borderRadius: 16,
    overflow: 'hidden',
    paddingLeft: 16,
    paddingRight: 8,
  },
  card: {
    padding: 8,
    width: '100%',
  },
  circleIcon: {
  },
  flipIcon: {
    transform: [{ rotate: '135deg' }],
  },
  end: {
  },
  name: {
    flexGrow: 1,
    flexShrink: 1,
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 8,
  },
  nameSet: {
    fontSize: 20,
  },
  nameUnset: {
    fontSize: 20,
    fontStyle: 'italic',
  },
  status: {
    width: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  duration: {
    color: Colors.primary,
    fontSize: 20,
  },
});
