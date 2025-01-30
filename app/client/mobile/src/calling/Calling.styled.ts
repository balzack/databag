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
  base: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calls: {
    borderRadius: 8,
    overflow: 'hidden',
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
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  frame: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 2,
    position: 'absolute',
  },
  closeIcon: {
    borderRadius: 8,
  },
  circleIcon: {
  },
  flipIcon: {
    transform: [{ rotate: '135deg' }],
  },
  name: {
    fontSize: 28,
    paddingLeft: 16,
    paddingRight: 16,
    width: '100%',
    textAlign: 'center',
  },
  overlap: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
    paddingTop: 8,
    gap: 32,
  },
  box: {
    position: 'absolute',
    top: 0,
    right: 16,
    width: '20%',
    height: '20%',
  },
  full: {
    width: '100%',
    height: '100%',
  },
  card: {
    width: '100%',
    height: 64,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 32,
    paddingRight: 32,
    borderBottomWidth: 1,
  }
});
