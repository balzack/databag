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
    backgroundColor: 'rgb(64,64,64)',
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
    color: '#aaaaaa',
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
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(64,64,64)',
  },
  card: {
    width: '100%',
    height: 48,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    borderBottomWidth: 1,
  }
});
