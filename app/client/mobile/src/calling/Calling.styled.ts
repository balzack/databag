import {StyleSheet} from 'react-native';
import { Colors } from '../constants/Colors';

export const styles = StyleSheet.create({
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  active: {
    display: 'flex',
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactive: {
    display: 'none',
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  call: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  frame: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 2,
    position: 'relative',
  },
  closeIcon: {
    borderRadius: 8,
  },
  name: {
    fontSize: 28,
    minWidth: '50%',
    color: '#aaaaaa',
    paddingLeft: 16,
    width: '100%',
  },
  overlap: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    paddingBottom: 8,
    paddingTop: 8,
    gap: 32,
  },
});
